import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ViewWillEnter, IonModal } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { BackButtonComponent } from 'src/app/components/back-button/back-button.component';

import { StorageService } from 'src/app/services/storage';
import { DatabaseService, User, Appointment } from 'src/app/services/database';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, BackButtonComponent, IonModal]
})
export class PlanningPage implements ViewWillEnter {
  lang: string = "";
  userId: number = 0;
  userType: number = 0;

  appointments: Appointment[] = [];
  pendingAppointments: Appointment[] = [];

  currentMonth: number = 0;   // 0 = janvier
  currentYear: number = 0;

  calendar: any[] = [];   // structure du calendrier

  dayModalOpen: boolean = false;
  selectedDate: string = "";
  selectedWaiting: Appointment[] = [];
  selectedConfirmed: Appointment[] = [];

  specialists: User[] = [];
  timeSlots: string[] = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  formSpecialist: number = 0;
  formTime: string = "";
  formReason: string = "";

  async ionViewWillEnter() {
    this.lang = await this.storage.get("lang");  
    this.userId = await this.storage.get("user");  

    if (!this.userId) {
      this.router.navigate(["login"]);
      return;
    }

    const users = await this.db.getTable("users");
    const user: User = users.find((u: User) => u.id === this.userId);
    this.userType = user.id_type;

    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();

    const db = await this.db.get();

    this.appointments = db.appointments.filter((a: Appointment) =>
      this.userType === 1
        ? a.id_patient === this.userId
        : a.id_specialist === this.userId
    );

    if (this.userType === 2) {
      this.pendingAppointments = this.appointments.filter(a => a.id_state === 1);
    }

    this.buildCalendar();
  }

  constructor(
    private storage: StorageService,
    private db: DatabaseService,
    private router: Router
  ) { }

  buildCalendar() {
    this.calendar = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startDay = (firstDay.getDay() + 6) % 7; // transformer dimanche=0 → dimanche=6

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    let dayCounter = 1;
    let nextMonthDay = 1;

    // 6 lignes de calendrier (toujours sûr)
    for (let week = 0; week < 6; week++) {
      const row: any[] = [];

      for (let day = 0; day < 7; day++) {

        let dateNumber;
        let inMonth = true;

        const index = week * 7 + day;

        if (index < startDay) {
          // jours du mois précédent
          dateNumber = daysPrevMonth - (startDay - index - 1);
          inMonth = false;
        } else if (dayCounter > daysInMonth) {
          // jours du mois suivant
          dateNumber = nextMonthDay++;
          inMonth = false;
        } else {
          // jour du mois courant
          dateNumber = dayCounter++;
        }

        const dateObj = new Date(this.currentYear, this.currentMonth, inMonth ? dateNumber : 1);
        const formatted = this.formatDate(dateObj);

        const dayAppointments = this.appointments.filter(a => a.date === formatted);

        row.push({
          date: formatted,
          number: dateNumber,
          inMonth,
          state: this.resolveDayState(dayAppointments)
        });
      }

      this.calendar.push(row);
    }
  }

  resolveDayState(appts: Appointment[]): 'none' | 'waiting' | 'confirmed' {
    if (!appts.length) return 'none';

    const hasConfirmed = appts.some(a => a.id_state === 2);
    if (hasConfirmed) return 'confirmed';

    const hasWaiting = appts.some(a => a.id_state === 1);

    if (this.userType === 1) {
      if (hasWaiting) return 'waiting';
    }

    return 'none';
  }

  formatDate(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.buildCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.buildCalendar();
  }

  getPatientName(id_patient: number): string {
    const users = this.db.db.users;
    const patient = users.find((u: User) => u.id === id_patient);
    return patient ? `${patient.firstName} ${patient.lastName}` : '';
  }

  // Accepter un rdv
  async accept(appt: Appointment) {
    // 1. Modifier en local
    appt.id_state = 2;

    // 2. Mettre à jour la BDD
    const db = await this.db.get();
    const index = db.appointments.findIndex((a: Appointment) => a.id === appt.id);
    if (index !== -1) {
      db.appointments[index].id_state = 2; // confirmé
    }

    // 3. Sauvegarder la BDD
    await this.db.update(db);

    // 4. Recharger les données
    await this.updateAppointments();
  }

  // Refuser un rdv
  async refuse(appt: Appointment) {
    // 1. Supprimer dans la BDD
    const db = await this.db.get();
    db.appointments = db.appointments.filter((a: Appointment) => a.id !== appt.id);

    // 2. Sauvegarder
    await this.db.update(db);

    // 3. Recharger les données
    await this.updateAppointments();
  }

  async updateAppointments() {
    const db = await this.db.get();

    // Recharger les rendez-vous du user
    this.appointments = db.appointments.filter((a: Appointment) =>
      this.userType === 1
        ? a.id_patient === this.userId
        : a.id_specialist === this.userId
    );

    this.pendingAppointments = this.appointments.filter(a => a.id_state === 1);

    // Reconstruire le calendrier
    this.buildCalendar();
  }

  openDayModal(day: any) {
    if (!day.inMonth) return;

    this.selectedDate = day.date;

    this.selectedWaiting = this.appointments.filter(a => 
      a.date === day.date && a.id_state === 1
    );

    this.selectedConfirmed = this.appointments.filter(a => 
      a.date === day.date && a.id_state === 2
    );

    // Charger la liste des spécialistes si client
    if (this.userType === 1) {
      this.specialists = this.db.db.users.filter((u: User) => u.id_type === 2);
      this.formSpecialist = this.specialists[0]?.id;
      this.formTime = this.timeSlots[0];
    }

    this.dayModalOpen = true;
  }

  async cancelAppointment(appt: Appointment) {
    const db = await this.db.get();
    db.appointments = db.appointments.filter((a: Appointment) => a.id !== appt.id);
    await this.db.update(db);
    await this.updateAppointments();
    this.openDayModal({ date: this.selectedDate, inMonth: true }); // refresh
  }

  async createAppointment() {
    const db = await this.db.get();

    const newId = Math.max(...db.appointments.map((a: Appointment) => a.id), 0) + 1;

    db.appointments.push({
      id: newId,
      id_patient: this.userId,
      id_specialist: Number(this.formSpecialist),
      date: this.selectedDate,
      time: this.formTime,
      reason: this.formReason,
      id_state: 1 // en attente
    });

    await this.db.update(db);
    await this.updateAppointments();

    this.dayModalOpen = false;
  }

  getSpecialistName(id_specialist: number): string {
    const users = this.db.db.users;
    const specialist = users.find((u: User) => u.id === id_specialist);
    return specialist ? `${specialist.firstName} ${specialist.lastName}` : '';
  }

  closeModal() {
    this.formReason = "";
    this.formSpecialist = 0;
    this.formTime = "";

    this.dayModalOpen = false;
  }
}
