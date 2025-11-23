import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
  lang = input.required<string>();

  constructor(
    private router: Router
  ) { }

  goBack() {
    this.router.navigate(["home"]);
  }
}
