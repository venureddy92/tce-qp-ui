import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageTemplateLayoutComponent } from './image-template-layout.component';

describe('ImageTemplateLayoutComponent', () => {
  let component: ImageTemplateLayoutComponent;
  let fixture: ComponentFixture<ImageTemplateLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageTemplateLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageTemplateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
