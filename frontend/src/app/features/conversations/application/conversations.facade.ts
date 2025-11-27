import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ConversationsService } from './conversations.service';
import { Conversation } from "../domain/conversations.model";

/**
 * Facade: simplifica la API de la feature para los containers.
 * Expone observables listos para usar con async pipe.
 */
@Injectable({ providedIn: "root" })
export class ConversationsFacade {
  private svc = inject(ConversationsService);

  loadAll(page = 1, limit = 10, offset = 0, sort = '', order = '', fields = ''): Observable<{ items: Conversation[]; pagination: any }> {
    return this.svc.getConversations(page, limit, offset, sort, order, fields);
  }

  loadById(id: string): Observable<Conversation> {
    return this.svc.getConversationById(id);
  }

  store(data: any): Observable<any> {
    return this.svc.storeConversation(data);
  }

  update(id: string, data: any): Observable<any> {
    return this.svc.updateConversation(id, data);
  }

  delete(id: string): Observable<any> {
    return this.svc.deleteConversation(id);
  }
}
