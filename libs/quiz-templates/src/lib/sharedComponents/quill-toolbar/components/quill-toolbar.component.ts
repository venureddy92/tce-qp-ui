import { Component, Input, OnInit } from '@angular/core';
import { QuestionEditorService } from '@tce/template-editor';
import Quill from 'quill';
import { TemplateMarker } from '../../../sharedEditors/quill-component/template-maker.class';
import { NbTooltipComponent } from '@nebular/theme';
import { SharedComponentService } from '../../core/services/shared-component.service';

@Component({
  selector: 'tce-quill-toolbar',
  templateUrl: './quill-toolbar.component.html',
  styleUrls: ['./quill-toolbar.component.scss']
})
export class QuillToolbarComponent implements OnInit {
  @Input() public templateType: string;
  public quillInstance: any;
  public componentName: any;
  rangeIndex: number;
  public addLinkOption: boolean = false;
  public addedLink: string = '';

  public addMathFormulaOption: boolean = false;
  public mathFormula: string = '';
  public optionLayout: string = '';

  constructor(
    private questionEditorService: QuestionEditorService,
    public sharedComponentService: SharedComponentService
  ) {}

  ngOnInit(): void {
    this.questionEditorService.getInstance().subscribe(instance => {
      this.quillInstance = instance;
    });
    this.questionEditorService.getComponentName().subscribe(name => {
      this.componentName = name;
    });
    TemplateMarker.blotName = 'TemplateMarker';
    TemplateMarker.tagName = 'RESPONSE';
    Quill.register({
      'formats/TemplateMarker': TemplateMarker
    });
    this.questionEditorService.getOptionLayout().subscribe(layout => {
      this.optionLayout = layout;
    });
  }

  bold() {
    if (this.quillInstance) {
      if (this.quillInstance.getFormat().bold)
        this.quillInstance.format('bold', false);
      else this.quillInstance.format('bold', true);
    }
  }

  italic() {
    console.log('instance ', this.quillInstance);

    if (this.quillInstance) {
      if (this.quillInstance.getFormat().italic)
        this.quillInstance.format('italic', false);
      else this.quillInstance.format('italic', true);
    }
  }

  underline() {
    if (this.quillInstance) {
      if (this.quillInstance.getFormat().underline)
        this.quillInstance.format('underline', false);
      else this.quillInstance.format('underline', true);
    }
  }

  strikethrough() {
    if (this.quillInstance) {
      if (this.quillInstance.getFormat().strike)
        this.quillInstance.format('strike', false);
      else this.quillInstance.format('strike', true);
    }
  }

  alignRight() {
    if (this.quillInstance) {
      console.log('getFormat', this.quillInstance.getFormat().align);
      if (this.quillInstance.getFormat().align === 'right') {
        console.log('getFormat center', this.quillInstance.getFormat());
        this.quillInstance.format('align', '');
      } else {
        this.quillInstance.format('align', 'right');
      }
    }
  }

  alignCenter() {
    if (this.quillInstance) {
      console.log('getFormat', this.quillInstance.getFormat().align);
      if (this.quillInstance.getFormat().align === 'center') {
        console.log('getFormat center', this.quillInstance.getFormat());
        this.quillInstance.format('align', '');
      } else {
        this.quillInstance.format('align', 'center');
      }
    }
  }

  alignLeft() {
    if (this.quillInstance) {
      console.log('getFormat', this.quillInstance.getFormat().align);
      this.quillInstance.format('align', '');
    }
  }

  changeColor(e) {
    var color = e.target.value;
    if (this.quillInstance) {
      this.quillInstance.format('color', color);
    }
  }

  openLink() {
    this.addLinkOption = !this.addLinkOption;
    this.addMathFormulaOption = false;
    let range = this.quillInstance.getSelection(true);
    if (this.quillInstance) {
      if (range && range.length != 0) {
        var text = this.quillInstance.getText(range.index, range.length);
        this.addedLink = text;
      }
    }
  }

  addLink() {
    if (this.quillInstance) {
      this.quillInstance.format('link', this.addedLink);
      this.addLinkOption = false;
    }
  }

  addMathFormula() {
    var range = this.quillInstance.getSelection(true);
    if (this.quillInstance) {
      this.quillInstance.insertText(range.index, this.mathFormula);
      this.addMathFormulaOption = false;
    }
  }

  addResponseTag(tagName: string) {
    // code for response tag START
    let quillInstance = this.quillInstance.editor;
    let range = this.quillInstance.getSelection(true);
    console.log(' RANGE ', range);
    quillInstance.insertEmbed(
      range.index,
      //Insert the TemplateMarker in the same range as the cursor is
      'TemplateMarker',
      //This is the name of the Embed
      {
        colour: 'red',
        marker: 'Response',
        title: 'Response'
      }
      //These are the variables to enter
    );

    quillInstance.insertText(range.index + 1, '', Quill.sources.API);
    //Add a space after the marker
    this.quillInstance.setSelection(range.index + 2, Quill.sources.API);
    //Take the cursor to the end of the inserted TemplateMarker
    this.rangeIndex = range.index;
  }

  numberedList() {
    if (this.quillInstance) {
      this.quillInstance.format('list', 'ordered', true);
    }
  }
  bulletList() {
    if (this.quillInstance) {
      this.quillInstance.format('list', 'bullet', true);
    }
  }

  uploadImage() {
    if (this.quillInstance) {
      this.sharedComponentService.imageUploadModalService({
        type: 'editor',
        state: true,
        name: this.componentName
      });
    }
  }
  changeOptionLayout(ev) {
    this.optionLayout = ev.target.value;
    this.questionEditorService.setOptionLayout(this.optionLayout);
    this.questionEditorService.changeLayoutSet(true);
  }
}
