import { useState } from 'react';
import { toast } from 'sonner';
import { SaleService } from '../services/saleService';
import type { Product } from '../types/definitions';

interface SaleItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export const useCreateSale = () => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = (product: Product, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.productId === product.id);
      const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      if (totalQuantity > product.stock) {
        toast.error(`No hay suficiente stock de ${product.name}. Stock disponible: ${product.stock}`);
        return currentItems;
      }
      
      if (existingItem) {
        toast.success(`Se actualizó la cantidad de ${product.name}`);
        return currentItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: totalQuantity }
            : item
        );
      }

      toast.success(`${product.name} agregado al carrito`);
      return [...currentItems, {
        productId: product.id,
        product,
        quantity,
        unitPrice: product.price
      }];
    });
  };

  const removeItem = (productId: number) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.productId === productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.name} eliminado del carrito`);
      }
      return currentItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems => {
      const itemToUpdate = currentItems.find(item => item.productId === productId);
      if (itemToUpdate) {
        if (quantity > itemToUpdate.product.stock) {
          toast.error(`No hay suficiente stock de ${itemToUpdate.product.name}. Stock disponible: ${itemToUpdate.product.stock}`);
          return currentItems;
        }
        toast.success(`Cantidad actualizada para ${itemToUpdate.product.name}`);
      }
      return currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const createSale = async () => {
    if (items.length === 0) {
      const errorMsg = 'Debe agregar al menos un producto';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await SaleService.create({
        date: new Date().toISOString().split('T')[0],
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      });

      setItems([]);
      toast.success('Venta registrada exitosamente');
    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : 'Error al registrar la venta';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    createSale,
    getTotal,
  };
};