// src/app/components/faqs/faqs.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { NavBar } from '../nav-bar/nav-bar';
import { Faq, FaqService } from '../../services/faqs';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router'; 



@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, RouterModule],
  templateUrl: './faqs.html',
  styleUrls: ['./faqs.css']
})
export class Faqs implements OnInit {

  faqs: Faq[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe({
      next: (faqs: Faq[]) => this.faqs = faqs,
      error: (err) => console.error(err)
    });
  }

  get filteredFaqs(): Faq[] {
    const term = this.searchTerm.toLowerCase();
    return this.faqs.filter(faq => 
      faq.title.toLowerCase().includes(term) || 
      faq.category.title.toLowerCase().includes(term)
    );
  }
}
