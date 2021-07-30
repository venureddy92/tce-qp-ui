import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  TemplateMcqData,
  TemplateMcqOption
} from '../../core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mcq-matrix-inline-layout',
  templateUrl: './mcq-matrix-inline-layout.component.html',
  styleUrls: ['./mcq-matrix-inline-layout.component.css']
})
export class McqMatrixInlineLayoutComponent implements OnInit {
  @Input() public templateData: TemplateMcqData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Output() public sourceStateChange = new EventEmitter();

  public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  public qstem: object = {};
  public opts: Array<object> = [];
  public stems: Array<object> = [];
  public layout: string = 'horizontal';
  public inputName: string;
  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  public selectedAnswers: any;
  public points: number;
  // public responseValue: any;
  public previewShow: boolean = true;
  public sourceData: object = {};
  public inputType: string = 'checkbox';

  constructor() {}

  ngOnInit() {
    this.initState();

    this.previewSubscription = this.previewState.subscribe(state => {
      // console.log(state)
      this.previewShow = state;
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());
  }

  //Function to initial all the variables
  initState() {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    this.opts = this.templateData.data.options as Array<TemplateMcqOption>;
    // this.stems = this.templateData.data.stems as Array<TemplateMcqOption>;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.layout = this.templateData.data.ui_style.type;
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.sourceData = this.templateData as TemplateMcqData;
  }

  // Handle the form on submit
  onSubmit() {
    console.log('mcq-true-false', 'Submit Pressed');
  }

  //Output function which retrieves the values selected from the app-set-correct-ans-options-layout component
  getSelectedAns(eventData) {
    let event = eventData.event;
    if (this.inputType == 'checkbox') {
      if (event.target.checked) {
        if (this.selectedAnswers[eventData.i] == null) {
          this.selectedAnswers[eventData.i] = [event.target.value];
        } else {
          this.selectedAnswers[eventData.i].push(event.target.value);
        }
      } else {
        this.selectedAnswers[eventData.i] = this.selectedAnswers[
          eventData.i
        ].filter((options: any) => options !== event.target.value);
        if (this.selectedAnswers[eventData.i].length == 0) {
          this.selectedAnswers[eventData.i] = null;
        }
      }
    } else {
      this.selectedAnswers = [event.target.value];
    }

    this.changeTemplateData();
    // console.log('data ', this.templateData);
  }

  // Change value and score of the options in the templateData
  changeTemplateData() {
    this.templateData.data.validation.valid_response = {
      score: this.points,
      value: this.selectedAnswers
    };
    // console.log(this.templateData);
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event) {
    this.points = event;
    this.changeTemplateData();
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson) {
    this.templateData = sourceJson as TemplateMcqData;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    this.sourceStateChange.emit(false);
  }

  //Function to push the newly added stem from the app-add-stems-layout template to the opts array
  pushStems(stem) {
    this.stems.push(stem);
    this.selectedAnswers.push(null);
    // console.log(this.templateData);
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option) {
    this.opts.push(option);
  }

  //Function to remove Stems
  removeStem(sIndex, stem) {
    console.log(sIndex);
    this.stems = this.stems.filter((stems: any) => stems.value !== stem.value);
    this.selectedAnswers = this.selectedAnswers.splice(sIndex, 1);

    // this.templateData.data.stems = this.stems as Array<TemplateMcqOption>;
  }

  //Function to remove options
  removeOption(option) {
    this.opts = this.opts.filter(
      (options: any) => options.value !== option.value
    );

    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
  }

  // Validate the form on submit
  onValidation() {}

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
    this.previewSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
  }
}
