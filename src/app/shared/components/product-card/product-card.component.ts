import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

/** Reusable product tile used on the shop list page. */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  private readonly cartService = inject(CartService);

  addToCart(event: MouseEvent): void {
    // The card itself is a link; stop the button click from navigating.
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(this.product(), 1);
  }
}
