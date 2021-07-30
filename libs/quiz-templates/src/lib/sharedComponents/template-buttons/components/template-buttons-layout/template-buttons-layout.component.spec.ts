import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateButtonsLayoutComponent } from './template-buttons-layout.component';

describe('TemplateButtonsLayoutComponent', () => {
  let component: TemplateButtonsLayoutComponent;
  let fixture: ComponentFixture<TemplateButtonsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateButtonsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateButtonsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
