import 'gsap';
import jQuery from './../../../node_modules/jquery/dist/jquery';

export default {
  name: 'Home',
  data() {
    return {
      msg: 'Agile Shift',
    };
  },
};

window.jQuery = jQuery;
window.$ = jQuery;

$(() => {
  var t  = function (t,e) {
    return function () {
      return t.apply(e, arguments)
    }
  };
  null == this.ib && (this.ib = {}),
    ib.NestedMenu = function () {
      function e(e, i) {
        this.context = e,
          this.resize = t(this.resize, this),
          this.peekIsVisible = t(this.peekIsVisible, this),
          this.updateProperty = t(this.updateProperty, this),
          this.update = t(this.update, this),
          this.stop = t(this.stop, this),
          this.start = t(this.start, this),
          this.scroll = t (this.scroll, this),
          this.onContextLeave = t(this.onContextLeave, this),
          this.onContextEnter = t(this.onContextEnter, this),
          this.previewMenuItems = t(this.previewMenuItems, this),
          this.onEnableMenuScroll = t(this.onEnableMenuScroll, this),
          this.onMenuHidden = t(this.onMenuHidden, this),
          this.setupScrollDispatcher = t(this.setupScrollDispatcher, this),
          this.scrollToFold = t(this.scrollToFold, this),
          this.resetNestedMenu = t(this.resetNestedMenu, this),
          this.nestedMenu = this.context.find('.nested-menu'),
          this.menuItemsContainer = this.nestedMenu.find('.menu-items'),
          this.menuItemsContainerHeight = this.menuItemsContainer.height(),
          this.menuItems = this.menuItemsContainer.find('li'),
          this.firstMenuItem = this.menuItems.first(),
          this.menuItemHeight = this.firstMenuItem.height(),
          this.scrollDispatcher = null,
          this.description = this.context.find('.description'),
          this.descriptionTitle = this.description.find('hgroup h1'),
          this.titleYoffset = 0,
          this.titleBar = this.context.find('.title-bar'),
          this.titleBarTitle = this.titleBar.find('h1'),
          this.scrollIndicator = this.context.find('.scroll-indicator'),
          this.scrollIndicatorItems = this.scrollIndicator.find('.arrow-wrap'),
          this.shouldDispatchOnEnableHover = !1,
          this.menuItemBottomBorderHeight = 1,
          this.destinationMenuOffset = -this.menuItemHeight + this.menuItemBottomBorderHeight,
          this.hoverOffset = this.firstMenuItem.find('p').position().top,
          this.menuOffset = this.destinationMenuOffset,
          this.destinationContentOffset = 0,
          this.contentOffset = 0,
          this.descOpacity = 1,
          this.destinationDescOpacity = 1,
          this.descOffset = 0,
          this.destinationDescOffset = 0,
          this.titleOpacity = 0,
          this.destinationTitleOpacity = 0,
          this.titleOffset = 0,
          this.destinationTitleOffset = 0,
          this.amountS,
          this.raf,
          this.win = $(window),
          this.winHeight = this.win.height(),
          this.hideTitleBarTitle = !1,
          this.initial = !0,
          this.opts = $.extend({
            peekFriction: .195,
            friction: .5,
            peekOffsetY: this.menuItemHeight,
            titleBarHeight: this.titleBar.height(),
            titleBarStartingY: 15
          }, i || this.context.data())
      }

    }
});
