import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-stems-layout',
  templateUrl: './add-stems-layout.component.html',
  styleUrls: ['./add-stems-layout.component.css']
})
export class AddStemsLayoutComponent implements OnInit {
  @Input() stems: Array<object>;
  @Output() pushStems = new EventEmitter();
  @Input() public previewState: BehaviorSubject<boolean>;
  public mode: boolean = true;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
    });
  }

  addStems() {
    let incrementedVal = '0';
    if (this.stems.length > 0) {
      incrementedVal = (
        parseInt(this.stems[this.stems.length - 1]['value']) + 1
      ).toString();
    }
    let stem = { label: '[Stem     ]', value: incrementedVal };
    // this.opts.push(option)
    this.pushStems.next(stem);
  }
}
