import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  TemplateMcqData,
  TemplateClassifyGroupData,
  TemplateFibImage,
  TemplateHotspot,
  shortText
} from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
@Component({
  selector: 'app-source-json-layout',
  templateUrl: './source-json-layout.component.html',
  styleUrls: ['./source-json-layout.component.scss']
})
export class SourceJsonLayoutComponent implements OnInit {
  @Input() sourceData: any;
  public sourceInput: string;
  @Input() sourceModalOpen: BehaviorSubject<boolean>;
  private sourceSubscription: Subscription;
  @Output() changeSourceState = new EventEmitter();
  public tempSourceJson: object = {};
  public updateCheck: boolean = false;
  public counter: number = 0;
  constructor(
    public modalService: NgxSmartModalService,
    public changeRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    console.log('SOURCEDATA: ', this.sourceData);
    this.sourceSubscription = this.sourceModalOpen.subscribe(
      (state: boolean) => {
        console.log('Source JSON DATA ### ', this.sourceData);
        if (state) {
          this.updateCheck = false;
          if (typeof this.sourceData === 'string') {
            this.sourceInput = JSON.parse(this.sourceData);
          }

          this.tempSourceJson = {};

          this.tempSourceJson = this.sourceData;

          //Beautifies the json
          this.sourceInput = JSON.stringify(this.sourceData, undefined, 4);
          this.modalService.getModal('sourceModal').open();

          //Called on modal dismiss
          // this.modalService
          //   .getModal('sourceModal')
          //   .onDismissFinished.subscribe((modal: NgxSmartModalComponent) => {
          //     this.closeModal();
          //   });

          // //Called when modal has been closed by clicking on its backdrop
          // this.modalService
          //   .getModal('sourceModal')
          //   .onCloseFinished.subscribe((modal: NgxSmartModalComponent) => {
          //     if (this.updateCheck) {
          //       let sourceValue = {};
          //       if (this.updateCheck && this.sourceInput.length > 0) {
          //         sourceValue = JSON.parse(this.sourceInput);
          //       } else {
          //         if (this.sourceInput.length == 0 && this.counter == 0) {
          //           alert('Invalid source JSON format!');
          //         }
          //         this.counter += 1;
          //         sourceValue = this.tempSourceJson;
          //       }
          //       this.changeSourceState.emit(sourceValue);
          //     }
          //   });
        }
      }
    );
  }

  /**
   * @description Function to close modal
   * @returns void
   */
  closeModal(): void {
    let sourceData;
    if (!this.updateCheck || this.sourceInput.length == 0) {
      sourceData = this.tempSourceJson;
    } else {
      sourceData = JSON.parse(this.sourceInput);
    }
    this.changeSourceState.emit(sourceData);
  }

  /**
   * @description Function to update the contents inside the json modal
   * @returns void
   */
  updateSource(): void {
    this.updateCheck = true;
    this.modalService.getModal('sourceModal').close();
  }

  /**
   * @description Destroys subscriptions at destroy event
   * @returns void
   */
  ngDestroy() {
    this.sourceSubscription.unsubscribe();
  }
}
