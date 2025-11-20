import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UsersService } from './users.service';
import { User } from "../domain/users.model";

/**
 * Facade: simplifica la API de la feature para los containers.
 * Expone observables listos para usar con async pipe.
 */
@Injectable({ providedIn: "root" })
export class UsersFacade {
  private svc = inject(UsersService);

  loadAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: User[]; pagination: any }> {
    return this.svc.getUsers(page, limit, offset, sort, order);
  }

  loadById(id: string): Observable<User> {
    return this.svc.getUserById(id);
  }

  store(data: any): Observable<any> {
    return this.svc.storeUser(data);
  }

  update(id: string, data: any): Observable<any> {
    return this.svc.updateUser(id, data);
  }

  delete(id: string): Observable<any> {
    return this.svc.deleteUser(id);
  }
}
