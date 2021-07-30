import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Template2LayoutComponent } from './template2-layout.component';

describe('Template2LayoutComponent', () => {
  let component: Template2LayoutComponent;
  let fixture: ComponentFixture<Template2LayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [Template2LayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template2LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
