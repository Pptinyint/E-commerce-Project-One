import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

/**
 * Single source of truth for the shopping cart.
 *
 * State lives in a BehaviorSubject so every component (header badge, cart
 * page, checkout summary) sees the same data through async pipes.
 * The cart is persisted to localStorage on every change and restored on
 * startup, so a page refresh does not empty it.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'shopkart-cart-v1';

  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  /** Total number of units in the cart (for the header badge). */
  readonly itemCount$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
  );

  /** Total price of everything in the cart. */
  readonly total$: Observable<number> = this.items$.pipe(
    map((items) =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    ),
  );

  /** Synchronous snapshot, handy for guards/checkout. */
  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get isEmpty(): boolean {
    return this.itemsSubject.value.length === 0;
  }

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 99);
    } else {
      items.push({ product, quantity: Math.max(1, quantity) });
    }
    this.update(items);
  }

  removeFromCart(productId: number): void {
    this.update(this.itemsSubject.value.filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const items = this.itemsSubject.value.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.min(quantity, 99) }
        : item,
    );
    this.update(items);
  }

  clearCart(): void {
    this.update([]);
  }

  private update(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      // Validate the shape instead of trusting stored JSON blindly.
      return parsed.filter(
        (entry): entry is CartItem =>
          typeof entry === 'object' &&
          entry !== null &&
          'product' in entry &&
          'quantity' in entry &&
          typeof (entry as CartItem).quantity === 'number',
      );
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Storage full / unavailable (private mode) — cart still works in memory.
    }
  }
}
