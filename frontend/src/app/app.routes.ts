import { Routes } from '@angular/router';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent }
];
