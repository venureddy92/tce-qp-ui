import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McqMatrixInlineLayoutComponent } from './mcq-matrix-inline-layout.component';

describe('McqMatrixInlineLayoutComponent', () => {
  let component: McqMatrixInlineLayoutComponent;
  let fixture: ComponentFixture<McqMatrixInlineLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McqMatrixInlineLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqMatrixInlineLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
