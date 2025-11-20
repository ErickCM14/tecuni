import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UsersRepository } from "../data-access/users.repository";
import { User } from "../domain/users.model";

/**
 * Application service: contiene la lógica de negocio/coordination para Users.
 */
@Injectable({ providedIn: "root" })
export class UsersService {
  private repo = inject(UsersRepository);

  getUsers(page = 1, limit = 10, offset = 0, sort = '', order = ''): Observable<{ items: User[]; pagination: any }> {
    return this.repo.findAll(page, limit, offset, sort, order);
  }

  getUserById(id: string): Observable<User> {
    return this.repo.findById(id);
  }

  storeUser(data: any): Observable<any> {
    return this.repo.store(data);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.repo.update(id, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.repo.delete(id);
  }
}
