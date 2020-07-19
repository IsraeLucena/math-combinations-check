import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {}
