import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  name = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth
      .register({ email: this.email, password: this.password, name: this.name })
      .subscribe({
        next: () => {
          window.alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
          window.alert(this.error);
        },
      });
  }
}
