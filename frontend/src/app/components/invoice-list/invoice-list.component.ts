import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  loading = false;
  constructor(
    private srv: InvoiceService,
    private router: Router,
    private snack: MatSnackBar
  ) {}
  ngOnInit() {
    this.fetch();
  }
  fetch() {
    this.loading = true;
    this.srv
      .list()
      .subscribe({
        next: (res: any) => (this.invoices = res || []),
        error: () => this.snack.open('Load failed', 'OK', { duration: 2000 }),
        complete: () => (this.loading = false),
      });
  }
  view(id: number) {
    this.router.navigate(['/invoices', id]);
  }
  edit(id: number) {
    this.router.navigate(['/invoices', id, 'edit']);
  }
  delete(id: number) {
    if (!confirm('Delete?')) return;
    this.srv
      .delete(id)
      .subscribe({
        next: () => this.fetch(),
        error: () => this.snack.open('Delete failed', 'OK', { duration: 2000 }),
      });
  }
}
