import type { Product } from '../types/definitions';

const API_URL = 'https://localhost:7207/api/Products';

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error getting products');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error getting product by ID');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Error to creating product');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  update: async (id: number, product: Product): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Error to updating product');
      return response.status === 204 ? product : response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error to deleting product');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};