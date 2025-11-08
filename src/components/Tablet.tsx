import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import type { Product } from "../types/definitions";
import { validateField, VALIDATION_RULES } from "../utils/validation";
import Alert from "./Alert";
import Button from "./Button";
import { Input } from "./Input";
import Modal from "./Modal";
import { TableRowSkeleton } from "./TableSkeleton";

interface ProductFormData extends Omit<Product, "id"> {
  id?: number;
}

const initialFormData: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  imageUrl: "",
};

const Table = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] =
    useState<ProductFormData>(initialFormData);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(initialFormData);
    setIsEditing(false);
    setShowValidation(false);
    setErrors({});
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct(initialFormData);
      setIsEditing(false);
    }
    setShowValidation(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);
    
    const newErrors: Record<string, string> = {};
    
    const nameValidation = validateField(currentProduct.name, VALIDATION_RULES.productName, 'El nombre');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errorMessage!;
    }
    
    const priceValidation = validateField(currentProduct.price, VALIDATION_RULES.price, 'El precio');
    if (!priceValidation.isValid) {
      newErrors.price = priceValidation.errorMessage!;
    }
    
    const stockValidation = validateField(currentProduct.stock, VALIDATION_RULES.stock, 'El stock');
    if (!stockValidation.isValid) {
      newErrors.stock = stockValidation.errorMessage!;
    }
    
    const imageUrlValidation = validateField(currentProduct.imageUrl, VALIDATION_RULES.imageUrl, 'La URL de la imagen');
    if (!imageUrlValidation.isValid) {
      newErrors.imageUrl = imageUrlValidation.errorMessage!;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (isEditing && currentProduct.id) {
        await updateProduct(currentProduct.id, currentProduct as Product);
      } else {
        await createProduct(currentProduct);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setProductToDelete(null);
        setIsAlertOpen(false);
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? 0
            : Math.max(0, Number(value))
          : value,
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <p className="mt-2 text-lg text-gray-700">
            Lista de todos los productos disponibles
          </p>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() => handleOpenModal()}
            variant="primary"
            styles="gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
            Crear Producto
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Precio
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Imagen
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <TableRowSkeleton key={index} />
                      ))
                    : products.map(({ id, name, price, stock, imageUrl }) => (
                        <tr key={id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${price.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {stock}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <img
                              src={imageUrl}
                              alt={name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  handleOpenModal({
                                    id,
                                    name,
                                    price,
                                    stock,
                                    imageUrl,
                                  })
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                  <path d="M16 5l3 3" />
                                </svg>
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete({
                                    id,
                                    name,
                                    price,
                                    stock,
                                    imageUrl,
                                  })
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M4 7l16 0" />
                                  <path d="M10 11l0 6" />
                                  <path d="M14 11l0 6" />
                                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                </svg>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? "Editar Producto" : "Crear Producto"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              name="name"
              id="name"
              label="Nombre del producto"
              value={currentProduct.name}
              onChange={handleInputChange}
              error={errors.name}
              showError={showValidation}
              required
              minLength={3}
              maxLength={50}
            />
            
            <Input
              type="number"
              name="price"
              id="price"
              label="Precio ($)"
              value={currentProduct.price || ''}
              onChange={handleInputChange}
              error={errors.price}
              showError={showValidation}
              required
              min={1}
              step={1}
            />
            
            <Input
              type="number"
              name="stock"
              id="stock"
              label="Cantidad en stock"
              value={currentProduct.stock || ''}
              onChange={handleInputChange}
              error={errors.stock}
              showError={showValidation}
              required
              min={1}
              step={1}
            />
            
            <Input
              type="url"
              name="imageUrl"
              id="imageUrl"
              label="URL de la imagen"
              value={currentProduct.imageUrl}
              onChange={handleInputChange}
              error={errors.imageUrl}
              showError={showValidation}
              required
              pattern="https?://.+"
              title="Debe ser una URL válida comenzando con http:// o https://"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? "Editar producto" : "Crear producto"}
            </button>
          </div>
        </form>
      </Modal>
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Está seguro que desea eliminar este producto? Esta acción no se puede deshacer."
        item={
          productToDelete
            ? { id: productToDelete.id, name: productToDelete.name }
            : undefined
        }
      />
    </div>
  );
};

export default Table;
