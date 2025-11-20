import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsDataService } from './notifications.service';
import { Notifications } from '../domain/notifications.model';

@Injectable({ providedIn: 'root' })
export class NotificationsRepository {
    private api = inject(NotificationsDataService);

    findAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Notifications[]; pagination: any }> {
        return this.api.getNotifications(page, limit, offset, sort, order);
    }

    findById(id: string): Observable<Notifications> {
        return this.api.getNotificationById(id);
    }

    store(data: Notifications): Observable<any> {
        return this.api.store(data);
    }

    update(id: string, data: any): Observable<any> {
        return this.api.updateNotifications(id, data);
    }

    delete(id: string): Observable<any> {
        return this.api.deleteNotifications(id);
    }

    send(id: string): Observable<any> {
        return this.api.sendNotifications(id);
    }
}
