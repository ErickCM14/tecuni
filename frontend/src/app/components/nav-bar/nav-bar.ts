import { AfterViewInit, Component } from '@angular/core';
import { RouterLinkWithHref } from "@angular/router";
import { RouterModule } from '@angular/router'; 


declare function inicializarSidebar(): void;

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLinkWithHref],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements AfterViewInit {
  ngAfterViewInit() {
    // Llamamos a la función JS cuando el componente ya está en el DOM
    if (typeof inicializarSidebar === 'function') {
      inicializarSidebar();
    } else {
      console.error('⚠️ No se encontró la función inicializarSidebar()');
    }
  }
}
