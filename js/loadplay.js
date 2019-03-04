var loadplayState = {
    
    create: function() {
        
        game.global.score = 0;
        
        game.stage.backgroundColor = '#000000';
        this.labels = new Label();
        this.labels.draw();
        
        var style = { font: '30px fontmario', fill: '#ffffff', align: "center" }
        
        var xLabel = game.add.text(game.width/2, game.height/2, 'x', style);
        var liveLabel = game.add.text(game.width/2+100, game.height/2, '3', style);
        var worldLabel = game.add.text(game.width/2, game.height/2-100, 'world ' + '1-1', style);
        
        worldLabel.anchor.setTo(0.5, 0.5);
        xLabel.anchor.setTo(1, 1);
        liveLabel.anchor.setTo(1, 1);
        
        var mario = new Mario(null);
        
        this.i = 0;
    },
    
    update: function() { // No changes
        if(this.i == 180){
            this.start();
        }
        this.i++;
        
    },
    
    start: function() {
        // Start the actual game 
        game.state.start('play');
    }
};