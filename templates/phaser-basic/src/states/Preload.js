export default class PreloadState extends Phaser.State {
  preload() {
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);
    // TODO Preload additional graphics here
  }
  create() {
    this.state.start('Game');
  }
}
