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

  const getStorageKeyCurrentTime = () => {
    return STORAGE_CURRENT_TIME + window.location.href;
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
    if (self.player.paused()) {
      return;
    }

    localStorage.setItem(getStorageKeyCurrentTime(), self.player.currentTime().toString());
  }

  const onRateChange = () => {
    localStorage.setItem(STORAGE_PLAYBACK_RATE, self.player.playbackRate().toString());
  }

  const setCurrentTimeFromStorage = () => {
    const storedCurrentTime = localStorage.getItem(getStorageKeyCurrentTime());
    if (storeCurrentTime) {
      self.player.currentTime(parseFloat(storedCurrentTime));
    }
  }

  const setPlayBackRateFromStorage = () => {
    const storedPlaybackRate = localStorage.getItem(STORAGE_PLAYBACK_RATE);
    if (storedPlaybackRate) {
      self.player.playbackRate(parseFloat(storedPlaybackRate));
    }
  }

  const onLoaded = () => {
    // @ts-ignore
    if (window.twoVuLoaded) {
      return;
    }

    // @ts-ignore
    window.twoVuLoaded = true;
    addCustomCss();
    const player = self.vjs('vjs-player');
    self.player = player;
    addSkipBackwardButton();
    addSkipForwardButton();
    player.on('ratechange', onRateChange);
    setPlayBackRateFromStorage();
    player.play();
    setCurrentTimeFromStorage();
    setInterval(storeCurrentTime, 1000);
  }

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

// @ts-ignore
window.twoVuBetter = new TwoVuBetter();
