import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() navBack: EventEmitter<void>;

  constructor(private location: Location, public router: Router,
              @Inject(DOCUMENT) public document: Document, public auth: AuthService) {
        this.navBack = new EventEmitter();
     }

  _navBack(): void {
    this.navBack.emit();
  }

}