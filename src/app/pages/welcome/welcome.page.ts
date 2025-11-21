import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService } from 'src/app/services/database';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class WelcomePage implements ViewWillEnter {
  lang: string = "";

  constructor(
    private storage: StorageService,
    private router: Router,
    private db: DatabaseService
  ) { }

  async ionViewWillEnter() {
    const DEFAULT_LANG: string = "FR";
    this.lang = await this.storage.get("lang");
    if(!this.lang) {
      await this.storage.set("lang", DEFAULT_LANG);
      this.lang = DEFAULT_LANG;
    }

    let db = await this.storage.get("db");
    if(!db) {
      await this.db.update(this.db.db);
    }

    let path = "";
    let user_data = await this.storage.get("user");
    if(!user_data) {
      path = "login";
    }
    else {
      path = "home";
    }

    setTimeout(() => {
        this.router.navigate([path]);
    }, 3000);    
  }
}
