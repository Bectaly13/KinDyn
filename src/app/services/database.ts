import { Injectable } from '@angular/core';

import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  db: any = {
    "users": [
      {"id": 1, "login": "patient1", "password": "patient1", "firstName": "Prenom1", "lastName": "Nom1", "id_type": 1},
      {"id": 2, "login": "patient2", "password": "patient2", "firstName": "Prenom2", "lastName": "Nom2", "id_type": 1},
      {"id": 3, "login": "patient3", "password": "patient3", "firstName": "Prenom3", "lastName": "Nom3", "id_type": 1},

      {"id": 4, "login": "spec1", "password": "spec1", "firstName": "SpecPrenom1", "lastName": "SpecNom1", "id_type": 2},
      {"id": 5, "login": "spec2", "password": "spec2", "firstName": "SpecPrenom2", "lastName": "SpecNom2", "id_type": 2},
      {"id": 6, "login": "spec3", "password": "spec3", "firstName": "SpecPrenom3", "lastName": "SpecNom3", "id_type": 2}
    ],
    "userTypes": [
      {"id": 1, "type": "Patient"},
      {"id": 2, "type": "Spécialiste"}
    ]
  }

  constructor(
    private storage: StorageService
  ) { }

  update() {
    this.storage.set("db", this.db);
  }
}
