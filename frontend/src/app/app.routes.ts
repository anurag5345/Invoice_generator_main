import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './components/invoice-create/invoice-create.component';
import { InvoiceViewComponent } from './components/invoice-view/invoice-view.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'invoices',
    component: InvoiceListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/new',
    component: InvoiceCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/:id',
    component: InvoiceViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/:id/edit',
    component: InvoiceCreateComponent,
    canActivate: [AuthGuard],
  },
];
