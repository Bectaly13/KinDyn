import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { BackButtonComponent } from 'src/app/components/back-button/back-button.component';
import { SessionButtonComponent } from 'src/app/components/session-button/session-button.component';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService, SessionData } from 'src/app/services/database';

@Component({
  selector: 'app-session-selection',
  templateUrl: './session-selection.page.html',
  styleUrls: ['./session-selection.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, BackButtonComponent, SessionButtonComponent]
})
export class SessionSelectionPage implements ViewWillEnter {

  lang: string = "FR";
  sessionDatas: SessionData[] = [];

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang") || "FR";
    this.sessionDatas = await this.db.getTable("sessionDatas");
  }

  constructor(
    private db: DatabaseService,
    private storage: StorageService
  ) { }

}
