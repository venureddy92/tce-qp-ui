import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  Renderer2,
  ViewChild,
  ElementRef,
  OnChanges
} from '@angular/core';
import {
  TemplateMcqData,
  TemplateMcqOption,
  FibTextDropdown
} from '../../../../core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription, of, identity } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { QuestionEditorService } from '@tce/template-editor';
import Quill from 'quill';
import { QuillEditorComponent } from 'libs/quiz-templates/src/lib/sharedEditors/quill-component/components/quill-component-layout/quill-editor.component';
import { TemplateMarkupLayoutComponent } from 'libs/quiz-templates/src/lib/sharedComponents/template-markup/components/template-markup-layout/template-markup-layout.component';
import { takeUntil } from 'rxjs/operators';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
import { FibSetCorrectAnsOptionsLayoutComponent } from 'libs/quiz-templates/src/lib/sharedComponents/fib-set-correct-ans-options/components/fib-set-correct-ans-options-layout/fib-set-correct-ans-options-layout.component';

@Component({
  selector: 'app-fib-text-layout',
  templateUrl: './fib-text-layout.component.html',
  styleUrls: ['./fib-text-layout.component.scss']
})
export class FibTextLayoutComponent implements OnInit, OnChanges {
  @Input() public templateData: FibTextDropdown;
  @Input() public previewState: boolean;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Output() public sourceStateChange = new EventEmitter();
  @Output() public showAnswers = new EventEmitter();
  @Output() public getAnswers = new EventEmitter();
  @Output() public allowSubmit = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  private showAnsSubscription: Subscription;
  // public updateResponse: boolean;
  public updateResponse: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public points: number;
  public previewShow: boolean = true;
  public sourceData: FibTextDropdown;
  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private metadataSubscription: Subscription;
  public qstem: any;
  public layout: string = 'horizontal';
  public inputName: string;
  public selectedAnswers: Array<string> = [];
  public selectedAnswersLabels: Array<string> = [];
  public templateMarkUpData: string;
  public templateType: string;
  public dashboardPreviewShow: boolean = true;
  private dashboardPreviewSubscription: Subscription;
  @Input() public dashboardPreviewState: boolean;
  public getShowAnsState: object = {};
  public showAnsStateFlag: boolean;
  public selectedAnswersPreview: Array<string> = [];
  public correctAnsPoints: number = 0;

  public deviceView: string = 'laptop';
  private saveSubscription: Subscription;
  public possibleResponses: Array<any>;
  public responseCount: number;
  public navbarOpen: boolean = false;
  public metaData: object = {};
  public responseIndex: number;
  public clickedResponse: string;
  public tempData: string;
  public clickComponentStatus: boolean;
  public templateName: string;
  public quillInstance: any;
  rangeIndex: number;
  public qstemData: string = '';
  public quillLoaded: boolean;
  public responses: Object = {};
  public responseIds: Array<any> = [];
  @ViewChild(TemplateMarkupLayoutComponent)
  public tempMarkup: TemplateMarkupLayoutComponent;
  @ViewChild(FibSetCorrectAnsOptionsLayoutComponent)
  public fibSetCorrect: FibSetCorrectAnsOptionsLayoutComponent;
  destroy$: Subject<boolean> = new Subject<boolean>();
  allowAddResponse: boolean = false;
  public fibDragResponseClassify = null;
  possibleResponsesPreview: any;
  dragId: any;
  fibDragResponse: any;
  templateMainType: string;

  @ViewChild('qstemRef', { static: false })
  public qstemRef: ElementRef;
  @ViewChild('optionsPreviewDivHeight', { static: false })
  public optionsPreviewDivHeight: ElementRef;
  @ViewChild('answers', { static: false })
  public answers: ElementRef;
  @ViewChild('optionsDivMaxHt', { static: false })
  public optionsDivMaxHt: ElementRef;
  @Output() public correctAnswerCheck = new EventEmitter();
  public questionImage: string;
  public openImgSizes: boolean = false;
  @ViewChild('qstemImgRef', { static: false })
  public qstemImgRef: ElementRef;
  public imgWidth: number = 250;
  public uploadImageName: string;
  public uploadImageFolder: string;
  public stemImgMode: string;
  uploadedImage: boolean = false;
  loadedImg: boolean;

  constructor(
    public renderer: Renderer2,
    private questionEditorService: QuestionEditorService,
    private sharedComponentService: SharedComponentService
  ) {}

  ngOnInit() {
    this.previewShow = this.previewState;

    // this.submitSubscription = this.submit.subscribe(() => this.onSubmit());
    this.sharedComponentService
      .getFibDragResponseClassify()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.fibDragResponseClassify = res;
        // console.log('dragresponses', this.responses, res);
      });

    this.sharedComponentService
      .getDragId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.dragId = id;
      });

    this.saveSubscription = this.save
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.saveData());

    this.questionEditorService
      .getInstance()
      .pipe(takeUntil(this.destroy$))
      .subscribe(instance => {
        this.quillInstance = instance;
      });

    this.questionEditorService.getQuillLoading().subscribe(bool => {
      this.quillLoaded = bool;
    });

    // this.questionEditorService.getPreviewState().subscribe(state => {
    //   if (state && this.possibleResponses) {
    //     this.possibleResponsesPreview = [...this.possibleResponses];
    //     this.labels();
    //   }
    // });
    if (this.dashboardPreviewState) {
    }

    this.questionEditorService
      .getAllowAddResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bool => {
        this.allowAddResponse = bool;
      });

    this.questionEditorService
      .getSubmitAnsShow()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.showAnsStateFlag = state;
        // console.log('showAnsStateFlag ', this.showAnsStateFlag);
      });
    this.questionEditorService
      .getQstem()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stem => {
        // console.log('qstem from ser ', stem);
        this.qstemData = stem;
      });
    this.questionEditorService
      .getTemplateText()
      .pipe(takeUntil(this.destroy$))
      .subscribe(text => {
        console.log('tempText ', text);
        if (text != '') {
          this.templateMarkUpData = text;
          this.templateData.data.template = this.templateMarkUpData;
        }
      });
    this.initState();
    this.emitAns();
    // this.tempMarkup.renderData();
    window.addEventListener('keyup', (e: any) => {
      // console.log('keyup ', e);
    });

    if (this.previewState && this.templateType === 'fib-drag-drop') {
      this.possibleResponsesPreview = JSON.parse(
        JSON.stringify([...this.possibleResponses])
      );
      this.possibleResponsesPreview.map(response => {
        response[0].selected = false;
      });

      // console.log(
      //   'possssressss ',
      //   this.templateData.data.possible_responses,
      //   this.possibleResponses,
      //   this.possibleResponsesPreview
      // );
    }
    // console.log('initState ', this.possibleResponsesPreview);

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

    // this.sharedComponentService
    //   .getFibDragResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(state => {
    //     this.showAnsStateFlag = state;
    //     // console.log('showAnsStateFlag ', this.showAnsStateFlag);
    //   });
    // this.sharedComponentService
    //   .getFibDragResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(response => {
    //     // console.log('fibDragResponse sub ', response);

    //     this.fibDragResponse = response;
    //     // console.log('showAnsStateFlag ', this.showAnsStateFlag);
    //   });
    setTimeout(() => {
      this.getImage(this.templateData.data.stimulus.imgMode);
      this.calculateOptionsDivHeight();
    }, 1000);
    // this.calculateOptionsDivHeight();
  }

  ngAfterViewInit() {
    if (this.questionImage) this.getImage(this.stemImgMode);
    this.calculateOptionsDivHeight();
  }

  emitAns() {
    if (!this.dashboardPreviewState) {
      this.questionEditorService.updateAnswerStateObject({
        selectedAnswersPreview: this.selectedAnswersPreview,
        selectedAnswers: this.selectedAnswers,
        state: this.showAnsStateFlag,
        points: this.points,
        correctAnsPoints: this.correctAnsPoints
      });
      this.questionEditorService
        .getAnsStateObject()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.getShowAnsState = data;
        });
    }
  }

  //Function to initial all the variables
  initState(calledFromDropped: boolean = false) {
    // console.log('initCalled ', this.templateData, this.possibleResponses);

    var stemLable = '';
    if (this.qstemData) {
      this.templateData.data.stimulus.label = this.qstemData;
    }
    stemLable = this.templateData.data.stimulus.label;
    // console.log('Called from dropped', calledFromDropped);
    // console.log('template Data:', this.templateData);
    this.qstem = {
      text: stemLable,
      value: this.templateData.data.stimulus.value,
      placeholder: 'Compose The Question...',
      imageUrl: this.templateData.data.stimulus.imageUrl,
      image: this.templateData.data.stimulus.image,
      imageMode: this.templateData.data.stimulus.imgMode
    };
    this.templateMarkUpData = this.templateData.data.template;
    this.layout = this.templateData.data.ui_style.type;
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.sourceData = this.templateData;
    this.templateType = this.templateData.type;
    this.metaData = this.templateData.data.metadata;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.templateName = this.templateData.name;
    this.templateMainType = this.templateData.data.type;
    this.questionEditorService.updateTemplateText(this.templateMarkUpData);
    if (
      this.templateType == 'fib-dropdown' ||
      this.templateType == 'fib-drag-drop'
    ) {
      this.possibleResponses = this.templateData.data.possible_responses;
    } else {
      // console.log('WRONG TAMPLATE');
    }
    // console.log('possible: ', this.possibleResponses);

    if (
      this.templateType === 'fib-text' ||
      this.templateType === 'fib-dropdown' ||
      this.templateType === 'fib-drag-drop'
    ) {
      this.questionEditorService
        .getResponses()
        .pipe(takeUntil(this.destroy$))
        .subscribe(responses => {
          this.responses = responses;
        });
      this.questionEditorService
        .getResponseIds()
        .pipe(takeUntil(this.destroy$))
        .subscribe(ids => {
          this.responseIds = ids;
        });
    }
    if (this.templateType != 'fib-text') this.labels();
    // if (this.tempMarkup)
    // this.tempMarkup.loadQuill();
  }

  labels() {
    // console.log('labels', this.possibleResponses, this.selectedAnswers);

    if (this.possibleResponses && this.possibleResponses.length > 0) {
      this.selectedAnswersLabels = [];
      if (this.templateType === 'fib-dropdown') {
        for (let i = 0; i < this.possibleResponses.length; i++) {
          for (let j = 0; j < this.possibleResponses[i].length; j++)
            if (
              this.selectedAnswers &&
              this.selectedAnswers[i] === this.possibleResponses[i][j]['value']
            ) {
              this.selectedAnswersLabels.push(
                this.possibleResponses[i][j]['label']
              );
            }
        }
      } else {
        this.selectedAnswers.forEach((ans: any) => {
          if (ans) this.selectedAnswersLabels.push(ans.label);
        });
      }
    }
    // console.log('selectedLabels ', this.selectedAnswersLabels);
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event) {
    this.points = event;
    this.changeTemplateData();
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson) {
    this.templateData = sourceJson as FibTextDropdown;
    console.log('SOUrceData: ', this.templateData);
    let oldValues = this.templateData.data.validation.valid_response.value;
    let newValues = sourceJson.data.validation.valid_response.value;
    if (
      this.templateType == 'fib-dropdown' &&
      newValues.length > sourceJson.data.possible_responses.length
    ) {
      newValues.pop();
    }
    this.selectedAnswers = sourceJson.data.validation.valid_response.value;
    // this.labels();
    this.templateData = sourceJson as FibTextDropdown;
    this.questionEditorService.updateTemplateText(
      this.templateData.data.template
    );
    // this.updateResponse = true;
    this.updateResponse.next(true);
    this.initState();
    this.sourceStateChange.emit(false);
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

  rIndex(index) {
    // console.log(index);
    this.responseIndex = index;
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>, index): void {
    // console.log('Event: ', event, index);
    moveItemInArray(
      this.possibleResponses[index],
      event.previousIndex,
      event.currentIndex
    );
    this.sourceData = this.templateData;
    // this.updateResponse = true;
    this.updateResponse.next(true);
    this.initState();

    // console.log('this.possibleResponses: ', this.possibleResponses);
  }

  onOptUpdate(event, rowIndex, choiceIndex?) {
    console.log('updateOpt ', event, rowIndex, choiceIndex, this.responses);
    if (this.templateType == 'fib-dropdown') {
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', event.label);
      let newVar = div.textContent || div.innerText || '';
      // console.log('newVar: ', newVar);
      // console.log('div: ', div, newVar);
      let oldPossibleResponse = this.possibleResponses[rowIndex][choiceIndex][
        'value'
      ];
      // console.log('rowUpdate: ', event, rowIndex, choiceIndex);
      this.possibleResponses[rowIndex][choiceIndex] = event;
    }
    let values = this.templateData.data.validation.valid_response.value;
    let valIndex = null;
    values.forEach((value: any, index) => {
      if (value.value === event.value) {
        console.log('valIndex ', index);

        valIndex = index;
      }
    });
    if (valIndex != null) {
      this.templateData.data.validation.valid_response.value[valIndex].label =
        event.label;
      this.tempMarkup.renderData();
    }
    console.log(
      'valIndex ',
      this.templateData.data.validation.valid_response.value
    );

    if (this.templateData.data.validation.valid_response.value)
      this.templateData.data.possible_responses = this.possibleResponses;
    this.sourceData = this.templateData;
    this.initState();
    // this.updateResponse = true;
    this.updateResponse.next(true);
    // console.log('This is source data ', this.sourceData);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  saveData() {
    this.selectedAnswersPreview = [];
    this.getAnswers.next(this.sourceData);
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  // Change value and score of the options in the templateData
  changeTemplateData() {
    this.templateData.data.validation.valid_response = {
      score: this.points,
      value: this.selectedAnswers
    };
    // console.log(
    //   'valuevalue ',
    //   this.templateData.data,
    //   this.templateData.data.validation.valid_response
    // );
  }

  // Get the answers selected in the app-fib-set-correct-ans-options-layout component
  getSelectedAns(pushedanswers) {
    // console.log('pushedAnswers ', pushedanswers, this.selectedAnswers);
    this.selectedAnswers = pushedanswers;
    this.labels();
    // this.changeTemplateData();
  }

  correctPoints(points) {
    // console.log('points ', points);

    if (!this.dashboardPreviewState) {
      if (points) {
        this.correctAnsPoints = this.points;
        this.correctAnswerCheck.emit('correct');
      } else {
        this.correctAnsPoints = 0;
        this.correctAnswerCheck.emit('incorrect');
      }
      this.emitPoints();
    }
  }

  allowSubmitFunc(event) {
    this.allowSubmit.emit(event);
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

  addResponse(rowIndex, response) {
    // if (this.templateType == 'fib-dropdown') {
    let incrementedVal = '0';
    if (response.length > 0) {
      incrementedVal = (
        parseInt(response[response.length - 1]['value']) + 1
      ).toString();
    }
    this.templateData.data.possible_responses[rowIndex].push({
      label: '',
      value: incrementedVal
    });
    // }
    // this.updateResponse = true;
    this.updateResponse.next(true);
  }

  deleteResponse(response, rowIndex, choiceIndex?) {
    // le: console.log('Delete: ', response, rowIndex, choiceIndex);
    if (this.templateType == 'fib-dropdown') {
      this.templateData.data.possible_responses[rowIndex].splice(
        choiceIndex,
        1
      );
      if (
        this.templateData.data.validation.valid_response.value[rowIndex] ==
        response.value
      ) {
        this.templateData.data.validation.valid_response.value[rowIndex] = '';
      }
    } else {
      this.templateData.data.possible_responses.splice(rowIndex, 1);
      // console.log('Delete: 1');

      let values = this.templateData.data.validation.valid_response.value;
      let valIndex = null;
      values.forEach((value: any, index) => {
        if (value.value == response.value) {
          // console.log('valIndex ', index);
          valIndex = index;
        }
      });
      if (valIndex != null) {
        // console.log('ifValIndex');
        this.templateData.data.validation.valid_response.value[valIndex] = '';
        this.tempMarkup.renderData();
        // this.fibSetCorrect.render();
      }
    }
    this.templateData.data.possible_responses = this.possibleResponses;
    this.sourceData = this.templateData;
    this.initState();
    // console.log('this.possibleResponses: ', this.possibleResponses);
    // this.updateResponse = true;
    this.updateResponse.next(true);
  }

  // Handle the form on submit
  onSubmit() {
    // console.log('fib-text', 'Submit Pressed');
  }

  //Function to get updated content from the app-template-markup-layout
  onContentUpdate(updatedContent) {
    // console.log('updated: ', updatedContent);
    this.templateMarkUpData = updatedContent.rdata;
    this.questionEditorService.updateTemplateText(this.templateMarkUpData);
    this.templateData.data.template = this.templateMarkUpData;
    this.templateData.data.possible_responses = updatedContent.response;
    this.possibleResponses = updatedContent.response;
    // console.log('DATA: ', updatedContent.rdata);
    if (updatedContent.rdata) {
      let matchedArray = updatedContent.rdata.match(/{{response}}/g) || [];
      let range = this.quillInstance.getSelection(true);
      // console.log('rangerange ', range);

      // if (this.templateType == 'fib-dropdown') {
      //   // console.log('MATCHARRAY: ', matchedArray, matchedArray.length);
      //   if (
      //     matchedArray.length < this.templateData.data.possible_responses.length
      //   ) {
      //     // this.templateData.data.possible_responses.pop();
      //     let shortText = updatedContent.rdata.substring(0, range.index);
      //     let res = (shortText.match(/{{response}}/g) || []).length;
      //     console.log('resres ', shortText, res);
      //   }
      // }

      // if (
      //   matchedArray.length <
      //   this.templateData.data.validation.valid_response.value.length
      // ) {
      //   this.templateData.data.validation.valid_response.value.pop();
      // }
    }
    this.calculateOptionsDivHeight();
  }

  clickOpt(res: string): void {
    // console.log('Temp Value', res);
    this.tempData = res;
    this.clickComponentStatus = false;
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onResponseClick(updatedContent: string): void {
    this.fibDragResponse = updatedContent;
    // this.clickedResponse = updatedContent;
    console.log('this.clickedResponse ', updatedContent);
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    // console.log(updatedContent);
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
    // console.log(this.qstem);
    this.calculateOptionsDivHeight();
  }

  // Validate the form on submit
  onValidation() {}

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  responseDropped(event: CdkDragDrop<string[]>, i: number): void {
    moveItemInArray(
      this.possibleResponses[i],
      event.previousIndex,
      event.currentIndex
    );
    // this.updateResponse = true;
    this.updateResponse.next(true);
  }

  ngOnDestroy() {
    // console.log('destroyfib');

    this.destroy$.next(true);
    // this.submitSubscription.unsubscribe();
    // this.showAnsSubscription.unsubscribe();
    // this.previewSubscription.unsubscribe();
    this.selectedAnswers = [];
    this.selectedAnswersPreview = [];
    this.selectedAnswersLabels = [];
    this.sharedComponentService.setFibDragResponse(null);
    this.sharedComponentService.setFibDragResponseClassify(null);
  }

  feedbackStemUpdate(evt) {
    this.qstem['feedback'] = evt;
    // this.templateData.data.stimulus.feedbackInline = this.qstem['feedback'];
  }

  addResponseTag(tagName: string) {
    // console.log(
    //   'Range',
    //   this.templateType,
    //   this.quillInstance.innerText,
    //   this.responseIds,
    //   this.templateData
    // );
    // var my_node = this.quillInstance.selection.getNativeRange().start.node;
    // console.log('myNode ', my_node);

    let quillData = this.quillInstance.root.innerHTML;
    let range1 = this.quillInstance.getSelection(true);
    // let subStr = this.quillInstance.root.innerHTML.replace('<p>', '');
    let subString1 = this.quillInstance.root.innerText.substring(
      0,
      range1.index
    );

    let pRes = subString1.match(/RESPONSE/g)
      ? subString1.match(/RESPONSE/g)
      : [];
    let priorResponses = pRes.length;
    if (this.responseIds.length > 0 && this.templateType === 'fib-dropdown') {
      let newQuillData: any;
      this.responseIds.forEach(resId => {
        quillData = quillData.replace(
          `<code id="${resId}" contenteditable="false"> RESPONSE </code>`,
          '~'
        );
      });

      let uid = Math.floor(100000 + Math.random() * 900000);
      this.responseIds.splice(priorResponses, 0, uid);
      this.templateData.data.validation.valid_response.value[priorResponses] =
        '';
      let choice = [{ parentId: uid, label: '', value: '0' }];
      this.responses[uid] = choice;
      // console.log(
      //   'newQuillData ',
      //   range1,
      //   quillData,
      //   pRes,
      //   priorResponses,
      //   subString1
      // );
      this.questionEditorService.updateResponseIds(this.responseIds);
      this.questionEditorService.updateResponses(this.responses);
    }

    if (this.quillInstance && this.allowAddResponse) {
      let range = this.quillInstance.getSelection(true);
      let responseSpan = this.renderer.createElement('code');
      let spanText = this.renderer.createText(`  `);
      // console.log(
      //   'range ',
      //   range,
      //   this.quillInstance,
      //   this.quillInstance.scroll.length()
      // );

      // if (this.templateType != 'fib-drag-drop') {
      // if (this.templateType != 'fib-text')
      spanText = this.renderer.createText(` RESPONSE `);
      // else spanText = this.renderer.createText(` RESPONSE `);
      // }
      this.renderer.appendChild(responseSpan, spanText);
      let spanOuterHtml = responseSpan.outerHTML + '<span>&nbsp;</span>';

      range.index;

      this.quillInstance.clipboard.dangerouslyPasteHTML(
        range.index,
        spanOuterHtml
      );

      let length = this.quillInstance.getLength();

      let range1 = this.quillInstance.getSelection(true);
      this.quillInstance.insertText(range1.index, '', Quill.sources.API);
      // console.log('quillInstance ', this.quillInstance, range1.index);

      // Add a space after the marker
      // console.log('rangeeeee ', range, range1);
      let r = range1.index;
      setTimeout(() => {
        this.setIndex(r);
      }, 200);
      // this.quillInstance.setSelection(range1.index);
      //Take the cursor to the end of the inserted TemplateMarker
      this.rangeIndex = range.index;

      // this.quillInstance.insertText(range.index + 11, '       ');

      // console.log('focus', this.quillInstance.focus());

      let subString = this.templateMarkUpData.replace('<p>', '');
      subString = subString.substring(0, range.index);
      // subString
      let resmatch =
        subString && subString.match(/{{res/g) ? subString.match(/{{res/g) : [];
      let resCount = resmatch.length;

      // console.log('responses in fib', this.responses, this.responseIds);

      this.questionEditorService.updateNewResponseFlag(true);
      if (this.templateType === 'fib-dropdown') {
        // this.tempMarkup.addTags(this.quillInstance, range.index);
      }
    }
  }

  setIndex(range) {
    let range1 = this.quillInstance.getSelection(true);
    this.quillInstance.setSelection(range);
  }

  // get() {
  //   let my_node = this.quillInstance.selection.getNativeRange().start.node;
  //   // let my_blot = Parchment.find(my_node);
  //   console.log('rangeeeee ', my_node);
  // }

  calculateOptionsDivHeight() {
    var optionDivHeight;
    if (this.previewShow) {
      if (document.getElementById('qb-preview-submit')) {
        optionDivHeight =
          document.getElementById('qb-preview-submit').offsetTop -
          this.qstemRef.nativeElement.offsetHeight -
          215;
        this.optionsDivMaxHt.nativeElement.style.maxHeight =
          optionDivHeight + 'px';
      }
    } else {
      if (document.getElementById('qb-preview-submitQuesWrapper')) {
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

  classifyClick(event) {
    // console.log('classifyevent ', event.target.id);
    let divId = event.target.id;
    if (this.fibDragResponseClassify) {
      let resIndex: any;
      if (this.previewState) {
        this.possibleResponsesPreview.forEach((response: any, index) => {
          if (response[0].label === this.fibDragResponseClassify.label) {
            response[0].selected = false;
          }
        });
        resIndex = this.responseIds.findIndex(id => id == this.dragId);
        // this.templateData.data.possible_responses = this.possibleResponsesPreview;
        this.fibSetCorrect.removeFibValuePreview(resIndex);
        // fibse[resIndex] = '';
      } else {
        this.possibleResponses.forEach((response: any, index) => {
          if (response[0].label === this.fibDragResponseClassify.label) {
            response[0].selected = false;
          }
        });
        resIndex = this.responseIds.findIndex(id => id == this.dragId);
        this.templateData.data.validation.valid_response.value[resIndex] = '';
        this.templateData.data.possible_responses = this.possibleResponses;
      }

      // console.log('divId ', this.dragId);

      this.sharedComponentService.setFibDragResponseClassify(null);
      this.sharedComponentService.setDragId(null);
      // console.log(
      //   'fibDrag ',
      //   resIndex,
      //   this.dragId,
      //   this.responseIds,
      //   this.fibDragResponseClassify,
      //   this.sourceData.data.validation.valid_response.value
      // );
      this.fibSetCorrect.render();
      // this.fibDragResponseClassify = null;
    } else if (this.fibDragResponse && divId === 'responsesDiv') {
      this.fibDragResponse = null;
      this.sharedComponentService.setFibDragResponse(this.fibDragResponse);
    }
  }

  addDragResponse() {
    // console.log('add drag response ', this.possibleResponses);
    let incrementedVal = '0';
    let choiceNo = 1;
    if (this.possibleResponses.length > 0) {
      incrementedVal = (
        parseInt(
          this.possibleResponses[this.possibleResponses.length - 1][0]['value']
        ) + 1
      ).toString();
      choiceNo =
        parseInt(
          this.possibleResponses[this.possibleResponses.length - 1][0]['value']
        ) + 2;
    }
    let choice = [
      {
        label: '',
        value: incrementedVal,
        selected: false
      }
    ];
    this.possibleResponses.push(choice);
    this.possibleResponses = [...this.possibleResponses];
    this.sourceData.data.possible_responses = [...this.possibleResponses];
    // }
    // this.updateResponse = true;
    this.updateResponse.next(true);
    this.initState();
    // console.log('possiblepossible ', this.possibleResponses);
  }

  ngOnChanges(changes): void {
    // console.log('optData changes ', this.possibleResponses);
  }

  onResponseSelect(value) {
    this.sharedComponentService.setFibDragResponse(value);
  }

  updatePreviewRes(responses) {
    this.possibleResponsesPreview = responses;
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

  getImage(size) {
    console.log('imageSize ', size);

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
