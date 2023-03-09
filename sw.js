var cacheName = 'Electrical v1.00';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',

  '/scenes/UI.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',
  // '/assets/fonts/mago1.tff',
  // '/assets/fonts/mago3.tff',


  '/classes/settings.js',
  '/classes/enimies.js',
  '/classes/player.js',


  'assets/enemies/crow.png',
  'assets/enemies/enemybullets.png',
  'assets/enemies/knight.png',
  'assets/enemies/Knight_F.png',
  'assets/enemies/Knight_G.png',
  'assets/enemies/Knight_H.png',
  'assets/enemies/Knight_T.png',
  'assets/enemies/shell.png',
  'assets/enemies/swordsman.png',


  '/assets/particle.png',
  '/assets/particles.png',

  '/assets/bigshield.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/bomb.png',
  '/assets/sprites/bomb-explosion.png',
  '/assets/sprites/door.png',
  '/assets/sprites/explosion.png',
  '/assets/sprites/hplatform.png',
  '/assets/sprites/insidebck1.png',
  '/assets/sprites/outsideback1.png',
  '/assets/sprites/player_icon.png',
  '/assets/sprites/player2.png',
  '/assets/sprites/spear.png',
  '/assets/sprites/tiles.png',
  '/assets/sprites/torchburn.png',
  '/assets/sprites/touch-knob.png',
  '/assets/sprites/touch-slider.png',

  '/assets/maps/level0-0.png',
  '/assets/maps/level0-1.png',
  '/assets/maps/level0-2.png',

  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});