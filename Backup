let gameOptions= {

    saltos: 2,
    //Força do salto
    saltoForca: -400,

    //x dos ananases
    xPoints: [50, 400],

    //x entre os annases
    xEntre: [70, 100]

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
let paredes;

function preload () {
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.image('parede1', 'assets/Blocos/parede1.png');
    //this.load.image('parede2', 'assets/Blocos/parede2.png');
    //this.load.image('parede3', 'assets/Blocos/parede3.png');
    //teste

    this.load.spritesheet('player', 'assets/Player/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('enemy', 'assets/Enemy/frog_left.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.image('point', 'assets/Objects/ananas_12x17.png',);
    //teste
    this.load.image("bloco", "assets/Blocos/BRICKS.png");



}

//Tabela de pontuação
var score = 0;
var scoreText;

//Tabela de nível
//var nivel = 1;
//var nivelText;


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
    let points = this.physics.add.group({
        key: 'point',
        repeat: 4,
        setXY: {x: Phaser.Math.Between(gameOptions.xPoints[0] ,gameOptions.xPoints[1]), y: 0, stepX: Phaser.Math.Between(gameOptions.xEntre[0] ,gameOptions.xEntre[1])}
    });

    points.children.iterate(function (child){
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
    });

    //Adiciona as paredes?
    let paredes = this.physics.add.group();

    function makeParedes () {
        //Remover todos os blocos do grupo
        this.paredes.removeAll();
        var alturaDaParede = game.rnd.integerInRange(2, 6);
        for (var i = 0; i < alturaDaParede; i++){
            var bloco = game.add.image(500, -i * 32, "parede1");
            this.paredes.add(bloco);
        }
        this.paredes.x = game.width - this.paredes.width
        this.paredes.y = this.platforms.y - 50;
        //LOOP
        this.paredes.forEach(function (bloco){
            //enable physics
            game.physics.enable(bloco, Phaser.Physics.ARCADE);
            //Velocidade do x para -80
            bloco.body.velocity.x = -80;
            //Alguma gravidade
            bloco.body.gravity = 4;
            //gravidade com o jogador
            block.body.bounce.set(1,1);

        });
    }

    //Criar paredes
   // var group = this.physics.add.group({
       // bounceX: 0,
        //bounceY: 0,
        //collideWorldBounds: false
    //});

    //var block1 = group.create(500, 475, 'parede3');
    //block1.setVelocity(-80, 0).setImmovable(false);
    //var block2 = group.create(400, 475, 'parede3');
    //block2.setVelocity(-80, 0).setImmovable(false);
    //var block3 = group.create(300, 475, 'parede3');
    //block3.setVelocity(-80, 0).setImmovable(false);
    //var block4 = group.create(200, 475, 'parede3');
    //block4.setVelocity(-80, 0).setImmovable(false);

    //this.physics.add.collider(group, group);



    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);
    enemy.setCollideWorldBounds(true);

    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);

    //Colissão do grupo de paredes com platformas e player
    //this.physics.add.collider(group, platforms);
    //this.physics.add.collider(group, player);

    //Colisão dos ananases com o chão e com o player
    this.physics.add.collider(points, platforms);

    //Verifica a sobreposição do player com os ananases
    this.physics.add.overlap(player, points, collectPoints, null, this);
    this.physics.add.overlap(enemy, points, losePoints, null ,this);



    //Caso haja sobreposição
    function collectPoints (player, points) {
        points.disableBody(true, true);
        // aumentar o score +1 por cada estrela apanhada
        score += 1;
        scoreText.setText('Score: ' + score);

        //Aumentar o nível quando todos os ananases são apanhados
        //if (points.countActive(true) === 0) {
            //iterate reativa todas as estrelas, caindo de novo do topo da tela
           //points.children.iterate(function (child) {
             //child.enableBody(true, child.x, 0, true, true);
            //});
        //}
    }

    //Caso haja sobreposição com o inimigo
    function losePoints (enemy, points) {
        points.disableBody(true, true);
        if(score > 0){
            score -= 1;
            scoreText.setText('Score: ' + score);
        }


    }


    scoreText = this.add.text(24, 24, 'score: 0', { fontSize: '25px', fill: '#0b5103' });
    //nivelText = this.add.text(550, 24, 'Nivel: 1', { fontSize: '25px', fill: '#0b5103' });


}

function update () {

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(gameOptions.saltoForca);
        player.anims.play('jump', true);
    }
    else if (cursors.down.isDown){
        player.setVelocityY(400);
    }

    //Movimento e animação do inimigo
    enemy.setVelocityX(-80);
    enemy.anims.play('run', true);

    //Paredes

    //this.grupoBolocos.x--;



    //Movimento das paredes

    //jump(){
        //if(this.player.body.touching.down || (this.playerSaltos > 0 &amp;&amp; this.playerSaltos < gameOptions.jumps )){
            //if(this.player.body.touching.down){
              //  this.playerSaltos = 0;
            //}
            //this.player.setVelocityY(gameOptions.jumpForce *-1);
           // this.playerSaltos++;

            //cancela a animação no salto
         //   this.player.anims.stop();
       // }
    //}


}




