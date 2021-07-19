import { Component, ViewChild } from '@angular/core';
import { QpSetupComponent } from 'libs/question-paper/src/lib/components/qp-setup/qp-setup.component';
import { QuestionPaperService } from 'libs/question-paper/src/lib/services/question-paper.service';

@Component({
  selector: 'tce-qp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'questionpaper';
  constructor(public questionPaperService:QuestionPaperService){

  }
  open(content:QpSetupComponent){
      content.open(content);
  }
  ngOnDestroy(){
    this.questionPaperService.isQpEditor = false;
  }
}
