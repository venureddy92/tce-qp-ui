import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EssayTextLayoutComponent } from './essay-text/components/essay-text-layout/essay-text-layout.component';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { FormsModule } from '@angular/forms';
import { StemsModule } from '../../sharedComponents/stems/stems.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [EssayTextLayoutComponent],
  imports: [
    CommonModule,
    QstemModule,
    SetCorrectAnsModule,
    SourceJsonModule,
    FormsModule,
    CommonModule,
    MetadataModule,
    CorrectResponsesModule,
    StemsModule,
    DragDropModule,
    QuillToolbarModule,
    FeedbackModule,
    NbIconModule
  ],
  entryComponents: [EssayTextLayoutComponent]
})
export class EssayTextModule {
  static defaultEntryComponent = EssayTextLayoutComponent;
}
