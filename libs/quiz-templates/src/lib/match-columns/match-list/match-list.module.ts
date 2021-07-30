import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchListComponent } from './components/match-list/match-list.component';
import { TemplateButtonsModule } from '../../sharedComponents/template-buttons/template-buttons.module';
import { FormsModule } from '@angular/forms';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { MatchOptModule } from '../../sharedComponents/match-opt/match-opt.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
// import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { ShuffleModule } from '../../sharedComponents/shuffle/shuffle.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';
@NgModule({
  declarations: [MatchListComponent],
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
    // ImageTemplateModule,
    ShuffleModule,
    CorrectResponsesModule,
    QuillToolbarModule,
    NbIconModule,
    FeedbackModule
  ],
  entryComponents: [MatchListComponent]
})
export class MatchListModule {
  static defaultEntryComponent = MatchListComponent;
}
