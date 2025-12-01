import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerLayoutComponent } from './pages/customer-layout.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { TrackOrderComponent } from './pages/track-order.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CustomerRoutingModule,
    CustomerLayoutComponent,
    AboutComponent,
    ContactComponent,
    TrackOrderComponent
  ]
})
export class CustomerModule { }


