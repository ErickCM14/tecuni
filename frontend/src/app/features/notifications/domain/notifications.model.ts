export interface NotificationDestinatary {
    idUser: string;
    idDevice: string;
    statusRead: 'unread' | 'delivered' | 'read';
}

export interface NotificationData {
    id: string;
    notificationType: string;
    extra_info?: string;
}

export interface Notifications {
    id?: string;
    code: string;
    title: string;
    body: string;
    status: 'pending' | 'sent' | 'failed';
    createdUser: string;
    data: NotificationData;
    destinatary: NotificationDestinatary[];
    createdAt?: Date;
}
