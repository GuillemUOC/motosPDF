import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { TreatmentModel } from '../models/treatment.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {
  public collection = 'treatments';

  constructor(private firebase: FirebaseService) { }

  getTreatment(id: string): Promise<TreatmentModel> | any {
    return this.firebase.getElment(this.collection, id);
  }

  getTreatments(motoId: string): Promise<TreatmentModel[]> {
    return this.firebase.getElments(this.collection, ref => ref.orderBy('timestamp', 'desc').where('moto', '==', motoId));
  }

  async createTreatment(treatment: TreatmentModel): Promise<any> {
    await this.firebase.create(this.collection, treatment);
  }

  updateTreatment(treatment: any): Promise<any> {
    return this.firebase.update(this.collection, treatment);
  }

  async deleteTreatment(id: string): Promise<any> {
    const treatment = await this.getTreatment(id);
    await this.firebase.delete(this.collection, id);
  }

}

