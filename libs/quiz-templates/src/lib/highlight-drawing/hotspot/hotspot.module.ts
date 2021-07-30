import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceJsonModule } from '../../sharedComponents/source-json/source-json.module';
import { SetCorrectAnsModule } from '../../sharedComponents/set-correct-ans/set-correct-ans.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MetadataModule } from '../../sharedComponents/metadata/metadata.module';
import { ImageTemplateModule } from '../../sharedComponents/image-template/image-template.module';
import { ImageUploadModalModule } from '../../sharedComponents/image-upload-modal/image-upload-modal.module';
import { CorrectResponsesModule } from '../../sharedComponents/correct-responses/correct-responses.module';
import { QstemModule } from '../../sharedComponents/qstem/qstem.module';
import { HotspotLayoutComponent } from './components/hotspot-layout/hotspot-layout.component';
import { FeedbackModule } from '../../sharedComponents/feedback/feedback.module';
import { QuillToolbarModule } from '../../sharedComponents/quill-toolbar/quill-toolbar.module';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [HotspotLayoutComponent],
  imports: [
    CommonModule,
    QstemModule,
    SourceJsonModule,
    SetCorrectAnsModule,
    NgbModule,
    MetadataModule,
    ImageUploadModalModule,
    CorrectResponsesModule,
    QuillToolbarModule,
    FeedbackModule,
    NbIconModule
  ],
  entryComponents: [HotspotLayoutComponent]
})
export class HotspotModule {
  static defaultEntryComponent = HotspotLayoutComponent;
}
