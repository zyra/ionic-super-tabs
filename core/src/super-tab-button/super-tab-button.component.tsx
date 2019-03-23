import { Component, ComponentInterface, Element, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tab-button',
  styleUrl: 'super-tab-button.component.scss',
  shadow: true,
})
export class SuperTabButtonComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabButtonElement;

  @Prop({ mutable: true }) active?: boolean;
  @Prop() index?: number;
  @Prop() disabled?: boolean;

  @State() label!: HTMLElement | null;
  @State() icon!: HTMLElement | null;

  indexChildren() {
    this.label = this.el.querySelector('ion-label');
    this.icon = this.el.querySelector('ion-icon');
  }

  componentWillLoad() {
    this.indexChildren();
  }

  componentDidUpdate() {
    this.indexChildren();
  }

  hostData() {
    return {
      role: 'button',
      'aria-label': this.label ? this.label.innerText : false,
      'aria-disabled': this.disabled ? 'true' : false,
      class: {
        'ion-activatable': true,
        'ion-focusable': true,
        'icon-only': !!this.icon && !this.label,
        'label-only': !!this.label && !this.icon,
        active: Boolean(this.active),
      },
    };
  }

  render() {
    return [
      <slot/>,
      <ion-ripple-effect type="unbounded"/>,
    ];
  }
}
