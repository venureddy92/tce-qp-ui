import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedbackModalLayoutComponent } from './feedback-modal-layout.component';

describe('FeedbackModalLayoutComponent', () => {
  let component: FeedbackModalLayoutComponent;
  let fixture: ComponentFixture<FeedbackModalLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackModalLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackModalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
