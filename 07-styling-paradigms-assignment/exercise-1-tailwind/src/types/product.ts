export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  status: ProductStatus;
  stockCount: number;
  imageUrl: string;
  specs: string;
  description: string;
}
