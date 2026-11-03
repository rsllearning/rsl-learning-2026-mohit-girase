export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  status: ProductStatus;
  stockCount: number;
  imageUrl: string;
  description: string;
}
