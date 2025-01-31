// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-30
// @description  try to take over the world!
// @author       You
// @match        https://infinity-nikki.fandom.com/wiki/Air_Bubbles
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  console.clear();

  let data = {
    itemName: "",
    itemChineseName: "",
    position: "",
    set: "",
    quality: 0,
    style: "",
    lv0: 0,
    lv10: 0,
    lv11: 0,
    labels: [],
  };

  //   document
  //     .getElementsByClassName(
  //       "mw-customtoggle-myFirstText mw-customtoggle-myOtherText wds-button mw-customtoggle"
  //     )[0]
  //     .click();

  let completionCheck = 0;

  // get item name
  try {
    data.itemName = document.getElementsByClassName("pi-title")[0].innerText;
    completionCheck++;
  } catch (e) {
    console.log("[CRAWLER ERROR]: item name get fail");
  }

  // get item Chinese name
  try {
    Array(
      ...document.getElementById("Other_Languages").parentNode
        .nextElementSibling.children[0].children
    ).forEach((tr) => {
      if (tr.innerHTML.includes("Simplified"))
        data.itemChineseName = tr.children[1].children[0].innerHTML;
    });
    completionCheck++;
  } catch (e) {
    console.log("[CRAWLER ERROR]: item Chinese name get fail");
  }

  // get position
  // get set data
  // get labels
  try {
    Array(
      ...document.getElementsByClassName("pi-data-label pi-secondary-font")
    ).forEach((h3) => {
      switch (h3.innerHTML) {
        case "Category":
          data.position = h3.nextElementSibling.children[1].innerHTML;
          break;
        case "Set":
          data.set = h3.nextElementSibling.children[0].innerHTML;
          break;
        case "Labels":
          data.set = Array(...h3.nextElementSibling.children).forEach((a) => {
            data.labels.push(a.getAttribute("title"));
          });
          break;
        default:
          break;
      }
    });
    completionCheck++;
  } catch (e) {
    console.log("[CRAWLER ERROR]: item stat get fail");
  }
  // get style type
  // get quality
  try {
    let tr = document.getElementsByClassName("pi-horizontal-group")[0]
      .children[1];
    data.quality = Number(
      tr.children[0].children[0].children[0].getAttribute("title")[0]
    );
    data.style = tr.children[0].children[1].children[0].getAttribute("title");
    completionCheck++;
  } catch (e) {
    console.log("[CRAWLER ERROR]: item type get fail");
  }
  // get main stat lv0
  // get main stat lv10
  // get main stat lv11
  try {
    let trs = Array(
      ...document.getElementsByClassName(
        "article-table thc tdc1 alternating-colors-table"
      )[1].children[0].children
    ).slice(1);
    let tr = trs.filter(
      (tr) =>
        tr.children[0].children[0].children[0].getAttribute("title") ===
        data.style
    )[0];
    data.lv0 = tr.children[1].innerHTML;
    data.lv10 = tr.children[11].innerHTML;
    data.lv11 = tr.children[12].innerHTML;
    completionCheck++;
  } catch (e) {
    console.log("[CRAWLER ERROR]: item power get fail");
  }

  console.log(JSON.stringify(data));
  let save = JSON.parse(localStorage.getItem("crawl"));
  save.push(data);
  console.log(`[CRAWLER]: ${save.length} records`);
  if (completionCheck !== 5)
    console.log(
      `[CRAWLER WARNING]: completion check failed: ${completionCheck}/5`
    );
  localStorage.setItem("crawl", JSON.stringify(save));
})();
