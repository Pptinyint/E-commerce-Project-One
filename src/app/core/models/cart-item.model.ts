import { Product } from './product.model';

/** One line in the shopping cart: a product plus the chosen quantity. */
export interface CartItem {
  product: Product;
  quantity: number;
}
