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

  async getMotos(userId: string): Promise<MotoModel[]> {
    this.motos = [];
    const motos = await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('user', '==', userId));
    return this.motos = motos;
  }

  async isRegistrationRepeated(registration: string, userId: string, motoId?: string): Promise<boolean> {
    const motos = await this.firebase.getElments(this.collection, ref => ref.where('user', '==', userId));
    return motos.some(moto => moto.id !== motoId && moto.registration === registration);
  }
}
