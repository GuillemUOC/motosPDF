import { Injectable } from '@angular/core';
import { MotoModel } from '../models/moto.model';
import { FirebaseService } from './firebase.service';
import { TreatmentsService } from './treatments.service';

@Injectable({
  providedIn: 'root'
})
export class MotosService {
  public collection = 'motos';

  constructor(private firebase: FirebaseService, private treatmentsService: TreatmentsService) { }

  getMoto(id: string): Promise<MotoModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getMotos(userId: string): Promise<MotoModel[]> {
    const [motos, treatments] = await Promise.all([
      this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('user', '==', userId)),
      this.firebase.getElments(this.treatmentsService.collection)
    ]);

    this.firebase.setRelationsNumber(motos, treatments, 'moto', 'treatments');
    return motos;
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
  }

  async updateMoto(moto: any): Promise<any> {
    if (moto.registration && moto.user && await this.isRegistrationRepeated(moto.registration, moto.user, moto.id)) {
      return Promise.reject();
    }
    return this.firebase.update(this.collection, moto);
  }

  async deleteMoto(id: string): Promise<any> {
    const moto = await this.getMoto(id);
    await this.firebase.delete(this.collection, id);
    this.firebase.getElments(this.treatmentsService.collection, ref => ref.where('moto', '==', id))
      .then((treatments) => treatments.forEach(async treatment => this.treatmentsService.deleteTreatment(treatment.id)));
  }
}

