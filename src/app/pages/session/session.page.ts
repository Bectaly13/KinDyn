import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, ViewWillEnter, AlertController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';

import { DatabaseService, SessionData, Exercise } from 'src/app/services/database';
import { StorageService } from 'src/app/services/storage';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, HeaderComponent]
})
export class SessionPage implements ViewWillEnter {

  lang: string = 'FR';

  sessionId!: number;
  sessionData: SessionData = {
    id: 0,
    type: 0,
    code: "",
    titleFR: "",
    titleEN: "",
    content: []
  };

  exercises: Exercise[] = [];
  currentExerciseIndex = 0;
  currentExercise!: Exercise;

  remainingTime = 0;
  timer: any;
  isPaused = false;

  score = 50;
  scoreInterval: any;

  async ionViewWillEnter() {
    this.lang = await this.storage.get('lang') || 'FR';

    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.sessionId) {
      this.router.navigate(['session-selection']);
      return;
    }

    const sessionDatas = await this.db.getTable('sessionDatas');
    const exercisesTable = await this.db.getTable('exercises');

    this.sessionData = sessionDatas.find((s: SessionData) => s.id === this.sessionId);
    if (!this.sessionData) {
      this.router.navigate(['session-selection']);
      return;
    }

    this.exercises = exercisesTable.filter((e: Exercise) =>
      this.sessionData.content.includes(e.id)
    );

    this.loadExercise();
    this.startScoreSimulation();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private storage: StorageService,
    private alertController: AlertController
  ) {}

  get isLastExercise() {
    return this.currentExerciseIndex === this.exercises.length - 1;
  }

  loadExercise() {
    this.clearTimer();

    this.currentExercise = this.exercises[this.currentExerciseIndex];
    this.remainingTime = this.currentExercise.duration;
    this.isPaused = false;

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
          this.nextExercise();
        }
      }
    }, 1000);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  nextExercise() {
    this.clearTimer();

    if (this.isLastExercise) {
      this.router.navigate(['session-end', this.sessionId], {queryParams: {score: this.score}});
    } else {
      this.currentExerciseIndex++;
      this.loadExercise();
    }
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async openAlert() {
    const message: any = {
      FR: "Êtes-vous sûre de vouloir quitter la séance ?",
      EN: "Are you sure you want to abort the session?"
    };
    const no: any = {
      FR: "Non",
      EN: "No"
    }
    const yes: any = {
      FR: "Oui",
      EN: "Yes"
    }
    this.alertController.create({
      header: 'Erreur',
      message: message[this.lang],
      buttons: [
        {
          text: no[this.lang],
          role: "cancel"
        },
        {
          text: yes[this.lang],
          handler: async () => {this.router.navigate(["session-selection"]);}
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  get scoreColor() {
    if (this.score <= 30) return 'var(--session-score-red)';
    else if (this.score <= 70) return 'var(--session-score-yellow)';
    else return 'var(--session-score-green)';
  }

  startScoreSimulation() {
    this.score = 50;
    this.scoreInterval = setInterval(() => {
      if(!this.isPaused) {
        // fluctuation aléatoire entre -2 et +3
        const change = Math.floor(Math.random() * 6) - 2;
        this.score = Math.max(0, Math.min(100, this.score + change));
      }
    }, 1000);
  }

  stopScoreSimulation() {
    if (this.scoreInterval) {
      clearInterval(this.scoreInterval);
      this.scoreInterval = null;
    }
  }
}