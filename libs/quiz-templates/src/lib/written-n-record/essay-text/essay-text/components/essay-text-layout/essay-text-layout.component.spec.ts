import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayTextLayoutComponent } from './essay-text-layout.component';

describe('EssayTextLayoutComponent', () => {
  let component: EssayTextLayoutComponent;
  let fixture: ComponentFixture<EssayTextLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EssayTextLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayTextLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
