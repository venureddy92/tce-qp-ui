import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpToolbarComponent } from './qp-toolbar.component';

describe('QpToolbarComponent', () => {
  let component: QpToolbarComponent;
  let fixture: ComponentFixture<QpToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QpToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QpToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
