import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RowColTitlesLayoutComponent } from './row-col-titles-layout.component';

describe('RowColTitlesLayoutComponent', () => {
  let component: RowColTitlesLayoutComponent;
  let fixture: ComponentFixture<RowColTitlesLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RowColTitlesLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowColTitlesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
