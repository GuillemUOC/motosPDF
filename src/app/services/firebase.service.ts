import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryFn } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { Commons } from '../utils/commons.util';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private fs: AngularFirestore, private commons: Commons) { }

  getElments(collectionName: string, query?: QueryFn<DocumentData>): Promise<any[]> {
    const itemsCollection = this.fs.collection<any>(collectionName, query)
      .snapshotChanges()
      .pipe(map(data =>
        data.map((a: any) => {
          // tslint:disable-next-line: no-shadowed-variable
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      ));

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: deprecation
      itemsCollection.pipe(first()).subscribe((elments) => resolve(elments), reject);
    });
  }

  getElment(collectionName: string, id: string): Promise<any> {
    const itemsCollection = this.fs.collection<any>(collectionName)
      .doc(id).get().pipe(map(data => {
        const element = data.data();
        if (element) {
          element.id = id;
        }
        return element;
      }));

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: deprecation
      itemsCollection.pipe(first()).subscribe((element) => element ? resolve(element) : reject(), reject);
    });
  }

  create(collectionName: string, element: any): Promise<any> {
    element = this.commons.copyObject(element);
    delete element.id;
    const itemsCollection = this.fs.collection<any>(collectionName);
    return itemsCollection.add(element);
  }

  update(collectionName: string, element: any): Promise<any> {
    element = this.commons.copyObject(element);
    const id = element.id;
    delete element.id;
    const itemsCollection = this.fs.collection<any>(collectionName);
    return itemsCollection.doc(id).update(element);
  }

  delete(collectionName: string, id: string): Promise<void> {
    const itemsCollection = this.fs.collection<any>(collectionName);
    return itemsCollection.doc(id).delete();
  }

  setRelationsNumber(parentList: any[], childList: any[], propertyToCompare: string, propertyName: string): void {
    parentList.forEach(parent => {
      const patt = new RegExp(parent.id, 'g');
      const relations = childList.map(child => child[propertyToCompare]).join().match(patt);
      parent[propertyName] = relations ? relations.length : 0;
    });
  }
}
