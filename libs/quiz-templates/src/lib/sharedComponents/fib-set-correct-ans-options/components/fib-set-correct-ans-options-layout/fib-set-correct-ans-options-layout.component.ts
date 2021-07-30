import {
  Component,
  OnInit,
  Output,
  Renderer2,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { TemplateMcqData } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { SharedComponentService } from '../../../core/services/shared-component.service';
import { QuestionEditorService } from '@tce/template-editor';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-fib-set-correct-ans-options-layout',
  templateUrl: './fib-set-correct-ans-options-layout.component.html',
  styleUrls: ['./fib-set-correct-ans-options-layout.component.scss']
})
export class FibSetCorrectAnsOptionsLayoutComponent
  implements OnInit, OnDestroy {
  @Input() public optData: object;
  @Input() public previewState: boolean;
  @Input() public inputName: string;
  @Input() public templateMarkUpData: string;
  @Input() public optValue: Array<string>;
  @Input() public type: string;
  @Input() public sourceData: TemplateMcqData;
  @Input() public showAnsState: object;
  @Input() public possibleResponses: Array<Array<string>>;
  public possibleResponsesPreview: Array<Array<string>>;

  // @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public updateResponse: BehaviorSubject<boolean>;
  @ViewChild('correctAnsContainer', { static: true }) container: ElementRef;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  // public quillLoaded: boolean = false;
  public mode: boolean;
  // public comp: ComponentRef<any>;
  @Output() pushSelectedAns = new EventEmitter();
  @Output() correctPoints = new EventEmitter();
  @Output() allowSubmit = new EventEmitter();
  @Output() possibleResPreviewEmitter = new EventEmitter();
  // @Output() correctAnswer = new EventEmitter();
  public templateData: any;
  public templateMatchArr = [];
  public fibTextValue: Array<string> = [];
  public fibTextValuePreview: Array<any> = [];
  public response: any;
  public selectedPreview: Array<string>;
  public getShowAnsState: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );

  private inputText: string;
  public showCorrectAnswer: boolean;
  public correctAnswer: Array<string>;
  public selected: Array<string>;
  public responses: Object;
  public responseIds: Array<any>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  private listenFunc: Function;
  private fibDragResponse = null;
  private selectedResponses = [];
  private fibDragResponseClassify: any;

  constructor(
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    public changeRef: ChangeDetectorRef,
    public sharedComponentService: SharedComponentService,
    private questionEdtorService: QuestionEditorService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // console.log('on init in set correct', this.showAnsState);
    this.sharedComponentService
      .getFibDragResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.fibDragResponse = res;
        // console.log('dragresponses', this.responses, res);
      });

    this.questionEdtorService
      .getResponses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.responses = res;
        // console.log('responses in fib', this.responses, res);
      });
    this.questionEdtorService
      .getResponseIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => {
        this.responseIds = ids;
        // console.log('res Ids', this.responseIds, this.responses, ids);

        this.render();
      });

    this.questionEdtorService
      .getPossibleResponses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(responses => {
        this.selectedResponses = responses;
      });

    this.showAnsState = this.questionEdtorService
      .getSubmitAnsShow()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.showCorrectAnswer = state;
        this.correctIncorrect();
      });

    console.log('TYPE: ', this.type);
    setTimeout(() => {
      // console.log('responses in fib', this.responseIds);
    }, 5000);

    this.inputText = this.templateMarkUpData;
    // console.log('possible Responses: ', this.possibleResponses);
    if (this.sourceData) {
      // console.log('sourceData ', this.sourceData);
      if (this.type === 'fib-drag-drop') {
        this.fibTextValue = [];
        this.sourceData.data.validation.valid_response.value.forEach(
          (value: any) => {
            if (value) this.fibTextValue.push(value.label);
          }
        );
      } else {
        this.fibTextValue = this.sourceData.data.validation.valid_response.value;
      }
    }
    this.selectedPreview = [...this.fibTextValue];
    // console.log('SelPreview: ', this.selectedPreview);

    // this.previewState.subscribe((mode: boolean) => {
    this.mode = this.previewState;
    if (!this.mode) {
      this.showCorrectAnswer = false;
      // this.correctIncorrect();
    }
    this.fibTextValuePreview = [];
    // console.log('mode: ', this.mode);
    // });

    // this.showAnsState.subscribe((data: object) => {

    // console.log('ansState: ', data['state']);
    this.correctAnswer = this.showAnsState['selectedAnswers'];
    // });

    this.updateResponse.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.render();
    });

    if (this.previewState && this.type === 'fib-drag-drop') {
      this.possibleResponsesPreview = JSON.parse(
        JSON.stringify([...this.possibleResponses])
      );
      this.possibleResponsesPreview.forEach((response: any, index) => {
        response[0].selected = false;
      });
    }

    // this.render();
    // this.fibTextValue = [];
    this.listenFunc = this.renderer.listen(
      this.elementRef.nativeElement,
      'keyup',
      (e: any) => {
        if (this.type == 'fib-text') {
          let allowSub = false;
          // console.log('eventlistener', e);
          // console.log(
          //   'all responses',
          //   this.responses,
          //   this.responseIds,
          //   this.fibTextValue,
          //   this.fibTextValuePreview
          // );

          // if (e.target.id.indexOf('-fib') > -1) {
          let tagId = e.target.id;
          // console.log(
          //   'tagId ',
          //   tagId,
          //   this.responseIds,
          //   this.responseIds.findIndex(id => id == e.target.id)
          // );

          let indexPosition = this.responseIds.findIndex(
            id => id == e.target.id
          );
          // console.log('indexPosition ', indexPosition);
          if (this.fibTextValuePreview.length < 1) {
            this.fibTextValuePreview.push(e.target.value);
          } else {
            this.fibTextValuePreview[indexPosition] = e.target.value;
          }
          // console.log(
          //   'fibfibfib ',
          //   this.fibTextValue,
          //   this.fibTextValuePreview,
          //   indexPosition
          // );

          this.templateMatchArr = this.inputText.match(/{{response}}/g) || [];
          let totalOptions = this.fibTextValue.length;
          let lowerFibTextValue = [];
          let lowerFibTextValuePreview = [];
          for (let i = 0; i < this.fibTextValuePreview.length; i++) {
            // console.log(
            //   'fibfibfib inside',
            //   i,
            //   this.fibTextValue[i],
            //   this.fibTextValuePreview.length
            // );

            lowerFibTextValue.push(
              this.fibTextValue[i].toLocaleLowerCase().trim()
            );
            if (this.fibTextValuePreview[i]) {
              lowerFibTextValuePreview.push(
                this.fibTextValuePreview[i].toLocaleLowerCase().trim()
              );
            }
            if (this.fibTextValuePreview[i] === '') {
              allowSub = true;
            }
          }

          let stringDifference = this.sharedComponentService.getDifferenceofStrings(
            lowerFibTextValue,
            lowerFibTextValuePreview,
            totalOptions
          );
          // console.log(
          //   'stringDifference',
          //   stringDifference,
          //   lowerFibTextValue,
          //   lowerFibTextValuePreview
          // );

          this.correctPoints.emit(stringDifference);
          // console.log('lengthL ', this.fibTextValue, this.fibTextValuePreview);

          if (
            this.fibTextValue.length != this.fibTextValuePreview.length ||
            allowSub
          ) {
            this.allowSubmit.emit(false);
          } else {
            this.allowSubmit.emit(true);
          }
        }
        this.correctIncorrect();
        // }
        // }
      }
    );

    this.listenFunc = this.renderer.listen(
      this.elementRef.nativeElement,
      'change',
      (e: any) => {
        if (this.type === 'fib-dropdown') {
          // console.log('selected ', e);

          let index = e.target.id;
          let selected = e.target.value;

          if (!this.mode) {
            // this.correctIncorrect();
            this.fibTextValue[index] = selected;
            this.sourceData.data.validation.valid_response.value[
              index
            ] = selected;
            var indexPosition = parseInt(e.target.id);
            let select = document.getElementById(`${indexPosition}`);
            // if (select && select.classList.contains('incorrect-div')) {
            //   this.renderer.removeClass(select, 'incorrect-div');
            // }
            // if (select && select.classList.contains('correct-div')) {
            //   this.renderer.removeClass(select, 'correct-div');
            // }
            // console.log('sourceData', this.sourceData);
          } else {
            var totalOptions = this.fibTextValue.length;
            this.fibTextValuePreview[index] = selected;
            // console.log('selectedPreview: ', this.selectedPreview);
            var stringDifference = this.sharedComponentService.getDifferenceofStrings(
              this.fibTextValue,
              this.fibTextValuePreview,
              totalOptions
            );
            // console.log(
            //   'total ',
            //   this.fibTextValue,
            //   this.fibTextValuePreview,
            //   totalOptions
            // );

            this.correctPoints.emit(stringDifference);
            // this.correctIncorrect();
            if (this.fibTextValue.length != this.fibTextValuePreview.length) {
              this.allowSubmit.emit(false);
            } else {
              this.allowSubmit.emit(true);
            }
          }
          this.correctIncorrect();
        }
      }
    );
  }

  //Function to render the html
  render() {
    // console.log(
    //   'Random 2',
    //   this.responseIds,
    //   this.templateMarkUpData,
    //   this.type
    // );

    // console.log('Template Markup Data', this.templateMarkUpData);
    if (this.templateMarkUpData) {
      this.response = this.sourceData.data.possible_responses;
      this.templateMarkUpData = this.sourceData.data.template;
      this.templateMatchArr =
        this.templateMarkUpData.match(/{{response}}/g) || [];
      // console.log('ResponseFIB', this.response, this.templateMatchArr);
      this.fibTextValue = this.sourceData.data.validation.valid_response.value;

      if (this.templateMatchArr && this.templateMatchArr.length > 0) {
        this.templateMatchArr.forEach((template, index) => {
          if (!this.fibTextValue[index]) {
            this.fibTextValue[index] = '';
          }

          if (this.type == 'fib-text') {
            // this.fibTextValue.push(null);
            let span = this.renderer.createElement('span');
            this.renderer.setStyle(span, 'position', 'relative');
            let textInput = this.renderer.createElement('input');
            this.renderer.setAttribute(textInput, 'type', 'text');
            let span1 = this.renderer.createElement('span');
            if (this.responseIds) {
              // console.log('inside if ', this.responses, this.responseIds);

              // this.renderer.setAttribute(textInput, 'id', `${index + 1}-fib`);
              this.renderer.setAttribute(
                textInput,
                'id',
                this.responseIds[index]
              );

              this.renderer.setAttribute(
                span1,
                'id',
                `${this.responseIds[index]}-fib-span`
              );
            }
            this.renderer.appendChild(span, textInput);

            this.renderer.appendChild(span, span1);
            let spanOuterHtml = span.outerHTML;
            this.templateMarkUpData = this.templateMarkUpData.replace(
              '{{response}}',
              spanOuterHtml
            );
          } else if (this.type == 'fib-dropdown') {
            // console.log('responses: ', this.response, this.templateMarkUpData);

            let span = this.renderer.createElement('span');
            this.renderer.setStyle(span, 'position', 'relative');
            let select = this.renderer.createElement('select');
            this.renderer.setAttribute(select, 'id', `${index}`);
            this.renderer.addClass(select, 'fib-drop');
            this.renderer.appendChild(span, select);
            let opt1 = this.renderer.createElement('option');
            this.renderer.setAttribute(opt1, 'value', '');
            let selectText = this.renderer.createText('');
            this.renderer.appendChild(opt1, selectText);
            if (this.mode) {
              let span1 = this.renderer.createElement('span');
              this.renderer.setAttribute(
                span1,
                'id',
                `${index + 1}-fib-drop-span`
              );
              this.renderer.appendChild(span, span1);
            }
            // this.renderer.setValue(opt1, 'select');
            this.renderer.appendChild(select, opt1);
            if (this.response) {
              if (this.response[index]) {
                this.response[index].forEach((o, rindex) => {
                  // let opt = `opt-${index}`;
                  let opt = this.renderer.createElement('option');
                  let optText = this.renderer.createText(o['label']);
                  this.renderer.setProperty(opt, 'innerHTML', o['label']);
                  this.renderer.setAttribute(opt, 'id', `index`);
                  this.renderer.setAttribute(opt, 'value', o['value']);
                  // console.log('fibText -->', this.fibTextValue[index]);
                  if (!this.mode && o['value'] === this.fibTextValue[index]) {
                    this.renderer.setAttribute(opt, 'selected', 'true');
                  }
                  // console.log('option 2 ---> ', optText);
                  this.renderer.appendChild(select, opt);
                });
              }
            }

            let spanOuterHtml = span.outerHTML;
            this.templateMarkUpData = this.templateMarkUpData.replace(
              '{{response}}',
              spanOuterHtml
            );
          } else if (this.type == 'fib-drag-drop') {
            // console.log(
            //   'Random 3',
            //   this.sourceData.data.validation.valid_response.value[index]
            // );
            let div = this.renderer.createElement('div');
            if (this.mode) {
              let span1 = this.renderer.createElement('span');
              // this.renderer.setAttribute(
              //   span1,
              //   'id',
              //   `${index + 1}-fib-drag-span`
              // );
              this.renderer.appendChild(span1, div);
            }

            let div1 = this.renderer.createElement('div');
            this.renderer.addClass(div, 'fib-response-input');
            this.renderer.addClass(div1, 'fib-response-input-preview');
            if (this.responseIds) {
              this.renderer.setAttribute(
                div,
                'id',
                `${this.responseIds[index]}`
              );
              this.renderer.setAttribute(
                div1,
                'id',
                `${this.responseIds[index]}`
              );
            }
            if (this.previewState && this.fibTextValuePreview[index]) {
              let vText = this.fibTextValuePreview[index];
              // let text = this.renderer.createText(vText);
              // this.renderer.appendChild(div, text);

              this.renderer.setProperty(div1, 'innerHTML', vText);
            } else if (
              this.sourceData.data.validation.valid_response.value[index] &&
              !this.previewState
            ) {
              let vText = this.sourceData.data.validation.valid_response.value[
                index
              ].label;
              // let text = this.renderer.createText(vText);
              // this.renderer.appendChild(div, text);

              this.renderer.setProperty(div, 'innerHTML', vText);
            }
            // else{
            //   this.renderer.setProperty(div, 'innerHTML', '');
            // }
            this.listenFunc = this.renderer.listen(
              this.elementRef.nativeElement,
              'click',
              event => {
                this.clickComp(event);
              }
            );
            let spanOuterHtml: any;
            if (this.mode) {
              spanOuterHtml = div1.outerHTML;
            } else {
              spanOuterHtml = div.outerHTML;
            }
            this.templateMarkUpData = this.templateMarkUpData.replace(
              '{{response}}',
              spanOuterHtml
            );
          }
        });
      } else {
      }

      this.templateData = this.sanitizer.bypassSecurityTrustHtml(
        this.templateMarkUpData
      );
    }
  }

  clickComp(event) {
    console.log(
      'this.clickedResponse 1',
      event,
      event.target.id,
      this.responseIds,
      this.fibDragResponse
    );
    let divId = '';
    if (event.target.parentNode && event.target.parentNode.id) {
      divId = event.target.parentNode.id;
    } else {
      divId = event.target.id;
    }
    let index = this.responseIds.findIndex(x => x == divId);
    if (event.target.innerHTML == '') {
      // console.log('111111111111111');

      if (this.fibDragResponse) {
        // indexOf(event.target.id);
        // console.log(
        //   'empty',
        //   index,
        //   this.sourceData.data.validation.valid_response.value,
        //   this.sourceData.data.possible_responses[index],
        //   this.possibleResponses,
        //   this.selectedResponses
        // );
        if (!this.previewState) {
          this.sourceData.data.validation.valid_response.value[
            index
          ] = this.fibDragResponse;
          // let resIndex: any;
          this.possibleResponses.forEach((response: any, index) => {
            // console.log('posRes ', response);

            if (response[0].value === this.fibDragResponse.value)
              // resIndex = index;
              response[0].selected = true;
          });
          // console.log('resIndex ', this.fibDragResponse);

          // this.selectedResponses.push(this.fibDragResponse);
          this.sourceData.data.possible_responses = this.possibleResponses;
        } else {
          // console.log('posRes ', this.possibleResponsesPreview);

          this.fibTextValuePreview[index] = this.fibDragResponse.label;
          // let resIndex: any;
          this.possibleResponsesPreview.forEach((response: any, index) => {
            // console.log('posRes ', response, this.fibDragResponse);

            if (response[0].value === this.fibDragResponse.value) {
              // resIndex = index;
              response[0].selected = true;
            }
          });
          this.checkCorrectIncorrect();
          // console.log(
          //   'resIndex ',
          //   this.fibDragResponse,
          //   this.possibleResponsesPreview
          // );
          this.possibleResPreviewEmitter.emit(this.possibleResponsesPreview);
          // this.selectedResponses.push(this.fibDragResponse);
          // this.sourceData.data.possible_responses = this.possibleResponses;
        }
        this.render();
        this.fibDragResponse = null;
        this.sharedComponentService.setFibDragResponse(this.fibDragResponse);
        // console.log(
        //   'empty 1',
        //   index,
        //   this.sourceData.data.validation.valid_response.value,
        //   this.sourceData.data.possible_responses,
        //   this.selectedResponses
        // );

        //   let div = document.getElementById(event.target.id);
        //   let resText = this.renderer.createText(this.fibDragResponse.label);
        //   console.log('empty ', event, this.fibDragResponse.label, div);

        //   // this.renderer.appendChild(div, resText);
      }
    } else {
      let innerText = event.target.innerHTML;
      // console.log('innerText ', innerText);
      if (this.fibDragResponse) {
        // this.possibleResponses.forEach((response: any) => {
        //   let div = this.renderer.createElement('div');
        //   this.renderer.setProperty(div, 'innerHTML', response[0].label);
        //   let newVar = div.textContent || div.innerText || '';
        //   console.log('newVar1 ', newVar, innerText);
        //   if (newVar === innerText) {
        //     response[0].selected = false;
        //   }
        //   if (this.fibDragResponse.value === response[0].value) {
        //     response[0].selected = true;
        //   }
        // });
        // this.sourceData.data.possible_responses = this.possibleResponses;
        // this.sourceData.data.validation.valid_response.value[
        //   index
        // ] = this.fibDragResponse;
        // this.fibDragResponse = null;
        // this.sharedComponentService.setFibDragResponse(this.fibDragResponse);
      } else {
        this.possibleResponses.forEach((response: any) => {
          let div = this.renderer.createElement('div');
          this.renderer.setProperty(div, 'innerHTML', response[0].label);
          let newVar = div.textContent || div.innerText || '';
          // console.log('forInnertext ', innerText, response, newVar);

          if (innerText === newVar) {
            this.fibDragResponseClassify = response[0];
            this.sharedComponentService.setFibDragResponseClassify(
              this.fibDragResponseClassify
            );
          }
        });
        this.sharedComponentService.setDragId(divId);
        // console.log('fibDrag ', this.fibDragResponseClassify, event.target.id);
      }
      this.render();
      // if(this.fibDragResponse){

      // }else{

      // }
    }

    if (this.previewState) {
      let count = 0;
      this.fibTextValuePreview.forEach((res: any) => {
        // console.log('res.trim() ', res, this.fibTextValuePreview.length);

        if (res && res.trim()) {
          count += 1;
        }
      });
      if (count == this.fibTextValuePreview.length) {
        this.allowSubmit.emit(true);
      } else {
        this.allowSubmit.emit(false);
      }
    }
  }

  removeFibValuePreview(index) {
    this.fibTextValuePreview[index] = '';
  }

  textClick(event?) {
    // console.log('localName ', event);

    if (event && event.target.localName === 'p') {
      this.questionEdtorService.updateQuillLoading(false);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Changes', changes);
    if (this.showCorrectAnswer) this.correctIncorrect();
    if (changes.templateMarkUpData) {
      this.templateData = changes.templateMarkUpData.currentValue;
      this.inputText = this.templateData;
      this.render();
    }
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.listenFunc();
    // console.log('fibdestroy');
    // this.previewState.unsubscribe();
    // this.showAnsState.unsubscribe();
    // window.removeEventListener('change',()=>{
    //   console.log('EVent removed!')
    // })
  }

  correctIncorrect() {
    if (this.mode) {
      if (this.fibTextValue) {
        console.log('fibValue ', this.fibTextValue, this.fibTextValuePreview);
        this.fibTextValue.forEach((value: any, index) => {
          if (this.type != 'fib-drag-drop') {
            // console.log('correct incorrect if 1', this.fibTextValue);

            let text: any;
            let span: any;
            if (this.type == 'fib-text') {
              text = document.getElementById(this.responseIds[index]);
              span = document.getElementById(
                `${this.responseIds[index]}-fib-span`
              );
              // console.log(
              //   'text span ',
              //   text,
              //   span,
              //   this.showCorrectAnswer,
              //   this.correctAnswer
              // );
            } else {
              text = document.getElementById(this.responseIds[index]);
              span = document.getElementById(`${index + 1}-fib-drop-span`);
            }
            if (this.showCorrectAnswer) {
              // console.log('text span 1', text, span);

              if (
                this.fibTextValuePreview[index] &&
                value.toLocaleLowerCase().trim() ===
                  this.fibTextValuePreview[index].toLocaleLowerCase().trim()
              ) {
                // console.log('text span 1', text, span);
                if (text && text.classList.contains('incorrect')) {
                  this.renderer.removeClass(text, 'incorrect');
                }
                if (span && span.classList.contains('incorrect-div')) {
                  this.renderer.removeClass(span, 'incorrect-div');
                }
                if (text) {
                  this.renderer.addClass(text, 'correct');
                }
                if (span) {
                  this.renderer.addClass(span, 'correct-div');
                }
              } else {
                if (text && text.classList.contains('correct')) {
                  this.renderer.removeClass(text, 'correct');
                }
                if (span && span.classList.contains('correct-div')) {
                  this.renderer.removeClass(span, 'correct-div');
                }
                if (text) {
                  this.renderer.addClass(text, 'incorrect');
                }
                if (span) {
                  this.renderer.addClass(span, 'incorrect-div');
                }
              }
            } else {
              if (text && text.classList.contains('incorrect')) {
                this.renderer.removeClass(text, 'incorrect');
              }
              if (span && span.classList.contains('incorrect-div')) {
                this.renderer.removeClass(span, 'incorrect-div');
              }
              if (text && text.classList.contains('correct')) {
                this.renderer.removeClass(text, 'correct');
              }
              if (span && span.classList.contains('correct-div')) {
                this.renderer.removeClass(span, 'correct-div');
              }
            }
            // console.log('text span 2', text, span);
          } else {
            let divClass = document.getElementsByClassName(
              'fib-response-input-preview'
            );
            let div = divClass[index];
            console.log(
              'divId ',
              div,
              value.label,
              this.fibTextValuePreview[index]
            );

            if (this.showCorrectAnswer) {
              if (
                this.fibTextValuePreview[index] &&
                value.label.toLocaleLowerCase().trim() ===
                  this.fibTextValuePreview[index].toLocaleLowerCase().trim()
              ) {
                console.log('correctFIB');

                // console.log('text span 1', text, span);
                if (div && div.classList.contains('incorrect-drag')) {
                  this.renderer.removeClass(div, 'incorrect-drag');
                }
                if (div) {
                  this.renderer.addClass(div, 'correct-drag');
                }
              } else {
                if (div && div.classList.contains('correct-drag')) {
                  this.renderer.removeClass(div, 'correct-drag');
                }
                if (div) {
                  this.renderer.addClass(div, 'incorrect-drag');
                }
              }
            } else {
              if (div && div.classList.contains('incorrect-drag')) {
                this.renderer.removeClass(div, 'incorrect-drag');
              }
              if (div && div.classList.contains('correct-drag')) {
                this.renderer.removeClass(div, 'correct-drag');
              }
            }
          }
        });
      }
    } else {
      this.fibTextValue.forEach((value, index) => {
        let text: any;
        let span: any;
        if (this.type != 'fib-drag-drop') {
          text = document.getElementById(this.responseIds[index]);
          if (this.type == 'fib-text') {
            span = document.getElementById(
              `${this.responseIds[index]}-fib-span`
            );
          } else {
            span = document.getElementById(`${index + 1}-fib-drop-span`);
          }
          if (text && text.classList.contains('incorrect')) {
            this.renderer.removeClass(text, 'incorrect');
          }
          if (text && text.classList.contains('correct')) {
            this.renderer.removeClass(text, 'correct');
          }

          if (span && span.classList.contains('incorrect-div')) {
            this.renderer.removeClass(span, 'incorrect-div');
          }
          if (span && span.classList.contains('correct-div')) {
            this.renderer.removeClass(span, 'correct-div');
          }
        } else {
          let divClass = document.getElementsByClassName('fib-response-input');
          let div = divClass[index];
          console.log('divId ', div);
          if (div && div.classList.contains('incorrect-drag')) {
            this.renderer.removeClass(div, 'incorrect-drag');
          }
          if (div && div.classList.contains('correct-drag')) {
            this.renderer.removeClass(div, 'correct-drag');
          }
        }
      });
    }
  }

  checkCorrectIncorrect() {
    let correctAns = this.sourceData.data.validation.valid_response.value;
    let count = 0;
    // console.log(
    //   'correctIncorrect ',
    //   this.sourceData.data.validation.valid_response.value,
    //   this.fibTextValuePreview
    // );
    correctAns.forEach((ans, index) => {
      if (ans.label == this.fibTextValuePreview[index]) {
        count += 1;
      }
    });
    // console.log(
    //   'correctIncorrect ',
    //   this.sourceData.data.validation.valid_response.value,
    //   this.fibTextValuePreview,
    //   count
    // );
    if (count == correctAns.length) {
      this.correctPoints.emit(true);
    } else {
      this.correctPoints.emit(false);
    }
  }
}
