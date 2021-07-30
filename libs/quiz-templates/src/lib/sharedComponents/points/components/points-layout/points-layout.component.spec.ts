import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PointsLayoutComponent } from './points-layout.component';

describe('PointsLayoutComponent', () => {
  let component: PointsLayoutComponent;
  let fixture: ComponentFixture<PointsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PointsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
