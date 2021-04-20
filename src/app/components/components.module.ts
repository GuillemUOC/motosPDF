import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NoDataBlockComponent } from './no-data-block/no-data-block.component';
import { LoadingBlockComponent } from './loading-block/loading-block.component';



@NgModule({
  declarations: [HeaderComponent, NoDataBlockComponent, LoadingBlockComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    HeaderComponent,
    LoadingBlockComponent,
    NoDataBlockComponent
  ]
})
export class ComponentsModule { }
