import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface FaqCategory {
  id: number;
  title: string;       
  description: string;
  status: string;
}

export interface Faq {
  id: number;
  title: string;       
  category: FaqCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})


export class FaqService {
  private faqsUrl = environment.faqsUrl;

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(this.faqsUrl);
  }

  getFaq(id: number): Observable<Faq> {
    return this.http.get<Faq>(`${this.faqsUrl}/${id}`);
  }
}
