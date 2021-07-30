import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceJsonLayoutComponent } from './components/source-json-layout/source-json-layout.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SourceJsonLayoutComponent],
  imports: [CommonModule, FormsModule, NgxSmartModalModule.forRoot()],
  exports: [SourceJsonLayoutComponent]
})
export class SourceJsonModule {}
