import {
  Component,
  OnInit,
  ComponentRef,
  ElementRef,
  Renderer2,
  ViewChild,
  Output,
  Input,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import { SharedComponentService } from '@tce/quiz-templates';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-possible-response-options-layout',
  templateUrl: './possible-response-options-layout.component.html',
  styleUrls: ['./possible-response-options-layout.component.scss']
})
export class PossibleResponseOptionsLayoutComponent implements OnInit {
  @Input() public optData: any;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public inputName: string;
  @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  @Output() removeOption = new EventEmitter();
  @Output() onContentUpdate = new EventEmitter();
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
    });

    this.renderer.setAttribute(
      this.myContent.nativeElement,
      'for',
      this.optData.value + '-mcq'
    );
    this.renderer.appendChild(
      this.myContent.nativeElement,
      this.renderer.createText(this.optData.label)
    );
    this.defaultHtml = this.myContent.nativeElement;
    this.defaultHtml = this.defaultHtml.outerHTML;

    window.addEventListener('click', e => {
      if (
        !this.elementRef.nativeElement.contains(e.target) &&
        this.quillLoaded
      ) {
        this.quillContainer.clear();
        this.comp.destroy();
        this.quillLoaded = false;
      }
    });
  }

  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick() {
    if (!this.mode) {
      this.editorState = true;
      this.loadQuill();
    }
  }

  /**
   * @description This function loads the quill component with @Input & @Output
   * @returns void
   */
  async loadQuill() {
    if (!this.quillLoaded) {
      this.comp = await this.sharedComponentService.loadDynamicEditorModule(
        'quillLoader',
        this.quillContainer
      );
      if (this.comp instanceof ComponentRef) {
        this.quillLoaded = true;
        this.comp.instance.quillConfig = {};
        this.comp.instance.quillHtmlData = this.defaultHtml;
        this.comp.instance.getUpdatedContent.subscribe(data => {
          // console.log(data)
          this.optData.label = data;
          this.onContentUpdate.emit(this.optData);
        });
      }
    }
  }

  /**
   * @description This function emits the removed option to the parent component
   * @param optData Type = object
   * @returns void
   */
  remove(optData) {
    this.removeOption.next(optData);
  }

  ngOnDestroy() {}
}
