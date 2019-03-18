import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tabs',
  styleUrl: 'super-tabs.component.scss',
  shadow: true
})
export class SuperTabsComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsElement;
  @State() active: boolean;
  @Prop() index: number;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  @Listen('click')
  async onClick(ev: MouseEvent) {
    console.log('This el is ', this.el, ev);
    // const ripple: HTMLIonRippleEffectElement = this.el.shadowRoot.querySelector('ion-ripple-effect');
    // await ripple.addRipple(ev.pageX, ev.pageY);
  }

  render() {
    return <slot></slot>;
  }
}
