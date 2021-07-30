import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { TemplateMcqOption } from '../../../../core/interface/quiz-player-template.interface';
import { SharedComponentService } from '@tce/quiz-templates';
import { QuestionEditorService } from '@tce/template-editor';

@Component({
  selector: 'dc-opt',
  templateUrl: './opt.component.html',
  styleUrls: ['./opt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OptComponent implements OnInit, AfterViewInit {
  @Input() public optData: any;
  @Input() public selectedAnswersPreviewData: Array<string>;
  @Input() public previewState: boolean;
  @Input() public showAnsState: object;
  @Input() public submitAnsShow: boolean;
  @Input() public inputType: string;
  @Input() public inputName: string;
  @Input() public optValue: Array<string>;
  @Input() public labels: Array<string>;
  @Input() templateType: string;
  @Input() public editOptMode: number;
  @Input() public optIndex: number;
  @ViewChild('myContent', { static: false }) public myContent: ElementRef;
  @ViewChild('myContentEdit', { static: true })
  public myContentEdit: ElementRef;
  @ViewChild('opt', { static: true }) public optElement: ElementRef;
  @ViewChild('optHorizontal', { static: true })
  public optElementHorizontal: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  @Output() onContentUpdate = new EventEmitter();
  @Output() onSelectedAnswersPreview = new EventEmitter();
  public selectedAns;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = false;
  public comp: ComponentRef<any>;
  public correctAnswer: Array<string>;
  public showCorrectAnswer: boolean = false;
  public radioCheck: boolean = false;
  @Input() public multipleQuestionToolbarOption: boolean = false;
  @Input() public randomIndex: number;
  public randomNumber: number;
  public variable: string =
    '<variable class="badge badge-warning" data-marker="Response" data-title="Response">﻿<span contenteditable="false">VARIABLE</span>﻿</variable>';
  // public creatingOption: boolean = false;

  @Input() public layout: string;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService
  ) {}

  ngOnInit() {
    this.mode = this.previewState;
    console.log('optData ', this.inputName, 'sdad', this.optData, this.layout);
  }

  editOption(index) {
    if (this.templateType !== 'mcq-tf') {
      this.questionEditorService.updateOptionsEditMode(index);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedAnswersPreviewData) {
      this.selectedAnswersPreviewData =
        changes.selectedAnswersPreviewData.currentValue;
    }
    // console.log(
    //   'Changes',
    //   changes,
    //   this.optData,
    //   this.optValue,
    //   this.showAnsState
    // );

    if (changes.randomIndex) {
      this.randomNumber = changes.randomIndex.currentValue;
    }
    // console.log("Random Index on change", this.randomIndex)
  }

  ngAfterViewInit(): void {
    this.randomNumber = this.randomIndex;
    //console.log('ViewInit in OPT ', this.previewState);

    this.showCorrectAnswer = this.showAnsState['state'];
    this.correctAnswer = this.showAnsState['selectedAnswers'];
    this.renderLabel();
    this.setValueCheckUncheck();
    this.cdr.detectChanges();
    // console.log(
    //   'in OPT ',
    //   this.showAnsState,
    //   this.showCorrectAnswer,
    //   this.correctAnswer
    // );
  }

  setValueCheckUncheck() {
    if (this.optData.value == this.optValue[0] && !this.mode) {
      if (this.layout === 'horizontal') {
        this.renderer.setProperty(
          this.optElementHorizontal.nativeElement,
          'checked',
          'true'
        );
      } else {
        this.renderer.setProperty(
          this.optElement.nativeElement,
          'checked',
          'true'
        );
      }
    }
  }

  /**
   * @description This function renders the label reference in the html
   * @returns void
   */
  renderLabel(): void {
    if (this.mode) {
      var optLabel = this.optData.label;
      this.renderer.setAttribute(
        this.myContent.nativeElement,
        'for',
        this.inputName + '-' + this.optData.value + '-mcq'
      );

      if (this.multipleQuestionToolbarOption) {
        // console.log("Random number", this.randomIndex, this.randomNumber)
        if (this.optData.label) {
          optLabel = this.optData.label.replace(
            '{{response}}',
            this.optData.response[this.randomNumber]
          );
        }
      }
      // else {
      //   optLabel = this.optData.label;
      // }

      this.renderer.setProperty(
        this.myContent.nativeElement,
        'innerHTML',
        optLabel
      );

      this.defaultHtml = this.myContent.nativeElement;
      this.defaultHtml = this.defaultHtml.outerHTML;
    } else {
      //console.log('Option label', this.optData);
      if (this.multipleQuestionToolbarOption) {
        if (this.optData.label) {
          this.optData.label = this.optData.label.replace(
            '{{response}}',
            this.variable
          );
        }
      }
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', this.optData.label);
      this.defaultHtml = div.outerHTML;

      this.onContainerClick();
    }
  }

  /**
   * @description Function to get the checked status for that particular option
   * @param optData Type = string
   */
  getInputStatus(optData) {
    if (this.mode && !this.selectedAnswersPreviewData) {
      return false;
    } else {
      if (this.selectedAnswersPreviewData) {
        return this.checkValue(this.selectedAnswersPreviewData, optData);
      } else {
        // console.log("Value Check", this.optValue, optData)
        return this.checkValue(this.optValue, optData);
      }
    }
  }

  /**
   * @description This function checks for the value in the array and returns true or false accordingly
   * @param dataArray Type = Array<string>
   * @param optData Type = string
   * @returns void
   */
  checkValue(dataArray: Array<string>, optData: string): boolean {
    let status = 0;
    if (!this.mode) {
      dataArray.forEach(opt => {
        if (optData === opt) {
          status = 1;
        }
      });
    }

    if (status == 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick(): void {
    // console.log("Render Label", this.optData, this.mode)

    if (!this.mode) {
      this.editorState = true;
      // this.prevDataEmit.emit(this.optData)

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
        this.comp.instance.quillConfig = {
          name: `${this.inputName}-${this.optData.value}-mcq`,
          placeholder: this.optData.placeholder,
          quillLoc: 'opt'
        };
        this.comp.instance.quillHtmlData = this.defaultHtml;
        this.comp.instance.templateType = this.templateType;

        if (this.multipleQuestionToolbarOption) {
          this.comp.instance.multipleQuestionToolbarOption = this.multipleQuestionToolbarOption;
        }
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
            // console.log(image);
          });
      }
    }
  }

  /**
   * @description This function emits the event value retrieved from the html to the parent component
   * @param event Type = Event
   * @returns void
   */
  getSelectedAnswers(event): void {
    if (!this.showCorrectAnswer) {
      this.selectedAns = event.target.value[0];
      // console.log(
      //   'Selected ans',
      //   this.optValue,
      //   this.optData,
      //   this.previewState
      // );

      this.onSelectedAnswersPreview.emit({
        selectedAnswer: this.selectedAns,
        state: this.mode,
        checked: event.target.checked
      });
      this.setValueCheckUncheck();
    }
  }

  /**
   * @description This function returns a particular class to the html
   * @returns string;
   */
  getOptionClass(): string {
    var check = 0;
    let value;
    // if (this.correctAnswer) {
    this.correctAnswer.forEach(ans => {
      if (ans == this.optData.value) {
        check += 1;
      }
    });
    // }
    // console.log('getOPtionClass ', this.optData, this.showAnsState);
    if (this.layout !== 'horizontal') {
      if (this.optElement.nativeElement.checked && this.submitAnsShow) {
        if (check > 0) {
          value = 'correct';
        } else {
          value = 'incorrect';
        }
      }
    } else if (
      this.optElementHorizontal.nativeElement.checked &&
      this.submitAnsShow
    ) {
      if (check > 0) {
        value = 'correct';
      } else {
        value = 'incorrect';
      }
    } else {
      if (check > 0 && this.submitAnsShow) {
        value = 'correct';
      }
    }
    //console.log('value', value);

    return value;
  }

  getRadiolabelClass() {
    // if(!this.showCorrectAnswer || !this.mode || (!this.opt.checked && this.mode))
    // console.log(this.optElement);
  }

  ngOnDestroy() {}
}
