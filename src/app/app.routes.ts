import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

/**
 * Feature areas are lazy-loaded so the initial bundle only ships the shop.
 * Cart and checkout chunks load on demand when the user navigates there.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/shop/shop.routes').then((m) => m.shopRoutes),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.cartRoutes),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then((m) => m.checkoutRoutes),
  },
  { path: '**', component: NotFoundComponent, title: 'ShopKart — Page not found' },
];
