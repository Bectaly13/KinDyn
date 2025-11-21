import { Component, input } from '@angular/core';

import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  titleFR = input.required<string>();
  titleEN = input.required<string>();
  lang = input.required<string>();

  constructor(
    private storage: StorageService
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
}
