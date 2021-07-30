import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetCorrectAnsOptionsLayoutComponent } from './components/set-correct-ans-options-layout/set-correct-ans-options-layout.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SetCorrectAnsOptionsLayoutComponent],
  imports: [CommonModule, FormsModule],
  exports: [SetCorrectAnsOptionsLayoutComponent]
})
export class SetCorrectAnsOptionsModule {}
