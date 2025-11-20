import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFaqs } from './details-faqs';

describe('DetailsFaqs', () => {
  let component: DetailsFaqs;
  let fixture: ComponentFixture<DetailsFaqs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsFaqs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsFaqs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
