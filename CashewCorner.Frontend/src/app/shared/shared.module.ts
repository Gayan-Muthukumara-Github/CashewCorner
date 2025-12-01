import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderComponent } from './components/placeholder.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaceholderComponent
  ],
  exports: [
    PlaceholderComponent
  ]
})
export class SharedModule { }
