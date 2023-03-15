let playerStandBodyX = 9, playerStandBodyY = 19, playerStandBodyXOffset = 27, playerStandBodyYOffset = 30
let playerRollBodyX = 9, playerRollBodyY = 15, playerRollBodyXOffset = 27, playerRollBodyYOffset = 34

class Player extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {

    super(scene, x, y, 'player');
    this.scene = scene

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(.5, .5);
    // this.setScale(1.5)
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setBounce(0)
    this.setGravityY(800)
    //  .setScale(1.75)
    //.setDrag(3000, 0)
    this.setMaxVelocity(maxVelocityX, maxVelocityY)

    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
      frameRate: 4,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("player", { start: 6, end: 10 }),
      frameRate: 12,
      repeat: -1
    });

    anims.create({
      key: "player-swing",
      frames: anims.generateFrameNumbers("player", { start: 18, end: 21 }),
      frameRate: 12,
      repeat: 0
    });
    anims.create({
      key: "player-jump",
      frames: anims.generateFrameNumbers("player", { start: 12, end: 14 }),
      frameRate: 6,
      repeat: 0
    });
    anims.create({
      key: "player-roll",
      frames: anims.generateFrameNumbers("player", { start: 24, end: 26 }),//80
      frameRate: 6,
      repeat: 0
    });
    /*  anims.create({
       key: "player-shoot",
       frames: anims.generateFrameNumbers("player", { start: 18, end: 21 }),
       frameRate: 18,
       repeat: 0
     }); */
    anims.create({
      key: "player-cast",
      frames: anims.generateFrameNumbers("player", { start: 30, end: 34 }),
      frameRate: 12,
      repeat: 0
    });
    // Create the physics-based sprite that we will move around and animate
    this.invulnerable = false;
    this.invincible = false
    this.swordHitBox = this.scene.add.rectangle(x, y, 16, 12, 0xff0000, 0)
    this.scene.physics.add.existing(this.swordHitBox)
    this.swordHitBox.body.setAllowGravity(false)
    this.swordHitBox.body.enable = false
    this.orbsActivated = 0
    this.activeWeapon = 'sword'
    this.keyCount = 0
    this.roll = false
    this.bombSet = false
    this.launched = false
    this.invulnerable = false;
    this.invincible = false
    this.canShoot = true
    this.fire = false
    this.swinging = false
    this.cast = false
    this.hasKey = false
    this.orbs = []


    this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset);//15,15 24.5, 17
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    var standing = this.body.blocked.down || this.body.touching.down;
    // bullets.getChildren().forEach(this.updateBullet, this);

    //animation
    if (this.swinging) {
      if (playerData.hasMagic) {
        this.anims.play("player-cast", true).once('animationcomplete', function () {
          this.anims.stop();
          this.swinging = false
        }, this)
      } else {
        this.anims.play("player-swing", true).once('animationcomplete', function () {
          this.anims.stop();
          this.swinging = false
        }, this)
      }

    } else if (standing) {
      if (this.body.velocity.x !== 0) {

        if (this.roll) {
          //this.anims.play("player-roll", true);
          this.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
        } else {
          this.anims.play("player-run", true);
          this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        }

      } else {
        if (this.body.velocity.y < 0) {
          this.anims.play("player-jump", true);
          //this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
        } else {
          if (this.roll) {
            // this.anims.play("player-roll", true);
            this.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
          } else {
            this.anims.play("player-idle", true);
            this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
          }

          // this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)

        }


      }

    } else {
      if (this.roll) {
        // this.anims.play("player-roll", true);
        this.body.setSize(playerRollBodyX, playerRollBodyY).setOffset(playerRollBodyXOffset, playerRollBodyYOffset)
      } else if (this.body.velocity.y < 0) {
        this.anims.play("player-jump", true);
        this.body.setSize(playerStandBodyX, playerStandBodyY).setOffset(playerStandBodyXOffset, playerStandBodyYOffset)
      } else {
        this.anims.play("player-idle", true);
      }
    }



  }

  playerHit(damage) {
    // console.log('strength ' + damageS + ' defense ' + damageD + ' knowledge ' + damageK)
    //if you are not already invulnerable
    if (!this.invulnerable && !this.invincible) {
      //set player as invulnerable
      this.invulnerable = true;

      //this.scene.addDamage(damageS, damageD, damageK)//playerData.damageMultiplier
      //if hearts is 0 or less you're dead as you are out of lives
      if (playerData.shieldCount <= 0) {
        //remove physics from player
        this.die()
      }
      //otherwise you're not dead you've just lost a life so...
      else {
        if (playerData.hasMagic) {
          playerData.hasMagic = false
          this.scene.subMagic()
        } else {
          playerData.shieldCount -= damage
          this.scene.subShield()
        }

        //make the player stop in their tracks and jump up
        // this.body.velocity.x = 0;
        this.body.velocity.y = -220;
        //tween the players alpha to 30%
        var tween = this.scene.tweens.add({
          targets: this,
          alpha: 0.3,
          ease: 'Linear',
          duration: 200,
          onCompleteScope: this
        });

        //set a timer for 1 second. When this is up we tween player back to normal and make then vulnerable again
        var timer = this.scene.time.delayedCall(1000, this.playerVulnerable, null, this);
      }
    }
  }
  die() {
    this.disableBody(false, false);
    //and play death animation
    var tween = this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      scaleX: 1.1,
      scaleY: 1.1,
      angle: 90,
      x: this.x - 20,
      y: this.y - 20,
      ease: 'Linear',
      duration: 1000,
      onCompleteScope: this,
      onComplete: function () {
        if (playerData.lives <= 0) {

          localStorage.removeItem('PixelSwordSave');
          this.scene.scene.stop()
          this.scene.scene.stop('UI')
          this.scene.scene.start('startGame')
        } else {
          playerData.lives--
          playerData.hasMagic = false
          this.scene.subMagic()
          playerData.shieldCount = 0
          this.scene.updateShield()
          localStorage.setItem('PixelSwordSave', JSON.stringify(playerData));
          this.scene.restartScene();
          this.scene.scene.restart();
        }


      },
      onCompleteScope: this
    });



  }
  playerVulnerable() {
    //tween player back to 100% opacity and reset invulnerability flag
    var death = this.scene.tweens.add({
      targets: this,
      alpha: 1,
      ease: 'Linear',
      duration: 200,
      onComplete: function () {
        this.invulnerable = false;
        this.invincible = false
      },
      onCompleteScope: this
    });
  }

  block() {

    var timer = this.scene.time.delayedCall(150, function () {
      // this.roll = false

    }, null, this);

  }
  swing() {
    this.swordHitBox.body.enable = true
    if (playerData.hasMagic) {
      this.shoot()
    }
    var off = this.flipX ? -12 : 12
    this.swordHitBox.x = this.x + off
    this.swordHitBox.y = this.y + 8
    var timer = this.scene.time.delayedCall(150, function () {
      this.swordHitBox.body.enable = false
      this.swordHitBox.x = 0
      this.swordHitBox.y = 0

    }, null, this);
  }
  updateBullet(bullet) {
    bullet.state -= bullet.body.newVelocity.length();

    if (bullet.state <= 0) {
      //bullet.disableBody(true, true);
      this.killBullet(bullet)
    }
  }

  shoot() {

    if (bullets.maxSize - bullets.getTotalUsed() > 0) {
      if (this.canShoot) {
        this.canShoot = false
        for (var i = 0; i < 2; i++) {
          var bullet = bullets.get().setActive(true);
          bullet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
          bullet.x = this.x;
          bullet.y = this.y + 8;
          bullet.state = 100// playerData.range
          //bullet.play('bullet-fired')
          if (i == 0) {
            bullet.setFlipX(true);
            bullet.body.setVelocityX(-bulletSpeed)
          } else {
            bullet.setFlipX(false);
            bullet.body.setVelocityX(bulletSpeed)
          }
          var ran = Math.random() < 0.5 ? -1 : 1
          bullet.body.setVelocityY(15 * ran)
          bullet.setGravityY(0)
        }
        /*   var bullet = bullets.get().setActive(true);
          bullet.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
          bullet.x = this.x;
          bullet.y = this.y - 0;
          bullet.state = 100// playerData.range
          //bullet.play('bullet-fired')
          if (this.flipX) {
            bullet.setFlipX(true);
            bullet.body.setVelocityX(-bulletSpeed)
          } else {
            bullet.setFlipX(false);
            bullet.body.setVelocityX(bulletSpeed)
          }
          var ran = Math.random() < 0.5 ? -1 : 1
          bullet.body.setVelocityY(15 * ran)
          bullet.setGravityY(0) */
        var timer = this.scene.time.delayedCall(150, function () {
          this.canShoot = true
        }, null, this);
        // var timer2 = this.scene.time.delayedCall(playerData.range, this.killBullet, [bullet], this);
      }

    }
  }
  killBullet(bullet) {
    bullets.killAndHide(bullet)
    bullet.setPosition(-50, -50)
  }
  setBomb() {
    console.log(playerData.bombCount)
    if (playerData.bombCount > 0) {
      var bomb = bombs.get().setActive(true);

      this.scene.subPotion()
      // Place the explosion on the screen, and play the animation.
      bomb.setOrigin(0.5, 0).setScale(1).setDepth(3).setVisible(true);
      bomb.x = this.x;
      bomb.y = this.y + 8;

      bomb.getBounds()

      var timer = this.scene.time.delayedCall(1000, this.explodeBomb, [bomb], this);
    }

  }
  explodeBomb(bomb) {
    bombBody.setPosition(bomb.x, bomb.y + 16)
    //bombBody.body.enable = true
    this.scene.explode(bomb.x, bomb.y)
    bomb.setActive(false);
    bomb.setVisible(false);


    this.bombSet = false

    //check if player is over bomb and jump hero
    if (Math.abs(bomb.x - this.x) <= 16 && Math.abs(bomb.y - this.y) < 10) {
      this.body.velocity.y = -350;
    }
    var timer = this.scene.time.delayedCall(100, function () {
      bombBody.setPosition(-50, -50)
    }, null, this);

  }
}