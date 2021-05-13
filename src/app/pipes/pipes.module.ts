import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsInvalidControlPipe } from './is-invalid-control.pipe';
import { IsPendingControlPipe } from './is-pending-control.pipe';



@NgModule({
  declarations: [IsInvalidControlPipe, IsPendingControlPipe],
  imports: [
    CommonModule
  ],
  exports: [IsInvalidControlPipe, IsPendingControlPipe]
})
export class PipesModule { }
