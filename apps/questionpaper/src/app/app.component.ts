import { Component, ViewChild } from '@angular/core';
import { QpSetupComponent } from 'libs/question-paper/src/lib/components/qp-setup/qp-setup.component';
import { QuestionPaperService } from 'libs/question-paper/src/lib/services/question-paper.service';
import { McqSingleSelectLayoutComponent } from '@tce-qp/quiz-templates';
//import { McqSingleSelectLayoutComponent } from 'libs/quiz-templates/src/lib/mcq-single-select/components/mcq-single-select-layout/mcq-single-select-layout.component';
@Component({
  selector: 'tce-qp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'questionpaper';
  isdefaultQuestion = false;
  sections: string[] = [];
  @ViewChild('content')
  private content!: QpSetupComponent;
  constructor(public questionPaperService: QuestionPaperService) {
    questionPaperService.qpSubscription.subscribe((res) => {
      this.open(this.content);
    });
  }
  defaultJson = {
    title: '',
    question_type: 'Multiple Choice',
    options: [
      'Multiple Choice',
      'Match the Column',
      'Open Ended',
      'Fill in the Blank',
      'Hotspot',
    ],
  };
  isShown = false;
  questionPaperJson = {
    id: '',
    title: '',
    marks: 10,
    meta: [{ sections: [] }],
  };
  open(content: QpSetupComponent) {
    content.open(content);
    this.questionPaperService.isQpEditor = false;
  }
  ngOnDestroy() {
    this.questionPaperService.isQpEditor = false;
  }

  addSection() {
    this.sections.push('section ' + this.sections.length);
  }

  toggle() {
    this.show = !this.show;
  }
  removeSection(key: any) {
    this.sections.splice(this.sections.indexOf(key), 1);
  }
  show = true;
  createNewQuestion() {
    this.isdefaultQuestion = !this.isdefaultQuestion;
  }
}
