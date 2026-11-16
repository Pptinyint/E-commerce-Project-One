import { Routes } from '@angular/router';
import { CartPageComponent } from './cart-page/cart-page.component';

/** Lazy-loaded cart routes (loaded from app.routes via loadChildren). */
export const cartRoutes: Routes = [
  { path: '', component: CartPageComponent, title: 'ShopKart — Cart' },
];
