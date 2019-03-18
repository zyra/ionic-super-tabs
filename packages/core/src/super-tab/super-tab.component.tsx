import { Component, Prop, State, ComponentInterface, Element, Event, EventEmitter, Listen } from '@stencil/core';

@Component({
  tag: 'super-tab',
  styleUrl: 'super-tab.component.scss',
  shadow: true
})
export class SuperTabComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabElement;

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
