// Powerup class for Battle City
class Powerup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.type = type; // 'shield', 'fastShot', 'extraLife', 'freeze', 'grenade'

    this.expired = false;
    this.duration = 15000; // 15 seconds before disappearing
    this.timer = 0;

    // Animation
    this.animTimer = 0;
    this.animSpeed = 200;
    this.visible = true;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    this.animTimer += deltaTime;

    // Blinking animation when about to expire
    if (this.timer > this.duration - 3000) {
      if (this.animTimer >= this.animSpeed) {
        this.visible = !this.visible;
        this.animTimer = 0;
      }
    }

    // Expire after duration
    if (this.timer >= this.duration) {
      this.expired = true;
    }
  }

  applyEffect(tank) {
    switch (this.type) {
      case "shield":
        tank.shield = true;
        tank.shieldTime = 10000; // 10 seconds
        break;

      case "fastShot":
        tank.fastShot = true;
        tank.fastShotTime = 15000; // 15 seconds
        break;

      case "extraLife":
        tank.lives++;
        break;

      case "freeze":
        // Freeze all enemies for 5 seconds
        if (window.game && window.game.enemies) {
          window.game.enemies.forEach((enemy) => {
            enemy.frozen = true;
            enemy.freezeTime = 5000;
          });
        }
        break;

      case "grenade":
        // Destroy all enemies on screen
        if (window.game && window.game.enemies) {
          window.game.enemies.forEach((enemy) => {
            enemy.takeDamage();
            if (tank.type === "player") {
              tank.score += 100;
            }
          });
        }
        break;
    }
  }

  render(ctx, gridSize) {
    if (!this.visible) return;

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    // Background circle
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Powerup specific rendering
    switch (this.type) {
      case "shield":
        this.renderShield(ctx, centerX, centerY);
        break;
      case "fastShot":
        this.renderFastShot(ctx, centerX, centerY);
        break;
      case "extraLife":
        this.renderExtraLife(ctx, centerX, centerY);
        break;
      case "freeze":
        this.renderFreeze(ctx, centerX, centerY);
        break;
      case "grenade":
        this.renderGrenade(ctx, centerX, centerY);
        break;
    }

    // Border
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  renderShield(ctx, x, y) {
    // Shield symbol
    ctx.fillStyle = "#00f";
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x - 8, y - 8);
    ctx.lineTo(x - 8, y + 4);
    ctx.lineTo(x, y + 12);
    ctx.lineTo(x + 8, y + 4);
    ctx.lineTo(x + 8, y - 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  renderFastShot(ctx, x, y) {
    // Fast shot symbol (multiple bullets)
    ctx.fillStyle = "#ff0";

    // Three bullets
    ctx.fillRect(x - 6, y - 8, 3, 6);
    ctx.fillRect(x - 1, y - 8, 3, 6);
    ctx.fillRect(x + 4, y - 8, 3, 6);

    // Speed lines
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 4);
    ctx.lineTo(x - 4, y + 4);
    ctx.moveTo(x - 8, y + 8);
    ctx.lineTo(x - 2, y + 8);
    ctx.stroke();
  }

  renderExtraLife(ctx, x, y) {
    // Tank symbol
    ctx.fillStyle = "#0f0";
    ctx.fillRect(x - 8, y - 6, 16, 12);

    // Cannon
    ctx.fillRect(x - 2, y - 10, 4, 8);

    // Tracks
    ctx.fillStyle = "#080";
    ctx.fillRect(x - 10, y - 4, 2, 8);
    ctx.fillRect(x + 8, y - 4, 2, 8);
  }

  renderFreeze(ctx, x, y) {
    // Snowflake symbol
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    // Main lines
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);

    // Diagonal lines
    ctx.moveTo(x - 7, y - 7);
    ctx.lineTo(x + 7, y + 7);
    ctx.moveTo(x - 7, y + 7);
    ctx.lineTo(x + 7, y - 7);

    ctx.stroke();

    // Center dot
    ctx.fillStyle = "#0ff";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  renderGrenade(ctx, x, y) {
    // Grenade symbol
    ctx.fillStyle = "#f80";
    ctx.beginPath();
    ctx.arc(x, y + 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Pin
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 2, y - 6);
    ctx.lineTo(x - 2, y - 10);
    ctx.lineTo(x + 2, y - 10);
    ctx.stroke();

    // Explosion lines
    ctx.strokeStyle = "#ff0";
    ctx.lineWidth = 1;
    const lines = 8;
    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2;
      const x1 = x + Math.cos(angle) * 6;
      const y1 = y + Math.sin(angle) * 6;
      const x2 = x + Math.cos(angle) * 12;
      const y2 = y + Math.sin(angle) * 12;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}
