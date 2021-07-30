import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedbackLayoutComponent } from './feedback-layout.component';

describe('FeedbackLayoutComponent', () => {
  let component: FeedbackLayoutComponent;
  let fixture: ComponentFixture<FeedbackLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
