import { Injectable } from '@angular/core';

import { StorageService } from './storage';

export interface User {
  id: number;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  id_type: number;
}

export interface UserType {
  id: number;
  typeFR: string;
  typeEN: string;
}

export interface Appointment {
  id: number;
  id_patient: number;
  id_specialist: number;
  date: string;
  time: string;
  reason: string;
  id_state: number;
}

export interface AppointmentState {
  id: number;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  db: any = {
    users: [
      { id: 1, login: "alice.d", password: "Alice123!", firstName: "Alice", lastName: "Dupont", id_type: 1 },
      { id: 2, login: "bob.m", password: "Bob12345!", firstName: "Bob", lastName: "Martin", id_type: 1 },
      { id: 3, login: "carol.s", password: "Carol123!", firstName: "Carol", lastName: "Simon", id_type: 1 },

      { id: 4, login: "john", password: "DrJohn2025!", firstName: "John", lastName: "Doe", id_type: 2 },
      { id: 5, login: "emma", password: "Emma2025!", firstName: "Emma", lastName: "Durand", id_type: 2 },
      { id: 6, login: "olivier", password: "Olivier2025!", firstName: "Olivier", lastName: "Petit", id_type: 2 }
    ],
    userTypes: [
      { id: 1, typeFR: "Patient", typeEN: "Patient" },
      { id: 2, typeFR: "Spécialiste", typeEN: "Specialist" }
    ],
    appointments: [
      // --- NOVEMBRE 2025 ---
      { id: 1, id_patient: 1, id_specialist: 4, date: "03/11/2025", time: "09:00", reason: "Douleurs lombaires", id_state: 1 },
      { id: 2, id_patient: 2, id_specialist: 5, date: "04/11/2025", time: "11:00", reason: "Fatigue persistante", id_state: 2 },
      { id: 3, id_patient: 3, id_specialist: 6, date: "05/11/2025", time: "15:00", reason: "Suivi", id_state: 1 },

      { id: 4, id_patient: 1, id_specialist: 5, date: "06/11/2025", time: "10:00", reason: "", id_state: 2 },
      { id: 5, id_patient: 2, id_specialist: 4, date: "07/11/2025", time: "14:00", reason: "Douleurs cervicales", id_state: 1 },
      { id: 6, id_patient: 3, id_specialist: 4, date: "08/11/2025", time: "16:00", reason: "", id_state: 2 },

      { id: 7, id_patient: 1, id_specialist: 6, date: "13/11/2025", time: "09:00", reason: "", id_state: 1 },
      { id: 8, id_patient: 2, id_specialist: 5, date: "14/11/2025", time: "10:00", reason: "", id_state: 2 },
      { id: 9, id_patient: 3, id_specialist: 6, date: "15/11/2025", time: "13:00", reason: "Contrôle trimestriel", id_state: 1 },

      { id: 10, id_patient: 1, id_specialist: 4, date: "20/11/2025", time: "12:00", reason: "Retour du mal de dos", id_state: 1 },
      { id: 11, id_patient: 1, id_specialist: 4, date: "27/11/2025", time: "13:00", reason: "", id_state: 2 },

      // --- DÉCEMBRE 2025 ---
      { id: 12, id_patient: 1, id_specialist: 5, date: "01/12/2025", time: "09:00", reason: "", id_state: 1 },
      { id: 13, id_patient: 2, id_specialist: 6, date: "02/12/2025", time: "11:00", reason: "Migraine", id_state: 2 },
      { id: 14, id_patient: 3, id_specialist: 4, date: "03/12/2025", time: "14:00", reason: "Suivi général", id_state: 1 },

      { id: 15, id_patient: 1, id_specialist: 4, date: "05/12/2025", time: "15:00", reason: "Douleur épaule", id_state: 2 },
      { id: 16, id_patient: 2, id_specialist: 5, date: "06/12/2025", time: "16:00", reason: "", id_state: 1 },
      { id: 17, id_patient: 3, id_specialist: 6, date: "07/12/2025", time: "12:00", reason: "Problème de posture", id_state: 2 },

      { id: 18, id_patient: 1, id_specialist: 5, date: "12/12/2025", time: "10:00", reason: "Suivi", id_state: 1 },
      { id: 19, id_patient: 2, id_specialist: 4, date: "13/12/2025", time: "09:00", reason: "Douleurs articulaires", id_state: 2 },
      { id: 20, id_patient: 3, id_specialist: 6, date: "14/12/2025", time: "13:00", reason: "", id_state: 1 },

      { id: 21, id_patient: 1, id_specialist: 4, date: "20/12/2025", time: "11:00", reason: "Maux de tête", id_state: 2 },
      { id: 22, id_patient: 2, id_specialist: 5, date: "21/12/2025", time: "14:00", reason: "", id_state: 1 },
      { id: 23, id_patient: 3, id_specialist: 4, date: "22/12/2025", time: "16:00", reason: "Fatigue chronique", id_state: 2 },

      // --- JANVIER 2026 ---
      { id: 24, id_patient: 1, id_specialist: 6, date: "03/01/2026", time: "09:00", reason: "", id_state: 1 },
      { id: 25, id_patient: 2, id_specialist: 4, date: "04/01/2026", time: "11:00", reason: "Suivi", id_state: 2 },
      { id: 26, id_patient: 3, id_specialist: 5, date: "05/01/2026", time: "15:00", reason: "Tensions musculaires", id_state: 1 },

      { id: 27, id_patient: 1, id_specialist: 4, date: "10/01/2026", time: "10:00", reason: "Reprise du suivi", id_state: 2 },
      { id: 28, id_patient: 2, id_specialist: 6, date: "11/01/2026", time: "13:00", reason: "Problème de sommeil", id_state: 1 },
      { id: 29, id_patient: 3, id_specialist: 5, date: "12/01/2026", time: "14:00", reason: "", id_state: 2 },

      { id: 30, id_patient: 1, id_specialist: 5, date: "17/01/2026", time: "16:00", reason: "Fatigue", id_state: 1 },
      { id: 31, id_patient: 2, id_specialist: 4, date: "18/01/2026", time: "09:00", reason: "Contrôle général", id_state: 2 },
      { id: 32, id_patient: 3, id_specialist: 6, date: "19/01/2026", time: "12:00", reason: "Stress", id_state: 1 },

      { id: 33, id_patient: 1, id_specialist: 4, date: "24/01/2026", time: "14:00", reason: "", id_state: 2 },
      { id: 34, id_patient: 2, id_specialist: 5, date: "25/01/2026", time: "15:00", reason: "Vertiges", id_state: 1 },
      { id: 35, id_patient: 3, id_specialist: 4, date: "26/01/2026", time: "11:00", reason: "Tensions musculaires", id_state: 2 }
    ],
    appointmentStates: [
      { id: 1, stateFR: "En attente de confirmation", stateEN: "Waiting for confirmation" },
      { id: 2, stateFR: "Confirmé", stateEN: "Confirmed" }
    ]
  };

  constructor(
    private storage: StorageService
  ) { }

  async get() {
    return await this.storage.get("db") || this.db;
  }

  async update(db: any) {
    await this.storage.set("db", db);
  }

  async updateTable(tableName: string, table: any) {
    let db = await this.get();
    db[tableName] = table;
    await this.storage.set("db", db); 
  }

  async getTable(tableName: string) {
    let db = await this.get();
    return db[tableName];
  }
}