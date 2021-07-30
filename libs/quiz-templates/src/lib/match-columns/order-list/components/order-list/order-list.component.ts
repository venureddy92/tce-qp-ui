import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
  EventEmitter
} from '@angular/core';
import {
  TemplateClassifyMatchData,
  ClassifyMatchOption
} from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OptComponent } from 'libs/quiz-templates/src/lib/sharedComponents/opt/components/opt-layout/opt.component';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
import {
  CdkDragDrop,
  moveItemInArray,
  CdkDragEnd
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @Input() public templateData: TemplateClassifyMatchData;
  @Input() public previewState: boolean;
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
  public shuffleCheck: boolean = false;
  public templateName: string;
  public selectedAnswersData: Array<string> = [];
  public mode: boolean = false;
  public answerState: object = {};

  @ViewChild('qstemRef', { static: false })
  public qstemImgRef: ElementRef;
  @ViewChild('optionsPreviewDivHeight', { static: false })
  public optionsPreviewDivHeight: ElementRef;
  @ViewChild('answersDiv', { static: false })
  public answersDiv: ElementRef;
  @ViewChild('optionsDivMaxHt', { static: false })
  public optionsDivMaxHt: ElementRef;

  constructor(
    public sharedComponentService: SharedComponentService, // private toastrService: ToastrService
    public renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.calculateOptionsDivHeight();
  }

  ngOnInit() {
    this.initState();

    this.changePointsValue();

    this.emitAns();

    // this.previewSubscription = this.previewState.subscribe(state => {
    this.previewShow = this.previewState;

    // if(state) {
    //   this.sharedComponentService.shuffleArray(this.opts)
    // }
    if (!this.previewShow) {
      // let correctAnsPoints = 0;
      // this.showAnswers.emit({
      //   points: this.points,
      //   selectedAnswersPreview: this.selectedAnswersPreview,
      //   correctAnsPoints: correctAnsPoints
      // });
      // this.showAnsState.next(false)
      this.showAnsStateFlag = false;
    }
    // });

    // this.sourceSubscription = this.sourceState.subscribe(state => {
    //   this.sourceModalOpen.next(state);
    // });

    // this.showAnsSubscription = this.showAnsState.subscribe(state => {
    //   this.showAnsStateFlag = state;

    //   this.selectedAnswersData = [];

    //   for (let i = 0; i < this.selectedAnswers.length; i++) {
    //     let sel = this.selectedAnswers[i];

    //     for (let j = 0; j < this.templateData.data.options.length; j++) {
    //       let opt = this.templateData.data.options[j];
    //       if (opt.value == sel) {
    //         console.log('Loop', sel, opt);
    //         this.selectedAnswersData.push(opt.label);
    //       }
    //     }
    //   }
    //   console.log('Selected Answers', this.selectedAnswersData);
    //   this.emitAns();
    // });

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

  onShuffleChange(event): void {
    // console.log("Shuffle Match", event)

    this.shuffleCheck = event;
    this.templateData.data.shuffle = this.shuffleCheck;

    if (this.shuffleCheck) {
      this.sharedComponentService.shuffleArray(this.opts);
    } else {
      this.sharedComponentService.reOrderArray(this.opts);
    }
    // console.log("Opts", this.opts)
  }

  //Function to initial all the variables
  initState(): void {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    this.opts = this.templateData.data.options as Array<ClassifyMatchOption>;

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
    this.shuffleCheck = this.templateData.data.shuffle
      ? this.templateData.data.shuffle
      : false;
    this.templateName = this.templateData.name;
    // this.opts.forEach((options: ClassifyMatchOption)=>{
    //   if(options.selected) {
    //     this.selectedAnswersPreview.push(options.value)
    //   }
    // })
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>): void {
    if (this.previewShow) {
      moveItemInArray(this.opts, event.previousIndex, event.currentIndex);
    } else {
      moveItemInArray(this.answers, event.previousIndex, event.currentIndex);
    }

    var result = [];
    for (var i = 0, n = this.answers.length; i < n; ++i) {
      var ans = this.answers[i];
      result[i] = ans.value;
    }
    console.log('Result', result);
    this.selectedAnswers = result;
    this.emitAns();
    this.emitSelectedAnswers();
    this.changeTemplateData();

    console.log('Dropped', this.opts, this.answers, result);
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

    if (updatedContent['label']) {
      this.opts.forEach(
        (options: any) => options.value == updatedContent['value']
      );
      this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
      this.sharedComponentService.getImageData.next({});
    }
    this.calculateOptionsDivHeight();
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option: ClassifyMatchOption): void {
    this.opts.push(option);
    this.answers.push(option);
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;

    // this.answers.forEach((ans:)=>{
    //   this.templateData.data.validation.valid_response.value.push(ans)
    // })
    this.templateData.data.validation.valid_response.value.push(option.value);
    this.sourceData = this.templateData as TemplateClassifyMatchData;
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(option: ClassifyMatchOption): void {
    console.log('Remove', option);
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
    this.calculateOptionsDivHeight();
  }

  saveData(): void {
    this.sourceData['data'].options = this.opts;
    this.sourceData['data'].shuffle = this.shuffleCheck;
    // console.log("Source Data",this.sourceData)
    this.getAnswers.next(this.sourceData);
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

    this.showAnswers.emit({
      points: this.points,
      selectedAnswersPreview: this.selectedAnswersPreview,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
    // this.previewSubscription.unsubscribe();
    // this.sourceSubscription.unsubscribe();
    // this.showAnsSubscription.unsubscribe();
    if (this.dashboardPreviewSubscription)
      this.dashboardPreviewSubscription.unsubscribe();
  }

  feedbackStemUpdate(ev) {
    console.log(ev);
  }

  calculateOptionsDivHeight() {
    var optionDivHeight;
    if (this.previewShow) {
      if (document.getElementById('qb-preview-submit')) {
        optionDivHeight =
          document.getElementById('qb-preview-submit').offsetTop -
          document.getElementById('qstemRef').offsetHeight -
          175;
        this.optionsPreviewDivHeight.nativeElement.style.maxHeight =
          optionDivHeight + 'px';
      }
    } else {
      if (document.getElementById('qb-preview-submitQuesWrapper')) {
        optionDivHeight =
          document.getElementById('qb-preview-submitQuesWrapper').offsetTop -
          this.answersDiv.nativeElement.offsetTop -
          35;
        this.optionsDivMaxHt.nativeElement.style.maxHeight =
          optionDivHeight + 'px';
        this.optionsDivMaxHt.nativeElement.style.minHeight =
          optionDivHeight + 'px';
      }
    }
  }
}
