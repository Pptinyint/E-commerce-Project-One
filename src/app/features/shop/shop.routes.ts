import { Routes } from '@angular/router';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';

/** Lazy-loaded shop routes (loaded from app.routes via loadChildren). */
export const shopRoutes: Routes = [
  { path: '', component: ProductListComponent, title: 'ShopKart — Shop' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'ShopKart — Product' },
];
