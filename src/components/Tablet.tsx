import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import type { Product } from "../types/definitions";
import Alert from "./Alert";
import Button from "./Button";
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

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct(initialFormData);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(initialFormData);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            : Number(value) || 0
          : value,
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Productos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos los productos disponibles
          </p>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => handleOpenModal()} variant="primary">
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
                    : products.map(({id, name, price, stock, imageUrl}) => (
                        <tr key={id}>
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
                                onClick={() => handleOpenModal({id, name, price, stock, imageUrl})}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete({id, name, price, stock, imageUrl})}
                              >
                                Eliminar
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
            <div className="group relative z-0 transition-all">
              <input
                type="text"
                name="name"
                id="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
              >
                Nombre del producto
              </label>
            </div>
            <div className="group relative z-0 transition-all">
              <input
                type="number"
                name="price"
                id="price"
                value={currentProduct.price}
                onChange={handleInputChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
                placeholder=" "
                required
                min="0"
                step="0.01"
              />
              <label
                htmlFor="price"
                className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
              >
                Precio ($)
              </label>
            </div>
            <div className="group relative z-0 transition-all">
              <input
                type="number"
                name="stock"
                id="stock"
                value={currentProduct.stock}
                onChange={handleInputChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
                placeholder=" "
                required
                min="0"
              />
              <label
                htmlFor="stock"
                className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
              >
                Cantidad en stock
              </label>
            </div>
            <div className="group relative z-0 transition-all">
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                value={currentProduct.imageUrl}
                onChange={handleInputChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="imageUrl"
                className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600"
              >
                URL de la imagen
              </label>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isEditing ? "Guardar cambios" : "Crear producto"}
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
