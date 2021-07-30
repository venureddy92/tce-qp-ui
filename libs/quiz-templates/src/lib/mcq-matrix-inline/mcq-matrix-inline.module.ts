import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McqMatrixInlineLayoutComponent } from './components/mcq-matrix-inline-layout/mcq-matrix-inline-layout.component';
import { QstemModule } from '../sharedComponents/qstem/qstem.module';
import { OptModule } from '../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SetCorrectAnsOptionsModule } from '../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { SourceJsonModule } from '../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../sharedComponents/add-options/add-options.module';
import { ChoiceMatrixModule } from '../sharedComponents/choice-matrix/choice-matrix.module';
import { StemsModule } from '../sharedComponents/stems/stems.module';
import { AddStemsModule } from '../sharedComponents/add-stems/add-stems.module';

@NgModule({
  declarations: [McqMatrixInlineLayoutComponent],
  imports: [
    CommonModule,
    QstemModule,
    OptModule,
    SetCorrectAnsModule,
    SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule,
    AddStemsModule,
    ChoiceMatrixModule,
    StemsModule
  ],
  entryComponents: [McqMatrixInlineLayoutComponent]
})
export class McqMatrixInlineModule {
  static defaultEntryComponent = McqMatrixInlineLayoutComponent;
}
