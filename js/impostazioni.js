var impostazioniState = {   

    create: function () {
        game.stage.backgroundColor = '#3498db';
        this.map = new Map('map');
        this.supermario = new Mario(this.map);
        
        if(game.global.rip_musica) this.volumemusica = 0;
        else this.volumemusica = game.global.music;
        this.volumesuono = game.global.sound;
        
        this.arr=[
            play = game.add.text(game.width/2, game.height/2-80, 'MUSIC ON OFF', game.global.style),
            sound = game.add.text(game.width/2, game.height/2-40, 'SOUNDS ON OFF', game.global.style),
        ];
        
        var barmusic = game.add.text(game.width/2 - 100, game.height/2, 'MUSIC VOLUME', game.global.style);
        var barsound = game.add.text(game.width/2 - 107.5, game.height/2+40, 'SOUNDS VOLUME', game.global.style);
        
        var indietro = game.add.text(game.width/2, game.height/2+80, 'BACK', game.global.style);
        indietro.inputEnabled = true;
        indietro.events.onInputOver.add(this.over, this);
        indietro.events.onInputOut.add(this.out, this);
        indietro.events.onInputDown.add(this.start, this);
        
        this.scrollbar(barmusic,game.global.music*2*100,true);
        this.scrollbar(barsound,game.global.sound*100,false);
        
        indietro.anchor.setTo(0.5, 0.5);
        barmusic.anchor.setTo(0.5, 0.5);
        barsound.anchor.setTo(0.5, 0.5);
        
        this.arr.forEach(function(item){
            item.anchor.setTo(0.5, 0.5);
            item.inputEnabled = true;
            item.events.onInputDown.add(this.click, this);
        },this);
        
        if(game.global.rip_musica)this.colora(0,play);
        else this.colora(1,play);
        if(game.global.rip_sound)this.colora(0,sound);
        else this.colora(1,sound);
        
        //sound
        this.sounds = game.add.audio('music');
        this.musica = game.add.audio('music');
        // Tell Phaser that it contains multiple sounds
        this.sounds.allowMultiple = true;

        this.sounds.addMarker('jump', 16.130, 0.555);

        this.musica.addMarker('musica', 16.682, 28.739);
        this.musica.play('musica',0,this.volumemusica,true);
        
    },


    colora(value, label){
        if(value==0){
            label.addColor("rgba(255,255,255,0.5)",6);
            label.addColor("rgba(255,255,255,1)",9);
        } else{
            label.addColor("rgba(255,255,255,1)",6);
            label.addColor("rgba(255,255,255,0.5)",9);
        }
    },
    
    drawCircle: function (graphics, x, y, diameter, bSize, bColor, bAlpha, fColor, fAlpha) {
        var circle = game.add.graphics(0, 0);
        circle.lineStyle(bSize, bColor, bAlpha);
        circle.beginFill(fColor, fAlpha);
        circle.drawCircle(x, y, diameter);
        circle.endFill();

        graphics.addChild(circle);

        return circle;
    },
    
    drawRectangle: function (graphics, x, y, width,height, bSize, bColor, bAlpha, fColor, fAlpha,round) {
        var rect = game.add.graphics(0, 0);
        rect.lineStyle(bSize, bColor, bAlpha);
        rect.beginFill(fColor, fAlpha);
        rect.drawRoundedRect(x, y, width,height,round);
        rect.endFill();
        
        return rect;
    },
    
    scrollbar: function(text,percentuale,choose){
        var minRangeHandle = game.add.graphics(0, 0);
        var rect = this.drawRectangle(minRangeHandle, text.width/2+20, -(text.height/2+3), 100,20, 0.5, 0x000000, 0.5, 0x4c78e8, 1,7);
        var circle = this.drawCircle(minRangeHandle, text.width/2+20+percentuale, -(text.height/2+3)+10, 20, 0.5, 0x000000, 0.5, 0xffffff, 1);
        circle.rectangle = null;
        
        text.addChild(rect);
        if(percentuale>=10){
            circle.rectangle = this.drawRectangle(minRangeHandle, text.width/2+20, -(text.height/2+3), percentuale,20, 0.5, 0x000000, 0.5, 0xfc965f, 1,7);
            text.addChild(circle.rectangle);
        }
        text.addChild(minRangeHandle);
        
        var perc = game.add.text(text.width/2+170, 0, Math.round(percentuale), game.global.style);
        perc.anchor.setTo(0.5, 0.5);
        rect.addChild(perc);
        
        minRangeHandle.inputEnabled = true;
        minRangeHandle.input.useHandCursor = true;
        minRangeHandle.input.enableDrag();
        minRangeHandle.input.allowVerticalDrag = false;
        minRangeHandle.input.boundsRect = new Phaser.Rectangle(-percentuale,0, 100, 1);
        minRangeHandle.events.onDragUpdate.add(function(obj,pointer,x){
            x = percentuale+x;
            if (x>100) x =100;
            else if(x<0) x = 0;
            if(x>=10){
                if(circle.rectangle!=null){circle.rectangle.destroy(); circle.rectangle=null;}
                circle.rectangle = this.drawRectangle(minRangeHandle, text.width/2+20, -(text.height/2+3), x,20, 0.5, 0x000000, 0.5, 0xfc965f, 1,7);
                text.removeChild(minRangeHandle);
                text.addChild(circle.rectangle);
                text.addChild(minRangeHandle);
            } 
            else if(x<10){
                if(circle.rectangle!=null){circle.rectangle.destroy(); circle.rectangle=null;}
            }
            if(choose) {
                game.global.music = x/2/100;  
                this.volumemusica = game.global.music;
                if(!game.global.rip_musica)this.musica.volume = game.global.music;
            }
            else {
                game.global.sound = x/100; 
                this.volumesuono = game.global.sound;
            }
            perc.text = Math.round(x);
        }, this);
        
        minRangeHandle.events.onDragStop.add(function(obj,pointer){
            if(!choose) {            
                if(!game.global.rip_sound){
                    this.sounds.stop(); 
                    this.sounds.play('jump',0,game.global.sound);
                }   
            }
        }, this);
        
        return minRangeHandle;
    },
    
    click: function(scritta,pointer) {
        // loading the game
        var value;
        //off
        if(pointer.position.x > scritta.x-(scritta.width/2)+(15*9)){
            value = 0;
            if(this.arr[0]==scritta){
                game.global.rip_musica = true;
                this.musica.volume = value;
            } else{
                game.global.rip_sound = true;
            }
        }
        //on
        else if(pointer.position.x > scritta.x-(scritta.width/2)+(15*6)){
            if(this.arr[0]==scritta){
                value = this.volumemusica;
                game.global.music = value;
                game.global.rip_musica = false;
                this.musica.volume = value;
            } else{
                value = this.volumesuono;
                game.global.sound = value;
                if(game.global.rip_sound){
                    game.global.rip_sound = false;
                    this.sounds.stop(); 
                    this.sounds.play('jump',0,game.global.sound);
                }
            }
        }
        this.colora(value,scritta);
    },
    
    over: function(scritta){
        game.add.tween(scritta).to({fontSize: 30}, 100).start();    
    },
    
    out: function(scritta){
        game.add.tween(scritta).to({fontSize: 15}, 100).start();
    },
    
    start: function(scritta) {
        // loading the game
        this.musica.stop();
        this.musica.destroy();
        this.sounds.stop();
        this.sounds.destroy();
        game.state.start('menu');
    }

};