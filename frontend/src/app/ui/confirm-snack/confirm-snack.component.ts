import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snack',
  template: `
    <div class="confirm-snack">
      <div class="message">{{ data.message }}</div>
      <div class="actions">
        <button class="yes" (click)="onYes()">Yes</button>
        <button class="no" (click)="onNo()">No</button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-snack {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        color: #fff;
        min-width: 320px;
        max-width: 520px;
        background: rgba(20, 20, 30, 0.9);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      }
      .confirm-snack .message {
        flex: 1;
        font-weight: 600;
      }
      .confirm-snack .actions {
        display: flex;
        gap: 8px;
      }
      .confirm-snack .yes {
        background: linear-gradient(90deg, #e53935, #d32f2f);
        border: none;
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
      }
      .confirm-snack .no {
        background: linear-gradient(90deg, #2e86c1, #1f6fa8);
        border: none;
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
      }
    `,
  ],
})
export class ConfirmSnackComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private ref: MatSnackBarRef<ConfirmSnackComponent>
  ) {}

  onYes() {
    this.ref.dismissWithAction();
  }

  onNo() {
    this.ref.dismiss();
  }
}
