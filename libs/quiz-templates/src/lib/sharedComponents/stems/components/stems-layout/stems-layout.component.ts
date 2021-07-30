import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  ComponentRef,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';
import { SharedComponentService } from '../../../core/services/shared-component.service';

@Component({
  selector: 'app-stems-layout',
  templateUrl: './stems-layout.component.html',
  styleUrls: ['./stems-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StemsLayoutComponent implements OnInit {
  @Input() public qstem: any;
  @Input() public previewState: BehaviorSubject<boolean>;
  @Input() public inputType: string;
  @Input() public inputName: string;
  @Input() public formattingOptions: Array<string>;
  @Input() public templateType: string;
  @Input() public templateMode: string;
  @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  @Output() removeStem = new EventEmitter();
  @Output() onQuillUpdated = new EventEmitter();
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  public stem: any;

  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // console.log('Stem Data: ', this.stemData);
    // this.previewState.subscribe((mode: boolean) => {
    //   this.mode = mode;
    // });
    // this.renderer.setAttribute(
    //   this.myContent.nativeElement,
    //   'for',
    //   this.stemData.value + '-mcq'
    // );
    // // this.renderer.setStyle(this.myContent.nativeElement, "width", "80%");
    // this.renderer.appendChild(
    //   this.myContent.nativeElement,
    //   this.renderer.createText(this.stemData.label)
    // );
    // this.defaultHtml = this.myContent.nativeElement;
    // this.defaultHtml = this.defaultHtml.outerHTML;
    // window.addEventListener('click', e => {
    //   if (
    //     !this.elementRef.nativeElement.contains(e.target) &&
    //     this.quillLoaded
    //   ) {
    //     this.quillContainer.clear();
    //     this.comp.destroy();
    //     this.quillLoaded = false;
    //   }
    // });
  }

  /**
   * @description This function renders the label reference in the html
   * @returns void
   */
  renderLabel() {
    // if (this.mode) {
    //   this.renderer.setProperty(
    //     this.myContent.nativeElement,
    //     'innerHTML',
    //     this.qstem.text
    //   );
    //   this.defaultHtml = this.myContent.nativeElement;
    //   this.defaultHtml = this.defaultHtml.outerHTML;
    // } else {
    let div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'innerHTML', this.qstem.text);
    this.defaultHtml = div.outerHTML;

    this.onContainerClick();
    // }
  }

  ngAfterViewInit() {
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
      console.log('PREVIEWMODE: ', mode);
      // if (this.templateType == 'rich-text') {
      //   this.mode = false;
      // }
      // this.renderLabel();
      if (this.mode) {
        this.onContainerClick();
      }
      // this.cdr.detectChanges();
    });
  }

  onContainerClick() {
    // if (!this.mode) {
    //   this.editorState = true;
    this.loadQuill();
    // }
  }

  async loadQuill() {
    console.log(
      'stem mode: ',
      this.templateMode,
      this.formattingOptions,
      this.templateType
    );
    // if (!this.quillLoaded) {
    this.quillContainer.clear();
    this.comp = await this.sharedComponentService.loadDynamicEditorModule(
      'quillLoader',
      this.quillContainer
    );
    if (this.comp instanceof ComponentRef) {
      if (this.templateType == 'rich-text') {
        this.comp.instance.formattingOptions = this.formattingOptions;
        this.comp.instance.templateType = this.templateType;
        this.comp.instance.templateMode = this.mode;
      }
      this.quillLoaded = true;
      this.comp.instance.quillConfig = {};
      this.comp.instance.quillHtmlData = this.defaultHtml;

      this.comp.instance.getQuillUpdated.subscribe(data => {
        this.stem = data;

        this.onQuillUpdated.emit(this.stem);
      });
    }
    // }
  }

  remove(stemData) {
    this.removeStem.next(stemData);
  }

  ngOnDestroy() {}
}
