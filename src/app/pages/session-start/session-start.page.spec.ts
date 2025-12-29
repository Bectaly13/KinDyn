import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionStartPage } from './session-start.page';

describe('SessionStartPage', () => {
  let component: SessionStartPage;
  let fixture: ComponentFixture<SessionStartPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
