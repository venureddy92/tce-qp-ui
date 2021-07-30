import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageTemplateLayoutComponent } from './components/image-template-layout/image-template-layout.component';
import { ImageUploadModalModule } from '../image-upload-modal/image-upload-modal.module';

@NgModule({
  declarations: [ImageTemplateLayoutComponent],
  imports: [CommonModule, ImageUploadModalModule],
  exports: [ImageTemplateLayoutComponent]
})
export class ImageTemplateModule {}
