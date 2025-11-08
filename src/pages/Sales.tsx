import { useState } from "react";
import Button from "../components/Button";
import { SaleDetailsModal } from "../components/SaleDetailsModal";
import { TableRowSkeleton } from "../components/TableSkeleton";
import { useSales } from "../hooks/useSales";
import type { Sale } from "../types/definitions";

export const Sales = () => {
  const {
    sales,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    fetchReport,
  } = useSales();
  
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedSale(null);
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Reporte de Ventas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Reporte detallado de ventas por período
          </p>
          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
        <div className="group relative z-0 transition-all flex-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            max={new Date().toISOString().split('T')[0]}
          />
          <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600">
            Fecha inicio
          </label>
        </div>

        <div className="group relative z-0 transition-all flex-1">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            max={new Date().toISOString().split('T')[0]}
          />
          <label className="absolute top-3 -z-10 origin-left -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-indigo-600">
            Fecha fin
          </label>
        </div>
        <Button onClick={fetchReport} variant="primary" styles="gap-2">
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
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 15v4h16a2 2 0 0 0 0-4H5" />
          </svg>
          Generar Reporte
        </Button>
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
                      Fecha
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Productos
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))
                  ) : sales.length > 0 ? (
                    sales.map((sale: Sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {sale.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {new Date(sale.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-medium">
                          ${sale.total.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {sale.items.length} items
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenDetails(sale)}
                          >
                            Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-4 text-sm text-gray-500 text-center"
                      >
                        No hay ventas registradas en el rango seleccionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};