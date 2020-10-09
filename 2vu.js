function TwoVuBetter() {
  const self = this;
  const STORAGE_PLAYBACK_RATE = 'playback-rate';
  self.vjs = undefined;
  self.player = undefined;
  const getWindow = () => {
    const frame = document.querySelector('iframe');
    return (frame && frame.contentWindow) || window;
  }

  const onRateChange = e => {
    localStorage.setItem(STORAGE_PLAYBACK_RATE, self.player.playbackRate());
  }

  const setPlayBackRateFromStorage = () => {

  }

  const onLoaded = () => {
    const player = self.vjs('vjs-player');
    self.player = player;
    player.on('ratechange', onRateChange);
    const storedPlaybackRate = localStorage.getItem(STORAGE_PLAYBACK_RATE);
    if (storedPlaybackRate) {
      player.playbackRate(parseFloat(storedPlaybackRate));
    }
  }
  
  const loadTimer = setInterval(() => {
    if (typeof self.vjs === 'undefined') {
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

window.twoVuBetter = new TwoVuBetter();
