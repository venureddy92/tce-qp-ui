import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOptionsLayoutComponent } from './add-options-layout.component';

describe('AddOptionsLayoutComponent', () => {
  let component: AddOptionsLayoutComponent;
  let fixture: ComponentFixture<AddOptionsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddOptionsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOptionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
