import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateButtonsLayoutComponent } from './components/template-buttons-layout/template-buttons-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TemplateButtonsLayoutComponent],
  imports: [CommonModule, NgbModule, FormsModule],
  exports: [TemplateButtonsLayoutComponent]
})
export class TemplateButtonsModule {}
