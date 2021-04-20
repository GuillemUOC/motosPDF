import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { FilterUsers } from '../interfaces/filter-users.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private itemsCollection: AngularFirestoreCollection<any>;
  public allUsers: UserModel[] = [];
  public users: UserModel[] = [];
  public filters: FilterUsers;

  constructor(private fs: AngularFirestore) { }

  getUsers(): Observable<UserModel[]> {
    this.allUsers = [];
    this.users = [];

    this.itemsCollection = this.fs.collection<UserModel>('usuarios');
    return this.itemsCollection.valueChanges()
      .pipe(
        map((users: UserModel[]) => {
          this.allUsers = users;
          return this.filter(this.filters);
        })
      );
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

}
