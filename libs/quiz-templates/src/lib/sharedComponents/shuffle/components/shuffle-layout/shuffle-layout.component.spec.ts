import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShuffleLayoutComponent } from './shuffle-layout.component';

describe('ShuffleLayoutComponent', () => {
  let component: ShuffleLayoutComponent;
  let fixture: ComponentFixture<ShuffleLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShuffleLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuffleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
