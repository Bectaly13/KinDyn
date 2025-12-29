import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { DatabaseService, SessionData, Session } from 'src/app/services/database';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-session-end',
  templateUrl: './session-end.page.html',
  styleUrls: ['./session-end.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class SessionEndPage implements ViewWillEnter {

  lang: string = "FR";
  sessionId!: number;
  score: number = 0;
  sessionData!: SessionData;

  comment: string = "";

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang") || "FR";

    this.sessionId = Number(this.route.snapshot.paramMap.get("id"));
    this.score = Number(this.route.snapshot.queryParamMap.get("score")) || 0;

    this.comment = "";

    if (!this.sessionId) {
      this.router.navigate(["/home"]);
      return;
    }

    const sessionDatas = await this.db.getTable("sessionDatas");
    this.sessionData = sessionDatas.find((s: SessionData) => s.id === this.sessionId);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private storage: StorageService
  ) {}

  async goHome() {
    // Récupérer l'utilisateur courant
    const userId = await this.storage.get("user");
    if (!userId) {
      this.router.navigate(["/home"]);
      return;
    }

    // Formater date et heure actuelles
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Récupérer la table actuelle
    const sessions: Session[] = await this.db.getTable("sessions");

    // Déterminer le nouvel id
    const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1;

    // Créer la nouvelle session
    const newSession: Session = {
      id: newId,
      id_patient: userId,
      date: dateStr,
      time: timeStr,
      note: this.comment,
      score: this.score
    };

    // Ajouter à la table
    sessions.push(newSession);
    await this.db.updateTable("sessions", sessions);

    // Naviguer vers le menu
    this.router.navigate(["/home"]);
  }
}