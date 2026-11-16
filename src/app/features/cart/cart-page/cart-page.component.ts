import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

/** Cart page: line items, quantity controls, totals, empty state. */
@Component({
  selector: 'app-cart-page',
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private readonly cartService = inject(CartService);

  readonly items$ = this.cartService.items$;
  readonly total$ = this.cartService.total$;
  readonly itemCount$ = this.cartService.itemCount$;

  increaseQuantity(productId: number, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
