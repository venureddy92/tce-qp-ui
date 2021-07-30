import {
  Component,
  OnInit,
  EventEmitter,
  ElementRef,
  Output,
  Input,
  ViewChild,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import {
  TemplateMultipleQuestionData,
  TemplateMultipleOption
} from '../../core/interface/quiz-player-template.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OptComponent } from '../../sharedComponents/opt/opt.component';
import { SharedComponentService } from '../../sharedComponents/core/services/shared-component.service';

@Component({
  selector: 'app-multiple-question-layout',
  templateUrl: './multiple-question-layout.component.html',
  styleUrls: ['./multiple-question-layout.component.scss']
})
export class MultipleQuestionLayoutComponent implements OnInit {
  @Input() public templateData: TemplateMultipleQuestionData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Input() public metadataSidebar: Subject<void>;
  @Input() public viewDevice: Subject<void>;
  @Input() public layoutView: Subject<void>;
  @Input() public dashboardPreviewState: BehaviorSubject<boolean>;

  @Output() public sourceStateChange = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public updateSelectedAnswers = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  @Output() public getAnswers = new EventEmitter();
  public responseArray: Array<any> = [[]];

  @ViewChild(OptComponent, { static: false }) public optComponent: OptComponent;
  @ViewChild('optsContainer', { static: true })
  public optsContainer: ElementRef;
  public shuffleCheck: boolean = false;

  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );

  public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private showAnsSubscription: Subscription;
  private dashboardPreviewSubscription: Subscription;
  private saveSubscription: Subscription;
  private metadataSubscription: Subscription;
  private deviceViewSubscription: Subscription;
  private layoutViewSubscription: Subscription;

  public inputType: string = 'radio';
  public templateType: string;
  public selectedAnswersPreview: Array<string> = [];
  public qstem: object = {};
  public opts: TemplateMultipleOption[];
  public optsPreview: TemplateMultipleOption[];
  public layout: string;
  public inputName: string;
  public selectedAnswers: Array<string> = [];
  public points: number;
  public previewShow: boolean = true;
  public dashboardPreviewShow: boolean = true;
  public sourceData: object = {};
  public correctAnsPoints: number = 0;
  public showAnsStateFlag: boolean;
  public toggleDiv: boolean = false;
  public displayMode: string;
  public navbarOpen: boolean = false;
  public metaData: object = {};
  public deviceView: string = 'laptop';
  public image: string;
  public layoutArray: Array<string> = ['vertical', 'horizontal', 'grid'];
  public laptopView: boolean = true;
  public mobileView: boolean = false;
  public mobileLsView: boolean = false;
  public labels: Array<string> = [];
  public default: number;
  public defaultArray: Array<any> = [];
  public matchArray: Array<any> = [];
  public templateName: string;

  // flag to set customToolbarOption
  public multipleQuestionToolbarOption: boolean = true;
  public randomIndex: number = 0;
  public variable: string =
    '<variable class="badge badge-warning" data-marker="Response" data-title="Response">﻿<span contenteditable="false">VARIABLE</span>﻿</variable>';

  constructor(
    public sharedComponentService: SharedComponentService, // private toastrService: ToastrService
    public renderer: Renderer2,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initState();
    this.changePointsValue();
    this.emitAns();

    this.previewSubscription = this.previewState.subscribe(state => {
      this.previewShow = state;
      this.emitAns();
      this.optsPreview.forEach(opts => {
        opts.selected = false;
        opts.checked = false;
      });

      this.sharedComponentService.imageModalOpen.next({});

      if (state) {
        this.randomIndex = Math.floor(Math.random() * this.default) + 0;

        this.optsPreview.forEach(opts => {
          opts.selected = false;
          opts.checked = false;
        });
        this.selectedAnswersPreview = [];
        if (
          this.sharedComponentService.getDifferenceOfArray(
            this.selectedAnswersPreview,
            this.selectedAnswers
          )
        ) {
          this.correctAnsPoints = 0;
        } else {
          this.correctAnsPoints = 1;
        }
        this.showAnswers.emit({
          points: this.points,
          selectedAnswersPreview: this.selectedAnswersPreview,
          correctAnsPoints: this.correctAnsPoints
        });
      } else {
        this.showAnsState.next(false);
      }
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.showAnsSubscription = this.showAnsState.subscribe(state => {
      this.showAnsStateFlag = state;
      this.emitAns();
    });

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        state => {
          this.dashboardPreviewShow = state;
        }
      );
    } else {
      this.previewState.next(false);
    }

    this.metadataSubscription = this.metadataSidebar.subscribe(() =>
      this.toggleSidebar()
    );

    this.deviceViewSubscription = this.viewDevice.subscribe(event =>
      this.deviceViewChange(event)
    );

    this.layoutViewSubscription = this.layoutView.subscribe(event =>
      this.onLayoutChange(event)
    );
  }

  emitAns(): void {
    this.getShowAnsState.next({
      selectedAnswersPreview: this.selectedAnswersPreview,
      selectedAnswers: this.selectedAnswers,
      state: this.showAnsStateFlag,
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  getAnswerStatus(opt) {
    let status: string = 'incorrect';
    if (this.showAnsStateFlag) {
      for (let i = 0; i < this.selectedAnswers.length; i++) {
        if (this.selectedAnswers[i] == opt.value) {
          status = 'correct';
        }
      }
    }
    if (opt.checked && !opt.selected) {
      status = 'incorrect';
    }
    if (!opt.selected && status == 'incorrect') {
      status = null;
    }
    return status;
  }

  //Function to initial all the variables
  initState(): void {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    console.log('Qstem', this.qstem);
    this.opts = this.templateData.data.options as Array<TemplateMultipleOption>;
    this.optsPreview = [...this.opts];
    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData as TemplateMultipleQuestionData;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.templateName = this.templateData.name;
    this.shuffleCheck = this.templateData.data.shuffle
      ? this.templateData.data.shuffle
      : false;
    this.default = this.templateData.data.default;
    this.defaultArray = this.templateData.data.qstemResponse;
    if (this.previewShow) {
      this.selectedAnswersPreview = [];
    }

    this.optsPreview.forEach((options: TemplateMultipleOption) => {
      if (options.selected) {
        this.selectedAnswersPreview.push(options.value);
      }
    });

    this.createLabels();
  }

  /**
   * @description Too create the labels of the optons
   */
  createLabels() {
    this.labels = [];
    for (var i = 0; i < this.opts.length; i++) {
      let j = i + 1;
      this.labels.push(String.fromCharCode(64 + j));
    }
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.opts, event.previousIndex, event.currentIndex);
    moveItemInArray(this.optsPreview, event.previousIndex, event.currentIndex);

    this.templateData.data.options = this.opts;
    this.sourceData = this.templateData;
  }

  // Handle the form on submit
  onSubmit(): void {
    console.log('mcq-single-select', 'Submit Pressed');
  }

  //Output function which retrieves the values selected from the app-set-correct-ans-options-layout component
  getSelectedAns(event: string): void {
    this.selectedAnswers = [event];
    this.emitAns();
    this.changeTemplateData();
  }

  /**
   * @description Thids function changes the points and the correct answers for a particular question
   * @returns void
   */
  changeTemplateData(): void {
    this.templateData.data.validation.valid_response = {
      score: this.points,
      value: this.selectedAnswers
    };
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event: number): void {
    this.points = event;
    this.changeTemplateData();
    this.changePointsValue();
  }

  /**
   * @description Thid function updates the points in the header depending upon whether the user has selected the correct or in-correct answer.
   * @returns void
   */
  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson): void {
    this.templateData = sourceJson;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent, index): void {
    let optMatchArray =
      (updatedContent.label &&
        updatedContent.label.match(
          /<variable class="badge badge-warning" data-marker="Response" data-title="Response">﻿<span contenteditable="false">VARIABLE/g
        )) ||
      [];

    if (optMatchArray.length > 0) {
      for (let defaultIndex = 0; defaultIndex < this.default; defaultIndex++) {
        if (this.opts[index].response.length < this.default) {
          this.opts[index].response.push(`Option${defaultIndex + 1}`);
        }
      }
    } else {
      this.opts[index].response = [];
    }

    for (let i = 0; i < this.opts.length; i++) {
      if (this.opts[i].label) {
        this.opts[i].label = this.opts[i].label.replace(
          this.variable,
          `{{response}}`
        );
      }
    }
    this.templateData.data.options = this.opts as Array<TemplateMultipleOption>;
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option: TemplateMultipleOption): void {
    option.response = [];
    this.opts.push(option);
    this.optsPreview = [...this.opts];
    this.templateData.data.options = this.opts as Array<TemplateMultipleOption>;
    this.sourceData = this.templateData as TemplateMultipleQuestionData;

    this.createLabels();
  }

  /**
   * @param index Type = number
   * @description This function returns focus on to the input box as it has been assigned with dynamic ngModel.
   * @returns index Type = number
   */
  trackByFn(index: number) {
    return index;
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(option: TemplateMultipleOption) {
    this.opts = this.opts.filter(
      (options: TemplateMultipleOption) => options.value !== option.value
    );
    this.selectedAnswers = this.selectedAnswers.filter(
      sel => sel !== option.value
    );
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    this.sharedComponentService.imageModalOpen.next({});
    this.sharedComponentService.getImageData.next({});
    this.optsPreview = [...this.opts];
    this.templateData.data.options = this.opts as Array<TemplateMultipleOption>;
    this.createLabels();
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    this.matchArray =
      (updatedContent.text &&
        updatedContent.text.match(
          /<variable class="badge badge-warning" data-marker="Response" data-title="Response">﻿<span contenteditable="false">VARIABLE/g
        )) ||
      [];

    this.defaultArray = [];

    console.log('matched array', this.matchArray, updatedContent);
    for (let i = 0; i < this.matchArray.length; i++) {
      updatedContent.text = updatedContent.text.replace(
        this.variable,
        `{{response}}`
      );

      let defaultArr = [];
      for (let defaultIndex = 0; defaultIndex < this.default; defaultIndex++) {
        defaultArr.push(`Variable${defaultIndex + 1}`);
      }
      this.defaultArray.push(defaultArr);
    }
    this.templateData.data.qstemResponse = this.defaultArray;
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  /**
   * @description This function removes the variable from beneath the qstem component
   * @param numIndex Type = number
   * @returns void
   */
  removeVariable(numIndex: number): void {
    for (let i = 0; i < this.defaultArray.length; i++) {
      this.defaultArray[i].splice(numIndex, 1);
      this.default = this.defaultArray[i].length;
    }
    for (let i = 0; i < this.opts.length; i++) {
      this.opts[i].response.splice(numIndex, 1);
    }
    this.optsPreview = [...this.opts];
    this.templateData.data.default = this.default;
    this.templateData.data.options = this.opts;
    this.sourceData = this.templateData;
  }

  /**
   * @description This function adds variable below the qstem component and options component when the response tag has been added in the qstem component
   * @returns void
   */
  addVariable() {
    for (let i = 0; i < this.defaultArray.length; i++) {
      this.defaultArray[i].push(`Variable${this.defaultArray[i].length + 1}`);
      this.default = this.defaultArray[i].length;
    }
    for (let i = 0; i < this.opts.length; i++) {
      if (this.opts[i].response.length > 0)
        this.opts[i].response.push(`Option${this.opts[i].response.length + 1}`);
    }
    this.optsPreview = [...this.opts];
    this.templateData.data.default = this.default;
    this.templateData.data.options = this.opts;
    this.templateData.data.qstemResponse = this.defaultArray;
    this.sourceData = this.templateData;
  }

  /**
   * @description This functions sends the data which is supposed to be saved to the dashboard
   * @returns void
   */
  saveData(): void {
    let matchCheck = 0;
    let emptyCheck = 0;
    this.optsPreview.forEach((opts: TemplateMultipleOption) => {
      opts.selected = false;

      if (!opts.label || opts.label.length == 0) {
        emptyCheck = 1;
      } else if (opts.label && !opts.label.match(/{{response}}/g)) {
        matchCheck = 1;
      }
    });
    console.log('Check', this.sourceData);

    if (
      !this.sourceData['data']['stimulus'].label ||
      this.sourceData['data']['stimulus'].label.length == 0
    ) {
      alert('Please fill the question field!');
    } else if (emptyCheck > 0) {
      alert('Please fill all the option fields!');
    } else if (!this.qstem['text'].match(/{{response}}/g)) {
      alert('Add response tag to the question field!');
    } else if (matchCheck > 0) {
      alert('Add response tags to all options!');
    } else {
      this.sourceData['data'].options = this.optsPreview;
      this.sourceData['data'].shuffle = this.shuffleCheck;
      console.log('Save source', this.sourceData);
      this.getAnswers.next(this.sourceData);
    }
  }

  /**
   *
   * @param selectedAnswer Type = String
   * @description This function sets the selected property of the opts array true or false by comparing it to the selectedAnswers retrieved from the options component.
   * @returns void
   */
  radioOptionSelect(selectedAnswer: string) {
    this.opts.forEach((options: TemplateMultipleOption) => {
      options.selected = false;
      if (options.value == selectedAnswer) {
        options.selected = true;
      }
    });
  }

  checkOption(selectedAnswer: string) {
    this.opts.forEach((options: TemplateMultipleOption) => {
      options.checked = false;
      if (options.value == selectedAnswer) {
        options.checked = true;
      }
    });
  }

  /**
   * (if condition): It retrieves the values selected from the app-set-correct-ans-options-layout component
   * (else condition): It gets the selected options and set answer points
   * @param selectedAnswer: string
   * @description Function to get the selected options and set answer points
   */
  onSelectedAnswersPreview(selectedAnswer) {
    if (!this.previewShow) {
      this.selectedAnswers = [selectedAnswer];
      this.radioOptionSelect(selectedAnswer);

      if (
        this.sharedComponentService.getDifferenceOfArray(
          this.selectedAnswersPreview,
          this.selectedAnswers
        ).length == 0
      ) {
        this.correctAnsPoints = this.points;
      } else {
        this.correctAnsPoints = 0;
      }
      this.emitAns();
      this.changeTemplateData();
    } else {
      this.selectedAnswersPreview = [selectedAnswer];
      this.radioOptionSelect(selectedAnswer);
      this.checkOption(selectedAnswer);

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

      this.optsPreview.forEach((options: TemplateMultipleOption) => {
        options.selected = false;
        this.selectedAnswersPreview.forEach((sel: string) => {
          if (options.value == sel) {
            options.selected = true;
          }
        });
      });
      this.showAnswers.emit({
        points: this.points,
        selectedAnswersPreview: this.selectedAnswersPreview,
        correctAnsPoints: this.correctAnsPoints
      });
      this.correctAnsPoints = 0;
      this.changeTemplateData();
    }
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  /**
   * @description To change layout according to vertical, horizontal and grid
   * @param event object
   */
  onLayoutChange(event): void {
    this.layout = event;
    this.templateData.data.ui_style.type = this.layout;
    if (event == 'vertical') {
      this.renderer.setAttribute(
        this.optsContainer.nativeElement,
        'cdkDropListOrientation',
        'vertical'
      );
    } else {
      this.renderer.setAttribute(
        this.optsContainer.nativeElement,
        'cdkDropListOrientation',
        'horizontal'
      );
    }
  }

  /**
   * @description To toggle side bar for metadata
   */
  toggleSidebar(metadata?): void {
    if (metadata) {
      this.metaData = this.templateData.data.metadata = metadata;
    }
    this.navbarOpen = !this.navbarOpen;
  }

  /**
   * @description To change the layout according to device (tab, mobile)
   * @param event object
   */
  deviceViewChange(event): void {
    this.deviceView = event;
  }

  /**
   * @description This function returns the layout type
   * @param layout Type = string
   * @returns string
   */
  getLayoutType(layout): string {
    let state = this.layoutArray.find(lay => lay === layout);
    if (state) {
      return layout;
    } else {
      return 'vertical';
    }
  }

  onShuffleChange(event): void {
    this.shuffleCheck = event;
    this.templateData.data.shuffle = this.shuffleCheck;

    if (this.shuffleCheck) {
      this.sharedComponentService.shuffleArray(this.optsPreview);
    } else {
      this.sharedComponentService.reOrderArray(this.optsPreview);
    }
  }

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
    this.previewSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
    this.showAnsSubscription.unsubscribe();
    if (this.dashboardPreviewSubscription)
      this.dashboardPreviewSubscription.unsubscribe();
  }
}
