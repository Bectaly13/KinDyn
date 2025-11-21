import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  db: any = {
    "users": [
      { "id": 1, "login": "alice.p", "password": "Alice123!", "firstName": "Alice", "lastName": "Dupont", "id_type": 1 },
      { "id": 2, "login": "bob.m", "password": "Bob12345!", "firstName": "Bob", "lastName": "Martin", "id_type": 1 },
      { "id": 3, "login": "carol.s", "password": "Carol123!", "firstName": "Carol", "lastName": "Simon", "id_type": 1 },

      { "id": 4, "login": "dr.john", "password": "DrJohn2025!", "firstName": "John", "lastName": "Doe", "id_type": 2 },
      { "id": 5, "login": "dr.emma", "password": "Emma2025!", "firstName": "Emma", "lastName": "Durand", "id_type": 2 },
      { "id": 6, "login": "dr.olivier", "password": "Olivier2025!", "firstName": "Olivier", "lastName": "Petit", "id_type": 2 }
    ],
    "userTypes": [
      { "id": 1, "type": "Patient" },
      { "id": 2, "type": "Spécialiste" }
    ]
  };
}