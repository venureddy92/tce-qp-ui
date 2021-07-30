import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChoiceMatrixLayoutComponent } from './choice-matrix-layout.component';

describe('ChoiceMatrixLayoutComponent', () => {
  let component: ChoiceMatrixLayoutComponent;
  let fixture: ComponentFixture<ChoiceMatrixLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChoiceMatrixLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoiceMatrixLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
