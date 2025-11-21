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
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  db: any = {
    "users": [
      { "id": 1, "login": "alice.p", "password": "Alice123!", "firstName": "Alice", "lastName": "Dupont", "id_type": 1 },
      { "id": 2, "login": "bob.m", "password": "Bob12345!", "firstName": "Bob", "lastName": "Martin", "id_type": 1 },
      { "id": 3, "login": "carol.s", "password": "Carol123!", "firstName": "Carol", "lastName": "Simon", "id_type": 1 },

      { "id": 4, "login": "john", "password": "DrJohn2025!", "firstName": "John", "lastName": "Doe", "id_type": 2 },
      { "id": 5, "login": "emma", "password": "Emma2025!", "firstName": "Emma", "lastName": "Durand", "id_type": 2 },
      { "id": 6, "login": "olivier", "password": "Olivier2025!", "firstName": "Olivier", "lastName": "Petit", "id_type": 2 }
    ],
    "userTypes": [
      { "id": 1, "type": "Patient" },
      { "id": 2, "type": "Spécialiste" }
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