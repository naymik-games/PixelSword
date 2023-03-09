let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}

let playerData = {}
playerData.health = 5
playerData.coinCount = 0
playerData.bombCount = 0
playerData.shieldCount = 3
playerData.shieldMax = 3
playerData.lives = 3
playerData.currentWorld = 0
playerData.currentLevel = 0
playerData.worldsComplete = []
playerData.levelsComplete = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],]
let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}
let levels = [
  [
    {
      id: 0,
      map: 'level0-0',
      location: 'inside',
      backKey: 'back2'
    },
    {
      id: 1,
      map: 'level0-1',
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