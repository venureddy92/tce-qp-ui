import { TestBed, waitForAsync } from '@angular/core/testing';
import { QuizTemplatesModule } from './quiz-templates.module';

describe('QuizTemplatesModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuizTemplatesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(QuizTemplatesModule).toBeDefined();
  });
});
