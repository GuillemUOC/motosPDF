import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetFormControlPipe } from './get-form-control.pipe';
import { IsInvalidControlPipe } from './is-invalid-control.pipe';
import { IsPendingControlPipe } from './is-pending-control.pipe';



@NgModule({
  declarations: [GetFormControlPipe, IsInvalidControlPipe, IsPendingControlPipe],
  imports: [
    CommonModule
  ],
  exports: [GetFormControlPipe, IsInvalidControlPipe, IsPendingControlPipe]
})
export class PipesModule { }
