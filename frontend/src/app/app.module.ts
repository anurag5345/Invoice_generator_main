import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { MaterialModule } from './material.module';

import { LoginComponent } from './feature/login/login.component';
import { RegisterComponent } from './feature/register/register.component';
import { InvoiceListComponent } from './feature/invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from './feature/invoice-create/invoice-create.component';
import { InvoiceViewComponent } from './feature/invoice-view/invoice-view.component';
import { BigSnackComponent } from './shared/ui/big-snack/big-snack.component';
import { ConfirmSnackComponent } from './shared/ui/confirm-snack/confirm-snack.component';
import { NotFoundComponent } from './feature/not-found/not-found.component';

import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './feature/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    InvoiceListComponent,
    InvoiceCreateComponent,
    InvoiceViewComponent,
    BigSnackComponent,
    ConfirmSnackComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
