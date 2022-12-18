import { Component } from "react";
import React from 'react';
import Page from "../Page/Page";
import PageIndicator from "../PageIndicator/PageIndicator";
import { Navigation } from "../Navigation/Navigation"
import "./PageScroller.scss";
import animatedScrollTo from '../../utils/animated-scroll-to';
import isMobileDevice from '../../utils/is-mobile';
import AppContext from "../AppContext";

let animSetTime = null;

const scrollMode = {
  FULL_PAGE: 'full-page',
  NORMAL: 'normal',
};

class PageScroller extends Component {

  static getChildrenCount = (children) => {
    const childrenArr = React.Children.toArray(children);
    const slides = childrenArr.filter(({ type }) => type === Page);
    return slides.length;
  }

  constructor(props) {
    super(props);

    this.state = {
      scrollPos: 0,
      pageIndex: 0,
      scrollAgain: true,
      y: window.scrollY,
      activeSlide: 0,
      slidesCount: 5,
      initialSlide: 0,
      modalMode: false,
      isModal: false,
      isNav: false,
      disableScroll: false,
      setIsModal: this.setIsModal,
      setIsNav: this.setIsNav,
      setDisableScroll: this.setDisableScroll,
      y: window.scrollY,
    };

    this.pages = 0;
    this._isScrollPending = false;
    this._isScrolledAlready = false;
    this._slides = [];
    this._touchSensitivity = 5;
    this._touchStart = 0;
    this._xDown = 0;
    this._isMobile = null;
    this.threshold = 1;
    this.lastScrollY = window.pageYOffset;
    this.ticking = false;
  }
  setIsModal = isModal => {
    this.setState({ isModal });
  };
  setIsNav = isNav => {
    this.setState({ isNav });
  };
  setDisableScroll = (disableScroll, callback = null) => {
    this.setState({ disableScroll }, callback);
  };

  componentDidMount = () => {
    this._isMobile = isMobileDevice();
    if (this._isMobile) {
      document.addEventListener('touchmove', this.onTouchMove, { passive: false });
      document.addEventListener('touchstart', this.onTouchStart);
    } else {
      window.addEventListener('wheel', this.onScroll, { passive: false });
      document.addEventListener('keydown', this.onKeyPress);

    }
    // document.addEventListener('scroll', (e) => {  e.preventDefault();console.log("AAAA",e.defaultPrevented); }, false);
    // window.addEventListener('message', (e) => {
    //   var iframe = e.target;
    //   iframe.contentWindow.addEventListener('wheel', e => { console.log("HSSSS"); e.preventDefault() });
    //   console.log("message");
    // }, { passive: false })
    window.addEventListener('resize', this.onResize);

    this.onResize();
    this.scrollToSlide(this.state.initialSlide);
  }

  componentDidUpdate() {
    const newSlidesCount = PageScroller.getChildrenCount(this.props.children);
    if (newSlidesCount !== this.state.slidesCount) {
      this.setState({
        slidesCount: newSlidesCount,
      }, this.updateSlides);

      const slidesDiff = this.state.slidesCount - newSlidesCount;

      if (slidesDiff > 0 && this.state.activeSlide >= this.state.slidesCount - slidesDiff) {
        this.setState({
          activeSlide: newSlidesCount - 1,
        }, this.updateSlides);
      }
    }
    // window.addEventListener('message', (e) => {
    //   var iframe = e.target;
    //   if (iframe && iframe.contentWindow)
    //     iframe.contentWindow.addEventListener('wheel', e => { console.log("HSSSS"); e.preventDefault() });
    //   console.log("message");
    // }, { passive: false })
  }

  componentWillUnmount() {
    if (this._isMobile) {
      // document.removeEventListener('wheel', this.onScroll);
      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchstart', this.onTouchStart);
    } else {
      document.removeEventListener('wheel', this.onScroll);
      // window.removeEventListener('scroll', this.onScroll);
      document.removeEventListener('keydown', this.onKeyPress);
      window.removeEventListener('scroll', (e) => e.preventDefault());
    }

    window.removeEventListener('resize', this.onResize);
  }

  updateSlides = () => {
    this._slides = [];

    for (let i = 0; i < this.state.slidesCount; i++) {
      this._slides.push(window.innerHeight * i);
    }
  }
  onResize = () => {
    this.updateSlides();
    this.setState({
      height: window.innerHeight,
    });
  }

  onTouchStart = (evt) => {
    this._touchStart = evt.touches[0].clientY;
    this._xDown = evt.touches[0].clientX;
    this._isScrolledAlready = false;
  }

  onTouchMove = (evt) => {
    // if (this.props.scrollMode !== scrollMode.FULL_PAGE) {
    //   return;
    // }

    evt.preventDefault();
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = this._xDown - xUp;
    var yDiff = this._touchStart - yUp;

    const touchEnd = evt.changedTouches[0].clientY;

    if (!this._isScrollPending && !this._isScrolledAlready) {
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff > 0) {
          this.scrollToSlide(this.state.activeSlide + 1);
        } else {
          this.scrollToSlide(this.state.activeSlide - 1);
        }
      }

    }
  }

  onKeyPress = (event) => {
    if (event.target.classList && !event.target.classList.contains('disable')) {
      event.preventDefault();
    }

    let key = event.key;
    let slide = this.state.activeSlide;
    switch (key) {
      case "ArrowDown":
        slide++;
        this.scrollToSlide(slide);
        break;
      case "ArrowUp":
        slide--;
        this.scrollToSlide(slide);
        break;
      default:
        break;
    }
  }
  handleScroll = (event) => {
    event.preventDefault();
    // if (this._isScrollPending) {
    //   return;
    // }
    // if (!this.ticking) {
    //   window.requestAnimationFrame(this.updateScrollDir);
    //   this.ticking = true;
    // }
  }
  updateScrollDir = () => {
    const scrollY = window.pageYOffset;

    if (Math.abs(scrollY - this.lastScrollY) < this.threshold) {
      this.ticking = false;
      return;
    }
    console.log(scrollY >= this.lastScrollY ? "scrolling down" : "scrolling up");
    let { activeSlide } = this.state;
    scrollY >= this.lastScrollY ? activeSlide++ : activeSlide--;
    if (!this._isScrollPending)
      this.scrollToSlide(activeSlide);
    this.lastScrollY = scrollY > 0 ? scrollY : 0;
    this.ticking = false;

  };

  onScroll = (evt) => {
    // if (this.props.scrollMode !== scrollMode.FULL_PAGE) {
    //   return;
    // }
    if (evt.target.classList && !evt.target.classList.contains('noscroll')) {
      evt.preventDefault();
    }

    if (this._isScrollPending) {
      return;
    }

    const scrollDown = (evt.wheelDelta || -evt.deltaY || -evt.detail) < 0;
    let { activeSlide } = this.state;

    if (scrollDown) {
      activeSlide++;
    } else {
      activeSlide--;
    }
    if (!this._isScrollPending)
      this.scrollToSlide(activeSlide);
  }

  // handleScroll = (e) => {
  //   let pageIndex = this.state.pageIndex;
  //   const winHeight = window.innerHeight;
  //   const windoww = e.currentTarget;
  //   if (this.state.scrollAgain) {
  //     if (pageIndex >= 0 && pageIndex <= this.pages - 1) {

  //       if (this.state.y >= windoww.scrollY) {
  //         console.log("scrolling up");
  //         // pageIndex--;
  //         // this.scroll(winHeight, pageIndex);

  //       } else if (this.state.y < windoww.scrollY) {
  //         console.log("scrolling down");
  //         // pageIndex++;
  //         // this.scroll(winHeight, pageIndex);

  //       }
  //     }
  //     console.log(pageIndex);
  //   }
  //   this.setState({ y: windoww.scrollY });
  // }

  scrollToSlide = (slide) => {

    if (this.state.isModal)
      return;
    if (this.state.isNav)
      return;
    if (this.state.disableScroll)
      return;

    if (slide >= 0 && slide < this.state.slidesCount) {
      this._isScrollPending = true;
      this.setState({
        activeSlide: slide,
      });

      animatedScrollTo(this._slides[slide], 1000, () => {
        this._isScrollPending = false;
        this._isScrolledAlready = true;
      });
    }
  }

  scroll = (pageIndex) => {
    this.scrollToSlide(pageIndex);
  }


  goToPage = (index) => {
    if (animSetTime !== null)
      clearTimeout(animSetTime);
    this.scroll(index);
  }

  renderChildren = () => {
    let childElements = [];
    let pageIndicator = undefined;
    let pageNav = undefined;
    let pageCount = 0;

    React.Children.map(this.props.children, (child, i) => {
      if (child.type === Page) {
        pageCount++;
        childElements.push(child);
      } else if (child.type === PageIndicator) {
        pageIndicator = child;
      }
      else if (child.type === Navigation) {
        pageNav = child;
      }
    });

    this.pages = pageCount;

    if (pageIndicator) {
      childElements.push(
        React.cloneElement(pageIndicator, {
          pageCount: this.pages,
          activePage: this.state.activeSlide,
          goToPage: this.goToPage
        }));
    }

    if (pageNav) {
      childElements.push(
        React.cloneElement(pageNav, {
          activePage: this.state.activeSlide,
          goToPage: this.goToPage
        }));
    }

    return childElements;
  }

  render() {
    return (
      <AppContext.Provider value={{
        isModal: this.state.isModal, setIsModal: this.state.setIsModal
        , isNav: this.state.isNav, setIsNav: this.state.setIsNav
        , disableScroll: this.state.disableScroll, setDisableScroll: this.state.setDisableScroll
      }}>
        <div style={{ height: this.state.height }}>
          {this.renderChildren()}
        </div>
      </AppContext.Provider>
    );
  }
}
export default PageScroller;