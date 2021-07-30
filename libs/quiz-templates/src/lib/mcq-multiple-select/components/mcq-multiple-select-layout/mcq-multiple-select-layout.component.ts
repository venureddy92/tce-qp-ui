import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
  TemplateMcqData,
  TemplateMcqOption
} from './../../core/interface/quiz-player-template.interface';
import { ITemplate } from './../../core/interface/template.interface';
import { SharedComponentService } from '../../sharedComponents/core/services/shared-component.service';

@Component({
  selector: 'mcq-multiple-select-layout',
  templateUrl: './mcq-multiple-select-layout.component.html',
  styleUrls: ['./mcq-multiple-select-layout.component.scss']
})
export class McqMultipleSelectLayoutComponent implements OnInit, ITemplate {
  @Input() public templateData: TemplateMcqData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Output() public sourceStateChange = new EventEmitter();
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;

  @Output() public showAnswers = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();

  public qstem: object = {};
  public opts: Array<object> = [];
  public layout: string = 'horizontal';
  public inputName: string;
  public inputType: string = 'checkbox';
  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  public selectedAnswers: Array<string> = [];
  public points: number;
  public previewShow: boolean = true;
  public sourceData: TemplateMcqData;

  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );
  public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);
  private showAnsSubscription: Subscription;
  public showAnsStateFlag: boolean;
  public selectedAnswersPreview: Array<string> = [];
  public correctAnsPoints: number = 0;

  constructor(public sharedComponentService: SharedComponentService) {}

  ngOnInit() {
    this.initState();
    this.emitAns();

    this.previewSubscription = this.previewState.subscribe(state => {
      this.previewShow = state;
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.showAnsSubscription = this.showAnsState.subscribe(state => {
      this.showAnsStateFlag = state;
      this.emitAns();
    });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());
  }

  //Function to emit data to the option component
  emitAns() {
    this.getShowAnsState.next({
      selectedAnswersPreview: this.selectedAnswersPreview,
      selectedAnswers: this.selectedAnswers,
      state: this.showAnsStateFlag
    });
  }

  //Function to initial all the variables
  initState() {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    this.opts = this.templateData.data.options as Array<TemplateMcqOption>;
    this.layout = this.templateData.data.ui_style.type;
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.sourceData = this.templateData as TemplateMcqData;
  }

  //Output function which retrieves the values selected from the app-set-correct-ans-options-layout component
  getSelectedAns(event) {
    if (!this.selectedAnswers.includes(event)) {
      this.selectedAnswers.push(event);
    } else {
      this.selectedAnswers = this.selectedAnswers.filter(ans => ans !== event);
    }
    this.emitAns();
    this.changeTemplateData();
  }

  // Change value and score of the options in the templateData
  changeTemplateData() {
    this.templateData.data.validation.valid_response = {
      score: this.points,
      value: this.selectedAnswers
    };
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event) {
    this.points = event;
    this.changeTemplateData();
    this.changePointsValue();
  }

  changePointsValue() {
    this.updatePoints.next(this.points);
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson) {
    this.templateData = sourceJson as TemplateMcqData;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    this.emitAns();
    this.changePointsValue();
    this.sourceStateChange.emit(false);
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option) {
    this.opts.push(option);
    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
    this.sourceData = this.templateData as TemplateMcqData;
  }

  //Function to remove options
  removeOption(option) {
    this.opts = this.opts.filter(
      (options: any) => options.value !== option.value
    );

    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent) {
    this.opts.forEach((options: any) => options.value == updatedContent.value);
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  // Handle the form on submit
  onSubmit() {
    // console.log('mcq-multiple-select', 'Submit Pressed');
  }

  //Function to get the selected options and set answer points
  onSelectedAnswersPreview(selectedAnswer) {
    if (!this.selectedAnswersPreview.includes(selectedAnswer)) {
      this.selectedAnswersPreview.push(selectedAnswer);
    } else {
      this.selectedAnswersPreview = this.selectedAnswersPreview.filter(
        ans => ans !== selectedAnswer
      );
    }

    if (
      this.sharedComponentService.getDifferenceOfArray(
        this.selectedAnswersPreview,
        this.templateData.data.validation.valid_response.value
      ).length == 0
    ) {
      this.correctAnsPoints = this.points;
    } else {
      this.correctAnsPoints = 0;
    }

    this.showAnswers.emit({
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  // Validate the form on submit
  onValidation() {}

  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
    this.previewSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
    this.showAnsSubscription.unsubscribe();
  }
}
