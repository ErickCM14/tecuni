import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../services/faqs';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { NavBar } from "../nav-bar/nav-bar";

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  sidebarOpen = false;
  constructor(private faqService: FaqService) {
    
  }

  ngOnInit() {
    this.faqService.getFaqs().subscribe(faqs => {
      console.log(faqs);
    }, error => {
      console.log(error);
    })
  }

}
