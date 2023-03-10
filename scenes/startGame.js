class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {
    this.new = false
    var text = 'Continue Game'
    playerData = JSON.parse(localStorage.getItem('PixelSwordSave'));
    if (playerData === null || playerData.length <= 0) {
      localStorage.setItem('PixelSwordSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
      this.new = true
      text = 'Start Game'
    }
    this.cameras.main.setBackgroundColor(0x000000);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'PixelSword', 100).setOrigin(.5).setTint(0x2222220);

    this.startTime = this.add.bitmapText(game.config.width / 2 - 50, 275, 'topaz', text, 50).setOrigin(0, .5).setTint(0xfafafa);
    this.startTime.setInteractive();
    this.startTime.on('pointerdown', this.clickHandler, this);

    var deleteGame = this.add.bitmapText(game.config.width / 2, game.config.height - 50, 'topaz', 'Delete Game', 30).setOrigin(.5).setTint(0xfafafa);
    deleteGame.setInteractive();
    deleteGame.on('pointerdown', function () {
      localStorage.removeItem('PixelSwordSave');
      localStorage.setItem('PixelSwordSave', JSON.stringify(playerDataDefault));
      playerData = playerDataDefault;
      deleteGame.setText('Deleted')
      this.startTime.setText('Start Game')
    }, this);



  }
  clickHandler() {
    currentWorld = playerData.currentWorld
    currentLevel = playerData.currentLevel
    this.scene.start('playGame');
    this.scene.launch('UI');
  }

}