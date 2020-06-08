import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationbComponent } from './notificationb.component';

describe('NotificationbComponent', () => {
  let component: NotificationbComponent;
  let fixture: ComponentFixture<NotificationbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
