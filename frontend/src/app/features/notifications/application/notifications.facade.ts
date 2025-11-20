import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { Notifications } from '../domain/notifications.model';

@Injectable({ providedIn: 'root' })
export class NotificationsFacade {
    private svc = inject(NotificationsService);

    loadAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: Notifications[]; pagination: any }> {
        return this.svc.getNotifications(page, limit, offset, sort, order);
    }

    loadById(id: string): Observable<Notifications> {
        return this.svc.getNotificationById(id);
    }

    store(data: Notifications): Observable<any> {
        return this.svc.store(data);
    }

    update(id: string, data: any): Observable<any> {
        return this.svc.updateNotifications(id, data);
    }

    delete(id: string): Observable<any> {
        return this.svc.deleteNotifications(id);
    }

    send(id: string): Observable<any> {
        return this.svc.sendNotifications(id);
    }
}
