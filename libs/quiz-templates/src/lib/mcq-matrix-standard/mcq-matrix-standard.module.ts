import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QstemModule } from '../sharedComponents/qstem/qstem.module';
import { OptModule } from '../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SetCorrectAnsOptionsModule } from '../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { SourceJsonModule } from '../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../sharedComponents/add-options/add-options.module';
import { ChoiceMatrixModule } from '../sharedComponents/choice-matrix/choice-matrix.module';
import { StemsModule } from '../sharedComponents/stems/stems.module';
import { AddStemsModule } from '../sharedComponents/add-stems/add-stems.module';
import { MetadataModule } from '../sharedComponents/metadata/metadata.module';
import { McqMatrixStandardLayoutComponent } from './components/mcq-matrix-standard-layout/mcq-matrix-standard-layout.component';
import { RowColTitlesModule } from '../sharedComponents/classify-row-column/row-col-titles/row-col-titles.module';

@NgModule({
  declarations: [McqMatrixStandardLayoutComponent],
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
    StemsModule,
    RowColTitlesModule,
    MetadataModule
  ],
  entryComponents: [McqMatrixStandardLayoutComponent]
})
export class McqMatrixStandardModule {
  static defaultEntryComponent = McqMatrixStandardLayoutComponent;
}
