import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageUploadModalLayoutComponent } from './image-upload-modal-layout.component';

describe('ImageUploadModalLayoutComponent', () => {
  let component: ImageUploadModalLayoutComponent;
  let fixture: ComponentFixture<ImageUploadModalLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageUploadModalLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadModalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
