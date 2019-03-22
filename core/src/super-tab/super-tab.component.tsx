import { Component, ComponentInterface, Element, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tab',
  styleUrl: 'super-tab.component.scss',
  shadow: true,
})
export class SuperTabComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabElement;
  @State() active?: boolean;
  @Prop() index?: number;

  render() {
    return <slot/>;
  }
}
