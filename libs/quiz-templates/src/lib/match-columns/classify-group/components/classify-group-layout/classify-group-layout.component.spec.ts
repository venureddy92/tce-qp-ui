import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassifyGroupLayoutComponent } from './classify-group-layout.component';

describe('ClassifyGroupLayoutComponent', () => {
  let component: ClassifyGroupLayoutComponent;
  let fixture: ComponentFixture<ClassifyGroupLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClassifyGroupLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassifyGroupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
