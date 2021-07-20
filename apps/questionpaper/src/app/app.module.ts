import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {QuestionPaperModule} from '../../../../libs/question-paper/src/lib/question-paper.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,QuestionPaperModule,NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
