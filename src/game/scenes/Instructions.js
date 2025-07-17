import { Scene } from "phaser";

export class Instructions extends Scene {
  constructor() {
    super("Instructions");
  }

  create() {
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);

    this.add.rectangle(512, 384, 800, 500, 0x000000, 0.7);
    this.add
      .text(512, 170, "How to Play", {
        fontSize: 48,
        color: "#ffff00" /* ...styles... */,
      })
      .setOrigin(0.5);

    const instructions = [
      "1. A sequence of ingredients will be shown.",
      "   Memorize the order!",
      "",
      "2. Click the ingredients in the correct sequence.",
      "",
      "3. Complete the order before the timer runs out.",
      "",
      "4. Watch out for RUSH ORDERS for bonus points!",
    ];

    this.add
      .text(512, 384, instructions, {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
        lineSpacing: 15,
      })
      .setOrigin(0.5);

    const backBtn = this.add
      .text(512, 580, "Back to Home", {
        /* ...button styles... */
      })
      .setOrigin(0.5)
      .setInteractive();
    backBtn.on("pointerdown", () => this.scene.start("HomePage"));
  }
}
