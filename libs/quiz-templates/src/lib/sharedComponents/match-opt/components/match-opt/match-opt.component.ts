import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  Output,
  ViewContainerRef,
  EventEmitter,
  ComponentRef,
  Renderer2,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { ClassifyMatchOption } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { BehaviorSubject } from 'rxjs';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';

@Component({
  selector: 'match-opt',
  templateUrl: './match-opt.component.html',
  styleUrls: ['./match-opt.component.scss']
})
export class MatchOptComponent implements OnInit {
  @Input() public optData: ClassifyMatchOption;
  @Input() public previewState: boolean;
  @Input() public showAnsState: BehaviorSubject<object>;
  @Input() public inputName: string;
  @Input() public optValue: Array<string>;
  @Input() public optArray: Array<ClassifyMatchOption>;
  @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @ViewChild('myContentEdit', { static: true })
  public myContentEdit: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  @Output() onContentUpdate = new EventEmitter();
  @Output() onSelectedAnswersPreview = new EventEmitter();
  public selectedAns;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  public correctAnswer: Array<string>;
  public showCorrectAnswer: boolean;
  public radioCheck: boolean;
  @Input() public index: number;
  @Input() public stemLength: number;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.previewState.subscribe((mode: boolean) => {
    //   this.mode = mode;
    //   this.showCorrectAnswer = false;
    //   this.getOptionClass();
    // });

    this.mode = this.previewState;

    this.showAnsState.subscribe((data: object) => {
      this.showCorrectAnswer = data['state'];
      this.correctAnswer = data['selectedAnswers'];
    });
  }

  selectPoints(): boolean {
    if (this.mode) {
      if (
        (this.stemLength && this.index < this.stemLength) ||
        !this.stemLength
      ) {
        if (
          this.index !== undefined &&
          this.optArray[this.index].value == this.optValue[this.index]
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  getPoints() {
    let optionArray = [];
    this.optArray.forEach(optArr => {
      optionArray.push(optArr.value);
    });

    let arr1 = String(optionArray);
    let arr2 = String(this.optValue);

    if (arr1 == arr2) {
      return true;
    } else {
      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("Changes", this.optArray, this.optValue)

    if (this.onSelectedAnswersPreview) {
      if (this.mode) {
        if (changes.optValue) {
          this.correctAnswer = changes.optValue.currentValue;
        }

        this.onSelectedAnswersPreview.emit(this.getPoints());
        // this.selectPoints();
      }
    }
  }

  ngAfterViewInit(): void {
    this.renderLabel();
    this.cdr.detectChanges();
  }

  /**
   * @description This function renders the label reference in the html
   * @returns void
   */
  renderLabel(): void {
    if (this.mode) {
      this.renderer.setAttribute(
        this.myContent.nativeElement,
        'for',
        this.inputName + '-' + this.optData.value + '-match'
      );
      console.log('Opt Data', this.optData);

      this.renderer.setProperty(
        this.myContent.nativeElement,
        'innerHTML',
        this.optData.label
      );

      this.defaultHtml = this.myContent.nativeElement;
      this.defaultHtml = this.defaultHtml.outerHTML;
    } else {
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', this.optData.label);
      this.defaultHtml = div.outerHTML;

      this.onContainerClick();
    }
  }

  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick(): void {
    if (!this.mode) {
      this.editorState = true;
      this.loadQuill();
    }
  }

  /**
   * @description This function loads the quill component with @Input & @Output
   * @returns void
   */
  async loadQuill() {
    if (!this.quillLoaded) {
      this.comp = await this.sharedComponentService.loadDynamicEditorModule(
        'quillLoader',
        this.quillContainer
      );
      if (this.comp instanceof ComponentRef) {
        this.quillLoaded = true;
        console.log(
          'quillConfig',
          `${this.inputName}-${this.optData.value}-mcq`
        );

        this.comp.instance.quillConfig = {
          name: `${this.inputName}-${this.optData.value}-mcq`,
          placeholder: this.optData.placeholder,
          quillLoc: 'opt'
        };
        this.comp.instance.quillHtmlData = this.defaultHtml;
        // this.comp.instance.preview = this.mode;
        this.comp.instance.getUpdatedContent.subscribe(data => {
          this.optData.label = data;
          if (this.mode) {
            this.renderer.setProperty(
              this.myContent.nativeElement,
              'innerHTML',
              this.optData.label
            );
            this.defaultHtml = this.myContent.nativeElement;
            this.defaultHtml = this.defaultHtml.outerHTML;
          }

          this.onContentUpdate.emit(this.optData);
        });

        if (this.comp.instance.getImageTag)
          this.comp.instance.getImageTag.subscribe(image => {
            console.log(image);
          });
      }
    }
  }

  /**
   * @description This function returns a particular class to the html
   * @returns string;
   */
  getOptionClass(): string {
    let value = 'original';
    if ((this.stemLength && this.index < this.stemLength) || !this.stemLength) {
      if (this.showCorrectAnswer) {
        if (this.selectPoints()) {
          value = 'correct';
        } else {
          value = 'incorrect';
        }
      } else {
        value = 'original';
      }
    } else {
      value = 'original';
    }

    return value;
  }

  // returnClass(value) {
  //   if (this.showCorrectAnswer) {
  //     if (this.selectPoints()) {
  //       value = 'correct';
  //     } else {
  //       value = 'incorrect';
  //     }
  //   } else {
  //     // if (this.selectPoints()) {
  //     //   value = 'correct';
  //     // } else {
  //     value = 'original';
  //     // }
  //   }
  // }

  ngOnDestroy() {}
}
