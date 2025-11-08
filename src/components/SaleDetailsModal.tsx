import type { Sale } from '../types/definitions';
import Modal from './Modal';

interface SaleDetailsModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SaleDetailsModal = ({ sale, isOpen, onClose }: SaleDetailsModalProps) => {
  if (!sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles de la venta #${sale.id}`}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Fecha: {new Date(sale.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Total: ${sale.total.toFixed(2)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Productos</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {sale.items.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="shrink-0 text-sm text-gray-500 text-right">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};