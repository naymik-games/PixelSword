let game;


let back1, back3, layer, player, standing, cursors, prevPos = 0,
  yPos = 0,
  jumps = 2,
  touchJump = false,
  touchJumpThreshold = 5,
  touchSlider,
  sliderBar,
  sliderKnob,
  touchMoving = false,
  touchMoveThreshold = 10,
  touchMoveThresholdY = 50,
  largeThumbMoveAcross = 25,
  thumbSizeOffset = 60,

  startX,
  startY,
  coins,

  enemies,
  crowbullets,
  knightbullets,
  torchballs,
  bombs,
  bombBody,
  shells,
  keys,
  onLadder = false,
  shellSpeed = 200,
  acceleration = 350,
  maxVelocityX = 200,//100 normal //fast 200
  maxVelocityY = 600,
  superMaxVelocityX = 300,
  jumpVelocity = -350,
  jumping = false,
  wasStanding = false,
  edgeTimer = 0,
  bullets,
  bulletSpeed = 200;
let powerupGroup

let oneWayBlocks
let oneWayUpFrame1 = 5
let oneWayUpFrame2 = 4

let collapsingBlocks
let collapseFrame = 20

let questions
let questionFrame = 6

let spikes
let spikeFrame = 1

let jumpers
let jumperFrame = 60

let ladders
let ladderFrame = 42
let ladderFrame2 = 57

let puffBall
let puffPlants
let puffPlantFrame = 66

let lavaSpouts
let lavaFalls
let lavaSplashes
let lavaPool
let lavaSpoutFrame = 13
let lavaFallsFrame = 28
let lavaSplashFrame = 43
let lavaPoolFrame = 58

let fires
let fireFrame = 15

let torches
let torchFrame = 32

let fallingBlocks
let fallingBlockFrame = 11

let doors
let doorFrame = 31
let doorLockedFrame = 37

let hPlatforms
let hPlatformFrame = 27

let spears
let spearFrame = 34

let bombBlocks
let bombBlockFrame = 35



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 600,
      height: 1100
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    transparent: true,
    pixelArt: true,
    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {
    this.load.tilemapTiledJSON(levels[currentWorld][currentLevel].map, 'assets/maps/' + levels[currentWorld][currentLevel].map + '.json')

  }
  create() {

    console.log(levels[currentWorld][currentLevel])
    this.cameras.main.setBackgroundColor(0x0A0435);
    this.map = null
    this.tiles = null
    this.map = this.make.tilemap({ key: levels[currentWorld][currentLevel].map });
    this.tiles = this.map.addTilesetImage('tiles', 'tiles');



    back1 = this.add.tileSprite(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2, levels[currentWorld][currentLevel].backKey);
    back3 = this.add.tileSprite(game.config.width / 2, game.config.height / 2, this.map.widthInPixels * 2, 208, 'back3');
    const layerBack = this.map.createLayer('back', this.tiles);
    const layerDec = this.map.createLayer('deco', this.tiles);

    layer = this.map.createLayer('main', this.tiles);

    layer.setCollisionByExclusion([-1, collapseFrame, oneWayUpFrame1, oneWayUpFrame2, questionFrame, spikeFrame, jumperFrame, ladderFrame, ladderFrame2, puffPlantFrame, lavaSpoutFrame, lavaFallsFrame, lavaSplashFrame, lavaPoolFrame, fireFrame, doorFrame, doorLockedFrame, torchFrame, hPlatformFrame, spearFrame, bombBlockFrame]);

    var oneways = [120, 121, 123, 125, 180, 181, 185, 201, 204, 233, 235, 235, 236, 238, 239, 250, 366, 367, 368, 369, 370, 371, 372, 382, 383, 384, 405, 406, 407, 408, 409, 410, 411, 412, 413, 503, 504, 506, 507, 508]

    layer.forEachTile(tile => {
      if (oneways.indexOf(tile.index) > -1) {
        tile.setCollision(false, false, true, false);
      }
    });




    bullets = this.physics.add.group({
      defaultKey: 'magicbullet',
      maxSize: 5,
      allowGravity: true,
      immovable: true
    });
    puffBall = this.physics.add.group({
      defaultKey: 'enemybullets',
      defaultFrame: 2,
      maxSize: 30,
      allowGravity: true,
      immovable: true
    });
    torchballs = this.physics.add.group({
      defaultKey: 'enemybullets',
      defaultFrame: 3,
      maxSize: 30,
      allowGravity: true,
      immovable: true
    });
    crowbullets = this.physics.add.group({
      defaultKey: 'enemybullets',
      defaultFrame: 0,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    knightbullets = this.physics.add.group({
      defaultKey: 'enemybullets',
      defaultFrame: 1,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    powerupGroup = this.physics.add.group({
      defaultKey: 'tiles',
      defaultFrame: 9,
      maxSize: 30,
      allowGravity: false,
      immovable: true
    });
    shells = this.physics.add.group({
      defaultKey: 'shell',
      maxSize: 30,
      allowGravity: true,
      immovable: true
    });
    bombs = this.add.group({
      defaultKey: 'bomb',
      maxSize: 30
    });

    this.anims.create({
      key: 'effect-explode',
      frames: 'explode',
      frameRate: 20,
      repeat: 0
    });
    this.bursts = this.add.group({
      defaultKey: 'explode',
      maxSize: 30
    });

    this.createOneWay(layer)
    this.createQuestions(layer)
    this.createCollapse(layer)
    this.createSpikes(layer)
    this.createJumpers(layer)
    this.createLadders(layer)
    this.createPuffs(layer)
    this.createLava(layer)
    this.createFires(layer)
    this.createFallingBlocks(layer)
    this.createDoors(layer)
    this.createTorches(layer)
    this.createHPlatforms(layer)
    this.createSpear(layer)
    this.createBombBlocks(layer)

    this.thinglayer = this.map.getObjectLayer('things')['objects'];
    this.createCoins()
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 100);// 
    this.cameras.main.setViewport(0, 100, game.config.width, game.config.height);
    this.cameras.main.setZoom(3)
    this.createPlayer()
    this.createEnemies()
    this.createKeys()




    this.cameras.main.startFollow(player, true, 0.65);



    bombBody = this.add.rectangle(0, 0, 32, 32, 0x9966ff, 0).setStrokeStyle(1, 0xefc53f);
    this.physics.add.existing(bombBody);


    const layerFor = this.map.createLayer('fore', this.tiles);

    this.physics.world.addCollider(player, layer)
    this.physics.world.addCollider(player, lavaSpouts)
    this.physics.world.addCollider(player, hPlatforms)
    this.physics.add.overlap(player, fallingBlocks, this.hitFallingBlock, null, this)

    this.physics.add.overlap(player, ladders, this.isOnLadder, null, this);
    this.physics.add.collider(player, ladders, null, this.checkLadderTop, this);

    this.physics.add.collider(player, bombBlocks);
    this.physics.add.collider(player, oneWayBlocks, null, this.checkOneWay, this);
    this.physics.add.collider(player, collapsingBlocks, this.shakeBlock, this.checkOneWay, this);
    this.physics.add.collider(player, questions, this.hitQuestionMarkBlock, null, this);
    this.physics.add.overlap(player, coins, this.collectObject, null, this);
    this.physics.add.overlap(player, keys, this.collectObject, null, this);
    this.physics.add.overlap(player, powerupGroup, this.collectPowerup, null, this);
    this.physics.add.overlap(player, doors, this.hitDoor, null, this);
    this.physics.add.collider(player, jumpers, this.hitJumper, null, this);

    this.physics.add.collider(player, shells, this.hitShell, null, this);

    this.physics.add.collider(player, spikes, this.hitSpikes, null, this);
    this.physics.add.overlap(player, puffBall, this.hitPuffball, null, this);
    this.physics.add.overlap(player, torchballs, this.hitTorchball, null, this);
    this.physics.add.overlap(player, fires, this.hitLavaPool, null, this);
    this.physics.add.overlap(player, lavaFalls, this.hitLava, null, this);
    this.physics.add.overlap(player, lavaSplashes, this.hitLava, null, this);
    this.physics.add.overlap(player, lavaPool, this.hitLavaPool, null, this);
    this.physics.add.overlap(player, spears, this.hitSpear, null, this);

    this.physics.add.overlap(player.swordHitBox, enemies, this.swordHitEnemy, null, this);
    this.physics.add.overlap(player, enemies, this.playerHitEnemy, null, this);
    this.physics.world.addCollider(player, crowbullets, this.crowBulletHitPlayer, null, this);
    this.physics.world.addCollider(player, knightbullets, this.crowBulletHitPlayer, null, this);

    this.physics.world.addCollider(puffBall, layer, this.puffHitLayer, null, this);
    this.physics.world.addCollider(torchballs, layer, this.torchHitLayer, null, this);

    this.physics.world.addCollider(fallingBlocks, layer, this.blockHitLayer, null, this)

    this.physics.world.addCollider(powerupGroup, layer);

    this.physics.world.addCollider(enemies, layer)
    this.physics.world.addCollider(enemies, bombBlocks, null, null, this)

    this.physics.world.addCollider(hPlatforms, layer)

    this.physics.world.addCollider(shells, layer, this.shellHitLayer, null, this)

    this.physics.world.addCollider(crowbullets, layer, this.crowBulletHitLayer, null, this);
    this.physics.world.addCollider(knightbullets, layer, this.crowBulletHitLayer, null, this);
    this.physics.world.addCollider(knightbullets, enemies, this.swordHitEnemy, null, this);

    this.physics.world.addCollider(bombBody, bombBlocks, this.hitBombBlock, null, this);

    this.physics.world.addCollider(bullets, layer, this.bulletHitLayer, null, this);
    this.physics.world.addCollider(bullets, enemies, this.swordHitEnemy, null, this);

    this.buildTouchSlider()



    cursors = this.input.keyboard.createCursorKeys();
    this.input.addPointer(1);
  }
  update() {
    player.update()
    // emitter.setPosition(player.x, player.y);
    var standing = player.body.blocked.down || player.body.touching.down;

    var onWall = (player.body.blocked.left || player.body.blocked.right) && !player.body.blocked.down
    //if left key is down then move left
    if (cursors.left.isDown) {
      this.moveLeft(acceleration);
    } else if (cursors.right.isDown) {
      //same deal but for right arrow
      this.moveRight(acceleration);
    } else if (cursors.down.isDown) {
      //same deal but for right arrow
      player.roll = true
      player.block()
    }
    ///////
    // LEFT RIGHT
    ///////
    //if either touch pointer is down. Two thumbs, two pointers
    if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
      touchSlider.x = player.x;
      //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
      touchSlider.y = player.y - thumbSizeOffset
      //work out half way point of our game
      var leftHalf = game.config.width * .75;

      //Left hand side - horizontal movement
      //if thumb is on the left hand side of the screen we are dealing with horizontal movement
      if (this.input.pointer1.x < leftHalf || this.input.pointer2.x < leftHalf) {
        //reset pointer variable
        var myMovePointer = null;
        //here we get the pointer that is being used on the left hand side of screen. Depends which thumb they touched screen with first.
        if (this.input.pointer1.x < leftHalf && this.input.pointer1.isDown) {
          myMovePointer = this.input.pointer1;
        }
        if (this.input.pointer2.x < leftHalf && this.input.pointer2.isDown) {
          myMovePointer = this.input.pointer2;
        }

        //if we have an active touch pointer on the left hand side of the screen then...
        if (myMovePointer) {
          //if touchSlide is not already showing then
          if (!touchSlider.alpha) {
            //make it visible
            touchSlider.alpha = 1;
            //position touchSlider to be where the users thumb or finger is
            touchSlider.x = player.x;
            //with the Y pos we add a thumbSizeOffset so it's above the users thumb not hidden under it
            touchSlider.y = player.y - thumbSizeOffset
            //set our start point and reset slider display
            startX = myMovePointer.x;
            startY = myMovePointer.y;
            sliderKnob.x = 0;
          }
          if (myMovePointer.y < startY) {

            var movementY = 0;
            if (myMovePointer.y < startY) movementY = startY - myMovePointer.y;
            if (movementY > touchMoveThresholdY && !touchJump) {
              if (onLadder) {
                //console.log('on ladder')
                player.x = this.currentLadder.x;
                //also kill any x velocity to be sure
                player.setVelocityX(0);
                player.setVelocityY(-100);
              } else {
                // console.log('thumb up')
                touchJump = true;
                startY = myMovePointer.y
              }


            }
          } else if (myMovePointer.y > startY) {
            var movementYDown = 0;
            if (myMovePointer.y > startY) movementYDown = myMovePointer.y - startY;
            if (movementYDown > touchMoveThresholdY && !player.roll) {
              if (onLadder) {
                console.log('on ladder')
                player.x = this.currentLadder.x;
                //also kill any x velocity to be sure
                player.setVelocityX(0);
                player.setVelocityY(100);
              } else {
                console.log('thumb down')
                player.roll = true;
                //player.block()
                player.anims.play("player-roll", true);
                startY = myMovePointer.y
              }


            }
          }
          //if thumb has moved left or right of where we started then move
          if (myMovePointer.x < startX || myMovePointer.x > startX) {
            //work out how far thumb has moved. Is this a big enough movement?
            var movement = 0;
            if (myMovePointer.x < startX) movement = startX - myMovePointer.x;
            if (myMovePointer.x > startX) movement = myMovePointer.x - startX;
            //If move is significant enough then move our character
            if (movement > touchMoveThreshold) {
              //set flag as we are definitely moving
              touchMoving = true;

              //set slider knob position to be half way to edge
              var sliderPos = 0;
              //left
              if (myMovePointer.x < startX) sliderPos = -(sliderBar.width / 4);
              //right
              if (myMovePointer.x > startX) sliderPos = sliderBar.width / 4;

              //set acceleration to be an 8th of normal
              var tmpAcceleration = acceleration / 8;

              //if thumb has moved quite a lot, then go faster
              if (movement > largeThumbMoveAcross) {
                //the knob position should be at the edge as we're at full tilt
                if (myMovePointer.x < startX) sliderPos = -(sliderBar.width / 2);
                if (myMovePointer.x > startX) sliderPos = sliderBar.width / 2;
                //acceleration is normal
                tmpAcceleration = acceleration;
              }

              //tween slider knob to position we just worked out
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: sliderPos,
                ease: "Power1",
                duration: 300
              });
              if (myMovePointer.x < startX) {
                //   console.log('left')
                this.moveLeft(tmpAcceleration);
              }
              if (myMovePointer.x > startX) {
                //  console.log('righ')
                this.moveRight(tmpAcceleration);
              }
            } else {
              //If move is really, really small then we don't count it. Stop moving
              //set moving flag to false
              touchMoving = false;
              //reset slider knob to center position
              var tween = this.tweens.add({
                targets: sliderKnob,
                x: 0,
                ease: "Power1",
                duration: 300
              });
            }
          }
        }
      }
      ///////
      // action
      ///////
      //Right hand side - Touch Jumping
      //if thumb is on the right hand side of the screen we are dealing with vertical movement - i.e. jumping.
      if (this.input.pointer1.x > leftHalf || this.input.pointer2.x > leftHalf) {
        //reset pointer variable
        var myJumpPointer = null;
        //get active touch pointer for this side of the screen
        if (this.input.pointer1.x > leftHalf && this.input.pointer1.isDown) {
          myJumpPointer = this.input.pointer1;
        }
        if (this.input.pointer2.x > leftHalf && this.input.pointer2.isDown) {
          myJumpPointer = this.input.pointer2;
        }
        //if we have a touch pointer on right hand side of screen...
        if (myJumpPointer) {
          //store last y position of touch pointer
          prevPos = yPos;
          //get new position of touch pointer
          yPos = myJumpPointer.y;



          //if we have moved our thump upwards and it's more than our threshold then we set jump flag to true
          if (prevPos - yPos > touchJumpThreshold) {
            //  touchJump = true;
            console.log('button')
            if (player.roll && !player.bombSet) {
              player.bombSet = true
              player.setBomb()
            } else if (player.canShoot && !player.roll) {
              if (player.activeWeapon == 'sword') {
                player.swinging = true
                player.swing()
              } else if (player.activeWeapon == 'sling') {
                player.fire = true

                var timer = this.time.delayedCall(750, function () {
                  player.shoot()
                }, null, this);
              } else if (player.activeWeapon == 'cast') {
                player.cast = true
              }

            }
          }
        }
      }
      //neither thumb is down so reset touch movement variables and hide touchSlider
    } else {
      touchSlider.alpha = 0;
      startX = 0;
      touchMoving = false;
      touchJump = false
      if (onLadder) {
        player.setVelocityY(0);
      }
    }

    //if not moving left or right via keys or touch device...
    if (!cursors.right.isDown && !cursors.left.isDown && !touchMoving) {
      //if hero is close to having no velocity either left or right then set velocity to 0. This stops jerky back and forth as the hero comes to a halt. i.e. as we slow hero down, below a certain point we just stop them moving altogether as it looks smoother
      if (
        Math.abs(player.body.velocity.x) < 10 &&
        Math.abs(player.body.velocity.x) > -10
      ) {
        player.setVelocityX(0);
        player.setAccelerationX(0);
      } else {
        //if our hero isn't moving left or right then slow them down
        //this velocity.x check just works out whether we are setting a positive (going right) or negative (going left) number
        player.setAccelerationX(
          (player.body.velocity.x > 0 ? -1 : 1) * acceleration / 3
        );
      }
    }

    //get current time in seconds
    var d = new Date();
    var time = d.getTime();

    //if we have just left the ground set edge time for 100ms time
    if (!standing && wasStanding) {
      edgeTimer = time + 100;
    }


    //if player is standing, or just fallen off a ledge (within our allowed grace time) and...
    //either up key is press, or touchjump flag is set AND they are not already jumping then jump! !jumping
    if ((standing || time <= edgeTimer) && (cursors.up.isDown || touchJump) && !jumping && !onLadder) {
      player.setVelocityY(jumpVelocity);
      jumping = true;
      player.roll = false
    }

    //if not pressing up key...
    if (!cursors.up.isDown) {
      //if player is touching ground / platform then reset jump parametrs
      if (player.body.blocked.down || player.body.touching.down) {
        jumping = false;
        touchJump = false;
        jumps = 2
        prevPos = 0;
      }
    }
    wasStanding = standing;
    if (!onLadder) player.body.setAllowGravity(true);
    onLadder = false;
  }
  moveLeft(acceleration) {
    var standing = player.body.blocked.down || player.body.touching.down;

    player.flipX = true
    //if hero is on ground then use full acceleration
    if (standing) {
      player.setAccelerationX(-acceleration);
    } else {
      //if hero is in the air then accelerate slower
      player.setAccelerationX(-acceleration / 1.5);
    }
  }

  moveRight(acceleration) {
    var standing = player.body.blocked.down || player.body.touching.down;
    player.flipX = false

    //if hero is on ground then use full acceleration
    if (standing) {
      player.setAccelerationX(acceleration);
    } else {
      //if hero is in the air then accelerate slower
      player.setAccelerationX(acceleration / 1.5);
    }
  }
  /////////////////////////////////////////////////////////////////////////
  hitSpikes(playersprite, spike) {
    if (this.spikesActive) {
      player.playerHit(1)
    }
  }
  hitSpear(playersprite, spear) {
    player.playerHit(1)
  }
  hitPuffball(playersprite, puffball) {
    player.playerHit(1)
  }
  hitTorchball(playersprite, torchball) {
    player.playerHit(1)
  }
  hitLava(playersprite, spike) {
    if (this.lavaActive) {
      player.playerHit(1)
    }
  }
  hitLavaPool(playersprite, spike) {
    player.playerHit(1)
  }
  hitFallingBlock(playersprite, block) {
    if (block.fallingActive) {
      player.playerHit(1)
    }
  }
  ////
  playerHitEnemy(playersprite, baddie) {
    if (player.roll) {

    } else {
      player.playerHit(1)
    }
  }
  crowBulletHitPlayer(playersprite, bullet) {
    if (player.roll) {
      bullet.body.velocity.x *= -1
    } else {
      player.playerHit(1)
    }
  }
  swordHitEnemy(bullet, baddie) {
    baddie.enemyHit(1)
    //player.killBullet(bullet)

  }
  /////
  hitDoor(playersprite, door) {
    if (door.kind == 'door-locked' && !player.hasKey) { return }
    if ((door.kind == 'door-locked' && player.hasKey) || door.kind == 'door') {
      if (!door.hit) {
        door.hit = true
        currentLevel++
        var t1 = this.tweens.add({
          targets: player,
          x: door.x,
          duration: 500,
          onCompleteScope: this,
          onComplete: function () {
            door.anims.play('layer-door', true).once('animationcomplete', function () {
              // this.scene.stop()
              //this.scene.stop('UI')
              this.nextLevel()
              this.scene.restart()
            }, this)

          }
        })
      }
    }

  }
  checkOneWay(player, oneway) {
    if (oneway.kind == 'up') {
      if (player.y < oneway.y) {
        return true;
      }
    }
    if (oneway.kind == 'down') {
      if (player.y > oneway.y) {
        return true;
      }
    }
    if (oneway.kind == 'left') {
      if (player.x < oneway.x) {
        return true;
      }
    }
    if (oneway.kind == 'right') {
      if (player.x > oneway.x) {
        return true;
      }
    }
    //otherwise disable collision
    return false;
  }
  hitBombBlock(body, block) {
    this.destroyPlatform(block)
  }
  shakeBlock(playersprite, block) {
    //only make platform shake if player is standing on it
    if (playersprite.body.blocked.down) {//|| playersprite.body.touching.down
      //do a little camera shake to indicate something bad is going to happen
      this.cameras.main.shake(50, 0.001);
      //we need to store the global scope here so we can keep it later
      var ourScene = this;
      //do a yoyo tween shaking the platform back and forth and up and down
      var tween = this.tweens.add({
        targets: block,
        yoyo: true,
        repeat: 10,
        x: {
          from: block.x,
          to: block.x + 2 * 1,
        },
        ease: 'Linear',
        duration: 50,
        onComplete: function () {
          ourScene.destroyPlatform(block)
        }
      });
    }
  }
  destroyPlatform(platform) {
    var tween = this.tweens.add({
      targets: platform,
      alpha: 0,
      y: "+=25",
      ease: 'Linear',
      duration: 100,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(platform);
      }
    });
  }
  isOnLadder(player, ladder) {
    //set ladder flag to true and remove gravity
    if (Math.floor(player.y) + (player.height / 2) > ladder.y - (ladder.height / 2)) {

      onLadder = true;
      this.currentLadder = ladder;
      player.body.setAllowGravity(false);
    }
  }
  checkLadderTop(player, ladder) {
    /* We check here if our player is higher up than the ladder i.e. if the player is on top of the ladder
    the sprites are positioned from their centres, so we have to add or subtract half their height to find the heroes feet and the top of the ladder. 
    With the player we add half the height so we are checking the positon of their feet. With the ladder we add half the height so we are checking the top of the ladder. We also round the two values differently, floor for the player to give us the smallest number possible and ceil for the ladder height to give us the highest number possible. This deals with any subpixel values.
    */
    if (Math.floor(player.y + (player.height / 2)) <= Math.ceil(ladder.y - (ladder.height / 2))) {
      //if pressing the down key, or touch down return false and cancel collision
      if (cursors.down.isDown || (Math.floor(prevPos) < Math.floor(yPos))) return false;
      //return true making our collision happen i.e. the player can walk on top of the ladder
      else return true;
    }
    //otherwise return false which cancels the collision
    else {
      return false;
    }
  }
  bulletHitLayer(bullet, layer) {
    bullets.killAndHide(bullet)
    bullet.setPosition(-50, -50)
  }
  puffHitLayer(ball, layer) {
    puffBall.killAndHide(ball)
    ball.setPosition(-50, -50)
  }
  torchHitLayer(ball, layer) {
    torchballs.killAndHide(ball)
    ball.setPosition(-50, -50)
  }
  crowBulletHitLayer(ball, layer) {
    crowbullets.killAndHide(ball)
    ball.setPosition(-50, -50)
  }
  blockHitLayer(ball, layer) {
    ball.fallingActive = false
  }
  checkShell(shell, layer) {
    if (shell.body.velocity.x > 1) {
      shell.setAlpha(0)
    }
  }

  hitQuestionMarkBlock(player, block) {
    //if the block has been hit from the bottom and is not already hit then...
    if (block.body.touching.down && !block.hit) {
      //mark block as hit
      //  block.hit = true;
      //frames: 9,30,33
      var powerUpFrames = [8, 9, 30, 33]
      var powerup = powerupGroup.get().setActive(true);
      powerup.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
      var type = Phaser.Utils.Array.GetRandom(powerUpFrames)
      if (type == 9) {
        powerup.kind = 'shield'
        powerup.setScale(1.5)
      } else if (type == 30) {
        powerup.kind = 'invincible'
      } else if (type == 8) {
        powerup.kind = 'magic'
      } else {
        powerup.kind = 'potion'
      }
      powerup.setFrame(type)
      powerup.enableBody = true;
      powerup.x = block.x;
      powerup.y = block.y;

      powerup.body.setVelocityY(-300);
      powerup.body.setVelocityX(80)
      powerup.setGravityY(800)

      powerup.body.setAllowGravity(true);

      //animate the box being hit and jumping up slightly
      var tween = this.tweens.add({
        targets: block,
        y: "-=5",
        ease: 'Linear',
        yoyo: true,
        duration: 100
      });
    }
  }
  collectPowerup(playersprite, power) {
    // player.setTintFill(0xff0000)
    power.disableBody(false, false);
    console.log(power.kind)
    if (power.kind == 'shield') {
      this.addShield()
    } else if (power.kind == 'potion') {
      this.addPotion()
    } else if (power.kind == 'magic') {
      this.addMagic()
      playerData.hasMagic = true
    }
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    var tween = this.tweens.add({
      targets: player,
      scaleX: 1.75,
      scaleY: 1.75,
      //yoyo: 1,
      // repeat: 1,
      ease: 'Linear',
      yoyo: true,
      duration: 300,
      onComplete: function () {
        //when the tween is over call this function
        // growHero();
      },
    });

    var tween = this.tweens.add({
      targets: power,
      alpha: 0.3,
      angle: 720,
      //x: scoreCoin.x,
      y: '-=50',
      scaleX: 0.5,
      scaleY: 0.5,
      ease: "Linear",
      duration: 500,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(power);
      }
    });
  }
  collectObject(playersprite, gameObject) {
    //stop coin for being collected twice, as it will stick around on the screen as it animnates
    gameObject.disableBody(false, false);
    if (gameObject.type == 'Coin') {
      // playerData.coinCount++
      this.addScore()
    }

    if (gameObject.type == 'pellet') {
      //playerData.health += gameObject.amount
      this.addScore(gameObject.amount)
    }
    if (gameObject.type == 'missle') {
      if (playerData.missleCount + gameObject.amount > playerData.missleCapacity) {
        playerData.missleCount = playerData.missleCapacity
        this.collectMissle()
      } else {
        playerData.missleCount += gameObject.amount
        this.collectMissle()
      }

    }
    if (gameObject.type == 'Key') {
      player.hasKey = true
      this.addKey()
    }
    if (gameObject.type == 'Energy Tank') {

      this.addScore(100)
    }
    if (gameObject.type == 'invincible') {
      console.log('invincible')
      //this.player.hasKey = true
      //this.updateKey()
      player.invincible = true
      player.sprite.body.maxVelocity.x = superMaxVelocityX;
      //start our emitter
      emitter.resume();
      var t = this.tweens.add({
        targets: player.sprite,
        alpha: .2,
        duration: 750,
        repeat: 5,
        yoyo: true,
        onCompleteScope: this,
        onComplete: function () {
          player.invincible = false
          player.sprite.body.maxVelocity.x = maxVelocityX;
          emitter.pause()
          emitter.killAll();
        }
      })
    }
    //tween coin to score coin in corner shrink
    var tween = this.tweens.add({
      targets: gameObject,
      alpha: 0.3,
      angle: 720,
      //x: scoreCoin.x,
      y: '-=50',
      scaleX: 0.5,
      scaleY: 0.5,
      ease: "Linear",
      duration: 500,
      onCompleteScope: this,
      onComplete: function () {
        this.destroyGameObject(gameObject);
      }
    });


  }
  hitJumper(player, jumper) {
    if (player.body.touching.down && jumper.body.touching.up) {
      jumper.anims.play('layer-jump')
      player.body.velocity.y = -820;
    }

  }
  hitShell(player, shell) {
    //work out the center point of the shell and player
    var threshold = shell.x + (shell.width / 2),
      playerX = player.x + (player.width / 2);

    //if the player has jumped on top of the shell...
    if (shell.body.touching.up) {
      shell.disableBody(false, false);
      var tween2 = this.tweens.add({
        targets: shell,
        alpha: 0.3,
        scaleX: 2,
        scaleY: 2,
        y: "-=100",
        rotation: -360,
        ease: 'Linear',
        duration: 200,
        onCompleteScope: this,
        onComplete: function () {
          this.destroyGameObject(shell);
        },
      });
      //if player landed on left hand side of shell send shell off to right
      // if (playerX < threshold) shell.body.velocity.x = shellSpeed;
      //if player landed on right hand side of shell send shell off to left
      // else shell.body.velocity.x = -shellSpeed;

      player.body.velocity.y = -200;
    }
    //player hit shell from left so send right
    if (shell.body.touching.left) {
      if (shell.body.velocity.x < 0) {
        console.log('moving shell hit')
        player.playerHit(1)
      }
      shell.body.velocity.x = shellSpeed;
    }
    //player hit shell from right so send left
    if (shell.body.touching.right) {

      if (shell.body.velocity.x > 1) {
        console.log('moving shell hit')
        player.playerHit(1)
      }
      shell.body.velocity.x = -shellSpeed;
    }
    //make player react to shell by bouncing slightly

  }
  //////////////////////////////////////////////////////////////////////////
  createOneWay(layer) {
    // let oneWayBlocks
    //let oneWayUpFrame1 = 5
    //let oneWayUpFrame2 = 4
    oneWayBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(oneWayUpFrame1, 0, { key: 'tiles', frame: oneWayUpFrame1 }, null, null, layer)
    var sprites2 = this.map.createFromTiles(4, 0, { key: 'tiles', frame: 4 }, null, null, layer)
    console.log('create on way')
    console.log('sprites length' + sprites.length)
    /*   var sprites3 = this.map.createFromTiles(oneWayUpFrame3, 0, { key: 'tiles', frame: oneWayUpFrame3 }, null, null, layer)
      var sprites4 = this.map.createFromTiles(oneWayUpFrame4, 0, { key: 'tiles', frame: oneWayUpFrame4 }, null, null, layer)
      var sprites5 = this.map.createFromTiles(oneWayUpFrame5, 0, { key: 'tiles', frame: oneWayUpFrame5 }, null, null, layer) */
    sprites.push(...sprites2)

    /*   sprites.push(...sprites3)
      sprites.push(...sprites4)
      sprites.push(...sprites5) */
    for (var i = 0; i < sprites.length; i++) {

      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'up'
      oneWayBlocks.add(sprites[i])
    }
  }
  createBombBlocks(layer) {
    bombBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(bombBlockFrame, 0, { key: 'tiles', frame: bombBlockFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'bomb block'
      bombBlocks.add(sprites[i])
    }
  }
  createCollapse(layer) {
    collapsingBlocks = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(collapseFrame, 0, { key: 'tiles', frame: collapseFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'up'
      collapsingBlocks.add(sprites[i])
    }
  }
  createHPlatforms() {
    hPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(hPlatformFrame, 0, { key: 'hplatform' }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      hPlatforms.add(sprites[i])

    }

    Phaser.Actions.Call(hPlatforms.getChildren(), plat => {
      plat.setOrigin(.5, .5);
      plat.body.setFriction(1);
      plat.body.setBounce(1);
      plat.body.setVelocityX(50);
    }, this);


  }
  createQuestions(layer) {
    questions = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(questionFrame, 0, { key: 'tiles', frame: questionFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      questions.add(sprites[i])
    }
  }
  createSpikes(layer) {
    this.spikesActive = false
    this.anims.create({
      key: "layer-spike",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [0, 1, 2] }),
      frameRate: 14,
      repeat: 0
    });
    spikes = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(spikeFrame, 0, { key: 'tiles', frame: spikeFrame }, null, null, layer)
    console.log(sprites.length)
    for (var i = 0; i < sprites.length; i++) {
      console.log('add fire')
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'spike'
      spikes.add(sprites[i])
      sprites[i].body.enable = true
      sprites[i].body.setSize(16, 6).setOffset(0, 17);//15,15 24.5, 17

    }
    var spikeTime = this.time.addEvent({
      delay: 5000,                // ms
      callback: this.toggleSpike,
      callbackScope: this,
      repeat: -1
    });
    /*  Phaser.Actions.Call(fires.getChildren(), child => {
       child.anims.play('layer-spike')
     }) */
  }
  toggleSpike() {
    if (this.spikesActive) {
      this.spikesActive = false
      Phaser.Actions.Call(spikes.getChildren(), child => {
        child.setFrame(1)
        child.body.setSize(16, 6).setOffset(0, 17)
      })

    } else {
      this.spikesActive = true
      Phaser.Actions.Call(spikes.getChildren(), child => {
        child.anims.play('layer-spike')
        child.body.setSize(16, 6).setOffset(0, 10)
      })

    }
  }
  createJumpers(layer) {
    //  this.spikesActive = false
    this.anims.create({
      key: "layer-jump",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [60, 61, 62, 63, 64, 65] }),
      frameRate: 10,
      repeat: 0
    });
    jumpers = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(jumperFrame, 0, { key: 'tiles', frame: jumperFrame }, null, null, layer)
    //console.log(sprites.length)
    for (var i = 0; i < sprites.length; i++) {
      console.log('add fire')
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'jumper'
      jumpers.add(sprites[i])
      sprites[i].body.enable = true
      sprites[i].body.setSize(16, 7).setOffset(0, 9);//15,15 24.5, 17

    }
    /*  var spikeTime = this.time.addEvent({
       delay: 5000,                // ms
       callback: this.toggleSpike,
       callbackScope: this,
       repeat: -1
     }); */
    /*  Phaser.Actions.Call(fires.getChildren(), child => {
       child.anims.play('layer-spike')
     }) */
  }
  createLadders(layer) {
    ladders = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(ladderFrame, 0, { key: 'tiles', frame: ladderFrame }, null, null, layer)
    var sprites2 = this.map.createFromTiles(ladderFrame2, 0, { key: 'tiles', frame: ladderFrame2 }, null, null, layer)
    /*   var sprites3 = this.map.createFromTiles(ladderFrame3, 0, { key: 'tiles', frame: ladderFrame3 }, null, null, layer)
      var sprites4 = this.map.createFromTiles(ladderFrame4, 0, { key: 'tiles', frame: ladderFrame4 }, null, null, layer)
      var sprites5 = this.map.createFromTiles(ladderFrame5, 0, { key: 'tiles', frame: ladderFrame5 }, null, null, layer) */
    sprites.push(...sprites2)
    /* sprites.push(...sprites3)
    sprites.push(...sprites4)
    sprites.push(...sprites5) */
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'ladder'
      ladders.add(sprites[i])
      sprites[i].body.enable = true
    }
  }
  createTorches(layer) {
    this.anims.create({
      key: "layer-torch-burn",
      frames: this.anims.generateFrameNumbers('torch', { frames: [1, 2, 3] }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "layer-torch-launch",
      frames: this.anims.generateFrameNumbers('torch', { frames: [4, 4, 4, 5, 6, 7, 8, 9, 10, 11] }),
      frameRate: 8,
      repeat: 0
    });
    torches = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(torchFrame, 0, { key: 'torch', frame: 0 }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      torches.add(sprites[i])
      sprites[i].kind = 'torch'
      sprites[i].anims.play('layer-torch-burn')
    }
    torches.getChildren().forEach(function (box) {
      var launchTimes = [2000, 3000, 4000, 5000]
      var ranTime = Phaser.Math.Between(0, launchTimes.length - 1)
      box.launcher = this.time.addEvent({
        delay: Phaser.Utils.Array.GetRandom(launchTimes),                // ms
        callback: this.launchTorch,
        args: [box],
        callbackScope: this,
        repeat: -1
      });

    }, this);


  }
  launchTorch(box) {
    console.log('fire torch')
    box.anims.play('layer-torch-launch', true).once('animationcomplete', function () {
      box.anims.play('layer-torch-burn')
      for (var i = 0; i < 5; i++) {
        var bomb = torchballs.get().setActive(true);
        bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        bomb.setGravityY(800)
        bomb.x = box.x;
        bomb.y = box.y - 8;
        bomb.damage = 10
        bomb.body.velocity.y = -Phaser.Math.Between(200, 300);
        bomb.body.velocity.x = Phaser.Math.Between(-75, 75);
      }
    }, this)


  }
  createPuffs(layer) {
    this.anims.create({
      key: "layer-puff",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [66, 67, 68, 69, 70, 71, 72, 73, 74, 66] }),
      frameRate: 12,
      repeat: 0
    });
    puffPlants = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(puffPlantFrame, 0, { key: 'tiles', frame: puffPlantFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      puffPlants.add(sprites[i])
      sprites[i].kind = 'puffplant'
      sprites[i].strength = 10
    }

    puffPlants.getChildren().forEach(function (box) {
      var launchTimes = [4000, 5000, 6000, 7000]
      var ranTime = Phaser.Math.Between(0, launchTimes.length - 1)
      box.launcher = this.time.addEvent({
        delay: Phaser.Utils.Array.GetRandom(launchTimes),                // ms
        callback: this.launchPuff,
        args: [box],
        callbackScope: this,
        repeat: -1
      });

    }, this);

  }
  launchPuff(box) {
    box.anims.play('layer-puff').once('animationcomplete', function () {
      for (var i = 0; i < 3; i++) {
        var bomb = puffBall.get().setActive(true);
        bomb.setOrigin(0.5, 0.5).setScale(1).setDepth(3).setVisible(true);
        bomb.setGravityY(800)
        bomb.x = box.x;
        bomb.y = box.y - 8;
        bomb.damage = 10
        bomb.body.velocity.y = -Phaser.Math.Between(175, 255);
        bomb.body.velocity.x = Phaser.Math.Between(-60, 70);
      }
    }, this)


  }
  createLava(layer) {
    this.lavaActive = true
    /*     let lavaSpouts
    let lavaFalls
    let lavaSplashes
    let lavaPool
    let lavaSpoutFrame = 13
    let lavaFallsFrame = 28
    let lavaSplashFrame = 43
    let lavaPoolFrame = 58 */
    this.anims.create({
      key: "layer-lavaspout",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [13, 14] }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "layer-lavafall",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [28, 29] }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "layer-lavasplash",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [43, 44] }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "layer-lavapool",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [58, 59] }),
      frameRate: 8,
      repeat: -1
    });
    lavaSpouts = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaSpoutFrame, 0, { key: 'tiles', frame: lavaSpoutFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaSpouts.add(sprites[i])
      sprites[i].kind = 'lavaspout'

    }
    lavaSpouts.getChildren().forEach(function (box) {
      box.anims.play('layer-lavaspout')
    }, this);
    //////
    lavaFalls = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaFallsFrame, 0, { key: 'tiles', frame: lavaFallsFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaFalls.add(sprites[i])
      sprites[i].kind = 'lavafall'
      sprites[i].anims.play('layer-lavafall')
    }
    //////
    lavaSplashes = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaSplashFrame, 0, { key: 'tiles', frame: lavaSplashFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaSplashes.add(sprites[i])
      sprites[i].kind = 'lavasplash'
      sprites[i].anims.play('layer-lavasplash')
    }
    //////
    lavaPool = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(lavaPoolFrame, 0, { key: 'tiles', frame: lavaPoolFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      lavaPool.add(sprites[i])
      sprites[i].kind = 'lavapool'
      sprites[i].anims.play('layer-lavapool')
    }
    ////
    var lavaTime = this.time.addEvent({
      delay: 5000,                // ms
      callback: this.toggleLava,
      callbackScope: this,
      repeat: -1
    });
  }
  toggleLava() {
    if (this.lavaActive) {
      this.lavaActive = false
      Phaser.Actions.Call(lavaSpouts.getChildren(), child => {
        child.anims.stop('layer-lavaspout')
        child.setFrame(88)
      })
      Phaser.Actions.Call(lavaFalls.getChildren(), child => {
        child.anims.stop('layer-lavafall')
        child.setFrame(0)
      })
      Phaser.Actions.Call(lavaSplashes.getChildren(), child => {
        child.anims.stop('layer-lavasplash')
        child.setFrame(0)
      })

    } else {
      this.lavaActive = true
      Phaser.Actions.Call(lavaSpouts.getChildren(), child => {
        child.anims.play('layer-lavaspout')
      })
      Phaser.Actions.Call(lavaFalls.getChildren(), child => {
        child.anims.play('layer-lavafall')
      })
      Phaser.Actions.Call(lavaSplashes.getChildren(), child => {
        child.anims.play('layer-lavasplash')
      })

    }
  }
  createFires(layer) {
    this.anims.create({
      key: "layer-fire",
      frames: this.anims.generateFrameNumbers('tiles', { frames: [16, 17, 18, 19] }),
      frameRate: 8,
      repeat: -1
    });
    fires = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(fireFrame, 0, { key: 'tiles', frame: fireFrame }, null, null, layer)

    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'fire'
      fires.add(sprites[i])
      sprites[i].body.enable = true
      sprites[i].body.setSize(12, 6).setOffset(2, 10);//15,15 24.5, 17
      sprites[i].anims.play('layer-fire')
    }
  }
  createFallingBlocks(layer) {

    this.fallingIsDown = false
    fallingBlocks = this.physics.add.group({ immovable: true });
    var sprites = this.map.createFromTiles(fallingBlockFrame, 0, { key: 'tiles', frame: fallingBlockFrame }, null, null, layer)
    for (var i = 0; i < sprites.length; i++) {
      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight / 2)
      sprites[i].kind = 'fallingblocks'
      fallingBlocks.add(sprites[i])
      sprites[i].body.enable = true
      sprites[i].body.setGravityY(800)
      sprites[i].saveX = sprites[i].x
      sprites[i].saveY = sprites[i].y
      sprites[i].body.setSize(16, 12).setOffset(0, 4);//15,15 24.5, 17

    }
    var fallingTime = this.time.addEvent({
      delay: 7000,                // ms
      callback: this.toggleFalling,
      callbackScope: this,
      repeat: -1
    });
  }
  toggleFalling() {
    if (this.fallingIsDown) {
      this.fallingIsDown = false
      Phaser.Actions.Call(fallingBlocks.getChildren(), child => {
        child.body.setAllowGravity(false);
        // child.setPosition(child.saveX, child.saveY)
        var t = this.tweens.add({
          targets: child,
          x: child.saveX,
          y: child.saveY,
          duration: 500
        })
      }, this)

    } else {
      this.fallingIsDown = true
      this.fallingActive = true
      Phaser.Actions.Call(fallingBlocks.getChildren(), child => {
        child.body.setAllowGravity(true);
        child.fallingActive = true
      })

    }
  }
  createDoors(layer) {
    this.anims.create({
      key: "layer-door",
      frames: this.anims.generateFrameNumbers('door', { frames: [0, 1, 2] }),
      frameRate: 4,
      repeat: 0
    });


    doors = this.physics.add.group({ allowGravity: false, immovable: true });

    var sprites = this.map.createFromTiles(doorFrame, 0, { key: 'door', frame: 0 }, null, null, layer)

    var sprites2 = this.map.createFromTiles(doorLockedFrame, 0, { key: 'door', frame: 3 }, null, null, layer)

    if (sprites.length > 0) {
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].x += (this.map.tileWidth / 2)
        // sprites[i].y += (this.map.tileHeight / 2)
        sprites[i].kind = 'door'
        sprites[i].hit = false
        doors.add(sprites[i])

        sprites[i].body.enable = true

      }

    }
    if (sprites2.length > 0) {
      for (var i = 0; i < sprites2.length; i++) {
        sprites2[i].x += (this.map.tileWidth / 2)
        // sprites[i].y += (this.map.tileHeight / 2)
        sprites2[i].kind = 'door-locked'
        sprites2[i].hit = false
        doors.add(sprites2[i])

        sprites2[i].body.enable = true

      }

    }


  }
  createSpear(layer) {
    this.spearActive = false
    this.anims.create({
      key: "layer-spear",
      frames: this.anims.generateFrameNumbers('spear', { frames: [0, 1, 2, 3, 4, 5] }),
      frameRate: 16,
      repeat: 0
    });
    spears = this.physics.add.group({ allowGravity: false, immovable: true });
    var sprites = this.map.createFromTiles(spearFrame, 0, { key: 'spear', frame: 0 }, null, null, layer)

    for (var i = 0; i < sprites.length; i++) {

      sprites[i].x += (this.map.tileWidth / 2)
      sprites[i].y += (this.map.tileHeight * 2)
      sprites[i].kind = 'spear'
      spears.add(sprites[i])
      sprites[i].body.enable = true
      sprites[i].body.setSize(7, 10).setOffset(5, 0);//15,15 24.5, 17

    }
    var spikeTime = this.time.addEvent({
      delay: 5000,                // ms
      callback: this.toggleSpear,
      callbackScope: this,
      repeat: -1
    });
    /*  Phaser.Actions.Call(fires.getChildren(), child => {
       child.anims.play('layer-spike')
     }) */
  }
  toggleSpear() {
    if (this.spearActive) {
      this.spearActive = false
      Phaser.Actions.Call(spears.getChildren(), child => {
        child.setFrame(0)
        child.body.setSize(7, 10).setOffset(5, 0)
      })


    } else {
      this.spearActive = true

      Phaser.Actions.Call(spears.getChildren(), child => {
        child.body.setSize(7, 64).setOffset(5, 0)
        child.anims.play('layer-spear').once('animationcomplete', function () {
          child.body.setSize(7, 25).setOffset(5, 0)
        }, this)
      })


    }



  }
  ///////////////////////
  createCoins() {
    this.anims.create({
      key: "layer-coin",
      frames: this.anims.generateFrameNumbers('tiles', { start: 45, end: 50 }),
      frameRate: 6,
      repeat: -1
    });
    coins = this.physics.add.group({ immovable: true });

    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Coin') {
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var coin = coins.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'tiles', 45)//99
        coin.type = this.thinglayer[i].name
        coin.setOrigin(.5, .5);
        coin.anims.play('layer-coin')
      }
    }
  }
  createKeys() {
    this.anims.create({
      key: "layer-key",
      frames: this.anims.generateFrameNumbers('key', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 3,
      repeat: -1
    });
    keys = this.physics.add.group({ immovable: true });

    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Key') {
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
        var key = keys.create(worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 'key', 0)//99
        key.type = this.thinglayer[i].name
        key.setOrigin(.5, .5);
        key.anims.play('layer-key')
      }
    }
  }
  createPlayer() {
    //this.rooomCheck()


    var startX
    var startY

    player = new Player(this, 0, 0)

    for (var i = 0; i < this.thinglayer.length; i++) {
      if (this.thinglayer[i].name == 'Player') {
        var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)

        startX = worldXY.x + (this.map.tileWidth / 2)
        startY = worldXY.y - (this.map.tileHeight / 2)
      }
    }



    console.log(startX + ', ' + startY)

    player.x = startX
    player.y = startY

    player.play('player-idle')
    //   

  }
  ////
  createEnemies() {
    enemies = this.physics.add.group({ immovable: true });
    for (var i = 0; i < this.thinglayer.length; i++) {
      var worldXY = this.map.tileToWorldXY(this.thinglayer[i].x, this.thinglayer[i].y + 1)
      if (this.thinglayer[i].name == 'Bronze Kight') {
        var enemey0 = new BronzeKnight(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 0)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Jumper Knight') {
        var enemey1 = new JumperKnight(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight * 2), 1)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Swordsman Knight') {
        var enemey2 = new SwordsmanKight(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight * 2), 2)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Flying Crow') {
        // var enemey2 = new CrowFly(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight * 2), 3)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Sitting Crow') {
        var enemey3 = new CrowSit(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 4)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Throwing Knight') {
        var enemey3 = new ThrowingKnight(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 5)
        //console.log('make enemy 1')
      } else if (this.thinglayer[i].name == 'Turtle Knight') {
        var enemey3 = new TurtleKnight(this, worldXY.x + (this.map.tileWidth / 2), worldXY.y - (this.map.tileHeight / 2), 6)
        //console.log('make enemy 1')
      }

    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  explode(x, y) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(1).setDepth(3);
    explosion.x = x;
    explosion.y = y;
    explosion.play('effect-explode');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);

    }, this);
  }
  buildTouchSlider() {
    sliderBar = this.add.sprite(0, 0, "touch-slider");
    sliderKnob = this.add.sprite(0, 0, "touch-knob");

    touchSlider = this.add.container(100, 450);
    touchSlider.add(sliderBar);
    touchSlider.add(sliderKnob);
    touchSlider.alpha = 0;
    //touchSlider.setScrollFactor(0);
  }
  destroyGameObject(gameObject) {
    // Removes any game object from the screen
    gameObject.destroy();
  }
  addScore() {
    this.events.emit('score');
  }
  nextLevel() {
    this.events.emit('level');
  }
  restartScene() {
    this.events.emit('restart')
  }
  subShield() {
    this.events.emit('subShield')
  }
  addShield() {
    this.events.emit('addshield')
  }
  addPotion() {
    this.events.emit('addpotion')
  }
  subPotion() {
    this.events.emit('subpotion')
  }
  addMagic() {
    this.events.emit('addmagic')
  }
  subMagic() {
    this.events.emit('submagic')
  }
  addKey() {
    this.events.emit('addkey')
  }
}
