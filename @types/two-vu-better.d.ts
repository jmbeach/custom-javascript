export interface TwoVuBetter {
  vjs(id: any, options?: videojs.VideoJsPlayerOptions, ready?: () => void): videojs.VideoJsPlayer;
  player: videojs.VideoJsPlayer;
}