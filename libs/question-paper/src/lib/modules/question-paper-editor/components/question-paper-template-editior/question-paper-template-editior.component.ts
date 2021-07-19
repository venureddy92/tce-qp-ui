import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'tce-qp-question-paper-template-editior',
  templateUrl: './question-paper-template-editior.component.html',
  styleUrls: ['./question-paper-template-editior.component.scss']
})
export class QuestionPaperTemplateEditiorComponent implements OnInit {

  
  @ViewChild('content')
  private content!: ToolbarComponent; 
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {
    setTimeout(()=>{
     // this.openToolbarContent(this.content);
   },3000)
  }

  open(content:any) {
    this.modalService.open(content.content, { windowClass: 'dark-theme-modal',size: 'lg', centered: true});

  }
  openToolbarContent(content:any) {
    this.modalService.open(content.content, { windowClass: 'dark-theme-modal',size: 'lg', centered: true});
  }
}
