import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { ImageUploadModalModule } from '../../sharedComponents/image-upload-modal/image-upload-modal.module';
import { QuillEditorComponent } from './components/quill-component-layout/quill-editor.component';

@NgModule({
  declarations: [QuillEditorComponent],
  entryComponents: [QuillEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ImageUploadModalModule,
    QuillModule.forRoot()
  ],
  exports: [QuillEditorComponent]
})
export class QuillComponentModule {
  static entry = QuillEditorComponent;
}
