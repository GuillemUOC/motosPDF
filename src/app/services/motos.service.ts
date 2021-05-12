import { Injectable } from '@angular/core';
import { MotoModel } from '../models/moto.model';
import { Commons } from '../utils/commons.util';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class MotosService {
  public collection = 'motos';
  public motos: MotoModel[] = [];

  constructor(private commons: Commons,  private firebase: FirebaseService) { }

  getMoto(id: string): Promise<MotoModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getMotos(userId: string): Promise<MotoModel[]> {
    this.motos = [];
    const motos = await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('user', '==', userId));
    return this.motos = motos;
  }

  async isRegistrationRepeated(registration: string, userId: string, motoId?: string): Promise<boolean> {
    const motos = await this.firebase.getElments(this.collection, ref => ref.where('user', '==', userId));
    return motos.some(moto => moto.id !== motoId && moto.registration === registration);
  }

  async createMoto(moto: MotoModel): Promise<any> {
    const repeated = await this.isRegistrationRepeated(moto.registration, moto.user, moto.id);
    return !repeated ? this.firebase.create(this.collection, moto) : Promise.reject();
  }

  async updateMoto(moto: MotoModel): Promise<any> {
    const motoCopy = this.commons.copyObject(moto);
    delete motoCopy.timestamp;
    delete motoCopy.treatments;

    const repeated = await this.isRegistrationRepeated(moto.registration, moto.user, moto.id);
    return !repeated ? this.firebase.update(this.collection, motoCopy) : Promise.reject();
  }

  deleteMoto(id: string): Promise<any> {
    const promiseDelete = this.firebase.delete(this.collection, id);
    promiseDelete.then(() => {
      this.motos.splice(this.motos.findIndex(moto => moto.id === id), 1);
    });
    return promiseDelete;
  }

}
