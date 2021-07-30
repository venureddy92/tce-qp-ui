import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddStemsLayoutComponent } from './add-stems-layout.component';

describe('AddStemsLayoutComponent', () => {
  let component: AddStemsLayoutComponent;
  let fixture: ComponentFixture<AddStemsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddStemsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStemsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
