import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpSetupComponent } from './qp-setup.component';

describe('QpSetupComponent', () => {
  let component: QpSetupComponent;
  let fixture: ComponentFixture<QpSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QpSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QpSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
