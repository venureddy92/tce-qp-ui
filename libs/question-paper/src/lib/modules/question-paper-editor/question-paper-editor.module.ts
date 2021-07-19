import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QpEditorComponent } from './components/qp-editor/qp-editor.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { QuestionPaperTemplateEditiorComponent } from './components/question-paper-template-editior/question-paper-template-editior.component';

@NgModule({
  declarations: [
    QpEditorComponent,
    ToolbarComponent,
    QuestionPaperTemplateEditiorComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    QpEditorComponent,
    QuestionPaperTemplateEditiorComponent,
    ToolbarComponent
  ]
})
export class QuestionPaperEditorModule { }
