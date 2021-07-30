import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddOptionsLayoutComponent } from './components/add-options-layout/add-options-layout.component';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [AddOptionsLayoutComponent],
  imports: [CommonModule, NbIconModule],
  exports: [AddOptionsLayoutComponent]
})
export class AddOptionsModule {}
