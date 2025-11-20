import { Component, inject } from '@angular/core';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private auth = inject(Auth);

  logout() {
    this.auth.logout();
  }

}
