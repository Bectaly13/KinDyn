import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionEndPage } from './session-end.page';

describe('SessionEndPage', () => {
  let component: SessionEndPage;
  let fixture: ComponentFixture<SessionEndPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEndPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
