import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from '../../footer/footer';
import { Header } from '../../header/header';
import { NavBar } from '../../nav-bar/nav-bar';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Faq, FaqService } from '../../../services/faqs';

@Component({
  selector: 'app-details-faqs',
  standalone: true,
  imports: [CommonModule, Footer, Header, NavBar, RouterModule],
  templateUrl: './details-faqs.html',
  styleUrls: ['./details-faqs.css']
})
export class DetailsFaqs implements OnInit {
  faqs!: Faq; // Propiedad para un solo FAQ

  constructor(
    private faqService: FaqService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.faqService.getFaq(id).subscribe({
      next: (faq: Faq) => this.faqs = faq,
      error: (err) => console.error(err)
    });
  }
}
