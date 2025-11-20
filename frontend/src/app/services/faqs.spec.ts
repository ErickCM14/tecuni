import { TestBed } from '@angular/core/testing';

import { Faqs } from './faqs';

describe('Faqs', () => {
  let service: Faqs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Faqs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
