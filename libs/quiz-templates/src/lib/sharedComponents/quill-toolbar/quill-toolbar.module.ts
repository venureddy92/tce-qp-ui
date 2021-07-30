import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QUILL_TOKEN } from '../core/injectors/tokens';
import { loadEditorModule } from '../core/providers/lazy.provider';
import { QuillToolbarComponent } from './components/quill-toolbar.component';
import { NbTooltipModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ImageUploadModalModule } from '../image-upload-modal/image-upload-modal.module';

@NgModule({
  declarations: [QuillToolbarComponent],
  imports: [CommonModule, NbTooltipModule, FormsModule, ImageUploadModalModule],
  exports: [QuillToolbarComponent],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }]
})
export class QuillToolbarModule {}
