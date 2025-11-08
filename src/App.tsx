import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import { CreateSalePage } from "./pages/CreateSale";
import { Login } from "./pages/Login";
import { Products } from "./pages/Products";
import { Register } from "./pages/Register";
import { Sales } from "./pages/Sales";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Toaster richColors closeButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster richColors closeButton />
      <Navbar />
      <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/create" element={<CreateSalePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </section>
    </main>
  );
}

export default App;
