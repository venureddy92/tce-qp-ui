import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetCorrectAnsLayoutComponent } from './components/set-correct-ans-layout/set-correct-ans-layout.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [SetCorrectAnsLayoutComponent],
  imports: [CommonModule, FormsModule, NgxMaskModule.forRoot()],
  exports: [SetCorrectAnsLayoutComponent]
  // providers: [
  //   SharedComponentService,
  //   { provide: QUILL_TOKEN, useFactory: loadEditorModule }
  // ]
})
export class SetCorrectAnsModule {}
