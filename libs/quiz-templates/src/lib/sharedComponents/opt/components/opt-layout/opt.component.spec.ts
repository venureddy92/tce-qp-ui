import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptComponent } from '../../components/opt-layout/opt.component';

describe('OptComponent', () => {
  let component: OptComponent;
  let fixture: ComponentFixture<OptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OptComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
