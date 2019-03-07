// Initialize Phaser
var game = new Phaser.Game(500, 470, Phaser.AUTO, 'gameDiv');

// Define our global variable
game.global = {
    score: 0,
    collectedcoin: 0,
    life: 3,
    style: null,
};

// And we tell Phaser to add and start our 'main' state
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('loadplay', loadplayState);
game.state.add('play', playState);


game.state.start('load');