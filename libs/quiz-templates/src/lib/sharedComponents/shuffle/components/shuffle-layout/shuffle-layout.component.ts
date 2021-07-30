import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dc-shuffle',
  templateUrl: './shuffle-layout.component.html',
  styleUrls: ['./shuffle-layout.component.scss']
})
export class ShuffleLayoutComponent implements OnInit {
  @Input() public inputName: string;
  @Input() public mode: boolean;
  @Input() public shuffleCheck: boolean;
  @Output() public onShuffleChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  getShuffleValue(event): void {
    this.onShuffleChange.next(event.target.checked);
  }

  getInputStatus(): void {}
}
