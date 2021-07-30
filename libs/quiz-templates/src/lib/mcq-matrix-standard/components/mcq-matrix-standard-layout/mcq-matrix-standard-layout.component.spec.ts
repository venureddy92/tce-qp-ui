import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McqMatrixStandardLayoutComponent } from './mcq-matrix-standard-layout.component';

describe('McqMatrixStandardLayoutComponent', () => {
  let component: McqMatrixStandardLayoutComponent;
  let fixture: ComponentFixture<McqMatrixStandardLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McqMatrixStandardLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqMatrixStandardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
