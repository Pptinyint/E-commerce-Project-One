import { AsyncPipe, CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

interface DetailState {
  loading: boolean;
  product: Product | null;
  error: string | null;
}

/** Product detail page at /product/:id with quantity picker + add to cart. */
@Component({
  selector: 'app-product-detail',
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, NgIf, ReactiveFormsModule, RouterLink, SpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly quantityControl = new FormControl(1, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(10)],
  });

  readonly state$: Observable<DetailState> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) =>
      this.productService.getProduct(id).pipe(
        map((product) => ({ loading: false, product, error: null as string | null })),
        catchError(() =>
          of({
            loading: false,
            product: null as Product | null,
            error: 'This product could not be found.',
          }),
        ),
      ),
    ),
    startWith({ loading: true, product: null as Product | null, error: null as string | null }),
  );

  decreaseQuantity(): void {
    this.quantityControl.setValue(Math.max(1, this.quantityControl.value - 1));
  }

  increaseQuantity(): void {
    this.quantityControl.setValue(Math.min(10, this.quantityControl.value + 1));
  }

  addToCart(product: Product): void {
    if (this.quantityControl.invalid) {
      this.quantityControl.setValue(1);
    }
    this.cartService.addToCart(product, this.quantityControl.value);
    void this.router.navigate(['/cart']);
  }
}
