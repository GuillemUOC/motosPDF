import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { FilterUsers } from '../interfaces/filter-users.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public allUsers: UserModel[] = [];
  public users: UserModel[] = [];
  public filters: FilterUsers;

  constructor(private fs: AngularFirestore) { }

  getUsers(): Observable<UserModel[]> {
    this.allUsers = [];
    this.users = [];

    const itemsCollection = this.fs.collection<UserModel>('usuarios');
    return itemsCollection.snapshotChanges()
      .pipe(map(data => {
        const users = this.snapUser(data);
        this.allUsers = users;
        return this.filter(this.filters);
      }));
  }

  snapUser(data: any): UserModel[] {
    return data.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    })
  }

  filter(filters?: FilterUsers): UserModel[] {
    if (!filters) {
      this.users = this.allUsers;
    } else {
      this.users = this.allUsers.filter(user => (
        Object.entries(filters).some(([key, value]) => (
          value && String(user[key]).toLowerCase().includes(String(value).toLowerCase())
        ))
      ));
    }

    this.filters = filters;
    return this.users;
  }

  isDniRepeated(dni: string, id?: string): Promise<boolean> {
    return new Promise(resolve => {
      const itemsCollection = this.fs.collection<UserModel>('usuarios', ref =>
        ref.where("dni", "==", dni)
      );
      itemsCollection.snapshotChanges()
        .pipe(map(data => this.snapUser(data)))
        .subscribe(users => {
          const repeated = !!users.filter(user => user.id != id).length;
          resolve(repeated);
        })
    });
  }

}
