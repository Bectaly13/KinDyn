import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionSelectionPage } from './session-selection.page';

describe('SessionSelectionPage', () => {
  let component: SessionSelectionPage;
  let fixture: ComponentFixture<SessionSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
