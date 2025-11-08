import { useCallback, useEffect, useState } from 'react';
import { ProductService } from '../services/productService';
import type { Product } from '../types/definitions';

interface UseProductReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProduct = (): UseProductReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      await ProductService.create(product);
      await getProducts();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, product: Product) => {
    try {
      setLoading(true);
      setError(null);
      await ProductService.update(id, product);
      await getProducts();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ProductService.delete(id);
      await getProducts();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products,
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};