import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultipleQuestionLayoutComponent } from './multiple-question-layout.component';

describe('MultipleQuestionLayoutComponent', () => {
  let component: MultipleQuestionLayoutComponent;
  let fixture: ComponentFixture<MultipleQuestionLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleQuestionLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleQuestionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
