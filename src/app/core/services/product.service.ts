import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, shareReplay, throwError } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Talks to the public Fake Store API (https://fakestoreapi.com).
 * The product list is fetched once and shared between subscribers via
 * shareReplay, so navigating between list/detail never refetches it.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://fakestoreapi.com/products';
  private readonly http = inject(HttpClient);

  private readonly productsCache$: Observable<Product[]> = this.http
    .get<Product[]>(this.apiUrl)
    .pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError(() =>
        throwError(() => new Error('Could not load products. Please try again later.')),
      ),
    );

  /** All products, cached after the first successful request. */
  getProducts(): Observable<Product[]> {
    return this.productsCache$;
  }

  /** A single product by id (used by the detail page). */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() =>
        throwError(() => new Error(`Could not load product #${id}.`)),
      ),
    );
  }

  /** Category names for the filter dropdown. Falls back to an empty list. */
  getCategories(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}/categories`)
      .pipe(catchError(() => of([])));
  }
}
