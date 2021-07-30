import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FibSetCorrectAnsOptionsLayoutComponent } from './components/fib-set-correct-ans-options-layout/fib-set-correct-ans-options-layout.component';

@NgModule({
  declarations: [FibSetCorrectAnsOptionsLayoutComponent],
  imports: [CommonModule, FormsModule],
  exports: [FibSetCorrectAnsOptionsLayoutComponent]
})
export class FibSetCorrectAnsOptionsModule {}
