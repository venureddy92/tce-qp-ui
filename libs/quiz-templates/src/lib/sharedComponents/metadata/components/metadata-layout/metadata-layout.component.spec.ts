import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MetadataLayoutComponent } from './metadata-layout.component';

describe('MetadataLayoutComponent', () => {
  let component: MetadataLayoutComponent;
  let fixture: ComponentFixture<MetadataLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetadataLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
