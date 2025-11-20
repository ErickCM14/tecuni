import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationAlert {
  constructor(private snackBar: MatSnackBar) { }

  private defaultConfig: MatSnackBarConfig = {
    duration: 7000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  success(message: string) {
    this.snackBar.open(message, '✅', {
      ...this.defaultConfig,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string) {
    this.snackBar.open(message, '❌', {
      ...this.defaultConfig,
      panelClass: ['snackbar-error']
    });
  }

  info(message: string) {
    this.snackBar.open(message, 'ℹ️', {
      ...this.defaultConfig,
      panelClass: ['snackbar-info']
    });
  }

  warning(message: string) {
    this.snackBar.open(message, '⚠️', {
      ...this.defaultConfig,
      panelClass: ['snackbar-warning']
    });
  }
}
