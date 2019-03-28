import { Component, ComponentInterface, Element, Method, Prop } from '@stencil/core';

@Component({
  tag: 'super-tab',
  styleUrl: 'super-tab.component.scss',
  shadow: true,
})
export class SuperTabComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabElement;

  @Prop({ mutable: true }) active?: boolean;
  @Prop({ mutable: true }) index?: number;

  @Method()
  async getRootScrollableEl(): Promise<HTMLElement | null> {
    if (this.el.scrollHeight > this.el.clientHeight) {
      return this.el;
    }

    const ionContent: any = this.el.querySelector('ion-content');

    if (ionContent) {
      return ionContent.getScrollElement();
    }

    return null;
  }

  render() {
    return <slot/>;
  }
}
