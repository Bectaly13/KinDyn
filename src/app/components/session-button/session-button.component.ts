import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-button.component.html',
  styleUrls: ['./session-button.component.scss']
})
export class SessionButtonComponent {
  sessionId = input.required<number>();
  type = input.required<number>();
  code = input.required<string>();
  titleFR = input.required<string>();
  titleEN = input.required<string>();
  lang = input.required<string>();

  constructor(
    private router: Router
  ) { }


  get title(): string {
    return this.lang() === 'FR' ? this.titleFR() : this.titleEN();
  }

  goTo() {
    this.router.navigate(["session-start/" + this.sessionId()]);
  }
}