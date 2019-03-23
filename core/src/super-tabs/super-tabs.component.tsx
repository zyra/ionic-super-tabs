import { Component, ComponentInterface, Element, Prop, Method } from '@stencil/core';
import { DEFAULT_CONFIG, SuperTabsConfig } from '../super-tabs.model';

@Component({
  tag: 'super-tabs',
  styleUrl: 'super-tabs.component.scss',
  shadow: true,
})
export class SuperTabsComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsElement;

  /**
   * Global Super Tabs configuration
   */
  @Prop() config: SuperTabsConfig = DEFAULT_CONFIG;

  /**
   * Initial active tab index
   */
  @Prop({ reflectToAttr: true, mutable: true }) activeTabIndex: number = 0;

  private container!: HTMLSuperTabsContainerElement;
  private toolbar!: HTMLSuperTabsToolbarElement;

  /**
   * Set the selected tab.
   * This will move the container and the toolbar to the selected tab.
   * @param index {number} the index of the tab you want to select
   * @param [animate=true] {boolean} whether you want to animate the transition
   */
  @Method()
  selectTab(index: number, animate: boolean = true) {
    if (this.container) {
      this.container.moveContainerByIndex(index, animate);
    }

    if (this.toolbar) {
      this.toolbar.setActiveTab(index);
    }
  }

  private onContainerSelectedTabChange(ev: any) {
    if (this.toolbar) {
      this.toolbar.setSelectedTab(ev.detail);
    }
  }

  private onContainerActiveTabChange(ev: any) {
    const index: number = ev.detail;
    this.activeTabIndex = index;

    if (this.toolbar) {
      this.toolbar.setActiveTab(index);
    }
  }

  private onToolbarButtonClick(ev: any) {
    if (this.container) {
      this.container.moveContainerByIndex(ev.detail.index, true);
    }
  }

  indexChildren() {
    const container = this.el.querySelector('super-tabs-container');
    const toolbar = this.el.querySelector('super-tabs-toolbar');

    if (container && this.container !== container) {
      this.container = container;

      container.config = this.config;
      container.addEventListener('selectedTabIndexChange', this.onContainerSelectedTabChange.bind(this));
      container.addEventListener('activeTabIndexChange', this.onContainerActiveTabChange.bind(this));
    }

    if (toolbar && this.toolbar !== toolbar) {
      this.toolbar = toolbar;

      toolbar.config = this.config;
      toolbar.addEventListener('buttonClick', this.onToolbarButtonClick.bind(this));
    }
  }

  componentDidUpdate() {
    this.indexChildren();
    this.selectTab(this.activeTabIndex);
  }

  componentWillLoad() {
    this.indexChildren();
    this.selectTab(this.activeTabIndex);
  }

  render() {
    return [
      <slot/>,
    ];
  }
}
