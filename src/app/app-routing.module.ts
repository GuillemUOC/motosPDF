import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MotosListComponent } from './pages/motos-list/motos-list.component';
import { MotoFormComponent } from './pages/moto-form/moto-form.component';

const routes: Routes = [
  { path: 'usersList', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'userForm/:user', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'motosList/:user', component: MotosListComponent, canActivate: [AuthGuard] },
  { path: 'motoForm/:moto', component: MotoFormComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'usersList' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
