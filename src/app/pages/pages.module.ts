import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [UserFormComponent, UsersListComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PagesModule { }
