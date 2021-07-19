import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPaperTemplateEditiorComponent } from './question-paper-template-editior.component';

describe('QuestionPaperTemplateEditiorComponent', () => {
  let component: QuestionPaperTemplateEditiorComponent;
  let fixture: ComponentFixture<QuestionPaperTemplateEditiorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionPaperTemplateEditiorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPaperTemplateEditiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
