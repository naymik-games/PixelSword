let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}
let currentWorld = 0
let currentLevel = 0

let playerData
let playerDataDefault = {}
playerDataDefault.health = 5
playerDataDefault.coinCount = 0
playerDataDefault.bombCount = 0
playerDataDefault.hasMagic = false
playerDataDefault.shieldCount = 3
playerDataDefault.shieldMax = 3
playerDataDefault.lives = 3
playerDataDefault.currentWorld = 0
playerDataDefault.currentLevel = 0
playerDataDefault.worldsComplete = []
playerDataDefault.levelsComplete = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],]
let gameSettings;

let levels = [
  [
    {
      id: 0,
      map: 'level0-1',
      location: 'outside',
      backKey: 'back1'
    },
    {
      id: 1,
      map: 'level0-0',
      location: 'inside',
      backKey: 'back2'
    },
    {
      id: 2,
      map: 'level0-2',
      location: 'inside',
      backKey: 'back2'
    }
  ]
]