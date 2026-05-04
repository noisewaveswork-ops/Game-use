class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("ui", "assets/ui.png");

        this.load.video("bg", "assets/bg.mp4", "loadeddata", false, true);

        this.load.image("bullet", "assets/bullet.png");
    }

    create() {

        // 🎥 фон
        this.bg = this.add.video(200, 300, "bg");
        this.bg.play(true);
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.setDepth(-1);
        this.bg.setDisplaySize(400, 600);

        // 👤 игрок
        this.player = this.add.image(200, 300, "player");
        this.player.setScale(1);

        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;

        this.smooth = 0.15;

        // 🎯 пули
        this.bullets = [];

        // 🔫 режим стрельбы
        this.fireMode = 0; 
        // 0 = straight
        // 1 = spread

        // 🔘 UI кнопка переключения
        this.ui = this.add.image(200, 550, "ui");
        this.ui.setDepth(9999);
        this.ui.setInteractive();

        this.ui.on("pointerdown", () => {
            this.fireMode = (this.fireMode + 1) % 2;
            console.log("Fire mode:", this.fireMode);
        });

        // 🔥 автострельба
        this.time.addEvent({
            delay: 150,
            loop: true,
            callback: this.shoot,
            callbackScope: this
        });
    }

    shoot() {
        let px = this.player.x;
        let py = this.player.y;

        let dx = this.pointer.x - px;
        let dy = this.pointer.y - py;

        let baseAngle = Math.atan2(dy, dx);

        if (this.fireMode === 0) {
            this.spawnBullet(px, py, baseAngle);
        }

        if (this.fireMode === 1) {
            this.spawnBullet(px, py, baseAngle - Phaser.Math.DegToRad(30));
            this.spawnBullet(px, py, baseAngle + Phaser.Math.DegToRad(30));
        }
    }

    spawnBullet(x, y, angle) {
        let bullet = this.add.image(x, y + 20, "bullet");
        bullet.setScale(0.5);

        bullet.speed = 6;
        bullet.angleRad = angle;

        this.bullets.push(bullet);
    }

    update() {

        // 👤 движение игрока
        let tx = this.pointer.x;
        let ty = this.pointer.y;

        this.player.x += (tx - this.player.x) * this.smooth;
        this.player.y += (ty - this.player.y) * this.smooth;

        // 🔫 обновление пуль
        for (let i = 0; i < this.bullets.length; i++) {
            let b = this.bullets[i];

            b.x += Math.cos(b.angleRad) * b.speed;
            b.y += Math.sin(b.angleRad) * b.speed;

            // удаление за экраном
            if (b.x < -50 || b.x > 450 || b.y < -50 || b.y > 650) {
                b.destroy();
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#0b0b0b",
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
