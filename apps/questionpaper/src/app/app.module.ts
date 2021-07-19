import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {QuestionPaperModule} from '../../../../libs/question-paper/src/lib/question-paper.module'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,QuestionPaperModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
