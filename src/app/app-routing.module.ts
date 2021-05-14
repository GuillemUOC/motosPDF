import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MotosListComponent } from './pages/motos-list/motos-list.component';
import { MotoFormComponent } from './pages/moto-form/moto-form.component';
import { TreatmentsListComponent } from './pages/treatments-list/treatments-list.component';
import { TreatmentFormComponent } from './pages/treatment-form/treatment-form.component';
import { PdfViewerComponent } from './pages/pdf-viewer/pdf-viewer.component';

const routes: Routes = [
  { path: 'usersList', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'userForm/:user', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'motosList/:user', component: MotosListComponent, canActivate: [AuthGuard] },
  { path: 'motoForm/:user/:moto', component: MotoFormComponent, canActivate: [AuthGuard] },
  { path: 'treatmentsList/:user/:moto', component: TreatmentsListComponent, canActivate: [AuthGuard] },
  { path: 'treatmentForm/:user/:moto/:treatment', component: TreatmentFormComponent, canActivate: [AuthGuard] },
  { path: 'pdfViewer/:user/:moto/:treatment', component: PdfViewerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'usersList' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
