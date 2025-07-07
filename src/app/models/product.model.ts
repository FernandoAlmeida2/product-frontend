export interface Product {
  idProduct: string;
  name: string;
  category: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductStats {
  totalProducts: number;
  averagePrice: number;
  totalValue: number;
  categoryDistribution: CategoryDistribution[];
}

export interface CategoryDistribution {
  category: string;
  count: number;
}

export type ProductFormData = Omit<Product, 'id' | 'created' | 'updated'>;

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Automotive',
  'Health & Beauty'
];
