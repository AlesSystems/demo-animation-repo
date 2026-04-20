export type ProductCategory = 'cameras' | 'access-points' | 'laptops';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  brand: string;
}

export interface ProductFilter {
  category?: ProductCategory;
  brand?: string;
  search?: string;
  sortBy?: 'name' | 'brand' | 'category';
}
