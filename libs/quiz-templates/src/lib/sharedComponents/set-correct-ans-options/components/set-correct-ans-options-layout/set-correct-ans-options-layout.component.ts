import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  ComponentRef,
  Output,
  Renderer2,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-set-correct-ans-options-layout',
  templateUrl: './set-correct-ans-options-layout.component.html',
  styleUrls: ['./set-correct-ans-options-layout.component.scss']
})
export class SetCorrectAnsOptionsLayoutComponent implements OnInit {
  @Input() public optData: any;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public inputType: string;
  @Input() public inputName: string;
  @Input() public index: number;
  @Input() public optValue: Array<string>;
  @ViewChild('myContentOptions', { static: true })
  public myContentOptions: ElementRef;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  @Output() pushSelectedAns = new EventEmitter();

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
    });

    this.inputName += '-option';
    this.renderer.setAttribute(
      this.myContentOptions.nativeElement,
      'for',
      this.optData.value + '-mcq'
    );
    this.defaultHtml = this.myContentOptions.nativeElement;
    this.defaultHtml = this.defaultHtml.outerHTML;
  }

  /**
   * @description Function to send the options selected by the user to the main component
   * @param event Type = Event
   */
  checkValue(event) {
    this.pushSelectedAns.emit(event.target.value);
  }

  /**
   * @description Function to get the checked status for that particular option
   * @param optData Type = string
   */
  getInputStatus(optData) {
    let status = 0;
    this.optValue.forEach(opt => {
      if (optData === opt) {
        status = 1;
      }
    });

    if (status == 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @description Detects the change in input models
   * @param changes Type = SimpleChanges
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.optData) {
      this.optData.label = changes.optData.currentValue.label;
      this.optData.value = changes.optData.currentValue.value;
    }
  }

  /**
   * @description Destroys subscriptions at destroy event
   * @returns void
   */
  ngOnDestroy() {}
}
