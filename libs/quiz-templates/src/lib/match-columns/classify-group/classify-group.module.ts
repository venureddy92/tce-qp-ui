import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassifyGroupLayoutComponent } from './components/classify-group-layout/classify-group-layout.component';
import { FormsModule } from '@angular/forms';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { MatchOptModule } from '../../sharedComponents/match-opt/match-opt.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateButtonsModule } from '../../sharedComponents/template-buttons/template-buttons.module';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { RowColTitlesModule } from '../../sharedComponents/classify-row-column/row-col-titles/row-col-titles.module';
import { ShuffleModule } from '../../sharedComponents/shuffle/shuffle.module';
import { ClassifyOptionModule } from '../../sharedComponents/classify-row-column/classify-option/classify-option.module';

@NgModule({
  declarations: [ClassifyGroupLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    QstemModule,
    MatchOptModule,
    SetCorrectAnsModule,
    // SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule,
    DragDropModule,
    TemplateButtonsModule,
    NgbModule,
    MetadataModule,
    ImageTemplateModule,
    ClassifyOptionModule,
    RowColTitlesModule
    // ShuffleModule
  ],
  entryComponents: [ClassifyGroupLayoutComponent]
})
export class ClassifyGroupModule {
  static defaultEntryComponent = ClassifyGroupLayoutComponent;
}
