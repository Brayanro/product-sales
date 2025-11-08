import { useState } from 'react';
import type { Sale } from '../types/definitions';
import { API_URL } from '../utils/apiUrl';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Por favor selecciona ambas fechas.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/sales/report?start=${startDate}&end=${endDate}`
      );
      if (!response.ok) throw new Error('Error al obtener el reporte');
      const data: Sale[] = await response.json();
      setSales(data);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  return {
    sales,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    fetchReport,
  };
};