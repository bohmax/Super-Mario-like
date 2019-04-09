class Mario{
    constructor(world){
        var x = null;
        var y = null;
        if(world != null){
            var position = this.position(world.map);
            var starttile = world.map.getTile(3,position);
            x= starttile.worldX;
            y = starttile.worldY;
        }
        else {
            x = game.width/2-100; 
            y = game.height/2;
        }
        this.mario = game.add.sprite(x, y, 'mario_animation', '1');
        // Set the anchor point to the top right
        this.mario.anchor.setTo(1, 1);

        //servono per evitare salti ripetuti o movimenti insoliti
        this.firstjump = true;
        this.hastouchedup = false;
        this.isBigger = false;
        this.mario.invincibile = false;
    }

    setPosition(width, height){
        this.mario.x = width;
        this.mario.y = height;
    }

    gravity(){
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1600;
    }

    animation(){
        this.mario.animations.add('walk', [1, 2, 3], 8, true);
        this.mario.animations.add('walkbig', [8, 9, 10], 8, true);
        this.mario.animations.add('walkfury', [15, 16, 17], 8, true);
        this.mario.play = false;
    }

    position(map){
        var i = map.height-1;
        while(i > 0) {
            if(map.getTile(3,i-1).index != 6){
                break;
            }
            i--;
        }
        return i;
    }

    moveleft(){
        //per capire se sono nei limiti della camera
        if(this.mario.x > game.camera.x+Math.sign(this.mario.width)*this.mario.width){
            if(this.mario.body.velocity.x > -200 && !this.hastouchedup){
                this.mario.body.velocity.x -= 10;
            }
        } 
        else { 
            this.mario.body.velocity.x = 0;
        }
        if(this.touchingdown()){
            //controllo fatto per capire se l'orientamento di marco è quello giusto
            if(this.mario.scale.x>0){
                this.mario.scale.setTo(-1, 1);
                this.mario.anchor.setTo(0, 1);
            }
            if(this.mario.body.velocity.x > 80){
                if(!this.isBigger){this.mario.body.setSize(26,32);this.mario.frame = 5;}
                else {
                    this.mario.body.setSize(30,64);
                    if(!this.isFury) this.mario.frame = 12;
                    else this.mario.frame = 19;
                }
            } else if(!this.mario.play){
                this.mario.play = true;
                if(!this.isBigger){
                    this.mario.animations.play('walk');
                    this.mario.body.setSize(26,32);
                } else {
                    this.mario.body.setSize(34,64);
                    if(!this.isFury)
                        this.mario.animations.play('walkbig');
                    else this.mario.animations.play('walkfury');
                }
            }
        } 
        else if(this.mario.play){
            this.mario.animations.stop();
            this.mario.play = false;
            if(!this.isBigger){this.mario.frame = 2;} 
            else if(!this.isFury){this.mario.frame = 9;}
            else this.mario.frame = 16;
        }
    }

    moveright(){
        if(this.mario.x > game.camera.x+Math.sign(this.mario.width)*this.mario.width){
            if(this.mario.body.velocity.x < 200 && !this.hastouchedup){
                this.mario.body.velocity.x += 10;
            }
        }
        else {
            if(this.mario.body.velocity.x < 0){
                this.mario.body.velocity.x = 0;
            }else if(this.mario.body.velocity.x != 200 && !this.hastouchedup){
                this.mario.body.velocity.x += 10;
            }
        }
        //gestisce l'animazione
        if(this.touchingdown()){
            if(this.mario.scale.x<0){
                this.mario.scale.setTo(1, 1);
                this.mario.anchor.setTo(1, 1);
            }
            if(this.mario.body.velocity.x < -80){
                if(!this.isBigger){this.mario.body.setSize(26,32);this.mario.frame = 5;}
                else{
                    this.mario.body.setSize(30,64);
                    if(!this.isFury) this.mario.frame = 12;
                    else this.mario.frame = 19;
                }
            } else if(!this.mario.play){
                this.mario.play = true;
                if(!this.isBigger){
                    this.mario.animations.play('walk');
                    this.mario.body.setSize(26,32);
                } else {
                    this.mario.body.setSize(34,64);
                    if(!this.isFury) this.mario.animations.play('walkbig');
                    else this.mario.animations.play('walkfury');
                }
            }
        } else if(this.mario.play){
            this.mario.animations.stop();
            this.mario.play = false;
            if(!this.isBigger){this.mario.frame = 2;} 
            else if(!this.isFury){ this.mario.frame = 9;}
            else this.mario.frame = 16;
        }
    }

    jump(){
        // Move the player upward (jump)
        var pos = this.Ystart - this.mario.body.position.y;
        if(!this.mario.isjumping){
            if(this.firstjump){
                if(this.touchingdown() && ! this.touchingup()){
                    this.Ystart = this.mario.body.position.y;
                    this.mario.body.velocity.y -= 450;
                    this.standjump();
                    this.firstjump = false;
                    this.hastouchedup = false;
                    //setta la dimenensione del body
                }
            } 
            else if(pos <= 112){
                if(!this.touchingup()){
                    this.mario.body.velocity.y -= 20;
                } else{
                    this.mario.body.velocity.y = 0;
                    this.mario.isjumping = true;
                }
            }
        }
        else{
            return true;
        }
        return false;
    }

    stop(){
        if(Math.abs(this.mario.body.velocity.x) < 10){this.mario.body.velocity.x=0}
        else{
            if(this.mario.body.velocity.x > 0){this.mario.body.velocity.x -= 10;} 
            else if(this.mario.body.velocity.x < 0){
                if(this.mario.x < game.camera.x+Math.sign(this.mario.width)*this.mario.width){
                    this.mario.body.velocity.x = 0;
                } 
                else {this.mario.body.velocity.x += 10;}
            }
        }
        if(this.touchingdown() && this.mario.body.velocity.x === 0 && this.mario.body.velocity.y === 0 && this.mario.frame%7!=0){
            this.mario.animations.stop(); // Stop animations
            this.mario.play = false;
            // Change frame (stand still)
            this.standstill();
        }
    }

    touchingdown(){
        return this.mario.body.blocked.down || this.mario.body.touching.down;
    }

    touchingup(){
        return this.mario.body.blocked.up || this.mario.body.touching.up;
    }

    standstill(){
        if(!this.isBigger){
            this.mario.body.setSize(26,32);
            this.mario.frame = 0;
        } else{
            if(this.mario.scale.y===1)
                this.mario.body.setSize(32,64);
            if(!this.isFury) this.mario.frame = 7;
            else  this.mario.frame = 14;
        }
    }

    standjump(){
        this.mario.animations.stop();
        this.mario.play = false;
        if(!this.isBigger){
            this.mario.frame = 4;
            this.mario.body.setSize(34,32);
        } else{
            this.mario.body.setSize(32,64);
            if(!this.isFury) this.mario.frame = 11;
            else  this.mario.frame = 18;
        }
    }

    standdead(){
        this.mario.frame = 6;
    }

    mariohalfbig(){
        this.mario.scale.x =Math.sign(this.mario.scale.x)* 0.9;
        this.mario.scale.y = 0.75;
        this.isBigger=true;
        this.standstill();
    }

    normalmario(){
        this.mario.scale.x = Math.sign(this.mario.scale.x)* 1;
        this.mario.scale.y = 1;
        this.isBigger = false;
        this.standstill();
    }

    bigmario(){
        this.mario.scale.x = Math.sign(this.mario.scale.x) * 1;
        this.mario.scale.y = 1;
        this.isBigger = true;
        this.standstill();
    }

    firstbigframe(time,stop){
        game.time.events.add(time, function () {
            this.mariohalfbig();
            game.time.events.add(time, function () {
                this.normalmario();
                game.time.events.add(time, function () {
                    this.mariohalfbig();
                    game.time.events.add(time, function () {
                        this.normalmario();
                        this.normaltobigtonormal(time,stop);
                    },this);
                },this);
            },this);
        },this);
    }

    normaltobigtonormal(time,stop){
        game.time.events.add(time, function () {
            this.mariohalfbig();
            game.time.events.add(time, function () {
                this.bigmario();
                this.bigmario();
                game.time.events.add(time, function () {
                    this.normalmario();
                    this.lastbigframe(time,stop);
                },this);
            },this);
        },this);
    }

    lastbigframe(time,stop){
        game.time.events.add(time, function () {
            this.mariohalfbig();
            game.time.events.add(time, function () {
                this.bigmario();
                game.time.events.add(time, function () {
                    stop.resumegame();
                },this);
            },this);  
        },this);
    }

    biganimation(stop){
        var time = 150;
        this.firstbigframe(time,stop);
    }

    becamesmall(time,stop,enemy){
        game.time.events.add(time, function () {
            this.mariohalfbig();
            game.time.events.add(time, function () {
                this.bigmario();
                this.bigmario();
                game.time.events.add(time, function () {
                    this.mariohalfbig();
                    game.time.events.add(time, function () {
                        this.normalmario();
                        game.time.events.add(time, function () {
                            this.isBigger = false;
                            this.isFury = false;
                            stop.resumegame();
                            if(enemy.position.x+16>this.mario.position.x && enemy.direction > 0) {enemy.direction = -1;}
                            else if(enemy.position.x<this.mario.position.x && enemy.direction < 0){enemy.direction = 1;}
                            console.log(enemy.myvelocity);
                            console.log(enemy.direction);
                            enemy.body.velocity.x = enemy.myvelocity * enemy.direction;
                        },this);
                    },this);
                },this);
            },this);
        },this);
    }

    smallanimation(stop,enemy){
        var time = 150;
        this.becamesmall(time,stop,enemy);
    }
}