import { Component, ComponentInterface, Element, Prop, Method, Watch } from '@stencil/core';
import { DEFAULT_CONFIG, SuperTabsConfig } from '../interface';

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
  @Prop({ mutable: true }) config?: SuperTabsConfig;

  /**
   * Initial active tab index
   */
  @Prop({ reflectToAttr: true, mutable: true }) activeTabIndex: number = 0;

  private container!: HTMLSuperTabsContainerElement;
  private toolbar!: HTMLSuperTabsToolbarElement;
  private _config: SuperTabsConfig = DEFAULT_CONFIG;

  @Method()
  setConfig(config: SuperTabsConfig) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this.container && (this.container.config = this._config);
    this.toolbar && (this.toolbar.config = this._config);
  }

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

  @Watch('config')
  onConfigChange(config: SuperTabsConfig) {
    this.setConfig(config);
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
    this.container && this.container.setActiveTabIndex(ev.detail.index);
  }

  indexChildren() {
    const container = this.el.querySelector('super-tabs-container');
    const toolbar = this.el.querySelector('super-tabs-toolbar');

    if (container && this.container !== container) {
      this.container = container;

      container.config = this._config;
      container.addEventListener('selectedTabIndexChange', this.onContainerSelectedTabChange.bind(this));
      container.addEventListener('activeTabIndexChange', this.onContainerActiveTabChange.bind(this));
    }

    if (toolbar && this.toolbar !== toolbar) {
      this.toolbar = toolbar;

      toolbar.config = this._config;
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
      <slot name="top" />,
      <slot/>,
      <slot name="bottom" />,
    ];
  }
}
