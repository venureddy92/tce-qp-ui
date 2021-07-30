import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { QuestionPaperService } from 'libs/question-paper/src/lib/services/question-paper.service';

@Component({
  selector: 'tce-qp-qp-editor',
  templateUrl: './qp-editor.component.html',
  styleUrls: ['./qp-editor.component.scss'],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class  QpEditorComponent {

  template = new FormControl('',[Validators.required]);


  @ViewChild('content')
  private content!: QpEditorComponent; 
   constructor(config: NgbModalConfig, private modalService: NgbModal,private questionPaperService:QuestionPaperService) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.template.valueChanges.subscribe(res=>{
      console.log(res);
    })
  }

  open(content:any) {
    this.modalService.open(content.content);
  }
  createQP(){
    this.questionPaperService.isQpEditor = true;    
  }
  qpSetup(){
    this.questionPaperService.qpSubscription.next();
  }
}