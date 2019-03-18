import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
// import { pointerCoord, STCoord } from '../../super-tabs.model';

@Component({
  tag: 'super-tabs-container',
  styleUrl: 'super-tabs-container.component.scss',
  shadow: true
})
export class SuperTabsContainerComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsContainerElement;
  @State() active: boolean;
  @Prop() index: number;

  @Event() ionTouchStart!: EventEmitter<TouchEvent>;
  @Event() ionTouchMove!: EventEmitter<TouchEvent>;
  @Event() ionTouchEnd!: EventEmitter<TouchEvent>;

  // private shouldCapture: boolean;
  // private initialCoords: STCoord;

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    let avoid: boolean;
    let element: any = ev.target;

    if (element) {
      do {
        if (typeof element.getAttribute === 'function' && element.getAttribute('avoid-super-tabs')) {
          return;
        }

        element = element.parentElement;
      } while (element && !avoid);
    }

    // const coords = pointerCoord(ev);
    // TODO: handle threshold, sidemenu ... etc

    // this.initialCoords = coords;

    // TODO: handle short swipe duration

    // this.lastPosX

  }

  hostData() {
    return {

    }
  }

  render() {
    return <slot></slot>;
  }
}
