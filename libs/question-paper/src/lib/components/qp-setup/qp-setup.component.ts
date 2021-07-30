import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../../modal.config'
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { QuestionPaperService } from '../../services/question-paper.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormattedError } from '@angular/compiler';

@Component({
  selector: 'tce-qp-qp-setup',
  templateUrl: './qp-setup.component.html',
  styleUrls: ['./qp-setup.component.scss'],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class QpSetupComponent {

  
   myForm:FormGroup = new FormGroup({});
  @ViewChild('content')
  private content!: QpSetupComponent; 
   constructor(config: NgbModalConfig, private modalService: NgbModal,private questionPaperService:QuestionPaperService,private formBuilder:FormBuilder) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    this.createFormGroup();
  }

   createFormGroup(){
      this.myForm.addControl("subject",this.formBuilder.control("",[Validators.required]));
      this.myForm.addControl("title",this.formBuilder.control("CBSE Class 10 Science (Standard) Question Paper 2020 Set 1",[Validators.required]));
      this.myForm.addControl("format",this.formBuilder.control("",[Validators.required]));
      this.myForm.addControl("time",this.formBuilder.control("",[Validators.required]));
      this.myForm.addControl("marks",this.formBuilder.control("",[Validators.required]));
      this.myForm.valueChanges.subscribe(res=>{
        console.log(res);
      })
   }

  open(content:any) {
    this.modalService.open(content.content, { windowClass: 'dark-theme-modal',size: 'lg', centered: true});
  }
  defineTemplate(content:any){
    this.createLocalStorage();
    this.modalService.open(content.content, { windowClass: 'dark-theme-modal',size: 'lg', centered: true });
  }
  continueWithoutTemplate(){
    this.createLocalStorage();
    this.questionPaperService.isQpEditor = true;
  }
  createLocalStorage(){
  var guuid = this.questionPaperService.uuidv4();
  var data = this.myForm.getRawValue();
  data.id = guuid;
  var list = localStorage.getItem("qpList");
  var qpList = list && list !=null ?JSON.parse(list):[];
  qpList.push(data);
  localStorage.setItem('qpList',JSON.stringify(qpList))
  }
}