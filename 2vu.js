function TwoVuBetter() {
  /** @type {import("two-vu-better").TwoVuBetter} */
  const self = this;
  const STORAGE_PLAYBACK_RATE = 'playback-rate';
  const STORAGE_CURRENT_TIME = 'current-time_';
  self.vjs = undefined;
  self.player = undefined;

  const getWindow = () => {
    const frame = document.querySelector('iframe');
    return (frame && frame.contentWindow) || window;
  }

  const getStorageKeyCurrentTime = () => {
    return STORAGE_CURRENT_TIME + window.location.href;
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

  const setPlayBackRateFromStorage = () => {
    const storedPlaybackRate = localStorage.getItem(STORAGE_PLAYBACK_RATE);
    if (storedPlaybackRate) {
      self.player.playbackRate(parseFloat(storedPlaybackRate));
    }
  }

  const onLoaded = () => {
    const player = self.vjs('vjs-player');
    self.player = player;
    player.on('ratechange', onRateChange);
    setPlayBackRateFromStorage();
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
