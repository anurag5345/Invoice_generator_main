import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  private tokenKey = 'ims_token';

  constructor(private http: HttpClient) {}

  register(payload: any) {
    return this.http.post(`${this.api}/register`, payload);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res?.token) {
            this.saveToken(res.token);
          }
        })
      );
  }

  private saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
