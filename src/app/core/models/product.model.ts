/**
 * Product returned by the Fake Store API (https://fakestoreapi.com/products).
 * Kept in sync with the API response shape so the service stays fully typed.
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface ProductRating {
  rate: number;
  count: number;
}
