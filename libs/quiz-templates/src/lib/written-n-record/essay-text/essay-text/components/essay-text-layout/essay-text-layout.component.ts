import {
  Component,
  OnInit,
  Input,
  Output,
  ComponentRef,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
// import { shortText } from 'libs/quiz-player-templates/src/core/interface/quiz-player-template.interface';
import { shortText } from '../../../../../core/interface/quiz-player-template.interface';

import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { SharedComponentService } from 'libs/quiz-player-templates/src/sharedComponents/core/services/shared-component.service';
import { SharedComponentService } from '../../../../../sharedComponents/core/services/shared-component.service';
import { QuestionEditorService } from '../../../../../sharedComponents/core/services/question-editor.service';

// import { start } from 'repl';

@Component({
  selector: 'app-essay-text-layout',
  templateUrl: './essay-text-layout.component.html',
  styleUrls: ['./essay-text-layout.component.scss'],
})
export class EssayTextLayoutComponent implements OnInit {
  @Input() public templateData: shortText;
  @Input() public previewState: boolean;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Input() public showAnsState: Subscription;
  @Input() public metadataSidebar: Subject<void>;
  @Output() public sourceStateChange = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public getAnswers = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> =
    new BehaviorSubject<object>({});
  private showAnsSubscription: Subscription;

  public sourceModalOpen: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  public updateResponse: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public points: number;
  public previewShow: boolean = false;
  public sourceData: shortText;
  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  public qstem: object = {};
  // public opts: Array<object> = [];
  public layout: string = 'horizontal';
  public inputName: string;
  public selectedAnswer: Array<string> = [];
  public templateMarkUpData: string;
  public templateType: string;
  public matchType: string;
  public dashboardPreviewShow: boolean = true;
  private dashboardPreviewSubscription: Subscription;
  @Input() public dashboardPreviewState: BehaviorSubject<boolean>;
  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );
  public showAnsStateFlag: boolean;
  public selectedAnswersPreview: Array<string> = [];
  public correctAnsPoints: number = 0;

  public deviceView: string = 'laptop';
  private saveSubscription: Subscription;
  public responseCount: number;
  public navbarOpen: boolean = false;
  public metaData: object = {};
  public templateValue: string;
  public textValue: string = '';
  public textValuePreview: string = '';
  public showCopy: boolean;
  public showCut: boolean;
  public showPaste: boolean;
  public wordLimit: number;
  public visibleLimit: string = 'visible';
  public textToCopy: string;
  public writtenText: string = '';
  public index: number = 0;
  public endIndex: number = 0;
  public copiedText: string;
  public wordLength: number = 0;
  public showWordCount: boolean;
  public formattingOptions: Array<any> = [];
  public comp: ComponentRef<any>;
  public previewStem: object = {};
  public quillTools: Array<object>;
  public templateName: string;
  public globalPreviewState: boolean;
  private quillInstanceSubscription: Subscription;
  public quillInstance: any;
  public answerState: object = {};
  public openImgSizes: boolean = false;
  @ViewChild('qstemImgRef', { static: false })
  public qstemImgRef: ElementRef;
  public questionImage: string;
  public uploadImageName: string;
  public uploadImageFolder: string;

  @ViewChild('usersAnswer', { static: false })
  public usersAnswer: ElementRef;
  @ViewChild('sampleAnswer', { static: false })
  public sampleAnswer: ElementRef;
  @ViewChild('qstemPreview', { static: false })
  public qstemPreview: ElementRef;
  public sampleAnswerData: object = {};
  public imgWidth: number = 250; // TODO: uploaded image original width will come here
  public showSampleAnswer: boolean = false;
  public stemImgMode: string; // by default medium
  private qstemDataSubscription: Subscription;
  public qstemData: string = '';
  loadedImg: boolean;

  constructor(
    private sharedComponentService: SharedComponentService,
    private renderer: Renderer2,
    private questionEditorService: QuestionEditorService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.quillTools = [
      { name: 'bold', icon: 'fa fa-bold', selected: true, title: 'Bold' },
      { name: 'italic', icon: 'fa fa-italic', selected: true, title: 'Italic' },
      {
        name: 'underline',
        icon: 'fa fa-underline',
        selected: true,
        title: 'Underline',
      },
      {
        name: 'strike',
        icon: 'fa fa-strikethrough',
        selected: true,
        title: 'Strike',
      },
      {
        name: 'blockquote',
        icon: 'fa fa-quote-left',
        selected: false,
        title: 'Blockquote',
      },
      {
        name: 'code-block',
        icon: 'fa fa-code',
        selected: false,
        title: 'Code-Block',
      },
      // { name: { header: 1 }, icon: 'fa fa-header', selected: false },
      // { name: { header: 2 }, icon: 'fa fa-header', selected: false },
      {
        name: { list: 'ordered' },
        icon: 'fa fa-list',
        selected: false,
        title: 'Bullet List',
      },
      {
        name: { list: 'bullet' },
        icon: 'fa fa-list-ol',
        selected: false,
        title: 'Numbered List',
      },
      {
        name: { script: 'sub' },
        icon: 'fa fa-subscript',
        selected: false,
        title: 'Subscript',
      },
      {
        name: { script: 'super' },
        icon: 'fa fa-superscript',
        selected: false,
        title: 'Superscript',
      },
      {
        name: { indent: '-1' },
        icon: 'fa fa-outdent',
        selected: false,
        title: 'Decrease indent',
      },
      {
        name: { indent: '+1' },
        icon: 'fa fa-indent ',
        selected: false,
        title: 'Increase indent',
      },
      {
        name: { direction: 'ltr' },
        icon: 'fa fa-bars',
        selected: false,
        title: 'Text direction from left to right',
      },
      {
        name: { direction: 'rtl' },
        icon: 'fa fa-bars',
        selected: false,
        title: 'Text direction from right to left',
      },
      {
        name: { align: [] },
        icon: 'fa fa-align-left',
        selected: false,
        title: 'Alignment',
      },
      // class="fa "
      // [
      //   { list: 'ordered', selected: false },
      //   { list: 'bullet', selected: false }
      // ]
    ];
    // this.initState();
    // this.changePointsValue();
    // this.emitAns();
    //console.log('QQQQQQQ: ', this.quillTools);

    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        (state) => {
          this.dashboardPreviewShow = state;
        }
      );
    } else {
      // this.previewState.next(false);
    }

    //console.log('data: ', this.templateData);
    // this.previewSubscription = this.previewState.subscribe(state => {
    // console.log(state)
    this.previewShow = this.previewState;
    if (this.previewShow) {
      if (this.templateType == 'rich-text') {
        this.wordLength = 0;
      }
      this.correctAnsPoints = 0;
      this.textValuePreview = '';
      this.emitPoints();
    } else {
      this.showAnsStateFlag = false;
    }
    // });

    // this.showAnsSubscription = this.showAnsState.subscribe(state => {
    //   this.showAnsStateFlag = state;
    //   this.emitAns();
    // });

    this.previewSubscription = this.questionEditorService
      .getPreviewState()
      .subscribe((state) => {
        this.globalPreviewState = state;
        //console.log('global ', this.globalPreviewState);
      });
    this.showAnsState = this.questionEditorService
      .getSubmitAnsShow()
      .subscribe((state) => {
        this.showAnsStateFlag = state;
        //console.log('showAnsStateFlag ', this.showAnsStateFlag);
      });
    this.quillInstanceSubscription = this.questionEditorService
      .getInstance()
      .subscribe((instance) => {
        this.quillInstance = instance;
      });

    this.sharedComponentService.getImageData$.subscribe((image) => {
      //console.log('file in ', image);
      if (image) {
        this.uploadImageName = image['fileName'];
        this.uploadImageFolder = image['folder'];
        this.questionImage = image['tempImgPath'];
        // this.templateData.data.stimulus.image = image['fileName'];
        if (this.questionImage) {
          let loadImage = this.loadQuestionImage();
          if (loadImage) this.getImage('medium');
        }
      }
    });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    this.initState();
    this.emitPoints();
    this.changePointsValue();

    setTimeout(() => {
      this.getImage(this.templateData.data.stimulus.imgMode);
      this.calculateOptionsDivHeight();
    }, 1000);
  }

  ngAfterViewInit() {
    if (this.questionImage) this.getImage(this.stemImgMode);
    this.calculateOptionsDivHeight();
  }

  initState() {
    this.qstemDataSubscription = this.questionEditorService
      .getQstem()
      .subscribe((stem) => {
        if (stem && stem != this.qstemData) {
          this.qstemData = stem;
          this.templateData.data.stimulus.label = this.qstemData;
          // this.onQstemContentUpdate(this.qstemData);
        }
      });
    let stemLable = '';
    if (this.qstemData) stemLable = this.qstemData;
    else stemLable = this.templateData.data.stimulus.label;
    this.templateType = this.templateData.type;
    this.templateName = this.templateData.name;
    this.qstem = {
      text: stemLable,
      value: this.templateData.data.stimulus.value,
      feedbackInline: this.templateData.data.stimulus.feedbackInline,
      placeholder: 'Compose The Question...',
      imageUrl: this.templateData.data.stimulus.imageUrl,
      image: this.templateData.data.stimulus.image,
      imgMode: 'medium',
    };
    this.previewStem = {
      text: '',
      value: '',
    };
    this.sourceData = this.templateData as shortText;
    //console.log('SData: ', this.sourceData, this.qstem);
    if (this.templateType == 'short-text') {
      this.templateValue =
        this.templateData.data.validation.valid_response.value;
      this.textValue = this.templateValue;
      this.selectedAnswer = [this.templateValue];
      this.matchType =
        this.templateData.data.validation.valid_response.matching_rule;
      this.points = this.templateData.data.validation.valid_response.score;
      //console.log('essay text tempData ', this.qstem, this.sampleAnswerData);
    } else if (this.templateType == 'plain-text') {
      this.showCopy = this.templateData.show_copy;
      this.showCut = this.templateData.show_cut;
      this.showPaste = this.templateData.show_paste;
      this.wordLimit = this.templateData.max_length;
      this.visibleLimit = this.templateData.show_word_limit;
      this.sampleAnswerData = {
        feedbackInline: this.templateData.sample_answer,
      };
    } else {
      this.showWordCount = this.templateData.show_word_count;
      this.formattingOptions = this.templateData.formatting_options;
      this.wordLimit = this.templateData.max_length;
      this.formattingOptions = ['bold', 'italic', 'underline', 'strike'];
    }
  }

  emitAns(): void {
    this.getShowAnsState.next({
      state: this.showAnsStateFlag,
      points: this.points,
      correctAnsPoints: this.correctAnsPoints,
    });
    // this.getOptionClass();
  }

  emitPoints() {
    this.showAnswers.emit({
      points: this.points,
      correctAnsPoints: this.correctAnsPoints,
    });
  }

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  changeValueText(evt) {
    let value = evt.target.value;
    if (!this.previewShow) {
      this.textValue = value;
      // this.textValue = this.textValue.toLocaleLowerCase();
      this.templateData.data.validation.valid_response.value = value;
    } else {
      this.textValuePreview = value;
      var lowerTextValue = this.textValue.toLocaleLowerCase();
      var lowerTextValuePreview = this.textValuePreview.toLocaleLowerCase();
      if (this.matchType == 'exactMatch') {
        if (lowerTextValue == lowerTextValuePreview) {
          this.correctAnsPoints = this.points;
        } else {
          this.correctAnsPoints = 0;
        }
      } else if (this.matchType == 'contains') {
        var containsText = lowerTextValuePreview.includes(lowerTextValue);
        if (containsText) {
          this.correctAnsPoints = this.points;
        } else {
          this.correctAnsPoints = 0;
        }
      } else {
        this.correctAnsPoints = 0;
      }
    }
    this.emitPoints();
    this.initState();
  }

  changeSourceState(sourceJson) {
    //console.log('SourceJson: ', sourceJson);
    this.templateData = sourceJson as shortText;
    // this.templateData.stimulus.label = sourceJson.stimulus.label;
    this.sourceStateChange.emit(false);
    this.initState();
    this.sharedComponentService.imageUploadModalService({});
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

  changeMatch(evt) {
    let value = evt.target.value;
    this.templateData.data.validation.valid_response.matching_rule = value;
    this.initState();
  }

  getPointsValue(evt) {
    this.points = evt;
    this.emitAns();
    this.changePointsValue();
  }

  onSubmit() {}

  saveData() {
    this.getAnswers.next(this.sourceData);
  }

  onQstemContentUpdate(updatedContent) {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  previewQuillUpdate(evt) {
    //console.log('EVENTData:', evt);
    let textIndex = evt;
    let div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'innerHTML', evt);
    let newVar = div.textContent || div.innerText || '';
    //console.log('NEwVar: ', newVar);
    var wordCount = newVar.split(' ').filter(function (str) {
      return str != '';
    });
    //@ts-ignore
    this.wordLength = wordCount.length;
    //console.log('WORDLENGTH: ', this.wordLength);
  }

  wordLimitValue(evt) {
    this.wordLimit = evt;
    this.templateData.max_length = this.wordLimit;
    // this.initState();
  }

  changeViewLimit(evt) {
    this.visibleLimit = evt.target.value;
    this.templateData.show_word_limit = this.visibleLimit;
    // this.initState();
  }

  changeCopy(evt) {
    if (evt.target.checked) {
      this.showCopy = true;
    } else {
      this.showCopy = false;
    }
    this.templateData.show_copy = this.showCopy;
  }

  changeCut(evt) {
    if (evt.target.checked) {
      this.showCut = true;
    } else {
      this.showCut = false;
    }
    this.templateData.show_cut = this.showCut;
  }

  changePaste(evt) {
    if (evt.target.checked) {
      this.showPaste = true;
    } else {
      this.showPaste = false;
    }
    this.templateData.show_paste = this.showPaste;
  }

  changeWordCount(evt) {
    if (evt.target.checked) {
      this.showWordCount = true;
    } else {
      this.showWordCount = false;
    }
  }

  copyText(evt) {
    document.execCommand('copy');
    this.copiedText = this.textToCopy;
    // console.log('copied: ', this.copiedText);
  }

  cutText() {
    var txtArea = document.getElementById('writtenText');
    document.execCommand('copy');
    this.copiedText = this.textToCopy;
    let text =
      this.writtenText.substr(0, this.index) +
      '' +
      this.writtenText.substr(this.endIndex, this.writtenText.length);
    this.writtenText = text;
  }

  pasteText() {
    var txtArea = document.getElementById('writtenText');
    // console.log('copies text: ', this.textToCopy);

    // console.log('dDaasdas', this.writtenText);
    var txt = txtArea;
    let text =
      this.writtenText.substr(0, this.index) +
      '' +
      this.copiedText +
      '' +
      this.writtenText.substr(this.index, this.writtenText.length);
    this.writtenText = text;
  }

  selectText(evt) {
    this.wordLength = 0;
    let textIndex = evt.target.selectionStart;
    this.index = textIndex;
    var wordCount = this.writtenText.split(' ').filter(function (str) {
      return str != '';
    });
    //@ts-ignore
    this.wordLength = wordCount.length;
    if (window.getSelection()) {
      this.textToCopy = window.getSelection().toString();
      this.endIndex = evt.target.selectionEnd;
    }
    // console.log('abcd: ', this.index, this.textToCopy);
  }

  changeToolbar(tool) {
    tool.selected = !tool.selected;
    //console.log('Tools: ', tool, this.quillTools);
    this.formattingOptions = [];
    this.makeFormattingOptions();
  }

  makeFormattingOptions() {
    for (let i = 0; i < this.quillTools.length; i++) {
      if (this.quillTools[i]['selected'])
        this.formattingOptions.push(this.quillTools[i]['name']);
    }
    this.templateData.formatting_options = this.formattingOptions;
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.quillTools, event.previousIndex, event.currentIndex);
    this.formattingOptions = [];
    this.makeFormattingOptions();
  }

  feedbackStemUpdate(answer) {
    this.templateData.data.stimulus.feedbackInline = answer;
    //console.log('answer typed', answer, this.templateData);
  }

  sampleAnswerUpdate(answer) {
    this.templateData.sample_answer = answer;
    //console.log('answer typed', answer, this.templateData);
  }

  calculateOptionsDivHeight() {
    var sampleAnsHeight;
    if (
      document.getElementById('qb-preview-submit') &&
      this.usersAnswer &&
      this.qstemPreview &&
      this.sampleAnswer
    ) {
      sampleAnsHeight =
        document.getElementById('qb-preview-submit').offsetTop -
        this.usersAnswer.nativeElement.offsetHeight -
        this.qstemPreview.nativeElement.offsetHeight -
        150;
      this.sampleAnswer.nativeElement.style.maxHeight = sampleAnsHeight + 'px';
      // console.log(
      //   document.getElementById('qb-preview-submit').offsetTop,
      //   this.usersAnswer.nativeElement.offsetHeight,
      //   this.qstemPreview.nativeElement.offsetHeight
      // );
    }
  }

  changeShowSampleAnswer() {
    // this.showSampleAnswer = !this.showSampleAnswer;
    this.templateData.showSampleAnswer = !this.templateData.showSampleAnswer;
    this.cd.markForCheck();
    // console.log(this.showSampleAnswer);
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
  }
}
