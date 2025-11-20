import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Faqs } from '../domain/faqs.model';
import { Api } from '../../../shared/constants/api';

@Injectable({ providedIn: 'root' })
export class FaqsDataService {
    private http = inject(HttpClient);
    private base = Api.faqs('v1');

    getFaqs(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Faqs[]; pagination: any }> {
        const params = new HttpParams().set('page', String(page)).set('limit', String(limit)).set('offset', String(offset)).set('sort', String(sort)).set('order', String(order));

        return this.http.get<any>(this.base, { params }).pipe(
            map((res) => {
                const items: Faqs[] = res?.data?.items ?? [];
                const pagination: any = res?.data?.pagination ?? (Array.isArray(items) ? items.length : 0);
                return { items, pagination };
            })
        );
    }

    getFaqById(id: string): Observable<Faqs> {
        return this.http.get<any>(`${this.base}/show/${id}`).pipe(
            map(res => res?.data ?? res)
        );
    }

    store(faqs: Faqs): Observable<any> {
        return this.http.post(`${this.base}/store`, faqs);
    }

    updateFaqs(id: string, payload: any): Observable<any> {
        return this.http.patch(`${this.base}/update/${id}`, payload);
    }

    deleteFaqs(id: string): Observable<any> {
        return this.http.delete(`${this.base}/delete/${id}`);
    }
}
