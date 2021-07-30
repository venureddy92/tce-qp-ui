import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Template3LayoutComponent } from './template3-layout/template3-layout.component';
import { QstemModule } from './../sharedComponents/qstem/qstem.module';
import { OptModule } from './../sharedComponents/opt/opt.module';

@NgModule({
  declarations: [Template3LayoutComponent],
  imports: [CommonModule, QstemModule, OptModule],
  entryComponents: [Template3LayoutComponent]
})
export class Template3Module {
  static defaultEntryComponent = Template3LayoutComponent;
}
