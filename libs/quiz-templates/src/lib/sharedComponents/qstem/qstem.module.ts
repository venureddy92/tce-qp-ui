import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QstemComponent } from './components/qstem-layout/qstem.component';
import { QUILL_TOKEN } from './../core/injectors/tokens';
import { loadEditorModule } from './../core/providers/lazy.provider';

@NgModule({
  declarations: [QstemComponent],
  imports: [CommonModule],
  exports: [QstemComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class QstemModule {}
