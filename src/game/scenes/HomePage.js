import { Scene } from "phaser";

export class HomePage extends Scene {
  constructor() {
    super("HomePage");
  }

  create() {
    // --- Background ---
    const bg = this.add.image(512, 384, "background_shop");
    const scale = Math.max(
      this.sys.game.config.width / bg.width,
      this.sys.game.config.height / bg.height
    );
    bg.setScale(scale).setScrollFactor(0);
    this.tweens.add({
      targets: bg,
      alpha: 0.9,
      ease: "Sine.easeInOut",
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // --- User Profile Area with Circular Avatar ---
    const playerName = localStorage.getItem("currentPlayerName") || "Player";

    // Create the avatar image
    const avatar = this.add.image(50, 50, "avatar_icon").setScale(0.4); // Positioned top-left

    // Create a circular mask
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillCircle(avatar.x, avatar.y, 20); // 60px diameter circle
    const mask = maskShape.createGeometryMask();

    // Apply the mask to the avatar
    avatar.setMask(mask);

    const welcomeText = this.add
      .text(80, 60, `${playerName}`, {
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        color: "#eeeeee",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5); // Align text to the right of the avatar

    // --- Music Logic ---
    if (!this.sound.get("bgm") || !this.sound.get("bgm").isPlaying) {
      this.music = this.sound.add("bgm", { loop: true, volume: 0.4 });
      this.music.play();
    }

    // --- Logo and Title (Restored to Original Size) ---
    const logo = this.add.image(512, 200, "logo").setScale(0.5);
    const title = this.add
      .text(512, 350, "Bomb Squad Barista", {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: 72, // Restored original size
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // --- Animated Buttons (Restored to Original Style) ---
    const buttonStyle = {
      fontFamily: "Arial, sans-serif",
      fontSize: 38, // Restored original size
      color: "#00ff00ff", // Restored original color
      backgroundColor: "#111111", // Restored original background
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      borderRadius: 10,
      fixedWidth: 350,
      align: "center",
    };

    const startBtn = this.add
      .text(512, 500, "Start Game", buttonStyle)
      .setOrigin(0.5);
    const leadBtn = this.add
      .text(512, 600, "Leaderboard", buttonStyle)
      .setOrigin(0.5);
    const instBtn = this.add
      .text(512, 700, "Instructions", buttonStyle)
      .setOrigin(0.5);

    const buttons = [startBtn, leadBtn, instBtn];

    buttons.forEach((button) => {
      button.setInteractive();

      // Hover Effects
      button.on("pointerover", () => {
        this.tweens.add({
          targets: button,
          scale: 1.05,
          duration: 200,
          ease: "Power1",
        });
      });
      button.on("pointerout", () => {
        this.tweens.add({
          targets: button,
          scale: 1,
          duration: 200,
          ease: "Power1",
        });
      });

      // Click Effect
      button.on("pointerdown", () => {
        this.tweens.add({
          targets: button,
          scale: 0.95,
          duration: 100,
          ease: "Power1",
          yoyo: true,
        });
        this.sound.play("sfx_tap");
      });
    });

    startBtn.on("pointerup", () => this.scene.start("Game"));
    leadBtn.on("pointerup", () => this.scene.start("Leaderboard"));
    instBtn.on("pointerup", () => this.scene.start("Instructions"));

    // --- Mute Button (positioned top-right) ---
    const isMuted = this.registry.get("isMuted");
    this.sound.mute = isMuted;
    const muteButton = this.add
      .image(
        this.sys.game.config.width - 40,
        60, // Adjusted Y to match avatar's vertical center
        isMuted ? "icon_sound_off" : "icon_sound_on"
      )
      .setInteractive()
      .setScale(1.5);

    muteButton.on("pointerdown", () => {
      const currentMuteState = !this.registry.get("isMuted");
      this.registry.set("isMuted", currentMuteState);
      this.sound.mute = currentMuteState;
      muteButton.setTexture(
        currentMuteState ? "icon_sound_off" : "icon_sound_on"
      );
    });

    // --- Dynamic Entrance Animation (Panel removed) ---
    const uiElements = [
      avatar,
      welcomeText,
      logo,
      title,
      ...buttons,
      muteButton,
    ];
    uiElements.forEach((el) => (el.alpha = 0));

    this.tweens.add({
      targets: uiElements,
      alpha: { from: 0, to: 1 },
      y: "-=10",
      duration: 400,
      ease: "Power2",
      delay: this.tweens.stagger(50),
    });
  }
}
