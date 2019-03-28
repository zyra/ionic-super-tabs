import { Component, ComponentInterface, Element, Method, Prop } from '@stencil/core';

@Component({
  tag: 'super-tab',
  styleUrl: 'super-tab.component.scss',
  shadow: true,
})
export class SuperTabComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabElement;

  /** @internal */
  @Prop({ reflectToAttr: true }) active?: boolean;

  /** @internal */
  @Prop({ reflectToAttr: true }) index?: number;

  /**
   * Returns the root scrollable element
   */
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
