import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BigSnackComponent } from './big-snack/big-snack.component';
import { ConfirmSnackComponent } from './confirm-snack/confirm-snack.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snack: MatSnackBar) {}

  success(message: string, duration = 3000) {
    this.snack.openFromComponent(BigSnackComponent, {
      data: { message, type: 'success' },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  error(message: string, duration = 4000) {
    this.snack.openFromComponent(BigSnackComponent, {
      data: { message, type: 'error' },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  info(message: string, duration = 3000) {
    this.snack.openFromComponent(BigSnackComponent, {
      data: { message, type: 'info' },
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  confirm(message: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const ref = this.snack.openFromComponent(ConfirmSnackComponent, {
        data: { message },
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        duration: undefined,
      });

      const sub = ref.onAction().subscribe(() => {
        observer.next(true);
        observer.complete();
      });

      ref.afterDismissed().subscribe((info) => {
        if (!info.dismissedByAction) {
          observer.next(false);
          observer.complete();
        }
        sub.unsubscribe();
      });
    });
  }
}
