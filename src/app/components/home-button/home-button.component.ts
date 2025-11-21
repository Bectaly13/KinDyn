import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss'],
})
export class HomeButtonComponent {
  titleFR = input.required<string>();
  titleEN = input.required<string>();
  icon = input.required<string>();
  subtitleFR = input.required<string>();
  subtitleEN = input.required<string>();
  path = input.required<string>();
  lang = input.required<string>();

  constructor(
    private router: Router
  ) { }

  go() {
    this.router.navigate([this.path()]);
  }
}
