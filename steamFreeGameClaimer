// ==UserScript==
// @name         steam free game claimer
// @namespace    http://tampermonkey.net/
// @version      2024-12-29
// @description  try to take over the world!
// @author       You
// @match        https://store.steampowered.com/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const buttonClassName = "btn_addtocart btn_packageinfo";
    const confirmModalClassName = "newmodal_content";

    window.onload = ()=>{
        console.log("game addeer script loaded");
        setTimeout(()=>{
            console.log("game adder running");
            document.getElementsByClassName(buttonClassName)[0].children[0].click();
            setInterval(()=>{
                let modalContent = document.getElementsByClassName(confirmModalClassName)[0].children[0];
                if(modalContent.innerHTML.includes("已经被添加至您的帐户") && !document.getElementById("gameAreaDLCSection")){
                    window.close();
                }
            },1000);
        },1000);
    }

})();
