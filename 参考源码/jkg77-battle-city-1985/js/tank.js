// Tank class for Battle City
class Tank {
  constructor(gridX, gridY, direction = "up", type = "player", playerId = 1) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.x = gridX * 40;
    this.y = gridY * 40;
    this.width = 40;
    this.height = 40;

    this.direction = direction;
    this.type = type; // 'player' or 'enemy'
    this.playerId = playerId;

    this.speed = type === "player" ? 100 : 60; // pixels per second
    this.alive = true;
    this.health = type === "player" ? 1 : 1;

    // Shooting properties
    this.lastShotTime = 0;
    this.shotCooldown = type === "player" ? 300 : 500; // milliseconds
    this.bulletSpeed = 200;

    // Player specific
    this.score = 0;
    this.lives = 3;

    // Power-up effects
    this.shield = false;
    this.shieldTime = 0;
    this.fastShot = false;
    this.fastShotTime = 0;

    // Movement
    this.moving = false;
    this.targetX = this.x;
    this.targetY = this.y;
    this.moveProgress = 0;
    this.desiredDirection = null;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 200; // ms per frame
  }

  setDirection(newDirection) {
    // Store the desired direction
    this.desiredDirection = newDirection;

    // If direction changed or not moving, update facing direction
    if (this.direction !== newDirection) {
      this.direction = newDirection;
    }

    // Only start new movement if not currently moving
    if (!this.moving) {
      this.startMovement(newDirection);
    }
  }

  startMovement(direction) {
    // Calculate target position (next grid cell)
    let targetGridX = this.gridX;
    let targetGridY = this.gridY;

    switch (direction) {
      case "up":
        targetGridY = this.gridY - 1;
        break;
      case "down":
        targetGridY = this.gridY + 1;
        break;
      case "left":
        targetGridX = this.gridX - 1;
        break;
      case "right":
        targetGridX = this.gridX + 1;
        break;
    }

    // Check if target position is valid
    if (this.canMoveToGrid(targetGridX, targetGridY)) {
      this.targetX = targetGridX * 40;
      this.targetY = targetGridY * 40;
      this.moving = true;
      this.moveProgress = 0;
    } else {
      this.moving = false;
    }
  }

  update(deltaTime, map) {
    if (!this.alive) return;

    // Update power-up timers
    this.updatePowerups(deltaTime);

    // Update animation
    this.animTimer += deltaTime;
    if (this.animTimer >= this.animSpeed) {
      this.animFrame = (this.animFrame + 1) % 2;
      this.animTimer = 0;
    }

    // Handle movement
    if (this.moving) {
      this.updateMovement(deltaTime, map);
    }

    // AI behavior for enemies
    if (this.type === "enemy") {
      this.updateAI(deltaTime);
    }
  }

  updateMovement(deltaTime, map) {
    if (!this.moving) return;

    // Move towards target position
    const moveSpeed = this.speed / 1000; // pixels per millisecond
    const moveDistance = moveSpeed * deltaTime;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= moveDistance) {
      // Reached target - snap to grid
      this.x = this.targetX;
      this.y = this.targetY;
      this.gridX = Math.floor(this.x / 40);
      this.gridY = Math.floor(this.y / 40);
      this.moving = false;

      // If we still have a desired direction, continue moving
      if (this.desiredDirection && this.desiredDirection === this.direction) {
        this.startMovement(this.desiredDirection);
      }
    } else {
      // Move towards target
      const ratio = moveDistance / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
  }

  canMoveToGrid(gridX, gridY) {
    // Check bounds
    if (gridX < 0 || gridX >= 13 || gridY < 0 || gridY >= 13) {
      return false;
    }

    // Get the map from the global game instance
    if (window.game && window.game.map) {
      return window.game.map.canMoveTo(gridX, gridY);
    }

    return false;
  }

  updateAI(deltaTime) {
    // Simple AI: occasionally change direction or shoot
    if (Math.random() < 0.02) {
      // 2% chance to change direction
      const directions = ["up", "down", "left", "right"];
      this.setDirection(
        directions[Math.floor(Math.random() * directions.length)]
      );
    } else if (Math.random() < 0.005) {
      // 0.5% chance to stop
      this.moving = false;
    }
  }

  updatePowerups(deltaTime) {
    if (this.shield) {
      this.shieldTime -= deltaTime;
      if (this.shieldTime <= 0) {
        this.shield = false;
      }
    }

    if (this.fastShot) {
      this.fastShotTime -= deltaTime;
      if (this.fastShotTime <= 0) {
        this.fastShot = false;
      }
    }
  }

  canShoot() {
    const currentTime = Date.now();
    const cooldown = this.fastShot ? this.shotCooldown / 2 : this.shotCooldown;
    return currentTime - this.lastShotTime >= cooldown;
  }

  shoot() {
    if (!this.canShoot()) return null;

    this.lastShotTime = Date.now();

    // Calculate bullet start position
    let bulletX = this.x + this.width / 2 - 2;
    let bulletY = this.y + this.height / 2 - 2;

    // Adjust position based on direction
    switch (this.direction) {
      case "up":
        bulletY = this.y - 4;
        break;
      case "down":
        bulletY = this.y + this.height;
        break;
      case "left":
        bulletX = this.x - 4;
        break;
      case "right":
        bulletX = this.x + this.width;
        break;
    }

    return new Bullet(bulletX, bulletY, this.direction, this.bulletSpeed, this);
  }

  takeDamage() {
    if (this.shield) return; // Shield protects from damage

    this.health--;
    if (this.health <= 0) {
      this.alive = false;
      if (this.type === "player") {
        this.lives--;
        if (this.lives > 0) {
          // Respawn after delay
          setTimeout(() => {
            this.respawn();
          }, 2000);
        }
      }
    }
  }

  respawn() {
    this.alive = true;
    this.health = 1;
    this.shield = true;
    this.shieldTime = 3000; // 3 seconds of invincibility

    // Reset position - left and right of base
    if (this.playerId === 1) {
      this.gridX = 4;
      this.gridY = 12;
    } else {
      this.gridX = 8;
      this.gridY = 12;
    }
    this.x = this.gridX * 40;
    this.y = this.gridY * 40;
  }

  applyPowerup(type) {
    switch (type) {
      case "shield":
        this.shield = true;
        this.shieldTime = 10000; // 10 seconds
        break;
      case "fastShot":
        this.fastShot = true;
        this.fastShotTime = 15000; // 15 seconds
        break;
      case "extraLife":
        this.lives++;
        break;
    }
  }

  render(ctx, gridSize) {
    if (!this.alive) return;

    ctx.save();

    // Shield effect
    if (this.shield) {
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now() / 100);
    }

    // Tank color based on type and player
    let color;
    if (this.type === "player") {
      color = this.playerId === 1 ? "#ff0" : "#0f0"; // Yellow for P1, Green for P2
    } else {
      color = "#f00"; // Red for enemies
    }

    ctx.fillStyle = color;

    // Draw tank body
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    // Draw tank tracks (animation)
    ctx.fillStyle = this.animFrame === 0 ? "#888" : "#666";
    ctx.fillRect(this.x, this.y + 8, 4, this.height - 16);
    ctx.fillRect(this.x + this.width - 4, this.y + 8, 4, this.height - 16);

    // Draw cannon based on direction
    ctx.fillStyle = color;
    switch (this.direction) {
      case "up":
        ctx.fillRect(this.x + 16, this.y, 8, 20);
        break;
      case "down":
        ctx.fillRect(this.x + 16, this.y + 20, 8, 20);
        break;
      case "left":
        ctx.fillRect(this.x, this.y + 16, 20, 8);
        break;
      case "right":
        ctx.fillRect(this.x + 20, this.y + 16, 20, 8);
        break;
    }

    // Draw center dot
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x + 18, this.y + 18, 4, 4);

    ctx.restore();
  }
}
