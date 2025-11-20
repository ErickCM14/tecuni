import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Notifications } from '../domain/notifications.model';
import { Api } from '../../../shared/constants/api';

@Injectable({ providedIn: 'root' })
export class NotificationsDataService {
    private http = inject(HttpClient);
    private base = Api.notifications('v1');

    getNotifications(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Notifications[]; pagination: any }> {
        const params = new HttpParams().set('page', String(page)).set('limit', String(limit)).set('offset', String(offset)).set('sort', String(sort)).set('order', String(order));

        return this.http.get<any>(this.base, { params }).pipe(
            map((res) => {
                const items: Notifications[] = res?.data?.items ?? [];
                const pagination: any = res?.data?.pagination ?? (Array.isArray(items) ? items.length : 0);
                return { items, pagination };
            })
        );
    }

    getNotificationById(id: string): Observable<Notifications> {
        return this.http.get<any>(`${this.base}/show/${id}`).pipe(
            map(res => res?.data ?? res)
        );
    }

    store(data: Notifications): Observable<any> {
        return this.http.post(`${this.base}/store`, data);
    }

    updateNotifications(id: string, payload: any): Observable<any> {
        return this.http.patch(`${this.base}/update/${id}`, payload);
    }

    deleteNotifications(id: string): Observable<any> {
        return this.http.delete(`${this.base}/delete/${id}`);
    }

    sendNotifications(id: string): Observable<any> {
        return this.http.post(`${this.base}/send-notification/${id}`, []);
    }
}
