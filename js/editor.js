var editorState = { 
    
    create: function() {
        game.stage.backgroundColor = '#3498db';
        
        this.disegno = game.add.group();
        this.oggetti = game.add.group();
        
        this.disegno.add(this.drawGrid());
        
        this.drawObject();
        
        
        
        
        this.scrollbar(11,459,0);
        
        //marcatore di disegno
        this.marker = game.add.graphics();
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 16, 16);
        
        //rileva movimenti e click mouse
        game.input.addMoveCallback(this.updateMarker, this);
        
        
    },
    
    drawGrid: function(){
        this.griglia = game.add.graphics(0,0);
        this.griglia.lineStyle(1, 0x000000, 0.5);
        
        game.world.width = game.world.width*2;
        
        //orizzontale
        for(var i=13; i<29; i++){
            this.griglia.moveTo(0,i*16);
            this.griglia.lineTo(game.world.width,i*16);
        }

        //verticale
        for(var i=1; i<60; i++){
            this.griglia.moveTo(i*16,448);
            this.griglia.lineTo(i*16,208);
        }
        
        return this.griglia;
    },
    
    drawObject: function(){
        var terrain = game.add.text(0, 0, 'TERRENO', game.global.style);
        var special = game.add.text(terrain.width+15, 0, 'SPECIALI', game.global.style);
        var sfondo = game.add.text(special.position.x + special.width+15, 0, 'SFONDO', game.global.style);
        var personaggi = game.add.text(sfondo.position.x + sfondo.width+15, 0, 'ABITANTI', game.global.style);
        
        var terra = game.add.sprite(0, terrain.height-4,'tileset',4);
        terra.scale.setTo(0.5,0.5);
        
    },
    
    scrollbar: function(posx,posy,percentuale){
        var minRangeHandle = game.add.graphics(0, 0);
        var rect = this.drawRectangle(minRangeHandle, posx, posy, 460,20, 0.5, 0x000000, 0.5, 0x4c78e8, 1,7);
        var circle = this.drawCircle(minRangeHandle, posx, posy+10, 20, 0.5, 0x000000, 0.5, 0xffffff, 1);
        
        game.world.bringToTop(minRangeHandle);
        
        minRangeHandle.inputEnabled = true;
        minRangeHandle.input.useHandCursor = true;
        minRangeHandle.input.enableDrag();
        minRangeHandle.input.allowVerticalDrag = false;
        minRangeHandle.input.boundsRect = new Phaser.Rectangle(game.camera.x,0, 460, 1);
        minRangeHandle.events.onDragUpdate.add(function(obj,pointer,x){
            if (x>460) x = 460;
            else if(x<0) x = 0;
            x += x/23; //costante per la quale riesco a raggiungere i 480
            this.disegno.x = -x;
        }, this);
        
        return minRangeHandle;
    },
    
    drawRectangle: function (graphics, x, y, width,height, bSize, bColor, bAlpha, fColor, fAlpha,round) {
        var rect = game.add.graphics(0, 0);
        rect.lineStyle(bSize, bColor, bAlpha);
        rect.beginFill(fColor, fAlpha);
        rect.drawRoundedRect(x, y, width,height,round);
        rect.endFill();
        
        return rect;
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
    
    updateMarker: function() {
        
        var x = parseInt(game.input.mousePointer.x/16);
        var y = parseInt(game.input.mousePointer.y/16);
        
        console.log(y);
        
            this.marker.x = x * 16;
            this.marker.y = y * 16;
            if(!this.marker.visible){
                this.marker.visible = true; 
            }
    },
    
    quit: function() {
        this.disegno.destroy();
        this.oggetti.destroy();
    },

};