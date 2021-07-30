import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackModalLayoutComponent } from './components/feedback-modal-layout/feedback-modal-layout.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [FeedbackModalLayoutComponent],
  imports: [CommonModule, NgxSmartModalModule.forRoot()],
  exports: [FeedbackModalLayoutComponent]
})
export class FeedbackModalModule {}
