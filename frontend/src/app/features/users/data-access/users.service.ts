import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from "../domain/users.model";
import { Api } from '../../../shared/constants/api';

@Injectable({ providedIn: "root" })
export class UsersDataService {
  private base = Api.users('v1');

  constructor(private http: HttpClient) { }

  getUsers(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: User[]; pagination: any }> {
    const params = new HttpParams().set('page', String(page)).set('limit', String(limit)).set('offset', String(offset)).set('sort', String(sort)).set('order', String(order));

    return this.http.get<any>(this.base, { params }).pipe(
      map((res) => {
        const items: User[] = res?.data?.items ?? [];
        const pagination: any = res?.data?.pagination ?? (Array.isArray(items) ? items.length : 0);
        return { items, pagination };
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<any>(`${this.base}/show/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  storeUser(payload: any): Observable<any> {
    return this.http.post(`${this.base}/store`, payload);
  }

  updateUser(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.base}/update/${id}`, payload);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.base}/delete/${id}`);
  }
}

