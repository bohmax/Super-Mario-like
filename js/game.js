// Initialize Phaser
var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gameDiv');

// Define our global variable
game.global = {
    bestscore: 0,
    textbestscore: '000000',
    score: 0,
    collectedcoin: 0,
    life: 3,
    style: null,
    sound: 1,
    music: 0.5,
    rip_musica: false,
    rip_sound: false
};

// And we tell Phaser to add and start our 'main' state
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('impostazioni', impostazioniState);
game.state.add('editor', editorState);
game.state.add('loadplay', loadplayState);
game.state.add('play', playState);


game.state.start('load');