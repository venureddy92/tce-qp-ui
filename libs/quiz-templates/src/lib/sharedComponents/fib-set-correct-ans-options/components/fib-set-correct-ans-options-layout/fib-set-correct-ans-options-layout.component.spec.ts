import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FibSetCorrectAnsOptionsLayoutComponent } from './fib-set-correct-ans-options-layout.component';

describe('FibSetCorrectAnsOptionsLayoutComponent', () => {
  let component: FibSetCorrectAnsOptionsLayoutComponent;
  let fixture: ComponentFixture<FibSetCorrectAnsOptionsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FibSetCorrectAnsOptionsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FibSetCorrectAnsOptionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
