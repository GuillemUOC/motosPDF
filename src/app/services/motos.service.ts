import { Injectable, Injector } from '@angular/core';
import { MotoModel } from '../models/moto.model';
import { FirebaseService } from './firebase.service';
import { TreatmentsService } from './treatments.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MotosService {
  public collection = 'motos';

  constructor(private firebase: FirebaseService,  private usersService: UsersService, private injector: Injector) { }

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

  async updateMoto(moto: any): Promise<any> {
    if (moto.registration && moto.user && await this.isRegistrationRepeated(moto.registration, moto.user, moto.id)) {
      return Promise.reject();
    }
    return this.firebase.update(this.collection, moto);
  }

  async deleteMoto(id: string, actualize = true): Promise<any> {
    const moto = await this.getMoto(id);
    await this.firebase.delete(this.collection, id);
    const treatmentsService = this.injector.get(TreatmentsService);
    treatmentsService.getTreatments(id).then((treatments) =>
      treatments.forEach(async treatment => treatmentsService.deleteTreatment(treatment.id, false))
    );

    if (actualize) {
      await this.usersService.actualizeMotos(moto.user);
    }
  }

  async actualizeTreatments(id: string): Promise<any> {
    const treatmentsService = this.injector.get(TreatmentsService);
    const treatments = await treatmentsService.getTreatments(id);
    const moto = {
      id,
      treatments: treatments.length
    };
    this.updateMoto(moto);
  }
}

