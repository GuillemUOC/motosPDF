import { Component, Injectable } from '@angular/core';
import { FilterUsers } from '../interfaces/filter-users.interface';
import { Commons } from '../utils/commons.util';
import { UserModel } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { MotosService } from './motos.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public collection = 'users';
  public filters: FilterUsers;
  public page = 1;

  constructor(private commons: Commons, private firebase: FirebaseService, private motosService: MotosService) { }

  getUser(id: string): Promise<UserModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getUsers(filters?: FilterUsers, overwriteFilters: boolean = true): Promise<UserModel[]> {
    // tslint:disable-next-line: prefer-const
    let [users, motos] = await Promise.all([
      await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc')),
      await this.firebase.getElments(this.motosService.collection)
    ]);

    if (filters) {
      users = users.filter(user => (
        Object.entries(filters).some(([key, value]) => (
          value && String(user[key]).toLowerCase().includes(String(value).toLowerCase())
        ))
      ));
    }
    if (overwriteFilters) {
      this.filters = filters;
    }

    this.firebase.setRelationsNumber(users, motos, 'user', 'motos');
    return users;
  }

  async isDniRepeated(dni: string, id?: string): Promise<boolean> {
    const users = await this.firebase.getElments(this.collection, ref => ref.where('dni', '==', dni));
    return users.some(user => user.id !== id);
  }

  async createUser(user: UserModel): Promise<any> {
    if (await this.isDniRepeated(user.dni, user.id)) {
      return Promise.reject();
    }
    return this.firebase.create(this.collection, user);
  }

  async updateUser(user: any): Promise<any> {
    if (user.dni && await this.isDniRepeated(user.dni, user.id)) {
      return Promise.reject();
    }
    return this.firebase.update(this.collection, user);
  }

  async deleteUser(id: string): Promise<any> {
    await this.firebase.delete(this.collection, id);
    this.firebase.getElments(this.motosService.collection, ref => ref.where('user', '==', id))
      .then(motos => motos.forEach(async moto => await this.motosService.deleteMoto(moto.id)));
  }

  resetConfiguration(): void {
    this.page = 1;
    this.filters = null;
    console.log(this.page);
  }

  setPage(page: number): void {
    this.page = page;
  }

  getPage(): number {
    return this.page;
  }

}

