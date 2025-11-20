import { AfterViewInit, Component } from '@angular/core';
import { RouterLinkWithHref } from "@angular/router";

declare function inicializarSidebar(): void;

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkWithHref],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements AfterViewInit {
  ngAfterViewInit() {
    // Llamamos a la función JS cuando el componente ya está en el DOM
    if (typeof inicializarSidebar === 'function') {
      inicializarSidebar();
    } else {
      console.error('⚠️ No se encontró la función inicializarSidebar()');
    }
  }
}
