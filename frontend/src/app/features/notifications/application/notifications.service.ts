import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsRepository } from '../data-access/notifications.repository';
import { Notifications } from '../domain/notifications.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private repo = inject(NotificationsRepository);

    getNotifications(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Notifications[]; pagination: any }> {
        return this.repo.findAll(page, limit, offset, sort, order);
    }

    getNotificationById(id: string): Observable<Notifications> {
        return this.repo.findById(id);
    }

    store(data: Notifications): Observable<any> {
        return this.repo.store(data);
    }

    updateNotifications(id: string, data: any): Observable<any> {
        return this.repo.update(id, data);
    }

    deleteNotifications(id: string): Observable<any> {
        return this.repo.delete(id);
    }

    sendNotifications(id: string): Observable<any> {
        return this.repo.send(id);
    }
}
