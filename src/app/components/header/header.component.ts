import { Component, Inject } from '@angular/core';
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

  constructor(private location: Location,
              public router: Router,
              @Inject(DOCUMENT) public document: Document,
              public auth: AuthService) { }

  goBack(): void {
    this.location.back();
  }

}