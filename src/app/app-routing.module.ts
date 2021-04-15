import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'usersList', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'userForm', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'usersList' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }