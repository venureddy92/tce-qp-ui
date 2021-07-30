import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-correct-responses-layout',
  templateUrl: './correct-responses-layout.component.html',
  styleUrls: ['./correct-responses-layout.component.scss']
})
export class CorrectResponsesLayoutComponent implements OnInit {
  @Input() public responses: Array<string>;
  // public responseHtml;

  constructor() {}

  ngOnInit() {
    console.log('REsponses in cp: ', this.responses);
    // this.responseHtml = `<span></span>`
  }
}
