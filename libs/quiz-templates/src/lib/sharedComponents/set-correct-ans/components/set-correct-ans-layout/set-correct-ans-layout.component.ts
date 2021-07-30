import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  AfterViewInit
} from '@angular/core';
import { QuestionEditorService } from '@tce/template-editor';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-set-correct-ans-layout',
  templateUrl: './set-correct-ans-layout.component.html',
  styleUrls: ['./set-correct-ans-layout.component.scss']
})
export class SetCorrectAnsLayoutComponent implements OnInit, AfterViewInit {
  @Input() public previewState: boolean;
  @Input() public points;
  @Input() public templateType;
  @Input() public placeholder: string;

  public mode: boolean = false;
  @Output() pushEnteredPoints = new EventEmitter();

  constructor(private questionEditorService: QuestionEditorService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.questionEditorService.getPreviewState().subscribe((mode: boolean) => {
    //   this.mode = mode;
    // });
    this.mode = this.previewState;
  }

  /**
   * @description Function to get the points entered by the user and send it to the main component
   * @param event Type = number
   */
  getPointsValue(event: number): void {
    if (event) {
      this.pushEnteredPoints.emit(event);
    }
  }

  /**
   * @description Destroys subscriptions at destroy event
   * @returns void
   */
  ngOnDestroy() {}
}
