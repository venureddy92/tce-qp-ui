import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShuffleLayoutComponent } from './components/shuffle-layout/shuffle-layout.component';

@NgModule({
  declarations: [ShuffleLayoutComponent],
  imports: [CommonModule],
  exports: [ShuffleLayoutComponent]
})
export class ShuffleModule {}
