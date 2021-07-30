import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorrectResponsesLayoutComponent } from './correct-responses-layout.component';

describe('CorrectResponsesLayoutComponent', () => {
  let component: CorrectResponsesLayoutComponent;
  let fixture: ComponentFixture<CorrectResponsesLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectResponsesLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectResponsesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
