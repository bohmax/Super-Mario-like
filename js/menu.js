var menuState = {    
    
    create: function () {
        // This function is called after the 'preload' function 
        // Here we set up the game, display sprites, etc.
        
        game.stage.backgroundColor = '#3498db';
        
        this.labels = new Label();
        this.labels.draw();
        
        this.map = new Map('map');
        
        var bestscore = 0;
        if(game.global.bestscore<game.global.score){
           bestscore = this.labels.scoreLabel.text.substr(6, this.labels.scoreLabel.text.length);
        } else {bestscore = game.global.textbestscore;}
        
        this.sprite = game.add.sprite(game.width/2, 150, 'logo');
        var topscareLabel = game.add.text(game.width/2, game.height/2+160, 'top- ' + bestscore, game.global.style)
        var arr=[
            play = game.add.text(game.width/2, game.height/2+40, 'PLAY THE GAME', game.global.style),
            edit = game.add.text(game.width/2, game.height/2+80, 'EDIT A LEVEL', game.global.style),
            settings = game.add.text(game.width/2, game.height/2+120, 'SETTINGS', game.global.style),
        ];
        
        topscareLabel.anchor.setTo(0.5, 0.5);
        this.sprite.anchor.setTo(0.5, 0.5);
        
        arr.forEach(function(item){
            item.anchor.setTo(0.5, 0.5);
            item.inputEnabled = true;
            item.events.onInputOver.add(this.over, this);
            item.events.onInputOut.add(this.out, this);
            item.events.onInputDown.add(this.start, this);
        },this);
        
        play.level = 'loadplay';
        settings.level = 'impostazioni';
        edit.level = 'editor';
        
        
        this.supermario = new Mario(this.map);
        
        game.global.life = 3;
        game.global.score = 0;
        game.global.collectedcoin = 0;
    },
        

    
    over: function(scritta){
        game.add.tween(scritta).to({fontSize: 30}, 100).start();    
    },
    
    out: function(scritta){
        game.add.tween(scritta).to({fontSize: 15}, 100).start();
    },
    
    start: function(scritta) {
        // loading the game 
        game.state.start(scritta.level,true, false,'map');
    }
};