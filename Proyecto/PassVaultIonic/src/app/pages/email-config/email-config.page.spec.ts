import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigPage } from './email-config.page';

describe('EmailConfigPage', () => {
  let component: EmailConfigPage;
  let fixture: ComponentFixture<EmailConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
