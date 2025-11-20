import { environment } from '../../../environments/environments';

export const Api = {
    auth: (version: 'v1' | 'v2' = 'v1') =>
        `${environment.apiBase}${environment.versions[version]}/${environment.endpoints.auth}`,
    users: (version: 'v1' | 'v2' = 'v1') =>
        `${environment.apiBase}${environment.versions[version]}/${environment.endpoints.users}`,
    faqs: (version: 'v1' | 'v2' = 'v1') =>
        `${environment.apiBase}${environment.versions[version]}/${environment.endpoints.faqs}`,
    notifications: (version: 'v1' | 'v2' = 'v1') =>
        `${environment.apiBase}${environment.versions[version]}/${environment.endpoints.notifications}`
};
