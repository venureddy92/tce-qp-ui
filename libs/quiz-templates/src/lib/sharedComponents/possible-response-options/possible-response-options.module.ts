import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PossibleResponseOptionsLayoutComponent } from './components/possible-response-options-layout/possible-response-options-layout.component';

@NgModule({
  declarations: [PossibleResponseOptionsLayoutComponent],
  imports: [CommonModule, FormsModule],
  exports: [PossibleResponseOptionsLayoutComponent]
})
export class PossibleResponseOptionsModule {}
