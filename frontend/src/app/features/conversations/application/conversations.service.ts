import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ConversationsRepository } from "../data-access/conversations.repository";
import { Conversation } from "../domain/conversations.model";

/**
 * Application service: contiene la lógica de negocio/coordination para Conversations.
 */
@Injectable({ providedIn: "root" })
export class ConversationsService {
  private repo = inject(ConversationsRepository);

  getConversations(page = 1, limit = 10, offset = 0, sort = '', order = '', fields = ''): Observable<{ items: Conversation[]; pagination: any }> {
    return this.repo.findAll(page, limit, offset, sort, order, fields);
  }

  getConversationById(id: string): Observable<Conversation> {
    return this.repo.findById(id);
  }

  storeConversation(data: any): Observable<any> {
    return this.repo.store(data);
  }

  updateConversation(id: string, data: any): Observable<any> {
    return this.repo.update(id, data);
  }

  deleteConversation(id: string): Observable<any> {
    return this.repo.delete(id);
  }
}
