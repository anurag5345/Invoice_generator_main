import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private api = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get(this.api);
  }

  get(id: number) {
    return this.http.get(`${this.api}/${id}`);
  }

  create(payload: any) {
    return this.http.post(this.api, payload);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.api}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
