import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';

import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class LoginPage implements ViewWillEnter {
  lang: string = "";

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang"); 
  }

  constructor(
    private storage: StorageService,
    private router: Router
  ) { }

}
