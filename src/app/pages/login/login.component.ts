import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  template: `Login...`,
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.auth.isAuthenticated$.subscribe(authenticated => {
      if (!authenticated) {
        this.auth.loginWithRedirect();
      }
    });
  }

}
