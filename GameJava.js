//SetUp Canvas
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d') ;
var innerWidth= 450,
    innerHeight = 635;
    canvas.width=innerWidth;
    canvas.height = innerHeight;

//Variables
var score = 0,
    lastTime = 0;


//Key Events

var map= {
    37: false, //Left Arrow key
    39: false, //Right Arrow key
    38: false, //Top Arrow key
    40: false, //Bottom Arrow key
    32: false, //Space Arrow key
}

addEventListener('keydown', function(event) {
    
    if(event.keyCode in map) {
        map[event.keyCode] = true;

        if(map[37]) {
            player.x += -10;

        } else if(map[39]) {
            player.x += 10;

        } else if(map[38]) {
            player.y += -10;
        
        } else if(map[40]) {
            player.y += 10;
        }    

    }
}) ;

addEventListener('keyup', function(event){
    if(event.keyCode in map) {
        map[event.keyCode] =false;
    }
});
        

// Player Variable
var player = {},
        player_width = 100,
        player_height = 105,
        player_img = new Image() ;
        player_img.src = 'Bird.jpg';

//Player Object
player= {
    width: player_width,
    height: player_height,
    x : innerWidth/2 - player_width/2,
    y : innerHeight - (player_height+10),
    power: 10,
    draw: function() {
       
       if(this.x <= 0){
           this.x=0 ;
       }else if(this.x >= (innerWidth - this.width) ) {
           this.x = (innerWidth - this.width) ;
       }

       if(this.y <= 0){
           this.y=0 ;
       }else if(this.y >= (innerHeight - this.height) ) {
           this.y = (innerHeight - this.height) ;
       }
        
        c.drawImage (player_img, this.x, this.y, this.width, this.height) ;
    }
} ;

//Enemy

var enemyArray = [] ,
    enemyIndex = 0,
    enemy_width = 35,
    enemy_height = 43,
    enemy_timer = 1000,
    enemy_img = new Image();
    enemy_img.src = 'Cloud.png';

//Enemy Object

function enemy(x, y, dx, dy, enemy_img, enemy_width, enemy_height, rotation) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.img = enemy_img;
    this.width = enemy_width;
    this.height = enemy_height;
    this.rotation= rotation;
    enemyIndex++;
    enemyArray[enemyIndex] = this;
    this.id = enemyIndex;

    if(this.rotation < 0.2) {
        this.dx = -this.dx;
    }else if(this.rotation > 0.7) {
        this.dx = -this.dx;

    }else{
        this.dx = 0;
        this.dy = this.dy;
    }

    this.update = function(){
        this.y += this.dy;
        this.x += this.dx;

        if(this.x + this.width >= innerWidth){
            this.dx = -this.dx;
        }else if(this.x <= 0){
            this.dx = Math.abs (this.dx);

        }

        if(this.y > innerHeight + this.height){
            this.delete()
        }

        this.draw();
    }

    
    this.delete = function(){
        delete enemyArray[this.id] ;
    }

    this.draw = function(){
    c.drawImage(this.img, this.x, this.y, this.width, this.height) ;
    }
}

//Enemy Function
function create_enemy() {
    var x = Math.random() * (innerWidth - enemy_width) ;
    var y = -enemy_height;
    var dx = 3;
    var dy = 3;
    var rotation = Math.random() ;

    new enemy(x, y, dx, dy, enemy_img, enemy_width, enemy_height, rotation) ;

}

//Bullets Set Up
var bulletsArray = [],
    bulletIndex = 0,
    bullet_width = 10,
    bullet_height = 10,
    speed = 10,
    bullet_last_time = 0,
    bullet_timer = 400; 

// Bullet Object
function bullet (x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    bulletIndex++;
    bulletsArray[bulletIndex] = this;
    this.id = bulletIndex;

    this.update = function() {
        this.y += -this.speed;
        if( this.y < -this.height) {
            this.delete() ;

        }
    this.draw();
    }

    this.delete = function() {
        delete bulletsArray[this.id];
    };



    this.draw = function() {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height) ;
        c.fillStyle = '#fff' ;
        c.fill() ;
        c.stroke();
        }


       
    }
//Fire Bullet
function fire() {
    var x = (player.x + player.width/2) - bullet_width/2;
    var y = player.y;
    new bullet(x, y, bullet_width, bullet_height, speed);
}

//Collision

function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
//Detect Collision

function handleCollisions() {
    bulletsArray.forEach (function(bullet){
    enemyArray.forEach(function(enemy){
    if(collides(bullet, enemy)) {
        bullet.delete();
        enemy.delete();
        score += 10;
        }

    });

    });
    enemyArray.forEach(function(enemy){
    if(collides(player, enemy)) {
        player.power += -1;
        enemy.delete();
        
    }
    });

    }
//Animation
function animate(currentTime) {
    var animation= requestAnimationFrame(animate);
    c.clearRect(0,0, canvas.width, canvas.height) ;

    //Score
    c.font = '18px arial' ;
    c.fillStyle = '#fff' ;
    c.fillText('SCORE:' +score, 10,22) ;

    function drawScore() {
    c.font = "100x Arial";
    c.fillStyle = "#0095DD";
    c.fillText("Score: "+score, 8, 20);
}
    
   //Lives
   c.font = '18px arial' ;
    c.fillStyle = '#fff' ;
    c.fillText('Lives:' +player.power, 360 ,22) ;
    
    //Player
    player.draw() ;

    //Create Enemy Every Second
    if(currentTime >= lastTime + enemy_timer) {
        lastTime = currentTime;
        create_enemy() ;
    
      }
    //Update Enemy Positions 

    enemyArray.forEach(function(enemy) {
        enemy.update() ;
    });
     
    //Fire Bullets Every Seconds
     if( currentTime >= bullet_last_time + bullet_timer) {
         bullet_last_time = currentTime;
         fire();
     }
   
     //Bullet Update Position
    bulletsArray.forEach(function(bullet){
        bullet.update();
    });


//Detect Collisions
handleCollisions();

if (player.power <= 0){
    cancelAnimationFrame(animation);
    alert(' Your Score:' + score);
}
}




animate() ;



