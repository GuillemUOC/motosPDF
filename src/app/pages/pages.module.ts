import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MotosListComponent } from './motos-list/motos-list.component';
import { MotoFormComponent } from './moto-form/moto-form.component';
import { TreatmentsListComponent } from './treatments-list/treatments-list.component';
import { TreatmentFormComponent } from './treatment-form/treatment-form.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';



@NgModule({
  declarations: [UserFormComponent, UsersListComponent, LoginComponent, MotosListComponent, MotoFormComponent, TreatmentsListComponent, TreatmentFormComponent, PdfViewerComponent],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PaginationModule
  ]
})
export class PagesModule { }
