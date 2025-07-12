import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  init() {
    this.currentOrder = [];
    this.playerInput = [];
    this.isPlayerTurn = false;
    this.orderLength = 2;
    this.timerDuration = 4000;
    this.score = 0;
    this.isRushOrder = false;
    this.timerTween = null;
    this.sequenceTimer = null;
  }

  create() {
    const bg = this.add.image(512, 384, "background_shop");
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setScrollFactor(0);
    bg.setAlpha(0.9);

    const timerBarWidth = this.sys.game.config.width - 450;
    this.timerBar = this.add
      .rectangle(timerBarWidth / 2 + 20, 40, timerBarWidth, 20, 0x00ff00)
      .setStrokeStyle(2, 0xffffff);
    // The timer bar needs to scale from its left edge, so we set the origin.
    this.timerBar.setOrigin(0, 0.5);
    this.cup = this.add.image(timerBarWidth + 350, 40, "cup").setScale(0.025);

    this.ingredients = {
      blue: "icon_blue",
      red: "icon_red",
      green: "icon_green",
      yellow: "icon_yellow",
      espresso: "icon_espresso",
    };
    this.unlockedIngredients = ["blue", "red", "green", "yellow"];

    const buttonY = this.sys.game.config.height - 120;
    const totalWidth = 5 * 170;
    let buttonX = (this.sys.game.config.width - totalWidth) / 2 + 85;

    this.buttons = {};
    Object.keys(this.ingredients).forEach((key) => {
      const button = this.add
        .image(buttonX, buttonY, this.ingredients[key])
        .setScale(1.2)
        .setInteractive();

      button.on("pointerdown", () => {
        if (this.isPlayerTurn) {
          this.handleInput(key, button);
        }
      });

      if (key === "espresso") button.setVisible(false);
      this.buttons[key] = button;
      buttonX += 170;
    });

    this.orderText = this.add
      .text(512, 100, "Memorize!", {
        fontFamily: "Arial Black",
        fontSize: "64px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.scoreText = this.add.text(40, 20, "Score: 0", {
      fontFamily: "Arial Black",
      fontSize: "38px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
    });

    this.generateNewOrder();

    // Add this block at the end of the create() method in each scene

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

  startPlayerTurn() {
    this.playerInput = [];
    this.isPlayerTurn = true;

    this.timerBar.scaleX = 1;
    this.timerTween = this.tweens.add({
      targets: this.timerBar,
      scaleX: 0,
      duration: this.isRushOrder ? 2000 : this.timerDuration,
      ease: "Linear",
      onComplete: () => {
        this.gameOver("Ran out of time!");
      },
    });
  }

  handleInput(selection, button) {
    if (!this.isPlayerTurn) return;

    this.sound.play("sfx_tap");
    this.playerInput.push(selection);
    const currentStep = this.playerInput.length - 1;

    // The particle now flies to the new, smaller cup position.
    const particle = this.add
      .image(button.x, button.y, this.ingredients[selection])
      .setScale(0.8);
    this.tweens.add({
      targets: particle,
      x: this.cup.x,
      y: this.cup.y,
      scale: 0,
      duration: 300,
      ease: "Cubic.easeIn",
      onComplete: () => {
        particle.destroy();
      },
    });

    if (this.playerInput[currentStep] !== this.currentOrder[currentStep]) {
      if (this.timerTween) this.timerTween.stop();
      this.gameOver("Wrong Ingredient!");
      return;
    }

    if (this.playerInput.length === this.currentOrder.length) {
      this.isPlayerTurn = false;
      if (this.timerTween) this.timerTween.stop();
      this.sound.play("sfx_success");

      this.score++;
      this.scoreText.setText("Score: " + this.score);

      if (this.score > 10 && this.unlockedIngredients.length < 5) {
        this.unlockedIngredients.push("espresso");
        this.buttons["espresso"].setVisible(true);
        this.tweens.add({
          targets: this.buttons["espresso"],
          alpha: 0,
          duration: 250,
          yoyo: true,
          repeat: 1,
        });
      }
      if (this.score > 0 && this.score % 5 === 0 && this.orderLength < 6) {
        this.orderLength++;
      }
      if (this.timerDuration > 1500) {
        this.timerDuration -= 50;
      }

      if (this.isRushOrder) {
        this.rushOrderCount--;
        if (this.rushOrderCount > 0) {
          this.time.delayedCall(500, this.generateNewOrder, [], this);
        } else {
          this.endRushOrder();
        }
      } else {
        this.time.delayedCall(1000, this.generateNewOrder, [], this);
      }
    }
  }

  gameOver(reason) {
    console.log(reason);
    this.sound.play("sfx_failure");
    this.isPlayerTurn = false;

    if (this.timerTween) this.timerTween.stop();
    if (this.sequenceTimer) this.sequenceTimer.destroy();
    this.tweens.killAll(); // Stop all tweens
    this.time.removeAllEvents(); // Clear any pending delayed calls

    this.cameras.main.shake(250, 0.01);

    let highScore = parseInt(
      localStorage.getItem("baristaHighScore") || "0",
      10
    );

    if (this.score > highScore) {
      highScore = this.score;
      localStorage.setItem("baristaHighScore", highScore);
    }

    this.time.delayedCall(500, () => {
      this.scene.start("GameOver", { score: this.score, highScore: highScore });
    });
  }

  generateNewOrder() {
    if (
      this.score > 12 &&
      Phaser.Math.Between(1, 10) > 8 &&
      !this.isRushOrder
    ) {
      this.orderText.setText("Get Ready!").setVisible(true).setColor("#ff8c00");
      this.time.delayedCall(2000, this.startRushOrder, [], this);
      return;
    }

    this.isPlayerTurn = false;
    this.currentOrder = [];
    for (let i = 0; i < this.orderLength; i++) {
      this.currentOrder.push(Phaser.Math.RND.pick(this.unlockedIngredients));
    }
    this.orderText.setText("Memorize!").setVisible(true).setColor("#ffffff");
    this.showOrderSequence();
  }

  showOrderSequence() {
    if (this.sequenceTimer) {
      this.sequenceTimer.destroy();
    }

    let delay = 0;
    const animationDuration = this.isRushOrder ? 120 : 200;

    this.currentOrder.forEach((key) => {
      this.time.delayedCall(delay, () => {
        const button = this.buttons[key];
        if (button) {
          // Defensive check to kill any lingering tweens on this button
          this.tweens.killTweensOf(button);

          this.tweens.add({
            targets: button,
            scale: 1.5,
            duration: animationDuration, // Use the new dynamic duration
            yoyo: true,
            ease: "Cubic.easeInOut",
            // On complete, guarantee the scale is reset to the base value
            onComplete: () => {
              if (button.active) {
                button.setScale(1.2);
              }
            },
          });
        }
      });
      // The total animation cycle (120 * 2 = 240ms) is now less than the delay (250ms)
      delay += this.isRushOrder ? 250 : 500;
    });

    // Create a final timer to start the player's turn after the sequence is shown
    this.sequenceTimer = this.time.delayedCall(delay, () => {
      this.orderText.setVisible(false);
      this.startPlayerTurn();
    });
  }

  startRushOrder() {
    this.isRushOrder = true;
    this.rushOrderCount = 2;
    this.orderLength = 2;
    this.orderText.setText("RUSH ORDER!").setVisible(true).setColor("#ff0000");
    this.time.delayedCall(1500, this.generateNewOrder, [], this);
  }

  endRushOrder() {
    this.isRushOrder = false;
    this.orderText.setText("Bonus +5!").setVisible(true).setColor("#00ff00");
    this.score += 5;
    this.scoreText.setText("Score: " + this.score);
    this.time.delayedCall(1500, this.generateNewOrder, [], this);
  }
}
