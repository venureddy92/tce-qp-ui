import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ElementRef,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-metadata-layout',
  templateUrl: './metadata-layout.component.html',
  styleUrls: ['./metadata-layout.component.scss']
})
export class MetadataLayoutComponent implements OnInit {
  @Input() public sidebarShow: boolean;
  @Input() public metaData: object;
  @Output() toggleSidebar = new EventEmitter();
  public subjects: Array<String> = [];

  constructor(private eRef: ElementRef) {}

  ngOnInit() {
    if (this.metaData) this.subjects = this.metaData['subjects'];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.metaData.currentValue) {
      this.metaData['subjects'] = this.subjects =
        changes.metaData.currentValue.subjects;
    }

    // if(changes.sidebarShow) {
    //   if(changes.sidebarShow.previousValue) {
    //     if(changes.sidebarShow.currentValue) {
    //       this.showSidebar = true
    //     }
    //   }
    //   else {
    //     this.showSidebar = false
    //   }
    // }
  }

  /**
   * @description This function hides the sidebar
   * @returns void
   */
  hideSidebar(): void {
    let meta = this.metaData;
    meta['subjects'] = this.subjects;
    this.sidebarShow = !this.sidebarShow;

    this.toggleSidebar.emit(this.metaData);
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if (this.eRef.nativeElement.contains(event.target)) {
  //     console.log('Clicked inside');
  //     // this.sidebarShow = true;
  //   } else {
  //     console.log('clicked outside');
  //   }
  // }
}
