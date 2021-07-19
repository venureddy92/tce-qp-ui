import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpEditorComponent } from './qp-editor.component';

describe('QpEditorComponent', () => {
  let component: QpEditorComponent;
  let fixture: ComponentFixture<QpEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QpEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QpEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
