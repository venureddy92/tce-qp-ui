import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetCorrectAnsLayoutComponent } from './set-correct-ans-layout.component';

describe('SetCorrectAnsLayoutComponent', () => {
  let component: SetCorrectAnsLayoutComponent;
  let fixture: ComponentFixture<SetCorrectAnsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SetCorrectAnsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCorrectAnsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
