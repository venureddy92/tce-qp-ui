import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'libs/question-bank/dashboard/src/lib/dashboard.service';
import { QUILL_TOKEN } from '../injectors/tokens';
import { loadEditorModule } from '../providers/lazy.provider';

@NgModule({
  providers: [
    {
      provide: QUILL_TOKEN,
      useFactory: loadEditorModule
    }
  ]
})
export class QuizSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: QuizSharedModule,
      providers: [
        DashboardService,
        {
          provide: APP_INITIALIZER,
          useFactory(provider: DashboardService) {
            return () => provider.getQuizdata();
          },
          multi: true,
          deps: [DashboardService]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: QuizSharedModule
    };
  }
}
