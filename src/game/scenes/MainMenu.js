import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);
    bg.setAlpha(1);

    if (!this.sound.get("bgm") || !this.sound.get("bgm").isPlaying) {
      this.music = this.sound.add("bgm", { loop: true, volume: 0.4 });
      this.music.play();
    }

    this.add.image(512, 200, "logo").setScale(0.5); // Adjust Y position and scale as needed

    // --- REFINED FONT STYLES ---
    this.add
      .text(512, 350, "Bomb Squad Barista", {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: 72,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(512, 500, "Start Game", {
        fontFamily: "Arial, sans-serif",
        fontSize: 38,
        color: "#00ff00",
        backgroundColor: "#111111",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
        // --- REFINED: Add a subtle rounded corner ---
        cornerRadius: 10,
      })
      .setOrigin(0.5)
      .setInteractive();

    this.tweens.add({
      targets: startButton,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    startButton.on("pointerdown", () => {
      this.tweens.killAll();
      this.scene.start("Game");
    });

    const isMuted = this.registry.get("isMuted");
    this.sound.mute = isMuted;

    const muteButton = this.add
      .image(
        this.sys.game.config.width - 40, // Position from right edge
        40, // Position from top edge
        isMuted ? "icon_sound_off" : "icon_sound_on"
      )
      .setInteractive()
      .setScale(1.5); // Adjust scale as needed

    muteButton.on("pointerdown", () => {
      const currentMuteState = !this.registry.get("isMuted");
      this.registry.set("isMuted", currentMuteState);
      this.sound.mute = currentMuteState;
      muteButton.setTexture(
        currentMuteState ? "icon_sound_off" : "icon_sound_on"
      );
    });
  }
}
