import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OptComponent } from 'libs/quiz-templates/src/lib/sharedComponents/opt/components/opt-layout/opt.component';
import {
  TemplateHotspot,
  FibImage,
  Point
} from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
// variable to identify the left click of the mouse
// const LEFT_MOUSE_BUTTON = 0;

@Component({
  selector: 'app-hotspot-layout',
  templateUrl: './hotspot-layout.component.html',
  styleUrls: ['./hotspot-layout.component.scss']
})
export class HotspotLayoutComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() public templateData: TemplateHotspot;
  @Input() public previewState: boolean = false;

  //kept for future need
  // @Input() public sourceState: BehaviorSubject<boolean>;
  // @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Input() public dashboardPreviewState: boolean = false;

  @Output() public sourceStateChange = new EventEmitter();
  @Output() public updatePoints = new EventEmitter();
  @Output() public updateSelectedAnswers = new EventEmitter();
  @Output() public editQuestion: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  @Output() public getAnswers = new EventEmitter();

  @ViewChild(OptComponent, { static: false }) public optComponent: OptComponent;
  @ViewChild('optsContainer', { static: true })
  public optsContainer: ElementRef;
  public shuffleCheck: boolean = false;

  //kept for future need
  // public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
  //   {}
  // );
  // public sourceModalOpen: BehaviorSubject<boolean> = new BehaviorSubject<
  //   boolean
  // >(false);

  private submitSubscription: Subscription;
  private previewSubscription: Subscription;
  private sourceSubscription: Subscription;
  private showAnsSubscription: Subscription;
  private dashboardPreviewSubscription: Subscription;

  public value;
  public inputType: string;
  public templateType: string;
  // public selectedAnswersPreview: Array<any> = [];
  public qstem: object;
  public layout: string;
  public inputName: string;
  public selectedAnswers: Array<string> = [];
  public points: number;
  public previewShow: boolean = false;
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
  public templateName: string;
  public answerState: object = {};
  @Output() public showAnswers = new EventEmitter();
  public selectedAnswersData: Array<string> = [];

  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('line', { static: true }) line: ElementRef;
  @ViewChild('imgG', { static: true }) imgG: ElementRef;
  @ViewChild('circleG', { static: true }) circleG: ElementRef;
  @ViewChild('polygonG', { static: true }) polygonG: ElementRef;
  @ViewChild('numberG', { static: true }) numberG: ElementRef;

  @HostListener('document:keydown.escape', ['$event']) onKeyUpHandler(
    event: KeyboardEvent
  ) {
    this.escapeKeyClicked();
  }

  // flag to indicate when shape has been clicked
  public click: boolean = false;
  // stores cursor location upon first click
  public clickX: number = 0;
  public clickY: number = 0;
  // keeps track of overall transformation
  public moveX: number = 0;
  public moveY: number = 0;
  // stores previous transformation (move)
  public lastMoveX: number = 0;
  public lastMoveY: number = 0;

  public isDrawing: boolean = false;
  public isPolygonDrawing: boolean = false;

  public pointerOffset: number = 0;

  public currentPolyline: ElementRef;
  public startOfPolyline: Point;
  public polylinePoints: string[] = [];

  public saveArr: Array<Array<Point>> = [];

  public currentPolygon: ElementRef;
  public currentpolygonId: number;
  public previousSelectedPolygon: any;

  public isDrag: boolean = false;

  public isDeleteClicked: boolean = false;
  public isDrawClicked: boolean = true;
  public isSelectAnswer: boolean = false;
  public mouseLeaveEvtListnerRegistered: boolean = false;

  public possibleAnswers: Array<string> = [];
  public mouseLeaveSelectEvtListnerRegistered: boolean = false;
  public selectedPolygonId: string;

  public checkAnswerFlag: boolean = false;

  constructor(
    public sharedComponentService: SharedComponentService,
    private resolver: ComponentFactoryResolver,
    public changeRef: ChangeDetectorRef,
    public renderer: Renderer2
  ) {}

  ngOnInit() {
    // this.initState();
    this.initState();
    this.previewShow = this.previewState;
  }

  populateImage(imageData) {
    // console.log("Populate image called");
    imageData['width'] = parseInt(imageData['width']);
    imageData['height'] = parseInt(imageData['height']);
    // console.log(`imageData['width'] ${imageData['width']} & imageData['height'] ${imageData['height']}`);
    this.renderer.setStyle(
      this.container.nativeElement,
      'width',
      imageData['width']
    );
    this.renderer.setStyle(
      this.container.nativeElement,
      'height',
      imageData['height']
    );
    this.renderer.setStyle(
      this.imgG.nativeElement,
      'width',
      imageData['width']
    );
    this.renderer.setStyle(
      this.imgG.nativeElement,
      'height',
      imageData['height']
    );
    this.renderer.setAttribute(
      this.imgG.nativeElement,
      `href`,
      imageData['src']
    );
  }

  ngAfterViewInit(): void {
    // add event listeners
    this.container.nativeElement.addEventListener(
      'mousedown',
      this.mouseDown.bind(this)
    );
    this.container.nativeElement.addEventListener(
      'mousemove',
      this.move.bind(this)
    );
    this.container.nativeElement.addEventListener(
      'mouseup',
      this.endMove.bind(this)
    );

    if (this.previewShow) {
      this.isSelectAnswer = false;
    } else {
      this.selectedAnswers = [];
      this.correctAnsPoints = 0;
      this.emitCorrectAnswer();
    }
    this.clearCircles();
    this.clearNumbers();
    this.clearPolygons();
    this.reRenderAllPolygons();
    this.sharedComponentService.imageModalOpen.next({});

    //kept for future need
    // this.showAnsSubscription = this.showAnsState.subscribe(state => {
    //   this.showAnsStateFlag = state;
    //   if (this.showAnsStateFlag) {
    //     // call check answer
    //     this.checkAnswer();
    //     this.checkAnswerFlag = true;
    //   } else if (this.checkAnswerFlag) {
    //     this.checkAnswerFlag = false;
    //     this.clearNumbers();
    //     this.showSelectedAnswer();
    //   }
    //   // console.log("this.sourceData in showAnsSubscription ", this.sourceData);
    //   // this.emitAns();
    // });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());
    if (this.dashboardPreviewState) {
      // this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
      //   state => {
      this.dashboardPreviewShow = this.dashboardPreviewState;
      // }
      // );
    }
    this.sharedComponentService.getImageData.subscribe(imageData => {
      // console.log("imageData ** ",imageData);
      if (imageData['componentType'] == 'hotspot') {
        imageData['src'] = imageData['imageUrl'];
        this.populateImage(imageData);
        this.templateData.data.image = imageData as FibImage;
      }
    });

    this.changePointsValue();
    // this.emitAns();
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateHotspot): void {
    // console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = [];
    this.initState();

    // this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
    if (this.isSelectAnswer) {
      this.showPossibleAnswers();
    }
  }

  /**
   * @description This function emits the selected answers array to the main quiz player component
   * @returns void
   */
  emitSelectedAnswers(): void {
    this.updateSelectedAnswers.emit(this.possibleAnswers);
  }

  //Function to initial all the variables
  initState(): void {
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value
    };
    console.log('this.templateData -->> ', this.templateData, this.qstem);

    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    this.saveArr = this.templateData.data.areas;
    this.points = this.templateData.data.validation.valid_response.score;
    this.possibleAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData;
    this.populateImage(this.templateData.data.image);
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.templateName = this.templateData.name;
    this.clearNumbers();
    this.clearPolygons();
    this.clearPolygons();
    this.reRenderAllPolygons();
    this.reRenderAllNumbers();
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

  emitCorrectAnswer(): void {
    this.showAnswers.emit({
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  // Handle the form on submit
  onSubmit(): void {
    console.log('mcq-single-select', 'Submit Pressed');
  }

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  imageUpload(): void {
    console.log('imageupload');
    this.sharedComponentService.imageUploadModalService({
      type: 'hotspot',
      state: true,
      name: 'upload'
    });
  }

  /**
   * @description To toggle side bar for metadata
   */
  toggleSidebar(metadata): void {
    if (metadata) {
      this.metaData = this.templateData.data.metadata = metadata;
    }
    this.navbarOpen = !this.navbarOpen;
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event: number): void {
    this.points = event;
    this.templateData.data.validation.valid_response.score = event;
    this.sourceData = this.templateData;
    this.changeTemplateData();
    this.changePointsValue();
  }

  changeTemplateData(): void {
    this.templateData.data.validation.valid_response = {
      score: this.points,
      value: this.possibleAnswers
    };
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
    });
  }

  /*   ######   SVG RELATED CODE HERE   #####    */

  /**
   * Check for correct answer and update correct answer point to show at the top
   */
  checkForPoint() {
    if (this.selectedAnswers.length === this.possibleAnswers.length) {
      let selectedAnswerLength = this.selectedAnswers.length;
      for (let i = 0; i < selectedAnswerLength; i++) {
        let currentAnswer = this.selectedAnswers[i];
        if (!this.possibleAnswers.includes(currentAnswer)) {
          this.correctAnsPoints = 0;
          this.emitCorrectAnswer();
          return;
        }
      }
      this.correctAnsPoints = this.points;
      this.emitCorrectAnswer();
      return;
    }
    // if((this.selectedAnswers.length > 0 && this.possibleAnswers.length > 0) && (this.possibleAnswers[0] === this.selectedAnswers[0])){
    //     this.correctAnsPoints = this.points;
    // }
    else {
      this.correctAnsPoints = 0;
      this.emitCorrectAnswer();
    }
  }

  /**
   * Validate answer and show correct answers
   */
  checkAnswer() {
    this.clearPolygons();
    this.reRenderAllPolygons();
    console.log('Possible answers in checkAnswers are ', this.possibleAnswers);
    console.log('Selected Answers in checkAnswer are ', this.selectedAnswers);
    if (this.possibleAnswers.length > 0) {
      if (this.selectedAnswers.length === 0) {
        // show green to the correct answer
        let possibleAnsLength = this.possibleAnswers.length;
        for (let i = 0; i < possibleAnsLength; i++) {
          let correctPolygon = document.getElementById(this.possibleAnswers[i]);
          this.renderer.setStyle(correctPolygon, 'stroke', `rgb(101, 161, 41)`);
          this.renderer.setStyle(correctPolygon, 'stroke-width', `3`);
          this.renderer.setStyle(correctPolygon, 'fill', `rgb(101, 161, 41)`);
          this.renderer.setStyle(correctPolygon, 'fill-opacity', `0.5`);
        }
      } else {
        let possibleAnswerlength = this.possibleAnswers.length;
        for (let i = 0; i < possibleAnswerlength; i++) {
          let correctPolygon = document.getElementById(this.possibleAnswers[i]);
          this.renderer.setStyle(correctPolygon, 'stroke', `rgb(101, 161, 41)`);
          this.renderer.setStyle(correctPolygon, 'stroke-width', `3`);
          this.renderer.setStyle(correctPolygon, 'fill', `rgb(101, 161, 41)`);
          this.renderer.setStyle(correctPolygon, 'fill-opacity', `0.5`);
        }

        let selectedAnswersLength = this.selectedAnswers.length;
        for (let j = 0; j < selectedAnswersLength; j++) {
          if (!this.possibleAnswers.includes(this.selectedAnswers[j])) {
            let wrongPolygon = document.getElementById(this.selectedAnswers[j]);
            this.renderer.setStyle(wrongPolygon, 'stroke', `rgb(225, 71, 71)`);
            this.renderer.setStyle(wrongPolygon, 'stroke-width', `3`);
            this.renderer.setStyle(wrongPolygon, 'fill', `rgb(225, 71, 71)`);
          }
        }
      }
    }
  }

  /**
   * After escape key pressed, remove polyline and empty polyline points
   */
  escapeKeyClicked() {
    if (this.currentPolyline) {
      this.renderer.removeChild(
        this.container.nativeElement,
        this.currentPolyline
      );
      this.currentPolyline = undefined;
      this.isDrawing = false;
      this.polylinePoints = [];
      this.renderer.setAttribute(this.line.nativeElement, 'x1', `${0}`);
      this.renderer.setAttribute(this.line.nativeElement, 'y1', `${0}`);
      this.renderer.setAttribute(this.line.nativeElement, 'x2', `${0}`);
      this.renderer.setAttribute(this.line.nativeElement, 'y2', `${0}`);
      this.renderer.setStyle(this.container.nativeElement, 'cursor', `inherit`);
      this.clearCircles();
    }
  }

  /**
   *  get mouse relative position with scroll and all
   * @param e
   */
  getMousePosition(e) {
    let offset = this.container.nativeElement.getBoundingClientRect();
    return { x: e.clientX - offset.left, y: e.clientY - offset.top };
  }

  /**
   * Called after show answer unchecked
   */
  showSelectedAnswer() {
    this.clearPolygons();
    this.reRenderAllPolygons();
    let selectedAnswerLength = this.selectedAnswers.length;
    for (let i = 0; i < selectedAnswerLength; i++) {
      let target = document.getElementById(this.selectedAnswers[i]);
      this.renderer.setStyle(target, 'stroke', `rgb(49, 75, 89)`);
      this.renderer.setStyle(target, 'stroke-width', `3`);
      this.renderer.setStyle(target, 'fill', `rgb(144, 192, 211)`);
    }
    // if(this.selectedAnswers[0]){
    //   let target = document.getElementById(this.selectedAnswers[0]);
    //   this.renderer.setStyle(target, 'stroke', `rgb(49, 75, 89)`);
    //   this.renderer.setStyle(target, 'stroke-width', `3`);
    //   this.renderer.setStyle(target, 'fill', `rgb(144, 192, 211)`);
    // }
  }

  /**
   * Called after show answer unchecked
   */
  showPossibleAnswers() {
    this.clearPolygons();
    this.reRenderAllPolygons();
    let possibleAnswersLength = this.possibleAnswers.length;
    for (let i = 0; i < possibleAnswersLength; i++) {
      let target = document.getElementById(this.possibleAnswers[i]);
      this.renderer.setStyle(target, 'stroke', `rgb(49, 75, 89)`);
      this.renderer.setStyle(target, 'stroke-width', `3`);
    }
  }

  /**
   *  Mouse down event handler
   * @param evt
   */

  mouseDown(evt) {
    // if (evt.button == LEFT_MOUSE_BUTTON) {
    evt.preventDefault(); // Needed for Firefox to allow dragging correctly
    if (this.previewShow) {
      /**
       * in preview state and target is polygon then select the polgon as answer
       */
      if (evt.target.nodeName === 'polygon') {
        let polygonId = evt.target.getAttribute('id');

        let target = document.getElementById(polygonId);

        this.renderer.setStyle(target, 'stroke', `rgb(49, 75, 89)`);
        this.renderer.setStyle(target, 'stroke-width', `3`);
        this.renderer.setStyle(target, 'fill', `rgb(144, 192, 211)`);

        this.mouseLeaveSelectEvtListnerRegistered = false;
        let selectedAnswersLenght = this.selectedAnswers.length;
        for (let i = 0; i < selectedAnswersLenght; i++) {
          if (this.selectedAnswers[i] === polygonId) {
            console.log('this.selectedAnswers ', this.selectedAnswers);
            this.selectedAnswers.splice(i, 1);
            this.renderer.setStyle(target, 'stroke', `rgb(34, 176, 214)`);
            this.renderer.setStyle(target, 'stroke-width', `2px`);
            this.renderer.setStyle(target, 'fill', `rgb(34, 176, 214)`);
            if (this.showAnsStateFlag) {
              this.checkAnswer();
            }
            this.checkForPoint();
            return;
          }
        }
        this.selectedAnswers.push(polygonId);

        if (this.showAnsStateFlag) {
          this.checkAnswer();
        }
        this.checkForPoint();
      }
    } else if (this.isSelectAnswer && evt.target.nodeName === 'polygon') {
      let target = evt.target;
      let polygonId = target.getAttribute('id');
      target = document.getElementById(`${polygonId}`);
      this.selectedPolygonId = polygonId;
      // this.possibleAnswers.push(`${polygonId}`);

      this.sourceData = this.templateData;
      this.renderer.setStyle(target, 'stroke', `rgb(49, 75, 89)`);
      this.renderer.setStyle(target, 'stroke-width', `3`);
      this.mouseLeaveSelectEvtListnerRegistered = false;
      let possibleAnswersLenght = this.possibleAnswers.length;
      for (let i = 0; i < possibleAnswersLenght; i++) {
        if (this.possibleAnswers[i] === polygonId) {
          this.possibleAnswers.splice(i, 1);
          this.renderer.setStyle(target, 'stroke', `rgb(34, 176, 214)`);
          this.renderer.setStyle(target, 'stroke-width', `2px`);
          this.templateData.data.validation.valid_response.value = this.possibleAnswers;
          return;
        }
      }
      this.possibleAnswers.push(polygonId);
      this.templateData.data.validation.valid_response.value = this.possibleAnswers;
      // console.log("this.possibleAnswers ", this.possibleAnswers);
    } else {
      if (this.isDeleteClicked && evt.target.nodeName === 'polygon') {
        // Delete polygon here
        let polygon = evt.target;
        let polygonId = parseInt(polygon.getAttribute('id'));
        this.saveArr.splice(polygonId, 1);
        this.possibleAnswers = [];
        this.templateData.data.validation.valid_response.value = this.possibleAnswers;
        this.sourceData = this.templateData;
        this.emitSelectedAnswers();
        this.clearPolygons();
        this.reRenderAllPolygons();
        this.reRenderAllNumbers();
        this.mouseLeaveEvtListnerRegistered = false;
      } else if (this.isDrawClicked) {
        this.click = true;
        let positions = this.getMousePosition(evt);
        this.clickX = positions.x;
        this.clickY = positions.y;
        let currentX = this.clickX - this.pointerOffset;
        let currentY = this.clickY - this.pointerOffset;
        let target = evt.target;

        if (
          target.nodeName === 'image' ||
          target.nodeName === 'svg' ||
          target.nodeName === 'line'
        ) {
          // it means drawing new polygon. get line and set its x1y1 here

          this.renderer.setAttribute(
            this.line.nativeElement,
            'x1',
            `${currentX}`
          );
          this.renderer.setAttribute(
            this.line.nativeElement,
            'y1',
            `${currentY}`
          );
          this.renderer.setAttribute(
            this.line.nativeElement,
            'x2',
            `${currentX}`
          );
          this.renderer.setAttribute(
            this.line.nativeElement,
            'y2',
            `${currentY}`
          );
          this.renderer.setStyle(
            this.line.nativeElement,
            'cursor',
            `crosshair`
          );

          this.isDrawing = true;

          if (!this.currentPolyline) {
            this.clearCircles();
            // add circle at this point
            this.addCircle({ x: currentX, y: currentY });
            this.currentPolyline = this.renderer.createElement(
              'polyline',
              'svg'
            );
            this.renderer.insertBefore(
              this.container.nativeElement,
              this.currentPolyline,
              this.line.nativeElement
            );
            this.polylinePoints.push(`${currentX},${currentY} `);
            this.renderer.setAttribute(
              this.currentPolyline,
              'points',
              `${this.polylinePoints}`
            );
            this.renderer.setStyle(this.currentPolyline, 'fill', `none`);
            this.renderer.setStyle(this.currentPolyline, 'cursor', `inherit`);
            this.renderer.setStyle(this.currentPolyline, 'z-index', `0`);
            this.renderer.setStyle(
              this.currentPolyline,
              'stroke',
              `rgb(34, 176, 214)`
            );
            this.renderer.setStyle(this.currentPolyline, 'stroke-width', `2px`);
            this.renderer.setStyle(this.currentPolyline, 'stroke-opacity', `1`);
            this.renderer.setStyle(
              this.currentPolyline,
              'stroke-dasharray',
              `none`
            );
            this.renderer.setStyle(
              this.currentPolyline,
              'stroke-linecap',
              `round`
            );
            this.renderer.setStyle(
              this.currentPolyline,
              'stroke-linejoin',
              `round`
            );
            this.renderer.setStyle(
              this.container.nativeElement,
              'cursor',
              `crosshair`
            );
            this.startOfPolyline = {
              x: currentX,
              y: currentY
            };
          } else {
            // add circle at this point
            this.addCircle({ x: currentX, y: currentY });
            this.polylinePoints.push(`${currentX},${currentY} `);
            this.renderer.setAttribute(
              this.currentPolyline,
              'points',
              `${this.polylinePoints}`
            );
            this.renderer.setStyle(
              this.container.nativeElement,
              'cursor',
              `crosshair`
            );
          }
        } else if (target.nodeName === 'circle') {
          // add circle at this point
          // check if the current circle is the start point of the polylin
          // if its a start point then create a ploygon, add its points in arrays and remove the line

          let x = this.startOfPolyline.x;
          let y = this.startOfPolyline.y;
          const absDiffX = Math.abs(currentX - x);
          const absDiffy = Math.abs(currentY - y);
          if (absDiffX < 15 || absDiffy < 15) {
            // remove polyline and add polygon with these points
            this.renderer.removeChild(
              this.container.nativeElement,
              this.currentPolyline
            );

            this.currentPolyline = undefined;
            this.createNewPolyGon(this.polylinePoints);
            this.isDrawing = false;
            // save these points
            let serializedPoints: Array<Point> = this.serializePoints(
              this.polylinePoints
            );
            this.saveArr.push(serializedPoints);
            // this.templateData.data.areas = this.saveArr;
            // this.sourceData = this.templateData;
            this.polylinePoints = [];
            this.renderer.setAttribute(this.line.nativeElement, 'x1', `${0}`);
            this.renderer.setAttribute(this.line.nativeElement, 'y1', `${0}`);
            this.renderer.setAttribute(this.line.nativeElement, 'x2', `${0}`);
            this.renderer.setAttribute(this.line.nativeElement, 'y2', `${0}`);

            this.renderer.setStyle(
              this.container.nativeElement,
              'cursor',
              `inherit`
            );
            this.reRenderAllNumbers();
            this.clearCircles();
          }
        } else if (target.nodeName === 'polygon') {
          // Select this polygon and show its circles
          this.clearCircles();
          this.currentPolygon = target;
          this.currentpolygonId = parseInt(target.getAttribute('id'));
          this.isPolygonDrawing = true;
          this.isDrag = false;
          let currentPoints = this.saveArr[this.currentpolygonId];
          // let deSerialiedPoints = this.deSerializePoints(currentPoints);
          this.addCirclesFromArray(currentPoints);
          this.renderer.setStyle(this.currentPolygon, 'cursor', `move`);
        }
      }
    }

    // }
  }

  /**
   *  Mouse move event handler
   * @param evt
   */
  move(evt) {
    // if (evt.button == LEFT_MOUSE_BUTTON ) {
    evt.preventDefault();
    // if(this.previewShow){

    // }else
    if (this.isSelectAnswer) {
      if (
        evt.target.nodeName == 'polygon' &&
        evt.target.getAttribute('id') !== this.selectedPolygonId
      ) {
        this.renderer.setStyle(evt.target, 'stroke', `rgb(49, 75, 89)`);
        this.renderer.setStyle(evt.target, 'stroke-width', `3px`);
        this.renderer.setStyle(evt.target, 'cursor', `pointer`);
        evt.target.addEventListener('mouseleave', this.mouseLeave.bind(this));
        this.mouseLeaveSelectEvtListnerRegistered = true;
      }
    } else {
      // console.log("evt.Target is ", evt.target);
      if (
        this.isDeleteClicked &&
        evt.target.nodeName === 'polygon' &&
        !this.mouseLeaveEvtListnerRegistered
      ) {
        this.renderer.setStyle(evt.target, 'fill', `rgb(219,120,113)`);
        this.renderer.setStyle(evt.target, 'stroke', `rgb(219,120,113)`);
        this.renderer.setStyle(evt.target, 'cursor', `pointer`);
        evt.target.addEventListener('mouseleave', this.mouseLeave.bind(this));
        this.mouseLeaveEvtListnerRegistered = true;
      } else if (this.isDeleteClicked && evt.target.nodeName !== 'polygon') {
        this.renderer.setStyle(
          this.container.nativeElement,
          'cursor',
          `default`
        );
      } else {
        this.isDrag = true;
        let positions = this.getMousePosition(evt);
        let currentX = positions.x;
        let currentY = positions.y;
        if (this.isDrawing) {
          this.renderer.setAttribute(
            this.line.nativeElement,
            'x2',
            `${currentX - this.pointerOffset}`
          );
          this.renderer.setAttribute(
            this.line.nativeElement,
            'y2',
            `${currentY - this.pointerOffset}`
          );
        } else if (this.isPolygonDrawing) {
          this.clearCircles();
          this.clearNumbers();
          this.renderer.setStyle(this.currentPolygon, 'cursor', `move`);
          currentX = currentX - this.clickX;
          currentY = currentY - this.clickY;
          this.renderer.setAttribute(
            this.currentPolygon,
            'transform',
            `matrix(1,0,0,1,${currentX}, ${currentY})`
          );
        }
      }
    }
  }

  /**
   *  mouse end move handler
   * @param evt
   */
  endMove(evt) {
    // if (evt.button == LEFT_MOUSE_BUTTON) {
    evt.preventDefault();
    // if(this.previewShow ){
    //   console.log("Preview state ", this.previewShow);

    // }else
    if (!this.isSelectAnswer) {
      this.click = false;
      // console.log("this.isDrag ", this.isDrag);
      this.isPolygonDrawing = false;
      if (this.currentPolygon && this.isDrag) {
        // calculate polygon points
        let newPoints = this.calculatePolygonPointsAfterDrag(
          this.currentPolygon
        );
        let serializedPoints = this.serializePoints(newPoints);
        // store these new points
        this.saveArr.splice(this.currentpolygonId, 1, serializedPoints);
        this.createNewPolyGon(newPoints, this.currentPolygon);

        this.addCirclesFromArray(serializedPoints);
        this.removePolyGon(this.currentPolygon);
        this.reRenderAllNumbers();
        this.previousSelectedPolygon = this.currentPolygon;
        this.currentPolygon = undefined;
        this.isPolygonDrawing = false;
      } else {
        // this.click = false;
      }
      this.isDrag = false;
    }
  }

  /**
   *
   * @param evt
   * Mouse leave event handler
   */
  mouseLeave(evt) {
    // if (evt.button == LEFT_MOUSE_BUTTON) {
    if (
      this.isSelectAnswer &&
      this.mouseLeaveSelectEvtListnerRegistered &&
      evt.target.nodeName == 'polygon'
    ) {
      evt.target.removeEventListener(
        'mouseleave',
        this.mouseLeave.bind(this),
        true
      );
      let polygonId = evt.target.getAttribute('id');
      if (!this.possibleAnswers.includes(polygonId)) {
        this.renderer.setStyle(evt.target, 'stroke', `rgb(34, 176, 214)`);
        this.renderer.setStyle(evt.target, 'stroke-width', `2px`);
      }
      this.renderer.setStyle(evt.target, 'cursor', `inherit`);
      this.mouseLeaveSelectEvtListnerRegistered = false;
    } else if (
      this.isDeleteClicked &&
      evt.target.nodeName === 'polygon' &&
      this.mouseLeaveEvtListnerRegistered
    ) {
      evt.target.removeEventListener(
        'mouseleave',
        this.mouseLeave.bind(this),
        true
      );
      this.renderer.setStyle(evt.target, 'fill', `rgb(34, 176, 214)`);
      this.renderer.setStyle(evt.target, 'stroke', `rgb(34, 176, 214)`);
      this.renderer.setStyle(evt.target, 'cursor', `inherit`);
      this.mouseLeaveEvtListnerRegistered = false;
    }
  }

  /**
   *
   * @param newPoints Array of points
   * @param oldPolygon previous polygon if exist
   * @param polygonId previous polygon id if exist
   * Create a new polygon with given array of points
   */
  createNewPolyGon(newPoints, oldPolygon?, polygonId?) {
    let polygon: ElementRef = this.renderer.createElement('polygon', 'svg');
    this.renderer.appendChild(this.polygonG.nativeElement, polygon);
    let id;
    if (polygonId > -1) {
      id = polygonId;
    } else if (oldPolygon) {
      id = parseInt(oldPolygon.getAttribute('id'));
    } else {
      id = this.saveArr.length;
    }
    // console.log(`id is ${id} & polygonId is ${polygonId} & oldPolygon ${oldPolygon} & this.saveArr.length ${this.saveArr.length}`);
    this.renderer.setAttribute(polygon, 'id', `${id}`);
    this.renderer.setAttribute(polygon, 'points', `${newPoints}`);
    this.renderer.setStyle(polygon, 'fill', `rgb(34, 176, 214)`);
    this.renderer.setStyle(polygon, 'fill-opacity', `0.5`);
    this.renderer.setStyle(polygon, 'cursor', `inherit`);
    this.renderer.setStyle(polygon, 'z-index', `0`);
    this.renderer.setStyle(polygon, 'stroke', `rgb(34, 176, 214)`);
    this.renderer.setStyle(polygon, 'stroke-width', `2px`);
    this.renderer.setStyle(polygon, 'stroke-opacity', `1`);
    this.renderer.setStyle(polygon, 'stroke-dasharray', `none`);
    this.renderer.setStyle(polygon, 'stroke-linecap', `round`);
    this.renderer.setStyle(polygon, 'stroke-linejoin', `round`);
  }

  /**
   *
   * @param x
   * @param y
   * @param number
   *  Render a number at given point
   */
  createPolygonNumber(x, y, number) {
    let numberG: ElementRef = this.renderer.createElement('g', 'svg');

    let numberRect = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(numberRect, 'x', `${0}`);
    this.renderer.setAttribute(numberRect, 'y', `${0}`);
    this.renderer.setAttribute(numberRect, 'width', `${26}`);
    this.renderer.setAttribute(numberRect, 'height', `${26}`);
    this.renderer.setAttribute(numberRect, 'rx', `${3}`);
    this.renderer.setAttribute(numberRect, 'ry', `${3}`);
    this.renderer.setStyle(numberRect, 'z-index', `5`);
    this.renderer.setStyle(numberRect, 'cursor', `inherit`);
    this.renderer.setStyle(numberRect, 'stroke', `rgb(102, 102, 102)`);
    this.renderer.setStyle(numberRect, 'stroke-width', `2px`);
    this.renderer.setStyle(numberRect, 'stroke-opacity', `1`);
    this.renderer.setStyle(numberRect, 'stroke-dasharray', `none`);
    this.renderer.setStyle(numberRect, 'stroke-linecap', `round`);
    this.renderer.setStyle(numberRect, 'stroke-linejoin', `round`);
    this.renderer.setStyle(numberRect, 'fill', `rgb(102, 102, 102)`);
    this.renderer.setStyle(numberRect, 'fill-opacity', `1`);
    this.renderer.appendChild(numberG, numberRect);

    let numberText: ElementRef = this.renderer.createElement('text', 'svg');
    this.renderer.setAttribute(numberText, 'x', `${9}`);
    this.renderer.setAttribute(numberText, 'y', `${4}`);
    this.renderer.setAttribute(numberText, 'dy', `1em`);
    this.renderer.setStyle(numberText, 'z-index', `6`);
    this.renderer.setStyle(numberText, 'cursor', `inherit`);
    this.renderer.setStyle(numberText, 'font-family', `sans-serif`);
    this.renderer.setStyle(numberText, 'fill', `rgb(255, 255, 255)`);
    this.renderer.setStyle(numberText, 'font-size', ` 14px`);
    this.renderer.setStyle(numberText, 'font-weight', `normal`);
    this.renderer.setStyle(numberText, 'font-style', `normal`);
    this.renderer.setStyle(numberText, 'opacity', `1`);
    this.renderer.setStyle(numberText, 'text-anchor', `start`);
    this.renderer.appendChild(numberG, numberText);

    let textNode: ElementRef = this.renderer.createText(`${number}`);
    this.renderer.appendChild(numberText, textNode);

    this.renderer.setStyle(numberG, 'z-index', `2`);
    this.renderer.setStyle(numberG, 'cursor', `inherit`);
    this.renderer.setAttribute(numberG, 'transform', `translate(${x}, ${y})`);
    this.renderer.appendChild(this.numberG.nativeElement, numberG);
  }

  /**
   *
   * @param polygon
   * Remove a single polygon
   */
  removePolyGon(polygon) {
    this.renderer.removeChild(this.polygonG.nativeElement, polygon);
  }

  /**
   *
   * @param polygon
   *  Calculate polygon points after drag
   */
  calculatePolygonPointsAfterDrag(polygon) {
    let points = polygon.getAttribute('points');
    let polygonTransFormMatrix = this.getElementMatrix(polygon);
    let newPoints = [];
    let oldPointsArray = points.split(' ,');
    let oldPointsLength = oldPointsArray.length;
    for (let i = 0; i < oldPointsLength; i++) {
      let currentPoint = oldPointsArray[i];
      let currentPointArr = currentPoint.split(',');
      let x = parseInt(currentPointArr[0]);
      let y = parseInt(currentPointArr[1]);
      let newPoint = `${x + polygonTransFormMatrix.e},${y +
        polygonTransFormMatrix.f} `;
      newPoints.push(newPoint);
    }

    return newPoints;
  }

  /**
   *
   * @param points :Array<Point>
   * represent it into {x:x, y:y} to store it into source json
   */

  serializePoints(points): Array<Point> {
    let serializedArr: Array<Point> = [];
    let pointsArrayLength = points.length;
    for (let i = 0; i < pointsArrayLength; i++) {
      let currentPoint = points[i];
      let currentPointArr = currentPoint.split(',');
      let point: Point = {
        x: parseInt(currentPointArr[0]),
        y: parseInt(currentPointArr[1])
      };
      serializedArr.push(point);
    }
    return serializedArr;
  }

  /**
   *
   * @param points
   * Represent it in the form of x,y for polygon rendering
   */
  deSerializePoints(points) {
    let pointsLength = points.length;
    let deSerialiedPoints = [];
    for (let i = 0; i < pointsLength; i++) {
      let currentPoint = points[i];
      let point = `${currentPoint.x},${currentPoint.y} `;
      deSerialiedPoints.push(point);
    }
    return deSerialiedPoints;
  }

  /**
   *
   * @param element
   *  returns element transform matrix
   */
  getElementMatrix(element) {
    return element.transform.baseVal.consolidate().matrix;
  }

  /**
   * Re render all polygons with source points
   */
  reRenderAllPolygons() {
    let saveArrLength = this.saveArr.length;
    for (let i = 0; i < saveArrLength; i++) {
      let currentPoints = this.deSerializePoints(this.saveArr[i]);
      this.createNewPolyGon(currentPoints, null, i);
    }
  }

  /**
   * Re render all numbers with source points
   */
  reRenderAllNumbers() {
    this.clearNumbers();
    let saveArrLength = this.saveArr.length;
    for (let i = 0; i < saveArrLength; i++) {
      let firstPoint = this.saveArr[i][0];
      let x = firstPoint.x;
      let y = firstPoint.y;
      this.createPolygonNumber(x, y, i + 1);
    }
  }

  /**
   *  Clear all polygons from svg
   */
  clearPolygons() {
    while (this.polygonG.nativeElement.firstChild) {
      this.polygonG.nativeElement.firstChild.remove();
    }
  }

  /**
   *  Clear all circles from svg
   */
  clearCircles() {
    while (this.circleG.nativeElement.firstChild) {
      this.circleG.nativeElement.firstChild.remove();
    }
  }
  /**
   *  Clear all numbers from svg
   */
  clearNumbers() {
    while (this.numberG.nativeElement.firstChild) {
      this.numberG.nativeElement.firstChild.remove();
    }
  }

  /**
   * Delete button clicked
   */
  deleteClicked() {
    this.clearCircles();
    this.isDeleteClicked = true;
    this.isDrawClicked = false;
    this.isSelectAnswer = false;
    this.selectedPolygonId = undefined;
    this.clearCircles();
    this.clearPolygons();
    this.reRenderAllPolygons();
    console.log('SelectedAnswers in delete is -> ', this.selectedAnswers);
    console.log('Save arr is ', JSON.stringify(this.saveArr));
  }

  /**
   * Draw button clicked
   */
  drawClicked() {
    this.isDeleteClicked = false;
    this.isDrawClicked = true;
    this.isSelectAnswer = false;
    this.selectedPolygonId = undefined;
    this.clearCircles();
    this.clearPolygons();
    this.reRenderAllPolygons();
    console.log('SelectedAnswers in draw is -> ', this.selectedAnswers);
  }

  /**
   * Select option clicked
   */
  selectOptionsClicked() {
    this.isSelectAnswer = true;
    this.isDeleteClicked = false;
    this.isDrawClicked = false;
    // if(this.isSelectAnswer){
    this.clearCircles();
    // }
    this.showPossibleAnswers();
    console.log(
      'SelectedAnswers in selectOptionsClicked is -> ',
      this.selectedAnswers
    );
  }

  /**
   *
   * @param array
   *  add circles at the points from given array
   */
  addCirclesFromArray(array) {
    let arrayLength = array.length;
    for (let i = 0; i < arrayLength; i++) {
      this.addCircle(array[i]);
    }
  }

  /**
   * Add circle at given point
   */
  addCircle(point) {
    let circle: ElementRef = this.renderer.createElement('circle', 'svg');
    this.renderer.setAttribute(circle, 'cx', `${point.x}`);
    this.renderer.setAttribute(circle, 'cy', `${point.y}`);
    this.renderer.setAttribute(circle, 'r', `${5}`);
    this.renderer.setStyle(circle, 'fill', `rgb(34, 176, 214)`);
    this.renderer.appendChild(this.circleG.nativeElement, circle);
  }

  /** END OF SVG RELATED CODE */

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
}
