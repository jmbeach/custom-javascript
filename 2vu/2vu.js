// CSS online: https://gist.github.com/jmbeach/3b73fc8a33565789ee1b73d1a68276be

function TwoVuBetter() {
  /** @type {import("two-vu-better").TwoVuBetter} */
  const self = this;
  const STORAGE_PLAYBACK_RATE = 'playback-rate';
  const STORAGE_CURRENT_TIME = 'current-time_';
  const SKIP_SIZE = 15;
  self.vjs = undefined;
  self.player = undefined;

  const getWindow = () => {
    const frame = document.querySelector('iframe');
    return (frame && frame.contentWindow) || window;
  }

  const addCustomCss = () => {
    const styleTag = getWindow().document.createElement('link');
    styleTag.rel = 'stylesheet';
    styleTag.href = 'https://gistcdn.githack.com/jmbeach/3b73fc8a33565789ee1b73d1a68276be/raw/84c2d2da7284213695dfb6335f97f79169d23445/2vu.css';
    getWindow().document.body.prepend(styleTag);
  }

  const getNextLectureButton = () => {
    return document.querySelectorAll('.styles__Arrow-sc-1vkc84i-0')[1];
  }

  const getPrevLectureButton = () => {
    return document.querySelector('.styles__Arrow-sc-1vkc84i-0');
  }

  const getLectureButtons = () => {
    return document.querySelectorAll('.button.button--hover.styles__NavigationItemButton-v6r7uk-3.ijvtUw');
  }

  const getCurrentSection = () => {
    // @ts-ignore
    return getWindow().document.querySelector('button.button--primary.styles__NavigationItemButton-v6r7uk-3.ijvtUw').innerText;
  }

  const getStorageKeyCurrentTime = () => {
    return STORAGE_CURRENT_TIME + window.location.href + '_' + getCurrentSection();
  }

  const addSkipForwardButton = () => {
    if (self.player.controlBar.getChildById('skipForwardButton')) {
      return;
    }

    const btn = self.player.controlBar.addChild('button', {id: 'skipForwardButton'});
    'vjs-control vjs-button vjs-control-skip-forward'.split(' ').forEach(c => {
      btn.addClass(c);
    });
    // @ts-ignore
    btn.el().onclick = () => {
      self.player.currentTime(self.player.currentTime() + SKIP_SIZE)
    }
  }

  const addSkipBackwardButton = () => {
    if (self.player.controlBar.getChildById('skipBackwardButton')) {
      return;
    }

    const btn = self.player.controlBar.addChild('button', {id: 'skipBackwardButton'});
    'vjs-control vjs-button vjs-control-skip-backward'.split(' ').forEach(c => {
      btn.addClass(c);
    });
    // @ts-ignore
    btn.el().onclick = () => {
      self.player.currentTime(self.player.currentTime() - SKIP_SIZE)
    }
  }

  const storeCurrentTime = () => {
    if (self.player.paused() || self.player.currentTime() <= 1) {
      return;
    }

    localStorage.setItem(getStorageKeyCurrentTime(), self.player.currentTime().toString());
  }

  const onRateChange = () => {
    localStorage.setItem(STORAGE_PLAYBACK_RATE, self.player.playbackRate().toString());
  }

  const onVideoEnded = () => {
    if (parseInt(getCurrentSection()) >= getLectureButtons().length) {
      return;
    }

    // auto-advance
    const event = getWindow().document.createEvent('Events');
    event.initEvent('click', true, false);
    getNextLectureButton().dispatchEvent(event);
  }

  const onPrevButtonClicked = () => {
    init();
  }

  const onNextButtonClicked = () => {
    init();
  }

  const onLectureButtonClicked = () => {
    init();
  }

  const setCurrentTimeFromStorage = () => {
    const storedCurrentTime = localStorage.getItem(getStorageKeyCurrentTime());
    if (storedCurrentTime && parseFloat(storedCurrentTime) < self.player.duration()) {
      self.player.currentTime(parseFloat(storedCurrentTime));
    }
  }

  const setPlayBackRateFromStorage = () => {
    const storedPlaybackRate = localStorage.getItem(STORAGE_PLAYBACK_RATE);
    if (storedPlaybackRate) {
      self.player.playbackRate(parseFloat(storedPlaybackRate));
    }
  }

  const onDurationChanged = () => {
    setCurrentTimeFromStorage();
  }

  const onLoaded = () => {
    // @ts-ignore
    if ((new Date() - window.twoVuLoaded) < 500) {
      return;
    }

    // @ts-ignore
    window.twoVuLoaded = new Date();
    addCustomCss();
    const player = self.vjs('vjs-player');
    self.player = player;
    addSkipBackwardButton();
    addSkipForwardButton();
    player.on('ratechange', onRateChange);
    player.on('ended', onVideoEnded);
    setPlayBackRateFromStorage();
    player.play();
    player.on('durationchange', onDurationChanged);
    setInterval(storeCurrentTime, 1000);

    getNextLectureButton().addEventListener('click', onNextButtonClicked);
    getPrevLectureButton().addEventListener('click', onPrevButtonClicked);
    getLectureButtons().forEach(b => b.addEventListener('click', onLectureButtonClicked));
  }

  const init = () => {
    self.player = undefined;
    const loadTimer = setInterval(() => {
      if (typeof self.vjs === 'undefined') {
        // @ts-ignore
        self.vjs = getWindow().videojs;
        if (typeof self.vjs === 'undefined') {
          return;
        }
      }
  
      // the player itself isn't loaded yet
      if (!getWindow().document.getElementById('vjs-player')) {
        return;
      }
  
      clearInterval(loadTimer);
      onLoaded();
    }, 500);
  }

  init();
}

// @ts-ignore
window.twoVuBetter = new TwoVuBetter();
