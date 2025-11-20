import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class WelcomePage implements ViewWillEnter {
  loadingMessage: string = "";

  constructor(
    private storage: StorageService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.loadingMessage = "...";

    let lang_data = await this.storage.get("lang");
    if(!lang_data) {
      this.storage.set("lang", "FR");
    }

    if(lang_data == "FR") {
      this.loadingMessage = "Préférences de langue récupérées.";
    }
    else {
      this.loadingMessage = "Language preferences fetched.";
    }

    if(lang_data == "FR") {
      this.loadingMessage = "Redirection...";
    }
    else {
      this.loadingMessage = "Redirecting...";
    }

    setTimeout(() => {
        this.router.navigate(["login"]);
    }, 4000);    
  }
}
