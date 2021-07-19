import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'tce-qp-qp-editor',
  templateUrl: './qp-editor.component.html',
  styleUrls: ['./qp-editor.component.scss'],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class  QpEditorComponent {

  @ViewChild('content')
  private content!: QpEditorComponent; 
   constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content:any) {
    this.modalService.open(content.content);
  }
}