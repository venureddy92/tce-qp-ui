import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleQuestionLayoutComponent } from './components/multiple-question-layout/multiple-question-layout.component';
import { MetadataModule } from '../sharedComponents/metadata/metadata.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { QstemModule } from '../sharedComponents/qstem/qstem.module';
import { ToastrModule } from 'ngx-toastr';
import { OptModule } from '../sharedComponents/opt/opt.module';
import { TemplateButtonsModule } from '../sharedComponents/template-buttons/template-buttons.module';
import { ShuffleModule } from '../sharedComponents/shuffle/shuffle.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddOptionsModule } from '../sharedComponents/add-options/add-options.module';
import { SourceJsonModule } from '../sharedComponents/source-json/source-json.module';
import { SetCorrectAnsOptionsModule } from '../sharedComponents/set-correct-ans-options/set-correct-ans-options.module';
import { SetCorrectAnsModule } from '../sharedComponents/set-correct-ans/set-correct-ans.module';
import { TagResponseModule } from '../sharedComponents/tag-response/tag-response.module';

@NgModule({
  declarations: [MultipleQuestionLayoutComponent],
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
    NgbModule,
    MetadataModule,
    ShuffleModule
  ],
  entryComponents: [MultipleQuestionLayoutComponent]
})
export class MultipleQuestionModule {
  static defaultEntryComponent = MultipleQuestionLayoutComponent;
}
