import { Scene } from "phaser";

export class Login extends Scene {
  constructor() {
    super("Login");
  }

  create() {
    // --- Background and UI Setup (same as before) ---
    const bg = this.add.image(512, 384, "background_shop");
    const scale = Math.max(
      this.sys.game.config.width / bg.width,
      this.sys.game.config.height / bg.height
    );
    bg.setScale(scale).setScrollFactor(0);

    this.add.rectangle(
      512,
      384,
      this.sys.game.config.width,
      this.sys.game.config.height,
      0x000000,
      0.5
    );

    this.add
      .text(512, 150, "Bomb Squad Barista", {
        fontFamily: '"Arial Black", Gadget, sans-serif',
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(512, 210, "Player Sign-In", {
        fontFamily: "Arial, sans-serif",
        fontSize: 28,
        color: "#dddddd",
      })
      .setOrigin(0.5);

    // --- HTML Form (same as before) ---
    const formHTML = `
      <style>
        .form-container { padding: 30px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .form-container input { width: 300px; padding: 12px; border: 2px solid #555; border-radius: 8px; font-size: 16px; background: #222; color: white; transition: border-color 0.3s, box-shadow 0.3s; }
        .form-container input:focus { outline: none; border-color: #00ff00; box-shadow: 0 0 10px rgba(0, 255, 0, 0.5); }
        .submitBtn { width: 328px; padding: 14px; border-radius: 8px; border: none; font-size: 18px; font-weight: bold; cursor: pointer; background-color: #00ff00; color: #111; transition: background-color 0.2s; margin-top: 10px; }
        .submitBtn:hover { background-color: #8aff8a; }
      </style>
      <div class="form-container">
          <input type="text" name="name" placeholder="Name" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="tel" name="phone" placeholder="10-Digit Phone Number" required>
          <button type="submit" class="submitBtn">Continue</button>
      </div>
    `;

    // --- Error Message Text (handles multiple lines) ---
    this.errorText = this.add
      .text(512, 575, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ff8a8a",
        align: "center",
        lineSpacing: 5,
      })
      .setOrigin(0.5)
      .setVisible(false);

    const form = this.add.dom(512, 400).createFromHTML(formHTML);

    // --- Event Listener with Validation Logic ---
    form.addListener("click input");

    form.on("click", (event) => {
      if (event.target.type === "submit") {
        const name = form.getChildByName("name").value;
        const email = form.getChildByName("email").value;
        const phone = form.getChildByName("phone").value;

        const errors = [];

        // --- Validation Checks ---
        // Name validation: must be at least 2 characters.
        if (name.trim().length < 2) {
          errors.push("Name must be at least 2 characters.");
        }

        // Email validation: checks for a valid format.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push("Please enter a valid email address.");
        }

        // Phone validation: checks for exactly 10 digits.
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
          errors.push("Please enter a 10-digit phone number.");
        }

        // --- Handle Results ---
        if (errors.length > 0) {
          // If there are errors, display them.
          this.errorText.setText(errors.join("\n")).setVisible(true);
        } else {
          // If everything is valid, proceed.
          localStorage.setItem("currentPlayerName", name.trim());
          localStorage.setItem("currentPlayerEmail", email.trim());
          localStorage.setItem("currentPlayerPhone", phone.trim());
          this.errorText.setVisible(false);
          this.scene.start("HomePage");
        }
      }
    });

    // Hide the error message as soon as the user starts typing again.
    form.on("input", () => {
      if (this.errorText.visible) {
        this.errorText.setVisible(false);
      }
    });
  }
}
