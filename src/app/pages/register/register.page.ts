import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { StorageService } from 'src/app/services/storage';

interface User {
  id: number;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  id_type: number;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class RegisterPage implements ViewWillEnter {
  lang: string = "";

  login: string = "";
  firstName: string = "";
  lastName: string = "";
  password: string = "";
  confirmPassword: string = "";

  error: string = "";

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang") || "FR";
  }

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  checkValidInput() {
    this.error = "";

    // Regex
    const loginRegex: RegExp = /^[a-zA-Z0-9\-_]{3,64}$/; // alphanumérique + - _, 3-64 chars
    const nameRegex: RegExp = /^[a-zA-Z\-]+$/;           // lettres et tirets uniquement
    const passwordRegex: RegExp = /^\S{8,64}$/;          // 8-64 chars, aucun espace

    if (!loginRegex.test(this.login)) {
      this.error = this.lang === "FR" 
        ? "Login invalide (alphanumérique, '-' et '_', 3-64 caractères, sans espace)" 
        : "Invalid username (alphanumeric, '-' and '_', 3-64 chars, no spaces)";
      return false;
    }

    if (!this.firstName || !nameRegex.test(this.firstName)) {
      this.error = this.lang === "FR" 
        ? "Prénom invalide (lettres et '-', obligatoire)" 
        : "Invalid first name (letters and '-', required)";
      return false;
    }

    if (!this.lastName || !nameRegex.test(this.lastName)) {
      this.error = this.lang === "FR" 
        ? "Nom invalide (lettres et '-', obligatoire)" 
        : "Invalid last name (letters and '-', required)";
      return false;
    }

    if (!passwordRegex.test(this.password)) {
      this.error = this.lang === "FR" 
        ? "Mot de passe invalide (8-64 caractères, aucun espace)"
        : "Invalid password (8-64 chars, no spaces)";
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.error = this.lang === "FR" 
        ? "Les mots de passe ne correspondent pas"
        : "Passwords do not match";
      return false;
    }

    return true;
  }

  async tryRegister() {
    if(!this.checkValidInput()) {
      return;
    }

    // Récupérer la BDD
    const db = await this.storage.get("db") || { users: [], userTypes: [{id:1, type:'Patient'}] };
    const users: User[] = db.users || [];

    // Vérifier unicité du login
    if (users.some(u => u.login === this.login)) {
      this.error = this.lang === "FR" ? "Ce login est déjà utilisé" : "Username already exists";
      return;
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: users.length + 1,
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      id_type: 1 // patient
    };

    users.push(newUser);
    db.users = users;
    await this.storage.set("db", db);

    // Redirection vers login
    this.router.navigate(["login"]);
  }

  goLogin() {
    this.router.navigate(["login"]);
  }
}
