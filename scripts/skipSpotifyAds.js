// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-06-08
// @description  fuck these idiots
// @author       LateInAutumn
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const PAGE_LOAD_TIMEOUT = 3000;
  const SONG_LIST_LOAD_TIMEOUT = 1500;
  const SCAN_INTERVAL = 500;

  const CORE_KEY_WORD = "广告"; // identifier
  const REPEAT_IDENTIFIER = "关闭循环播放"; // for repeat button detection

  setTimeout(() => {
    const mainView = document.getElementById('main-view');
    const profile = mainView.nextElementSibling;
    const player = mainView.previousElementSibling;
    const lib = player.previousElementSibling;

    const libList = lib.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.children[1].firstChild.firstChild.children

    // #region element selectors
    function getSongListEle(view) { // the songlist item in lib
      return view.lastChild.children[1].firstChild.firstChild.firstChild.firstChild.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.children[1].children
    }
    function getSongListName(ele) {
      return ele.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.innerText
    }
    function getSongPlayButton(ele) {
      return ele.firstChild.firstChild.firstChild.lastChild.firstChild
    }
    function getRepeatButton() {
      return player.firstChild.firstChild.children[1].firstChild.firstChild.lastChild.lastChild
    }
    // #endregion

    let songList = getSongListEle(mainView)

    function adScanner() {
      if (profile) {
        const links = Array.from(profile.querySelectorAll('a'))
          .concat(Array.from(player.querySelectorAll('a')));
        const adLink = Array.from(links).find(
          (a) => a.textContent.trim().includes(CORE_KEY_WORD)
        );

        if (adLink) {
          console.log('Ad detected, reloading the page...');
          location.reload();
        }
      }
    }

    function setupLibListeners() {
      Array.from(libList).forEach((ele) => ele.addEventListener("click", () => {
        const listName = getSongListName(ele)
        setTimeout(() => {
          songList = getSongListEle(mainView)
          setupSongListeners()
        }, SONG_LIST_LOAD_TIMEOUT)
        console.log("Latest opened music list: " + listName)
        localStorage.setItem("liaSongList", listName)
      }))
    }
    function setupSongListeners() {
      Array.from(songList).forEach((ele, i) => {
        const playButton = getSongPlayButton(ele)
        playButton.addEventListener("click", () => {
          console.log("Latest played music number: " + (i + 1))
          localStorage.setItem("liaSongNum", i)
        })
      })
    }
    function loadPreviousPlay() {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const prevSongList = localStorage.getItem('liaSongList');
      const prevSongNum = Number(localStorage.getItem('liaSongNum'));
      function loadSongList() {
        if (prevSongList) {
          console.log("Loading previous music list: " + prevSongList)
          function loadList() {
            songList = getSongListEle(mainView)
            loadSong()
            setupSongListeners()
          }
          for (let ele of Array.from(libList)) {
            const listName = getSongListName(ele)
            if (listName === prevSongList) {
              ele.firstChild.firstChild.firstChild.click()
              setTimeout(loadList, SONG_LIST_LOAD_TIMEOUT)
              break
            }
          }
        }

      }
      function loadSong() {
        if (prevSongNum) {
          console.log("Loading previous song: " + (prevSongNum + 1))
          getSongPlayButton(Array.from(songList)[prevSongNum]).parentElement.click()
        }
      }

      if (navEntry.type === 'reload') loadSongList();
    }

    function setRepeatMode() {
      if (getRepeatButton().getAttribute('aria-label') !== REPEAT_IDENTIFIER) {
        getRepeatButton().click()
      }
    }

    setupLibListeners();
    loadPreviousPlay();
    setInterval(adScanner, SCAN_INTERVAL)
    setInterval(setRepeatMode, SCAN_INTERVAL)
  }, PAGE_LOAD_TIMEOUT);


})();
