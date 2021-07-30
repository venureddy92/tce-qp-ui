import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuillToolbarComponent } from '../components/quill-toolbar.component';

describe('QuillToolbarComponent', () => {
  let component: QuillToolbarComponent;
  let fixture: ComponentFixture<QuillToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuillToolbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
