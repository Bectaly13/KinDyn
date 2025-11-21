import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService, User } from 'src/app/services/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class LoginPage implements ViewWillEnter {
  lang: string = "";
  
  login: string = "";
  password: string = "";
  
  error: string = "";

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang") || "FR";
  }

  constructor(
    private storage: StorageService,
    private router: Router,
    private db: DatabaseService
  ) { }

  async tryLogin() {
    this.error = "";

    const users: User[] = await this.db.getTable("users");

    const user = users.find(u => u.login === this.login && u.password === this.password);

    if (!user) {
      this.error = this.lang === 'FR' ? "Login ou mot de passe incorrect" : "Incorrect login or password";
      return;
    }

    // Stocker l'utilisateur connecté
    await this.storage.set("user", user.id);

    // Redirection vers home
    this.router.navigate(["home"]);
  }

  goRegister() {
    this.router.navigate(["register"]);
  }
}
