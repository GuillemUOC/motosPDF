import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MotoModel } from '../models/moto.model';
import { Commons } from '../utils/commons.util';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MotosService {
  public motos: MotoModel[] = [];

  constructor(private fs: AngularFirestore, private commons: Commons) { }

  getMotos(userId: string): Promise<MotoModel[]> {
    this.motos = [];

    const itemsCollection = this.fs.collection<MotoModel>('motos', ref => {
      return ref.orderBy('timestamp', 'desc').where('user', '==', userId);
    }).snapshotChanges()
      .pipe(map(data => {
        this.motos = this.snapMoto(data);
        return this.motos;
      }));

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: deprecation
      itemsCollection.pipe(first()).subscribe((motos) => resolve(motos), reject);
    });
  }

  snapMoto(data: any): MotoModel[] {
    return data.map((a: any) => {
      // tslint:disable-next-line: no-shadowed-variable
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  }
}
