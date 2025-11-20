import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs';
import { Api } from '../../shared/constants/api';
import { Router } from '@angular/router';

interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  phone?: string;
  photo?: string | null;
  country?: string;
  state?: string | null;
  roles: string[];
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private base = Api.auth('v1');
  private router = inject(Router);

  token = signal<string | null>(localStorage.getItem('auth_token'));
  user = signal<User | null>(
    localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null
  );

  isAuthenticated = computed(() => !!this.token());

  hasValidToken = computed(() => {
    const token = this.token();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return false;

      const now = Math.floor(Date.now() / 1000);
      return now < exp;
    } catch {
      return false;
    }
  });


  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.success) {
            const { token, ...userFields } = res.data;
            const userData: User = {
              id: userFields['id'],
              name: userFields['name'],
              lastname: userFields['lastname'],
              username: userFields['username'],
              email: userFields['email'],
              phone: userFields['phone'],
              photo: userFields['photo'],
              country: userFields['country'],
              state: userFields['state'],
              roles: userFields['roles'] || []
            };

            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(userData));

            this.token.set(token);
            this.user.set(userData);
          } else {
            throw new Error(res.message);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.token();
  }
}
