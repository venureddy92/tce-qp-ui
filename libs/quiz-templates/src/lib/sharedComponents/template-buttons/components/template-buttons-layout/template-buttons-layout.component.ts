import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-template-buttons-layout',
  templateUrl: './template-buttons-layout.component.html',
  styleUrls: ['./template-buttons-layout.component.css']
})
export class TemplateButtonsLayoutComponent implements OnInit {
  @Input() public layout: string;
  @Input() public deviceView: string;
  @Input() public previewShow: boolean;
  @Output() public toggleSidebar = new EventEmitter();
  @Output() public saveData = new EventEmitter();
  @Output() public layoutChange = new EventEmitter();
  @Output() public deviceViewChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  /**
   * @description This function emits an output emitter to change the layout of the quiz player
   * @param event Type = Event
   * @returns void
   */
  onLayoutChange(event): void {
    this.layoutChange.emit(event);
  }

  /**
   * @description This function emits an output emitter to save data
   * @returns void
   */
  onSave(): void {
    this.saveData.emit();
  }

  /**
   * @description This function emits an output emitter to toggle the metadata sidebar
   * @returns void
   */
  toggle(): void {
    this.toggleSidebar.emit();
  }

  /**
   * @description This function emits an output emitter to change the screen resolution
   * @param event
   * @returns void
   */
  onDeviceViewChange(event) {
    this.deviceViewChange.emit(event);
  }
}
