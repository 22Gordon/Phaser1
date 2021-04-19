let gameOptions= {

    //Parde de random pixels ate um ponto altura
    randomPixelHeigth: [-32*3,96],
    //Parde de random pixels ate um ponto largura
    randomPixelWidth: [32, 96],
    //Saltos dados
    saltos: 2,
    //Força do salto
    saltoForca: -400

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

function preload ()
{
    this.load.image('background', 'assets/background/montanhas.png');
    this.load.image('platform', 'assets/Platform/platform.png');
    this.load.image('parede1', 'assets/Blocos/parede1.png');
    //this.load.image('parede2', 'assets/Blocos/parede2.png');
    this.load.image('parede3', 'assets/Blocos/parede3.png');
    //teste

    this.load.spritesheet('player', 'assets/Player/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('enemy', 'assets/Enemy/frog_left.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('point', 'assets/Objects/Pineapple.png',{
        frameWidth: 32,
        frameHeight: 32
    });
    //teste
    this.load.image("bloco", "assets/Blocos/BRICKS.png");



}

function create () {

    // Criar o background
    let bg = this.add.sprite(0, 0, 'background');
    // change origin to the top-left of the sprite
    bg.setOrigin(0,0);

    //Criar plataformas
    platforms = this.physics.add.staticGroup();

    //Criar o chão
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();


    //Criar o player
    player = this.physics.add.sprite(100,450, 'player').setImmovable(false);
    //Criar inimigo
    enemy = this.physics.add.sprite(700, 450, 'enemy');



    //Criar paredes
    var group = this.physics.add.group({
        bounceX: 0,
        bounceY: 0,
        collideWorldBounds: false
    });

    var block1 = group.create(500, 475, 'parede3').setVelocity(-80, 0).setImmovable(false);
    var block2 = group.create(400, 475, 'parede3').setVelocity(-80, 0).setImmovable(false);
    var block3 = group.create(300, 475, 'parede3').setVelocity(-80, 0).setImmovable(false);
    var block4 = group.create(200, 475, 'parede3').setVelocity(-80, 0).setImmovable(false);

    this.physics.add.collider(group, group);


    //adicionar ananases
    points = this.physics.add.group({
        key: 'point',
        repeat: 5,
        setXY: { x: 300, y: 0, stepX: 70}
    });

    points.children.iterate(function (child){

        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
    });



    //TESTE Adiciona uma parede random na posição 500/515 com x tiles da imagem ajustavel na gameoptions (1 cena do documento)
    //var parede = this.add.tileSprite(500, 515, Phaser.Math.Between(gameOptions.randomPixelWidth[0] ,gameOptions.randomPixelWidth[1]) , Phaser.Math.Between(gameOptions.randomPixelHeigth[0] ,gameOptions.randomPixelHeigth[1]) ,'parede1');

    //this.physics.add.existing(parede, true);
    //this.physics.add.collider(player, parede);






//Teste
    //parede1.setPushable(false);
    //parede2.setPushable(false);
    //parede3.setPushable(false);


    //Colisão do player com o ecrã
    player.setCollideWorldBounds(true);

    //bloco.setCollideWorldBounds(true);
    //Colisão player com as plataformas
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.collider(player, enemy);

    //Colissão do grupo de paredes com platformas e player
    this.physics.add.collider(group, platforms);
    this.physics.add.collider(group, player);

    //Colisão dos ananases com o chão
    this.physics.add.collider(points, platforms);





    //criar grupo de obstaculos
    //let obstacle = this.add.group();
    //obstacle.enableBody = true;
    //TESTE PARA CRIAR FUNÇÃO QUE CRIASSE OBJETOS E QUE NO UPDATE "RECICLASSE"
    // VER https://www.html5gamedevs.com/topic/37082-spawning-sprites-randomly-for-endless-runner/
    //spawn obstaculos
    //this.makesObstacles(4);


    //function makesObstacles (numberOfHills){
        //for(var i = 0; i < numberOfHills; i++){
            //var hill = obstacle.create(((Math.random()*500)+100),((Math.random()*250) -20), "bloco", 'parede1');
            //hill.body.immovable = true;
            //hill.scale.x += -1;
            //hill.body.gravity.y = 200;
            //hill.body.velocity.x((Math.random()*-80)-20);
            //hill.body.collideWorldBounds = true;
        //}
    //}




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

    //Animação do inimigo
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('enemy', {start:0, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    //Animações do ananás
    this.anims.create({
        key:"move",
        frames: this.anims.generateFrameNumbers("point", {start:0, end:16}),
        frameRate:15,
        repeat:-1
    });

    //Adicionar as teclas para os inputs do jogo
    cursors = this.input.keyboard.createCursorKeys();

    //Verficar a sobreposição com os ananases
    this.physics.add.overlap(player, points, collectPoints, null, this);

    //Caso acha sobreposição
    function collectPoints (player, points) {
        points.disableBody(true, true);
        // aumentar o score +1 por cada estrela apanhada
        score += 1;
        scoreText.setText('Score: ' + score);
        if (points.countActive(true) === 0) {
            nivel += 1;
            nivelText.setText('Nivel: ' + nivel);
            //iterate reativa todas as estrelas, caindo de novo do topo da tela
            points.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }

    //Tabela de pontuação
    var score = 0;
    var scoreText;

    //Tabela de nível
    var nivel = 1;
    var nivelText;


    scoreText = this.add.text(24, 24, 'score: 0', { fontSize: '48px', fill: '#0b5103' });
    nivelText = this.add.text(550, 24, 'Nivel: 1', { fontSize: '48px', fill: '#0b5103' });




    this.physics.add.collider(player, enemy, hitEnemy, null, this);

    //Caso o jogador toque nas bombas

    function hitEnemy (player, bomb){

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('idle');

        gameOver = true;
    }

}

function update () {

    //TESTE PARA RECICLAR
    //look for hills out of screen to recycle
    //obstacle.forEach(function(item){
        //if(item.x < -60){
           // item.reset(((Math.random() * 900) + 750), ((Math.random() * 250) - 20));
            //item.body.gravity.y = 200;
            //item.body.velocity.x = ((Math.random() * -200) - 100);
            //item.body.collideWorldBounds = true;
        //}
    //})

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



    //Movimento das paredes
    //parede.setVelocityX(-80);
    //parede2.setVelocityX(-80);
    //parede3.setVelocityX(-80);

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
