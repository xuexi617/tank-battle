// Map class for Battle City
class GameMap {
  constructor(stage) {
    this.stage = stage;
    this.width = 13;
    this.height = 13;
    this.grid = [];
    this.baseDestroyed = false;

    // Tile types
    this.EMPTY = 0;
    this.BRICK = 1;
    this.STEEL = 2;
    this.WATER = 3;
    this.BASE = 4;

    this.generateMap();
  }

  generateMap() {
    // Initialize empty grid
    this.grid = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(this.EMPTY));

    // Generate map based on stage
    this.generateStageMap(this.stage);

    // Always place base at bottom center
    this.placeBase();
  }

  generateStageMap(stage) {
    // Different patterns for different stages
    const patterns = [
      this.generateStage1,
      this.generateStage2,
      this.generateStage3,
      this.generateStage4,
      this.generateStage5,
      this.generateStage6,
      this.generateStage7,
      this.generateStage8,
      this.generateStage9,
      this.generateStage10,
    ];

    const patternIndex = Math.min(stage - 1, patterns.length - 1);
    patterns[patternIndex].call(this);
  }

  generateStage1() {
    // Simple brick walls
    for (let y = 3; y < 10; y++) {
      for (let x = 2; x < 5; x++) {
        if (Math.random() < 0.7) {
          this.grid[y][x] = this.BRICK;
        }
      }
      for (let x = 8; x < 11; x++) {
        if (Math.random() < 0.7) {
          this.grid[y][x] = this.BRICK;
        }
      }
    }

    // Some steel blocks
    this.grid[5][6] = this.STEEL;
    this.grid[6][6] = this.STEEL;
  }

  generateStage2() {
    // Cross pattern
    for (let i = 2; i < 11; i++) {
      this.grid[6][i] = this.BRICK;
      this.grid[i][6] = this.BRICK;
    }

    // Steel reinforcements
    this.grid[6][6] = this.STEEL;
    this.grid[3][6] = this.STEEL;
    this.grid[9][6] = this.STEEL;
    this.grid[6][3] = this.STEEL;
    this.grid[6][9] = this.STEEL;
  }

  generateStage3() {
    // Maze-like pattern
    for (let y = 1; y < 12; y += 2) {
      for (let x = 1; x < 12; x += 2) {
        this.grid[y][x] = this.BRICK;

        // Random connections
        if (Math.random() < 0.5 && x < 11) {
          this.grid[y][x + 1] = this.BRICK;
        }
        if (Math.random() < 0.5 && y < 11) {
          this.grid[y + 1][x] = this.BRICK;
        }
      }
    }
  }

  generateStage4() {
    // Fortress pattern
    // Outer walls
    for (let i = 1; i < 12; i++) {
      this.grid[1][i] = this.STEEL;
      this.grid[11][i] = this.STEEL;
      this.grid[i][1] = this.STEEL;
      this.grid[i][11] = this.STEEL;
    }

    // Inner brick structures
    for (let y = 4; y < 9; y++) {
      for (let x = 4; x < 9; x++) {
        if ((x + y) % 2 === 0) {
          this.grid[y][x] = this.BRICK;
        }
      }
    }
  }

  generateStage5() {
    // Water obstacles
    for (let y = 3; y < 10; y++) {
      for (let x = 3; x < 10; x++) {
        if ((x - 6) * (x - 6) + (y - 6) * (y - 6) < 9) {
          this.grid[y][x] = this.WATER;
        }
      }
    }

    // Brick bridges
    this.grid[6][3] = this.BRICK;
    this.grid[6][9] = this.BRICK;
    this.grid[3][6] = this.BRICK;
    this.grid[9][6] = this.BRICK;
  }

  generateStage6() {
    // Checkerboard with steel
    for (let y = 2; y < 11; y++) {
      for (let x = 2; x < 11; x++) {
        if ((x + y) % 3 === 0) {
          this.grid[y][x] = Math.random() < 0.3 ? this.STEEL : this.BRICK;
        }
      }
    }
  }

  generateStage7() {
    // Spiral pattern
    let x = 6,
      y = 6;
    let dx = 0,
      dy = -1;
    let steps = 1;

    for (let i = 0; i < 50; i++) {
      if (x >= 0 && x < 13 && y >= 0 && y < 13) {
        this.grid[y][x] = this.BRICK;
      }

      x += dx;
      y += dy;

      if (i === steps || i === steps * 2) {
        let temp = dx;
        dx = -dy;
        dy = temp;
        if (i === steps * 2) {
          steps++;
          i = 0;
        }
      }
    }
  }

  generateStage8() {
    // Diamond pattern with steel core
    for (let y = 1; y < 12; y++) {
      for (let x = 1; x < 12; x++) {
        let distance = Math.abs(x - 6) + Math.abs(y - 6);
        if (distance === 3 || distance === 5) {
          this.grid[y][x] = this.BRICK;
        } else if (distance === 1) {
          this.grid[y][x] = this.STEEL;
        }
      }
    }
  }

  generateStage9() {
    // Complex fortress
    // Outer steel walls
    for (let i = 0; i < 13; i++) {
      this.grid[0][i] = this.STEEL;
      this.grid[12][i] = this.STEEL;
      this.grid[i][0] = this.STEEL;
      this.grid[i][12] = this.STEEL;
    }

    // Inner maze
    for (let y = 2; y < 11; y += 3) {
      for (let x = 2; x < 11; x += 3) {
        this.grid[y][x] = this.STEEL;
        this.grid[y][x + 1] = this.BRICK;
        this.grid[y + 1][x] = this.BRICK;
      }
    }

    // Water traps
    this.grid[4][4] = this.WATER;
    this.grid[4][8] = this.WATER;
    this.grid[8][4] = this.WATER;
    this.grid[8][8] = this.WATER;
  }

  generateStage10() {
    // Final boss stage - maximum difficulty
    // Steel perimeter
    for (let i = 0; i < 13; i++) {
      this.grid[0][i] = this.STEEL;
      this.grid[12][i] = this.STEEL;
      this.grid[i][0] = this.STEEL;
      this.grid[i][12] = this.STEEL;
    }

    // Complex inner structure
    for (let y = 2; y < 11; y++) {
      for (let x = 2; x < 11; x++) {
        if ((x + y) % 4 === 0) {
          this.grid[y][x] = this.STEEL;
        } else if ((x * y) % 3 === 0) {
          this.grid[y][x] = this.BRICK;
        } else if ((x - y) % 5 === 0) {
          this.grid[y][x] = this.WATER;
        }
      }
    }

    // Clear some paths
    this.grid[6][2] = this.EMPTY;
    this.grid[6][10] = this.EMPTY;
    this.grid[2][6] = this.EMPTY;
    this.grid[10][6] = this.EMPTY;
  }

  placeBase() {
    // Base is at bottom center - single eagle
    this.grid[12][6] = this.BASE;

    // Protect base with bricks initially
    this.grid[11][5] = this.BRICK;
    this.grid[11][6] = this.BRICK;
    this.grid[11][7] = this.BRICK;
    this.grid[12][5] = this.BRICK;
    this.grid[12][7] = this.BRICK;
  }

  canMoveTo(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }

    const tile = this.grid[y][x];
    return tile === this.EMPTY;
  }

  isPositionClear(x, y) {
    return this.canMoveTo(x, y);
  }

  isDestructible(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }

    const tile = this.grid[y][x];
    return tile === this.BRICK || tile === this.BASE;
  }

  destroyBlock(x, y) {
    if (this.isDestructible(x, y)) {
      if (this.grid[y][x] === this.BASE) {
        this.baseDestroyed = true;
      }
      this.grid[y][x] = this.EMPTY;
    }
  }

  render(ctx, gridSize) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.grid[y][x];
        const pixelX = x * gridSize;
        const pixelY = y * gridSize;

        switch (tile) {
          case this.BRICK:
            this.renderBrick(ctx, pixelX, pixelY, gridSize);
            break;
          case this.STEEL:
            this.renderSteel(ctx, pixelX, pixelY, gridSize);
            break;
          case this.WATER:
            this.renderWater(ctx, pixelX, pixelY, gridSize);
            break;
          case this.BASE:
            this.renderBase(ctx, pixelX, pixelY, gridSize);
            break;
        }
      }
    }
  }

  renderBrick(ctx, x, y, size) {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x, y, size, size);

    // Brick pattern
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);

    // Brick lines
    ctx.beginPath();
    ctx.moveTo(x, y + size / 2);
    ctx.lineTo(x + size, y + size / 2);
    ctx.moveTo(x + size / 2, y);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.moveTo(x + size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size);
    ctx.stroke();
  }

  renderSteel(ctx, x, y, size) {
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(x, y, size, size);

    // Steel pattern
    ctx.fillStyle = "#808080";
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);

    // Rivets
    ctx.fillStyle = "#404040";
    ctx.fillRect(x + 4, y + 4, 4, 4);
    ctx.fillRect(x + size - 8, y + 4, 4, 4);
    ctx.fillRect(x + 4, y + size - 8, 4, 4);
    ctx.fillRect(x + size - 8, y + size - 8, 4, 4);
  }

  renderWater(ctx, x, y, size) {
    // Animated water
    const time = Date.now() / 500;
    const wave = Math.sin(time + x / 20) * 0.3 + 0.7;

    ctx.fillStyle = `rgba(0, 100, 200, ${wave})`;
    ctx.fillRect(x, y, size, size);

    // Water lines
    ctx.strokeStyle = "rgba(0, 150, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const waveY =
        y + size / 4 + (i * size) / 4 + Math.sin(time + x / 10 + i) * 3;
      ctx.moveTo(x, waveY);
      ctx.lineTo(x + size, waveY);
    }
    ctx.stroke();
  }

  renderBase(ctx, x, y, size) {
    if (this.baseDestroyed) {
      // Destroyed base
      ctx.fillStyle = "#800";
      ctx.fillRect(x, y, size, size);

      // Destruction pattern
      ctx.fillStyle = "#400";
      for (let i = 0; i < 5; i++) {
        const rx = x + Math.random() * size;
        const ry = y + Math.random() * size;
        ctx.fillRect(rx, ry, 4, 4);
      }
    } else {
      // Eagle base
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(x, y, size, size);

      // Eagle symbol (simplified)
      ctx.fillStyle = "#000";
      ctx.fillRect(x + size / 4, y + size / 4, size / 2, size / 2);

      ctx.fillStyle = "#FFD700";
      // Eagle head
      ctx.fillRect(x + size / 3, y + size / 3, size / 6, size / 6);
      // Wings
      ctx.fillRect(x + size / 6, y + size / 2, size / 3, size / 8);
      ctx.fillRect(x + size / 2, y + size / 2, size / 3, size / 8);
    }
  }
}
