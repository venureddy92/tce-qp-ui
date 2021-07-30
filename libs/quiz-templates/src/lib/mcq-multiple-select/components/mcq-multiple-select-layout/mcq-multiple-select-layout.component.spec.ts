import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McqMultipleSelectLayoutComponent } from './mcq-multiple-select-layout.component';

describe('McqMultipleSelectLayoutComponent', () => {
  let component: McqMultipleSelectLayoutComponent;
  let fixture: ComponentFixture<McqMultipleSelectLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McqMultipleSelectLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqMultipleSelectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
