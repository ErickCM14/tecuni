import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Conversation } from "../domain/conversations.model";
import { Api } from '../../../shared/constants/api';

@Injectable({ providedIn: "root" })
export class ConversationsDataService {
  private base = Api.conversations('v1');

  constructor(private http: HttpClient) { }

  getConversations(page = 1, limit = 10, offset = 0, sort = '', order = '', fields = ''): Observable<{ items: Conversation[]; pagination: any }> {
    const params = new HttpParams().set('page', String(page)).set('limit', String(limit)).set('offset', String(offset)).set('sort', String(sort)).set('order', String(order)).set('fields', String(fields));

    return this.http.get<any>(this.base, { params }).pipe(
      map((res) => {
        const items: Conversation[] = res?.data?.items ?? [];
        const pagination: any = res?.data?.pagination ?? (Array.isArray(items) ? items.length : 0);
        return { items, pagination };
      })
    );
  }

  getConversationById(id: string): Observable<Conversation> {
    return this.http.get<any>(`${this.base}/show/${id}`).pipe(
      map(res => res?.data ?? res)
    );
  }

  storeConversation(payload: any): Observable<any> {
    return this.http.post(`${this.base}/store`, payload);
  }

  updateConversation(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.base}/update/${id}`, payload);
  }

  deleteConversation(id: string): Observable<any> {
    return this.http.delete(`${this.base}/delete/${id}`);
  }
}

