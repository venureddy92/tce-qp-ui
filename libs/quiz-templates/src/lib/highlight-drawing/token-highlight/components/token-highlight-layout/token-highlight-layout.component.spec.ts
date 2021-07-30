import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TokenHighlightLayoutComponent } from './token-highlight-layout.component';

describe('TokenHighlightLayoutComponent', () => {
  let component: TokenHighlightLayoutComponent;
  let fixture: ComponentFixture<TokenHighlightLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TokenHighlightLayoutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenHighlightLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
