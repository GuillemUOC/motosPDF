import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'motosPDF';
  activeComponent;

  constructor() { }

  navBack() {
    this.activeComponent?.navBack();
  }

  onActivate(componentReference) {
    console.log(componentReference);
    
    this.activeComponent = componentReference;
  }
}
