import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './ui/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private toast: ToastService
  ) {}

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.toast.info('Logged out', 2000);
    this.router.navigate(['/']);
  }
}
