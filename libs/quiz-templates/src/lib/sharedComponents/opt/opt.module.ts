import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptComponent } from './components/opt-layout/opt.component';
import { loadEditorModule } from './../core/providers/lazy.provider';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QUILL_TOKEN } from '../core/injectors/tokens';

@NgModule({
  declarations: [OptComponent],
  imports: [CommonModule, FormsModule, NgbModule, QuillModule.forRoot()],
  exports: [OptComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class OptModule {}
