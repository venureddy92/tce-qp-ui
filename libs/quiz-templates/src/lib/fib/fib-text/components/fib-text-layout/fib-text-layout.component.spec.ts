import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FibTextLayoutComponent } from './fib-text-layout.component';

describe('FibTextLayoutComponent', () => {
  let component: FibTextLayoutComponent;
  let fixture: ComponentFixture<FibTextLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FibTextLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FibTextLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
