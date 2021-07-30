import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassifyOptionComponent } from './classify-option.component';

describe('SortListOptComponent', () => {
  let component: ClassifyOptionComponent;
  let fixture: ComponentFixture<ClassifyOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClassifyOptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifyOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
