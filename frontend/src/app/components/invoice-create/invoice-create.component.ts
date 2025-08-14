import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
})
export class InvoiceCreateComponent implements OnInit {
  form = this.fb.group({
    invoiceNumber: ['', Validators.required],
    date: [new Date(), Validators.required],
    dueDate: [null],
    customerName: ['', Validators.required],
    customerAddress: ['', Validators.required],
    //taxType: ['intra'],
    items: this.fb.array([]),
  });

  mode: 'create' | 'edit' = 'create';
  id?: number;
  constructor(
    private fb: FormBuilder,
    private srv: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}
  ngOnInit() {
    this.addItem();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.id = +id;
      this.srv.get(this.id).subscribe((inv: any) => {
        this.form.patchValue({
          invoiceNumber: inv.invoiceNumber,
          date: new Date(inv.date),
          dueDate: null,
          customerName: inv.customerName,
          customerAddress: inv.customerAddress || '',
        });
        this.items().clear();
        (inv.items || []).forEach((it: any) =>
          this.addItem(it.description, it.quantity, it.unitPrice, it.gstRate)
        );
      });
    }
  }
  items(): FormArray {
    return this.form.get('items') as FormArray;
  }
  newItem(d = '', q = 1, p = 0, g = 18) {
    return this.fb.group({
      description: [d, Validators.required],
      quantity: [q, [Validators.required, Validators.min(1)]],
      unitPrice: [p, [Validators.required, Validators.min(0)]],
      gstRate: [g, [Validators.required, Validators.min(0)]],
    });
  }
  addItem(d = '', q = 1, p = 0, g = 18) {
    this.items().push(this.newItem(d, q, p, g));
  }
  removeItem(i: number) {
    if (this.items().length > 1) this.items().removeAt(i);
  }
  get totals() {
    let subtotal = 0,
      gst = 0;
    for (const it of this.items().value) {
      const line = it.quantity * it.unitPrice;
      const gamt = (line * (it.gstRate || 0)) / 100;
      subtotal += line;
      gst += gamt;
    }
    return { subtotal, gst, total: subtotal + gst };
  }
  submit() {
    /* if (this.form.invalid) {
      this.snack.open('Please fill all required fields', 'OK', {
        duration: 2000,
      });
      return;
    } */

    const formValue = this.form.value;

    const payload = {
      invoiceNumber: formValue.invoiceNumber,
      date: this.formatDate(formValue.date)!,
      dueDate: formValue.dueDate
        ? this.formatDate(formValue.dueDate)
        : undefined,
      customerName: formValue.customerName,
      customerAddress: formValue.customerAddress,
      //taxType: formValue.taxType || undefined,
      items: formValue.items?.map((it: any) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        gstRate: it.gstRate,
      })),
    };

    const request$ =
      this.mode === 'create'
        ? this.srv.create(payload)
        : this.srv.update(this.id!, payload);

    request$.subscribe({
      next: () => {
        this.snack.open('Invoice saved successfully', 'OK', { duration: 1200 });
        this.router.navigate(['/invoices']);
      },
      error: (err) => {
        console.error('Save failed:', err.error || err);
        this.snack.open(err.error?.message || 'Save failed', 'OK', {
          duration: 2000,
        });
      },
    });
  }

  private formatDate(date: Date | string | null | undefined): string | null {
    if (!date) return null;
    return new Date(date).toISOString();
  }

  /* submit() {
    if (this.form.invalid) return;
    const payload = this.form.value;
    const obs =
      this.mode === 'create'
        ? this.srv.create(payload)
        : this.srv.update(this.id!, payload);
    obs.subscribe({
      next: () => {
        this.snack.open('Saved', 'OK', { duration: 1200 });
        this.router.navigate(['/invoices']);
      },
      error: () => this.snack.open('Save failed', 'OK', { duration: 2000 }),
    });
  } */
}
