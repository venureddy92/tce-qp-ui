import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  ComponentRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedComponentService } from '../../core/services/shared-component.service';

@Component({
  selector: 'app-choice-matrix-layout',
  templateUrl: './choice-matrix-layout.component.html',
  styleUrls: ['./choice-matrix-layout.component.css']
})
export class ChoiceMatrixLayoutComponent implements OnInit {
  @Input() public optData: any;
  @Input() public stemData: any;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public inputType: string;
  @Input() public inputName: string;
  @Input() public type: string;
  @Input() public labelsData: any;
  @Output() pushSelectedAns = new EventEmitter();

  // @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  public defaultHtml: any = '';
  public alphabets: Array<string> = [];
  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    console.log('stem Data: ', this.stemData);
    console.log('opt Data: ', this.optData);
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
    });
  }

  checkValue(i, event) {
    var data = { i, event };
    // console.log(event);
    if (!this.mode) {
      this.pushSelectedAns.emit(data);
    }
  }
}
