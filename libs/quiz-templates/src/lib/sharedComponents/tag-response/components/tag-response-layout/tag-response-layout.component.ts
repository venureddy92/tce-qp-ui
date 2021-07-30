import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tag-response-layout',
  templateUrl: './tag-response-layout.component.html',
  styleUrls: ['./tag-response-layout.component.scss']
})
export class TagResponseLayoutComponent implements OnInit {
  @Input() option: any;
  constructor() {}

  ngOnInit() {}
}
