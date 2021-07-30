import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatchOptComponent } from './match-opt.component';

describe('MatchOptComponent', () => {
  let component: MatchOptComponent;
  let fixture: ComponentFixture<MatchOptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchOptComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchOptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
