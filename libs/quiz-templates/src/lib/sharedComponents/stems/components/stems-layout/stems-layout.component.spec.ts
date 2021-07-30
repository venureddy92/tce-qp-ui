import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StemsLayoutComponent } from './stems-layout.component';

describe('StemsLayoutComponent', () => {
  let component: StemsLayoutComponent;
  let fixture: ComponentFixture<StemsLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StemsLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StemsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
