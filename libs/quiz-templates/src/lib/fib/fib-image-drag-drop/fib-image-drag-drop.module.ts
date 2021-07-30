import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FibImageDragDropLayoutComponent } from './components/fib-image-drag-drop-layout/fib-image-drag-drop-layout.component';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { OptModule } from '../../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SetCorrectAnsOptionsModule } from '../../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { AddOptionsModule } from '../../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TagResponseModule } from '../../sharedComponents/tag-response/tag-response.module';
import { TemplateButtonsModule } from '../../sharedComponents/template-buttons/template-buttons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { ShuffleModule } from '../../sharedComponents/shuffle/shuffle.module';
import { ClassifyOptionModule } from '../../sharedComponents/classify-row-column/classify-option/classify-option.module';
import { ImageUploadModalModule } from '../../sharedComponents/image-upload-modal/image-upload-modal.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { FormsModule } from '@angular/forms';

import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [FibImageDragDropLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    QstemModule,
    SourceJsonModule,
    OptModule,
    SetCorrectAnsModule,
    SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule,
    DragDropModule,
    TagResponseModule,
    TemplateButtonsModule,
    NgbModule,
    MetadataModule,
    ImageTemplateModule,
    ShuffleModule,
    ClassifyOptionModule,
    ImageUploadModalModule,
    CorrectResponsesModule,
    FeedbackModule,
    QuillToolbarModule,
    NbIconModule
  ],
  entryComponents: [FibImageDragDropLayoutComponent]
})
export class FibImageDragDropModule {
  static defaultEntryComponent = FibImageDragDropLayoutComponent;
}
