import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { QuestionEditorService } from '@tce/template-editor';

@Component({
  selector: 'feedback-layout',
  templateUrl: './feedback-layout.component.html',
  styleUrls: ['./feedback-layout.component.scss']
})
export class FeedbackLayoutComponent implements OnInit, AfterViewInit {
  @Input() public previewState: boolean = false;
  @Input() public showAnsState: object;
  @Input() public feedback: object;
  @Output() feedbackUpdate = new EventEmitter();

  @Input() placeholder: string;

  public showCorrectAnswer: boolean = false;
  public mode: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService
  ) {}

  ngOnInit() {
    console.log('Feedback', this.feedback);
  }

  ngAfterViewInit(): void {
    console.log('feed ', this.feedback);
    this.mode = this.previewState;
    this.showCorrectAnswer = this.showAnsState['state'];
    this.cdr.detectChanges();
  }

  updateFeedback(evt) {
    var feedbackValue = evt.target.value;
    this.feedback['feedback'] = feedbackValue;
    this.feedbackUpdate.emit(feedbackValue);
  }
}
