import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadModalLayoutComponent } from './components/image-upload-modal-layout/image-upload-modal-layout.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [ImageUploadModalLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forRoot(),
    NgxMaskModule.forRoot()
  ],
  exports: [ImageUploadModalLayoutComponent]
})
export class ImageUploadModalModule {}
