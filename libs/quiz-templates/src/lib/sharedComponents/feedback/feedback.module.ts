import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackLayoutComponent } from './components/feedback-layout/feedback-layout.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackLayoutComponent],
  imports: [CommonModule, FormsModule],
  exports: [FeedbackLayoutComponent]
})
export class FeedbackModule {}
