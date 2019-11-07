import { NgZone } from '@angular/core';
import { applyPolyfills, defineCustomElements } from '@ionic-super-tabs/core/loader';


let didInitialize = false;

export function appInit(doc: Document, zone: NgZone) {
  return async function () {
    console.log('init');

    const win: any = doc.defaultView as any;

    console.log('Initializing');

    if (!win || didInitialize) {
      return;
    }

    didInitialize = true;

    const aelFn = '__zone_symbol__addEventListener' in (doc.body as any)
      ? '__zone_symbol__addEventListener'
      : 'addEventListener';


    await applyPolyfills();

    await defineCustomElements(win, {
      syncQueue: true,
      raf,
      jmp: (h: any) => zone.runOutsideAngular(h),
      ael(elm, eventName, cb, opts) {
        (elm as any)[aelFn](eventName, cb, opts);
      },
      rel(elm, eventName, cb, opts) {
        elm.removeEventListener(eventName, cb, opts);
      },
    });
  };
};

declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

export const raf = (h: any) => {
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};
