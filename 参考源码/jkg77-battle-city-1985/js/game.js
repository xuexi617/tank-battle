// Battle City Game - Main Game Engine
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.gridSize = 40; // 520/13 = 40px per grid cell
    this.gridWidth = 13;
    this.gridHeight = 13;

    this.gameState = "menu"; // menu, playing, paused, gameOver, stageTransition
    this.playerCount = 1;
    this.currentStage = 1;
    this.maxStages = 10;

    // Stage transition
    this.stageTransitionTimer = 0;
    this.stageTransitionDuration = 1000; // 1 second
    this.nextStageNumber = 1;

    this.players = [];
    this.enemies = [];
    this.bullets = [];
    this.powerups = [];
    this.explosions = [];

    this.enemiesRemaining = 20;
    this.enemiesSpawned = 0;
    this.maxEnemiesOnScreen = 4;

    this.map = null;
    this.audio = new AudioManager();

    this.keys = {};
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showMenu();
    this.gameLoop();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;

      if (e.code === "Escape") {
        this.toggleMenu();
      }
    });

    document.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  showMenu() {
    this.gameState = "menu";
    document.getElementById("menu").style.display = "block";
  }

  hideMenu() {
    document.getElementById("menu").style.display = "none";
  }

  toggleMenu() {
    if (this.gameState === "playing") {
      this.gameState = "paused";
      document.getElementById("resumeBtn").style.display = "block";
      this.showMenu();
    } else if (this.gameState === "paused") {
      this.resumeGame();
    }
  }

  startGame(playerCount) {
    this.playerCount = playerCount;
    this.currentStage = 1;
    this.hideMenu();

    // Start with stage transition for first stage
    this.gameState = "stageTransition";
    this.stageTransitionTimer = 0;
    this.nextStageNumber = 1;
    this.audio.playStageStart();
  }

  resumeGame() {
    this.gameState = "playing";
    this.hideMenu();
  }

  initLevel() {
    // Clear arrays
    this.players = [];
    this.enemies = [];
    this.bullets = [];
    this.powerups = [];
    this.explosions = [];

    // Reset counters
    this.enemiesRemaining = 20;
    this.enemiesSpawned = 0;

    // Create map
    this.map = new GameMap(this.currentStage);

    // Create players
    this.createPlayers();

    // Update UI
    this.updateUI();
  }

  createPlayers() {
    if (this.playerCount === 1) {
      // Single player starts left of the base
      const p1 = new Tank(4, 12, "up", "player", 1);
      this.players.push(p1);
    } else {
      // Player 1 starts left of the base
      const p1 = new Tank(4, 12, "up", "player", 1);
      this.players.push(p1);

      // Player 2 starts right of the base
      const p2 = new Tank(8, 12, "up", "player", 2);
      this.players.push(p2);
    }
  }

  spawnEnemy() {
    if (
      this.enemiesSpawned >= 20 ||
      this.enemies.length >= this.maxEnemiesOnScreen
    ) {
      return;
    }

    // Spawn positions (top of map)
    const spawnPositions = [
      [0, 0],
      [6, 0],
      [12, 0],
    ];
    const pos =
      spawnPositions[Math.floor(Math.random() * spawnPositions.length)];

    // Check if spawn position is clear
    if (this.map.isPositionClear(pos[0], pos[1])) {
      const enemy = new Tank(pos[0], pos[1], "down", "enemy");
      this.enemies.push(enemy);
      this.enemiesSpawned++;
    }
  }

  update(deltaTime) {
    // Handle stage transition
    if (this.gameState === "stageTransition") {
      this.stageTransitionTimer += deltaTime;
      if (this.stageTransitionTimer >= this.stageTransitionDuration) {
        this.gameState = "playing";
        this.initLevel();
      }
      return;
    }

    if (this.gameState !== "playing") return;

    // Spawn enemies periodically
    if (Math.random() < 0.01) {
      // 1% chance per frame
      this.spawnEnemy();
    }

    // Update players
    this.updatePlayers(deltaTime);

    // Update enemies
    this.updateEnemies(deltaTime);

    // Update bullets
    this.updateBullets(deltaTime);

    // Update powerups
    this.updatePowerups(deltaTime);

    // Update explosions
    this.updateExplosions(deltaTime);

    // Check collisions
    this.checkCollisions();

    // Check win/lose conditions
    this.checkGameState();

    this.updateUI();
  }

  updatePlayers(deltaTime) {
    this.players.forEach((player) => {
      if (!player.alive) return;

      // Handle input
      this.handlePlayerInput(player);

      // Update player
      player.update(deltaTime, this.map);
    });
  }

  handlePlayerInput(player) {
    const p = player.playerId;

    // Movement keys
    const moveKeys =
      p === 1
        ? {
            up: "KeyW",
            down: "KeyS",
            left: "KeyA",
            right: "KeyD",
            shoot: "Space",
          }
        : {
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
            shoot: "Enter",
          };

    // Handle movement
    if (this.keys[moveKeys.up]) {
      player.setDirection("up");
    } else if (this.keys[moveKeys.down]) {
      player.setDirection("down");
    } else if (this.keys[moveKeys.left]) {
      player.setDirection("left");
    } else if (this.keys[moveKeys.right]) {
      player.setDirection("right");
    } else {
      // No movement keys pressed - clear desired direction
      player.desiredDirection = null;
    }

    // Handle shooting
    if (this.keys[moveKeys.shoot] && player.canShoot()) {
      const bullet = player.shoot();
      if (bullet) {
        this.bullets.push(bullet);
        this.audio.playShoot();
      }
    }
  }

  updateEnemies(deltaTime) {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;

      // Shooting logic (movement is handled in Tank.updateAI)
      if (Math.random() < 0.01 && enemy.canShoot()) {
        // 1% chance to shoot
        const bullet = enemy.shoot();
        if (bullet) {
          this.bullets.push(bullet);
        }
      }

      enemy.update(deltaTime, this.map);
    });

    // Remove dead enemies
    this.enemies = this.enemies.filter((enemy) => enemy.alive);
  }

  updateBullets(deltaTime) {
    this.bullets.forEach((bullet) => {
      bullet.update(deltaTime, this.map);
    });

    // Remove inactive bullets
    this.bullets = this.bullets.filter((bullet) => bullet.active);
  }

  updatePowerups(deltaTime) {
    this.powerups.forEach((powerup) => {
      powerup.update(deltaTime);
    });

    // Remove expired powerups
    this.powerups = this.powerups.filter((powerup) => !powerup.expired);
  }

  updateExplosions(deltaTime) {
    this.explosions.forEach((explosion) => {
      explosion.update(deltaTime);
    });

    // Remove finished explosions
    this.explosions = this.explosions.filter(
      (explosion) => !explosion.finished
    );
  }

  checkCollisions() {
    // Bullet vs Tank collisions
    this.bullets.forEach((bullet) => {
      if (!bullet.active) return;

      // Check vs players
      this.players.forEach((player) => {
        if (
          player.alive &&
          bullet.owner !== player &&
          this.checkCollision(bullet, player)
        ) {
          player.takeDamage();
          bullet.active = false;
          this.createExplosion(player.x, player.y);
          this.audio.playExplosion();
        }
      });

      // Check vs enemies (only player bullets can damage enemies)
      this.enemies.forEach((enemy) => {
        if (
          enemy.alive &&
          bullet.owner !== enemy &&
          bullet.owner &&
          bullet.owner.type === "player" &&
          this.checkCollision(bullet, enemy)
        ) {
          enemy.takeDamage();
          bullet.active = false;
          this.createExplosion(enemy.x, enemy.y);
          this.audio.playExplosion();

          if (!enemy.alive) {
            this.enemiesRemaining--;
            if (bullet.owner && bullet.owner.type === "player") {
              bullet.owner.score += 100;
            }

            // Chance to drop powerup
            if (Math.random() < 0.3) {
              this.createPowerup(enemy.x, enemy.y);
            }
          }
        }
      });
    });

    // Bullet vs Bullet collisions
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet1 = this.bullets[i];
      if (!bullet1.active) continue;

      for (let j = i + 1; j < this.bullets.length; j++) {
        const bullet2 = this.bullets[j];
        if (!bullet2.active) continue;

        // Only check collision if bullets are from different owners
        if (
          bullet1.owner !== bullet2.owner &&
          this.checkCollision(bullet1, bullet2)
        ) {
          bullet1.active = false;
          bullet2.active = false;
          // Small explosion effect at collision point
          this.createExplosion(bullet1.x, bullet1.y);
          break; // bullet1 is destroyed, no need to check more collisions for it
        }
      }
    }

    // Player vs Powerup collisions
    this.players.forEach((player) => {
      if (!player.alive) return;

      this.powerups.forEach((powerup) => {
        if (this.checkCollision(player, powerup)) {
          powerup.applyEffect(player);
          powerup.expired = true;
          this.audio.playPowerup();
        }
      });
    });
  }

  checkCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  createExplosion(x, y) {
    this.explosions.push({
      x: x,
      y: y,
      frame: 0,
      maxFrames: 10,
      timer: 0,
      frameTime: 100,
      finished: false,
      update: function (deltaTime) {
        this.timer += deltaTime;
        if (this.timer >= this.frameTime) {
          this.frame++;
          this.timer = 0;
          if (this.frame >= this.maxFrames) {
            this.finished = true;
          }
        }
      },
    });
  }

  createPowerup(x, y) {
    const types = ["shield", "fastShot", "extraLife"];
    const type = types[Math.floor(Math.random() * types.length)];
    this.powerups.push(new Powerup(x, y, type));
  }

  checkGameState() {
    // Check if all enemies defeated
    if (this.enemiesRemaining <= 0 && this.enemies.length === 0) {
      this.nextStage();
    }

    // Check if all players dead
    const alivePlayers = this.players.filter((p) => p.alive);
    if (alivePlayers.length === 0) {
      this.gameOver();
    }

    // Check if base is destroyed
    if (this.map.baseDestroyed) {
      this.gameOver();
    }
  }

  nextStage() {
    this.currentStage++;
    if (this.currentStage > this.maxStages) {
      this.gameWin();
    } else {
      // Start stage transition
      this.gameState = "stageTransition";
      this.stageTransitionTimer = 0;
      this.nextStageNumber = this.currentStage;
      this.audio.playStageStart();
    }
  }

  gameOver() {
    this.gameState = "gameOver";
    alert("Game Over!");
    this.showMenu();
  }

  gameWin() {
    this.gameState = "gameWin";
    alert("Congratulations! You completed all stages!");
    this.showMenu();
  }

  updateUI() {
    document.getElementById("stage").textContent = this.currentStage;
    document.getElementById("enemies").textContent = this.enemiesRemaining;

    if (this.players[0]) {
      document.getElementById("p1Score").textContent = this.players[0].score;
    }
    if (this.players[1]) {
      document.getElementById("p2Score").textContent = this.players[1].score;
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === "menu") return;

    // Handle stage transition rendering
    if (this.gameState === "stageTransition") {
      this.renderStageTransition();
      return;
    }

    // Render map
    if (this.map) {
      this.map.render(this.ctx, this.gridSize);
    }

    // Render powerups
    this.powerups.forEach((powerup) => {
      powerup.render(this.ctx, this.gridSize);
    });

    // Render tanks
    this.players.forEach((player) => {
      if (player.alive) {
        player.render(this.ctx, this.gridSize);
      }
    });

    this.enemies.forEach((enemy) => {
      if (enemy.alive) {
        enemy.render(this.ctx, this.gridSize);
      }
    });

    // Render bullets
    this.bullets.forEach((bullet) => {
      if (bullet.active) {
        bullet.render(this.ctx, this.gridSize);
      }
    });

    // Render explosions
    this.explosions.forEach((explosion) => {
      this.renderExplosion(explosion);
    });
  }

  renderExplosion(explosion) {
    const size = this.gridSize;
    const alpha = 1 - explosion.frame / explosion.maxFrames;

    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = explosion.frame % 2 === 0 ? "#ff0" : "#f80";
    this.ctx.fillRect(explosion.x, explosion.y, size, size);
    this.ctx.restore();
  }

  renderStageTransition() {
    // Render the map and remaining elements from previous stage
    if (this.map) {
      this.map.render(this.ctx, this.gridSize);
    }

    // Render players
    this.players.forEach((player) => {
      if (player.alive) {
        player.render(this.ctx, this.gridSize);
      }
    });

    // Render stage transition overlay
    this.ctx.save();

    // Semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stage notification text
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 32px 'Courier New', monospace";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Blinking effect
    const alpha =
      0.5 + 0.5 * Math.sin((this.stageTransitionTimer / 200) * Math.PI);
    this.ctx.globalAlpha = alpha;

    this.ctx.fillText(`STAGE ${this.nextStageNumber}`, centerX, centerY - 20);
    this.ctx.font = "16px 'Courier New', monospace";
    this.ctx.fillText("GET READY!", centerX, centerY + 20);

    this.ctx.restore();
  }

  gameLoop(currentTime = 0) {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame((time) => this.gameLoop(time));
  }
}

// Global functions for menu buttons
function startGame(playerCount) {
  if (window.game) {
    window.game.startGame(playerCount);
  }
}

function resumeGame() {
  if (window.game) {
    window.game.resumeGame();
  }
}

// Initialize game when page loads
window.addEventListener("load", () => {
  window.game = new Game();
});
