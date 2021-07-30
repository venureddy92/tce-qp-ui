import { NgModuleFactory, Type } from '@angular/core';

export const editorModule: {
  name: string;
  loadChildren: () => Promise<NgModuleFactory<any> | Type<any>>;
}[] = [
  {
    name: 'quillLoader',
    loadChildren: () =>
      import(
        './../../../sharedEditors/quill-component/quill-component.module'
      ).then(mod => mod.QuillComponentModule)
  }
];

export function loadEditorModule() {
  const result = {};
  for (const c of editorModule) {
    //console.log(c);
    result[c.name] = c.loadChildren;
  }
  return result;
}

export const optionsModule: {
  name: string;
  loadChildren: () => Promise<NgModuleFactory<any> | Type<any>>;
}[] = [
  {
    name: 'optionLoader',
    loadChildren: () =>
      import(
        './../../classify-row-column/classify-option/classify-option.module'
      ).then(mod => mod.ClassifyOptionModule)
  }
];

export function loadOptionModule() {
  const result = {};
  for (const c of optionsModule) {
    //console.log(c);
    result[c.name] = c.loadChildren;
  }
  return result;
}
