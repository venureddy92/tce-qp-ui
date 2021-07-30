import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrectResponsesLayoutComponent } from './components/correct-responses/correct-responses-layout/correct-responses-layout.component';

@NgModule({
  declarations: [CorrectResponsesLayoutComponent],
  imports: [CommonModule],
  exports: [CorrectResponsesLayoutComponent]
})
export class CorrectResponsesModule {
  static defaultEntryComponent = CorrectResponsesLayoutComponent;
}
