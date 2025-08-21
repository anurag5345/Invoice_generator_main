import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  loading = false;
  searchText = '';
  statusFilter: 'all' | 'paid' | 'unpaid' = 'all';
  constructor(
    private srv: InvoiceService,
    private router: Router,
    private snack: MatSnackBar,
    private toast: ToastService
  ) {}
  ngOnInit() {
    this.fetch();
  }

  get filteredInvoices() {
    const q = (this.searchText || '').trim().toLowerCase();
    let list = this.invoices.slice();
    if (this.statusFilter === 'paid') {
      list = list.filter((i) => (i.status ? i.status === 'paid' : !!i.paid));
    } else if (this.statusFilter === 'unpaid') {
      list = list.filter((i) => (i.status ? i.status === 'unpaid' : !i.paid));
    }

    if (!q) return list;
    return list.filter((inv) =>
      String(inv.customerName || '')
        .toLowerCase()
        .includes(q)
    );
  }
  fetch() {
    this.loading = true;
    this.srv.list().subscribe({
      next: (res: any) => (this.invoices = res || []),
      error: () => {},
      complete: () => (this.loading = false),
    });
  }
  view(id: number) {
    this.router.navigate(['/invoices', id]);
  }
  edit(id: number) {
    this.router.navigate(['/invoices', id, 'edit']);
  }

  toggleStatus(inv: any) {
    const id = inv.id;
    const current = inv.status || (inv.paid ? 'paid' : 'unpaid');

    if (current === 'paid') {
      this.toast.info('Invoice already paid');
      return;
    }

    const newStatus = 'paid';
    this.srv.update(id, { status: newStatus }).subscribe({
      next: () => {
        this.toast.success(`Marked as ${newStatus}`, 1500);
        this.fetch();
      },
      error: () => {},
    });
  }
  delete(id: number) {
    this.toast.confirm('Delete invoice?').subscribe((ok) => {
      if (!ok) return;
      this.srv.delete(id).subscribe({
        next: () => {
          this.toast.success('Invoice deleted', 1800);
          this.fetch();
        },
        error: () => {},
      });
    });
  }

  togglePaid(inv: any) {
    const id = inv.id;
    if (inv.paid) {
      this.toast.info('Invoice already paid');
      return;
    }

    this.srv.update(id, { paid: true }).subscribe({
      next: () => {
        this.toast.success('Marked as paid', 1500);
        this.fetch();
      },
      error: () => {},
    });
  }
}
