
import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
})
export class DataTable<T> {
  @Input() data: T[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() headers: { [key: string]: string } = {};
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() total = 0;

  @Input() loadFn?: (page: number, pageSize: number) => void;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  @ContentChild('rowActions', { static: false }) rowActionsTemplate?: TemplateRef<any>;

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;

    if (this.loadFn) {
      this.loadFn(this.page, this.pageSize); // llama al backend
    }
  }

  applyFilter(event: Event) {
    // opcional: si quieres filtrar en client-side
  }
}
