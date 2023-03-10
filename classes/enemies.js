///////////////////////////////////////////////////////////////////////////
// BASE ENEMY CLASS
///////////////////////////////////////////////////////////////////////////


class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, kind, frame) {

    super(scene, x, y, enemeyConfigs[kind].key, enemeyConfigs[kind].frame);
    this.scene = scene
    this.kind = kind
    scene.add.existing(this);
    scene.physics.add.existing(this);
    enemies.add(this)
    this.setOrigin(.5, .5);
    this.setCollideWorldBounds(true);
    this.setBounce(0)


  }
  patrol() {

    if (this.body.blocked.right || this.body.touching.right) {
      this.direction = 1
    } else if (this.body.blocked.left || this.body.touching.left) {
      this.direction = -1
    }

    if (this.direction === -1) {
      this.setFlipX(false)
      this.body.setVelocityX(40);
    } else if (this.direction == 1) {
      this.setFlipX(true)
      this.body.setVelocityX(-40);
    }
  }
  patrolTimedJump() {
    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.body.velocity.x = 0
      this.body.velocity.y = -200
      this.anims.play('enemy-jump', true).once('animationcomplete', function () {

        var dis = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)

        //console.log(dis)
        //this.toggleFlipX()
        if (this.direction == -1) {
          this.setFlipX(false)
          this.direction = 1
          this.body.velocity.x = this.vx;
          this.anims.play('enemy-run', true)
        } else if (this.direction == 1) {
          this.setFlipX(true)
          this.direction = -1
          this.body.velocity.x = -this.vx;
          this.anims.play('enemy-run', true)
        }
      }, this)
      this.previousX = this.x;
    }

  }
  patrolTimedSwing() {
    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.body.velocity.x = 0

      this.anims.play('enemy-attack', true).once('animationcomplete', function () {

        var dis = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)

        //console.log(dis)
        //this.toggleFlipX()
        if (this.direction == -1) {
          if (dis <= 26 && player.x < this.x) {
            player.playerHit(this.damage[0], this.damage[1], this.damage[2])
          }
          this.setFlipX(false)

          this.direction = 1
          this.body.velocity.x = this.vx;
          this.anims.play('enemy-run', true)
        } else if (this.direction == 1) {
          if (dis <= 28 && player.x > this.x) {
            player.playerHit(this.damage[0], this.damage[1], this.damage[2])
          }

          this.setFlipX(true)
          this.direction = -1
          this.body.velocity.x = -this.vx;
          this.anims.play('enemy-run', true)
        }
      }, this)
      this.previousX = this.x;
    }

  }
  patrolTimedThrow() {
    if (Math.abs(this.x - this.previousX) >= this.maxDistance) {
      this.body.velocity.x = 0
      this.anims.play('enemy-attack-throw', true).once('animationcomplete', function () {

        var dis = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)

        //console.log(dis)
        //this.toggleFlipX()
        if (this.direction == -1) {
          this.shoot(-1)
          this.setFlipX(false)

          this.direction = 1
          this.body.velocity.x = this.vx;
          this.anims.play('enemy-run', true)
        } else if (this.direction == 1) {
          this.shoot(1)

          this.setFlipX(true)
          this.direction = -1
          this.body.velocity.x = -this.vx;
          this.anims.play('enemy-run', true)
        }
      }, this)
      this.previousX = this.x;
    }

  }
  shoot(dir) {
    var bomb = knightbullets.get().setActive(true);
    bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
    //bomb.setGravityY(800)
    /* bomb.x = this.x;
    bomb.y = this.y; */
    bomb.damage = 10
    // bomb.body.velocity.y = -Phaser.Math.Between(175, 255);
    bomb.body.setBounce(1)
    if (dir == 1) {
      bomb.body.velocity.x = 85
      bomb.x = this.x + 4;
      bomb.y = this.y;
    } else {
      bomb.x = this.x - 4;
      bomb.y = this.y;
      bomb.body.velocity.x = -85
    }

  }
  switchDirection() {

    //reverse velocity so baddie moves are same speed but in opposite direction
    this.body.velocity.x *= -1;
    this.direction *= -1
    //reset count
    this.previousX = this.x;
  }
  enemyFollowsOnce() {
    if (!this.launched) {
      this.launched = true
      this.body.setAllowGravity(true)
      this.scene.physics.moveToObject(this, player.sprite, 50);
    }

  }
  enemyFollowsContinuous() {
    this.scene.physics.moveToObject(this, player, 25);
  }
  enemyHit(damage) {
    this.strength -= damage
    if (this.strength > 0) {


      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.1,
        scale: 1.5,
        yoyo: true,
        ease: 'Linear',
        duration: 100,
      });
      this.hit = false
    } else {
      this.disableBody(false, false);
      //make player jump up in the air a little bit
      this.scene.explode(this.x, this.y)
      if (this.shell) {
        var bomb = shells.get().setActive(true);
        bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        bomb.body.setBounce(.5, 0)
        bomb.setGravityY(800)

        bomb.body.velocity.y = -300
        bomb.x = this.x;
        bomb.y = this.y - 7;
      }
      //animate baddie, fading out and getting bigger
      var tween = this.scene.tweens.add({
        targets: this,
        alpha: 0.3,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Linear',
        duration: 200,
        onCompleteScope: this,
        onComplete: function () {
          //remove the game object
          //this.scene.createReward(this.x, this.y)
          if (this.kind == 4 || this.kind == 1) {
            this.timer.remove()
          }

          this.scene.destroyGameObject(this);

        },
      });
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// Enemy 0 BronzeKnight
////////////////////////////////////////////////////////////////////////////////////
class BronzeKnight extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)

    this.launched = false
    //this.play('thrust');
    var tiles = 4
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-jump',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [24, 25, 26, 27] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [40, 41, 42, 43, 44, 45, 46] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack-throw',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [56, 57, 58, 59, 60, 61, 62, 63] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: 12,
      repeat: 0
    })
    this.play('enemy-run')
    this.body.setSize(10, 16).setOffset(18, 16)
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.patrol()


  }

}
/////////////////////////////////////////////////////////////////////////////////////
// Enemy 1 JumperKnight
////////////////////////////////////////////////////////////////////////////////////
class JumperKnight extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-jump',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [24, 25, 26, 27] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })

    this.play('enemy-run')
    this.body.setSize(10, 16).setOffset(18, 16)
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)
    var launchTimes = [4000, 5000, 6000, 7000]
    var ranTime = Phaser.Math.Between(0, launchTimes.length - 1)
    this.timer = this.scene.time.addEvent({
      delay: Phaser.Utils.Array.GetRandom(launchTimes),                // ms
      callback: this.launch,
      callbackScope: this,
      repeat: -1
    });

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.body.blocked.down || this.body.touching.down) {
      this.anims.play('enemy-run', true)
      this.body.velocity.x = 0
    } else {
      this.anims.play('enemy-jump', true)
    }



  }
  launch() {
    //this.anims.play('enemy-jump')
    if (this.timer) {
      this.body.velocity.y = -Phaser.Math.Between(300, 450);
      this.body.velocity.x = Phaser.Math.Between(-100, 100);
    }

  }

}

/////////////////////////////////////////////////////////////////////////////////////
// Enemy 2 swordsman
////////////////////////////////////////////////////////////////////////////////////
class SwordsmanKight extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-attack',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [40, 41, 42, 43, 44, 45, 46] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.play('enemy-run')
    this.body.setSize(10, 16).setOffset(18, 16)
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.patrolTimedSwing()

  }

}



////////////////////////////////////////////////////////////////////////////////////
// Enemy 1 bat
////////////////////////////////////////////////////////////////////////////////////
class Bat extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    //this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })

    this.play('enemy-run')
    this.body.setSize(16, 8).setOffset(0, 4)
    this.body.velocity.x = -this.vx;
    console.log('BAT')
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (Math.abs(this.x - player.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    }

    /*  if (this.direction == -1 && this.body.blocked.left) {
       // console.log('blocked left')
       this.setFlipX(false)
       this.body.velocity.x = this.vx;
       this.direction = 1
       this.previousX = this.x;
       //this.switchDirection();
     }
     if (this.direction == 1 && this.body.blocked.right) {
       //console.log('blocked right')
       this.setFlipX(true)
       this.body.velocity.x = -this.vx;
       this.direction = -1
       this.previousX = this.x;
       //this.switchDirection();
     } */


  }

}
////////////////////////////////////////////////////////////////////////////////////
// Enemy 2 Flying Crow
////////////////////////////////////////////////////////////////////////////////////
class CrowFly extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    //this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })

    this.play('enemy-run')
    this.body.setSize(16, 8).setOffset(0, 4)
    this.body.velocity.x = -this.vx;
    console.log('BAT')
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.body.velocity.x > 0) {
      this.setFlipX(true)
    } else {
      this.setFlipX(false)
    }
    if (Math.abs(this.x - player.x) < this.maxDistance) {
      this.enemyFollowsContinuous()
    }

    /*  if (this.direction == -1 && this.body.blocked.left) {
       // console.log('blocked left')
       this.setFlipX(false)
       this.body.velocity.x = this.vx;
       this.direction = 1
       this.previousX = this.x;
       //this.switchDirection();
     }
     if (this.direction == 1 && this.body.blocked.right) {
       //console.log('blocked right')
       this.setFlipX(true)
       this.body.velocity.x = -this.vx;
       this.direction = -1
       this.previousX = this.x;
       //this.switchDirection();
     } */


  }

}
////////////////////////////////////////////////////////////////////////////////////
// Enemy 3 Sitting Crow
////////////////////////////////////////////////////////////////////////////////////
class CrowSit extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    //this.setGravityY(800)
    this.launched = false
    //this.play('thrust');
    var tiles = 3
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-craw',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [2, 3, 3, 2] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: 12,
      repeat: 0
    })
    this.play('enemy-run')
    this.body.setSize(12, 14).setOffset(2, 2)
    // this.body.velocity.x = -this.vx;

    this.direction = -1;
    this.setFlipX(true)
    this.timer = this.scene.time.addEvent({
      delay: 4500,                // ms
      callback: this.craw,
      callbackScope: this,
      repeat: -1
    });

  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    /*  if (Math.abs(this.x - player.x) < this.maxDistance) {
       this.enemyFollowsContinuous()
     } */

    /*  if (this.direction == -1 && this.body.blocked.left) {
       // console.log('blocked left')
       this.setFlipX(false)
       this.body.velocity.x = this.vx;
       this.direction = 1
       this.previousX = this.x;
       //this.switchDirection();
     }
     if (this.direction == 1 && this.body.blocked.right) {
       //console.log('blocked right')
       this.setFlipX(true)
       this.body.velocity.x = -this.vx;
       this.direction = -1
       this.previousX = this.x;
       //this.switchDirection();
     } */


  }
  craw() {
    this.play('enemy-craw', true).once('animationcomplete', function () {
      this.play('enemy-run', true)
      var dis = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)
      var bomb = crowbullets.get().setActive(true);
      bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
      //bomb.setGravityY(800)
      bomb.x = this.x;
      bomb.y = this.y;
      bomb.damage = 10
      // bomb.body.velocity.y = -Phaser.Math.Between(175, 255);
      bomb.body.setBounce(1)
      bomb.body.velocity.x = 85
      //console.log(dis)
      //this.toggleFlipX()
      /*  if (this.direction == -1) {
         if (dis <= 96 && player.x < this.x) {
           player.playerHit(this.damage[0], this.damage[1], this.damage[2])
         }
 
       } else {
         if (dis <= 96 && player.x > this.x) {
           player.playerHit(this.damage[0], this.damage[1], this.damage[2])
         }
 
       } */



    }, this)
  }

}

/////////////////////////////////////////////////////////////////////////////////////
// Enemy 5 ThrowingKnight
////////////////////////////////////////////////////////////////////////////////////
class ThrowingKnight extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)

    this.launched = false
    //this.play('thrust');
    var tiles = 4
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:


    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-jump',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [24, 25, 26, 27] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [40, 41, 42, 43, 44, 45, 46] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack-throw',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [56, 57, 58, 59, 60, 61, 62, 63] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: 12,
      repeat: 0
    })
    this.play('enemy-run')
    this.body.setSize(10, 16).setOffset(18, 16)
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.patrolTimedThrow()
    //this.patrol()


  }

}

/////////////////////////////////////////////////////////////////////////////////////
// Enemy 6 turtle knight
////////////////////////////////////////////////////////////////////////////////////
class TurtleKnight extends Enemy {
  constructor(scene, x, y, kind) {
    super(scene, x, y, kind);

    const anims = scene.anims;

    this.setGravityY(800)

    this.launched = false
    //this.play('thrust');
    var tiles = 4
    this.vx = Phaser.Math.Between(10, 25)
    var maxDistance = (tiles * scene.map.tileWidth) + scene.map.tileWidth / 2;
    //  You can either do this:
    this.shell = true

    this.previousX = this.x;
    this.strength = enemeyConfigs[kind].strength
    this.damage = enemeyConfigs[kind].damage
    this.frozen = false
    this.maxDistance = maxDistance
    this.saveXYV = { x: 0, y: 0 }
    this.anims.create({
      key: 'enemy-run',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: enemeyConfigs[kind].frames }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: -1
    })
    this.anims.create({
      key: 'enemy-jump',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [24, 25, 26, 27] }),
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [40, 41, 42, 43, 44, 45, 46] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: enemeyConfigs[kind].fr,
      repeat: 0
    })
    this.anims.create({
      key: 'enemy-attack-throw',
      frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, { frames: [56, 57, 58, 59, 60, 61, 62, 63] }),//40, 41, 42, 43, 44, 45, 46    48, 49, 50, 51, 52, 53, 54    56, 57, 58, 59, 60, 61, 62, 63
      // frames: anims.generateFrameNumbers(enemeyConfigs[kind].key, enemeyConfigs[kind].frames),
      frameRate: 12,
      repeat: 0
    })
    this.play('enemy-run')
    this.body.setSize(10, 16).setOffset(18, 16)
    this.body.velocity.x = -this.vx;
    this.direction = -1;
    this.setFlipX(true)


  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.patrolTimedJump()


  }

}



let enemeyConfigs = [
  {
    id: 0,
    key: 'knight',
    name: 'Bronze Knight',
    frames: [8, 9, 10, 11, 12, 13],
    fr: 12,
    strength: 1,
    damage: [-1, -2, 0]
  },
  {
    id: 1,
    key: 'knighttan',
    name: 'Jumper Knight',
    frames: [0, 1, 2, 3, 4, 5],
    fr: 6,
    strength: 1,
    damage: [-1, -2, 0]
  },
  {
    id: 2,
    key: 'knightgrey',
    name: 'Swordsman Knight',
    frames: [8, 9, 10, 11, 12, 13],
    fr: 12,
    strength: 1,
    damage: [-1, -3, -1]
  },
  {
    id: 3,
    key: 'crow',
    name: 'Flying Crow',
    frames: [8, 9, 10, 11, 12, 13, 14, 15],
    fr: 8,
    strength: 1,
    damage: [-1, -3, -1]
  },
  {
    id: 4,
    key: 'crow',
    name: 'Sitting Crow',
    frames: [0, 1],
    fr: 3,
    strength: 1,
    damage: [-1, -3, -1]
  },
  {
    id: 5,
    key: 'knightgold',
    name: 'Throwing Knight',
    frames: [8, 9, 10, 11, 12, 13],
    fr: 8,
    strength: 1,
    damage: [-1, -3, -1]
  },
  {
    id: 6,
    key: 'knightturtle',
    name: 'Turtle Knight',
    frames: [8, 9, 10, 11, 12, 13],
    fr: 8,
    strength: 1,
    damage: [-1, -3, -1]
  }
]