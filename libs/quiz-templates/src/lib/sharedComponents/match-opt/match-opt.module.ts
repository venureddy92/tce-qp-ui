import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchOptComponent } from '../match-opt/components/match-opt/match-opt.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { QUILL_TOKEN } from '../core/injectors/tokens';
import { loadEditorModule } from '../core/providers/lazy.provider';

@NgModule({
  declarations: [MatchOptComponent],
  imports: [CommonModule, FormsModule, QuillModule.forRoot()],
  exports: [MatchOptComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class MatchOptModule {}
