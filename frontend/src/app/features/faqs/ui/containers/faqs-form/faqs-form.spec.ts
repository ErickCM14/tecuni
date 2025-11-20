import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsForm } from './faqs-form';

describe('FaqsForm', () => {
  let component: FaqsForm;
  let fixture: ComponentFixture<FaqsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
