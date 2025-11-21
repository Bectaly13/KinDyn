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
  loadingMessage: string = "";

  constructor(
    private storage: StorageService,
    private router: Router,
    private database: DatabaseService
  ) { }

  async ionViewWillEnter() {
    this.loadingMessage = "...";

    this.lang = await this.storage.get("lang");
    if(!this.lang) {
      this.storage.set("lang", "FR");
      this.lang = "FR";
    }

    if(this.lang == "FR") {
      this.loadingMessage = "Préférences de langue récupérées.";
    }
    else {
      this.loadingMessage = "Language preferences fetched.";
    }

    let database_data = await this.storage.get("db");
    if(!database_data) {
      if(this.lang == "FR") {
        this.loadingMessage = "Récupération de la base de données...";
      }
      else {
        this.loadingMessage = "Fetching database...";
      }

      database_data = this.database.db;
      this.storage.set("db", database_data);
    }

    if(this.lang == "FR") {
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
