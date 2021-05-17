import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

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

  getPdfFromHtml(htmlTemplate: any, options?: any): any {
    let htmlPdf: any;
    if (typeof htmlTemplate === 'string') {
      htmlPdf = document.createElement('div');
      htmlPdf.innerHTML = htmlTemplate;
    } else {
      htmlPdf = htmlTemplate;
    }

    options = {
      margin: 0,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2
      },
      jsPDF: {
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait'
      },
      ...options
    };
    return html2pdf().set(options).from(htmlPdf);
  }
}
