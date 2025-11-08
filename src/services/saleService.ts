import { API_URL } from '../utils/apiUrl';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface CreateSaleItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleRequest {
  date: string;
  items: CreateSaleItem[];
}

export const SaleService = {
  create: async (sale: CreateSaleRequest) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/Sales`, {
        method: 'POST',
        body: JSON.stringify(sale),
      });
      if (!response.ok) throw new Error('Error al registrar la venta');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getReport: async (start: string, end: string) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/sales/report?start=${start}&end=${end}`
      );
      if (!response.ok) throw new Error('Error al obtener el reporte');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};