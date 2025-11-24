import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { BackButtonComponent } from 'src/app/components/back-button/back-button.component';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService, User, Session } from 'src/app/services/database';

@Component({
  selector: 'app-followup',
  templateUrl: './followup.page.html',
  styleUrls: ['./followup.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, BackButtonComponent]
})
export class FollowupPage implements ViewWillEnter {
  lang: string = "";
  userId: number = 0;
  userType: number = 0;

  isSpecialist: boolean = false;
  patients: any[] = [];
  selectedPatientId: number = 0;
  sessions: any[] = [];

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang");  
    this.userId = await this.storage.get("user");  

    if (!this.userId) {
      this.router.navigate(["login"]);
      return;
    }

    // Récupérer infos utilisateur
    const users = await this.db.getTable("users");
    const currentUser: User = users.find((u: User) => u.id === this.userId);
    this.userType = currentUser.id_type;

    // Déterminer si c’est un spécialiste
    this.isSpecialist = this.userType === 2;

    if (this.isSpecialist) {
      // Liste de tous les patients
      this.patients = users
        .filter((u: User) => u.id_type === 1)
        .map((u: User) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }));

      if (this.patients.length > 0) {
        this.selectedPatientId = this.patients[0].id; // patient par défaut
        this.loadSessions();
      }
    } else {
      // Patient → afficher ses propres séances
      this.selectedPatientId = this.userId;
      this.loadSessions();
    }
  }

  constructor(
    private storage: StorageService,
    private db: DatabaseService,
    private router: Router
  ) { }

  async loadSessions() {
    const db = await this.db.get();

    this.sessions = db.sessions
      .filter((s: Session) => s.id_patient === +this.selectedPatientId)
      .sort(((a: any, b: any) => {
        // trier par date + heure
        const [d1, m1, y1] = a.date.split("/").map(Number);
        const [d2, m2, y2] = b.date.split("/").map(Number);
        const t1 = new Date(y1, m1 - 1, d1, ...a.time.split(":").map(Number)).getTime();
        const t2 = new Date(y2, m2 - 1, d2, ...b.time.split(":").map(Number)).getTime();
        return t2 - t1; // décroissant
      }));
  }
}
