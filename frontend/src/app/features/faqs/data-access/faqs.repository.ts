import { Injectable, inject } from '@angular/core';
import { FaqsDataService } from './faqs.service';
import { Faqs } from '../domain/faqs.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaqsRepository {
    private api = inject(FaqsDataService);

    findAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Faqs[]; pagination: any }> {
        return this.api.getFaqs(page, limit, offset, sort, order);
    }

    findById(id: string): Observable<Faqs> {
        return this.api.getFaqById(id);
    }

    store(data: Faqs) {
        return this.api.store(data);
    }

    update(id: string, data: any): Observable<any> {
        return this.api.updateFaqs(id, data);
    }

    delete(id: string): Observable<any> {
        return this.api.deleteFaqs(id);
    }
}
