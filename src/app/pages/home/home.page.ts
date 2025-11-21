import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { HomeButtonComponent } from 'src/app/components/home-button/home-button.component';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService, User, UserType } from 'src/app/services/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, HomeButtonComponent]
})
export class HomePage implements ViewWillEnter {
  lang: string = "";
  userId: number = 0;

  firstName: string = "";
  accountType: string = "";

  constructor(
    private storage: StorageService,
    private db: DatabaseService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang");  
    this.userId = await this.storage.get("user");  

    if (!this.userId) {
      this.router.navigate(["login"]);
      return;
    }

    const users = await this.db.getTable("users");
    const types = await this.db.getTable("userTypes");

    const user: User = users.find((u: User) => u.id === this.userId);
    const type: UserType = types.find((t: UserType) => t.id === user.id_type);

    this.firstName = user.firstName;
    this.accountType = type.type;
  }

  async logout() {
    await this.storage.remove("user");
    this.router.navigate(["login"]);
  }
}
