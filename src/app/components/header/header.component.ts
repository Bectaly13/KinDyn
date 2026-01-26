import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  home = input<boolean>(true);
  titleFR = input.required<string>();
  titleEN = input.required<string>();
  lang = input.required<string>();

  constructor(
    private storage: StorageService,
    private router: Router
  ) { }

  async toggleLang() {
    if(this.lang() == "FR") {
      this.storage.set("lang", "EN");
    }
    else {
      this.storage.set("lang", "FR");
    }

    window.location.reload();
  }

  goHome() {
    this.router.navigate(["home"]);
  }
}
