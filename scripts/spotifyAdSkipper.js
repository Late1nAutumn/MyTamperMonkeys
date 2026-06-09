// ==UserScript==
// @name         Spotify Ad Skipper
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
  // const PAGE_LOAD_TIMEOUT = 3000;
  const LIB_LOAD_TIMEOUT = 1500;
  const SONG_LIST_LOAD_TIMEOUT = 1500;
  const SCAN_INTERVAL = 500;

  const CORE_KEY_WORD = "广告"; // identifier
  const REPEAT_BTN_LABEL = "关闭循环播放";
  const EXPAND_LIB_BTN_LABEL = "打开音乐库"

  const observer = new MutationObserver(() => {
    let mainView, profile, player, lib, libList, songList, lastSongList
    try {
      console.log("looking for application...")
      mainView = document.getElementById('main-view')
      profile = mainView.nextElementSibling;
      player = mainView.previousElementSibling;
      lib = player.previousElementSibling;
      libList = lib.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.children[1].firstChild.firstChild.firstChild.children[1].children
      console.log("application found!")
      observer.disconnect()
    } catch (e) {
      return
    }


    // #region element selectors
    function getSongListEle() { // the songlist item in lib
      return mainView.lastChild.children[1].firstChild.firstChild.firstChild.firstChild.lastChild.lastChild.firstChild.firstChild.firstChild.lastChild.children[1].children
    }
    function getSongListName(ele) {
      // return ele.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.innerText // grid view
      return ele.firstChild.firstChild.lastChild.firstChild.firstChild.innerText // default list view
    }
    function getSongPlayButton(ele) {
      return ele.firstChild.firstChild.firstChild.lastChild//.firstChild
    }
    function getRepeatButton() {
      return player.firstChild.firstChild.children[1].firstChild.firstChild.lastChild.lastChild
    }
    // #endregion

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
      console.log("lib listeners reloaded")
      Array.from(libList).forEach((ele) => ele.addEventListener("click", () => {
        const listName = getSongListName(ele)
        setTimeout(() => {
          songList = getSongListEle()
          setupSongListeners()
        }, SONG_LIST_LOAD_TIMEOUT)
        console.log("Latest opened music list: " + listName)
        lastSongList = listName
      }))
    }
    function setupSongListeners() {
      console.log("playlist listeners reloaded")
      Array.from(songList).forEach((ele, i) => {
        const playButton = getSongPlayButton(ele)
        playButton.addEventListener("click", () => {
          console.log("Latest played music list: " + lastSongList)
          console.log("Latest played music number: " + (i + 1))
          localStorage.setItem("liaSongNum", i)
          localStorage.setItem("liaSongList", lastSongList)
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
            songList = getSongListEle()
            loadSong()
            setupSongListeners()
          }
          for (let ele of Array.from(libList)) {
            const listName = getSongListName(ele)
            console.log("???")
            if (listName === prevSongList) {
              ele.firstChild.firstChild.firstChild.click()
              lastSongList = listName
              setTimeout(loadList, SONG_LIST_LOAD_TIMEOUT)
              break
            }
          }
        }
      }
      function loadSong() {
        if (prevSongNum) {
          console.log("Loading previous song: " + (prevSongNum + 1))
          let button =
            getSongPlayButton(Array.from(songList)[prevSongNum])//.parentElement
          console.log(button)
          button.click()
        }
      }

      if (navEntry.type === 'reload') {
        console.log("loading local record...")
        loadSongList();
      }
    }

    function setRepeatMode() {
      if (getRepeatButton().getAttribute('aria-label') !== REPEAT_BTN_LABEL) {
        getRepeatButton().click()
      }
    }
    function expandLib() {
      let button = document.querySelector(`button[aria-label="${EXPAND_LIB_BTN_LABEL}"]`)
      if (button) {
        button.click()
      }
    }

    console.log("cleaner loaded")
    setTimeout(() => {
      loadPreviousPlay();
      setTimeout(() => {
        songList = getSongListEle()
        setupLibListeners();
        setupSongListeners();
      }, SONG_LIST_LOAD_TIMEOUT)
    }, LIB_LOAD_TIMEOUT)
    setInterval(adScanner, SCAN_INTERVAL)
    setInterval(setRepeatMode, SCAN_INTERVAL)
    setInterval(expandLib, SCAN_INTERVAL)
  })

  observer.observe(document.body, { childList: true, subtree: true })
})();
