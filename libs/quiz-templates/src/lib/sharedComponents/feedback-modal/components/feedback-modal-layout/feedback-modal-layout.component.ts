import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'adc-workspace-feedback-modal-layout',
  templateUrl: './feedback-modal-layout.component.html',
  styleUrls: ['./feedback-modal-layout.component.scss']
})
export class FeedbackModalLayoutComponent implements OnInit {
  constructor(
    public modalService: NgxSmartModalService,
    public changeRef: ChangeDetectorRef
  ) {}

  @Input() feedbackModalOpen: BehaviorSubject<boolean>;
  @Input() feedbackData: string;
  private showAnswerSubscription: Subscription;

  ngOnInit() {
    this.showAnswerSubscription = this.feedbackModalOpen.subscribe(value => {
      console.log('Value', value);
      if (value && this.feedbackData) {
        this.modalService.getModal('feedbackModal').open();
      }
    });
  }

  closeModal() {}
}
