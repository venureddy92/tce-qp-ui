import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McqMatrixLabelsLayoutComponent } from './mcq-matrix-labels-layout.component';

describe('McqMatrixLabelsLayoutComponent', () => {
  let component: McqMatrixLabelsLayoutComponent;
  let fixture: ComponentFixture<McqMatrixLabelsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McqMatrixLabelsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqMatrixLabelsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
