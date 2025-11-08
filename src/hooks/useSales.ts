import { useState } from 'react';
import { toast } from 'sonner';
import { SaleService } from '../services/saleService';
import type { Sale } from '../types/definitions';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      const errorMsg = 'Por favor selecciona ambas fechas.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await SaleService.getReport(startDate, endDate);
      setSales(data);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : 'Error al cargar las ventas';
      setError(errorMsg);
      toast.error(errorMsg);
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