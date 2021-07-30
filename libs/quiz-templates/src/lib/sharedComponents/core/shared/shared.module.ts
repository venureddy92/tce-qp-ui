import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { TemplateConfigProvider } from 'libs/question-bank/quiz-player/src/lib/template-loader/template-config-provider';
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
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        TemplateConfigProvider,
        {
          provide: APP_INITIALIZER,
          useFactory(provider: TemplateConfigProvider) {
            return () => provider.loadConfig();
          },
          multi: true,
          deps: [TemplateConfigProvider]
        }
      ]
    };
  }
}
