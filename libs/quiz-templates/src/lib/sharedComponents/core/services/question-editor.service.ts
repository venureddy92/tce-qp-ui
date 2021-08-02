import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { QuestionEditorContainerComponent } from '../component/question-editor-container/question-editor-container.component';

@Injectable({
  providedIn: 'root'
})
export class QuestionEditorService {
  private previewStateGlobal: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private layoutChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private showAnsStateObject: BehaviorSubject<object> = new BehaviorSubject<
    object
  >({});
  private submitAnsShow: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private quillInstance = new Subject<any>();
  private componentName = new Subject<any>();
  private qStem: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private options: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);
  private templateText: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private qStemImageMode: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public allQuestions: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private editOptions: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  private qstemImageMode: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  private questionData: BehaviorSubject<Array<object>> = new BehaviorSubject<
    Array<object>
  >([]);
  private quillLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private correctAnswers = new Subject<any>();
  private responses: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private possibleResponses: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  private responseIds: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private newResponseFlag = new Subject<boolean>();
  private allowAddResponse = new Subject<boolean>();
  private highlightedTexts: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private highlightedTextsIds: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );

  private showControllerFlag: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(true);
  private templateData: BehaviorSubject<object> = new BehaviorSubject<any>({});

  private optionLayout: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private newResponseId: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private selectedChapter = new ReplaySubject();
  private selectedTopic = new ReplaySubject();
  private selectedGrade = new ReplaySubject();
  private selectedSubject = new ReplaySubject();
  private allChapters = new ReplaySubject();

  public questionBankMode = new BehaviorSubject('QB');
  public questionBankMode$ = this.questionBankMode.asObservable();

  // private selectedChapter$ = selecte

  constructor(
    private http: HttpClient // protected ref: NbDialogRef<QuestionEditorContainerComponent>
  ) {}

  getTemplatesData(): Observable<any> {
    return this.http.get('assets/json/templates.json');
  }

  getPreviewState() {
    return this.previewStateGlobal;
  }

  updatePreviewState(bool) {
    this.previewStateGlobal.next(bool);
  }

  getAnsStateObject() {
    return this.showAnsStateObject;
  }

  updateAnswerStateObject(data) {
    this.showAnsStateObject.next(data);
  }

  updateSubmitAnsShow(bool) {
    this.submitAnsShow.next(bool);
  }

  getSubmitAnsShow() {
    return this.submitAnsShow;
  }

  setInstance(instance) {
    this.quillInstance.next(instance);
    //console.log('setInstance in quill ', this.quillInstance);
  }
  getInstance() {
    return this.quillInstance.asObservable();
  }

  setComponentName(name) {
    //console.log('componentName ', name);
    this.componentName.next(name);
  }

  getComponentName() {
    return this.componentName.asObservable();
  }

  updateQstem(data) {
    this.qStem.next(data);
  }

  getQstem() {
    return this.qStem.asObservable();
  }

  updateOptions(data) {
    this.options.next(data);
  }

  getOptions() {
    return this.options.asObservable();
  }

  updateTemplateText(text) {
    this.templateText.next(text);
  }

  getTemplateText() {
    return this.templateText.asObservable();
  }

  updateQstemImage(data) {
    this.qstemImageMode.next(data);
  }

  getQstemImage() {
    return this.qstemImageMode.asObservable();
  }

  changeEditQuestionData(data) {
    //console.log('editQuestionData befre ', data);
    this.allQuestions.next(data);
  }

  getEditQuestionData() {
    return this.allQuestions;
  }

  updateOptionsEditMode(index) {
    this.editOptions.next(index);
  }

  getOptionsEditMode() {
    return this.editOptions.asObservable();
  }

  //Commented by Usman on 29/12/20. can be used later
  updateQuestionsData(qData) {
    this.questionData.next(qData);
    //console.log('UpdatedQuestionsData ', qData);
  }

  updateQuillLoading(bool) {
    //console.log('quillLoad ', bool);
    this.quillLoaded.next(bool);
  }

  getQuillLoading() {
    return this.quillLoaded.asObservable();
  }

  updateResponses(responses) {
    this.responses.next(responses);
  }

  getResponses() {
    return this.responses.asObservable();
  }

  updatePossibleResponses(responses) {
    this.possibleResponses.next(responses);
  }

  getPossibleResponses() {
    return this.possibleResponses.asObservable();
  }

  updateResponseIds(ids) {
    this.responseIds.next(ids);
  }

  setNewResponseId(id) {
    this.newResponseId.next(id);
  }

  getNewResponseId() {
    return this.newResponseId;
  }

  getResponseIds() {
    return this.responseIds.asObservable().pipe(
      tap(data => {
        //console.log('res id tap', data);
      })
    );
  }

  getTextFromIndex(index) {
    let uId = this.responseIds[index];
    // console.log(
    //   'TextIndex ',
    //   this.responseIds,
    //   this.responses,
    //   index,
    //   uId,
    //   this.responses[uId]
    // );

    return this.responses[uId];
  }

  updateNewResponseFlag(flag) {
    this.newResponseFlag.next(flag);
  }

  getNewResponseFlag() {
    return this.newResponseFlag.asObservable();
  }

  getShowController() {
    return this.showControllerFlag.asObservable();
  }
  updateShowController(flag) {
    this.showControllerFlag.next(flag);
  }
  updateAllowAddResponse(bool) {
    this.allowAddResponse.next(bool);
  }
  getAllowAddResponse() {
    return this.allowAddResponse.asObservable();
  }

  updateHighlightedTexts(texts) {
    this.highlightedTexts.next(texts);
  }

  getHighlightedTexts() {
    return this.highlightedTexts.asObservable();
  }

  updateHighlightedTextsIds(ids) {
    this.highlightedTextsIds.next(ids);
  }

  getHighlightedTextsIds() {
    return this.highlightedTextsIds.asObservable();
  }

  updateTemplateData(data) {
    this.templateData.next(data);
  }

  getTemplateData() {
    return this.templateData.asObservable();
  }

  getOptionLayout() {
    return this.optionLayout.asObservable();
  }
  setOptionLayout(data) {
    this.optionLayout.next(data);
  }

  changeLayoutSet(bool) {
    this.layoutChange.next(bool);
  }

  changeLayoutGet() {
    return this.layoutChange.asObservable();
  }

  setSelectedChapter(chapter) {
    console.log('setChapter ', chapter);
    this.selectedChapter.next(chapter);
  }
  getSelectedChapter() {
    return this.selectedChapter.asObservable();
  }
  setSelectedTopic(topic) {
    console.log('setTopic ', topic);

    this.selectedTopic.next(topic);
  }
  getSelectedTopic() {
    return this.selectedTopic.asObservable();
  }

  setGrade(grade) {
    this.selectedGrade.next(grade);
  }

  getSelectedGrade() {
    return this.selectedGrade.asObservable();
  }

  setSubject(subject) {
    this.selectedSubject.next(subject);
  }

  getSelectedSubject() {
    return this.selectedSubject.asObservable();
  }

  setAllChapters(chapters) {
    this.allChapters.next(chapters);
  }

  getAllChapters() {
    return this.allChapters.asObservable();
  }
  // closeDialog() {
  //   this.ref.close();
  // }
}
