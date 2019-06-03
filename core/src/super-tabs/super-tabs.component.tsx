import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, Watch, h } from '@stencil/core';
import { SuperTabChangeEventDetail, SuperTabsConfig } from '../interface';
import { DEFAULT_CONFIG } from '../utils';

@Component({
  tag: 'super-tabs',
  styleUrl: 'super-tabs.component.scss',
  shadow: true,
})
export class SuperTabsComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsElement;
  @Event() tabChange!: EventEmitter<SuperTabChangeEventDetail>;

  /**
   * Global Super Tabs configuration
   */
  @Prop() config?: SuperTabsConfig;

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

    return Promise.resolve();
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

    return Promise.resolve();
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

    this.tabChange.emit({
      changed: index !== this.activeTabIndex,
      index,
    });

    this.activeTabIndex = index;

    this.toolbar && this.toolbar.setActiveTab(index);
  }

  private onToolbarButtonClick(ev: any) {
    const { index } = ev.detail;

    this.container && this.container.setActiveTabIndex(index);

    this.tabChange.emit({
      changed: index !== this.activeTabIndex,
      index,
    });

    this.activeTabIndex = index;
  }

  indexChildren() {
    const container = this.el.querySelector('super-tabs-container');
    const toolbar = this.el.querySelector('super-tabs-toolbar');

    if (container && this.container !== container) {
      this.container = container;

      container.config = this._config;
    }

    if (toolbar && this.toolbar !== toolbar) {
      this.toolbar = toolbar;

      toolbar.config = this._config;
    }
  }

  componentDidUpdate() {
    this.indexChildren();
    this.selectTab(this.activeTabIndex);
  }

  componentWillLoad() {
    this.indexChildren();
    this.selectTab(this.activeTabIndex);
    this.el.addEventListener('selectedTabIndexChange', this.onContainerSelectedTabChange.bind(this));
    this.el.addEventListener('activeTabIndexChange', this.onContainerActiveTabChange.bind(this));
    this.el.addEventListener('buttonClick', this.onToolbarButtonClick.bind(this));
  }

  render() {
    return [
      <slot name="top"/>,
      <slot/>,
      <slot name="bottom"/>,
    ];
  }
}
