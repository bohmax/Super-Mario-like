var editorState = { 

    create: function() {
        game.stage.backgroundColor = '#3498db';

        this.disegno = game.add.group();
        this.oggetti = game.add.group();
        this.bottoni = game.add.group();

        this.disegno.add(this.drawGrid());

        this.drawObject();

        this.scroll = this.drawscrollbar(11,459,0);

        this.helper = this.drawHelp();

        this.bottoni.add(this.drawButton(10,this.griglia.starty-35,'HELP',this.help)).menu = this.helper;
        this.bottoni.add(this.drawButton(game.camera.width/2-150/2,this.griglia.starty-35,'INDIETRO',this.quit));
        this.bottoni.add(this.drawButton(game.camera.width-115,this.griglia.starty-35,'GIOCA',this.quit));

        //marcatore di disegno
        this.marker = this.drawMarker(game.add.graphics(),0,0,16,16);

        //rileva movimenti e click mouse
        game.input.addMoveCallback(this.Markerfunction, this);


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

        //terreno
        var y = terrain.height;
        var terra = game.add.sprite(10, y + 16,'tileset',5);
        var scalini = game.add.sprite(15+terra.width, terra.position.y,'tileset',6);
        var fine = game.add.sprite(10, terra.position.y+terra.height+10,'tileset',37);
        fine.addChild(game.add.sprite(32,0,'tileset',38));
        var tubo = game.add.sprite(10, fine.height+fine.position.y+10,'tileset',40);
        tubo.addChild(game.add.sprite(fine.width,0,'tileset',39));


        //speciali
        var x = special.position.x;
        var fungo = game.add.sprite(10 + x, y+5,'animazione',9);
        var vita = game.add.sprite(15 + x + fungo.width, fungo.position.y,'animazione',10);
        var money = game.add.sprite(5 + vita.position.x + vita.width, fungo.position.y,'animazione',0);
        var star = game.add.sprite(fungo.position.x+15, fungo.position.y+fungo.height+5,'animazione',15);
        var moneyx12 = game.add.sprite(star.position.x+5+star.width , fungo.position.y+fungo.height+5,'animazione',0);
        var x12 = game.add.text(moneyx12.width/2, moneyx12.height/2, 'X12', game.global.style);
        x12.fontSize = 10; x12.anchor.setTo(0.5,0.3);
        moneyx12.addChild(x12);
        var ground_money = game.add.sprite(star.position.x+5+star.width, moneyx12.position.y+star.height+5,'animazione',0);
        var block = game.add.sprite(fungo.position.x+15, moneyx12.position.y+star.height+5,'tileset',4);
        var tubo_special = game.add.sprite(block.position.x, block.position.y+block.height+5,'tileset',37);
        tubo_special.addChild(game.add.sprite(tubo_special.width,0,'tileset',38));     
        x = sfondo.position.x;
        //nuvola
        var nuvola_start = game.add.sprite(x-10, y,'tileset',32);
        nuvola_start.addChild(game.add.sprite(0,nuvola_start.height,'tileset',36));
        var nuvola_middle = game.add.sprite(nuvola_start.position.x + nuvola_start.width +5, y,'tileset',31);
        nuvola_middle.addChild(game.add.sprite(0,nuvola_middle.height,'tileset',35));
        var nuvola_end = game.add.sprite(nuvola_middle.position.x + nuvola_middle.width +5, y,'tileset',33);
        nuvola_end.addChild(game.add.sprite(0,nuvola_end.height,'tileset',34));
        //cespuglio
        var cespuglio_start = game.add.sprite(x-10, y + nuvola_start.height*2,'tileset',25);
        var cespuglio_middle = game.add.sprite(cespuglio_start.position.x+ cespuglio_start.width+5, y + nuvola_start.height*2,'tileset',23);
        var cespuglio_end = game.add.sprite(cespuglio_middle.position.x+ cespuglio_middle.width+5, y + nuvola_start.height*2,'tileset',24);
        //montagna
        var montagna_0 = game.add.sprite(x, cespuglio_start.position.y+cespuglio_start.height + 5 + 16  ,'tileset',27);
        montagna_0.addChild(game.add.sprite(0,montagna_0.height,'tileset',26));
        montagna_0.addChild(game.add.sprite(-montagna_0.width,montagna_0.height,'tileset',29));
        montagna_0.addChild(game.add.sprite(montagna_0.width,montagna_0.height,'tileset',28));
        montagna_0.scale.setTo(0.5,0.5);
        //montagna grande
        var montagna_1 = game.add.sprite(montagna_0.position.x+32+32+5, cespuglio_start.position.y+cespuglio_start.height + 5  ,'tileset',27);
        montagna_1.addChild(game.add.sprite(0,montagna_1.height,'tileset',26));
        montagna_1.addChild(game.add.sprite(-montagna_1.width,montagna_1.height,'tileset',29));
        montagna_1.addChild(game.add.sprite(montagna_1.width,montagna_1.height,'tileset',28));
        
        montagna_1.addChild(game.add.sprite(0,montagna_1.height*2,'tileset',30));
        montagna_1.addChild(game.add.sprite(-montagna_1.width*2,montagna_1.height*2,'tileset',29));
        montagna_1.addChild(game.add.sprite(-montagna_1.width,montagna_1.height*2,'tileset',26));
        montagna_1.addChild(game.add.sprite(montagna_1.width,montagna_1.height*2,'tileset',26));
        montagna_1.addChild(game.add.sprite(montagna_1.width*2,montagna_1.height*2,'tileset',28));
        montagna_1.scale.setTo(0.5,0.5);
        
        //abitanti
        x = personaggi.position.x;
        var mario = game.add.sprite(x+personaggi.width/2-32-10, y+24,'mario_animation',0);
        var goomba = game.add.sprite(10 + mario.position.x + mario.width, mario.position.y,'animazione',19);
        var tarta = game.add.sprite(goomba.position.x, mario.position.y + mario.height+5,'animazione',22);
        var queen = game.add.sprite(mario.position.x, mario.position.y + mario.height+5,'animazione',35);
        
        this.sprite  = [terra,scalini,fine,tubo,fungo,vita,money,star,moneyx12,ground_money,block,tubo_special,nuvola_start,
                       nuvola_middle,nuvola_end,cespuglio_start,cespuglio_middle,cespuglio_end,montagna_0,montagna_1,mario,goomba,tarta,queen];
        this.sprite.forEach(function(item){
            this.enableSpriteInput(item);
            item.startx = item.position.x;
            item.starty = item.position.y;
            item.startsWidth = item.width/item.scale.x;
            item.startsHeight = item.height/item.scale.y;
            item.arr = this.minmax(item.children);
            item.outposition = true; //la sprite si trova al di fuori della griglia
            item.inputEnabled = true;
            item.notResize = false; //la sprite non deve essere ridisegnata
            item.placed = false; //indica che la sprite è stata posizionata almeno una volta nella griglia
            item.duplicate = true; //serve per sapere se si tratta di una sprite da poter duplicare opure no
            item.input.enableDrag();
            item.events.onDragStart.add(this.draggstart,this);
            item.events.onDragStop.add(this.draggsend,this);
        },this);
        
        //li setto in moda tale che non siano ridimensionati
        montagna_0.notResize = true;
        montagna_1.notResize = true;
        mario.duplicate = false;
        queen.duplicate = false;
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

    drawHelp: function(){
        var grafica = game.add.graphics(0, 0);
        var rect = this.drawRectangle(grafica, 10, 10, game.camera.width-20,game.camera.height-20, 3, 0x000000, 1, 0x4c78e8, 0.5,7);
        
        text = game.add.text(rect.width / 2, rect.height / 2, "Selezionare un oggetto e trascinalo\no cliccarlo nell'\napposita quadratino,ricordantosi\nche sarà tutto inserito a partire dall'angolo più in alto a sinistra", game.global.style);
        text.anchor.set(0.5);
        text.fontSize = 13;
        grafica.bottone = grafica.addChild(this.drawButton(rect.x + (game.camera.width-20)/2-60,(game.camera.height-20-30),'INDIETRO',this.indietro));
        grafica.alpha = 0;
        grafica.bottone.input.enabled = false;
        
        grafica.addChild(rect);
        grafica.addChild(text);
        
        return grafica;
    },

    drawMarker: function(grafica,x,y,widht,height,color, alpha){
        if(color==undefined){
            color =  0xffffff;
            alpha = 1;
        }

        grafica.lineStyle(3, color, alpha);
        grafica.rect = grafica.drawRect(x, y, widht, height);
        grafica.visible = false;
        game.world.bringToTop(grafica);
        return grafica;
    },

    Markerfunction: function(pointer,xcoo,ycoo) {
        
        if(ycoo>=this.griglia.starty && ycoo<=this.griglia.endy){
            
            if(this.objdrag!=null && this.objdrag.firsttouch){
                
                this.marker.clear();
                this.drawMarker(this.marker,0,0,16,16,0xf4e842);
                if (!this.objdrag.notResize) {
                    this.drawMarker(this.marker, this.objdrag.arr[0] * 0.5, this.objdrag.arr[1] * 0.5, (this.objdrag.arr[2] - this.objdrag.arr[0] + this.objdrag.startsWidth) * 0.5, (this.objdrag.arr[3] - this.objdrag.arr[1] + this.objdrag.startsHeight)*0.5,0xffffff,0.5);
                    game.add.tween(this.objdrag.scale).to({ x: 0.5, y: 0.5},350,null,true);
                }
                else{
                    this.drawMarker(this.marker,this.objdrag.arr[0]*0.5,this.objdrag.arr[1]*0.5,((this.objdrag.arr[2]-this.objdrag.arr[0])*0.5+this.objdrag.width),((this.objdrag.arr[3]-this.objdrag.arr[1])*0.5+this.objdrag.height),0xffffff,0.5);
                }
                
                //indica che l oggetto è entrato nella tabella
                this.objdrag.outposition = false;
                this.objdrag.firsttouch = false;
            }
            
            if(this.marker.spriteOver==null){
                //differenza dall'inizio della camera
                var diff = ((this.disegno.x*-1)%16);
                var x = parseInt((xcoo+diff)/16);
                var y = parseInt(ycoo/16);

                this.marker.x = (x * 16) - diff;
                this.marker.y = y * 16;
            }
            else{
                this.marker.x = this.marker.spriteOver.position.x;
                this.marker.y = this.marker.spriteOver.position.y;
            }
            this.marker.visible = true;
            this.marker.keep = false;
        }
        else if(!this.marker.keep){
            if(this.objdrag!=null && !this.objdrag.outposition){
                if(!this.objdrag.notResize)
                    game.add.tween(this.objdrag.scale).to({ x: 1, y: 1},400,null,true);
                this.objdrag.isTweening = false;
                this.objdrag.outposition = true;
                this.objdrag.firsttouch = true;
            }
            this.marker.keep = true;
            this.marker.visible = false; 
        }
    },

    spriteOver: function(sprite){
        this.marker.clear();
        var scalax = 1;
        var scalay = 1;
        if(!sprite.outposition || sprite.notResize){
            scalax = 0.5;
            scalay = 0.5;
        }
        console.log(sprite.startsWidth);
        this.drawMarker(this.marker,sprite.arr[0]*scalax,sprite.arr[1]*scalay,(sprite.arr[2]-sprite.arr[0]+sprite.startsWidth)*scalax,(sprite.arr[3]-sprite.arr[1]+sprite.startsHeight)*scalay);
        sprite.firsttouch = true;
        this.marker.x = sprite.position.x;
        this.marker.y = sprite.position.y;
        this.marker.visible = true;
        this.marker.spriteOver = sprite;
        this.marker.keep = true;
    },

    enableSpriteInput: function(sprite){
        sprite.inputEnabled = true;
        sprite.events.onInputOver.add(this.spriteOver,this);
        sprite.events.onInputOut.add(function(edit){
            this.marker.clear();
            this.drawMarker(this.marker,0,0,16,16);
            this.marker.keep = false;
            this.marker.visible = false;
            this.marker.spriteOver = null ;
        }, this);
        return sprite;
    },

    help: function(but) {
        //disabilita input
        this.bottoni.forEach(function(item){
            item.input.enabled = false;
        });
        
        this.sprite.forEach(function(item){
            item.input.enabled = false;
        });

        game.input.deleteMoveCallback(this.Markerfunction, this);
        this.scroll.input.enabled = false;

        but.menu.alpha = 1;
        but.menu.bottone.input.enabled = true;
        but.getChildAt(1).addColor('#ffffff',0);

    },

    indietro: function(but) {
        //abilita input
        this.bottoni.forEach(function(item){
            item.input.enabled = true;
        });
        
        this.sprite.forEach(function(item){
            item.input.enabled = true;
        });

        game.input.addMoveCallback(this.Markerfunction, this);
        this.scroll.input.enabled = true;

        but.parent.alpha = 0;
        but.input.enabled = false;

    },

    quit: function(but) {
        this.disegno.destroy(true);
        this.oggetti.destroy(true);
        this.bottoni.destroy(true);
        this.marker.destroy();
        this.helper.destroy();
        game.state.start('menu');
    },
    
    draggstart: function(obj,pointer,x,y){
        this.objdrag = obj;
        this.marker.clear();
        this.drawMarker(this.marker,0,0,16,16,0xf4e842);
        if(!obj.outposition)
            this.marker.visible = true;
        game.world.bringToTop(obj);
        game.world.bringToTop(this.marker);
        obj.firsttouch = true;
        this.marker.spriteOver = null;
        this.Markerfunction(null, game.input.x,game.input.y);
    },
    
    draggsend: function(obj,pointer,x,y){
        //this.objdrag.inputEnabled = false;
        this.objdrag = null;
        //l'oggetto si trova fuori dalla gliglia
        if (obj.outposition) {
            if (obj.placed && obj.duplicate) {
                console.log(obj.duplicate)
                obj.destroy();
                this.marker.clear();
                this.drawMarker(this.marker,0,0,16,16,0xffffff);                
            }
            else {
                game.add.tween(obj.position).to({ x: obj.startx, y: obj.starty }, 200, null, true).onComplete.add(
                    function () {
                        //obj.inputEnabled = true;
                        //console.log('input x ' + game.input.x + ' input y ' + game.input.y);
                        //console.log((obj.position.x+obj.arr[0]*obj.scale.x) + ' ' + (obj.position.x+(obj.arr[2]+obj.width)*obj.scale.x));
                        //console.log((obj.position.y+obj.arr[1]*obj.scale.y) + ' ' + ((obj.position.y+(obj.arr[3])*obj.scale.y)+obj.height));
                        if (game.input.x >= (obj.position.x + obj.arr[0] * obj.scale.x) && game.input.x <= (obj.position.x + obj.arr[2] * obj.scale.x + obj.width)
                            && game.input.y >= (obj.position.y + obj.arr[1] * obj.scale.y) && game.input.y <= (obj.position.y + obj.arr[3] * obj.scale.y) + obj.height)
                            this.spriteOver(obj);

                    }, this);
            }
        } else {
            obj.position.x = this.marker.x;
            obj.position.y = this.marker.y;
            obj.placed = true;
            if(game.input.x>=(obj.position.x+obj.arr[0]*0.5) && game.input.x<=(obj.position.x+obj.arr[2]*0.5+obj.width)
                && game.input.y>=(obj.position.y+obj.arr[1]*0.5) && game.input.y<=(obj.position.y+obj.arr[3]*0.5)+obj.height)
                        this.spriteOver(obj);
            else{
                this.marker.clear();
                this.drawMarker(this.marker,0,0,16,16,0xf4e842);
            }
            if(obj.duplicate) //creo il nuovo oggetto da posizionare dopo che è stato piazzato l'elemento nella griglia
                this.duplicate(obj);
        }
        obj.firsttouch = false;
    },
        
    duplicate: function (sprite) {
        var duplicate = game.add.sprite(sprite.startx, sprite.starty, sprite.key, sprite.frame);
        sprite.children.forEach(function(item){
            duplicate.addChild(game.add.sprite(item.position.x, item.position.y,item.key,item.frame));
        });
        if (sprite.notResize)
            duplicate.scale.setTo(0.5,0.5)
        this.enableSpriteInput(duplicate);
        duplicate.startx = sprite.startx;
        duplicate.starty = sprite.starty;
        duplicate.startsWidth = sprite.startsWidth;
        duplicate.startsHeight = sprite.startsHeight;
        duplicate.arr = this.minmax(duplicate.children);
        duplicate.outposition = true;
        duplicate.inputEnabled = true;
        duplicate.notResize = sprite.notResize;
        duplicate.placed = false;
        duplicate.duplicate = sprite.duplicate;
        duplicate.input.enableDrag();
        duplicate.events.onDragStart.add(this.draggstart,this);
        duplicate.events.onDragStop.add(this.draggsend,this);
    },

    minmax(arr){
        //rappresentano rispettivamente il minimo da cui partire di x e y e la coo larghezza e coo altezza
        var coord = [0,0,0,0];
        for(var i = 0; i < arr.length;i++){
            if(arr[i].style==null){
                if(arr[i].position.x<coord[0])
                    coord[0] = arr[i].position.x;
                else if(arr[i].position.x>coord[2])
                    coord[2] = arr[i].position.x;
                if(arr[i].position.y<coord[1])
                    coord[1] = arr[i].position.y;
                else if(arr[i].position.y>coord[3])
                    coord[3] = arr[i].position.y;
            }
        }
        return coord;
    },
    
    update: function() {
        if(this.objdrag!=null){
            this.objdrag.position.x = game.input.x - this.objdrag.width / 2;
            this.objdrag.position.y = game.input.y - this.objdrag.height / 2;
            
        }
    },

};