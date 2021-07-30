import {
  Component,
  OnInit,
  Input,
  Renderer2,
  EventEmitter,
  ElementRef,
  ViewChild,
  Output,
  ChangeDetectorRef,
  HostListener,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import {
  ClassifyMatchOption,
  TemplateClassifyMatchListData,
  ClassifyMatchStem
} from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { QuestionEditorService } from '@tce/template-editor';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare var LeaderLine: any;

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit, AfterViewInit {
  @Input() public templateData: TemplateClassifyMatchListData;
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
  public value;
  public inputType: string;
  public templateType: string;
  public selectedAnswersPreview: Array<string> = [];
  public qstem: object = {};
  public opts: ClassifyMatchOption[];
  public optsAns: ClassifyMatchOption[];
  public stems: ClassifyMatchStem[];
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
  public listLoop: any;
  public dragOpts: any = [];
  public dragAns: any = [];
  private saveSubscription: Subscription;
  private metadataSubscription: Subscription;
  public templateName: string;
  public selectedAnswersData: Array<string> = [];

  @ViewChild('answersDiv', { static: false })
  public answersDiv: ElementRef;
  @ViewChild('optionsDivMaxHt', { static: false })
  public optionsDivMaxHt: ElementRef;
  public answerState: object = {};

  @ViewChild('qbDrawLine', { static: false })
  public d1: ElementRef;

  @ViewChild('startingElement', { static: false })
  public startingElement: ElementRef;

  @ViewChild('startingElementPreview', { static: false })
  public startingElementPreview: ElementRef;

  @ViewChild('endingElement', { static: false })
  public endingElement: ElementRef;

  @ViewChild('endingElementPreview', { static: false })
  public endingElementPreview: ElementRef;

  public line: Array<any> = [];
  public linePreview: Array<any> = [];
  public count: number = 0;
  public countPreview: number = 0;

  public lineCoordinates: Array<any> = [];
  public lineCoordinatesPreview: Array<any> = [];

  public lineCoordinatesData: Array<any> = [];
  public lineCoordinatesDataPreview: Array<any> = [];

  public quillTop: any;
  public quillLeft: any;
  public quillLeftPreview: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public arrowId: number = 1;
  public arrowIdsIndex: Array<number> = [];
  public correctMatches: boolean = false;

  constructor(
    public sharedComponentService: SharedComponentService,
    public http: HttpClient, // private toastrService: ToastrService
    public renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit() {
    this.calculateOptionsDivHeight();
    setTimeout(() => {
      if (!this.previewState) {
        this.updateLinePosition();
      }
    });
    setTimeout(() => {
      if (document.getElementById('cust_quill')) {
        this.quillLeft = Math.round(
          document.getElementById('cust_quill').getBoundingClientRect().left
        );
        this.quillTop = Math.round(
          document.getElementById('cust_quill').getBoundingClientRect().top
        );
        console.log(this.quillLeft, this.quillTop, 'left and top');
      }
      if (this.lineCoordinatesData) {
        this.lineCoordinatesData.forEach(coordinate => {
          this.drawLine(coordinate);
        });
      }
      let els = document.querySelectorAll('.leader-line');
      els.forEach(function(el) {
        el.classList.add('hide-leader-line');
      });
      setTimeout(() => {
        els.forEach(function(el) {
          el.classList.remove('hide-leader-line');
        });
      }, 2000);
    });
  }

  ngOnInit() {
    this.initState();
    this.emitAns();
    // this.previewSubscription = this.previewState.subscribe(state => {
    this.previewShow = this.previewState;
    if (this.previewShow) {
      let arr = [];
      this.dragAns = [];
      for (let i = 0; i < this.opts.length; i++) {
        arr.push(this.opts[i].value);
        this.dragAns.push([this.opts[i]]);
      }
      this.optsAns = [...this.opts];

      // let correctAnsPoints = 0;

      // if (
      //   JSON.stringify(arr) ==
      //   JSON.stringify(this.templateData.data.validation.valid_response.value)
      // ) {
      //   this.correctAnsPoints = 1;
      // } else {
      //   this.correctAnsPoints = 0;
      // }

      this.showAnswers.emit({
        points: this.points,
        selectedAnswersPreview: this.selectedAnswersPreview,
        correctAnsPoints: this.correctAnsPoints
      });
      // this.showAnsState.next(false);
    }
    // });

    // this.sourceSubscription = this.sourceState.subscribe(state => {
    //   this.sourceModalOpen.next(state);
    // });

    this.questionEditorService
      .getSubmitAnsShow()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.showAnsStateFlag = state;
        console.log('showAnsStateFlag ', this.showAnsStateFlag);
      });

    //   this.selectedAnswersData = [];

    //   for (let i = 0; i < this.selectedAnswers.length; i++) {
    //     if (i < this.stems.length) {
    //       let sel = this.selectedAnswers[i];

    //       for (let j = 0; j < this.templateData.data.options.length; j++) {
    //         let opt = this.templateData.data.options[j];
    //         if (opt.value == sel) {
    //           console.log('Loop', sel, opt);
    //           this.selectedAnswersData.push(opt.label);
    //         }
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

    this.questionEditorService
      .getShowController()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let els = document.querySelectorAll('.leader-line');
          els.forEach(function(el) {
            el.classList.add('hide-leader-line');
          });
          setTimeout(() => {
            this.updateLinePosition();
            this.questionEditorService.updateShowController(false);
            els.forEach(function(el) {
              el.classList.remove('hide-leader-line');
            });
          }, 2000);
        }
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
  }

  //Function to initial all the variables
  initState(): void {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    this.opts = this.templateData.data.options as Array<ClassifyMatchOption>;
    this.optsAns = this.templateData.data.options as Array<ClassifyMatchOption>;
    this.stems = this.templateData.data.stems as Array<ClassifyMatchStem>;
    this.lineCoordinatesData = this.templateData.data.matches;

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
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData as TemplateClassifyMatchListData;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.shuffleCheck = this.templateData.data.shuffle
      ? this.templateData.data.shuffle
      : false;

    if (this.stems.length > this.answers.length) this.listLoop = this.stems;
    else this.listLoop = this.answers;
    for (let i = 0; i < this.opts.length; i++) {
      let dragOpt = this.dragOpts.filter(
        opt => opt[0].value == this.opts[i].value
      );
      if (!dragOpt || dragOpt.length == 0) this.dragOpts.push([this.opts[i]]);
    }
    this.templateName = this.templateData.name;
  }

  /**
   * WThis function is called when dragged element is dropped
   * @param event contains the position of previous index and dragged index
   * @returns void
   */

  drop(event: CdkDragDrop<string[]>) {
    transferArrayItem(event.previousContainer.data, event.container.data, 0, 0);
    transferArrayItem(event.container.data, event.previousContainer.data, 1, 0);

    if (this.previewShow) {
      let dragAns = this.getValidArray(this.dragAns);
      let dragOpt = this.getValidArray(this.dragOpts);

      console.log('Drag ', dragAns, dragOpt);
      if (JSON.stringify(dragAns) == JSON.stringify(dragOpt)) {
        this.correctAnsPoints = this.points;
      } else {
        this.correctAnsPoints = 0;
      }
      this.showAnswers.emit({
        points: this.points,
        selectedAnswersPreview: this.selectedAnswersPreview,
        correctAnsPoints: this.correctAnsPoints
      });

      this.optsAns = [];
      this.dragAns.forEach(drag => {
        this.optsAns.push(drag[0]);
      });
    } else {
      this.selectedAnswers = this.pluckValue(this.dragOpts);
      this.templateData.data.validation.valid_response.value = this.selectedAnswers;
      this.sourceData = this.templateData;
    }
  }

  getValidArray(array) {
    let validArray = [];
    for (let i = 0; i < array.length; i++) {
      if (i < this.stems.length) validArray.push(array[i]);
    }

    return validArray;
  }

  /**
   * This function plucks the value string from the array of json objects and returns array of string
   * @param dragArray Type = Array<Object>
   * @returns Array<String>
   */
  pluckValue(dragArray) {
    let pluckedArray = [];
    dragArray.forEach(drag => {
      pluckedArray.push(drag[0].value);
    });
    return pluckedArray;
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
  changeSourceState(sourceJson: TemplateClassifyMatchListData): void {
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
    this.updateLinePosition();
  }

  onShuffleChange(event): void {
    this.shuffleCheck = event;
    this.templateData.data.shuffle = this.shuffleCheck;
    if (this.shuffleCheck) {
      this.sharedComponentService.shuffleArray(this.opts);
    } else {
      this.sharedComponentService.reOrderArray(this.opts);
    }
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option): void {
    this.opts.push(option);
    this.dragOpts.push([option]);
    let incrementVal = '0';
    if (this.stems.length > 0) {
      incrementVal = (this.opts.length - 1).toString();
    }
    let val = incrementVal;
    this.templateData.data.validation.valid_response.value.push(val);
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.answers = this.opts;
    this.sourceData = this.templateData;
  }

  //Function to push the newly added stem from the app-add-options-layout template to the opts array
  pushStem(stem) {
    this.stems.push(stem);
    this.templateData.data.stems = this.stems as Array<ClassifyMatchStem>;
    this.sourceData = this.templateData;
    let incrementedVal = '0';
    if (this.opts.length > 0) {
      let optsArray = [...this.opts];
      this.sharedComponentService.reOrderArray(optsArray);
      incrementedVal = (
        parseInt(optsArray[optsArray.length - 1]['value']) + 1
      ).toString();
    }
    let option = {
      label: '',
      value: incrementedVal
    };
    this.pushOptions(option);
    this.cdr.detectChanges();
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(index, option: ClassifyMatchOption): void {
    let rIndex = `r-${option.value}`;
    let lIndex = `l-${option.value}`;
    let matchLine: boolean = false;
    console.log(
      'removeOpt ',
      index,
      this.lineCoordinatesData,
      this.line,
      this.lineCoordinates,
      rIndex,
      option
    );
    if (this.lineCoordinatesData.length > 0) {
      // this.line = [];
      let newCoordinateData = [];
      this.lineCoordinatesData.forEach((coordinate, index) => {
        console.log(
          'coordinate',
          this.lineCoordinatesData,
          coordinate,
          rIndex,
          lIndex
        );

        if (coordinate.includes(rIndex) || coordinate.includes(lIndex)) {
          matchLine = true;
          // commented by Usman for future reference

          //   let id = this.arrowIdsIndex[index];
          //   console.log('removeIndex', index);
          //   this.line.forEach((element, i) => {
          //     console.log('id', element._id);

          //     if (element._id === id) {
          //       alert(id);
          //       this.removeLine(i);
          //     }
          //   });
          //   // this.lineCoordinatesData.splice(index, 1);
          // } else {
          //   newCoordinateData.push(coordinate);
        }
      });
      // this.lineCoordinatesData = newCoordinateData;
    }
    console.log(
      'removeOpt after ',
      this.line,
      this.arrowIdsIndex,
      this.lineCoordinatesData
    );
    if (matchLine) {
      this.toastr.clear();
      this.toastr.error(
        'Cannot Delete The Option. Delete The Matching Line First'
      );
    } else {
      this.value = '';
      this.stems = this.stems.filter(stem => stem !== this.stems[index]);
      this.dragOpts = this.dragOpts.filter(
        drag => drag[0].value !== option.value
      );
      this.selectedAnswers = this.selectedAnswers.filter(
        sel => sel !== option.value
      );
      this.opts = this.opts.filter(
        (options: ClassifyMatchOption) => options.value !== option.value
      );
      this.answers = this.answers.filter(
        (answer: ClassifyMatchOption) => answer.value !== option.value
      );
      this.templateData.data.validation.valid_response.value = this.selectedAnswers;
      this.templateData.data.stems = this.stems as Array<ClassifyMatchStem>;
      this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
      this.sourceData = this.templateData;
      this.updateLinePosition();
    }
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent): void {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
    this.calculateOptionsDivHeight();
    this.updateLinePosition();
  }

  /**
   * This function is the output function which is called when the left hand side qstem is updated
   * @param updatedContent Type = object
   * @param index Type = number
   * @returns void
   */
  onStemContentUpdate(updatedContent, index) {
    this.templateData.data.stems[index].text = updatedContent.text;
    this.initState();
    this.updateLinePosition();
  }

  saveData(): void {
    this.sourceData['data'].options = this.opts;
    this.sourceData['data'].shuffle = this.shuffleCheck;
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

  calculateOptionsDivHeight() {
    var optionDivHeight;
    if (this.previewShow) {
      if (document.getElementById('qb-preview-submit')) {
        optionDivHeight =
          document.getElementById('qb-preview-submit').offsetTop -
          document.getElementById('qstemRef').offsetHeight -
          220;
        this.optionsDivMaxHt.nativeElement.style.maxHeight =
          optionDivHeight + 'px';
      }
    } else {
      if (document.getElementById('qb-preview-submitQuesWrapper')) {
        optionDivHeight =
          document.getElementById('qb-preview-submitQuesWrapper').offsetTop -
          this.answersDiv.nativeElement.offsetTop -
          100;
        this.optionsDivMaxHt.nativeElement.style.maxHeight =
          optionDivHeight + 'px';
        this.optionsDivMaxHt.nativeElement.style.minHeight =
          optionDivHeight + 'px';
      }
    }
  }

  feedbackStemUpdate(ev) {
    console.log(ev);
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.debug('Scrolled');
    if (this.line.length > 0 || this.linePreview.length > 0) {
      this.updateLinePosition();
    }
  }

  // may need later
  // @HostListener('click', ['$event.target'])
  // onClickLeaderLine(event) {
  //     alert(1);
  //     console.log(event,"event re");
  // }
  drawLine(lineCoordinates) {
    console.log('in drawline');

    var a = '' + Date.now();

    if (!this.previewShow) {
      var line = new LeaderLine(
        LeaderLine.pointAnchor(document.getElementById(lineCoordinates[0]), {
          x: -1 * this.quillLeft + 7,
          y: -1 * this.quillTop + 7
        }),
        LeaderLine.pointAnchor(document.getElementById(lineCoordinates[1]), {
          x: -1 * this.quillLeft + 7,
          y: -1 * this.quillTop + 7
        }),
        {
          color: '#000',
          path: 'straight',
          startPlug: 'behind',
          endPlug: 'behind',
          fillColor: '#FFF',
          outlineColor: a
        }
      );
      line.left = 0;
      line['lineId'] = this.arrowId;
      this.line.push(line);
      this.arrowIdsIndex.push(this.arrowId);
      this.arrowId = this.arrowId + 1;
      this.lineCoordinates = [];
      console.log(this.line, 'this.line');
      console.log(this.lineCoordinatesData, 'this.lineCoordinatesData');
      this.lineCoordinatesData.push(lineCoordinates);

      setTimeout(() => {
        var elmLine1 = document.getElementById(a);
        this.optionsDivMaxHt.nativeElement.appendChild(elmLine1);
        this.updateLinePosition();
      });
    } else {
      this.quillLeftPreview = Math.round(
        document.getElementById('start_preview_div').getBoundingClientRect()
          .left
      );
      var line = new LeaderLine(
        LeaderLine.pointAnchor(document.getElementById(lineCoordinates[0]), {
          x: -1 * this.quillLeftPreview - 18,
          y: -1 * this.quillTop - 58
        }),
        LeaderLine.pointAnchor(document.getElementById(lineCoordinates[1]), {
          x: -1 * this.quillLeftPreview - 18,
          y: -1 * this.quillTop - 58
        }),
        {
          color: '#000',
          path: 'straight',
          startPlug: 'behind',
          endPlug: 'behind',
          fillColor: '#FFF',
          outlineColor: a
        }
      );
      line.left = 0;
      this.linePreview.push(line);
      this.lineCoordinatesPreview = [];
      console.log(this.line, 'this.line');
      this.lineCoordinatesDataPreview.push(lineCoordinates);
      console.log(
        this.lineCoordinatesDataPreview,
        'this.lineCoordinatesDataPreview'
      );
      setTimeout(() => {
        var elmLine1 = document.getElementById(a);
        this.optionsDivMaxHt.nativeElement.appendChild(elmLine1);
        this.updateLinePosition();
      });
    }
  }

  updateLinePosition() {
    console.log(
      'this.lineCoordinatesPreview',
      this.lineCoordinatesData,
      this.lineCoordinatesDataPreview,
      this.line
    );
    if (this.line.length > 0 && this.previewShow === false) {
      this.line.forEach(el => {
        console.log(el, 'elelelel');
        el.position();
      });
    }
    if (this.linePreview.length > 0 && this.previewShow) {
      this.linePreview.forEach(el => {
        console.log(el, 'elelelel');
        el.position();
      });
    }
  }

  removeLine(index) {
    console.log(this.line, index, '1111');
    console.log(this.linePreview, index, '1111P');
    if (this.previewShow) {
      let a = this.linePreview[index].outlineColor;
      let elmLine1 = document.getElementById(a);
      let z = elmLine1.remove();
      this.linePreview.splice(index, 1);
      console.log(this.linePreview, index, '2222P');
    } else {
      if (this.line[index]) {
        let a = this.line[index].outlineColor;
        let elmLine1 = document.getElementById(a);
        let z = elmLine1.remove();
        this.line.splice(index, 1);
      }
    }
  }
  getCoordinates(ev) {
    console.log(ev, 'evevevev');
    var id = ev.target.id;
    var removeLine: boolean = true;
    var removeLinePreview: boolean = true;

    if (!this.previewShow) {
      console.log(this.lineCoordinatesData, 'before for');
      let lineCoArray = [];
      if (this.lineCoordinatesData) {
        this.lineCoordinatesData.forEach((el, index) => {
          if (el.includes(id)) {
            this.removeLine(index);
            removeLine = false;
          } else {
            lineCoArray.push(el);
          }
        });
        this.lineCoordinatesData = lineCoArray;

        console.log(
          this.lineCoordinatesData,
          this.lineCoordinatesData.includes(id),
          'index of id'
        );
      }
      if (removeLine) {
        if (this.count == 0) {
          this.lineCoordinates = [];
          this.lineCoordinates[0] = id;
          this.count++;
        } else {
          if (this.lineCoordinates[0].includes(id.split('-')[0])) {
            this.lineCoordinates[0] = id;
          } else {
            this.lineCoordinates[1] = id;
            this.count--;
            this.drawLine(this.lineCoordinates);
          }
        }
      }
      console.log(this.lineCoordinates, 'this.lineCoordinates');
      this.templateData.data.matches = this.lineCoordinatesData;
      console.log('templateData ', this.templateData);
    } else {
      console.log(id);
      let lineCoArray = [];
      this.lineCoordinatesDataPreview.forEach((el, index) => {
        if (el.includes(id)) {
          this.removeLine(index);
          removeLinePreview = false;
        } else {
          lineCoArray.push(el);
        }
      });
      this.lineCoordinatesDataPreview = lineCoArray;
      console.log(
        this.lineCoordinatesDataPreview,
        this.lineCoordinatesDataPreview.includes(id),
        'index of id'
      );
      if (removeLinePreview) {
        if (this.countPreview == 0) {
          this.lineCoordinatesPreview = [];
          this.lineCoordinatesPreview[0] = id;
          this.countPreview++;
        } else {
          if (
            this.lineCoordinatesPreview[0].includes(
              id.split('-')[0] + '-' + id.split('-')[1]
            )
          ) {
            this.lineCoordinatesPreview[0] = id;
          } else {
            this.lineCoordinatesPreview[1] = id;
            this.countPreview--;
            this.drawLine(this.lineCoordinatesPreview);
          }
          // let coordinatesDataPreview = this.removePreviewId(
          //   this.lineCoordinatesDataPreview
          // );
          // console.log('coordinateDataPreview ', coordinatesDataPreview);
        }
      }
      this.compareCorrectmatches();
    }
    console.log(
      'this.lineCoordinatesPreview',
      this.lineCoordinatesData,
      this.lineCoordinatesDataPreview
    );
  }

  removePreviewId(lineCoordinatesData) {
    console.log('coordinateDataPreview in', lineCoordinatesData);

    lineCoordinatesData.forEach(coordinate => {
      coordinate[0] = coordinate[0].substring(8, coordinate[0].length);
      coordinate[1] = coordinate[1].substring(8, coordinate[1].length);
    });
    return lineCoordinatesData;
  }

  compareCorrectmatches() {
    let editMatch = this.templateData.data.matches;
    let previewMatch = this.lineCoordinatesDataPreview;

    console.log('compare matches', editMatch, previewMatch);
    let countMatches = 0;
    if (editMatch && editMatch.length > 0) {
      editMatch.forEach((editElem, index) => {
        previewMatch.forEach(previewElem => {
          console.log('previewElem', editElem, previewElem);

          if (
            editElem.includes(
              previewElem[0].substring(8, previewElem[0].length)
            ) &&
            editElem.includes(
              previewElem[1].substring(8, previewElem[1].length)
            )
          ) {
            countMatches = countMatches + 1;
          }
        });
      });
      if (countMatches === editMatch.length) {
        this.correctAnsPoints = this.points;
      } else {
        this.correctAnsPoints = 0;
      }
    }
  }

  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    // this.submitSubscription.unsubscribe();
    // this.previewSubscription.unsubscribe();
    // this.sourceSubscription.unsubscribe();
    // this.showAnsSubscription.unsubscribe();
    if (this.dashboardPreviewSubscription)
      this.dashboardPreviewSubscription.unsubscribe();

    if (this.line.length > 0) {
      this.line = [];
    }
    if (this.linePreview.length > 0) {
      this.linePreview = [];
    }
  }
}
