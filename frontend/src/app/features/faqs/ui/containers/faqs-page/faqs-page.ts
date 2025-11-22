import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataTable } from '../../../../../shared/components/data-table/data-table';
import { FaqsFacade } from '../../../application/faqs.facade';
import { Faqs } from '../../../domain/faqs.model';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';

type FaqsRow = Faqs;

@Component({
  selector: 'app-faqs-page',
  imports: [CommonModule, RouterModule, DataTable],
  templateUrl: './faqs-page.html',
  styleUrl: './faqs-page.css'
})
export class FaqsPage {
  private notification = inject(NotificationAlert);
  private facade = inject(FaqsFacade);
  private router = inject(Router);

  data$ = new BehaviorSubject<FaqsRow[]>([]);
  total = 0;

  page = 1;
  pageSize = 10;
  offset = 0;
  sort = '';
  order = '';

  displayedColumns = ['code', 'name', 'questions'];
  headers = { code: 'Código', name: 'Nombre', questions: 'Total Preguntas' };

  ngOnInit(): void {
    this.load(this.page, this.pageSize);
  }

  // Se puede optimitzar para no repetir en todos los componentes
  load = (page = 1, pageSize = 1) => {
    const offset = (page - 1) * pageSize;

    this.facade.loadAll(page, pageSize, offset, this.sort, this.order).subscribe({
      next: (res: any) => {
        const items = res.items || [];
        const rows: FaqsRow[] = items.map((u: any) => ({
          ...u,
          name: u.translations.es.name,
          // category: u.category.translations.es.name,
          questions: u.questions.length,
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

  deleteFaqs(id: string): void {
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
