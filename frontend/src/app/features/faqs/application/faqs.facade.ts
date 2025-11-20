import { Injectable, inject } from '@angular/core';
import { FaqsService } from './faqs.service';
import { Faqs } from '../domain/faqs.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FaqsFacade {
    private svc = inject(FaqsService);

    loadAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Faqs[]; pagination: any }> {
        return this.svc.getFaqs(page, limit, offset, sort, order);
    }

    loadById(id: string): Observable<Faqs> {
        return this.svc.getFaqById(id);
    }

    store(data: Faqs) {
        return this.svc.store(data);
    }

    update(id: string, data: any): Observable<any> {
        return this.svc.updateFaqs(id, data);
    }

    delete(id: string): Observable<any> {
        return this.svc.deleteFaqs(id);
    }
}
