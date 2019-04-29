var editorState = { 
    
    create: function() {
        game.stage.backgroundColor = '#3498db';
        
        this.disegno = game.add.group();
        this.oggetti = game.add.group();
        this.bottoni = game.add.group();
        
        this.disegno.add(this.drawGrid());
        
        this.drawObject();
        
        this.scroll = this.drawscrollbar(11,459,0);
        
        var help = this.drawHelp();
        
        this.bottoni.add(this.drawButton(10,this.griglia.starty-35,'HELP',this.help)).menu = help;
        this.bottoni.add(this.drawButton(game.camera.width/2-150/2,this.griglia.starty-35,'INDIETRO',this.quit));
        this.bottoni.add(this.drawButton(game.camera.width-115,this.griglia.starty-35,'GIOCA',this.quit));
        
        //marcatore di disegno
        this.marker = game.add.graphics();
        this.marker.lineStyle(2, 0xffffff, 1);
        this.marker.drawRect(0, 0, 16, 16);
        this.marker.visible = false; 
        
        //rileva movimenti e click mouse
        game.input.addMoveCallback(this.updateMarker, this);
        
        
    },
    
    drawGrid: function(){
        this.griglia = game.add.graphics(0,0);
        this.griglia.lineStyle(1, 0x000000, 0.5);
        
        var larghezza = 499*16;
        this.griglia.starty = 208;
        this.griglia.endy = 448;
        
        //orizzontale
        for(var i=13; i<29; i++){
            this.griglia.moveTo(0,i*16);
            this.griglia.lineTo(larghezza,i*16);
        }

        //verticale
        for(var i=1; i<500; i++){
            this.griglia.moveTo(i*16,this.griglia.endy);
            this.griglia.lineTo(i*16,this.griglia.starty);
        }
        
        return this.griglia;
    },
    
    drawObject: function(){
        var terrain = game.add.text(0, 0, 'TERRENO', game.global.style);
        var special = game.add.text(terrain.width+15, 0, 'SPECIALI', game.global.style);
        var sfondo = game.add.text(special.position.x + special.width+15, 0, 'SFONDO', game.global.style);
        var personaggi = game.add.text(sfondo.position.x + sfondo.width+15, 0, 'ABITANTI', game.global.style);
        
        var y = terrain.height-4;
        var terra = game.add.sprite(0, y,'tileset',4);
        //var 
        //terra.scale.setTo(0.5,0.5);
        
    },
    
    drawButton: function(x,y,text,fun){
        var grafica = game.add.graphics(0, 0);
        var widht;
        if(text.length*15>80) widht = text.length*15+30;
        else widht = 100;
        var rect = this.drawRectangle(grafica, x, y, widht ,30, 1, 0x000000, 1, 0xa83fff, 1,7);
        grafica.addChild(rect);
        buttonText = game.add.text(x + rect.width / 2, y + rect.height / 2, text, game.global.style);
        buttonText.smoothed = true;
        buttonText.anchor.setTo(0.5,0.4);
        grafica.addChild(buttonText);
        grafica.inputEnabled = true;
        grafica.events.onInputOver.add(function(edit){edit.getChildAt(1).addColor('#ffff00', 0);}, this);
        grafica.events.onInputOut.add(function(edit){edit.getChildAt(1).addColor('#ffffff', 0);}, this);
        grafica.events.onInputOut.add(function(edit){edit.getChildAt(1).addColor('#ffffff', 0);}, this);
        if(fun!=undefined)
            grafica.events.onInputDown.add(fun, this);
        
        return grafica;
    },
    
    drawscrollbar: function(posx,posy,percentuale){
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
            x = (this.griglia.width-game.world.width)*x/460; //costante per la quale riesco a raggiungere i 480
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
    
    drawHelp(){
        var grafica = game.add.graphics(0, 0);
        var rect = this.drawRectangle(grafica, 10, 10, game.camera.width-20,game.camera.height-20, 3, 0x000000, 1, 0x4c78e8, 0.5,7);
        grafica.addChild(rect);
        grafica.bottone = grafica.addChild(this.drawButton(rect.x + (game.camera.width-20)/2-60,(game.camera.height-20-30),'INDIETRO',this.indietro));
        grafica.alpha = 0;
        grafica.bottone.input.enabled = false;
        return grafica;
    },
    
    updateMarker: function() {
        //differenza dall'inizio della camera
        var diff = ((this.disegno.x*-1)%16);
        var x = parseInt((game.input.mousePointer.x+diff)/16);
        var y = parseInt(game.input.mousePointer.y/16);
    
        if(y>=13 && y<=27){
            
            this.marker.x = (x * 16) - diff;
            this.marker.y = y * 16;
            if(!this.marker.visible){
                this.marker.visible = true; 
            }
        }
        else{
            this.marker.visible = false; 
        }
        //console.log('numero quadrato' + (parseInt((this.disegno.x*-1)/16+parseInt((game.input.mousePointer.x)/16))));
    },
    
    help: function(but) {
        //disabilita input
        this.bottoni.forEach(function(item){
            item.input.enabled = false;
        });
        
        game.input.deleteMoveCallback(this.updateMarker, this);
        this.scroll.input.enabled = false;
        
        but.menu.alpha = 1;
        but.menu.bottone.input.enabled = true;
        but.getChildAt(1).addColor('#ffffff');
        
    },
    
    indietro: function(but) {
        //abilita input
        this.bottoni.forEach(function(item){
            item.input.enabled = true;
        });
        
        game.input.addMoveCallback(this.updateMarker, this);
        this.scroll.input.enabled = true;
        
        but.parent.alpha = 0;
        but.input.enabled = false;
        
    },
    
    quit: function(but) {
        this.disegno.destroy(true);
        this.oggetti.destroy(true);
        this.bottoni.destroy(true);
        game.state.start('menu');
    },

};