import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  Input,
  ComponentRef,
  ViewContainerRef,
  ComponentFactory,
  ComponentFactoryResolver,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { OptComponent } from 'libs/quiz-templates/src/lib/sharedComponents/opt/components/opt-layout/opt.component';
import {
  TemplateFibImage,
  FibImageResponse,
  FibImageOptions,
  FibImage
} from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-fib-image-drag-drop-layout',
  templateUrl: './fib-image-drag-drop-layout.component.html',
  styleUrls: ['./fib-image-drag-drop-layout.component.scss']
})
export class FibImageDragDropLayoutComponent implements OnInit, AfterViewInit {
  public LEFT_MOUSE_BUTTON = 0;
  public isMouseDown: boolean = false;
  // variables to hold mouse co-ordinates
  public mouseDownX: number = 0;
  public mouseDownY: number = 0;
  // store target element here
  public target: any = null;
  public mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

  public element: any = null;
  public mouseDrag: boolean = false;

  public width: number = 200;
  public height: number = 60;
  public topMargin: number = 20;
  public leftMargin: number = 30;
  public canvasWidth: number;
  public canvasHeight: number;

  @ViewChild('canvas', { static: false }) public canvas: ElementRef;
  @ViewChild('image', { static: false }) public imageRef: ElementRef;
  @Input() public templateData: TemplateFibImage;
  @Input() public previewState: boolean;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
  @Input() public save: Subject<void>;
  @Input() public dashboardPreviewState: BehaviorSubject<boolean>;

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

  public value;
  public inputType: string;
  public templateType: string;
  public selectedAnswersPreview: Array<any> = [];
  public qstem: object = {};
  public opts: FibImageOptions[] = [];
  public optsPreview: FibImageOptions[] = [];
  public optsEdit: FibImageOptions[] = [];
  public oldOpts: FibImageOptions[] = [];
  public possible_responses: FibImageResponse[];
  public layout: string;
  public inputName: string;
  public selectedAnswers: Array<any> = [];
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
  public templateName: string;

  @Output() public showAnswers = new EventEmitter();
  public resizeMode: boolean = false;
  public tempElementId: string;

  public optionValue: Array<any> = [];
  public clickComponentStatus: boolean = true;
  public clickOptionStatus: boolean = true;
  public tempData: object = { value: '', label: '' };
  public responses: Array<FibImageOptions[]>;
  public selectedAnswersData: Array<string> = [];
  public defaultResponses: Array<any> = [];
  public answerState: object = {};

  constructor(
    public sharedComponentService: SharedComponentService,
    private resolver: ComponentFactoryResolver,
    public changeRef: ChangeDetectorRef,
    // private toastrService: ToastrService
    public renderer: Renderer2
  ) {}

  ngOnInit() {
    this.inputType = 'radio';
    this.initState();

    this.defaultResponses = [...this.possible_responses];
    // this.defaultResponses = JSON.parse(JSON.stringify(this.possible_responses));
    console.log(
      'Container',
      document.getElementById('contain').offsetWidth,
      this.defaultResponses
    );
  }

  populateImage(imageData) {
    imageData['width'] = parseInt(imageData['width']);
    imageData['height'] = parseInt(imageData['height']);

    let width: string;
    if (imageData['width'] > this.canvasWidth) {
      width = `${this.canvasWidth}px`;
    } else {
      width = `${imageData['width']}px`;
    }

    // if(imageData['height'] > this.canvasHeight) {
    //   height = `${this.canvasHeight}px`;
    // }
    // else {
    //   height = `${imageData['height']}px`;
    // }

    this.renderer.setStyle(this.canvas.nativeElement, 'width', width);
    this.renderer.setStyle(
      this.canvas.nativeElement,
      'height',
      `${imageData['width']}px`
    );
    // this.renderer.setStyle(this.canvas.nativeElement,'background', `url(${imageData['src']}) 50% 50% no-repeat`)
    // this.renderer.setStyle(this.canvas.nativeElement,'background-size', 'contain');
    console.log('Image Upload', imageData, this.canvasWidth, this.canvasHeight);
  }

  ngAfterViewInit(): void {
    // this.previewSubscription = this.previewState.subscribe((state: boolean) => {
    this.previewShow = this.previewState;
    // this.sharedComponentService.imageModalOpen.next({});

    // if (state) {
    //   this.optsPreview = this.templateData.data.options;
    //   this.selectedAnswersPreview = [];
    //   for (let i = 0; i < this.selectedAnswers.length; i++) {
    //     this.selectedAnswersPreview.push(null);
    //   }
    // } else {
    //   this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    //   this.showAnsState.next(false);
    // }
    // this.emitAns();
    // this.emitCorrectAnswer();
    // });

    // this.sourceSubscription = this.sourceState.subscribe(state => {
    //   this.sourceModalOpen.next(state);
    // });

    this.saveSubscription = this.save.subscribe(() => this.saveData());

    // this.showAnsSubscription = this.showAnsState.subscribe(state => {
    //   this.showAnsStateFlag = state;

    //   this.selectedAnswersData = [];

    //   for (let i = 0; i < this.selectedAnswers.length; i++) {
    //     let sel = this.selectedAnswers[i];

    //     if (this.templateType == 'fib-image-drag-drop') {
    //       if (sel) {
    //         this.selectedAnswersData.push(sel.label);
    //       }
    //     } else if (this.templateType == 'fib-image-dropdown') {
    //       let response = this.responses[i].filter(res => res.value == sel);
    //       if (response.length > 0)
    //         this.selectedAnswersData.push(response[0].label);
    //     } else {
    //       this.selectedAnswersData.push(sel);
    //     }
    //   }
    //   this.emitAns();
    //   this.emitCorrectAnswer();
    // });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());

    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        state => {
          this.dashboardPreviewShow = state;
        }
      );
    }

    this.sharedComponentService.getImageData.subscribe(imageData => {
      if (imageData['componentType'] == 'fib-image') {
        imageData['src'] = imageData['imageUrl'];
        this.populateImage(imageData);
        console.log('Default Responses', this.defaultResponses, this.opts);
        this.optsEdit = [...this.opts];
        this.selectedAnswers = [];
        this.templateData.data.validation.valid_response.value = this.selectedAnswers;
        this.possible_responses = [...this.defaultResponses];
        this.templateData.data.possible_responses = this.possible_responses;
        this.templateData.data.image = imageData as FibImage;
        this.sourceData = this.templateData;
      }
    });

    this.canvasWidth = this.canvas.nativeElement.offsetWidth;
    this.canvasHeight = this.canvas.nativeElement.offsetHeight;

    this.populateImage(this.templateData.data.image);
    this.setMouseFunction(this.canvas.nativeElement);
  }

  emitAns(): void {
    for (let i = 0; i < this.selectedAnswers.length; i++) {
      let selectedAnswers = this.selectedAnswers[i];
      let selectedAnswersPreview = this.selectedAnswersPreview[i];

      if (this.possible_responses[i]) {
        let div = document.getElementById(this.possible_responses[i].id);

        if (!this.showAnsStateFlag) {
          this.renderer.removeClass(div, 'correct');
          this.renderer.removeClass(div, 'incorrect');
        } else if (this.showAnsStateFlag) {
          if (this.templateType == 'fib-image-drag-drop') {
            if (
              selectedAnswersPreview &&
              selectedAnswers &&
              selectedAnswers.value == selectedAnswersPreview.value
            ) {
              this.renderer.removeClass(div, 'incorrect');
              this.renderer.addClass(div, 'correct');
            } else {
              this.renderer.removeClass(div, 'correct');
              this.renderer.addClass(div, 'incorrect');
            }
          } else {
            console.log(
              'Emit answers',
              selectedAnswers,
              selectedAnswersPreview
            );

            if (this.templateType == 'fib-image-text') {
              selectedAnswers = selectedAnswers.toLowerCase();
              selectedAnswersPreview = selectedAnswersPreview.toLowerCase();
            }

            if (selectedAnswers == selectedAnswersPreview) {
              this.renderer.removeClass(div, 'incorrect');
              this.renderer.addClass(div, 'correct');
            } else {
              this.renderer.removeClass(div, 'correct');
              this.renderer.addClass(div, 'incorrect');
            }
          }
        }
      }
    }

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
    this.opts = this.templateData.data.options as Array<FibImageOptions>;
    this.optsPreview = [...this.opts];
    this.optsEdit = [...this.opts];
    // this.oldOpts = JSON.parse(JSON.stringify(this.opts))

    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.selectedAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData as TemplateFibImage;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.shuffleCheck = this.templateData.data.shuffle
      ? this.templateData.data.shuffle
      : false;
    this.possible_responses = this.templateData.data
      .possible_responses as Array<FibImageResponse>;

    if (this.templateType == 'fib-image-dropdown') {
      this.responses = this.templateData.data.responses as Array<
        FibImageOptions[]
      >;
    }

    this.templateName = this.templateData.name;
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.opts, event.previousIndex, event.currentIndex);
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  responseDropped(event: CdkDragDrop<string[]>, i: number): void {
    moveItemInArray(this.responses[i], event.previousIndex, event.currentIndex);
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
    this.templateData.data.validation.valid_response.score = event;
    this.sourceData = this.templateData;
    this.changeTemplateData();
    this.changePointsValue();
  }

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  imageUpload(): void {
    this.sharedComponentService.imageUploadModalService({
      type: 'fib-image',
      state: true,
      name: 'upload'
    });
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateFibImage): void {
    console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = [];
    this.initState();

    for (let i = 0; i < this.selectedAnswers.length; i++) {
      if (this.templateType == 'fib-image-drag-drop') {
        if (this.selectedAnswers[i])
          this.optsEdit = this.optsEdit.filter(
            opts => opts.value !== this.selectedAnswers[i].value
          );
      } else if (this.templateType == 'fib-image-dropdown') {
        this.optsEdit = this.optsEdit.filter(
          opts => opts.value !== this.selectedAnswers[i]
        );
      } else {
        this.optsEdit = this.optsEdit.filter(
          opts => opts.label !== this.selectedAnswers[i]
        );
      }
    }

    this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent, index: number, option): void {
    if (updatedContent['label']) {
      this.opts.forEach((options: FibImageOptions) => {
        if (updatedContent['value'] == options.value) {
          options.label = updatedContent['label'];
        }
      });

      this.optsEdit.forEach(option => {
        if (option.value == updatedContent['value']) {
          option.label = updatedContent['label'];
        }
      });

      this.optsPreview.forEach(option => {
        if (option.value == updatedContent['value']) {
          option.label = updatedContent['label'];
        }
      });

      this.templateData.data.options = this.opts as Array<FibImageOptions>;
      this.sharedComponentService.getImageData.next({});
    }
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option: FibImageOptions): void {
    this.opts.push(option);
    this.optsPreview = [...this.opts];
    let opt = { ...option };
    this.optsEdit.push(opt);
    this.templateData.data.options = this.opts;
    this.sourceData = this.templateData as TemplateFibImage;
  }

  // Validate the form on submit
  onValidation() {}

  removeResponseOption(option, index) {
    this.responses[index] = this.responses[index].filter(
      res => res.value !== option.value
    );

    if (
      this.selectedAnswers[index] &&
      this.selectedAnswers[index] == option.value
    ) {
      this.selectedAnswers[index] = null;
    }

    this.templateData.data.responses = this.responses;
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    this.sourceData = this.templateData;
  }

  //Function to remove options
  removeOption(option: FibImageOptions) {
    // this.selectedAnswers = this.selectedAnswers.filter(sel=> sel?sel.value:sel !== option.value)

    for (let i = 0; i < this.selectedAnswers.length; i++) {
      if (
        this.selectedAnswers[i] &&
        this.selectedAnswers[i].value == option.value
      ) {
        this.selectedAnswers[i] = null;
      }
    }

    this.opts = this.opts.filter(
      (options: FibImageOptions) => options.value !== option.value
    );
    console.log('Selected Answers', this.selectedAnswers, option, this.opts);

    this.optsPreview = this.optsPreview.filter(
      (options: FibImageOptions) => options.value !== option.value
    );

    this.optsEdit = this.optsEdit.filter(
      (options: FibImageOptions) => options.value !== option.value
    );

    this.sharedComponentService.imageModalOpen.next({});
    this.sharedComponentService.getImageData.next({});
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    this.templateData.data.options = this.opts;
    this.sourceData = this.templateData;
    this.initState();
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent) {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  saveData() {
    // this.optsPreview.forEach((opts: TemplateMcqOption)=> opts.selected = false);
    // this.sourceData['data'].options = this.opts;
    // this.sourceData['data'].shuffle = this.shuffleCheck;
    console.log('Source', this.sourceData);
    this.getAnswers.next(this.sourceData);
  }

  setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) {
      //Moz
      this.mouse.x =
        ev.pageX - this.canvas.nativeElement.getBoundingClientRect().left;
      // if(this.canvas.nativeElement.getBoundingClientRect().top < 0) {
      //   this.mouse.y = ev.pageY - ev.clientY;
      // }
      // else {
      //   this.mouse.y = ev.pageY - this.canvas.nativeElement.getBoundingClientRect().top
      // }
      this.mouse.y =
        ev.clientY - this.canvas.nativeElement.getBoundingClientRect().top;
    } else if (ev.clientX) {
      //IE
      this.mouse.x = ev.clientX + document.body.scrollLeft;
      this.mouse.y = ev.clientY + document.body.scrollTop;
    }

    console.log(
      'Mouse',
      this.mouse,
      ev.pageY,
      ev.clientY,
      this.canvas.nativeElement.getBoundingClientRect().top
    );
  }

  onMouseMove(e) {
    this.setMousePosition(e);

    if (!this.mouseDrag) {
      if (this.element !== null) {
        this.element.style.width =
          Math.abs(this.mouse.x - this.mouse.startX) + 'px';
        this.element.style.height =
          Math.abs(this.mouse.y - this.mouse.startY) + 'px';
        this.element.style.left =
          this.mouse.x - this.mouse.startX < 0
            ? this.mouse.x + 'px'
            : this.mouse.startX + 'px';
        this.element.style.top =
          this.mouse.y - this.mouse.startY < 0
            ? this.mouse.y + 'px'
            : this.mouse.startY + 'px';
      }
    }
  }

  onResponseContentUpdate(index, opt) {
    if (
      this.selectedAnswers[index] &&
      this.selectedAnswers[index] == opt.value
    ) {
      this.selectedAnswers[index] = opt.value;
    }

    for (let i = 0; i < this.responses[index].length; i++) {
      if (this.responses[index][i].value == opt.value) {
        this.responses[index][i].label = opt.label;
      }
    }

    this.templateData.data.responses = this.responses;
    this.templateData.data.validation.valid_response.value = this.selectedAnswers;
    this.sourceData = this.templateData;
  }

  addList(index) {
    if (this.responses[index].length < 1) {
      this.responses[index].push({
        label: '',
        value: `${this.responses[index].length + 1}`
      });
    } else {
      let lastIndex =
        parseInt(
          this.responses[index][this.responses[index].length - 1].value
        ) + 1;
      this.responses[index].push({ label: '', value: `${lastIndex}` });
    }

    this.templateData.data.responses = this.responses;
    this.sourceData = this.templateData;
  }

  filterOption(temp) {
    let opt = this.opts.filter(opt => opt.label == temp);
    console.log('Filter', opt);
    return opt[0];
  }

  public dragCheck: boolean = false;
  setMouseFunction(element) {
    this.renderer.listen(element, 'mousedown', event => {
      this.canvas.nativeElement.style.cursor = 'default';
      // console.log("Mouse Down");

      this.onMouseDownDrag(event);
    });

    this.canvas.nativeElement.style.cursor = 'crosshair';
    this.renderer.listen(element, 'mousemove', event => {
      this.canvas.nativeElement.style.cursor = 'default';
      if (!this.previewShow) {
        this.onMouseMoveDrag(event);
      }
    });

    this.renderer.listen(element, 'mouseup', event => {
      this.canvas.nativeElement.style.cursor = 'default';
      if (!this.previewShow) {
        // console.log("Mouse Up");
        this.onMouseUpDrag(event);
      }
    });

    this.renderer.listen(element, 'mouseleave', event => {
      this.canvas.nativeElement.style.cursor = 'crosshair';
      if (!this.previewShow) {
        this.onMouseLeaveDrag(event);
      }
    });
  }

  onMouseClick(e) {
    if (!this.previewShow) {
      if (e.target.id == 'canvas') {
        this.setMousePosition(e);
        this.mouse.startX = this.mouse.x;
        this.mouse.startY = this.mouse.y;

        let lastId =
          parseInt(
            this.possible_responses[
              this.possible_responses.length - 1
            ].id.replace('abc', '')
          ) + 1;
        console.log('Last Id', lastId);
        let id = `abc${lastId}`;
        let direction = 'left';
        let leftCoordinate =
          this.mouse.x - this.mouse.startX < 0
            ? this.mouse.x
            : this.mouse.startX;
        let left =
          this.mouse.x - this.mouse.startX < 0
            ? this.mouse.x
            : this.mouse.startX;
        let top =
          this.mouse.y - this.mouse.startY < 0
            ? this.mouse.y
            : this.mouse.startY;

        if (this.templateType == 'fib-image-dropdown') {
          let responseData = [
            { label: 'Choice A', value: '1', feedbackInline: '' },
            { label: 'Choice B', value: '2', feedbackInline: '' },
            { label: 'Choice C', value: '3', feedbackInline: '' }
          ];

          this.responses.push(responseData);
        }

        // console.log("Check", (leftCoordinate+250), document.getElementById('contain').offsetWidth)
        if (
          leftCoordinate + this.width + this.leftMargin >
          document.getElementById('contain').offsetWidth
        ) {
          left = leftCoordinate - (this.width + this.leftMargin);
          top = top - this.topMargin;
          direction = 'right';
        } else {
          left = left + this.leftMargin;
          top = top - this.topMargin;
        }

        let response = {
          x: left,
          y: top,
          width: this.width,
          height: this.height,
          id: id,
          direction: direction
        } as FibImageResponse;
        console.log('Direction changed', direction, left, response);

        this.possible_responses.push(response);
        this.selectedAnswers.push(null);

        this.templateData.data.validation.valid_response.value = this.selectedAnswers;
        this.templateData.data.possible_responses = this.possible_responses;
      }
    }
  }

  onMouseDownDrag(evt) {
    this.isMouseDown = true;
    if (evt.target.id) {
      this.target = evt.target;
    } else {
      this.target = evt.target.parentNode;
    }
    this.renderer.setStyle(this.target, 'z-index', '999');

    this.mouseDownX = evt.clientX;
    this.mouseDownY = evt.clientY;
    this.mouseDrag = true;
  }

  onMouseMoveDrag(evt) {
    if (this.isMouseDown && evt.button == this.LEFT_MOUSE_BUTTON) {
      evt.preventDefault();
      let mouseX = evt.clientX;
      let mouseY = evt.clientY;
      // calculating the difference between previous x co-ordinate and on mouse drag x co-ordinate
      let mouseDX = mouseX - this.mouseDownX;
      let mouseDY = mouseY - this.mouseDownY;
      // console.log("Target",this.target.style.left, this.target.style.top)

      let dx = parseInt(this.target.style.left);
      let dy = parseInt(this.target.style.top);

      // add above calculated difference to the target's x,y cordinate and set new x,y co-ordinates
      dx += mouseDX;
      dy += mouseDY;
      // set mousedown values to current x,y co-ordinates
      this.mouseDownX = mouseX;
      this.mouseDownY = mouseY;

      // console.log('Drag down', this.target.id, evt.target)

      let checkDragParent;
      let element;
      if (!evt.target.id) {
        console.log('Parent Node', evt.target.parentNode);
        if (evt.target.parentNode.id == this.target.id) {
          checkDragParent = true;
          element = evt.target.parentNode;
        }
      } else {
        if (evt.target.id == this.target.id) {
          checkDragParent = true;
          element = evt.target;
        }
      }

      console.log('Drag check', checkDragParent, this.target.id, evt.target);
      if (
        dx <= this.canvas.nativeElement.offsetWidth - this.width / 10 &&
        dy <= this.canvas.nativeElement.offsetHeight - this.height
      ) {
        this.target.style.left = dx + 'px';
        this.target.style.top = dy + 'px';

        for (let i = 0; i < this.possible_responses.length; i++) {
          if (evt.target.id == this.possible_responses[i].id) {
            this.possible_responses[i].x = dx;
            this.possible_responses[i].y = dy;
          }
        }
      }
      // evt.target.addEventListener("mouseleave", this.mouseLeave.bind(this));

      this.templateData.data.possible_responses = this.possible_responses;
      this.sourceData = this.templateData;

      if (!evt.target.id) {
        this.dragCheck = true;
      }
    }
  }

  // mouseLeave(evt) {
  //   evt.target.removeEventListener("mouseleave", this.mouseLeave.bind(this), true);
  // }

  onMouseUpDrag(evt) {
    if (this.isMouseDown && evt.button == this.LEFT_MOUSE_BUTTON) {
      this.mouseDrag = false;
      evt.preventDefault();

      this.isMouseDown = false;
      this.renderer.removeStyle(this.target, 'z-index');

      this.templateData.data.possible_responses = this.possible_responses;
      this.sourceData = this.templateData as TemplateFibImage;
    }
  }
  onMouseLeaveDrag(evt) {
    if (this.isMouseDown && evt.button == this.LEFT_MOUSE_BUTTON) {
      this.isMouseDown = false;
    }
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
  toggleSidebar(metadata): void {
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

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onOptionsUpdate(updatedContent: string): void {
    this.tempData = { ...this.filterOption(updatedContent) };
    this.clickComponentStatus = false;
  }

  clickOpt(opt: object): void {
    this.tempData = { ...opt };
    this.clickComponentStatus = false;
  }

  clickOptionRow(): void {
    this.dragCheck = false;

    if (this.clickComponentStatus) {
      if (this.tempData['value'] && this.tempData['value'].length > 0) {
        if (this.previewShow) {
          for (let i = 0; i < this.selectedAnswersPreview.length; i++) {
            if (
              this.selectedAnswersPreview[i] &&
              this.selectedAnswersPreview[i].value == this.tempData['value']
            ) {
              this.selectedAnswersPreview[i] = null;
            }
          }

          let opt = this.opts.filter(
            opts => opts.value == this.tempData['value']
          )[0];

          let optPrev = this.optsPreview.filter(
            opts => opts.value == this.tempData['value']
          );
          console.log('Opts', opt, optPrev);

          if (optPrev.length == 0) this.optsPreview.push(opt);
          this.tempData = { label: '', value: '' };

          this.emitAns();
          this.emitCorrectAnswer();
        } else {
          for (let i = 0; i < this.selectedAnswers.length; i++) {
            if (
              this.selectedAnswers[i] &&
              this.selectedAnswers[i].value == this.tempData['value']
            ) {
              this.selectedAnswers[i] = null;
            }
          }

          let opt = this.opts.filter(
            opts => opts.value == this.tempData['value']
          )[0];

          let optEdit = this.optsEdit.filter(
            opts => opts.value == this.tempData['value']
          );
          console.log('Opts', opt, optEdit);

          if (optEdit.length == 0) this.optsEdit.push(opt);
          this.tempData = { label: '', value: '' };
          this.templateData.data.validation.valid_response.value = this.selectedAnswers;
        }
      }
    }
  }

  clickComp(index): void {
    this.dragCheck = false;

    if (this.clickComponentStatus) {
      this.clickOptionStatus = true;

      if (this.tempData['label'] && this.tempData['label'].length > 0) {
        if (this.previewShow) {
          if (this.selectedAnswersPreview[index]) {
            let opt: FibImageOptions[] = this.opts.filter(
              opt => opt.value == this.selectedAnswersPreview[index].value
            );
            this.optsPreview.push(opt[0]);
            console.log(
              'Already exists',
              this.selectedAnswersPreview[index],
              this.tempData,
              this.optsPreview,
              opt
            );
          }
          for (let i = 0; i < this.selectedAnswersPreview.length; i++) {
            if (
              this.selectedAnswersPreview[i] &&
              this.selectedAnswersPreview[i].value == this.tempData['value']
            ) {
              this.selectedAnswersPreview[i] = null;
            }
          }
          this.selectedAnswersPreview[index] = this.tempData;

          this.optsPreview = this.optsPreview.filter(
            opts => opts.value !== this.tempData['value']
          );
          this.tempData = { label: '', value: '' };
          this.isMouseDown = false;
          this.emitCorrectAnswer();
          this.emitAns();
        } else {
          if (this.selectedAnswers[index]) {
            let opt: FibImageOptions[] = this.opts.filter(
              opt => opt.value == this.selectedAnswers[index].value
            );
            this.optsEdit.push(opt[0]);
            console.log(
              'Already exists',
              this.selectedAnswers[index],
              this.tempData,
              this.optsEdit,
              opt
            );
          }
          for (let i = 0; i < this.selectedAnswers.length; i++) {
            if (
              this.selectedAnswers[i] &&
              this.selectedAnswers[i].value == this.tempData['value']
            ) {
              this.selectedAnswers[i] = null;
            }
          }

          this.selectedAnswers[index] = this.tempData;
          this.optsEdit = this.optsEdit.filter(
            opts => opts.value !== this.tempData['value']
          );
          this.tempData = { label: '', value: '' };
          this.templateData.data.validation.valid_response.value = this.selectedAnswers;
          console.log('Template Data', this.templateData);
          this.sourceData = this.templateData;
        }
      }
    }
  }

  emitCorrectAnswer(): void {
    let previewArr = [];
    this.selectedAnswersPreview.forEach(sel => {
      if (sel) {
        if (this.templateType == 'fib-image-drag-drop') {
          previewArr.push(sel.value);
        } else {
          sel = sel.toLowerCase();
          previewArr.push(sel);
        }
      } else {
        previewArr.push(sel);
      }
    });

    let editArr = [];
    this.selectedAnswers.forEach(sel => {
      if (sel) {
        if (this.templateType == 'fib-image-drag-drop') {
          editArr.push(sel.value);
        } else {
          sel = sel.toLowerCase();
          editArr.push(sel);
        }
      } else {
        editArr.push(sel);
      }
    });

    this.correctAnsPoints = 0;

    console.log('Compare', previewArr, editArr);
    if (previewArr.toString() == editArr.toString()) {
      this.correctAnsPoints = this.points;
    } else {
      this.correctAnsPoints = 0;
    }

    this.showAnswers.emit({
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  removeSpot(index) {
    this.possible_responses.splice(index, 1);

    if (this.templateType == 'fib-image-drag-drop') {
      if (this.selectedAnswers[index]) {
        let opt = this.opts.filter(
          opts => opts.value == this.selectedAnswers[index].value
        )[0];
        this.optsEdit.push(opt);
      }
    } else if (this.templateType == 'fib-image-dropdown') {
      this.responses.splice(index, 1);
    }

    this.selectedAnswers.splice(index, 1);
  }

  getOpt(selectedValue) {
    let opt = this.opts.filter(opts => opts.value == selectedValue);
    if (opt[0]) {
      return opt[0];
    } else {
      return;
    }
  }

  clickText() {
    this.isMouseDown = false;
    console.log('Clicked', this.isMouseDown);
  }

  changeText() {
    if (this.previewShow) {
      this.emitAns();
      this.emitCorrectAnswer();
    } else {
      this.templateData.data.validation.valid_response.value = this.selectedAnswers;
      this.sourceData = this.templateData;

      console.log('Template Data 2', this.templateData, this.selectedAnswers);
    }
  }

  changeDropdown() {
    if (this.previewShow) {
      this.emitCorrectAnswer();
      this.emitAns();
    } else {
      this.templateData.data.validation.valid_response.value = this.selectedAnswers;
      this.sourceData = this.templateData;
    }

    this.isMouseDown = false;
  }

  editRedirect(): void {
    this.editQuestion.next({
      category: this.templateData.data.type,
      subcategory: this.templateData.type,
      id: this.templateData['id']
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

  onSelectedAnswersPreview(event) {
    console.log(event);
  }
  feedbackStemUpdate(evt) {
    console.log(evt);

    // this.qstem['feedback'] = evt;
    // this.templateData.data.stimulus.feedbackInline = this.qstem['feedback'];
  }
}
