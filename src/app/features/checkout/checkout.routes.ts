import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';

/** Lazy-loaded checkout routes (loaded from app.routes via loadChildren). */
export const checkoutRoutes: Routes = [
  { path: '', component: CheckoutPageComponent, title: 'ShopKart — Checkout' },
];
