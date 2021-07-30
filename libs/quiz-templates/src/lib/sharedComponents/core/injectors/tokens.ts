import { InjectionToken } from '@angular/core';

export const QUILL_TOKEN = new InjectionToken<{ [key: string]: string }>(
  'QUILL_TOKEN'
);
