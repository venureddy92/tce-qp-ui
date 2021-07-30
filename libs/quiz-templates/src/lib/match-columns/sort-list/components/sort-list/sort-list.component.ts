import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import {
  ClassifyMatchOption,
  TemplateClassifyMatchData
} from 'libs/quiz-player-templates/src/core/interface/quiz-player-template.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedComponentService } from 'libs/quiz-player-templates/src/sharedComponents/core/services/shared-component.service';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { OptComponent } from 'libs/quiz-player-templates/src/sharedComponents/opt/opt.component';

@Component({
  selector: 'app-sort-list',
  templateUrl: './sort-list.component.html',
  styleUrls: ['./sort-list.component.scss']
})
export class SortListComponent implements OnInit {
  @Input() public templateData: TemplateClassifyMatchData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public save: Subject<void>;
  @Input() public metadataSidebar: Subject<void>;
  @Input() public submit: Subject<void>;
  @Input() public dashboardPreviewState: BehaviorSubject<boolean>;

  @Output() public sourceStateChange = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public updateSelectedAnswers = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  @Output() public getAnswers = new EventEmitter();

  @ViewChild(OptComponent, { static: false }) public optComponent: OptComponent;
  @ViewChild('optsContainer', { static: true })
  public optsContainer: ElementRef;

  public answers: ClassifyMatchOption[];

  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );

  public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);

  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private showAnsSubscription: Subscription;
  private dashboardPreviewSubscription: Subscription;

  private saveSubscription: Subscription;
  private metadataSubscription: Subscription;

  public value;
  public inputType: string;
  public templateType: string;
  public selectedAnswersPreview: Array<string> = [];
  public qstem: object = {};
  public opts: ClassifyMatchOption[];
  public optsPreview: ClassifyMatchOption[];
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
  public answerOptions: any = [];
  public shuffleCheck: boolean = false;
  public tempOption: ClassifyMatchOption;
  public tempIndex: number = 0;
  public tempDirection: string;
  public templateName: string;
  public selectedAnswersData: Array<string> = [];

  constructor(
    public sharedComponentService: SharedComponentService, // private toastrService: ToastrService
    public renderer: Renderer2
  ) {}

  ngOnInit() {
    this.initState();

    this.changePointsValue();

    this.emitAns();

    this.previewSubscription = this.previewState.subscribe(state => {
      this.previewShow = state;

      if (state) {
        // this.optsPreview = [...this.opts]
        console.log('Preview Options', this.optsPreview);

        this.optsPreview = [];
        this.opts.forEach(optPrev => {
          optPrev.direction = 'left';

          this.optsPreview.push(optPrev);
        });

        this.answerOptions = [];
        this.optsPreview.forEach(opts => {
          this.answerOptions.push({
            label: '',
            value: '',
            direction: 'right'
          });
        });
        if (this.templateData.data.shuffle) {
          this.onShuffleChange(true);
        }
      } else {
        this.showAnsStateFlag = false;
      }
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.showAnsSubscription = this.showAnsState.subscribe(state => {
      this.showAnsStateFlag = state;

      this.selectedAnswersData = [];

      for (let i = 0; i < this.selectedAnswers.length; i++) {
        let sel = this.selectedAnswers[i];

        for (let j = 0; j < this.templateData.data.options.length; j++) {
          let opt = this.templateData.data.options[j];
          if (opt.value == sel) {
            console.log('Loop', sel, opt);
            this.selectedAnswersData.push(opt.label);
          }
        }
      }
      console.log('Selected Answers', this.selectedAnswersData);
      this.emitAns();
    });

    this.metadataSubscription = this.metadataSidebar.subscribe(() =>
      this.toggleSidebar()
    );

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        state => {
          this.dashboardPreviewShow = state;
        }
      );
    }
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

  //Function to initial all the variables
  initState(): void {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    this.opts = this.templateData.data.options as Array<ClassifyMatchOption>;
    this.optsPreview = [...this.templateData.data.options];
    this.optsPreview.forEach(async (options: ClassifyMatchOption) => {
      options.direction = 'left';
    });

    this.answerOptions = [
      {
        label: '',
        value: '',
        direction: 'right'
      },
      {
        label: '',
        value: '',
        direction: 'right'
      },
      {
        label: '',
        value: '',
        direction: 'right'
      },
      {
        label: '',
        value: '',
        direction: 'right'
      }
    ] as Array<ClassifyMatchOption>;

    if (this.templateData.data.validation.valid_response.value.length > 0) {
      this.answers = [];
      this.templateData.data.validation.valid_response.value.forEach(value => {
        this.templateData.data.options.forEach(opt => {
          if (opt.value == value) {
            this.answers.push(opt);
          }
        });
      });
      this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    } else {
      this.answers = [];
      this.answers = [...this.templateData.data.options];
      this.templateData.data.options.forEach(async (opt, index) => {
        this.selectedAnswers.push(`${index}`);
      });
      this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    }
    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.sourceData = this.templateData as TemplateClassifyMatchData;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.templateName = this.templateData.name;

    // this.opts.forEach((options: ClassifyMatchOption)=>{
    //   if(options.selected) {
    //     this.selectedAnswersPreview.push(options.value)
    //   }
    // })
  }

  getOption(index: number, data: ClassifyMatchOption): void {
    console.log('On click', data, this.tempOption);
    let blankCheck: boolean;
    this.tempDirection = data.direction;
    console.log(this.optsPreview, this.answerOptions);

    if (this.tempOption && this.tempOption.direction == data.direction) {
      if (data.direction == 'right') {
        this.setRightBlank(blankCheck, data);
      } else {
        this.setLeftBlank(blankCheck, data);
      }
    } else {
      if (data.direction == 'left') {
        this.setRightBlank(blankCheck, data);
      } else {
        this.setLeftBlank(blankCheck, data);
      }
    }

    if (!blankCheck) {
      console.log('Temp Option', this.tempOption);
      if (!this.tempOption || this.tempOption.label.length == 0) {
        this.tempOption = data;
        this.tempIndex = index;
      } else {
        let ansTempJson;
        if (this.tempOption.direction == data.direction) {
          if (data.direction == 'left') {
            ansTempJson = this.optsPreview[index];
            this.optsPreview[index] = this.tempOption;
            this.shiftRight(ansTempJson);
          } else {
            ansTempJson = this.answerOptions[index];
            this.answerOptions[index] = this.tempOption;
            this.shiftLeft(ansTempJson);
          }
        } else {
          this.tempOption.direction = data.direction;
          if (data.direction == 'left') {
            ansTempJson = this.optsPreview[index];
            this.optsPreview[index] = this.tempOption;
            this.shiftLeft(ansTempJson);
          } else {
            ansTempJson = this.answerOptions[index];
            this.answerOptions[index] = this.tempOption;
            this.shiftRight(ansTempJson);
          }
        }

        this.tempOption = {
          label: '',
          value: '',
          feedbackInline: '',
          direction: data.direction
        };
        // console.log("Final temp option", this.tempOption)
        this.tempIndex = 0;
      }
    }

    if (this.previewShow) {
      var result = [];
      for (var i = 0, n = this.answerOptions.length; i < n; ++i) {
        var ans = this.answers[i];
        result[i] = ans.value;
      }
      this.selectedAnswers = result;

      // console.log()

      this.emitAns();
      this.emitSelectedAnswers();
      this.changeTemplateData();
    }
  }

  setRightBlank(blankCheck: boolean, data: ClassifyMatchOption) {
    console.log('BlankCheck', this.optsPreview, this.tempIndex, data);

    if (
      this.answerOptions[this.tempIndex].label.length == 0 &&
      data.label.length == 0
    ) {
      blankCheck = true;
    } else {
      blankCheck = false;
    }
  }

  setLeftBlank(blankCheck, data) {
    if (
      this.optsPreview[this.tempIndex].label.length == 0 &&
      data.label.length == 0
    ) {
      blankCheck = true;
    } else {
      blankCheck = false;
    }
  }

  shiftLeft(ansTempJson) {
    ansTempJson.direction = 'right';
    this.tempOption = ansTempJson as ClassifyMatchOption;
    console.log('Temp Option Left', this.tempOption);
    this.answerOptions[this.tempIndex] = this.tempOption;
  }

  shiftRight(ansTempJson) {
    ansTempJson.direction = 'left';
    this.tempOption = ansTempJson as ClassifyMatchOption;
    console.log('Temp Option Right', this.tempOption);
    this.optsPreview[this.tempIndex] = this.tempOption;
  }

  onShuffleChange(event): void {
    console.log('Shuffle Match', event);

    this.shuffleCheck = event;
    this.templateData.data.shuffle = this.shuffleCheck;

    if (this.shuffleCheck) {
      this.sharedComponentService.shuffleArray(this.optsPreview);
    } else {
      this.sharedComponentService.reOrderArray(this.optsPreview);
    }
    // console.log("Opts", this.opts)
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  droppedEdit(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.answers, event.previousIndex, event.currentIndex);
    var result = [];
    for (var i = 0, n = this.answers.length; i < n; ++i) {
      var ans = this.answers[i];
      result[i] = ans.value;
    }
    this.selectedAnswers = result;
    this.emitAns();
    this.emitSelectedAnswers();
    this.changeTemplateData();
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  droppedPreviewLeft(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.opts, event.previousIndex, event.currentIndex);
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  droppedPreviewRight(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.answerOptions,
      event.previousIndex,
      event.currentIndex
    );

    let optionArray = [];
    this.answerOptions.forEach(async optArr => {
      optionArray.push(optArr.value);
    });

    // console.log("Difference", optionArray, this.optValue);
    let arr1 = String(optionArray);
    let arr2 = String(this.selectedAnswers);

    // let correctAnsPoints = 0;

    if (arr1 == arr2) {
      this.correctAnsPoints = this.points;
    } else {
      // this.onSelectedAnswersPreview.emit(false);
      this.correctAnsPoints = 0;
    }

    // console.log("Event",event)
    this.showAnswers.emit({
      points: this.points,
      selectedAnswersPreview: this.selectedAnswersPreview,
      correctAnsPoints: this.correctAnsPoints
    });

    // this.selectedAnswersPreview = [];
    // // this.formulateAnswers();
    // var result = [];
    // for (var i = 0, n = this.answerOptions.length; i < n; ++i) {
    //   var ans = this.answers[i];
    //   result[i] = ans.value;
    // }
    // this.selectedAnswersPreview = result;

    // this.emitAns();
    // this.emitSelectedAnswers();
    // this.changeTemplateData();
    console.log('Answer Options', this.answerOptions);

    // var result = [];
    // for( var i = 0, n = this.answers.length;  i < n;  ++i ) {
    //     var ans = this.answers[i];
    //     result[i] = ans.value;
    // }
    // // this.selectedAnswers = result;
    // // this.emitAns();
    // // this.emitSelectedAnswers();
    // // this.changeTemplateData();

    // console.log("Dropped",this.opts, this.answers, result)
  }

  formulateAnswers(): void {
    // let optionArray = [];
    this.answerOptions.forEach(async optArr => {
      this.selectedAnswers.push(optArr.value);
    });

    // console.log(this.sharedComponentService.getDifferenceOfArray(optionArray,this.optValue));
    // let arr1 = String(optionArray);
    // let arr2 = String(this.templateData.data.validation.valid_response.value);

    // if(arr1 == arr2) {
    //   // this.onSelectedAnswersPreview.emit(true);
    //   return true
    // }
    // else {
    //   // this.onSelectedAnswersPreview.emit(false);
    //   return false
    // }

    // let correctAnsPoints = 0;
    // if(event) {
    //   correctAnsPoints = this.points
    // }
    // else {
    //   correctAnsPoints = 0
    // }
  }

  // Handle the form on submit
  onSubmit(): void {
    console.log('mcq-single-select', 'Submit Pressed');
  }

  /**
   * @description This function emits the selected answers array to the main quiz player component
   * @returns void
   */
  emitSelectedAnswers(): void {
    this.updateSelectedAnswers.emit(this.selectedAnswers);
  }

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

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateClassifyMatchData): void {
    console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent: object): void {
    this.value = updatedContent;
    this.opts.forEach(
      (options: any) => options.value == updatedContent['value']
    );
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.sharedComponentService.getImageData.next({});
  }

  pushOptions(option: ClassifyMatchOption): void {
    this.opts.push(option);
    this.answers.push(option);
    // this.optsPreview.push(option);
    // this.answerOptions.push({
    //   label: '',
    //   value: '',
    //   direction: 'right'
    // },)
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.templateData.data.validation.valid_response.value.push(option.value);
    this.sourceData = this.templateData as TemplateClassifyMatchData;
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(option: ClassifyMatchOption): void {
    // if (this.answers.length > 4) {
    this.value = '';
    this.opts = this.opts.filter(
      (options: ClassifyMatchOption) => options.value !== option.value
    );

    this.answers = this.answers.filter(
      (answer: ClassifyMatchOption) => answer.value !== option.value
    );
    this.selectedAnswers = this.selectedAnswers.filter(
      ans => ans !== option.value
    );
    // this.optsPreview = this.optsPreview.filter(
    //   (options: ClassifyMatchOption) => options.value !== option.value
    // );

    // this.answerOptions.splice(this.answerOptions.length-1, 1)

    this.sharedComponentService.imageModalOpen.next({});
    this.sharedComponentService.getImageData.next({});
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    // }
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent): void {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  saveData(): void {
    this.sourceData['data'].options = this.optsPreview;
    this.sourceData['data'].shuffle = this.shuffleCheck;
    // console.log("Source Data",this.sourceData)
    this.getAnswers.next(this.sourceData);
  }

  // radioOptionSelect(selectedAnswer: string): void {
  //   this.opts.forEach((options: ClassifyMatchOption)=>{
  //     options.selected = false;

  //     if(options.value == selectedAnswer) {
  //       options.selected = true
  //     }
  //   })
  // }

  // multipleOptionSelect(): void {
  //   this.opts.forEach((options: ClassifyMatchOption)=>{
  //     options.selected = false;
  //     this.selectedAnswers.forEach((selAns: string) => {
  //       if(options.value == selAns) {
  //         options.selected = true
  //       }
  //     });
  //   })
  // }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  // getImageUploaded(image): void {
  //   if (this.sourceData['type'] == 'mcq-oi') {
  //     this.sourceData['data'].option_image = image;
  //   } else if (this.sourceData['type'] == 'mcq-qi') {
  //     this.sourceData['data'].question_image = image;
  //   }
  // }

  /**
   * @description To change layout according to vertical, horizontal and grid
   * @param event object
   */
  onLayoutChange(event): void {
    this.layout = event.target.value;
    this.templateData.data.ui_style.type = this.layout;
    if (event.target.value == 'vertical') {
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
    this.deviceView = event.target.value;
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

  onSelectedAnswersPreview(event): void {
    this.correctAnsPoints = 0;
    if (event) {
      this.correctAnsPoints = this.points;
    } else {
      this.correctAnsPoints = 0;
    }

    // console.log("Event",event)
    this.showAnswers.emit({
      points: this.points,
      selectedAnswersPreview: this.selectedAnswersPreview,
      correctAnsPoints: this.correctAnsPoints
    });
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
