import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QUILL_TOKEN } from '../../core/injectors/tokens';
import { loadEditorModule } from '../../core/providers/lazy.provider';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { ClassifyOptionComponent } from './components/classify-options-layout/classify-option.component';

@NgModule({
  declarations: [ClassifyOptionComponent],
  imports: [CommonModule, FormsModule, NgbModule, QuillModule.forRoot()],
  exports: [ClassifyOptionComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class ClassifyOptionModule {}
