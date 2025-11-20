import { Injectable, inject } from '@angular/core';
import { FaqsRepository } from '../data-access/faqs.repository';
import { Faqs } from '../domain/faqs.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaqsService {
    private repo = inject(FaqsRepository);

    getFaqs(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Faqs[]; pagination: any }> {
        return this.repo.findAll(page, limit, offset, sort, order);
    }

    getFaqById(id: string): Observable<Faqs> {
        return this.repo.findById(id);
    }

    store(data: Faqs) {
        return this.repo.store(data);
    }

    updateFaqs(id: string, data: any): Observable<any> {
        return this.repo.update(id, data);
    }

    deleteFaqs(id: string): Observable<any> {
        return this.repo.delete(id);
    }
}
