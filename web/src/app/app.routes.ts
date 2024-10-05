import { Routes } from '@angular/router';
import {
  ProductRegistrationComponent,
} from './pages/product-registration/product-registration.component';
import { ProductsComponent } from './pages/products/products.component';

export const routes: Routes = [
  {
    path: 'produto',
    component: ProductsComponent,
  },
  {
    path: 'produto/cadastro',
    component: ProductRegistrationComponent,
  },
  {
    path: '',
    redirectTo: 'produto',
    pathMatch: 'full',
  }
];
