import { defineCustomElements } from '@ionic-super-tabs/core/loader';

export function appInit(doc: Document) {
  return (): any => {
    const win: any = doc.defaultView;

    if (win) {
      return defineCustomElements(win);
    }
  };
}
