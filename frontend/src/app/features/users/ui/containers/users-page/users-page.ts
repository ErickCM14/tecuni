import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersFacade } from '../../../application/users.facade';
import { User } from '../../../domain/users.model';
import { DataTable } from '../../../../../shared/components/data-table/data-table';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';

type UserRow = User & { fullName?: string };

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTable],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage implements OnInit {
  private notification = inject(NotificationAlert);
  private facade = inject(UsersFacade);
  private router = inject(Router);

  data$ = new BehaviorSubject<UserRow[]>([]);
  total = 0;

  page = 1;
  pageSize = 10;
  offset = 0;
  sort = '';
  order = '';

  displayedColumns = ['fullName', 'email', 'phone', 'active'];
  headers = { fullName: 'Nombre', email: 'Correo', phone: 'Teléfono', active: 'Activo' };

  ngOnInit(): void {
    this.load(this.page, this.pageSize);
  }

  // Se puede optimitzar para no repetir en todos los componentes
  load = (page = 1, pageSize = 1) => {
    const offset = (page - 1) * pageSize;

    this.facade.loadAll(page, pageSize, offset, this.sort, this.order).subscribe({
      next: (res: any) => {
        const items = res.items || [];
        const rows: UserRow[] = items.map((u: any) => ({
          ...u,
          fullName: `${u.name ?? ''} ${u.lastname ?? ''}`.trim()
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

  deleteUser(id: string): void {
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
}