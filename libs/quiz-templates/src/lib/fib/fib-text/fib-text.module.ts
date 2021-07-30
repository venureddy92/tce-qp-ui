import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateMarkupModule } from '../../sharedComponents/template-markup/template-markup.module';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { OptModule } from '../../sharedComponents/opt/opt.module';
import { PossibleResponseOptionsModule } from '../../sharedComponents/possible-response-options/possible-response-options.module';
import { FibSetCorrectAnsOptionsModule } from '../../sharedComponents/fib-set-correct-ans-options/fib-set-correct-ans-options.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ClassifyOptionModule } from '../../sharedComponents/classify-row-column/classify-option/classify-option.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StemsModule } from '../../sharedComponents/stems/stems.module';
import { RowColTitlesModule } from '../../sharedComponents/classify-row-column/row-col-titles/row-col-titles.module';
import { FibTextLayoutComponent } from './components/fib-text-layout/fib-text-layout.component';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [FibTextLayoutComponent],
  imports: [
    CommonModule,
    QstemModule,
    TemplateMarkupModule,
    SourceJsonModule,
    PossibleResponseOptionsModule,
    FibSetCorrectAnsOptionsModule,
    SetCorrectAnsModule,
    MetadataModule,
    RowColTitlesModule,
    MetadataModule,
    ClassifyOptionModule,
    CorrectResponsesModule,
    DragDropModule,
    OptModule,
    StemsModule,
    FeedbackModule,
    QuillToolbarModule,
    NbIconModule
  ],
  entryComponents: [FibTextLayoutComponent]
})
export class FibTextModule {
  static defaultEntryComponent = FibTextLayoutComponent;
}
