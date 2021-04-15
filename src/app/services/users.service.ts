import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private itemsCollection: AngularFirestoreCollection<any>;

  constructor(private fs: AngularFirestore) {}

  getUsers(): any {
    this.itemsCollection = this.fs.collection<any>('usuarios');
    return this.itemsCollection.valueChanges()
      .subscribe(users => {
        console.log("firebase:");
        console.log(users);
      });
  }

}
