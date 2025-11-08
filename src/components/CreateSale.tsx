import { useState } from "react";
import { useCreateSale } from "../hooks/useCreateSale";
import { useProduct } from "../hooks/useProduct";
import Button from "./Button";

interface AddProductFormData {
  productId: number;
  quantity: number;
}

const initialFormData: AddProductFormData = {
  productId: 0,
  quantity: 1,
};

export const CreateSale = () => {
  const { products } = useProduct();
  const {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    createSale,
    getTotal,
  } = useCreateSale();
  const [formData, setFormData] = useState<AddProductFormData>(initialFormData);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      return;
    }

    const product = products.find((p) => p.id === formData.productId);
    if (!product) return;

    addItem(product, formData.quantity);
    setFormData(initialFormData);
    setShowValidation(false);
  };

  const handleCreateSale = async () => {
    await createSale();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Registrar Venta
          </h1>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-4 items-end">
        <div className="group relative z-0 transition-all flex-1">
          <select
            value={formData.productId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                productId: Number(e.target.value),
              }))
            }
            className={`peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0 ${
              showValidation ? "invalid:border-red-600" : ""
            }`}
            required
          >
            <option value="">Seleccione un producto</option>
            {products.map(({ id, name, price, stock }) => (
              <option key={id} value={id}>
                {name} - ${price} - Stock: {stock}
              </option>
            ))}
          </select>
          <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600">
            Producto
          </label>
        </div>

        <div className="group relative z-0 transition-all w-32">
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quantity: Number(e.target.value),
              }))
            }
            className={`peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0 ${
              showValidation ? "invalid:border-red-600" : ""
            }`}
            placeholder=" "
            required
            min="1"
          />
          <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600">
            Cantidad
          </label>
        </div>

        <Button type="submit" variant="secondary">
          Agregar
        </Button>
      </form>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Producto
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Cantidad
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Precio Unitario
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Subtotal
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="ml-4">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          min="1"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${(item.quantity * item.unitPrice).toFixed(2)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {items.length > 0 && (
                    <tr className="bg-gray-50">
                      <td
                        colSpan={3}
                        className="px-3 py-4 text-sm font-medium text-gray-900 text-right"
                      >
                        Total:
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        ${getTotal().toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  )}
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-sm text-gray-500 text-center"
                      >
                        No hay productos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          onClick={handleCreateSale}
          disabled={items.length === 0 || loading}
        >
          {loading ? "Registrando..." : "Registrar Venta"}
        </Button>
      </div>
    </div>
  );
};
