var loadplayState = {
    
    init: function(map) {
        this.mapname = map;
    },

    create: function() {
        game.stage.backgroundColor = '#000000';
        this.labels = new Label();
        this.labels.draw();

        var style = { font: '30px fontmario', fill: '#ffffff', align: "center" }

        var xLabel = null;
        var liveLabel = null;
        if(game.global.life > 0){
            var mario = new Mario(null);
            xLabel = game.add.text(game.width/2, game.height/2, 'x', style);
            liveLabel = game.add.text(game.width/2+100, game.height/2, game.global.life, style);
            xLabel.anchor.setTo(1, 1);
            liveLabel.anchor.setTo(1, 1);
            var worldLabel = game.add.text(game.width/2, game.height/2-100, 'world ' + '1-1', style);
            worldLabel.anchor.setTo(0.5, 0.5);
        } else {
            //sound
            this.sounds = game.add.audio('music');
            this.sounds.addMarker('game over', 0, 3.6);
            this.sounds.play('game over');

            var testo = null;
            if(game.global.life == 0){
                testo = 'game over';
            } else{
                testo = 'time up';
            }
            liveLabel = game.add.text(game.width/2, game.height/2, testo, style);
            liveLabel.anchor.setTo(0.5, 0.5);
        }

        this.i = 0;
    },

    update: function() { // No changes
        if(this.i == 120){
            this.start();
        }
        this.i++;

    },

    start: function() {
        // Start the actual game 
        if(game.global.life > 0){
            game.state.start('play', true, false, this.mapname);
        } else{
            this.finito = false;
            game.state.start('menu');
        }
    }
};