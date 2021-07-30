import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagResponseLayoutComponent } from './components/tag-response-layout/tag-response-layout.component';

@NgModule({
  declarations: [TagResponseLayoutComponent],
  imports: [CommonModule],
  exports: [TagResponseLayoutComponent]
})
export class TagResponseModule {
  static entry = TagResponseLayoutComponent;
}
