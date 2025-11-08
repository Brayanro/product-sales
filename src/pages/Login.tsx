import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Button from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { validateField, VALIDATION_RULES } from "../utils/validation";

interface LoginFormData {
  email: string;
  password: string;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

export const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [showValidation, setShowValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    const newErrors: Record<string, string> = {};
    
    const emailValidation = validateField(formData.email, VALIDATION_RULES.email, 'El correo electrónico');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errorMessage!;
    }
    
    const passwordValidation = validateField(formData.password, VALIDATION_RULES.password, 'La contraseña');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errorMessage!;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              name="email"
              id="email"
              label="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              showError={showValidation}
              required
            />

            <Input
              type="password"
              name="password"
              id="password"
              label="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              showError={showValidation}
              required
              minLength={6}
            />
          </div>

          <div>
            <Button type="submit" variant="primary" styles="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};