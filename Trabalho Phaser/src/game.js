let gameOptions= {
    saltos: 2,
    //Força do salto
    saltoForca: -400,

    //x dos ananases
    xPoints: [50, 400],

    //x entre os annases
    xEntre: [70, 100],

    //vidas do jogor
    vidas: 3,

    //velocidade do inimigo
    enemyVelocity: -80
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player;
let background;
let platform;
let enemy;
let point;

function preload () {
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.image('parede1', 'assets/Blocos/parede1.png');
    this.load.image('Ball', 'assets/Objects/Spiked Ball.png');
    this.load.image('wall', 'assets/Blocos/parede3.png');
    this.load.spritesheet('player', 'assets/Player/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('enemy', 'assets/Enemy/frog_left.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.image('point', 'assets/Objects/ananas_12x17.png',);
}

//Tabela de pontuação
var score = 0;
var scoreText;

//Tabela de nível
var nivel = 1;
var nivelText;

//Vidas
var vidas = gameOptions.vidas;
var vidasText;

//Bombas
var bombas = 0;


function create () {

    // Criar o background
    let bg = this.add.sprite(0, 0, 'background');
    // change origin to the top-left of the sprite
    bg.setOrigin(0,0);

    //Criar plataformas
    platforms = this.physics.add.staticGroup();


    //Criar o chão
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();

    //Criar inimigo
    enemy = this.physics.add.sprite(700, 450, 'enemy');

    //Criar o player
    player = this.physics.add.sprite(100,450, 'player').setImmovable(false);

    //Gravidade a que o player cai
    player.body.setGravityY(300);

    //Animações do player
    this.anims.create ({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start:23, end: 34 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start:11, end: 22 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start:0, end: 10 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create ({
        key: 'jump',
        frames: [{key: 'player', frame:35}],
        frameRate: 10,
        repeat: -1
    })

    //Adicionar as teclas para os inputs do jogo
    cursors = this.input.keyboard.createCursorKeys();

    //Animação do inimigo
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('enemy', {start:0, end: 11}),
        frameRate: 10,
        repeat: -1
    });


    //adicionar ananases
    points = this.physics.add.group({
        key: 'point',
        repeat: 4,
        setXY: {x: Phaser.Math.Between(gameOptions.xPoints[0] ,gameOptions.xPoints[1]), y: 0, stepX: Phaser.Math.Between(gameOptions.xEntre[0] ,gameOptions.xEntre[1])}
    });

    points.children.iterate(function (child){
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
    });

    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);
    enemy.setCollideWorldBounds(true);

    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);

    //Colisão dos ananases com o chão e com o player
    this.physics.add.collider(points, platforms);

    //Verifica a sobreposição do player com os ananases
    this.physics.add.overlap(player, points, collectPoints, null, this);
    this.physics.add.overlap(enemy, points, losePoints, null ,this);

    balls = this.physics.add.group();
    this.physics.add.collider(balls, platforms);

    scoreText = this.add.text(24, 24, 'Score: 0', { fontSize: '25px', fill: '#0b5103' });
    nivelText = this.add.text(550, 24, 'Nivel: 1', { fontSize: '25px', fill: '#0b5103' });
    vidasText = this.add.text(24, 64, 'Vidas: 3', { fontSize: '25px', fill: '#ef0606' });

    this.physics.add.collider(player,balls, hitBalls, null, this);

    walls = this.physics.add.group();
    this.physics.add.collider(walls, platforms);
    this.physics.add.collider(player, walls, hitWalls, null, this)
    timedEvent = this.time.addEvent({ delay: 5000, callback: onEvent, callbackScope: this, loop: true });
}

//Caso haja sobreposição
function collectPoints (player, point) {
    point.disableBody(true, true);
    // aumentar o score +1 por cada estrela apanhada
    score += 1;
    scoreText.setText('Score: ' + score);
    if (points.countActive(true) === 0){
        nivel += 1;
        nivelText.setText('Nivel: ' + nivel);
        //iterate reativa todas os ananases, caindo de novo do topo da tela
        points.children.iterate(function (child){
            child.enableBody(true, child.x, 0, true, true);
        });
        if (nivel % 5 === 0){
            // Escolher uma coordenada x aleatória, do lado oposto ao player
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            //Criar a bomba
            bombas += 1;
            var ball = balls.create(x, 16, 'Ball');
            ball.setBounce(1);
            ball.setCollideWorldBounds(true);
            ball.setVelocity(Phaser.Math.Between(-200,200), 20);
        }
    }
}

//Caso haja sobreposição com o inimigo
function losePoints (enemy, points) {
    points.disableBody(true, true);
    if (score > 0){
        score -= 1;
        scoreText.setText('Score: ' + score);
    }
}

function hitBalls (player, ball){

    if(vidas !== 0) {
        vidas -= 1;
        vidasText.setText('Vidas: ' + vidas);
    }
    else{
        this.physics.pause();
        player.setTint(0xff0000);
    }

}

function hitWalls (player, wall)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

function update () {

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(gameOptions.saltoForca);
        player.anims.play('jump', true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(400);
    }

    //Movimento e animação do inimigo
    enemy.setVelocityX(gameOptions.enemyVelocity);
    enemy.anims.play('run', true);


    //TENTATIVA DE MUDAR DE LUGAR
    if (enemy.x <= 100 && enemy.enemyVelocity < 0) {
        enemy.enemyVelocity *= -1;
        enemy.flipX = true;
    } else if (enemy.x >= 700 && enemy.enemyVelocity > 0) {
        enemy.enemyVelocity *= -1;
        enemy.flipX = true;
    }
}

function onEvent(){
    var wall = walls.create(800, 463, 'wall');
    wall.setCollideWorldBounds(false);
    wall.setVelocity(-80, 0);
}




