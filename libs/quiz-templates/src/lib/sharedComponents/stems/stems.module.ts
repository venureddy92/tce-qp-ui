import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StemsLayoutComponent } from './components/stems-layout/stems-layout.component';

@NgModule({
  declarations: [StemsLayoutComponent],
  imports: [CommonModule],
  exports: [StemsLayoutComponent]
})
export class StemsModule {}
