import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortListComponent } from './components/sort-list/sort-list.component';
import { FormsModule } from '@angular/forms';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { MatchOptModule } from '../../sharedComponents/match-opt/match-opt.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateButtonsModule } from '../../sharedComponents/template-buttons/template-buttons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { ShuffleModule } from '../../sharedComponents/shuffle/shuffle.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';

@NgModule({
  declarations: [SortListComponent],
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
    ShuffleModule,
    CorrectResponsesModule
  ],
  entryComponents: [SortListComponent]
})
export class SortListModule {
  static defaultEntryComponent = SortListComponent;
}
