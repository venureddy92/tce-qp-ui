import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagResponseLayoutComponent } from './tag-response-layout.component';

describe('TagResponseLayoutComponent', () => {
  let component: TagResponseLayoutComponent;
  let fixture: ComponentFixture<TagResponseLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TagResponseLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagResponseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
