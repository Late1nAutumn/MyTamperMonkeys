// ==UserScript==
// @name         bilbili live ad purger
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @description  try to take over the world!
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let interval = setInterval(()=>{
        let target = document.getElementById("web-player__bottom-bar__container");
        if(target){
            target.remove();
            clearInterval(interval);
        }
    },2000);
})();
