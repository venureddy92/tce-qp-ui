import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './components/order-list/order-list.component';
import { FormsModule } from '@angular/forms';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { OptModule } from '../../sharedComponents/opt/opt.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { AddOptionsModule } from '../../sharedComponents/add-options/add-options.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateButtonsModule } from '../../sharedComponents/template-buttons/template-buttons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { MatchOptModule } from '../../sharedComponents/match-opt/match-opt.module';
import { ShuffleModule } from '../../sharedComponents/shuffle/shuffle.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { QuillModule } from 'ngx-quill';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';

@NgModule({
  declarations: [OrderListComponent],
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
    CorrectResponsesModule,
    QuillToolbarModule,
    NbIconModule,
    FeedbackModule
  ],
  entryComponents: [OrderListComponent]
})
export class OrderListModule {
  static defaultEntryComponent = OrderListComponent;
}
