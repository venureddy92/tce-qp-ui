import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ViewChild,
  ElementRef,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  HostListener
} from '@angular/core';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import {
  TemplateMcqData,
  TemplateMcqOption
} from '../../../core/interface/quiz-player-template.interface';
import { ITemplate } from '../../../core/interface/template.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OptComponent } from '../../../sharedComponents/opt/components/opt-layout/opt.component';
import { ToastrService } from 'ngx-toastr';
import { SharedComponentService } from '@tce/quiz-templates';
import { QuestionEditorService } from '@tce/template-editor';
import { TemplateMarker } from '../../../sharedEditors/quill-component/template-maker.class';
import { filter } from 'rxjs/operators';

// declare var window: Window;
// import Quill from 'quill';
// // let myWindow = window as any;
// window['Quill'] = Quill;

@Component({
  selector: 'mcq-single-select-layout',
  templateUrl: './mcq-single-select-layout.component.html',
  styleUrls: ['./mcq-single-select-layout.component.scss']
})
export class McqSingleSelectLayoutComponent
  implements OnInit, ITemplate, AfterViewInit, OnChanges {
  @Input() public templateData: TemplateMcqData;
  @Input() public previewState: boolean = true;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Input() public metadataSidebar: Subject<void>;
  @Input() public viewDevice: Subject<void>;
  @Input() public layoutView: Subject<void>;
  @Input() public dashboardPreviewState: boolean;
  public showAnsStateFlag: boolean;
  public answerState: object = {};

  @Output() public sourceStateChange = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public updateSelectedAnswers = new EventEmitter();
  @Output() public allowSubmit = new EventEmitter();
  @Output() public correctAnswerCheck = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  @Output() public getAnswers = new EventEmitter();

  @Output() public feedbackPlaceholder = new EventEmitter<any>();

  @ViewChild(OptComponent, { static: false }) public optComponent: OptComponent;
  @ViewChild('optsContainer', { static: true })
  public optsContainer: ElementRef;
  public shuffleCheck: boolean = false;
  public selectedOpt: number;
  public openImgSizes: boolean = false;
  public questionImage: string;
  public optionImageLayout: boolean = false;
  public optionImage: string = '';
  public uploadImageName: string;
  public uploadImageFolder: string;
  //for future reference - Usman
  // public feedbackModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
  //   boolean
  // >(false);

  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private showAnsSubscription: Subscription;
  private dashboardPreviewSubscription: Subscription;
  private saveSubscription: Subscription;
  private metadataSubscription: Subscription;
  private deviceViewSubscription: Subscription;
  private layoutViewSubscription: Subscription;
  private showAnsState: Subscription;
  private optionEditModeSubscription: Subscription;
  private quillInstanceSubscription: Subscription;
  private answerStateSubscription: Subscription;
  private qstemDataSubscription: Subscription;

  public value;
  public inputType: string;
  public templateType: string;
  public selectedAnswersPreview: Array<string> = [];
  public qstem: object = {};
  public opts: TemplateMcqOption[];
  public optsPreview: TemplateMcqOption[];
  public layout: string;
  public inputName: any;
  public selectedAnswers: Array<string> = [];
  public points: number;
  public previewShow;
  public dashboardPreviewShow: boolean = true;
  public sourceData: object = {};
  public correctAnsPoints: number = 0;
  // public showAnsStateFlag: boolean = false;
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
  public templateName: string;
  public globalPreviewState: boolean;
  public quillInstance: any;
  public qstemData: string = '';
  public optionsData: Array<any> = [];
  public editingOpt: number = null;
  loadedImg = false;

  public stemImgMode: string; // by default medium
  public imgWidth: number = 250; // TODO: uploaded image original width will come here
  public stemImageMode: string = 'small';

  @ViewChild('qstemImgRef', { static: false })
  public qstemImgRef: ElementRef;
  @ViewChild('optionsPreviewDivHeight', { static: false })
  public optionsPreviewDivHeight: ElementRef;
  @ViewChild('answers', { static: false })
  public answers: ElementRef;
  @ViewChild('optionsDivMaxHt', { static: false })
  public optionsDivMaxHt: ElementRef;
  public optionGrid: string = '';
  public optionGridWrapper = 'd-block';
  public opLayout = '';
  imageLoaded: boolean;
  qusetionImage: string;
  changeLayout: boolean;
  uploadedImage: boolean = false;

  constructor(
    public sharedComponentService: SharedComponentService, // private toastrService: ToastrService
    public renderer: Renderer2,
    public cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService
  ) {}

  ngAfterViewInit() {
    // this.initState();
    if (this.questionImage) this.getImage(this.stemImgMode);
    this.calculateOptionsDivHeight();
    let imageLoaded = this.loadQuestionImage();
    if (imageLoaded) {
      this.getImage(this.stemImgMode);
    }
  }

  ngOnInit() {
    //console.log('templateData in MCQ', this.templateData);
    this.optionGrid = '';
    this.previewSubscription = this.questionEditorService
      .getPreviewState()
      .subscribe(state => {
        this.globalPreviewState = state;
        //console.log('global ', this.globalPreviewState);
      });

    this.showAnsState = this.questionEditorService
      .getSubmitAnsShow()
      .subscribe(state => {
        this.showAnsStateFlag = state;
        // console.log(
        //   'showAnsStateFlag ',
        //   this.showAnsStateFlag,
        //   this.templateData
        // );
      });
    this.quillInstanceSubscription = this.questionEditorService
      .getInstance()
      .subscribe(instance => {
        this.quillInstance = instance;
      });

    this.previewShow = this.previewState;
    //console.log('dataData ', this.templateData, this.previewShow);

    this.optionEditModeSubscription = this.questionEditorService
      .getOptionsEditMode()
      .subscribe(mode => {
        this.editingOpt = mode;
        //console.log('editing subs ', this.editingOpt);
      });
    this.qstemDataSubscription = this.questionEditorService
      .getQstem()
      .subscribe(stem => {
        if (stem && stem != this.qstemData) {
          this.qstemData = stem;
          this.templateData.data.stimulus.label = this.qstemData;
          // this.onQstemContentUpdate(this.qstemData);
        }
      });
    this.questionEditorService.getOptions().subscribe(options => {
      if (
        options.length > 0 &&
        options != this.optionsData &&
        this.templateData.type != 'mcq-tf'
      ) {
        this.opts = options;
        this.templateData.data.options = options;
      }
    });
    this.initState();

    this.changePointsValue();

    this.emitAns();

    // console.log('opt: ', this.opts);
    this.optsPreview.forEach(opts => {
      opts.selected = false;
      opts.checked = false;
    });

    // this.sharedComponentService.imageModalOpen.next({});

    if (this.previewShow) {
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
      // console.log('optsPreview ', this.optsPreview);
    } else {
      // this.showAnsState.next(false);
    }
    // });

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    if (this.templateType === 'mcq-ms' || this.templateType === 'MCQ') {
      this.inputType = 'checkbox';
    } else {
      this.inputType = 'radio';
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

    this.questionEditorService.changeLayoutGet().subscribe(change => {
      if (change) {
        this.questionEditorService.setOptionLayout(
          this.templateData.data.ui_style.type
        );
      }
    });

    this.sharedComponentService.getImageData$.subscribe(image => {
      //console.log('file in ', image);
      if (image) {
        this.uploadImageName = image['fileName'];
        this.uploadImageFolder = image['folder'];
        this.questionImage = image['tempImgPath'];
        // this.templateData.data.stimulus.image = image['fileName'];
        if (this.questionImage) {
          let loadImage = this.loadQuestionImage();
          if (loadImage) {
            setTimeout(() => {
              if (!this.uploadedImage) {
                console.log('uploadedImage');

                this.getImage('medium');
                this.uploadedImage = true;
              }
            }, 1000);
          }
        }
      }
    });
    this.questionEditorService.getOptionLayout().subscribe(layout => {
      this.opLayout = layout;
      // console.log('Layout from service', layout);
      this.changeGrid(this.opLayout);
    });

    setTimeout(() => {
      this.getImage(this.templateData.data.stimulus.imgMode);
      this.calculateOptionsDivHeight();
    }, 1000);
  }

  ngOnChanges() {
    // this.emitAns();
  }

  bold() {
    if (this.quillInstance) {
      if (this.quillInstance.getFormat().bold)
        this.quillInstance.format('bold', false);
      else this.quillInstance.format('bold', true);
    }
  }

  emitAns(): void {
    //console.log('answerState ', this.showAnsStateFlag);

    this.questionEditorService.updateAnswerStateObject({
      selectedAnswersPreview: this.selectedAnswersPreview,
      selectedAnswers: this.selectedAnswers,
      state: this.showAnsStateFlag,
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
    this.answerStateSubscription = this.questionEditorService
      .getAnsStateObject()
      .subscribe(data => {
        this.answerState = data;
        //console.log('answerState ', this.answerState);
      });
    this.selectedOpt = null;
  }

  getAnswerStatus(opt) {
    let status: string = 'incorrect';
    if (this.showAnsStateFlag) {
      this.selectedAnswers.forEach(ans => {
        if (ans == opt.value) {
          status = 'correct';
        }
      });
    }
    if (opt.checked && !opt.selected) {
      status = 'incorrect';
    }
    if (!opt.selected && status == 'incorrect') {
      status = null;
    }
    if (opt.checked && !this.showAnsStateFlag) {
      status = 'checkedOption';
    }
    // console.log('status ', status);

    return status;
  }

  //Function to initial all the variables
  initState(): void {
    let stemLable = '';
    if (this.qstemData) stemLable = this.qstemData;
    else stemLable = this.templateData.data.stimulus.label;
    this.qstem = {
      text: stemLable,
      value: this.templateData.data.stimulus.value,
      feedbackInline: this.templateData.data.stimulus.feedbackInline,
      placeholder: 'Compose The Question...',
      imageUrl: this.templateData.data.stimulus.imageUrl,
      imgMode: 'medium'
    };
    this.opLayout = this.templateData.data.ui_style.type;
    //console.log('data in stem', this.qstem);
    if (this.questionImage) {
      this.qstem['image'] = this.questionImage;
      this.getImage('medium');
    } else {
      this.qstem['image'] = this.templateData.data.stimulus.image;
      let questionImg = this.loadQuestionImage();
      if (questionImg) this.getImage('medium');
    }
    this.stemImageMode = this.templateData.data.stimulus.imgMode;
    // if (this.optionsData) this.opts = this.optionsData;
    // else
    this.opts = this.templateData.data.options as Array<TemplateMcqOption>;
    this.opts.forEach(opt => {
      opt['placeholder'] = 'Type The Answer Option Here...';
      if (opt['feedback']) opt.feedbackInline = opt['feedback'][0].text;
    });
    this.showFeedback();
    if (this.opts.length < 2)
      this.opts[0].placeholder = 'Type The First Answer Option Here...';
    this.optsPreview = [...this.opts];
    //console.log('optsPreview ', this.optsPreview);
    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    // this.questionEditorService.setOptionLayout(this.layout);
    if (this.templateData.data.ui_style.type === 'optionImage') {
      this.layout = 'vertical';
      this.changeGrid('vertical');
      this.optionImageLayout = true;
      this.optionImage = this.templateData.data.media.src;
    } else {
      this.optionImageLayout = false;
    }
    // this.inputName = this.templateData.reference;
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData as TemplateMcqData;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.shuffleCheck = this.templateData.data.shuffle
      ? this.templateData.data.shuffle
      : false;
    this.templateName = this.templateData.name;
    if (this.previewShow) {
      this.selectedAnswersPreview = [];
    }
    if (this.templateType != 'mcq-tf')
      this.questionEditorService.updateOptions(this.opts);

    this.optsPreview.forEach((options: TemplateMcqOption) => {
      if (options.selected) {
        this.selectedAnswersPreview.push(options.value);
      }
    });

    if (this.sourceData['type'] == 'mcq-oi')
      this.image = this.sourceData['data'].option_image;
    else this.image = this.sourceData['data'].question_image;

    this.createLabels();

    this.questionEditorService.getQstemImage().subscribe(mode => {
      if (mode) {
        this.stemImgMode = mode;
      } else {
        this.stemImgMode = this.templateData.data.stimulus.imgMode;
      }
    });

    // if (this.qstem['image']) this.getImage('medium');
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

  loadQuestionImage() {
    if (this.questionImage) {
      return this.questionImage;
    } else if (this.qstem['image']) {
      if (this.qstem['imageUrl'])
        return this.qstem['imageUrl'] + this.qstem['image'];
      else {
        return this.qstem['image'];
      }
    } else return false;
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
    //console.log('mcq-single-select', 'Submit Pressed');
  }

  //Output function which retrieves the values selected from the app-set-correct-ans-options-layout component
  getSelectedAns(event: string): void {
    this.selectedAnswers = [event];
    this.emitAns();
    this.emitSelectedAnswers();
    this.changeTemplateData();
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
  changeSourceState(sourceJson: TemplateMcqData): void {
    //console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    this.initState();
    // this.emitAns();
    // this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    // this.sharedComponentService.imageUploadModalService({});
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent: object): void {
    //console.log('Content Update', updatedContent);
    if (updatedContent['label']) {
      this.value = updatedContent;

      this.opts.forEach(
        (options: TemplateMcqOption) => options.value == updatedContent['value']
      );
      this.optsPreview.forEach(
        (options: TemplateMcqOption) => options.value == updatedContent['value']
      );
      // this.optsPreview = [...this.opts];
      this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
      this.questionEditorService.updateOptions(this.opts);
      // this.sharedComponentService.getImageData.next({});
    }
    this.calculateOptionsDivHeight();
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option: TemplateMcqOption): void {
    //console.log('Testing');
    this.opts.push(option);
    this.optsPreview = [...this.opts];
    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
    this.sourceData = this.templateData as TemplateMcqData;
    this.createLabels();
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(option: TemplateMcqOption, index) {
    this.value = '';
    this.opts = this.opts.filter(
      (options: TemplateMcqOption) => options.value !== option.value
    );

    this.selectedAnswers = this.selectedAnswers.filter(
      sel => sel !== option.value
    );
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;

    // this.sharedComponentService.imageModalOpen.next({});
    // this.sharedComponentService.getImageData.next({});
    this.optsPreview = [...this.opts];
    this.templateData.data.options = this.opts as Array<TemplateMcqOption>;
    this.selectedOpt = null;
    this.createLabels();
  }
  //Function to calculate max-height of options
  calculateOptionsDivHeight() {
    var optionDivHeight;
    if (this.previewShow) {
      if (document.getElementById('qb-preview-submit')) {
        if (this.qstemImgRef) {
          var qstemHeight =
            this.qstemImgRef.nativeElement.offsetHeight >
            document.getElementById('qstemRef').offsetHeight
              ? this.qstemImgRef.nativeElement.offsetHeight
              : document.getElementById('qstemRef').offsetHeight;

          optionDivHeight =
            document.getElementById('qb-preview-submit').offsetTop -
            qstemHeight -
            175;
          this.optionsPreviewDivHeight.nativeElement.style.maxHeight =
            optionDivHeight + 'px';
        }
      }
    } else {
      if (document.getElementById('qb-preview-submitQuesWrapper')) {
        if (this.answers) {
          optionDivHeight =
            document.getElementById('qb-preview-submitQuesWrapper').offsetTop -
            this.answers.nativeElement.offsetTop -
            35;
          this.optionsDivMaxHt.nativeElement.style.maxHeight =
            optionDivHeight + 'px';
          this.optionsDivMaxHt.nativeElement.style.minHeight =
            optionDivHeight + 'px';
        }
      }
    }
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    //console.log('changedContent in mcq ', updatedContent);

    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
    this.calculateOptionsDivHeight();
    this.selectedOpt = null;
  }

  saveData() {
    this.optsPreview.forEach(
      (opts: TemplateMcqOption) => (opts.selected = false)
    );
    this.sourceData['data'].options = this.optsPreview;
    this.sourceData['data'].shuffle = this.shuffleCheck;
    // console.log("Source", this.sourceData)
    this.getAnswers.next(this.sourceData);
  }

  radioOptionSelect(selectedAnswer: string) {
    this.opts.forEach((options: TemplateMcqOption) => {
      options.selected = false;

      if (options.value == selectedAnswer) {
        options.selected = true;
      }
    });
  }

  checkOption(selectedAnswer: string) {
    this.opts.forEach((options: TemplateMcqOption) => {
      options.checked = false;

      if (options.value == selectedAnswer) {
        options.checked = true;
      }
    });
    //console.log('checkoptions ', this.opts);
  }

  checkMultiOption(optResponse: object) {
    this.opts.forEach((options: TemplateMcqOption) => {
      if (options.value == optResponse['selectedAnswer']) {
        options.checked = optResponse['checked'];
      }
    });
  }

  multipleOptionSelect() {
    this.opts.forEach((options: TemplateMcqOption) => {
      options.selected = false;
      this.selectedAnswers.forEach((selAns: string) => {
        if (options.value == selAns) {
          options.selected = true;
        }
      });
    });
  }

  /**
   * (if condition): It retrieves the values selected from the app-set-correct-ans-options-layout component
   * (else condition): It gets the selected options and set answer points
   * @param selectedAnswer: string
   * @description Function to get the selected options and set answer points
   */
  onSelectedAnswersPreview(optResponse) {
    // console.log(
    //   'prepre ',
    //   this.globalPreviewState,
    //   optResponse,
    //   optResponse.selectedAnswer,
    //   this.selectedAnswers,
    //   this.selectedAnswersPreview
    // );
    if (!this.globalPreviewState) {
      //console.log('not Preview');

      if (this.inputType == 'radio') {
        this.selectedAnswers = [optResponse.selectedAnswer];
        this.radioOptionSelect(optResponse.selectedAnswer);
      } else {
        // console.log(
        //   'optresponse ',
        //   this.selectedAnswers,
        //   optResponse.selectedAnswer
        // );

        if (!this.selectedAnswers.includes(optResponse.selectedAnswer)) {
          this.selectedAnswers.push(optResponse.selectedAnswer);
        } else {
          this.selectedAnswers = this.selectedAnswers.filter(
            ans => ans !== optResponse.selectedAnswer
          );
        }
        this.multipleOptionSelect();
      }
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
      if (this.inputType == 'radio') {
        this.selectedAnswersPreview = [optResponse.selectedAnswer];
        this.radioOptionSelect(optResponse.selectedAnswer);
        this.checkOption(optResponse.selectedAnswer);
      } else {
        if (!this.selectedAnswersPreview.includes(optResponse.selectedAnswer)) {
          this.selectedAnswersPreview.push(optResponse.selectedAnswer);
        } else {
          this.selectedAnswersPreview = this.selectedAnswersPreview.filter(
            ans => ans !== optResponse.selectedAnswer
          );
        }
        this.multipleOptionSelect();
        this.checkMultiOption(optResponse);
      }

      // console.log(
      //   'Preview',
      //   this.templateData.data.validation.valid_response.value,
      //   this.selectedAnswersPreview
      // );

      if (
        this.sharedComponentService.getDifferenceOfArray(
          this.selectedAnswersPreview,
          this.templateData.data.validation.valid_response.value
        ).length == 0
      ) {
        this.correctAnsPoints = this.points;
        this.correctAnswerCheck.emit('correct');
      } else {
        this.correctAnsPoints = 0;
        this.correctAnswerCheck.emit('incorrect');
      }

      this.optsPreview.forEach((options: TemplateMcqOption) => {
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
      if (this.selectedAnswersPreview.length > 0) {
        this.allowSubmit.emit(true);
      } else {
        this.allowSubmit.emit(false);
      }
    }

    //console.log('correctAnsPoints ', this.correctAnsPoints);
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  getImageUploaded(image): void {
    if (this.sourceData['type'] == 'mcq-oi') {
      this.sourceData['data'].option_image = image;
    } else if (this.sourceData['type'] == 'mcq-qi') {
      this.sourceData['data'].question_image = image;
    }
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
    //console.log('Shuffle MCQ', event);

    this.shuffleCheck = event;
    this.templateData.data.shuffle = this.shuffleCheck;

    if (this.shuffleCheck) {
      this.sharedComponentService.shuffleArray(this.optsPreview);
    } else {
      this.sharedComponentService.reOrderArray(this.optsPreview);
    }
    //console.log('Opts', this.optsPreview);
  }

  feedbackStemUpdate(evt) {
    this.qstem['feedback'] = evt;
    this.templateData.data.stimulus.feedbackInline = this.qstem['feedback'];
    this.selectedOpt = null;
  }

  feedbackOptUpdate(evt, index) {
    // console.log(
    //   'feedback ',
    //   evt,
    //   index,
    //   this.templateData.data.options[index].feedbackInline
    // );

    this.opts[index]['feedbackInline'] = evt;
    let feedback = [
      {
        text: evt,
        media: null
      }
    ];
    this.opts[index]['feedback'] = feedback;
    this.templateData.data.options[index].feedbackInline = evt;
    this.selectedOpt = null;
  }

  toggleMenus(index) {
    if (this.selectedOpt == index) this.selectedOpt = null;
    else this.selectedOpt = index;
    //console.log(index);
  }
  showFeedback() {
    this.opts.filter((opt, index) => {
      if (opt['feedbackInline']) {
        this.toggle[index] = true;
      }
    });
  }

  addFeedback(index) {
    this.selectedOpt = null;
    if (!this.toggle[index]) this.opts[index].feedbackInline = '';
    this.calculateOptionsDivHeight();
  }

  editOpt(index) {
    this.editingOpt = index;
    this.questionEditorService.updateOptionsEditMode(index);
  }

  saveOptText() {
    //console.log('SaveOPt ', this.editingOpt);
    this.editingOpt = null;
    //console.log('saveOpt ', this.editingOpt);
  }

  doneOption(number, index) {
    this.questionEditorService.updateOptionsEditMode(number);
  }

  toggle = {};

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    // console.log('mcq single select destroyed');

    if (this.submitSubscription) this.submitSubscription.unsubscribe();
    if (this.previewSubscription) this.previewSubscription.unsubscribe();
    if (this.dashboardPreviewSubscription)
      this.dashboardPreviewSubscription.unsubscribe();
    if (this.showAnsState) this.showAnsState.unsubscribe();
    if (this.optionEditModeSubscription)
      this.optionEditModeSubscription.unsubscribe();
    if (this.quillInstanceSubscription)
      this.quillInstanceSubscription.unsubscribe();
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
    if (this.metadataSubscription) {
      this.metadataSubscription.unsubscribe();
    }
    if (this.deviceViewSubscription) {
      this.deviceViewSubscription.unsubscribe();
    }
    if (this.layoutViewSubscription) {
      this.layoutViewSubscription.unsubscribe();
    }
    if (this.answerStateSubscription) {
      this.answerStateSubscription.unsubscribe();
    }
    if (this.qstemDataSubscription) {
      this.qstemDataSubscription.unsubscribe();
    }
    this.questionEditorService.updateOptionsEditMode(null);
    this.sharedComponentService.imageModalOpen.next({});
    this.questionEditorService.changeLayoutSet(false);
    this.questionEditorService.updateSubmitAnsShow(false);
  }

  getImage(size) {
    this.openImgSizes = false;
    this.templateData.data.stimulus.imgMode = size;
    this.questionEditorService.updateQstemImage(size);
    //console.log(this.templateData.data.stimulus.imgMode, 'imgMode');
    var multiplier;
    switch (size) {
      case 'small':
        multiplier = 0.7;
        break;
      case 'medium':
        multiplier = 1;
        break;
      case 'large':
        multiplier = 1.3;
        break;
      default:
        multiplier = 0.7;
    }
    //console.log(this.qstemImgRef, 'reference');
    if (this.qstemImgRef) {
      //console.log('image is loaded');

      this.renderer.setStyle(
        this.qstemImgRef.nativeElement,
        'width',
        this.imgWidth * multiplier + 'px'
      );
      setTimeout(() => {
        this.calculateOptionsDivHeight();
        this.loadedImg = true;
      }, 2000);
    }
  }

  changeGrid(gridType) {
    // this.optionGrid =
    //   'col-6 horizontalCol pr-2 d-flex align-items-stretch w-100';
    this.optionGridWrapper = '';
    if (gridType === 'horizontal') {
      this.optionGrid = 'col horizontalCol';
      if (this.previewState) {
        this.optionGrid =
          'col horizontalCol pr-2 d-flex align-items-stretch w-100';
      }
      this.optionGridWrapper = 'optionGridHorizontal';
    } else if (gridType === 'vertical') {
      this.optionGrid = 'col-md-12';
      this.optionGridWrapper = 'd-block';
    } else {
      this.optionGrid = 'col-6 horizontalCol';
      if (this.previewState) {
        this.optionGrid =
          'col-6 horizontalCol pr-2 d-flex align-items-stretch w-100';
      }
    }

    this.templateData.data.ui_style.type = gridType;
    //console.log('Layout set grid ', gridType);
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (
      event.target.localName !== 'circle' &&
      event.target.localName !== 'svg'
    ) {
      this.selectedOpt = null;
    }
    if (event.target.localName !== 'rect') {
      this.openImgSizes = false;
    }
  }

  deleteImage() {
    if (this.questionImage) {
      this.questionImage = '';
      this.sharedComponentService.getImageDataService({});
    }
    if (this.qstem['image']) {
      this.qstem['image'] = '';
      this.templateData.data.stimulus.image = '';
      this.sharedComponentService.setDeleteImageStatus(true);
    }
    console.log('deleteImage ', this.templateData.data);
  }
}
