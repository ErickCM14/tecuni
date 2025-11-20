import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsForm } from './notifications-form';

describe('NotificationsForm', () => {
  let component: NotificationsForm;
  let fixture: ComponentFixture<NotificationsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
