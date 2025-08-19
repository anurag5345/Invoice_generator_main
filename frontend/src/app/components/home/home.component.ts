import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalInvoices: number | null = null;
  totalDue: number | null = null;
  customerCount: number | null = null;

  constructor(private srv: InvoiceService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.srv.list().subscribe(
      (res: any) => {
        const arr = (res as any[]) || [];
        this.totalInvoices = arr.length;
        const customers = new Set(arr.map((r) => r.customerName));
        this.customerCount = customers.size;
        const unpaid = arr.filter((r: any) =>
          r.status ? r.status !== 'paid' : !r.paid
        );
        this.totalDue = unpaid.reduce(
          (acc, r) => acc + (Number(r.totalWithGST) || 0),
          0
        );
      },
      () => {
        this.totalInvoices = 0;
        this.customerCount = 0;
        this.totalDue = 0;
      }
    );
  }
}
