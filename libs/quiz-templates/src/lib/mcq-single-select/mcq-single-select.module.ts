import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McqSingleSelectLayoutComponent } from './components/mcq-single-select-layout/mcq-single-select-layout.component';
import { QstemModule } from '../sharedComponents/qstem/qstem.module';
import { OptModule } from '../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SetCorrectAnsOptionsModule } from '../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { SourceJsonModule } from '../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TagResponseModule } from '../sharedComponents/tag-response/tag-response.module';
import { FormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MetadataModule } from '../sharedComponents/metadata/metadata.module';
import { TemplateButtonsModule } from '../sharedComponents/template-buttons/template-buttons.module';
import { ImageTemplateModule } from '../sharedComponents/image-template/image-template.module';
import { ShuffleModule } from '../sharedComponents/shuffle/shuffle.module';
import { FeedbackModule } from '../sharedComponents/feedback/feedback.module';
import { FeedbackModalModule } from '../sharedComponents/feedback-modal/feedback-modal.module';
import { QUILL_TOKEN } from '../sharedComponents/core/injectors/tokens';
import { loadEditorModule } from '../sharedComponents/core/providers/lazy.provider';
import { QuillModule } from 'ngx-quill';
import { QuillToolbarModule } from '../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';
@NgModule({
  declarations: [McqSingleSelectLayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    QstemModule,
    ToastrModule.forRoot(),
    // QuillModule.forRoot(),
    OptModule,
    SetCorrectAnsModule,
    SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule,
    DragDropModule,
    TagResponseModule,
    TemplateButtonsModule,
    // NgbModule,
    MetadataModule,
    ImageTemplateModule,
    ShuffleModule,
    FeedbackModule,
    FeedbackModalModule,
    QuillToolbarModule,
    NbIconModule
  ],
  exports: [
    McqSingleSelectLayoutComponent,
    QstemModule,
    ToastrModule,
    // QuillModule.forRoot(),
    OptModule,
    SetCorrectAnsModule,
    SetCorrectAnsOptionsModule,
    SourceJsonModule,
    AddOptionsModule,
    DragDropModule,
    TagResponseModule,
    TemplateButtonsModule,
    // NgbModule,
    MetadataModule,
    ImageTemplateModule,
    ShuffleModule,
    FeedbackModule,
    FeedbackModalModule,
    QuillToolbarModule,
    NbIconModule
  ],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }],
  entryComponents: [McqSingleSelectLayoutComponent]
})
export class McqSingleSelectModule {
  static defaultEntryComponent = McqSingleSelectLayoutComponent;
}
