import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FilterUsers } from '../interfaces/filter-users.interface';
import { Commons } from '../utils/commons.util';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public allUsers: UserModel[] = [];
  public users: UserModel[] = [];
  public filters: FilterUsers;

  constructor(private fs: AngularFirestore, private commons: Commons) { }

  getUser(id: string): Promise<UserModel> | any {
    const itemsCollection = this.fs.collection<UserModel>('usuarios')
      .doc(id).get().pipe(map(data => {
        const user = data.data();
        if (user) {
          user.id = id;
        }
        return user;
      }));

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: deprecation
      itemsCollection.pipe(first()).subscribe((user) => resolve(user), reject);
    });
  }

  getUsers(): Promise<UserModel[]> {
    this.allUsers = [];
    this.users = [];

    const itemsCollection = this.fs.collection<UserModel>('usuarios', ref => {
      return ref.orderBy('timestamp', 'desc');
    }).snapshotChanges()
      .pipe(map(data => {
        const users = this.snapUser(data);
        this.allUsers = users;
        return this.filter(this.filters);
      }));

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: deprecation
      itemsCollection.pipe(first()).subscribe((users) => resolve(users), reject);
    });
  }

  filter(filters?: FilterUsers): UserModel[] {
    if (!filters) {
      this.users = [...this.allUsers];
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

  snapUser(data: any): UserModel[] {
    return data.map((a: any) => {
      // tslint:disable-next-line: no-shadowed-variable
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  }

  isDniRepeated(dni: string, id?: string): Promise<boolean> {
    return new Promise(resolve => {
      const itemsCollection = this.fs.collection<UserModel>('usuarios', ref =>
        ref.where('dni', '==', dni)
      );
      itemsCollection.snapshotChanges()
        .pipe(first(), map(data => this.snapUser(data)))
        // tslint:disable-next-line: deprecation
        .subscribe(users => {
          const repeated = !!users.filter(user => user.id !== id).length;
          resolve(repeated);
        });
    });
  }

  async createUser(user: UserModel): Promise<any> {
    const userCopy = this.commons.copyObject(user);
    delete userCopy.id;
    const itemsCollection = this.fs.collection<UserModel>('usuarios');
    const repeated = await this.isDniRepeated(user.dni);
    return !repeated ? itemsCollection.add(userCopy) : Promise.reject();
  }

  async updateUser(user: UserModel): Promise<any> {
    const itemsCollection = this.fs.collection<UserModel>('usuarios');
    const userCopy = this.commons.copyObject(user);
    delete userCopy.id;
    const repeated = await this.isDniRepeated(user.dni, user.id);
    return !repeated ? itemsCollection.doc(user.id).update(userCopy) : Promise.reject();
  }

  deleteUser(id: string): Promise<any> {
    const itemsCollection = this.fs.collection<UserModel>('usuarios');
    const promiseDelete = itemsCollection.doc(id).delete();
    promiseDelete.then(() => {
      this.allUsers.splice(this.allUsers.findIndex(user => user.id === id), 1);
      this.users.splice(this.users.findIndex(user => user.id === id), 1);
    });
    return promiseDelete;
  }

}
