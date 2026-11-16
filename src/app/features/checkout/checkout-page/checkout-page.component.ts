import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

/**
 * Checkout page: reactive form (shipping + mock payment) with validation,
 * an order summary, and a success screen with a generated order id.
 * Payment is mocked — no real charge is ever made.
 */
@Component({
  selector: 'app-checkout-page',
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);

  readonly items$ = this.cartService.items$;
  readonly total$ = this.cartService.total$;

  /** Set once the order is placed; drives the success screen. */
  orderId: string | null = null;

  /** True after the first submit attempt, so errors show on touched fields. */
  submitted = false;

  readonly checkoutForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  get fullName() {
    return this.checkoutForm.controls.fullName;
  }
  get email() {
    return this.checkoutForm.controls.email;
  }
  get address() {
    return this.checkoutForm.controls.address;
  }
  get city() {
    return this.checkoutForm.controls.city;
  }
  get zipCode() {
    return this.checkoutForm.controls.zipCode;
  }
  get cardNumber() {
    return this.checkoutForm.controls.cardNumber;
  }
  get expiry() {
    return this.checkoutForm.controls.expiry;
  }
  get cvv() {
    return this.checkoutForm.controls.cvv;
  }

  placeOrder(): void {
    this.submitted = true;

    if (this.checkoutForm.invalid || this.cartService.isEmpty) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.orderId = `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, '0')}`;
    this.cartService.clearCart();
  }
}
