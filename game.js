class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("ui", "assets/ui.png");

        // простая пуля (можешь заменить на свою)
        this.load.image("bullet", "assets/bullet.png");

        // видео фон
        this.load.video("bg", "assets/bg.mp4", "loadeddata", false, true);
    }

    create() {
        // 🎥 фон-видео
        this.bg = this.add.video(200, 300, "bg");
        this.bg.play(true);
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.setDepth(-1);

        // игрок
        this.player = this.physics.add.image(400, 300, "player");
        this.player.setScale(1);

        // группа пуль
        this.bullets = this.physics.add.group();

        // авто-стрельба каждые 200 мс
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.shoot,
            callbackScope: this
        });

        // мышь
        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;

        this.smooth = 0.15;

        // UI
        this.ui = this.add.image(200, 300, "ui");
        this.ui.setDepth(9999);
    }

    shoot() {
        // создаём пулю в позиции игрока
        let bullet = this.bullets.create(this.player.x, this.player.y - 30, "bullet");

        bullet.setVelocityY(-400); // вверх
        bullet.setCollideWorldBounds(false);

        // авто-удаление когда вышла за экран
        bullet.update = function () {
            if (this.y < -50) {
                this.destroy();
            }
        };
    }

    update() {
        let targetX = this.pointer.x;
        let targetY = this.pointer.y;

        // плавное движение игрока
        this.player.x += (targetX - this.player.x) * this.smooth;
        this.player.y += (targetY - this.player.y) * this.smooth;

        // обновление пуль
        this.bullets.children.each((bullet) => {
            if (bullet.update) bullet.update();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#0b0b0b",
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
