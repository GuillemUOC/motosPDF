import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Commons {
  forceLast(action: any, time: number = 500): Promise<any> {
    if (!action.then) {
      action = new Promise<any>(resolve => {
        const res = action();
        resolve(res);
      });
    }
    const timer = new Promise<void>(resolve => {
      setTimeout(() => resolve(), time);
    });
    return new Promise<any>((resolve, reject) => {
      Promise.all([timer, action])
        .then(values => resolve(values.pop()))
        .catch(error => reject(error));
    });
  }

  copyObject(element: any): any {
    return JSON.parse(JSON.stringify(element));
  }
}
