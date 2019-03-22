export interface SuperTabsConfig {
  /**
   * Defaults to 40
   */
  maxDragAngle?: number;
  /**
   * Defaults to 20
   */
  dragThreshold?: number;
  /**
   * Allows elements inside tabs to be dragged, defaults to false
   */
  allowElementScroll?: boolean;

  /**
   * Defaults to 150
   */
  transitionDuration?: number;
  /**
   * Defaults to none
   */
  sideMenu?: 'left' | 'right' | 'both';
  /**
   * Defaults to 50
   */
  sideMenuThreshold?: number;

  /**
   * Defaults to 300
   */
  shortSwipeDuration?: number;
}

export const DEFAULT_CONFIG: SuperTabsConfig = {
  dragThreshold: 10,
  allowElementScroll: false,
  maxDragAngle: 40,
  sideMenuThreshold: 50,
  transitionDuration: 300,
  shortSwipeDuration: 300,
};

export type STCoord = {
  x: number;
  y: number;
}

export function pointerCoord(ev: any): STCoord {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== undefined) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
}

export const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

function getScrollCoord(start: number, dest: number, startTime: number, currentTime: number, duration: number) {
  const time = Math.min(1, (currentTime - startTime) / duration);
  const timeFn = easeInOutCubic(time);
  return Math.ceil((timeFn * (dest - start)) + start);
}

function scroll(el: Element, startX: number, x: number, startY: number, y: number, startTime: number, duration: number, callback: Function) {
  const currentTime = window.performance.now();
  const scrollX = getScrollCoord(startX, x, startTime, currentTime, duration);
  const scrollY = getScrollCoord(startY, y, startTime, currentTime, duration);
  el.scrollTo(scrollX, scrollY);

  if (el.scrollLeft === x && el.scrollTop === y) {
    callback();
    return;
  }

  requestAnimationFrame(() => scroll(el, startX, x, startY, y, startTime, duration, callback));
}

export const scrollEl = async (el: Element, x: number, y: number = 0, duration: number = 300) => {
  const startX = el.scrollLeft;
  const startY = el.scrollTop;
  const now = window.performance.now();

  return new Promise<void>(resolve => {
    requestAnimationFrame(() => scroll(el, startX, x, startY, y, now, duration, resolve));
  });
};
