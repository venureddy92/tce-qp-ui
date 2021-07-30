import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HotspotLayoutComponent } from './hotspot-layout.component';

describe('HotspotLayoutComponent', () => {
  let component: HotspotLayoutComponent;
  let fixture: ComponentFixture<HotspotLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HotspotLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotspotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
