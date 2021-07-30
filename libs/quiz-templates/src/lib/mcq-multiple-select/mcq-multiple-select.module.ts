import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McqMultipleSelectLayoutComponent } from './components/mcq-multiple-select-layout/mcq-multiple-select-layout.component';
import { QstemModule } from '../sharedComponents/qstem/qstem.module';
import { OptModule } from '../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SetCorrectAnsOptionsModule } from '../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { SourceJsonModule } from '../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [McqMultipleSelectLayoutComponent],
  imports: [
    DragDropModule,
    CommonModule,
    QstemModule,
    OptModule,
    SetCorrectAnsModule,
    SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule
  ],
  entryComponents: [McqMultipleSelectLayoutComponent]
})
export class McqMultipleSelectModule {
  static defaultEntryComponent = McqMultipleSelectLayoutComponent;
}
