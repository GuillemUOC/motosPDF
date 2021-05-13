import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { TreatmentModel } from '../models/treatment.model';
import { MotosService } from './motos.service';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  public collection = 'treatments';

  constructor(private firebase: FirebaseService,  private motosService: MotosService) { }

  getTreatment(id: string): Promise<TreatmentModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  async getTreatments(motoId: string): Promise<TreatmentModel[]> {
    return await this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('moto', '==', motoId));
  }

  async createTreatment(treatment: TreatmentModel): Promise<any> {
    await this.firebase.create(this.collection, treatment);
    await this.motosService.actualizeTreatments(treatment.moto);
  }

  updateTreatment(treatment: TreatmentModel): Promise<any> {
    return this.firebase.update(this.collection, treatment);
  }

  async deleteTreatment(id: string): Promise<any> {
    const treatment = await this.getTreatment(id);
    await this.firebase.delete(this.collection, id);
    await this.motosService.actualizeTreatments(treatment.moto);
  }

}

