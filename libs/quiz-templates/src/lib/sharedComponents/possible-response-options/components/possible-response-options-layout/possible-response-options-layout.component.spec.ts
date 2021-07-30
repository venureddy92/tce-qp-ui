import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PossibleResponseOptionsLayoutComponent } from './possible-response-options-layout.component';

describe('PossibleResponseOptionsLayoutComponent', () => {
  let component: PossibleResponseOptionsLayoutComponent;
  let fixture: ComponentFixture<PossibleResponseOptionsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PossibleResponseOptionsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PossibleResponseOptionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
