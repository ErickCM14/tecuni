import { TestBed } from '@angular/core/testing';

import { NotificationAlert } from './notification-alert';

describe('NotificationAlert', () => {
  let service: NotificationAlert;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationAlert);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
