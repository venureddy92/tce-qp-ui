import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'adc-workspace-points-layout',
  templateUrl: './points-layout.component.html',
  styleUrls: ['./points-layout.component.css']
})
export class PointsLayoutComponent implements OnInit {
  @Input() inputType: string;

  constructor() {}

  ngOnInit() {}
}
