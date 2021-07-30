import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { McqSingleSelectLayoutComponent } from './mcq-single-select-layout.component';

describe('McqSingleSelectLayoutComponent', () => {
  let component: McqSingleSelectLayoutComponent;
  let fixture: ComponentFixture<McqSingleSelectLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [McqSingleSelectLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqSingleSelectLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
