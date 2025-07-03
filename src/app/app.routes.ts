import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/products/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'products/new',
    loadComponent: () => import('./features/products/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./features/products/product-form/product-form.component')
      .then(m => m.ProductFormComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
