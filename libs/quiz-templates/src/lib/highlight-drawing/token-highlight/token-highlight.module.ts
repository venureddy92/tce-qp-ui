import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenHighlightLayoutComponent } from './components/token-highlight-layout/token-highlight-layout.component';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { QuillModule } from 'ngx-quill';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';

@NgModule({
  declarations: [TokenHighlightLayoutComponent],
  imports: [
    CommonModule,
    QstemModule,
    SourceJsonModule,
    // OptModule,
    SetCorrectAnsModule,
    // SetCorrectAnsOptionsModule,
    // AddOptionsModule,
    // DragDropModule,
    // TagResponseModule,
    // TemplateButtonsModule,
    NgbModule,
    MetadataModule,
    // ImageTemplateModule,
    // ShuffleModule,
    // ClassifyOptionModule,
    // ImageUploadModalModule,
    CorrectResponsesModule,
    QuillModule,
    QuillToolbarModule,
    FeedbackModule
  ],
  entryComponents: [TokenHighlightLayoutComponent]
})
export class TokenHighlightModule {
  static defaultEntryComponent = TokenHighlightLayoutComponent;
}
