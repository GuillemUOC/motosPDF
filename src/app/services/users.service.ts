import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterUsers } from '../interfaces/filter-users.interface';
import { User } from '../interfaces/user.interface';
import { Commons } from '../utils/commons.util';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public allUsers: User[] = [];
  public users: User[] = [];
  public filters: FilterUsers;

  constructor(private fs: AngularFirestore, private commons: Commons) { }

  getUsers(): Observable<User[]> {
    this.allUsers = [];
    this.users = [];

    const itemsCollection = this.fs.collection<User>('usuarios');
    return itemsCollection.snapshotChanges()
      .pipe(map(data => {
        const users = this.snapUser(data);
        this.allUsers = users;
        return this.filter(this.filters);
      }));
  }

  snapUser(data: any): User[] {
    return data.map((a: any) => {
      // tslint:disable-next-line: no-shadowed-variable
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  }

  filter(filters?: FilterUsers): User[] {
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
      const itemsCollection = this.fs.collection<User>('usuarios', ref =>
        ref.where('dni', '==', dni)
      );
      itemsCollection.snapshotChanges()
        .pipe(map(data => this.snapUser(data)))
        // tslint:disable-next-line: deprecation
        .subscribe(users => {
          const repeated = !!users.filter(user => user.id !== id).length;
          resolve(repeated);
        });
    });
  }

  createUser(user: User): Promise<any> {
    const itemsCollection = this.fs.collection<User>('usuarios');
    return itemsCollection.add(user);
  }

  updateUser(user: User): Promise<any> {
    const itemsCollection = this.fs.collection<User>('usuarios');
    const newUser = this.commons.copyObject(user);
    delete newUser.id;
    return itemsCollection.add(newUser);
  }

  deleteUser(id: string): Promise<any> {
    const itemsCollection = this.fs.collection<User>('usuarios');
    return itemsCollection.doc(id).delete();
  }

}
