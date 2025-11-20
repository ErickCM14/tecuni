import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UsersDataService } from "./users.service";
import { User } from "../domain/users.model";

/**
 * Repository: adapta el data-access a la capa de aplicación.
 * Se puede reemplazar por otra implementación sin afectar la aplicación.
 */
@Injectable({ providedIn: "root" })
export class UsersRepository {
  private api = inject(UsersDataService);

  findAll(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: User[]; pagination: any }> {
    return this.api.getUsers(page, limit, offset, sort, order);
  }

  findById(id: string): Observable<User> {
    return this.api.getUserById(id);
  }

  store(data: any): Observable<any> {
    return this.api.storeUser(data);
  }

  update(id: string, user: any): Observable<any> {
    return this.api.updateUser(id, user);
  }

  delete(id: string): Observable<any> {
    return this.api.deleteUser(id);
  }
}
