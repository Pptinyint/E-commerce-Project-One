import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

/** Site header with navigation and a live cart badge. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  /** Total units in the cart, rendered with the async pipe. */
  readonly itemCount$ = this.cartService.itemCount$;
}
