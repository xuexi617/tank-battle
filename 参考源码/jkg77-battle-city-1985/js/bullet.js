// Bullet class for Battle City
class Bullet {
  constructor(x, y, direction, speed, owner) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 4;
    this.direction = direction;
    this.speed = speed;
    this.owner = owner;
    this.active = true;

    // Set velocity based on direction
    this.vx = 0;
    this.vy = 0;

    switch (direction) {
      case "up":
        this.vy = -speed;
        break;
      case "down":
        this.vy = speed;
        break;
      case "left":
        this.vx = -speed;
        break;
      case "right":
        this.vx = speed;
        break;
    }
  }

  update(deltaTime, map) {
    if (!this.active) return;

    // Update position
    const dt = deltaTime / 1000;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check bounds
    if (this.x < 0 || this.x > 520 || this.y < 0 || this.y > 520) {
      this.active = false;
      return;
    }

    // Check collision with map
    const gridX = Math.floor(this.x / 40);
    const gridY = Math.floor(this.y / 40);

    if (map && !map.canMoveTo(gridX, gridY)) {
      // Check if we hit a destructible block
      if (map.isDestructible(gridX, gridY)) {
        map.destroyBlock(gridX, gridY);
      }
      this.active = false;
    }
  }

  render(ctx, gridSize) {
    if (!this.active) return;

    ctx.fillStyle = "#fff";

    // Draw bullet shape based on direction
    if (this.direction === "up" || this.direction === "down") {
      ctx.fillRect(this.x, this.y, 4, 8);
    } else {
      ctx.fillRect(this.x, this.y, 8, 4);
    }
  }
}
