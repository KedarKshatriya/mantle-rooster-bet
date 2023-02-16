var Phaser = Phaser || {};
var Symbals = Symbals || {};
var multiplier = 1;
$(document).ready(async function () {
  setTimeout(function () {
    if (metamaskConfig.isMetamaskConnected) {
      getMultiplier(accountAddress[0])
      console.log('multiplier: ', multiplier);
    }
  }, 1000)
});

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');

  game.state.add('BootState', new Symbals.BootState());
  game.state.add('PreloadState', new Symbals.PreloadState());
  game.state.add('MenuState', new Symbals.MenuState());
  game.state.add('StartState', new Symbals.StartState());
  game.state.add('WinState', new Symbals.WinState());
  game.state.start('BootState');
