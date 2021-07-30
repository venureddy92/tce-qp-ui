import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateMarkupLayoutComponent } from './template-markup-layout.component';

describe('TemplateMarkupLayoutComponent', () => {
  let component: TemplateMarkupLayoutComponent;
  let fixture: ComponentFixture<TemplateMarkupLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateMarkupLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateMarkupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
