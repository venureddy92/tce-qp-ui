import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import {
  TemplateClassifyGroupData,
  ClassifyMatchOption
} from 'libs/quiz-player-templates/src/core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OptComponent } from 'libs/quiz-player-templates/src/sharedComponents/opt/opt.component';
import { SharedComponentService } from 'libs/quiz-player-templates/src/sharedComponents/core/services/shared-component.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-classify-group-layout',
  templateUrl: './classify-group-layout.component.html',
  styleUrls: ['./classify-group-layout.component.scss']
})
export class ClassifyGroupLayoutComponent implements OnInit {
  @Input() public templateData: TemplateClassifyGroupData;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
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

  public answers: ClassifyMatchOption[] = [];

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
  public opts: ClassifyMatchOption[] = [];
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

  public rows: Array<string> = [];
  public columns: Array<string> = [];
  public templateOptionValue: Array<Array<string>>;
  public previewTemplateOptionValue: Array<any> = [];
  public tempData: object = { value: '' };
  public optsPreview: ClassifyMatchOption[] = [];
  public optsEdit: ClassifyMatchOption[] = [];
  public optionValue: Array<any> = [];
  public clickComponentStatus: boolean = true;
  public clickOptionStatus: boolean = true;
  public templateName: string;

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
        this.previewTemplateOptionValue = [];
        this.optionValue.forEach(optVal => {
          let arr = [];
          optVal.forEach(opt => {
            arr.push([]);
          });
          this.previewTemplateOptionValue.push(arr);
        });

        this.optsPreview = this.templateData.data.options;
      } else {
        this.showAnsStateFlag = false;
        this.showAnsState.next(false);
        console.log('source data 1', this.sourceData, this.templateData);
      }
    });

    this.sourceSubscription = this.sourceState.subscribe(state => {
      this.sourceModalOpen.next(state);
    });

    this.showAnsSubscription = this.showAnsState.subscribe(state => {
      this.showAnsStateFlag = state;
      this.emitAns();
    });

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

    if (this.optsEdit.length == 0) {
      this.optsEdit = this.optsPreview = [...this.templateData.data.options];
    }

    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    this.points = this.templateData.data.validation.valid_response.score;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.rows = this.templateData.data.rows;
    this.columns = this.templateData.data.columns;
    this.templateOptionValue = this.templateData.data.validation.valid_response.value;
    this.templateName = this.templateData.name;
    // this.optionValue = this.templateOptionValue;

    let checkIndex = 0;
    this.templateData.data.validation.valid_response.value.forEach(
      async value => {
        if (value.length > 0) {
          checkIndex += 1;
        }
      }
    );

    let tempValueArr = [];
    tempValueArr.push([
      ...this.templateData.data.validation.valid_response.value
    ]);
    // let tempValueArr = [ this.templateData.data.validation.valid_response.value ];

    console.log('TempValue', tempValueArr, this.optionValue);
    if (checkIndex > 0) {
      // let columnArray = this.chunkArray(tempValueArr[0], this.columns.length, 'cols');

      // prompt('before', JSON.stringify(this.optionValue))
      this.optionValue = this.chunkArray(
        tempValueArr[0],
        this.columns.length,
        'cols'
      );

      console.log('Init', tempValueArr, this.optionValue);
      // this.optionValue = this.chunkArray(columnArray, this.columns.length, 'rows');
      // tempValueArr = [... this.optionValue]

      for (
        let tempValueIndex = 0;
        tempValueIndex < tempValueArr.length;
        tempValueIndex++
      ) {
        let tempArr = tempValueArr[tempValueIndex];
        console.log('1', tempArr);

        for (let tempIndex = 0; tempIndex < tempArr.length; tempIndex++) {
          let temp = tempArr[tempIndex];
          console.log('2', temp);

          for (let i = 0; i < temp.length; i++) {
            console.log('3', temp[i]);
            for (let index = 0; index < temp[i].length; index++) {
              this.optsEdit = this.optsEdit.filter(
                // optEdit => optEdit.value !== temp[i]

                optEdit => optEdit.value !== temp[i][index]
              );
            }
          }
        }
      }
    } else {
      this.createValues();
    }

    this.sourceData = this.templateData;
    console.log(
      'source data 2',
      this.sourceData,
      this.optionValue,
      this.optsEdit
    );
  }

  /**
   * Function to split an array into n number of subarrays as given in the parameters
   * @param myArray Type = Array
   * @param chunk_size Type = Number
   * @returns Array
   */
  chunkArray(myArray, chunk_size, flag) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      console.log('My Chunk', myChunk, flag);
      tempArray.push(myChunk);
      // for (let i = 0; i < myChunk.length; i++) {
      //   if(flag == 'cols') {
      //     tempArray.push(myChunk[i]);
      //   }
      //   else {
      //     tempArray.push(myChunk)
      //   }
      // }
    }

    return tempArray;
  }

  splitArr(arr2) {
    let arr1 = arr2.splice(0, Math.floor(arr2.length / 2));
    return [arr1, arr2];
  }

  /**
   * When dragged element is dropped
   * @param event contains the position of previous index and dragged index
   */
  dropped(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.opts, event.previousIndex, event.currentIndex);
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
      value: this.templateOptionValue
    };
  }

  //Output function which retrieves the points entered from the app-set-correct-ans-layout component
  getPointsValue(event: number): void {
    this.points = event;
    console.log('Called', this.templateOptionValue);
    this.changeTemplateData();
    this.changePointsValue();
  }

  changePointsValue(): void {
    this.updatePoints.next(this.points);
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateClassifyGroupData): void {
    console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.initState();
    this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    // this.optionValue = this.templateData.data.validation.valid_response.value;
    this.sharedComponentService.imageUploadModalService({});
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onContentUpdate(updatedContent: object): void {
    if (updatedContent['label']) {
      this.value = updatedContent;
      this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
      this.sharedComponentService.getImageData.next({});
    }
  }

  //Function to retrieve the updated value from the dc-opt component and update the source json
  onOptionsUpdate(updatedContent: string): void {
    this.tempData['value'] = updatedContent;
    this.clickComponentStatus = false;
  }

  //Function to push the newly added option from the app-add-options-layout template to the opts array
  pushOptions(option: ClassifyMatchOption): void {
    this.opts.push(option);
    this.optsEdit.push(option);
    this.answers.push(option);
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.sourceData = this.templateData as TemplateClassifyGroupData;
    console.log('source data 3', this.sourceData);
  }

  // Validate the form on submit
  onValidation() {}

  //Function to remove options
  removeOption(option: ClassifyMatchOption): void {
    this.value = '';
    this.opts = this.opts.filter(
      (options: ClassifyMatchOption) => options.value !== option.value
    );
    this.optsEdit = this.optsEdit.filter(
      (options: ClassifyMatchOption) => options.value !== option.value
    );
    this.optsPreview = this.optsPreview.filter(
      (options: ClassifyMatchOption) => options.value !== option.value
    );
    this.answers = this.answers.filter(
      (answer: ClassifyMatchOption) => answer.value !== option.value
    );

    for (let rowIndex = 0; rowIndex < this.optionValue.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < this.optionValue[rowIndex].length;
        colIndex++
      ) {
        for (let i = 0; i < this.optionValue[rowIndex][colIndex].length; i++) {
          let value = this.optionValue[rowIndex][colIndex][i];
          this.optsEdit = this.optsEdit.filter(item => item.value !== value);
          if (value == option.value) {
            this.optionValue[rowIndex][colIndex] = this.optionValue[rowIndex][
              colIndex
            ].filter(item => item !== value);
          }
        }
      }
    }

    this.templateData.data.validation.valid_response.value = this.optionValue;
    this.templateOptionValue = this.optionValue;

    this.sharedComponentService.imageModalOpen.next({});
    this.sharedComponentService.getImageData.next({});
    this.templateData.data.options = this.opts as Array<ClassifyMatchOption>;
    this.sourceData = this.templateData;
    console.log(
      'Options Value',
      this.optionValue,
      this.templateData,
      this.templateOptionValue,
      this.optsEdit
    );
    // prompt('init 2', JSON.stringify(this.optionValue));

    console.log('source data 4', this.sourceData);
  }

  //Function to get updated content from the dc-qstem
  onQstemContentUpdate(updatedContent): void {
    this.templateData.data.stimulus.label = updatedContent.text;
    this.initState();
  }

  saveData(): void {
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

  onSelectedAnswersPreview(event): void {
    let correctAnsPoints = 0;
    if (event) {
      correctAnsPoints = this.points;
    } else {
      correctAnsPoints = 0;
    }

    this.showAnswers.emit({
      points: this.points,
      selectedAnswersPreview: this.selectedAnswersPreview,
      correctAnsPoints: correctAnsPoints
    });
  }

  /**
   * @description This function add new row to the rows array
   * @returns void
   */
  addRows(): void {
    this.rows.push('');
    let row = [];
    this.columns.forEach(cols => {
      row.push([]);
    });

    this.optionValue.push(row);
    console.log('Add rows', this.optionValue);
    this.updateTemplateValue();
  }

  /**
   * @description This function removes row from the rows array
   * @returns void
   */
  removeRows(rowIndex: number): void {
    this.optionValue[rowIndex].forEach(option => {
      option.forEach(opt => {
        this.optsEdit.push(this.getOpts(opt));
      });
    });

    // this.optionValue.forEach(option => {
    //   option.splice(rowIndex, 1);
    // });

    this.optionValue = this.optionValue.filter(
      (option, index) => rowIndex !== index
    );

    console.log(
      'Row Index',
      rowIndex,
      this.optionValue,
      this.optionValue[rowIndex]
    );

    this.rows.splice(rowIndex, 1);
    this.updateTemplateValue();
  }

  /**
   * @description This function add new column to the columns array
   * @returns void
   */
  addCols(): void {
    this.columns.push('');

    this.optionValue.forEach(optionVal => {
      optionVal.push([]);
    });

    this.updateTemplateValue();
  }

  /**
   * @description This function updates the value in the source data
   * @returns void
   */
  updateTemplateValue(): void {
    this.templateData.data.validation.valid_response.value = [];
    this.optionValue.forEach(options => {
      options.forEach(opt => {
        this.templateData.data.validation.valid_response.value.push(opt);
      });
    });

    this.templateOptionValue = this.templateData.data.validation.valid_response.value;

    this.sourceData = this.templateData as TemplateClassifyGroupData;
    console.log('source data 5', this.sourceData);
  }

  /**
   * @description This function removes column from the columns array
   * @returns void
   */
  removeCols(colIndex: number): void {
    this.optionValue.forEach(option => {
      if (option[colIndex].length > 0) {
        this.optsEdit.push(this.getOpts(option[colIndex]));
      }
      option.splice(colIndex, 1);
    });

    this.columns.splice(colIndex, 1);

    this.updateTemplateValue();
  }

  clickOpt(opt: object): void {
    console.log('Temp Value', opt);
    this.tempData['value'] = opt;
    this.clickComponentStatus = false;
  }

  clickComp(row, col): void {
    // console.log("Temp data", this.tempData['value'])
    if (this.clickComponentStatus) {
      this.templateData.data.validation.valid_response.value = [];
      this.clickOptionStatus = true;

      if (this.tempData['value'].length > 0) {
        if (this.previewShow) {
          this.previewTemplateOptionValue.forEach((option, optValIndex) => {
            option.forEach((opts, optIndex) => {
              // if (opts == this.tempData['value']) {
              // this.previewTemplateOptionValue[optValIndex][optIndex] = [];
              // }
              this.previewTemplateOptionValue[optValIndex][
                optIndex
              ] = this.previewTemplateOptionValue[optValIndex][optIndex].filter(
                opt => opt !== this.tempData['value']
              );
            });
          });
          this.previewTemplateOptionValue[row][col].push(
            this.tempData['value']
          );
          this.optsPreview = this.optsPreview.filter(
            (opts: ClassifyMatchOption) => opts.value !== this.tempData['value']
          );
          this.tempData['value'] = '';

          this.emitCorrectAnswer();
        } else {
          this.optionValue.forEach((option, optValIndex) => {
            // console.log("opt val", option)
            option.forEach((opts, optIndex) => {
              // opts.forEach(opt => {
              // if (opt == this.tempData['value']) {
              // console.log("opt values", opt, this.tempData['value'], optValIndex, optIndex, this.optionValue[optValIndex][optIndex])

              // this.optionValue[optValIndex][optIndex].forEach(optionValue=>{
              //   if (optionValue == this.tempData['value']) {

              //   }
              // })
              this.optionValue[optValIndex][optIndex] = this.optionValue[
                optValIndex
              ][optIndex].filter(opt => opt !== this.tempData['value']);
              console.log('Option value', this.optionValue);

              // this.optionValue[optValIndex][optIndex] = [];
              // }
              // });

              // this.templateData.data.validation.valid_response.value = this.optionValue[optValIndex][optIndex];
            });
          });
          this.optionValue[row][col].push(this.tempData['value']);

          this.optsEdit = this.optsEdit.filter(
            (opts: ClassifyMatchOption) => opts.value !== this.tempData['value']
          );
          this.tempData['value'] = '';
          this.templateData.data.validation.valid_response.value = [];
          this.optionValue.forEach(optionValue => {
            optionValue.forEach(option => {
              this.templateData.data.validation.valid_response.value.push(
                option
              );
            });
          });
          this.templateOptionValue = this.templateData.data.validation.valid_response.value;
          this.sourceData = this.templateData as TemplateClassifyGroupData;
          console.log('source data 6', this.sourceData);
        }

        // this.templateData.data.validation.valid_response.value = [];
      }
    }
  }

  emitCorrectAnswer(): void {
    let previewOptionArray = [];
    console.log(
      'Correct answer check',
      this.previewTemplateOptionValue,
      this.optionValue
    );
    this.previewTemplateOptionValue.forEach(prevTemp => {
      prevTemp.forEach(prev => {
        previewOptionArray.push(prev);
      });
    });

    this.correctAnsPoints = 0;
    let check = 0;
    let emptyCheck = 0;

    this.optionValue.forEach((optval, index) => {
      optval.forEach((opt, rowIndex) => {
        console.log(
          'Check array',
          this.optionValue[index][rowIndex],
          this.previewTemplateOptionValue[index][rowIndex],
          opt
        );
        if (opt.length > 0) {
          emptyCheck = 1;
          opt.forEach((col, colIndex) => {
            // console.log("Check array", this.optionValue[index][rowIndex], this.previewTemplateOptionValue[index][rowIndex])
            check += this.sharedComponentService.getDifferenceOfArray(
              this.optionValue[index][rowIndex],
              this.previewTemplateOptionValue[index][rowIndex]
            ).length;
          });
        }
      });
    });

    console.log('Check points', check, emptyCheck);
    if (check == 0 && emptyCheck > 0) {
      this.correctAnsPoints = this.points;
    } else {
      this.correctAnsPoints = 0;
    }

    this.showAnswers.emit({
      points: this.points,
      correctAnsPoints: this.correctAnsPoints
    });
  }

  clickOptionRow(): void {
    if (this.clickComponentStatus) {
      this.opts.forEach(opt => {
        if (this.tempData['value'] == opt.value) {
          if (this.previewShow) {
            // this.optsPreview.push(opt);
            // this.optsPreview.forEach(optPrev=>{
            //   if(optPrev.value == opt.value) {
            //     this.optsPreview.push(opt);
            //   }
            // })
            let optVal: any = this.optsPreview.filter(
              optVal => optVal.value == opt.value
            );
            // this.optsPreview.forEach(optEdit=>{
            if (optVal.length == 0) {
              this.optsPreview.push(opt);
            }
            this.previewTemplateOptionValue.forEach((option, optValIndex) => {
              option.forEach((opts, optIndex) => {
                opts.forEach(optElement => {
                  if (optElement == this.tempData['value']) {
                    this.previewTemplateOptionValue[optValIndex][
                      optIndex
                    ] = this.previewTemplateOptionValue[optValIndex][
                      optIndex
                    ].filter(opts => opts !== this.tempData['value']);
                  }
                });
              });
            });

            this.emitCorrectAnswer();
          } else {
            let optVal: any = this.optsEdit.filter(
              optVal => optVal.value == opt.value
            );
            console.log('OptVal', optVal);
            // this.optsEdit.forEach(optEdit=>{
            if (optVal.length == 0) {
              this.optsEdit.push(opt);
            }
            // })

            this.optionValue.forEach((option, optValIndex) => {
              option.forEach((opts, optIndex) => {
                opts.forEach(optElement => {
                  if (optElement == this.tempData['value']) {
                    this.optionValue[optValIndex][optIndex] = this.optionValue[
                      optValIndex
                    ][optIndex].filter(opts => opts !== this.tempData['value']);
                  }
                });
              });
            });
          }
          this.tempData['value'] = '';
        }
      });
    }
  }

  createValues(): void {
    this.optionValue = [];
    this.templateData.data.validation.valid_response.value = [];
    this.rows.forEach(async row => {
      let column = [];

      this.columns.forEach(async cols => {
        column.push([]);
        this.templateData.data.validation.valid_response.value.push([]);
      });
      this.optionValue.push(column);
    });
    this.templateOptionValue = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData as TemplateClassifyGroupData;
    console.log('source data 7', this.sourceData);
  }

  getOpts(option): ClassifyMatchOption {
    let options;
    this.opts.forEach(opt => {
      if (opt.value == option) {
        options = opt;
      }
    });

    return options;
  }

  onRowColUpdate(flag, data, index): void {
    if (flag == 'row') {
      this.rows[index] = data;
      this.templateData.data.rows = this.rows;
    } else {
      this.columns[index] = data;
      this.templateData.data.columns = this.columns;
    }
    console.log('Row col Update', flag, data, index, this.rows);

    this.sourceData = this.templateData as TemplateClassifyGroupData;
    console.log('source data 8', this.sourceData);
  }

  trackByFn(index: any, item: any) {
    return index;
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
