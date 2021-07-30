import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  Renderer2,
  ComponentRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateMcqStem } from '../../../../core/interface/quiz-player-template.interface';
import { SharedComponentService } from '@tce/quiz-templates';
import { QuestionEditorService } from '@tce/template-editor';

@Component({
  selector: 'dc-qstem',
  templateUrl: './qstem.component.html',
  styleUrls: ['./qstem.component.scss']
})
export class QstemComponent implements OnInit, AfterViewInit {
  @Input() public qstem: TemplateMcqStem;
  @Input() public stemName: string;
  @Input() public previewState: boolean = false;
  @Input() public templateType: string;
  @Input() public templateMode: string;
  @Input() public formattingOptions: Array<string>;
  @Input() public multipleQuestionToolbarOption: boolean = false;
  public mode: boolean = false;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public comp: ComponentRef<any>;
  public qstemImage: string;
  public openImgSizes: boolean = false;

  @ViewChild('myContent', { static: false }) public myContent: ElementRef;
  @Output() onQstemContentUpdate = new EventEmitter();

  @Input() public qstemResponse: Array<Array<string>>;
  @Input() public randomIndex: number;
  public randomNumber: number;
  public variable: string =
    '<variable class="badge badge-warning" data-marker="Response" data-title="Response">﻿<span contenteditable="false">VARIABLE</span>﻿</variable>';
  // @Output() getUpdatedImageContent = new EventEmitter();
  @ViewChild('qstemImgRef', { static: false })
  public qstemImgRef: ElementRef;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private cdr: ChangeDetectorRef,
    private questionEditorService: QuestionEditorService
  ) {}

  ngOnInit() {
    this.mode = this.previewState;
    console.log('stem', this.qstem);
    if (this.qstem['image']) {
      this.qstemImage = this.qstem['imageUrl'] + this.qstem['image'];
    }
  }

  ngAfterViewInit(): void {
    this.renderLabel();
    this.onContainerClick();
  }

  /**
   * @description This function renders the label reference in the html
   * @returns void
   */
  renderLabel() {
    if (this.mode) {
      let qstemLabel = this.qstem.text;
      if (this.multipleQuestionToolbarOption) {
        // let matchArray = this.qstem.text && this.qstem.text.match(/{{response}}/g) || [];
        // for (let i = 0; i < this.qstemResponse.length; i++) {

        this.qstemResponse.forEach(qstemRes => {
          //console.log('Qstem Variable', qstemRes[this.randomNumber]);
          // prompt('',this.qstem.text)
          if (qstemLabel) {
            qstemLabel = qstemLabel.replace(
              '{{response}}',
              qstemRes[this.randomNumber]
            );
          }
          // qstemLabel = this.qstem.text.split('{{response}}').join(this.qstemResponse[i][this.randomNumber])
          //console.log('Qstem replaced', qstemLabel);
        });
      }

      //  else {
      if (this.myContent) {
        this.renderer.setProperty(
          this.myContent.nativeElement,
          'innerHTML',
          qstemLabel
        );
      }
      // }
      // console.log(
      //   'Qstem',
      //   this.qstem,
      //   this.qstemResponse,
      //   this.randomNumber,
      //   qstemLabel
      // );
      this.defaultHtml = this.myContent.nativeElement;
      this.defaultHtml = this.defaultHtml.outerHTML;
    } else {
      let qstemLabel = this.qstem.text;

      if (this.qstemResponse) {
        this.qstemResponse.forEach(qstemRes => {
          if (qstemLabel) {
            qstemLabel = qstemLabel.replace('{{response}}', this.variable);
          }
        });
      }
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', qstemLabel);
      this.defaultHtml = div.outerHTML;
      // prompt('ggg', this.qstem.text)
      //console.log('Edit Mode', this.defaultHtml);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('qstem onchange ', changes);

    // if (changes.qstem) {
    //   if (
    //     changes.qstem.previousValue &&
    //     changes.qstem.previousValue.text !== changes.qstem.currentValue.text
    //   ) {
    //     //console.log('Changes', changes);
    //     this.qstem.value = changes.qstem.currentValue.value;
    //     this.quillLoaded = false;
    //     if (this.quillContainer) this.quillContainer.clear();

    //     this.renderLabel();
    //     this.onContainerClick();
    //   }
    // }

    if (changes.randomIndex) {
      this.randomNumber = changes.randomIndex.currentValue;
    }
  }

  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick() {
    //console.log('MODE: ', this.mode, this.quillLoaded);
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
    // if (!this.quillLoaded) {
    this.comp = await this.sharedComponentService.loadDynamicEditorModule(
      'quillLoader',
      this.quillContainer
    );
    if (this.comp instanceof ComponentRef) {
      if (this.templateType == 'rich-text') {
        this.comp.instance.formattingOptions = this.formattingOptions;
        this.comp.instance.templateType = this.templateType;
        this.comp.instance.templateMode = this.templateMode;
      }
      this.comp.instance.templateType = this.templateType;
      if (this.multipleQuestionToolbarOption) {
        this.comp.instance.multipleQuestionToolbarOption = this.multipleQuestionToolbarOption;
      }

      this.quillLoaded = true;
      this.comp.instance.quillConfig = {
        name: this.stemName,
        placeholder: this.qstem.placeholder,
        quillLoc: 'qstem'
      };
      this.comp.instance.quillHtmlData = this.defaultHtml;

      //console.log('Load Quill', this.defaultHtml);
      this.comp.instance.getUpdatedContent.subscribe(data => {
        this.qstem.text = data;
        this.questionEditorService.updateQstem(data);

        if (this.mode) {
          this.renderer.setProperty(
            this.myContent.nativeElement,
            'innerHTML',
            data
          );
          this.defaultHtml = this.myContent.nativeElement;
          this.defaultHtml = this.defaultHtml.outerHTML;
        }

        this.onQstemContentUpdate.emit(this.qstem);
      });
    }
    // }
  }

  getImage(size) {
    this.openImgSizes = false;
    // this.templateData.data.stimulus.imgMode = size;
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
      // this.renderer.setStyle(
      //   this.qstemImgRef.nativeElement,
      //   'width',
      //   this.imgWidth * multiplier + 'px'
      // );
      // setTimeout(() => {
      //   this.calculateOptionsDivHeight();
      // }, 2000);
    }
  }
}
