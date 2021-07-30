import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SourceJsonLayoutComponent } from './source-json-layout.component';

describe('SourceJsonLayoutComponent', () => {
  let component: SourceJsonLayoutComponent;
  let fixture: ComponentFixture<SourceJsonLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SourceJsonLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceJsonLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
