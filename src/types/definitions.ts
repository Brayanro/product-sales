export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: number;
  date: string;
  total: number;
  items: SaleItem[];
}