import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        window.alert('Login successful!');
        this.router.navigate(['/invoices']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        window.alert(this.error);
      },
    });
  }
}
