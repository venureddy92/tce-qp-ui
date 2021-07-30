import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedComponentService } from '@tce/quiz-templates';
import Quill from 'quill';

declare const openEditor: any;
declare const closeEditor: any;

import ImageResize from 'quill-image-resize';
import { TemplateMarker } from '../../template-maker.class';
import { QuestionEditorService } from '@tce/template-editor';
import { read } from 'fs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Code for response tag start

let customeIcons = Quill.import('ui/icons');
customeIcons['addResponseTag'] =
  '<i class="fa fa-reply" style="color:lightgrey" title="Single Response" aria-hidden="true"></i>';
customeIcons['addMultipleResponseTag'] =
  '<i class="fa fa-reply-all" style="color:lightgrey" title="Multiple Questions" aria-hidden="true"></i>';
customeIcons['math'] =
  '<i class="fa fa-superpowers" style="color:lightgrey" title="Math Calculator" aria-hidden="true"></i>';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'quiz-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss']
})
export class QuillEditorComponent implements OnInit, OnDestroy {
  @Input() public quillConfig;
  @Input() public quillHtmlData;
  @Input() public allowResponseTag: boolean;
  @Input() public formattingOptions: Array<string>;
  @Input() public templateType: string;
  @Input() public templateMode: string;
  @Input() public multipleQuestionToolbarOption: boolean;
  @Input() private possibleResponses: any;

  @Output() getUpdatedContent = new EventEmitter();
  @Output() getQuillUpdated = new EventEmitter();
  @Output() getUpdatedContentFocus = new EventEmitter();
  @Output() getIndex = new EventEmitter();
  @Output() addTag = new EventEmitter();
  @Output() deleteTag = new EventEmitter();
  public quillTools: any;
  public updateQuillData: any;
  public focus: boolean = false;
  public readOnly: boolean = false;
  public responses: Object = {};
  public responseIds: Array<any> = [];
  private newResFlag: boolean = false;
  private highlightedTexts: Array<object>;
  private highlightedTextsIds: Array<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public modules: any;

  quillInstance: any;

  rangeIndex: number;

  showEditor = false;
  activeObj;

  public selectedModules = {
    toolbar: {
      // container: [this.formattingOptions]
    }
  };

  constructor(
    public renderer: Renderer2,
    public sanitizer: DomSanitizer,
    public sharedComponentService: SharedComponentService,
    private readonly questionEditorService: QuestionEditorService,
    private elm: ElementRef,
    public cdr: ChangeDetectorRef
  ) {
    this.modules = {
      imageResize: {
        displaySize: true
      },
      toolbar: false,
      clipboard: true
      //kept for future references
      // {
      //   container: [
      //     [{ placeholder: ['[GuestName]', '[HotelName]'] }], // my custom dropdown
      //     ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      //     ['blockquote', 'code-block'],
      //     [{ header: 1 }, { header: 2 }], // custom button values
      //     [{ list: 'ordered' }, { list: 'bullet' }],
      //     [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      //     [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      //     [{ direction: 'rtl' }], // text direction
      //     [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      //     [{ font: [] }],
      //     [{ align: [] }],
      //     ['link', 'image', 'math'],
      //     ['clean'] // remove formatting button
      //   ],
      //   handlers: {
      //     /**
      //      * @description
      //      * This function handles the function on image button click in the quill toolbar
      //      * @returns void
      //      */
      //     image: () => {
      //       console.log('Image Modal Quill', this.quillConfig);
      //       // this.imageModalOpen.emit({type: 'editor', state:true});

      //       this.sharedComponentService.imageUploadModalService({
      //         type: 'editor',
      //         state: true,
      //         name: this.quillConfig.name
      //       });
      //     },
      //     math: e => {
      //       console.log(e);
      //       this.activeObj = {
      //         elem: e
      //       };
      //       this.showEditor = true;
      //     },
      //     addResponseTag: e => {
      //       this.addResponseTag('RESPONSE');
      //     },
      //     addMultipleResponseTag: e => {
      //       this.addResponseTag('VARIABLE');
      //     }
      //   }
      // }
    };
  }

  ngOnInit() {
    //console.log('instance loaded');

    this.questionEditorService.getInstance().subscribe(instance => {
      //console.log('instance ', instance);
    });
    if (
      this.templateType === 'fib-text' ||
      this.templateType === 'fib-dropdown' ||
      this.templateType === 'fib-drag-drop'
    ) {
      this.questionEditorService
        .getResponses()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.responses = res;
        });
      this.questionEditorService
        .getResponseIds()
        .pipe(takeUntil(this.destroy$))
        .subscribe(ids => {
          this.responseIds = ids;
        });
      setTimeout(() => {
        this.addUids();
      });

      if (
        this.quillConfig.name === 'fib-text' ||
        this.quillConfig.name === 'fib-dropdown' ||
        this.quillConfig.name === 'fib-drag-drop'
      ) {
        this.modules = {
          imageResize: {
            displaySize: true
          },
          toolbar: false,
          clipboard: true,
          keyboard: {
            bindings: {
              tab: {
                key: 9,
                handler: function() {
                  // do nothing
                }
              },
              'remove tab': {
                key: 9,
                shiftKey: true,
                collapsed: true,
                prefix: /\t$/,
                handler: function() {
                  // do nothing
                }
              }
            }
          }
        };
      }
    }

    if (this.templateType === 'token-highlight') {
      this.questionEditorService
        .getHighlightedTexts()
        .pipe(takeUntil(this.destroy$))
        .subscribe(texts => {
          this.highlightedTexts = texts;
        });

      this.questionEditorService
        .getHighlightedTextsIds()
        .pipe(takeUntil(this.destroy$))
        .subscribe(ids => {
          this.highlightedTextsIds = ids;
        });
      setTimeout(() => {
        this.addHighlightTextsId();
      });
    }

    //console.log('tempType ', this.templateType);

    this.questionEditorService.getNewResponseFlag().subscribe(flag => {
      this.newResFlag = flag;
    });

    if (this.templateType === 'mcq-tf') this.readOnly = true;
    //kept for future reference

    // if (this.templateType == 'rich-text') {
    //   this.quillTools = [this.formattingOptions];
    //   this.modules.toolbar.container = this.quillTools;
    // } else {
    // this.quillTools = [
    //   [{ placeholder: ['[GuestName]', '[HotelName]'] }], // my custom dropdown
    //   ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    //   ['blockquote', 'code-block'],
    //   [{ header: 1 }, { header: 2 }], // custom button values
    //   [{ list: 'ordered' }, { list: 'bullet' }],
    //   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    //   [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    //   [{ direction: 'rtl' }], // text direction
    //   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    //   [{ font: [] }],
    //   [{ align: [] }],
    //   ['link', 'image', 'math'],
    //   ['clean'] // remove formatting button
    // ];
    // this.modules.toolbar.container = this.quillTools;
    // }

    // check if response tag is allowed -- rohit
    // kept for future reference -- usman

    // if (this.allowResponseTag) {
    //   this.modules.toolbar.container['10'].push('addResponseTag');
    //   TemplateMarker.tagName = 'RESPONSE';
    // }

    // if (this.multipleQuestionToolbarOption) {
    //   this.modules.toolbar.container['10'].push('addMultipleResponseTag');
    //   TemplateMarker.tagName = 'VARIABLE';
    // }

    TemplateMarker.blotName = 'TemplateMarker';
    Quill.register({
      'formats/TemplateMarker': TemplateMarker
    });

    // this.sharedComponentService.getImageData.subscribe(imageData => {
    //   if (
    //     imageData['componentType'] == 'editor' &&
    //     imageData['name'] == this.quillConfig.name
    //   ) {
    //     let image = this.renderer.createElement('img');
    //     this.renderer.setAttribute(image, 'src', imageData['imageUrl']);
    //     if (!this.quillHtmlData) this.quillHtmlData = '';
    //     this.quillHtmlData += image.outerHTML;
    //   }
    // });
  }

  addUids() {
    console.log(
      'uuids',
      this.responses,
      this.responseIds,
      this.elm.nativeElement.querySelectorAll('code')
    );
    // let typeName = this.quillConfig.name;
    let elementRef: any;
    // if (this.quillConfig.name === 'fib-text') {
    elementRef = this.elm.nativeElement.querySelectorAll('code');
    // }
    // else if (this.quillConfig.name === 'fib-dropdown') {
    //   elementRef = this.elm.nativeElement.querySelectorAll('response');
    //   console.log('elementRef ', elementRef);
    // }
    for (let i = 0; i < elementRef.length; i++) {
      let uid: any;
      let choice: any;
      if (this.responseIds[i]) {
        uid = this.responseIds[i];
      } else {
        uid = Math.floor(100000 + Math.random() * 900000);
        this.responseIds.push(uid);
        this.questionEditorService.setNewResponseId(uid);
        console.log('idsidsids ', uid, this.responseIds);
      }
      this.renderer.setAttribute(elementRef[i], 'id', uid);
      // if (this.quillConfig.name === 'fib-text')
      //   this.renderer.setAttribute(elementRef[i], 'contenteditable', 'true');
      // else
      // this.renderer.setAttribute(elementRef[i], 'contenteditable', 'false');
      if (this.quillConfig.name === 'fib-text') {
        this.responses[uid] = [];
        this.responses[uid].push(elementRef[i].innerText);
      } else {
        console.log('idsids', this.responses[uid]);

        this.renderer.setAttribute(elementRef[i], 'contenteditable', 'false');
        if (this.responses[uid]) {
          choice = this.responses[uid];
        } else {
          // if(this.quillConfig.name === 'fib-dropdown'){
          if (this.quillConfig.name === 'fib-dropdown') {
            let label: string;
            let value: string;
            if (this.possibleResponses[i]) {
              this.possibleResponses.forEach(response => {
                response.forEach(res => {
                  res['uid'] = uid;
                });
              });
              choice = this.possibleResponses[i];
              console.log('idsids ', this.possibleResponses);
            } else {
              choice = [{ parentId: uid, label: '', value: '0' }];
            }
          } else {
            choice = [];
          }
        }
        this.responses[uid] = choice;
        // this.addTag.emit(res);
      }
      // else if(this.quillConfig.name === 'fib-text')
    }
    this.questionEditorService.updateResponseIds(this.responseIds);
    this.questionEditorService.updateResponses(this.responses);

    console.log('idsids ', this.responseIds, this.responses);
  }

  addHighlightTextsId() {
    let elementRef = this.elm.nativeElement.querySelectorAll('code');
    for (let i = 0; i < elementRef.length; i++) {
      let uid: any;
      if (this.highlightedTextsIds[i]) {
        uid = this.highlightedTextsIds[i];
      } else {
        uid = Math.floor(100000 + Math.random() * 900000);
        this.highlightedTextsIds.push(uid);
      }
      this.renderer.setAttribute(elementRef[i], 'id', uid);
      this.highlightedTexts[uid] = elementRef[i].innerText;
    }
    this.questionEditorService.updateHighlightedTextsIds(
      this.highlightedTextsIds
    );
    this.questionEditorService.updateHighlightedTexts(this.highlightedTexts);
    //console.log('highlight', this.highlightedTexts, this.highlightedTextsIds);
  }

  ngOnChanges(changes) {}

  onEditorCreated(editorInstance) {
    //console.log('editorInstance', editorInstance, this.quillConfig);
    this.quillInstance = editorInstance;
    if (this.quillConfig.quillLoc === 'qstem') {
      this.quillInstance.focus();
    }
  }

  keyPress(event) {
    console.log('keypress ', event);
  }

  /**
   * @description
   * This function strips the tags from the data obtainer from the quill editor and emits it to the parent component
   * @param changedContent
   * @returns void
   */
  onContentChanged(changedContent): void {
    console.log('changedContent ', changedContent, this.quillInstance);

    if (this.focus) {
      let elem = changedContent.editor.root.parentElement.querySelectorAll(
        '.ql-tooltip'
      )[0];
    }

    let quillData = changedContent.html;
    let lastWord: any;
    if (quillData) {
      quillData = quillData.replace('<p>', '');
      quillData = quillData.replace('</p>', '');
      let n = quillData.split(' ');
      // let lastWord = n[n.length - 1];
      lastWord = quillData.endsWith('</code>');
    }

    // changedContent.html = quillData;
    this.quillHtmlData = changedContent.html;
    var div = document.createElement('div');
    div.innerHTML = changedContent.html;
    changedContent.text = div.innerText;
    let parser = new DOMParser();
    let doc = parser.parseFromString(
      this.elm.nativeElement.innerHTML,
      'text/html'
    );
    let codes = doc.querySelectorAll('code');
    if (codes.length > 0) {
      console.log(
        'lastText',
        codes,
        changedContent.html,
        lastWord,
        `<code id="${codes[codes.length - 1].id}" contenteditable="false">${codes[codes.length - 1].innerText}</code>`
      );
    }

    if (lastWord) {
      let spanOuterHtml = '<span>aaa&nbsp;</span>';
      console.log('lastText found ');
      this.quillInstance.root.innerHTML = this.quillInstance.root.innerHTML.replace(
        `<code id="${codes[codes.length - 1].id}" contenteditable="false">${codes[codes.length - 1].innerText}</code>`,
        `<code id="${codes[codes.length - 1].id}" contenteditable="false">${codes[codes.length - 1].innerText}</code><span>&nbsp;</span>`
      );
      this.quillInstance.root.innerHTML = this.quillInstance.root.innerHTML.replace(
        `<code id="${codes[codes.length - 1].id}">${codes[codes.length - 1].innerText}</code>`,
        `<code id="${codes[codes.length - 1].id}">${codes[codes.length - 1].innerText}</code><span>&nbsp;</span>`
      );
      this.quillInstance.root.innerHTML = this.quillInstance.root.innerHTML.replace(
        `<code>${codes[codes.length - 1].innerText}</code>`,
        `<code>${codes[codes.length - 1].innerText}</code><span>&nbsp;</span>`
      );
      this.cdr.detectChanges();
    }
    if (
      this.quillConfig.name === 'fib-text' ||
      this.quillConfig.name === 'fib-dropdown' ||
      this.quillConfig.name === 'fib-drag-drop'
    )
      this.addUids();
    if (this.templateType === 'token-highlight') this.addHighlightTextsId();
    let count = 0;
    if (codes.length > 0) {
      codes.forEach(element => {
        if (this.newResFlag && count < codes.length) {
          this.getUpdatedContent.emit(changedContent.html);
          this.questionEditorService.updateNewResponseFlag(false);
        } else if (element.id) {
          count++;
          if (count === codes.length) {
            this.getUpdatedContent.emit(changedContent.html);
          }
        }
      });
    } else {
      this.getUpdatedContent.emit(changedContent.html);
    }
    // }
    // this.getUpdatedContent.emit(changedContent.html);
    if (this.rangeIndex) {
      let textRange = changedContent.text.length;
      this.quillInstance.setSelection(this.rangeIndex + 2, Quill.sources.API);
      this.rangeIndex = undefined;
    }
  }

  previewQuillChanged(changedContent): void {
    this.updateQuillData = changedContent.html;
    var div = document.createElement('div');
    div.innerHTML = changedContent.html;
    changedContent.text = div.innerText;
    this.getQuillUpdated.emit(changedContent.html);
  }

  setFocus(editor) {
    editor.focus();
  }

  onFocusInput(e?) {
    //console.log('focus ', e, this.quillConfig.name);
    if (
      this.quillConfig.name === 'fib-text' ||
      this.quillConfig.name === 'fib-dropdown' ||
      this.quillConfig.name === 'fib-drag-drop'
    ) {
      this.questionEditorService.updateAllowAddResponse(true);
    } else {
      this.questionEditorService.updateAllowAddResponse(false);
    }
    let index = e.editor.getSelection().index;
    let elem = e.editor.root.parentElement.querySelectorAll('.ql-tooltip')[0];
    this.focus = true;
    this.getIndex.emit(index);
    this.questionEditorService.setInstance(e.editor);
    this.questionEditorService.setComponentName(this.quillConfig.name);
  }

  onBlur(e) {
    this.getUpdatedContentFocus.emit(this.quillHtmlData);
  }

  onBlurInput(e) {
    closeEditor();
    this.focus = false;
  }

  onEquationAdd(e) {
    this.activeObj = {
      elem: e
    };
    this.showEditor = true;
  }

  onCloseEditor() {
    this.showEditor = false;
  }

  clickKey(e) {
    //console.log('clickkey ', e);
    if (
      this.templateType === 'token-highlight' &&
      e.target.localName === 'code'
    ) {
      alert(e.target.id);
    }
  }

  ngOnDestroy() {
    // this.questionEditorService.updateResponseIds([]);
    // this.questionEditorService.updateResponses({});
    this.destroy$.next(true);
  }

  // addResponseTag(tagName: string) {
  //   // code for response tag START
  //   let quillInstance = this.quillInstance.editor;
  //   let range = this.quillInstance.getSelection(true);
  //   console.log(' RANGE ', range);
  //   quillInstance.insertEmbed(
  //     range.index,
  //     //Insert the TemplateMarker in the same range as the cursor is
  //     'TemplateMarker',
  //     //This is the name of the Embed
  //     {
  //       colour: 'red',
  //       marker: 'Response',
  //       title: 'Response'
  //     }
  //     //These are the variables to enter
  //   );

  //   quillInstance.insertText(range.index + 1, '', Quill.sources.API);
  //   //Add a space after the marker

  //   this.quillInstance.setSelection(range.index + 2, Quill.sources.API);
  //   //Take the cursor to the end of the inserted TemplateMarker
  //   this.rangeIndex = range.index;

  //   // code for response tag END
  //   this.quillHtmlData = this.quillInstance.scrollingContainer.innerHTML;

  //   this.addTag.emit(this.quillInstance);
  // }
}
