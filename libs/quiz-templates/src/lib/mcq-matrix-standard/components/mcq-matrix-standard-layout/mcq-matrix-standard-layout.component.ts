import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2
} from '@angular/core';
import {
  TemplateMcqData,
  TemplateMcqOption,
  TemplateMcqStem
} from '../../core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { SharedComponentService } from '../../sharedComponents/core/services/shared-component.service';
import { validate } from '@babel/types';

@Component({
  selector: 'app-mcq-matrix-standard-layout',
  templateUrl: './mcq-matrix-standard-layout.component.html',
  styleUrls: ['./mcq-matrix-standard-layout.component.scss']
})
export class McqMatrixStandardLayoutComponent implements OnInit {
  @Input() public templateData: TemplateMcqData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Input() public metadataSidebar: Subject<void>;
  @Input() public dashboardPreviewState: BehaviorSubject<boolean>;
  @Output() public sourceStateChange = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public updateSelectedAnswers = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public getAnswers = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});

  public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  public qstem: object = {};
  public opts: Array<TemplateMcqOption> = [];
  public optsPreview: Array<TemplateMcqOption> = [];
  public stems: Array<TemplateMcqStem> = [];
  public layout: string = 'horizontal';
  public inputName: string;
  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private dashboardPreviewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private metadataSubscription: Subscription;
  private showAnsSubscription: Subscription;
  private saveSubscription: Subscription;
  public showAnsStateFlag: boolean;
  public selectedAnswers: any;
  public points: number;
  public previewShow: boolean = true;
  public sourceData: object = {};
  public inputType: string = 'radio';
  public matrixType: string;
  public templateType: string;
  public selectedAnswersPreview: any;
  public correctAnsPoints: number = 0;
  public labels: Array<string> = [];
  public dashboardPreviewShow: boolean = true;
  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );
  public navbarOpen: boolean = false;
  public metaData: object = {};
  public shuffleCheck: boolean = false;
  correctAnswer: any;
  optData: any;
  public showCorrectAnswer: boolean;
  optElement: any;
  public templateName: string;

  classes: any = [];

  constructor(
    public sharedComponentService: SharedComponentService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.initState();

    this.changePointsValue();

    this.emitAns();

    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        state => {
          this.dashboardPreviewShow = state;
        }
      );
    } else {
      this.previewState.next(false);
    }

    this.previewSubscription = this.previewState.subscribe(state => {
      console.log('State: ', state);

      this.previewShow = state;
      if (this.previewShow) {
        this.selectedAnswersPreview = [];
        this.correctAnsPoints = 0;
        this.emitPoints();
        this.createClasses();
        console.log('Class: ', this.classes);
        // this.removeLabelClass();
      } else {
        this.showAnsStateFlag = false;
      }
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.showAnsSubscription = this.showAnsState.subscribe(
      state => {
        console.log('called oninit', state);
        this.showAnsStateFlag = state;
        // if (!this.previewShow) this.showAnsStateFlag = false;
        console.log('Flag --> ', state);

        this.emitAns();
      },
      err => {
        console.log('Err in sub ', err);
      },
      () => {
        console.log('Sub completed');
      }
    );

    this.metadataSubscription = this.metadataSidebar.subscribe(() =>
      this.toggleSidebar()
    );

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    if (this.templateType == 'mcq-mxs') {
      this.matrixType = 'standard';
    } else {
      if (this.templateType == 'mcq-mxi') {
        this.matrixType = 'inline';
      } else {
        this.matrixType = 'labels';
      }
    }

    this.createClasses();
  }

  createClasses() {
    this.classes = [];
    let stemsLength = this.stems.length;
    let optsLength = this.opts.length;
    for (var i = 0; i < stemsLength; i++) {
      this.classes[i] = [];
      for (var j = 0; j < optsLength; j++) {
        this.classes[i][j] = 'radio-label';
      }
    }
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  emitAns(): void {
    this.getShowAnsState.next({
      selectedAnswersPreview: this.selectedAnswersPreview,
      selectedAnswers: this.selectedAnswers,
      state: this.showAnsStateFlag,
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
    // this.getOptionClass();
  }
  answer;
  //Function to initial all the variables
  initState() {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    // this.qstem = this.templateData.data.stimulus;
    this.opts = this.templateData.data.options as Array<TemplateMcqOption>;
    this.optsPreview = [...this.opts];
    this.stems = this.templateData.data.stems;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.selectedAnswersPreview = [];
    this.layout = this.templateData.data.ui_style.type;
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.sourceData = this.templateData as TemplateMcqData;
    this.templateType = this.templateData.type;
    this.metaData = this.templateData.data.metadata;
    this.templateName = this.templateData.name;

    this.selectedAnswers.forEach((options: TemplateMcqOption) => {
      this.selectedAnswersPreview.push([null]);
    });

    this.createLabels();
  }

  /** function to create alphabets labels */
  createLabels() {
    this.labels = [];
    for (var i = 0; i < this.stems.length; i++) {
      let j = i + 1;
      this.labels.push(String.fromCharCode(64 + j));
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

  emitPoints() {
    if (!this.dashboardPreviewState) {
      this.showAnswers.emit({
        points: this.points,
        selectedAnswersPreview: this.selectedAnswersPreview,
        correctAnsPoints: this.correctAnsPoints
      });
    }
  }

  saveData(): void {
    this.sourceData['data'].options = this.opts;
    this.sourceData['data'].shuffle = this.shuffleCheck;
    // console.log("Source Data", this.sourceData)
    this.getAnswers.next(this.sourceData);
  }

  // Handle the form on submit
  onSubmit() {
    console.log('mcq-true-false', 'Submit Pressed');
  }

  //Output function which retrieves the values selected from the app-set-correct-ans-options-layout component
  getSelectedAns(i, event) {
    this.selectedAnswersPreview[i];
    if (!this.previewShow) {
      if (this.inputType == 'checkbox') {
        if (event.target.checked) {
          if (this.selectedAnswers[i] == null) {
            this.selectedAnswers[i] = [event.target.value];
          } else {
            this.selectedAnswers[i].push(event.target.value);
          }
        } else {
          this.selectedAnswers[i] = this.selectedAnswers[i].filter(
            (options: any) => options !== event.target.value
          );
          if (this.selectedAnswers[i].length == 0) {
            this.selectedAnswers[i] = null;
          }
        }
      } else {
        this.selectedAnswers[i] = [event.target.value];
      }
    } else {
      if (this.inputType == 'checkbox') {
        if (event.target.checked) {
          if (!this.selectedAnswersPreview[i]) {
            this.selectedAnswersPreview[i] = [event.target.value];
          } else {
            this.selectedAnswersPreview[i].push(event.target.value);
          }
        } else {
          this.selectedAnswersPreview[i] = this.selectedAnswers[i].filter(
            (options: any) => options !== event.target.value
          );
          if (this.selectedAnswersPreview[i].length == 0) {
            this.selectedAnswersPreview[i] = null;
          }
        }
      } else {
        this.selectedAnswersPreview[i] = [event.target.value];
        console.log(
          'dcdsfs ',
          this.selectedAnswers,
          this.selectedAnswersPreview
        );
      }
      let correctLength = 0;
      let valLength = this.templateData.data.validation.valid_response.value
        .length;

      for (let k = 0; k < valLength; k++) {
        let a = this.sharedComponentService.getDifferenceOfArray(
          this.selectedAnswersPreview[k],
          this.templateData.data.validation.valid_response.value[k]
        );
        console.log('aaa: ', a);
        correctLength += a.length;
      }

      console.log('ccc: ', correctLength);

      if (correctLength == 0) {
        this.correctAnsPoints = this.points;
      } else {
        this.correctAnsPoints = 0;
      }
    }

    this.emitPoints();
    this.changeTemplateData();
    if (this.showAnsStateFlag) {
      this.createClasses();
      this.checkAnswers();
    }
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
    // console.log('Points ', event);
    this.points = event;
    this.changeTemplateData();
    this.changePointsValue();
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateMcqData): void {
    console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
  }

  //Function to push the newly added stem from the app-add-stems-layout template to the opts array
  pushStems(stem) {
    this.stems.push(stem);
    this.selectedAnswers.push([null]);
    // console.log(this.templateData);
    this.createLabels();
    this.createClasses();
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option) {
    this.opts.push(option);
    this.optsPreview.push(option);
    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
    // this.templateData.data.validation.valid_response.value.push('cczcsc');
    this.sourceData = this.templateData as TemplateMcqData;
    this.createClasses();
  }

  //Function to remove Stems
  removeStem(sIndex, stem) {
    console.log('Selected Answer', this.selectedAnswers);
    this.stems = this.stems.filter((stems: any) => stems.value !== stem.value);
    this.selectedAnswers.splice(sIndex, 1);
    this.templateData.data.stems = this.stems;
    console.log('Selected Answer 1: ', this.showAnswers);
    // this.templateData.data.stems = this.stems as Array<TemplateMcqOption>;
    this.createLabels();
    this.createClasses();
  }

  //Function to remove options
  removeOption(option, i) {
    // console.log('OPTION: ', option);
    console.log('classes1: ', this.classes, this.createClasses());
    this.opts = this.opts.filter(
      (options: any) => options.value !== option.value
    );
    this.optsPreview = this.optsPreview.filter(
      (options: any) => options.value !== option.value
    );

    console.log('PreviewOPT: ', this.opts, this.optsPreview);
    console.log('Selected Answer: ', this.selectedAnswers);
    this.selectedAnswers.filter((answer: any) => {
      if (answer && answer[0] == option.value) {
        answer[0] = null;
      }
    });

    // this.templateData.data.validation.valid_response.value.splice(i, 1);

    this.templateData.data.options = this.opts;
    this.createLabels();
    this.createClasses();
    console.log('classes2: ', this.classes, this.createClasses());
  }

  // Validate the form on submit
  onValidation() {}

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    // this.submitSubscription.unsubscribe();
    // this.previewSubscription.unsubscribe();
    // this.sourceSubscription.unsubscribe();
  }

  onRowColUpdate(event, index) {
    console.log('Event', event);
    if (event) {
      this.opts[index]['label'] = event;
      this.optsPreview = [...this.opts];
      this.initState();
    }
  }

  onQstemContentUpdate(updatedContent) {
    console.log('QStem Updated: ', updatedContent);
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  onStemContentUpdate(updatedContent, index) {
    this.templateData.data.stems[index].text = updatedContent.text;
    this.initState();
  }

  getOptionClass(index, id, val) {
    let value = 'radio-label';
    if (this.showAnsStateFlag) {
      if (this.selectedAnswers[index][0] == val) {
        value = 'radio-tick-label';
      } else if (
        this.selectedAnswers[index][0] != val &&
        // @ts-ignore
        document.getElementById(id).checked
      ) {
        value = 'radio-cross-label';
      } else {
        value = 'radio-label';
      }
    } else {
      value = 'radio-label';
    }
    // console.log(value);
    return value;
  }

  checkAnswers() {
    let stemsLength = this.stems.length;
    let optsLength = this.opts.length;
    for (var i = 0; i < stemsLength; i++) {
      let currentSelectedAns = this.selectedAnswers[i];
      for (var j = 0; j < optsLength; j++) {
        let radioDoc = document.getElementById(`p-${i}-mcq-${j}`);

        if (`${j}` === currentSelectedAns[0]) {
          this.classes[i][j] = `radio-tick-label`;
        } else {
          // @ts-ignore
          if (radioDoc.checked === true) {
            this.classes[i][j] = `radio-cross-label`;
          }
        }
      }
    }
  }

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  /**
   * @description This function emits the selected answers array to the main quiz player component
   * @returns void
   */
  emitSelectedAnswers(): void {
    this.updateSelectedAnswers.emit(this.selectedAnswers);
  }

  /**
   * @description Function to get the checked status for that particular option
   * @param optData Type = string
   */
  getInputStatus(i, optData) {
    if (this.previewShow && !this.selectedAnswersPreview) {
      return false;
    } else {
      // console.log('Selected Answer Preview', this.selectedAnswersPreview);
      if (this.selectedAnswersPreview && this.previewShow) {
        // if (this.selectedAnswersPreview && this.previewShow) {

        return this.checkSelected(this.selectedAnswersPreview[i], optData);
      } else if (!this.previewShow) {
        return this.checkSelected(this.selectedAnswers[i], optData);
      }
    }
  }

  /**
   * @description This function checks for the value in the array and returns true or false accordingly
   * @param dataArray Type = Array<string>
   * @param optData Type = string
   * @returns void
   */
  checkSelected(dataArray: Array<any>, optData: string): boolean {
    let status = 0;
    if (dataArray) {
      dataArray.forEach(opts => {
        if (optData == opts) {
          status = 1;
        }
      });

      if (status == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
