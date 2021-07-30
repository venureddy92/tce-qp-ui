import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClassifyMatchOption } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { SharedComponentService } from '@tce/quiz-templates';

@Component({
  selector: 'app-add-options-layout',
  templateUrl: './add-options-layout.component.html',
  styleUrls: ['./add-options-layout.component.scss']
})
export class AddOptionsLayoutComponent implements OnInit {
  @Input() opts: Array<ClassifyMatchOption>;
  @Input() type: string;
  @Output() pushOptions = new EventEmitter();
  @Output() pushStems = new EventEmitter();
  // @Input() public previewState: boolean = false;
  public mode: boolean = false;

  constructor(public sharedComponentService: SharedComponentService) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  //Function to add options
  addOptions() {
    let incrementedVal = '0';
    if (this.type == 'stem') {
      if (this.opts.length > 0) {
        incrementedVal = (
          parseInt(this.opts[this.opts.length - 1]['value']) + 1
        ).toString();
      }
      let option = {
        text: '',
        value: incrementedVal
      };
      this.pushStems.next(option);
    } else {
      if (this.opts.length > 0) {
        let optsArray = [...this.opts];
        this.sharedComponentService.reOrderArray(optsArray);
        incrementedVal = (
          parseInt(optsArray[optsArray.length - 1]['value']) + 1
        ).toString();
      }
      let option = {
        label: '',
        value: incrementedVal
      };
      if (this.type != 'match-option') {
        option['placeholder'] = 'Type The Answer Option Here...';
      }
      this.pushOptions.next(option);
    }
  }
}
