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

(function() {
    'use strict';

    // Your code here...
    const indexCarouselClassName = "recommended-swipe grid-anchor";
    const adTagClassName = "bili-video-card__info--ad";
    const liveTagClassName = "living";
    const promoteIconClassName = "bili-video-card__info--creative-ad";
    const cardClassName1 = "bili-video-card is-rcmd";
    const cardClassName2 = "feed-card";
    const cardClassName3 = "floor-single-card";

    const findParentClass = (ele, className) => {
        let node = ele.parentElement;
        while(node && !node.className.includes(className)){
            node = node.parentElement;
        }
        return node;
    };

    const purgeAds = () => {
        let targets = document.getElementsByClassName(adTagClassName);
        for(let i=0; i<targets.length; i++){
            let ele = targets[i];
            ele = findParentClass(ele, cardClassName1);
            if(!ele){
                continue;
            }
            if(ele.parentElement.className.includes(cardClassName2)){
                ele.parentElement.remove();
            }else{
                ele.remove();
            }
        }

        targets = document.getElementsByClassName(promoteIconClassName);
        for(let i=0; i<targets.length; i++){
            let ele = targets[i];
            ele = findParentClass(ele, cardClassName1);
            if(!ele){
                continue;
            }
            if(ele.parentElement.className.includes(cardClassName2)){
                ele.parentElement.remove();
            }else{
                ele.remove();
            }
        }

        targets = document.getElementsByClassName(liveTagClassName);
        for(let i=0; i<targets.length; i++){
            let ele = targets[i];
            ele = findParentClass(ele, cardClassName3);
            if(!ele){
                continue;
            }
            ele.remove();
        }
    };

    window.onload = () => {
        document.getElementsByClassName(indexCarouselClassName)[0].remove();
        purgeAds();
        setInterval(()=>{
            purgeAds();
        },3000);
    }
})();
