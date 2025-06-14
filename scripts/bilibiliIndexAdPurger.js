// ==UserScript==
// @name         Bilibili index ad purger
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const PURGE_PERIOD_MS = 3000;
  const PURGE_CAROUSEL = true;
  const PURGE_LIVE = true;
  const PURGE_PROMOTION = true;
  const PURGE_AD = true;
  const PURGE_HEADER = true;

  // #region archive
  // const adTagClassName = "bili-video-card__info--ad";
  // const promoteIconClassName = "bili-video-card__info--creative-ad";
  // #endregion

  const headerBarClassName = "bili-header__bar";
  const headerBannerClassName = "bili-header__banner";
  const headerNavbarClassName = "bili-header__channel";
  const indexCarouselClassName = "recommended-swipe";
  const adTextWrapperClassName = "bili-video-card__stats--text";
  const rocketIconSvgClassName = "vui_icon bili-video-card__stats--icon";
  const liveTag1ClassName = "living";
  const liveTag2ClassName = "bili-live-card__info--living__text";

  const feedCardClassName = "feed-card";
  const feedLiveCardClassName = "floor-single-card";
  const sectionCardClassName = "bili-video-card is-rcmd";
  const sectionLiveCardClassName = "bili-live-card is-rcmd";

  const findParentClass = (ele, className) => {
    let node = ele.parentElement;
    while (node && !node.classList.contains(className)) {
      node = node.parentElement;
    }
    return node;
  };

  const classPurger = (className, parentName, callback) => {
    let targets = document.getElementsByClassName(className);
    for (let i = 0; i < targets.length; i++) {
      let ele = targets[i];
      let parent = findParentClass(ele, parentName);
      if (!parent) {
        continue;
      }
      callback(parent, ele);
    }
  };

  const queryPurger = (query, parentName, callback) => {
    let targets = document.querySelectorAll(query);
    for (let i = 0; i < targets.length; i++) {
      let ele = targets[i];
      let parent = findParentClass(ele, parentName);
      if (!parent) {
        continue;
      }
      callback(parent, ele);
    }
  };

  const adHandler = (ele, target) => {
    if (target.innerHTML === "广告") {
      ele.remove();
      console.log("[PURGER LOG]: an Ad has been purged");
    }
  }
  const adBlockerRemainHandler =
    (ele, target) => {
      let text = getComputedStyle(target, '::before').getPropertyValue('content');
      if (text.includes("AdGuard")) {
        ele.remove();
        console.log("[PURGER LOG]: an Adblocker remain has been purged");
      }
    }

  const purgeAds = () => {
    if (PURGE_AD) {
      /*
      classPurger(adTextWrapperClassName, feedCardClassName, adHandler);
      classPurger(
        adTextWrapperClassName,
        sectionCardClassName, adHandler
      );
      */
      queryPurger(
        `.${sectionCardClassName.split(" ").join(".")} > div`,
        feedCardClassName, adBlockerRemainHandler
      );
      queryPurger(
        `.${sectionCardClassName.split(" ").join(".")} > div`,
        sectionCardClassName, adBlockerRemainHandler
      );
    }
    if (PURGE_PROMOTION) {
      classPurger(rocketIconSvgClassName, feedCardClassName, (ele) => {
        ele.remove();
        console.log("[PURGER LOG]: a promotion has been purged");
      });
      classPurger(rocketIconSvgClassName, sectionCardClassName, (ele) => {
        ele.remove();
        console.log("[PURGER LOG]: a promotion has been purged");
      });
    }
    if (PURGE_LIVE) {
      classPurger(liveTag1ClassName, feedLiveCardClassName, (ele) => {
        ele.remove();
        console.log("[PURGER LOG]: a live has been purged");
      });
      classPurger(liveTag2ClassName, sectionLiveCardClassName, (ele) => {
        ele.remove();
        console.log("[PURGER LOG]: a live has been purged");
      });
    }
    document.getElementsByClassName("adblock-tips")?.[0]?.children?.[1]?.click()
  };

  window.onload = () => {
    if (PURGE_HEADER) {
      document.getElementsByClassName(headerBarClassName)[0].style.background = "darkblue";
      document.getElementsByClassName(headerBannerClassName)[0].remove();
      document.getElementsByClassName(headerNavbarClassName)[0].style.opacity = 0;
    }
    if (PURGE_CAROUSEL) {
      document.getElementsByClassName(indexCarouselClassName)[0].remove();
    }
    purgeAds();
    setInterval(() => {
      purgeAds();
    }, PURGE_PERIOD_MS);
  };
})();
