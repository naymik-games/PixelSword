class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    /*
      gameSettings = JSON.parse(localStorage.getItem('SDsave'));
      if (gameSettings === null || gameSettings.length <= 0) {
        localStorage.setItem('SDsave', JSON.stringify(defaultValues));
        gameSettings = defaultValues;
      }
    */
    this.cameras.main.setBackgroundColor(0xf7eac6);
    back1 = this.add.tileSprite(game.config.width / 2, game.config.height / 2, game.config.width, game.config.height, 'back2');
    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'PixelSword', 100).setOrigin(.5).setTint(0x2222220);

    var startTime = this.add.bitmapText(game.config.width / 2 - 50, 275, 'topaz', 'Play Time', 50).setOrigin(0, .5).setTint(0x000000);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);



  }
  clickHandler() {

    this.scene.start('playGame');
    this.scene.launch('UI');
  }

}