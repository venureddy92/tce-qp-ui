import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QUILL_TOKEN } from '../core/injectors/tokens';
import { loadEditorModule } from '../core/providers/lazy.provider';
import { TemplateMarkupLayoutComponent } from './components/template-markup-layout/template-markup-layout.component';

@NgModule({
  declarations: [TemplateMarkupLayoutComponent],
  imports: [CommonModule],
  exports: [TemplateMarkupLayoutComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class TemplateMarkupModule {}
