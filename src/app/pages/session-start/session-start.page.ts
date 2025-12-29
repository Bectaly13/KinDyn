import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { DatabaseService, SessionData, Exercise } from 'src/app/services/database';
import { StorageService } from 'src/app/services/storage';

import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-session-start',
  templateUrl: './session-start.page.html',
  styleUrls: ['./session-start.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, HeaderComponent]
})
export class SessionStartPage implements ViewWillEnter {
  lang: string = "FR";
  sessionId!: number;

  sessionData!: SessionData;
  exercises: Exercise[] = [];

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang") || "FR";

    this.sessionId = Number(this.route.snapshot.paramMap.get("id"));
    if (!this.sessionId) {
      this.router.navigate(["session-selection"]);
      return;
    }

    const sessionDatas = await this.db.getTable("sessionDatas");
    const exercisesTable = await this.db.getTable("exercises");

    this.sessionData = sessionDatas.find((s: SessionData) => s.id === this.sessionId);

    if (!this.sessionData) {
      this.router.navigate(["session-selection"]);
      return;
    }

    this.exercises = exercisesTable.filter((e: Exercise) =>
      this.sessionData.content.includes(e.id)
    );
  }

  goBack() {
    this.router.navigate(["session-selection"]);
  }

  startSession() {
    this.router.navigate(["session/" + this.sessionId]);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private storage: StorageService
  ) {}
}
