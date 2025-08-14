import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
})
export class InvoiceViewComponent implements OnInit {
  invoice: any;
  constructor(
    private srv: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/invoices']);
      return;
    }
    this.srv.get(id).subscribe((inv: any) => (this.invoice = inv));
  }
}
