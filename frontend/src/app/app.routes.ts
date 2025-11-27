import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { noAuthGuard } from './core/auth/no-auth-guard';
import { USERS_ROUTES } from './features/users/users-routing';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/ui/login-page/login-page').then(m => m.LoginPage), canActivate: [noAuthGuard] },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
      { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home) },
      // { path: 'faqs', loadComponent: () => import('./components/faqs/faqs').then(m => m.Faqs) },
      // { path: 'faqs/:id', loadComponent: () => import('./components/faqs/details-faqs/details-faqs').then(m => m.DetailsFaqs) },

      // feature users (standalone)
      {
        path: 'rol',
        loadComponent: () =>
          import('./features/users/ui/containers/users-page/users-page').then(m => m.UsersPage)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/ui/containers/users-page/users-page').then(m => m.UsersPage)
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('./features/users/ui/containers/users-form/users-form').then(m => m.UsersForm)
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./features/users/ui/containers/users-form/users-form').then(m => m.UsersForm)
      },

      // feature faqs (standalone)
      {
        path: 'faqs',
        loadComponent: () =>
          import('./features/faqs/ui/containers/faqs-page/faqs-page').then(m => m.FaqsPage)
      },
      {
        path: 'faqs/create',
        loadComponent: () =>
          import('./features/faqs/ui/containers/faqs-form/faqs-form').then(m => m.FaqsForm)
      },
      {
        path: 'faqs/edit/:id',
        loadComponent: () =>
          import('./features/faqs/ui/containers/faqs-form/faqs-form').then(m => m.FaqsForm)
      },

      // feature notifications (standalone)
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/ui/containers/notifications-page/notifications-page').then(m => m.NotificationsPage)
      },
      {
        path: 'notifications/create',
        loadComponent: () =>
          import('./features/notifications/ui/containers/notifications-form/notifications-form').then(m => m.NotificationsForm)
      },
      {
        path: 'notifications/edit/:id',
        loadComponent: () =>
          import('./features/notifications/ui/containers/notifications-form/notifications-form').then(m => m.NotificationsForm)
      },

      // feature conversations (standalone)
      {
        path: 'conversations',
        loadComponent: () =>
          import('./features/conversations/ui/containers/conversations-list/conversations-list').then(m => m.ConversationsList)
      },
      // {
      //   path: 'notifications/create',
      //   loadComponent: () =>
      //     import('./features/notifications/ui/containers/notifications-form/notifications-form').then(m => m.NotificationsForm)
      // },
      // {
      //   path: 'notifications/edit/:id',
      //   loadComponent: () =>
      //     import('./features/notifications/ui/containers/notifications-form/notifications-form').then(m => m.NotificationsForm)
      // },
    ]
  },
  { path: '**', redirectTo: 'login' }
];