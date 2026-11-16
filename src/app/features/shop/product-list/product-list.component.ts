import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

/** Loading / data / error state for the product grid. */
interface ShopState {
  loading: boolean;
  products: Product[];
  error: string | null;
}

const ALL_CATEGORIES = 'all';

/**
 * Home page: product grid with live search (debounced 300ms) and a
 * category filter. Everything is driven by RxJS streams + async pipe —
 * no manual subscriptions to clean up.
 */
@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, NgFor, NgIf, ReactiveFormsModule, ProductCardComponent, SpinnerComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);

  /** Search box control — its valueChanges stream is debounced below. */
  readonly searchControl = new FormControl('', { nonNullable: true });

  /** Category dropdown control. */
  readonly categoryControl = new FormControl(ALL_CATEGORIES, { nonNullable: true });

  readonly categories$: Observable<string[]> = this.productService.getCategories();

  private readonly searchTerm$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    map((term) => term.trim().toLowerCase()),
  );

  private readonly selectedCategory$ = this.categoryControl.valueChanges.pipe(
    startWith(ALL_CATEGORIES),
  );

  private readonly productsState$: Observable<ShopState> = this.productService
    .getProducts()
    .pipe(
      map((products) => ({ loading: false, products, error: null as string | null })),
      catchError(() =>
        of({
          loading: false,
          products: [] as Product[],
          error: 'Could not load products. Please check your connection and try again.',
        }),
      ),
      startWith({ loading: true, products: [] as Product[], error: null as string | null }),
    );

  /** Filtered view-model: loading/error flags plus the visible products. */
  readonly viewModel$ = combineLatest([
    this.productsState$,
    this.searchTerm$,
    this.selectedCategory$,
  ]).pipe(
    map(([state, term, category]) => ({
      ...state,
      products: state.products.filter(
        (product) =>
          (category === ALL_CATEGORIES || product.category === category) &&
          (term === '' ||
            product.title.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)),
      ),
    })),
  );
}
