import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';

@Component({
  tag: 'super-tab-button',
  styleUrl: 'super-tab-button.component.scss',
  shadow: true,
})
export class SuperTabButtonComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabButtonElement;
  @Prop() active: boolean;
  @Prop() index: number;
  @Prop() disabled: boolean;

  @Event() stFocus!: EventEmitter<HTMLSuperTabButtonElement>;
  @Event() stBlur!: EventEmitter<HTMLSuperTabButtonElement>;
  @Event() stClick!: EventEmitter<HTMLSuperTabButtonElement>;

  private parent: HTMLSuperTabsToolbarElement;

  @Listen('click')
  async onClick() {
    this.stClick.emit(this.el);
    this.parent.onButtonClick(this.el);
  }

  @Listen('focus')
  onFocus() {
    this.stFocus.emit(this.el);
  }

  @Listen('blur')
  onBlur() {
    this.stFocus.emit(this.el);
  }

  @Method()
  setParent(parent: HTMLSuperTabsToolbarElement) {
    this.parent = parent;
  }

  hostData() {
    const label: HTMLIonLabelElement = this.el.querySelector('ion-label');

    return {
      role: 'button',
      'aria-label': label ? label.innerText : undefined,
      'aria-disabled': this.disabled ? 'true' : undefined,
      class: {
        'ion-activatable': true,
        'ion-focusable': true,
      },
    };
  }

  render() {
    console.log('im alive!');
    return [
      <slot></slot>,
      <ion-ripple-effect type="unbounded"></ion-ripple-effect>,
    ];
  }
}
