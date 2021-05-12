import { Injectable } from '@angular/core';
import { FilterUsers } from '../interfaces/filter-users.interface';
import { Commons } from '../utils/commons.util';
import { UserModel } from '../models/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public collection = 'users';
  public allUsers: UserModel[] = [];
  public users: UserModel[] = [];
  public filters: FilterUsers;
  public page = 1;

  constructor(private commons: Commons, private firebase: FirebaseService) { }

  getUser(id: string): Promise<UserModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getUsers(): Promise<UserModel[]> {
    this.allUsers = [];
    this.users = [];

    const users = await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc'));
    this.allUsers = users;
    return this.filter(this.filters);
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

  async isDniRepeated(dni: string, id?: string): Promise<boolean> {
    const users = await this.firebase.getElments(this.collection, ref => ref.where('dni', '==', dni));
    return users.some(user => user.id !== id);
  }

  async createUser(user: UserModel): Promise<any> {
    const repeated = await this.isDniRepeated(user.dni);
    return !repeated ? this.firebase.create(this.collection, user) : Promise.reject();
  }

  async updateUser(user: UserModel): Promise<any> {
    const userCopy = this.commons.copyObject(user);
    delete userCopy.timestamp;
    delete userCopy.motos;

    const repeated = await this.isDniRepeated(user.dni, user.id);
    return !repeated ? this.firebase.update(this.collection, userCopy) : Promise.reject();
  }

  deleteUser(id: string): Promise<any> {
    const promiseDelete = this.firebase.delete(this.collection, id);
    promiseDelete.then(() => {
      this.allUsers.splice(this.allUsers.findIndex(user => user.id === id), 1);
      this.users.splice(this.users.findIndex(user => user.id === id), 1);
    });
    return promiseDelete;
  }

  async actualizeMotosOfUser(id: string): Promise<any> {
    // const promiseUser = this.getUser(id);
    // const promiseMotos = this.firebase.getElments('motos', ref => ref.where('user', '==', id));
    // const [user, motos] = await Promise.all([promiseUser, promiseMotos]);

    // if (!user) {
    //   return;
    // }


    // user.motos = motos.length;
    // this.updateUser
  }

  resetConfiguration(): void {
    this.page = 1;
    this.filters = null;
  }

}
