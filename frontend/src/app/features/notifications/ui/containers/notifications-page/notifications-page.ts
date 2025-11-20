import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NotificationsFacade } from '../../../application/notifications.facade';
import { Router, RouterModule } from '@angular/router';
import { DataTable } from '../../../../../shared/components/data-table/data-table';
import { Notifications } from '../../../domain/notifications.model';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';

type NotificationRow = Notifications;

@Component({
  selector: 'app-notifications-page',
  imports: [CommonModule, RouterModule, DataTable],
  templateUrl: './notifications-page.html',
  styleUrl: './notifications-page.css'
})
export class NotificationsPage {
  private facade = inject(NotificationsFacade);
  private router = inject(Router);
  private notification = inject(NotificationAlert);

  data$ = new BehaviorSubject<NotificationRow[]>([]);
  total = 0;

  page = 1;
  pageSize = 10;
  offset = 0;
  sort = '';
  order = '';

  displayedColumns = ['title', 'body'];
  headers = { title: 'Titulo', body: 'Mensaje' };

  ngOnInit(): void {
    this.load(this.page, this.pageSize);
  }

  // Se puede optimitzar para no repetir en todos los componentes
  load = (page = 1, pageSize = 1) => {
    const offset = (page - 1) * pageSize;

    this.facade.loadAll(page, pageSize, offset, this.sort, this.order).subscribe({
      next: (res: any) => {
        const items = res.items || [];
        const rows: NotificationRow[] = items.map((u: any) => ({
          ...u,
        }));

        this.data$.next(rows);
        this.total = res.pagination.totalItems;
        this.page = res.pagination.page;
        this.pageSize = pageSize;
      },
      error: () => {
        this.data$.next([]);
        this.total = 0;
      }
    });
  };

  delete(id: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.facade.delete(id).subscribe({
      next: () => {
        this.load(this.page, this.pageSize);
        // alert('✅ Usuario eliminado.');
        this.notification.success(`Eliminado con éxito.`);
      },
      error: (err) => {
        // console.error("Error eliminando usuario:", err);
        this.notification.error(`Error eliminando: ${err.error?.message || 'Error desconocido'}`);
      },
      complete: () => {
        console.log("Eliminación completada");
      }
    })
  }

  sendNotification(id: string): void {
    if (!confirm(`¿Estás seguro de que deseas enviar esta notificación?`)) {
      return;
    }
    this.facade.send(id).subscribe({
      next: () => {
        this.notification.success(`Noficicación enviada con éxito.`);
      },
      error: (err) => {
        this.notification.error(`Error enviando notificación: ${err.error?.message || 'Error desconocido'}`);
      },
      complete: () => {
        console.log("Notificación completada");
      }
    })
  }
}