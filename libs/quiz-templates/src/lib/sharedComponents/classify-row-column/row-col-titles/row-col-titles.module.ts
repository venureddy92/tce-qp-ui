import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowColTitlesLayoutComponent } from './components/row-col-titles-layout/row-col-titles-layout.component';
import { QUILL_TOKEN } from '../../core/injectors/tokens';
import { loadEditorModule } from './../../core/providers/lazy.provider';

@NgModule({
  declarations: [RowColTitlesLayoutComponent],
  imports: [CommonModule],
  exports: [RowColTitlesLayoutComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class RowColTitlesModule {}
