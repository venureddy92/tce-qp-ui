import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  Renderer2,
  ComponentRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {
  TemplateMcqData,
  FibTextDropdown,
} from '../../../../core/interface/quiz-player-template.interface';
import { SharedComponentService } from '../../../core/services/shared-component.service';
import { QuestionEditorService } from '../../../core/services/question-editor.service';
import { QuillEditorComponent } from '../../../../sharedEditors/quill-component/components/quill-component-layout/quill-editor.component';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-template-markup-layout',
  templateUrl: './template-markup-layout.component.html',
  styleUrls: ['./template-markup-layout.component.scss'],
})
export class TemplateMarkupLayoutComponent implements OnInit {
  @ViewChild('quillMarkUpContainer', { static: false, read: ViewContainerRef })
  public quillMarkUpContainer: ViewContainerRef;
  @ViewChild('myContentMarkUp', { static: true })
  public myContentMarkUp: ElementRef;
  @Input() public templateData: string;
  @Input() public templateType: string;
  @Input() public previewState: boolean;
  @Input() public inputType: string;
  @Input() public source: FibTextDropdown;
  @Input() public inputName: string;
  @Input() public type: string;
  @Output() public onContentUpdate = new EventEmitter();
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  public matchedArray: Array<string> = [];
  public response: Array<Array<string>> = [];
  public indexPosition: number = 0;
  public inputData: string;
  public responseSpan: any;
  public responses: Object = {};
  public responseIds: Array<any> = [];
  @ViewChild(QuillEditorComponent, { static: false })
  public quillComp: QuillEditorComponent;
  @Output() pushSelectedAns = new EventEmitter();
  public correctAnswers: Array<any> = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  public quillInstance: any;
  private newResponseId: string;
  @Input() private possibleResponses: any;
  private deletedId: any;
  private listenFunc: Function;
  selectedResponseId = null;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private elementRef: ElementRef,
    public sanitizer: DomSanitizer,
    private questionEdtorService: QuestionEditorService,
    private elm: ElementRef
  ) {}
  ngOnInit() {
    // console.log('mark11 ', this.source.data.validation.valid_response.value);

    this.correctAnswers = this.source.data.validation.valid_response.value;

    this.questionEdtorService
      .getResponses()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        // console.log('responses mark', res);
        this.responses = res;
      });
    this.questionEdtorService
      .getResponseIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ids) => {
        this.responseIds = ids;
      });
    this.inputData = this.templateData;

    window.addEventListener('click', (e) => {
      this.renderData();
    });

    this.questionEdtorService
      .getInstance()
      .pipe(takeUntil(this.destroy$))
      .subscribe((instance) => {
        this.quillInstance = instance;
      });

    this.questionEdtorService
      .getNewResponseId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.newResponseId = res;
      });

    // window.addEventListener('keyup', e => {
    //   console.log('window typed ', e);
    // });
  }

  ngAfterViewInit(): void {
    this.mode = this.previewState;
    this.renderData();
    this.labelUpdate();
    // if (!this.quillLoaded)
    this.loadQuill();
  }

  /**
   * @description This function replaces the Response tag in the string and replaces it with a input text in the html
   * @returns void
   */
  renderData() {
    // console.log('sourceDDDD ', this.source);

    if (this.templateData) {
      this.templateData = this.inputData;
      this.matchedArray = this.templateData.match(/{{response}}/g) || [];
      // if (this.type === 'fib-text') {
      let cAnswers: Array<string> = [];
      this.matchedArray.forEach((matchEl, index) => {
        let responseSpan = this.renderer.createElement('code');
        let spanText = '';
        if (this.correctAnswers.length > 0 && this.type === 'fib-text') {
          spanText = this.renderer.createText(
            ` ${this.correctAnswers[index]} `
          );
        } else {
          spanText = this.renderer.createText(` RESPONSE `);
          cAnswers.push(` RESPONSE `);
        }
        this.renderer.appendChild(responseSpan, spanText);
        if (this.type === 'fib-text') {
          this.listenFunc = this.renderer.listen(
            this.elementRef.nativeElement,
            'click',
            (event) => {
              this.clickComp(event);
            }
          );
        }
        let spanOuterHtml = responseSpan.outerHTML;
        this.templateData = this.templateData.replace(
          '{{response}}',
          spanOuterHtml
        );
      });
      // }
      // else if (
      //   this.type === 'fib-dropdown' ||
      //   this.type === 'fib-drag-drop'
      // ) {
      //   console.log('render ', this.type);

      //   this.matchedArray.forEach(async (matchEl, index) => {
      //     let responseSpan = this.renderer.createElement('response');
      //     this.renderer.addClass(responseSpan, 'badge');
      //     let nestedSpan = this.renderer.createElement('span');
      //     this.renderer.setAttribute(nestedSpan, 'contenteditable', 'false');
      //     let spanText = this.renderer.createText(`RESPONSE`);
      //     this.renderer.appendChild(nestedSpan, spanText);
      //     this.renderer.appendChild(responseSpan, nestedSpan);
      //     let spanOuterHtml = responseSpan.outerHTML;
      //     this.templateData = this.templateData.replace(
      //       '{{response}}',
      //       spanOuterHtml
      //     );
      //   });
      // }
    }
    // console.log('sourceDDDD 2 ', this.source);
  }

  addTags(quillInstance, rangeIndex?) {
    // console.log('tags');

    if (this.inputData) {
      // console.log(
      //   'rangeIndex ',
      //   rangeIndex,
      //   this.inputData,
      //   quillInstance,
      //   this.responseIds,
      //   this.responses
      //   // this.possibleResponses
      // );
      let str = this.inputData.substr(0, rangeIndex);
      let res = str.match(/{{response}}/g) || [];

      // let match = this.inputData.match(/{{response}}/g) || [];
      let length = res.length - 1;
      let choice = [
        { parentId: this.newResponseId, label: 'Choice A', value: '0' },
        { parentId: this.newResponseId, label: 'Choice B', value: '1' },
      ];
      // if (this.type == 'fib-dropdown') {
      //   // this.source.data.possible_responses.splice(length, 0, choice);
      //   this.source.data.possible_responses.splice(length, 0, choice);
      // }
      // console.log('PossibleResponse ', this.source.data.possible_responses);
      this.renderData();
      this.labelUpdate();
    }
  }

  deleteTag() {}

  /**
   * @description Function to update label in the html
   * @param updatedTemplate Type = string
   */
  labelUpdate() {
    if (this.mode && this.myContentMarkUp) {
      this.renderer.setProperty(
        this.myContentMarkUp.nativeElement,
        'innerHTML',
        this.templateData
      );

      this.defaultHtml = this.myContentMarkUp.nativeElement;
      this.defaultHtml = this.defaultHtml.outerHTML;
    } else {
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', this.templateData);
      this.defaultHtml = div.outerHTML;

      // prompt('Template Data', JSON.stringify(this.templateData));
      this.onContainerClick();
    }
  }

  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick() {
    if (!this.mode) {
      this.editorState = true;
      // this.loadQuill();
    }
  }

  /**
   * @description Gets random number within a range
   * @param min Type = number
   * @param max Type = number
   * @returns number
   */
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  selectedIndex: any;
  /**
   * @description This function loads the quill component with @Input & @Output
   * @returns void
   */
  async loadQuill() {
    if (!this.quillLoaded) {
      this.comp = await this.sharedComponentService.loadDynamicEditorModule(
        'quillLoader',
        this.quillMarkUpContainer
      );
      if (this.comp instanceof ComponentRef) {
        this.quillLoaded = true;
        this.comp.instance.quillConfig = {
          name: this.type,
          placeholder: 'Type the sentence here',
          quillLoc: 'template-markup',
        };
        this.comp.instance.quillHtmlData = this.defaultHtml;
        this.comp.instance.templateType = this.templateType;
        this.comp.instance.allowResponseTag = true;
        this.comp.instance.possibleResponses =
          this.source.data.possible_responses;
        this.comp.instance.getUpdatedContent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            console.log('updatedData ', data);

            let range = this.quillInstance.getSelection(true);

            let quillData = data;
            // let length = data.length;
            // quillData = quillData.replace('<p>', '');
            // quillData = quillData.replace('</p>', '');
            // let n = quillData.split(' ');
            // let lastWord = n[n.length - 1];
            // if (lastWord === '</code>') {
            //   console.log('lastText found ');

            //   data = data.replace('</code>', '</code><span>aaa&nbsp;</span>');
            // }
            // let lastText = this.quillInstance.getText(length - 6, length);
            // console.log('lastText ', data, quillData, length, lastWord);

            // if (this.type === 'fib-text') {
            let matches =
              data && data.match(/<code/g) ? data.match(/<code/g) : [];
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            let codeRef = doc.querySelectorAll('code');
            // console.log('codeRef ', codeRef);
            let codeRefIds = [];
            // console.log(
            //   'valuesssss ',
            //   data,
            //   this.source.data.validation.valid_response.value
            // );
            let correctAnswers = [];
            // let newPossibleResponses = [];
            // codeRef.forEach(code => {
            //   correctAnswers.push(code.innerText);
            //   codeRefIds.push(code.id);
            //   this.responses[code.id] = code.innerText;
            // });

            // this.pushSelectedAns.emit(correctAnswers);

            this.matchedArray =
              data && data.match(/RESPONSE/g) ? data.match(/RESPONSE/g) : [];
            if (matches) {
              matches.forEach((matchEl, index) => {
                let possibleResIds = [];
                // this.source.data.possible_responses.forEach(response => {
                //   console.log('Resssss ', codeRefIds, response[0]['parentId']);

                //   if (codeRefIds.includes(response[0]['parentId'].toString())) {
                //     let index = codeRefIds.indexOf(
                //       response[0]['parentId'].toString()
                //     );
                //     newPossibleResponses.splice(index, 0, response);
                //   }
                // });
                // this.source.data.possible_responses = newPossibleResponses;
                // (
                //   code => code[0]['parentId']
                // );
                // console.log(
                //   'possibleRRRRR  ',
                //   this.source.data.possible_responses,
                //   codeRef,
                //   this.source.data.validation.valid_response.value,
                //   this.responseIds,
                //   possibleResIds
                // );
                codeRef.forEach((code) => {
                  codeRefIds.push(code.id);
                  // this.responses[code.id] = code.innerText;
                  // if(code.id.includes)
                });

                if (
                  this.type != 'fib-text' &&
                  codeRef.length < this.responseIds.length
                ) {
                  let dltIndex: any;
                  this.responseIds.forEach((res, index) => {
                    // console.log('index 11 ', codeRefIds, res);

                    if (!codeRefIds.includes(res.toString())) {
                      dltIndex = index;
                    }
                  });
                  this.deletedId = this.responseIds[dltIndex];
                  // this.responseIds.splice(dltIndex, 1);
                  // this.questionEdtorService.updateResponseIds(this.responseIds);
                  if (
                    this.source.data.validation.valid_response.value[
                      dltIndex
                    ] != '' &&
                    this.type === 'fib-drag-drop'
                  ) {
                    this.possibleResponses.forEach((response) => {
                      if (
                        this.source.data.validation.valid_response.value[
                          dltIndex
                        ].value === response[0].value
                      ) {
                        response[0].selected = false;
                      }
                    });
                    this.source.data.possible_responses =
                      this.possibleResponses;
                  } else {
                    let newResponses = [];
                    this.possibleResponses.forEach((val, index) => {
                      if (index != dltIndex) newResponses.push(val);
                    });
                    this.source.data.possible_responses =
                      this.possibleResponses;
                  }
                  let newValues = [];
                  this.source.data.validation.valid_response.value.forEach(
                    (val, index) => {
                      if (index != dltIndex) newValues.push(val);
                    }
                  );
                  this.source.data.validation.valid_response.value = newValues;
                  this.responseIds.splice(dltIndex, 1);
                  this.questionEdtorService.updateResponseIds(this.responseIds);
                  // console.log(
                  //   'possibleResponse ',
                  //   this.possibleResponses,
                  //   this.responseIds,
                  //   this.source.data.validation.valid_response.value,
                  //   this.source.data.validation.valid_response.value[dltIndex]
                  // );
                }

                if (this.type === 'fib-text') {
                  this.responses = {};
                  codeRef.forEach((code) => {
                    this.responses[code.id] = code.innerText;
                    // if(code.id.includes)
                  });
                  this.responseIds = codeRefIds;
                } else if (this.type === 'fib-dropdown') {
                  // if(codeRef.length != this.responseIds.length)
                  let res = [];

                  if (codeRef[0].id) {
                    codeRef.forEach((code) => {
                      if (code.id) {
                        res.push(this.responses[code.id]);
                      }
                    });
                    // console.log(
                    //   'this.responsessssss ',
                    //   codeRef,
                    //   codeRef[0].id,
                    //   this.responses,
                    //   this.responses[codeRef[0].id],
                    //   res
                    // );

                    this.source.data.possible_responses = res;
                    // setTimeout(() => {
                    //   console.log('timeout');

                    //   this.renderData();
                    //   this.labelUpdate();
                    // }, 500);

                    // this.addTags(this.quillInstance);
                    // this.possibleResponses = res;
                  }
                }
                // if (codeRef.length < this.responseIds.length) {
                //   let newcodeRef = this.elm.nativeElement.querySelectorAll(
                //     'code'
                //   );

                //   // } else
                //   if (this.type === 'fib-dropdown') {
                //     let refIds = [];
                //     codeRef.forEach(code => {
                //       refIds.push(code['id']);
                //     });
                //     let removeId: any;
                //     this.responseIds.forEach((id, index) => {
                //       let idd = id.toString();
                //       // console.log(
                //       //   'ugkad',
                //       //   id,
                //       //   idd,
                //       //   refIds,
                //       //   refIds.includes(idd),
                //       //   refIds.indexOf(id)
                //       // );
                //       if (!refIds.includes(idd)) {
                //         removeId = idd;
                //       }
                //     });
                //     // this.source.data.possible_responses.splice(removeIndex, 1);
                //     // console.log('ugkad1 ', removeId);
                //     // let responseIndex: any;
                //     // this.source.data.possible_responses.forEach(
                //     //   (response, index) => {
                //     //     if (response['parentId'] === removeId)
                //     //       responseIndex = index;
                //     //   }
                //     // );
                //     // this.source.data.possible_responses.splice(
                //     //   responseIndex,
                //     //   1
                //     // );
                //   }
                //   this.questionEdtorService.updateResponseIds(this.responseIds);
                //   this.questionEdtorService.updateResponses(this.responses);
                // }
                let currentText: any;
                if (this.responses[this.responseIds[index]]) {
                  if (this.type === 'fib-text') {
                    this.responses[this.responseIds[index]] =
                      codeRef[index].innerText;
                    currentText = codeRef[index].innerText;
                    this.source.data.validation.valid_response.value[index] =
                      codeRef[index].innerText;
                  } else {
                    currentText = ` RESPONSE `;
                  }
                  // else if (this.type === 'fib-drag-drop') {
                  //   currentText = ' ';
                  // }
                }
                // console.log(
                //   'totalData ',
                //   data,
                //   this.deletedId,
                //   this.source,
                //   this.responseIds,
                //   this.responses,
                //   currentText,
                //   `<code id="${this.responseIds[index]}" contenteditable="false">${currentText}</code>`,
                //   this.source.data.possible_responses
                // );

                data = data.replace(
                  `<code id="${this.responseIds[index]}">${currentText}</code>`,
                  '{{response}}'
                );
                data = data.replace(
                  `<code id="${this.responseIds[index]}" contenteditable="false">${currentText}</code>`,
                  '{{response}}'
                );
                data = data.replace(
                  `<code id="${this.deletedId}" contenteditable="false">${currentText}</code>`,
                  '{{response}}'
                );
                data = data.replace(
                  `<code id="${this.responseIds[index]}" class="">${currentText}</code>`,
                  '{{response}}'
                );
                data = data.replace(
                  `<code>${currentText}</code>`,
                  '{{response}}'
                );
              });
              // console.log('totalData 1', data);

              let totalData = {
                rdata: data,
                response: this.source.data.possible_responses,
              };
              this.templateData = data;
              this.onContentUpdate.emit(totalData);
            }
            this.inputData = data;
            this.renderData();
            this.labelUpdate();
          });

        this.comp.instance.getIndex
          .pipe(takeUntil(this.destroy$))
          .subscribe((index) => {
            this.indexPosition = index;
          });

        this.comp.instance.addTag
          .pipe(takeUntil(this.destroy$))
          .subscribe((e) => {
            this.addTags(e);
          });
        // this.comp.addUids();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    if (this.type === 'fib-text') {
      // this.listenFunc();
    }
  }

  iterateText() {
    this.comp.instance.onContentChanged();
  }

  clickComp(event) {
    console.log('ClickComp ', event);
    this.selectedResponseId = event.target.id;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    // console.log('keydown ', $event);
    let element: any;
    if (this.selectedResponseId) {
      element = document.getElementById(this.selectedResponseId);

      // code.forEach(code => {
      //   if(code.id === $event.target);
      // });
      // = document.getElementById(this.selectedResponseId);
      // console.log('element ', element);
    }
    if (($event.ctrlKey || $event.metaKey) && $event.code === 'KeyC')
      console.log('CTRL + C');
    if (($event.ctrlKey || $event.metaKey) && $event.code === 'KeyV') {
      // console.log('CTRL +  V');
      // if (this.selectedResponseId) {
      //   // let element = document.getElementById(this.selectedResponseId);
      //   let copiedText = '';
      //   navigator['clipboard'].readText().then(data => {
      //     copiedText = data;
      //   });
      //   let spanText = this.renderer.createText(copiedText);
      //   this.renderer.appendChild(element, spanText);
      // }
    }
  }
}
