class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    preload() {
        this.load.image("player", "assets/player.png");
        
        // видео фон
        this.load.video("bg", "https://labs.phaser.io/assets/video/test.mp4", "loadeddata", false, true);
    }

    create() {
        // 🎥 фон-видео
        this.bg = this.add.video(200, 300, "bg"); // центр 400x600
        this.bg.setMute(true);     // иначе autoplay не сработает
        this.bg.setLoop(true);
        this.bg.play(true);

        this.bg.setDepth(-1);      // отправляем назад
        
        // игрок
        this.player = this.add.image(400, 300, "player");
        this.player.setScale(1);

        // включаем мышь
        this.input.setDefaultCursor("none");

        this.pointer = this.input.activePointer;

        // плавность движения
        this.smooth = 0.15;
    }

    update() {
        let targetX = this.pointer.x;
        let targetY = this.pointer.y;

        // плавное следование за мышью
        this.player.x += (targetX - this.player.x) * this.smooth;
        this.player.y += (targetY - this.player.y) * this.smooth;
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
