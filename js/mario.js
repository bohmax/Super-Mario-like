class Mario{
    constructor(world){
        if(world != null){
            this.groupmario = game.add.group();
            world.map.createFromObjects('endgame', 44, 'mario_animation', '1', true, false,this.groupmario);
            this.mario = this.groupmario.getFirstAlive();
            // Set the anchor point to the top right

            //servono per evitare salti ripetuti o movimenti insoliti
            this.firstjump = true;
            this.hastouchedup = false;
            this.isBigger = false;
            this.isFury = false;
            this.mario.invincibile = false;
            this.shot = true;

            game.world.add(this.mario);
            this.mario.position.y += 32;
            this.mario.position.x += 32;
            
            this.groupmario.destroy(false,false);
        } else {
            var x = game.width/2-100; 
            var y = game.height/2;
            this.mario = game.add.sprite(x, y, 'mario_animation', '1');
        }
        this.mario.anchor.setTo(1, 1);
    }

    setPosition(width, height){
        this.mario.x = width;
        this.mario.y = height;
    }

    gravity(){
        game.physics.arcade.enable(this.mario);
        this.mario.body.gravity.y = 1600;
        this.mario.body.setSize(26,32,0,0);
    }

    animation(){
        this.mario.animations.add('walk', [1, 2, 3], 8, true);
        this.mario.animations.add('walkbig', [8, 9, 10], 8, true);
        this.mario.animations.add('walkfury', [15, 16, 17], 8, true);
        this.mario.animations.add('spara', [14,20,14], 16, false);
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
            this.fermo = false;
            //controllo fatto per capire se l'orientamento di mario è quello giusto
            if(this.mario.scale.x>0){
                this.mario.scale.setTo(-1, 1);
                this.mario.anchor.setTo(0, 1);
            }
            if(this.mario.body.velocity.x > 80){
                if(!this.isBigger){this.mario.body.setSize(26,32,0,0);this.mario.frame = 5;}
                else {
                    this.mario.body.setSize(30,64,0,0);
                    if(!this.isFury) this.mario.frame = 12;
                    else this.mario.frame = 19;
                }
            } else if(!this.mario.play){
                this.mario.play = true;
                if(!this.isBigger){
                    this.mario.animations.play('walk');
                    this.mario.body.setSize(26,32,0,0);
                } else {
                    this.mario.body.setSize(34,64,0,0);
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
            this.fermo = false;
            if(this.mario.scale.x<0){
                this.mario.scale.setTo(1, 1);
                this.mario.anchor.setTo(1, 1);
            }
            if(this.mario.body.velocity.x < -80){
                if(!this.isBigger){this.mario.body.setSize(26,32,0,0);this.mario.frame = 5;}
                else{
                    this.mario.body.setSize(30,64,0,0);
                    if(!this.isFury) this.mario.frame = 12;
                    else this.mario.frame = 19;
                }
            } else if(!this.mario.play){
                this.mario.play = true;
                if(!this.isBigger){
                    this.mario.animations.play('walk');
                    this.mario.body.setSize(26,32,0,0);
                } else {
                    this.mario.body.setSize(34,64,0,0);
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

    jump(amb){
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
                    amb.sounds.play('jump');
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
        if(this.touchingdown()){
            if(this.mario.body.velocity.x === 0 && this.mario.body.velocity.y === 0 && !this.fermo && !this.mario.time){
                this.mario.animations.stop(); // Stop animations
                this.mario.play = false;
                // Change frame (stand still)
                this.standstill();
            }
        } else if(this.mario.play){
            this.mario.animations.stop();
            this.mario.play = false;
            if(!this.isBigger){this.mario.frame = 2;} 
            else if(!this.isFury){ this.mario.frame = 9;}
            else this.mario.frame = 16;
        }
    }

    touchingdown(){
        return this.mario.body.blocked.down || this.mario.body.touching.down;
    }

    touchingup(){
        return this.mario.body.blocked.up || this.mario.body.touching.up;
    }

    standstill(){
        this.fermo = true;
        if(!this.isBigger){
            this.mario.body.setSize(26,32,0,0);
            this.mario.frame = 0;
        } else{
            this.mario.body.setSize(32,64,0,0);
            if(!this.isFury) this.mario.frame = 7;
            else this.mario.frame = 14;
        }
    }

    standjump(){
        this.fermo = false;
        this.mario.animations.stop();
        this.mario.play = false;
        if(!this.isBigger){
            this.mario.frame = 4;
            this.mario.body.setSize(30,32,-4,0);
        } else{
            this.mario.body.setSize(32,64,0,0);
            if(!this.isFury) this.mario.frame = 11;
            else  this.mario.frame = 18;
        }
    }

    standdead(){
        this.mario.frame = 6;
    }

    spara(amb){
        if(this.isFury && this.shot){
            if(this.mario.frame === 14){
                this.mario.time = true;
                this.mario.animations.play('spara');
                game.time.events.add(150, function () {
                    this.mario.time = false;
                },this);
            }

            amb.sounds.play('fireball')

            this.shot = false;
            game.time.events.add(500, function () {
                this.shot = true;
            },this);
            var direction = 1;
            var ball = null;
            if(this.mario.scale.x === -1){
                ball = amb.createobject(this.mario.position.x-24,this.mario.position.y-this.mario.height+32,7,'27');
                direction = -1;
            } else ball = amb.createobject(this.mario.position.x-8,this.mario.position.y-this.mario.height+32,7,'27');
            if(!ball.isFuoco){
                ball.isFuoco = true;
                ball.myvelocity = 400;
                ball.animations.add('spara', [27, 28, 29,30], 8, true);
                var anim = ball.animations.add('esplodi', [31,32,33], 24, false);
                anim.onComplete.add(function() {
                    ball.kill();
                    amb.ricicla.add(ball);
                }, ball,amb);
                game.physics.arcade.enable(ball);
                ball.body.bounce.setTo(1,1);
                ball.body.setSize(16,16,0,0);
                ball.anchor.setTo(0, 1);
            }
            ball.scale.setTo(direction, 1);
            ball.body.gravity.y = 1500;
            amb.fireball.add(ball);
            ball.body.velocity.x = ball.myvelocity * direction;
            ball.animations.play('spara');
        }
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
                    if(!this.touchingdown()){
                        this.fermo = false;
                        this.mario.body.setSize(32,64,0,0);
                        this.mario.frame = 13;
                    }
                    stop.resumegame();
                },this);
            },this);  
        },this);
    }

    biganimation(stop){
        var time = 100;
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
                            this.mario.body.setSize(26,32,0,0);
                            stop.resumegame();
                            if(enemy.position.x+16>this.mario.position.x && enemy.direction > 0) {enemy.direction = -1;}
                            else if(enemy.position.x<this.mario.position.x && enemy.direction < 0){enemy.direction = 1;}
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