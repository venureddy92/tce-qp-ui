import { NgModule } from '@angular/core';
// import { TagInputModule } from 'ngx-chips';
import { CommonModule } from '@angular/common';
import { MetadataLayoutComponent } from './components/metadata-layout/metadata-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MetadataLayoutComponent],
  imports: [
    CommonModule,
    // TagInputModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [MetadataLayoutComponent]
})
export class MetadataModule {}
