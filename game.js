class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("ui", "assets/ui.png");
        this.load.image("bullet", "assets/bullet.png");

        this.load.video("bg", "assets/bg.mp4", "loadeddata", false, true);
    }

    create() {
        // 🎥 видео фон
        this.bg = this.add.video(200, 300, "bg");
        this.bg.play(true);
        this.bg.setMute(true);
        this.bg.setLoop(true);
        this.bg.setDepth(-1);

        // игрок
        this.player = this.add.image(400, 300, "player");

        this.input.setDefaultCursor("none");
        this.pointer = this.input.activePointer;
        this.smooth = 0.15;

        // UI
        this.ui = this.add.image(200, 300, "ui");
        this.ui.setDepth(9999);

        // 🔫 группа пуль
        this.bullets = this.physics.add.group({
            defaultKey: "bullet",
            maxSize: 50
        });

        // ⏱ автострельба каждые 200 мс
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.shoot,
            callbackScope: this
        });
    }

    shoot() {
        let bullet = this.bullets.get(this.player.x, this.player.y - 20);

        if (!bullet) return;

        bullet.setActive(true);
        bullet.setVisible(true);

        bullet.body.velocity.y = -400; // вверх
    }

    update() {
        let targetX = this.pointer.x;
        let targetY = this.pointer.y;

        // плавное движение игрока
        this.player.x += (targetX - this.player.x) * this.smooth;
        this.player.y += (targetY - this.player.y) * this.smooth;

        // ♻️ очистка пуль
        this.bullets.children.each(bullet => {
            if (bullet.active && bullet.y < -50) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    backgroundColor: "#0b0b0b",
    scene: MainScene,
    physics: {
        default: "arcade"
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
