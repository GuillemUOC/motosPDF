import { Injectable } from '@angular/core';
import { MotoModel } from '../models/moto.model';
import { Commons } from '../utils/commons.util';
import { FirebaseService } from './firebase.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MotosService {
  public collection = 'motos';

  constructor(private commons: Commons, private firebase: FirebaseService,  private usersService: UsersService) { }

  getMoto(id: string): Promise<MotoModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getMotos(userId: string): Promise<MotoModel[]> {
    return await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('user', '==', userId));
  }

  async isRegistrationRepeated(registration: string, userId: string, motoId?: string): Promise<boolean> {
    const motos = await this.firebase.getElments(this.collection, ref => ref.where('user', '==', userId));
    return motos.some(moto => moto.id !== motoId && moto.registration === registration);
  }

  async createMoto(moto: MotoModel): Promise<any> {
    if (await this.isRegistrationRepeated(moto.registration, moto.user, moto.id)) {
      return Promise.reject();
    }
    await this.firebase.create(this.collection, moto);
    await this.usersService.actualizeMotos(moto.user);
  }

  async updateMoto(moto: MotoModel): Promise<any> {
    if (moto.registration && moto.user && await this.isRegistrationRepeated(moto.registration, moto.user, moto.id)) {
      return Promise.reject();
    }
    return this.firebase.update(this.collection, moto);
  }

  async deleteMoto(id: string): Promise<any> {
    const moto = await this.getMoto(id);
    await this.firebase.delete(this.collection, id);
    await this.usersService.actualizeMotos(moto.user);
  }

}
