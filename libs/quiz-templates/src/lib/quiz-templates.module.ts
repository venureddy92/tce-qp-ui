import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McqSingleSelectModule } from './mcq-single-select/mcq-single-select.module';
import { QUILL_TOKEN } from './sharedComponents/core/injectors/tokens';
import { loadEditorModule } from './sharedComponents/core/providers/lazy.provider';
import { FibTextModule } from './fib/fib-text/fib-text.module';
// import { HotspotModule } from './highlight-drawing/hotspot/hotspot.module';
import { EssayTextModule } from './written-n-record/essay-text/essay-text.module';
import { OrderListModule } from './match-columns/order-list/order-list.module';
import { FibImageDragDropModule } from './fib/fib-image-drag-drop/fib-image-drag-drop.module';
import { TokenHighlightModule } from './highlight-drawing/token-highlight/token-highlight.module';
import { MatchListModule } from './match-columns/match-list/match-list.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillToolbarModule } from './sharedComponents/quill-toolbar/quill-toolbar.module';
import { FeedbackModule } from './sharedComponents/feedback/feedback.module';
import { QstemModule } from './sharedComponents/qstem/qstem.module';
import { CorrectResponsesModule } from './sharedComponents/correct-responses/correct-responses.module';
import { ImageUploadModalModule } from './sharedComponents/image-upload-modal/image-upload-modal.module';
import { ImageTemplateModule } from './sharedComponents/image-template/image-template.module';
import { MetadataModule } from './sharedComponents/metadata/metadata.module';
import { SetCorrectAnsModule } from './sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from './sharedComponents/source-json/source-json.module';
@NgModule({
  imports: [
    CommonModule
    // McqSingleSelectModule
    // FibTextModule,
    // HotspotModule,
    // EssayTextModule,
    // OrderListModule,
    // FibImageDragDropModule,
    // TokenHighlightModule,
    // MatchListModule

    // NbIconModule,
    // QuillToolbarModule,
    // FeedbackModule,
    // QstemModule,
    // CorrectResponsesModule,
    // ImageUploadModalModule,
    // ImageTemplateModule,
    // MetadataModule,
    // SetCorrectAnsModule,
    // SourceJsonModule
  ],
  exports: [
    // McqSingleSelectModule,
    // FibTextModule,
    // HotspotModule
    // EssayTextModule,
    // OrderListModule,
    // FibImageDragDropModule,
    // TokenHighlightModule,
    // MatchListModule
    // HotspotLayoutComponent
  ],
  providers: [{ provide: QUILL_TOKEN, useFactory: loadEditorModule }],
  declarations: []
})
export class QuizTemplatesModule {}
