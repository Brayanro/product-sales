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

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
