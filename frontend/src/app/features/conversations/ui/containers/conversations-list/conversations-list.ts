import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ConversationsFacade } from '../../../application/conversations.facade';
import { Conversation } from '../../../domain/conversations.model';
import { DataTable } from '../../../../../shared/components/data-table/data-table';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';

type ConversationRow = Conversation & { fullName?: string };

@Component({
  selector: 'app-conversations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTable],
  templateUrl: './conversations-list.html',
  styleUrl: './conversations-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsList implements OnInit {
  private notification = inject(NotificationAlert);
  private facade = inject(ConversationsFacade);
  private router = inject(Router);

  data$ = new BehaviorSubject<ConversationRow[]>([]);
  total = 0;

  page = 1;
  pageSize = 10;
  offset = 0;
  sort = '';
  order = '';

  displayedColumns = ['name', 'phone'];
  headers = { name: 'Nombre', phone: 'Teléfono' };

  ngOnInit(): void {
    this.load(this.page, this.pageSize);
  }

  // Se puede optimitzar para no repetir en todos los componentes
  load = (page = 1, pageSize = 1) => {
    const offset = (page - 1) * pageSize;

    this.facade.loadAll(page, pageSize, offset, this.sort, this.order, 'name,phone').subscribe({
      next: (res: any) => {
        const items = res.items || [];
        console.log(items);
        
        const rows: ConversationRow[] = items.map((u: any) => ({
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
}