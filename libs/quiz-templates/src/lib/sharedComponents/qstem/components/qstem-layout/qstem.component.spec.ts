import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QstemComponent } from './qstem.component';

describe('QstemComponent', () => {
  let component: QstemComponent;
  let fixture: ComponentFixture<QstemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QstemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QstemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
