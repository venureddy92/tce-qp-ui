import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template4LayoutComponent } from './template4-layout/template4-layout.component';
import { OptModule } from './../sharedComponents/opt/opt.module';
import { QstemModule } from './../sharedComponents/qstem/qstem.module';

@NgModule({
  declarations: [Template4LayoutComponent],
  imports: [CommonModule, OptModule, QstemModule]
})
export class Template4Module {}
