import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { TemplateToken } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { OptComponent } from 'libs/quiz-templates/src/lib/sharedComponents/opt/components/opt-layout/opt.component';
import { SharedComponentService } from 'libs/quiz-templates/src/lib/sharedComponents/core/services/shared-component.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { QuestionEditorService } from '@tce/template-editor';

@Component({
  selector: 'app-token-highlight-layout',
  templateUrl: './token-highlight-layout.component.html',
  styleUrls: ['./token-highlight-layout.component.scss']
})
export class TokenHighlightLayoutComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() public templateData: TemplateToken;
  @Input() public previewState: boolean;
  @Input() public sourceState: BehaviorSubject<boolean>;
  @Input() public showAnsState: BehaviorSubject<boolean>;
  @Input() public submit: Subject<void>;
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
  public clickcheck: boolean = true;
  public templateName: string;
  public templateText: string;
  public highlightedTexts: Array<object> = [];
  public highlightedTextsIds: Array<string> = [];

  // show:boolean = false;
  // availableTokens: Array<object> = [];
  // possibleAnsers:Array<string> = [];

  public tokens: string;
  public tokensTemplate: object;
  public isEditTemplate: boolean = true;
  public isEditTokens: boolean = false;
  public isSelectAnswers: boolean = false;
  public isAnswer: boolean = false;
  public template: string; //"<p>Risus et tincidunt turpis <strong>facilisis</strong>.</p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. dignissim, et tincidunt turpis facilisis.</p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>";
  public templateSafeHtml: SafeHtml;
  public selectTemplate: string;
  public answerTemplate: string;
  // availableTokens: Array<string> = [];

  public possibleAnswers: Array<string> = [];
  // selectedAnswers:Array<string> = [];

  @Output() public showAnswers = new EventEmitter();
  public selectedAnswersData: Array<string> = [];
  public answerState: object = {};
  public sampleAnswerData: object = {};

  private quillInstanceSubscription: Subscription;
  public quillInstance: any;

  constructor(
    public sharedComponentService: SharedComponentService,
    public changeRef: ChangeDetectorRef,
    public renderer: Renderer2,
    private elem: ElementRef,
    private domSanitizer: DomSanitizer,
    private questionEditorService: QuestionEditorService
  ) {}

  ngOnInit() {
    this.quillInstanceSubscription = this.questionEditorService
      .getInstance()
      .subscribe(instance => {
        this.quillInstance = instance;
      });

    this.initState();
  }

  ngAfterViewInit(): void {
    // this.previewSubscription = this.previewState.subscribe((state: boolean) => {
    // this.previewShow = this.previewState;
    if (this.previewShow) {
      this.isAnswer = true;
      this.answerOnPreview();
    } else {
      if (this.showAnsStateFlag) {
        this.undoShowAnswer();
      }
      this.editTemplateClicked();

      // this.selectedAnswers = [];
      // this.correctAnsPoints = 0;
      // this.emitCorrectAnswer()
    }
    // console.log("this.sourceData ", this.sourceData);
    this.sharedComponentService.imageModalOpen.next({});
    // });

    // this.sourceSubscription = this.sourceState.subscribe(state => {
    //   this.sourceModalOpen.next(state);
    // });

    // this.showAnsSubscription = this.showAnsState.subscribe(state => {
    //   this.showAnsStateFlag = state;
    //   if (this.showAnsStateFlag) {
    // call check answer
    // this.checkAnswer();
    // this.checkAnswerFlag = true;
    //     this.showAnswer();
    //   } else {
    //     this.undoShowAnswer();
    //   }
    // });

    this.submitSubscription = this.submit.subscribe(() => this.onSubmit());
    if (this.dashboardPreviewState) {
      this.dashboardPreviewSubscription = this.dashboardPreviewState.subscribe(
        state => {
          this.dashboardPreviewShow = state;
        }
      );
    }
    // this.changePointsValue();
    // this.emitAns();
  }

  //Output function which retrieves the source json from the app-source-json-layout component
  changeSourceState(sourceJson: TemplateToken): void {
    // console.log('Source State Called', sourceJson);
    this.templateData = sourceJson;
    this.selectedAnswers = [];
    this.initState();
    // this.emitAns();
    this.emitSelectedAnswers();
    this.sourceStateChange.emit(false);
    this.sharedComponentService.imageUploadModalService({});
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
    console.log('this.templateData -->> ', this.templateData);
    this.qstem = {
      text: this.templateData.data.stimulus.label,
      value: this.templateData.data.stimulus.value,
      feedbackInline: this.templateData.data.stimulus.feedbackInline
    };
    this.tokens = this.templateData.data.tokens;
    this.tokensTemplate = {
      text: this.templateData.data.template,
      value: this.templateData.data.stimulus.value
    };
    this.layout = this.getLayoutType(this.templateData.data.ui_style.type);
    this.inputName = this.templateData.reference;
    // this.saveArr = this.templateData.data.areas;
    this.points = this.templateData.data.validation.valid_response.score;
    this.possibleAnswers = this.templateData.data.validation.valid_response.value;
    this.sourceData = this.templateData;
    this.metaData = this.templateData.data.metadata;
    this.templateType = this.templateData.type;
    this.template = this.templateData.data.template;
    this.tokens = this.templateData.data.tokens;
    this.templateName = this.templateData.name;
    this.templateSafeHtml = this.getSafeHtml(this.tokens);
    this.templateText = this.templateData.data.templateText;
    console.log('Safe hmtl', this.templateSafeHtml);
    // this.clearNumbers();
    // this.clearPolygons();
    // this.clearPolygons();
    // this.reRenderAllPolygons();
    // this.reRenderAllNumbers();
    // console.log("this.sourceData -> ", this.sourceData);
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
    this.sharedComponentService.imageUploadModalService({
      type: 'hotspot',
      state: true
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

  /** ************** Token Template code starts here ****************** */

  onTokensTemplateUpdate(updatedContent) {
    if (updatedContent.text !== this.templateData.data.template) {
      this.templateData.data.template = updatedContent.text;
      this.tokensTemplate['text'] = this.templateData.data.template;
      this.template = this.templateData.data.template;
      this.tokens = updatedContent.text;
      this.templateSafeHtml = this.getSafeHtml(this.tokens);
    }
    // this.templateSafeHtml = this.getSafeHtml(this.template);
    // console.log("Tokens data before update is ", this.tokens);
    // this.tokens =  this.templateData.data.template;
    // this.templateData.data.tokens ;
  }

  editTemplateClicked() {
    this.isEditTemplate = true;
    this.isEditTokens = false;
    this.isSelectAnswers = false;
    this.isAnswer = false;
  }

  selectAnswersClicked() {
    this.selectTemplate = this.tokens.replace(
      /tokenClass/g,
      'baseClass selectClass'
    );
    this.templateSafeHtml = this.getSafeHtml(this.selectTemplate);
    this.isEditTemplate = false;
    this.isEditTokens = false;
    this.isSelectAnswers = true;
    console.log(
      'template is in selectAnswersClicked',
      this.tokens,
      this.isSelectAnswers
    );
  }

  // select(){
  //   this.isSelectAnswers = true;
  //   this.isEditTokens = false;
  //   this.selectTemplate = this.template.replace(/tokenClass/g, 'baseClass selectClass');
  //   this.templateSafeHtml = this.getSafeHtml(this.selectTemplate);
  // }

  editTokenClicked() {
    console.log('template is ', this.tokens);
    this.isEditTemplate = false;
    this.isSelectAnswers = false;
    this.templateSafeHtml = this.getSafeHtml(this.tokens);
    this.isEditTokens = true;
  }

  answerOnPreview() {
    this.checkPossibleAnswers();
    this.answerTemplate = this.tokens.replace(
      /tokenClass/g,
      'baseClass selectClass'
    );
    this.templateSafeHtml = this.getSafeHtml(this.answerTemplate);
    this.isAnswer = true;
    this.isSelectAnswers = false;
    this.isEditTemplate = false;
    this.isEditTokens = false;
    this.isSelectAnswers = false;
  }

  onMouseUp(evt) {
    console.log('in mouse up');
    // if(this.clickcheck) {
    var selection = window.getSelection();
    if (
      evt.target.nodeName === 'SPAN' &&
      selection.toString().length < 1 &&
      !this.isSelectAnswers &&
      !this.isAnswer
    ) {
      console.log('Called 1', evt.target);
      let textContent = evt.target.innerHTML;
      evt.target.parentNode.removeChild(evt.target);
      this.pasteHtmlAtCaret(textContent);
      this.tokens = document.getElementById('editTokenContainer').innerHTML;
      this.templateData.data.tokens = this.tokens;
    } else if (!this.isSelectAnswers && !this.isAnswer) {
      // add tokens
      if (selection.toString().length < 1) {
        if (!selection || selection.rangeCount < 1) return true;
        var range = selection.getRangeAt(0);
        var node = selection.anchorNode;
        var word_regexp = /^\w*$/;
        // @ts-ignore
        // Extend the range backward until it matches word beginning
        while (range.startOffset > 0 && range.toString().match(word_regexp)) {
          range.setStart(node, range.startOffset - 1);
        }
        // Restore the valid word match after overshooting
        if (!range.toString().match(word_regexp)) {
          range.setStart(node, range.startOffset + 1);
        }
        // Extend the range forward until it matches word ending
        // @ts-ignore
        while (
          //@ts-ignore
          range.endOffset < node.length &&
          range.toString().match(word_regexp)
        ) {
          range.setEnd(node, range.endOffset + 1);
        }
        // Restore the valid word match after overshooting
        if (!range.toString().match(word_regexp)) {
          range.setEnd(node, range.endOffset - 1);
        }
        console.log('Called 2');
      }
      if (
        evt.target.nodeName === 'SPAN' &&
        this.hasClass(evt.target, 'tokenClass')
      ) {
        console.log('Called 3');
        return;
      } else {
        // let div = this.renderer.createElement('div');
        // this.renderer.setProperty(div, 'innerHTML', selectedHtml);
        // console.log(div, div.parentElement, div.childNodes)
        if (evt.target.innerHTML.length > 0) {
          let selectedHtml = this.getSelectionHtml();
          console.log(selectedHtml, 'selectedHtml');

          if (selectedHtml) {
            // console.log("Compare", selectedHtml, evt.target.parentNode)
            selectedHtml = selectedHtml.replace(
              /<span class="tokenClass">/g,
              ''
            );
            selectedHtml = selectedHtml.replace(/<\/span>/g, '');
            let html = `<span class="tokenClass">${selectedHtml}</span>`;

            console.log(
              'Called 4',
              selectedHtml,
              evt.target,
              evt.target.innerHTML
            );
            this.pasteHtmlAtCaret(html);
          }
        }
        console.log('Called 5', evt.target, '----', evt.target.innerHTML);
      }
      this.tokens = document.getElementById('editTokenContainer').innerHTML;
      this.templateData.data.tokens = this.tokens;
    } else if (
      evt.target.nodeName === 'SPAN' &&
      this.isSelectAnswers &&
      !this.isAnswer
    ) {
      // select answer

      if (this.hasClass(evt.target, `selectedClass`)) {
        this.renderer.removeClass(evt.target, 'selectedClass');
        this.renderer.addClass(evt.target, 'selectClass');
      } else {
        this.renderer.removeClass(evt.target, 'selectClass');
        this.renderer.addClass(evt.target, 'selectedClass');
      }
      // let html = `<span class="baseClass ${className}">${innerHtml}</span>`;
      // evt.target.parentNode.removeChild(evt.target);
      // this.pasteHtmlAtCaret(html);
      this.checkPossibleAnswers();
      console.log('Called 6', evt.target);
    } else if (evt.target.nodeName === 'SPAN' && this.isAnswer) {
      // answer in preview
      if (this.hasClass(evt.target, `answerdClass`)) {
        this.renderer.removeClass(evt.target, 'answerdClass');
        this.renderer.addClass(evt.target, 'selectClass');
      } else {
        this.renderer.removeClass(evt.target, 'selectClass');
        this.renderer.addClass(evt.target, 'answerdClass');
      }

      this.answerTemplate = document.getElementById(
        'answerContainer'
      ).innerHTML;
      this.checkSelectedAnswers();
      console.log('Called 7');
    }
    // this.tokens = document.getElementById('editTokenContainer').innerHTML;
    //   this.templateData.data.tokens = this.tokens;
    // console.log("Inner Html",document.getElementById('editTokenContainer').innerHTML, this.tokens)
  }

  onMouseUpPreview(evt) {
    console.log('event ', evt);
  }

  checkSelectedAnswers() {
    let elements = this.elem.nativeElement.querySelectorAll('.baseClass');
    let elementsLength = elements.length;
    let className = 'answerdClass';
    this.selectedAnswers = [];
    // console.log("Element", elements)
    for (let i = 0; i < elementsLength; i++) {
      let currentElement = elements[i];

      if (this.hasClass(currentElement, className)) {
        this.selectedAnswers.push(`${i}`);
      }
    }
    let finalAnswer =
      JSON.stringify(this.possibleAnswers) ==
      JSON.stringify(this.selectedAnswers);
    if (finalAnswer === true) {
      this.correctAnsPoints = this.points;
    } else {
      this.correctAnsPoints = 0;
    }
    this.emitCorrectAnswer();
  }

  checkPossibleAnswers() {
    if (document.getElementById('selectAnswers')) {
      let elements = document
        .getElementById('selectAnswers')
        .querySelectorAll('.baseClass');
      let elementsLength = elements.length;
      let className = 'selectedClass';
      this.possibleAnswers = [];

      for (let i = 0; i < elementsLength; i++) {
        let currentElement = elements[i];

        if (this.hasClass(currentElement, className)) {
          this.possibleAnswers.push(`${i}`);
        }
      }

      this.templateData.data.validation.valid_response.value = this.possibleAnswers;
    }
  }

  hasClass(target, className) {
    return target.classList.contains(className);
  }

  getSafeHtml(htmlString) {
    return this.domSanitizer.bypassSecurityTrustHtml(htmlString);
  }

  getSelectionHtml() {
    var range = window.getSelection().getRangeAt(0),
      content = range.extractContents(),
      span = document.createElement('SPAN');
    span.appendChild(content);
    console.log('Get selection', range, content, span);
    var htmlContent = span.innerHTML;
    if (
      !htmlContent.includes('id="template"') &&
      !htmlContent.includes('id="editToken"')
    ) {
      range.insertNode(span);
      return htmlContent;
    } else {
      let div = this.renderer.createElement('div');
      this.renderer.setProperty(div, 'innerHTML', this.template);
      this.templateSafeHtml = this.getSafeHtml(this.template);
      console.log('Template safe', this.templateSafeHtml);
      return;
    }
  }

  showAnswer() {
    let elements = this.elem.nativeElement.querySelectorAll('.baseClass');
    let elementsLength = elements.length;
    console.log('Show answer', this.possibleAnswers, this.selectedAnswers);
    for (let i = 0; i < elementsLength; i++) {
      let currentValue = `${i}`;
      if (this.possibleAnswers.includes(currentValue)) {
        // show correct answer
        if (this.selectedAnswers.includes(currentValue)) {
          this.answerTemplate = this.replace_nth(
            this.answerTemplate,
            'answerdClass',
            'correctAnswer',
            1
          );
        } else {
          this.answerTemplate = this.replace_nth(
            this.answerTemplate,
            'selectClass',
            'correctAnswer',
            1
          );
        }
      } else if (this.selectedAnswers.includes(currentValue)) {
        this.answerTemplate = this.replace_nth(
          this.answerTemplate,
          'answerdClass',
          'wrongAnswer',
          1
        );
      } else {
        this.answerTemplate = this.replace_nth(
          this.answerTemplate,
          'selectClass',
          'tempClass',
          1
        );
      }
    }

    this.templateSafeHtml = this.getSafeHtml(this.answerTemplate);
    console.log('--->>>> this.answerTemplate ', this.answerTemplate);
  }

  undoShowAnswer() {
    let elements = this.elem.nativeElement.querySelectorAll('.baseClass');
    let elementsLength = elements.length;
    for (let i = 0; i < elementsLength; i++) {
      let currentValue = `${i}`;
      if (this.possibleAnswers.includes(currentValue)) {
        // show correct answer
        if (this.selectedAnswers.includes(currentValue)) {
          // this.answerTemplate = this.replace_nth(this.answerTemplate, "answerdClass", "correctAnswer", ((i)-(noOfAnsweredClassesRemoved)) === 0 ? 1 : ((i)-(noOfAnsweredClassesRemoved)));
          this.answerTemplate = this.replace_nth(
            this.answerTemplate,
            'correctAnswer',
            'answerdClass',
            1
          );
        } else {
          this.answerTemplate = this.replace_nth(
            this.answerTemplate,
            'correctAnswer',
            'selectClass',
            1
          );
        }
      } else if (this.selectedAnswers.includes(currentValue)) {
        this.answerTemplate = this.replace_nth(
          this.answerTemplate,
          'wrongAnswer',
          'answerdClass',
          1
        );
      } else {
        this.answerTemplate = this.replace_nth(
          this.answerTemplate,
          'tempClass',
          'selectClass',
          1
        );
      }
    }
    this.templateSafeHtml = this.getSafeHtml(this.answerTemplate);
  }

  replace_nth(source, pattern, replace, n) {
    return source.replace(pattern, replace);
    //  return source.replace(RegExp(pattern + "$"), replace);

    // return source.replace(RegExp("^(?:.*?" + pattern + "){" + 1 + "}"), x => x.replace(RegExp(pattern + "$"), replace));
  }

  pasteHtmlAtCaret(html) {
    var sel, range;
    console.log('Paste html called');
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        // Range.createContextualFragment() would be useful here but is
        // only relatively recently standardized and is not supported in
        // some browsers (IE9, for one)
        var el = document.createElement('div');
        el.innerHTML = html;
        var frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

  breakToken(flag) {
    // if (window.getSelection) {
    //   if (window.getSelection().empty) {  // Chrome
    //     window.getSelection().empty();
    //   } else if (window.getSelection().removeAllRanges) {  // Firefox
    //     window.getSelection().removeAllRanges();
    //   }
    // }
    let div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'innerHTML', this.template);
    console.log('div tag', div);
    // prompt('Token', JSON.stringify(this.template))

    let tokens = '';
    for (let i = 0; i < div.getElementsByTagName('p').length; i++) {
      if (flag == 'para') {
        let para = `<span class="tokenClass">${
          div.getElementsByTagName('p')[i].innerHTML
        }</span>`;
        tokens += para;
      } else {
        let tokenArray = div
          .getElementsByTagName('p')
          [i].innerHTML.split(/[\.!\?]+/);

        for (let index = 0; index < tokenArray.length; index++) {
          if (flag == 'words') {
            let words = tokenArray[index].split(' ');
            console.log('Words', words);

            for (let j = 0; j < words.length; j++) {
              if (words[j].length > 0) {
                // if(/<\/?[a-z][\s\S]*>/words[j].test()) {
                if (this.isHTML(words[j])) {
                  let div = this.renderer.createElement('div');
                  this.renderer.setProperty(div, 'innerHTML', words[j]);
                  let innerHTML = div.childNodes[0].innerHTML;
                  this.renderer.setProperty(
                    div.childNodes[0],
                    'innerHTML',
                    `<span class="tokenClass">${innerHTML}</span> `
                  );
                  words[j] = div.childNodes[0].outerHTML;
                } else {
                  words[j] = `<span class="tokenClass">${words[j]}</span> `;
                }
                // }

                tokens += `${words[j]}`;
              }
            }
          } else if (flag == 'sentence') {
            tokenArray[
              index
            ] = `<span class="tokenClass">${tokenArray[index]}</span> `;
            tokens += tokenArray[index];
          }
        }
      }
    }

    let outerDiv = this.renderer.createElement('p');
    this.renderer.setProperty(outerDiv, 'innerHTML', tokens);
    console.log('Outer Html', outerDiv.outerHTML);

    this.tokens = outerDiv.outerHTML;
    this.templateSafeHtml = this.getSafeHtml(this.tokens);
    console.log('Token Array', this.tokens, this.templateSafeHtml);
    // selectedHtml = selectedHtml.replace(/<span class="tokenClass">/g, '');
    //     selectedHtml = selectedHtml.replace(/<\/span>/g, '');
    //     let html = `<span class="tokenClass">${selectedHtml}</span>`;
  }

  isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) return true;
    }

    return false;
  }

  /** ************** Token Template code ends here ****************** */
  //Destroys subscriptions at destroy event
  ngOnDestroy() {
    // this.submitSubscription.unsubscribe();
    // this.previewSubscription.unsubscribe();
    // this.sourceSubscription.unsubscribe();
    // this.showAnsSubscription.unsubscribe();
    if (this.dashboardPreviewSubscription)
      this.dashboardPreviewSubscription.unsubscribe();
  }

  feedbackStemUpdate(ev) {
    console.log(ev);
  }

  sampleAnswerUpdate(event) {
    console.log(event);
  }

  onTemplateDataUpdate(ev) {
    console.log('eventText ', ev);
    this.templateText = ev.text;
    this.templateData.data.templateText = ev.text;
  }

  getSelectedText() {
    var range = this.quillInstance.getSelection(true);
    console.log(range, range.index, 'rrrange');

    if (range) {
      if (range.length == 0) {
        console.log('User cursor is at index', range.index);
      } else {
        let text = this.quillInstance.getText(range.index, range.length);
        console.log('User has highlighted: ', text, this.highlightedTexts);
        let responseSpan = this.renderer.createElement('code');
        let spanText = this.renderer.createText(text);
        this.renderer.appendChild(responseSpan, spanText);
        let spanOuterHtml = responseSpan.outerHTML;
        this.quillInstance.deleteText(range, range.length);
        this.quillInstance.clipboard.dangerouslyPasteHTML(
          range.index,
          spanOuterHtml
        );
      }
    } else {
      console.log('User cursor is not in editor');
    }
  }
}
