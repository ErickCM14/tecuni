import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ConversationsDataService } from "./conversations.service";
import { Conversation } from "../domain/conversations.model";

/**
 * Repository: adapta el data-access a la capa de aplicación.
 * Se puede reemplazar por otra implementación sin afectar la aplicación.
 */
@Injectable({ providedIn: "root" })
export class ConversationsRepository {
  private api = inject(ConversationsDataService);

  findAll(page = 1, limit = 10, offset = 0, sort = '', order = '', fields = ''): Observable<{ items: Conversation[]; pagination: any }> {
    return this.api.getConversations(page, limit, offset, sort, order, fields);
  }

  findById(id: string): Observable<Conversation> {
    return this.api.getConversationById(id);
  }

  store(data: any): Observable<any> {
    return this.api.storeConversation(data);
  }

  update(id: string, user: any): Observable<any> {
    return this.api.updateConversation(id, user);
  }

  delete(id: string): Observable<any> {
    return this.api.deleteConversation(id);
  }
}
