import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {QuestionPaperModule} from '../../../../libs/question-paper/src/lib/question-paper.module'
//import {QuizTemplatesModule} from '../../../../libs/quiz-templates/src/lib/quiz-templates.module'
//import { McqSingleSelectModule } from '../../../libs/quiz/'
//lib/mcq-single-select/mcq-single-select.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { McqSingleSelectModule } from 'libs/quiz-templates/src/lib/mcq-single-select/mcq-single-select.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,QuestionPaperModule,NgbModule,FormsModule,ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
