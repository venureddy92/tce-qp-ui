import {
  Component,
  OnInit,
  ComponentRef,
  SimpleChanges,
  EventEmitter,
  Output,
  ViewContainerRef,
  Renderer2,
  ChangeDetectorRef,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { QuestionEditorService } from '@tce/template-editor';
import { ClassifyMatchOption } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedComponentService } from '../../../../core/services/shared-component.service';
@Component({
  selector: 'app-classify-option',
  templateUrl: './classify-option.component.html',
  styleUrls: ['./classify-option.component.scss']
})
export class ClassifyOptionComponent implements OnInit, AfterViewInit {
  @Input() public optData: ClassifyMatchOption;
  @Input() public previewState: boolean;
  @Input() public showAnsState: BehaviorSubject<object>;
  public getShowAnsState: object = {};
  public showAnsStateFlag: boolean;
  @Input() public optValue: Array<any>;
  @Input() public tempData: object;
  @Input() public type: string;
  @Input() public totalOPTData;
  // @Input() public colIndex: any;
  // @Input() public rowIndex: any;
  @Input() public previewTemplateOptionValue: Array<any>;
  @Input() public optArray: Array<ClassifyMatchOption>;
  @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @Output() onContentUpdate = new EventEmitter();
  @Output() onSelectedAnswersPreview = new EventEmitter();
  public mode: boolean;
  public showCorrectAnswer: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  public optionRowIndex: any;
  public optionColIndex: any;
  private fibDragResponse: any;

  public receivedData: any;
  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService
  ) {}
  ngOnInit() {
    console.log('optData classify ', this.optData, this.previewState);
    this.sharedComponentService.setFibDragResponse(null);
    if (!this.previewTemplateOptionValue) {
      this.previewTemplateOptionValue = [];
    }

    // if(this.tempData)
    this.mode = this.previewState;
    // this.showAnsState.subscribe((data: object) => {
    //   this.showCorrectAnswer = data['state'];
    //   // this.correctAnswer = data['selectedAnswers'];
    //   // console.log("Class opt", this.optData, this.rowIndex, this.colIndex)
    //   // this.optionColIndex = this.colIndex;
    //   // this.optionRowIndex = this.rowIndex;
    // });
    this.questionEditorService
      .getSubmitAnsShow()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.showAnsStateFlag = state;
        // console.log('showAnsStateFlag ', this.showAnsStateFlag);
      });

    this.sharedComponentService
      .getFibDragResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        // console.log('fibDragResponse sub ', response);

        this.fibDragResponse = response;
        // console.log('showAnsStateFlag ', this.showAnsStateFlag);
      });
    // this.questionEditorService.getPreviewState().subscribe(state => {
    //   if (state) {
    //     console.log('optData preview ', this.totalOPTData, this.optData);
    //     this.optData = this.optData;
    //   }
    // });
  }

  getClickStatus(): boolean {
    if (
      this.tempData &&
      this.tempData['value'] &&
      this.tempData['value'].length > 0 &&
      this.tempData['value'] == this.optData.value
    ) {
      return true;
    } else {
      return false;
    }
  }

  selectPoints(): boolean {
    let optionArray = [];
    this.optArray.forEach(async optArr => {
      optionArray.push(optArr.value);
    });
    // console.log(this.sharedComponentService.getDifferenceOfArray(optionArray,this.optValue));
    let arr1 = String(optionArray);
    let arr2 = String(this.optValue);
    if (arr1 == arr2) {
      // this.onSelectedAnswersPreview.emit(true);
      return true;
    } else {
      // this.onSelectedAnswersPreview.emit(false);
      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('optData ', this.optData);
    // if(this.mode) {
    //   if(changes.optValue) {
    //     this.correctAnswer = changes.optValue.currentValue;
    //   }
    //   this.onSelectedAnswersPreview.emit(this.selectPoints());
    // }
  }

  ngAfterViewInit(): void {
    // this.renderLabel();
    this.cdr.detectChanges();
    // console.log('optDatadata ', this.optData);
  }
  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick(value): void {
    // this.onContentUpdate.emit(value);
    // console.log('container ', value);
    this.fibDragResponse = value;
    // this.sharedComponentService.setFibDragResponse(value);
  }

  count: 0;
  /**
   * @description This function returns a particular class to the html
   * @returns string;
   */
  getOptionClass(): string {
    let value;

    // if(this.optArray.length <= this.count) {
    if (this.getClickStatus()) {
      value = 'select';
    }
    if (this.showCorrectAnswer) {
      let check = 0;
      let emptyCheck = 0;
      let existCheck = 0;

      if (this.type !== 'fib') {
        for (let rowIndex = 0; rowIndex < this.optValue.length; rowIndex++) {
          let opt = this.optValue[rowIndex];

          for (let colIndex = 0; colIndex < opt.length; colIndex++) {
            let row = opt[colIndex];

            if (row.length > 0) {
              emptyCheck = 1;
              for (let index = 0; index < row.length; index++) {
                let col = row[index];

                if (col == this.optData.value) {
                  existCheck = 1;
                  check += this.sharedComponentService.getDifferenceOfArray(
                    this.optValue[rowIndex][colIndex],
                    this.previewTemplateOptionValue[rowIndex][colIndex]
                  ).length;

                  if (check > 0) {
                    let result = this.optValue[rowIndex][colIndex].filter(opt =>
                      this.previewTemplateOptionValue[rowIndex][colIndex].some(
                        prev => opt === prev
                      )
                    );

                    result.forEach(res => {
                      if (res == this.optData.value) {
                        check = 0;
                      }
                    });
                  }
                }
              }
            }
          }
        }

        // console.log("Check options", check, emptyCheck, existCheck, this.optData)
        if (check > 0 || emptyCheck == 0 || existCheck == 0) {
          value = 'incorrect-ans';
        } else {
          value = 'correct-ans';
        }
      }
    }

    return value;
  }

  getSelected(opt) {
    // console.log('valuevalue ', opt, this.fibDragResponse);

    let value = null;
    if (this.fibDragResponse && opt.value === this.fibDragResponse.value) {
      value = 'select';
    }
    return value;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
