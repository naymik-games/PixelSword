class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {

    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x222222);
    this.header.displayWidth = game.config.width;
    this.header.displayHeight = 75;

    this.anims.create({
      key: "ui-coin",
      frames: this.anims.generateFrameNumbers('tiles', { start: 45, end: 51 }),
      frameRate: 6,
      repeatDelay: 1500,
      repeat: -1
    });
    this.coinIcon = this.add.sprite(32, 5, 'tiles', 45).setOrigin(.5, 0).setScale(4)
    this.coinIcon.anims.play('ui-coin')
    this.score = 0;
    this.scoreText = this.add.bitmapText(75, 33.5, 'topaz', '500', 35).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1);




    this.anims.create({
      key: "layer-shield",
      frames: this.anims.generateFrameNumbers('shield', { frames: [0, 1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),
      frameRate: 6,
      repeatDelay: 1150,
      repeat: -1
    });
    //  this.shieldIcon = this.add.sprite(175, 17.5, 'shield', 0).setOrigin(.5, 0).setScale(1)


    this.shields = []
    // this.shieldIcon2 = this.add.sprite(215, 17.5, 'shield', 0).setOrigin(.5, 0).setScale(1)
    for (var i = 0; i < 5; i++) {
      var shield = this.add.sprite(175 + i * 40, 17.5, 'shield', 0).setOrigin(.5, 0).setScale(1)
      //  shield.anims.play('layer-shield')
      this.shields.push(shield)
      if (i < playerData.shieldCount) {
        shield.setAlpha(1)
      } else {
        shield.setAlpha(0)
      }
    }


    this.anims.create({
      key: "layer-player",
      frames: this.anims.generateFrameNumbers('player_icon', { frames: [0, 1, 2, 3, 4] }),
      frameRate: 3,
      repeatDelay: 500,
      repeat: -1
    });


    this.playerIcon = this.add.sprite(475, 5, 'player_icon', 0).setOrigin(.5, 0).setScale(2.5)
    this.playerIcon.anims.play('layer-player')
    this.livesText = this.add.bitmapText(525, 33.5, 'topaz', 'x3', 35).setOrigin(0, .5).setTint(0xcbf7ff).setAlpha(1);



    this.footer = this.add.image(game.config.width, game.config.height, 'blank').setOrigin(1).setTint(0x222222);
    this.footer.displayWidth = game.config.width / 2;
    this.footer.displayHeight = 75;
    this.levelText = this.add.bitmapText(game.config.width - 75, game.config.height - 33.5, 'topaz', playerData.currentWorld + '-' + playerData.currentLevel, 35).setOrigin(1, .5).setTint(0xcbf7ff).setAlpha(1);


    var Main = this.scene.get('playGame');
    Main.events.on('score', function () {

      this.score += 1;
      //console.log('dots ' + string)
      this.scoreText.setText(this.score)
    }, this);
    Main.events.on('level', function () {


      //console.log('dots ' + string)
      this.levelText.setText(currentWorld + '-' + currentLevel)
    }, this);
    Main.events.on('subShield', function () {
      this.placeShields()
      //console.log('dots ' + string)

    }, this);
    Main.events.on('addshield', function () {
      if (playerData.shieldCount < playerData.shieldMax) {
        playerData.shieldCount++
        this.placeShields()
      }
      //console.log('dots ' + string)

    }, this);

  }

  update() {

  }
  placeShields() {
    for (var i = 0; i < playerData.shieldMax; i++) {
      if (i < playerData.shieldCount) {
        this.shields[i].setAlpha(1)
      } else {
        this.shields[i].setAlpha(0)
      }
    }
  }


}