import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FibImageDragDropLayoutComponent } from './fib-image-drag-drop-layout.component';

describe('FibImageDragDropLayoutComponent', () => {
  let component: FibImageDragDropLayoutComponent;
  let fixture: ComponentFixture<FibImageDragDropLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FibImageDragDropLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FibImageDragDropLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
