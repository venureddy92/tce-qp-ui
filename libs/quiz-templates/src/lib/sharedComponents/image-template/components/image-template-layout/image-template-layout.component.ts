import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { QuestionEditorService } from '@tce/template-editor';
import { BehaviorSubject } from 'rxjs';
import { SharedComponentService } from '@tce/quiz-templates';

@Component({
  selector: 'app-image-template-layout',
  templateUrl: './image-template-layout.component.html',
  styleUrls: ['./image-template-layout.component.scss']
})
export class ImageTemplateLayoutComponent implements OnInit, AfterViewInit {
  @Input() public imageUrl: string;
  public previewState: boolean;

  @Output() public getImageUploaded = new EventEmitter<string>();

  public preview: boolean;

  constructor(
    public sharedComponentService: SharedComponentService,
    private questionEditorService: QuestionEditorService
  ) {
    this.sharedComponentService.getImageData.subscribe(imageData => {
      if (imageData['componentType'] == 'image-template') {
        this.imageUrl = imageData['imageUrl'];
        this.getImageUploaded.emit(this.imageUrl);
      }
    });
  }

  ngOnInit() {
    // this.previewState.subscribe(state => {
    //   this.preview = state;
    // });
  }

  ngAfterViewInit() {
    this.questionEditorService.getPreviewState().subscribe(state => {
      this.preview = state;
    });
  }

  imageUpload(): void {
    this.sharedComponentService.imageUploadModalService({
      type: 'image-template',
      state: true
    });
  }

  /**
   * @description  This function gets the data from the output function of the app-image-upload-modal-layout component
   * @param imageData Type = json object
   * @returns void
   */
  getImageData(imageData: object): void {
    this.imageUrl = imageData['imageUrl'];
    this.getImageUploaded.emit(this.imageUrl);
  }
}
