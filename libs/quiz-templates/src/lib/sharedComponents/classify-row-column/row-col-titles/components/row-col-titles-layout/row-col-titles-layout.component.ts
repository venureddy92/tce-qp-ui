import {
  Component,
  OnInit,
  Renderer2,
  ChangeDetectorRef,
  ComponentRef,
  EventEmitter,
  Output,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  Input,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateMcqOption } from 'libs/quiz-templates/src/lib/core/interface/quiz-player-template.interface';
import { SharedComponentService } from '../../../../core/services/shared-component.service';
@Component({
  selector: 'row-col-titles',
  templateUrl: './row-col-titles-layout.component.html',
  styleUrls: ['./row-col-titles-layout.component.scss']
})
export class RowColTitlesLayoutComponent implements OnInit, AfterViewInit {
  @Input() public data: string;
  @Input() public matrixData: TemplateMcqOption;
  @Input() public previewState: BehaviorSubject<boolean>;
  @ViewChild('myContent', { static: true }) public myContent: ElementRef;
  @ViewChild('quillContainer', { static: false, read: ViewContainerRef })
  public quillContainer: ViewContainerRef;
  @Output() onContentUpdate = new EventEmitter();
  @Output() onContentUpdateFocus = new EventEmitter();
  public selectedAns;
  public defaultHtml: any = '';
  public editorState: boolean = false;
  public quillLoaded: boolean = false;
  public mode: boolean = true;
  public comp: ComponentRef<any>;
  constructor(
    private renderer: Renderer2,
    private sharedComponentService: SharedComponentService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.previewState.subscribe((mode: boolean) => {
      this.mode = mode;
      if (mode) {
        this.renderLabel();
        // this.cdr.detectChanges();
      }
      // this.renderLabel();
      // if(!this.mode) {
      //   this.onContainerClick()
      // }
    });
    // console.log("Row column Data",this.data)
  }
  ngAfterViewInit(): void {
    this.renderLabel();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('Changes', changes);
    // this.quillLoaded = false;
    this.data = changes.data.currentValue;
    this.renderLabel();
  }

  /**
   * @description This function renders the label reference in the html
   * @returns void
   */
  renderLabel(): void {
    console.log('data:', this.data);
    if (this.matrixData) {
      if (this.mode) {
        this.renderer.setProperty(
          this.myContent.nativeElement,
          'innerHTML',
          this.matrixData.label
        );

        this.defaultHtml = this.myContent.nativeElement;
        this.defaultHtml = this.defaultHtml.outerHTML;
      } else {
        let div = this.renderer.createElement('div');
        this.renderer.setProperty(div, 'innerHTML', this.matrixData.label);
        this.defaultHtml = div.outerHTML;

        this.onContainerClick();
      }
    } else {
      if (this.mode) {
        this.renderer.setProperty(
          this.myContent.nativeElement,
          'innerHTML',
          this.data
        );
        this.defaultHtml = this.myContent.nativeElement;
        this.defaultHtml = this.defaultHtml.outerHTML;
      } else {
        let div = this.renderer.createElement('div');
        this.renderer.setProperty(div, 'innerHTML', this.data);
        this.defaultHtml = div.outerHTML;
        this.onContainerClick();
      }
      console.log('ROW COL', this.mode, this.data, this.quillLoaded);
    }
  }
  /**
   * @description This function checks whether preview mode is on or off & accordingly sets the editorMode
   * @returns void
   */
  onContainerClick(): void {
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
        this.comp.instance.quillConfig = { name: `${this.data}-mcq` };
        this.comp.instance.quillHtmlData = this.defaultHtml;
        this.comp.instance.getUpdatedContent.subscribe(data => {
          this.data = data;
          if (this.mode) {
            this.renderer.setProperty(
              this.myContent.nativeElement,
              'innerHTML',
              this.data
            );
            this.defaultHtml = this.myContent.nativeElement;
            this.defaultHtml = this.defaultHtml.outerHTML;
          }
          console.log('Content Update', this.data);
          this.onContentUpdate.emit(this.data);
        });
        if (this.comp.instance.getUpdatedContentFocus)
          this.comp.instance.getUpdatedContentFocus.subscribe(data => {
            this.data = data;
            if (this.mode) {
              this.renderer.setProperty(
                this.myContent.nativeElement,
                'innerHTML',
                this.data
              );
              this.defaultHtml = this.myContent.nativeElement;
              this.defaultHtml = this.defaultHtml.outerHTML;
            }
            this.onContentUpdateFocus.emit(this.data);
          });
        if (this.comp.instance.getImageTag)
          this.comp.instance.getImageTag.subscribe(image => {
            console.log(image);
          });
      }
    }
  }
}
