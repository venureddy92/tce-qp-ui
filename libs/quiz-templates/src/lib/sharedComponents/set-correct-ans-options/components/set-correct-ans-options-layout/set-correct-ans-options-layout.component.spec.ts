import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetCorrectAnsOptionsLayoutComponent } from './set-correct-ans-options-layout.component';

describe('SetCorrectAnsOptionsLayoutComponent', () => {
  let component: SetCorrectAnsOptionsLayoutComponent;
  let fixture: ComponentFixture<SetCorrectAnsOptionsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetCorrectAnsOptionsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCorrectAnsOptionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
