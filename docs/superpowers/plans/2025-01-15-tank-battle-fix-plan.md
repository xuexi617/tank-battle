# 坦克大战 Bug 修复 实施计划

> **Goal:** 修复 5 个致命/严重 Bug，使游戏可在浏览器中直接打开并完整游玩

**Architecture:** 单页 HTML + 内联 JS（Canvas 2D），所有改动集中在 `src/main.js` 和 `index.html`

**Tech Stack:** 原生 JavaScript, Canvas 2D, HTML5

---

### Task 1: 修复坦克炮管方向双重旋转

**Files:**
- Modify: `src/main.js` — `makeTankSprite` 和 `drawTank` 函数

- [ ] **Step 1: 修改 makeTankSprite — 始终画炮管朝上**

将 `makeTankSprite` 的 `dir` 参数逻辑改为固定 `dir=0`（炮管朝上），缓存键改为仅按 `tp` 区分：

```javascript
function makeTankSprite(tp){
  const key=`${tp}`;
  if(_cache[key])return _cache[key];
  const cvs=document.createElement('canvas');
  cvs.width=16; cvs.height=16;
  const g=cvs.getContext('2d');
  g.imageSmoothingEnabled=false;
  // body
  if(tp===2){g.fillStyle='#7f8c8d'; g.fillRect(1,3,14,10); g.fillStyle='#4a5555'; g.fillRect(0,2,3,12); g.fillRect(13,2,3,12);}
  else if(tp===1){g.fillStyle='#e67e22'; g.fillRect(1,3,14,10); g.fillStyle='#a8590a'; g.fillRect(0,2,3,12); g.fillRect(13,2,3,12);}
  else {g.fillStyle='#c0392b'; g.fillRect(1,3,14,10); g.fillStyle='#7a1f1a'; g.fillRect(0,2,3,12); g.fillRect(13,2,3,12);}
  // turret center
  g.fillStyle='#fff'; g.fillRect(7,6,2,4);
  // muzzle always up (dir=0)
  g.fillStyle='#222'; g.fillRect(7,0,2,5);
  _cache[key]=cvs;
  return cvs;
}
```

- [ ] **Step 2: 修改 drawTank — 去掉 dir 传给 makeTankSprite**

```javascript
function drawTank(x,y,dir,tp,flash){
  if(flash&& (G.fr>>2)%2===0){ X.fillStyle='rgba(255,255,255,.12)'; X.fillRect(x,y,16,16);}
  const sprite = makeTankSprite(tp);
  if(!sprite)return;
  if(dir===0){ X.drawImage(sprite,x,y); }
  else if(dir===1){
    X.save(); X.translate(x+8,y+8); X.rotate(Math.PI/2); X.drawImage(sprite,-8,-8); X.restore();
  } else if(dir===2){
    X.save(); X.translate(x+8,y+8); X.rotate(Math.PI); X.drawImage(sprite,-8,-8); X.restore();
  } else {
    X.save(); X.translate(x+8,y+8); X.rotate(-Math.PI/2); X.drawImage(sprite,-8,-8); X.restore();
  }
}
```

- [ ] **Step 3: 构建验证**

Run: `npm --prefix "D:/AI/AI产物/tank-battle" run build`
Expected: 构建成功，无报错

---

### Task 2: 修复中间出生点被墙堵死

**Files:**
- Modify: `src/main.js` — `mkMp` 函数

- [ ] **Step 1: 在清空列表中加入中间出生点**

```javascript
// 原清空列表
[[0,0],[0,CO-3],[RO-3,0],[RO-3,CO-3]].forEach(...)
// 改为
[[0,0],[0,12],[0,CO-3],[RO-3,0],[RO-3,CO-3]].forEach(...)
```

`[0,12]` 清空第 0-2 行、第 12-14 列（覆盖中间出生点 `x=192, y=16` = 格 12,1）

- [ ] **Step 2: 构建验证**

Run: `npm --prefix "D:/AI/AI产物/tank-battle" run build`
Expected: 构建成功

---

### Task 3: 修复钢墙被任意子弹摧毁

**Files:**
- Modify: `src/main.js` — `up` 函数中的子弹碰撞逻辑

- [ ] **Step 1: 修改碰撞条件**

```javascript
// 原代码
if(t.tp<3){t.a=false;fx(...)}

// 改为
if(t.tp===1){t.a=false;fx(...)}
```

钢墙 (tp=2) 不再被子弹摧毁。

- [ ] **Step 2: 构建验证**

Run: `npm --prefix "D:/AI/AI产物/tank-battle" run build`

---

### Task 4: 修复坦克移动卡顿

**Files:**
- Modify: `src/main.js` — `mTank` 函数

- [ ] **Step 1: 修改 mTank 移动逻辑**

改变检查顺序：先对齐，对齐失败则回退到原始位置：

```javascript
function mTank(t,dir){
  t.d=dir;
  let nx=t.x, ny=t.y;
  if(dir===U)ny-=t.sp;
  else if(dir===D)ny+=t.sp;
  else if(dir===L)nx-=t.sp;
  else nx+=t.sp;

  // 偶数对齐
  if(dir===U||dir===D)nx=Math.round(nx/2)*2;
  else ny=Math.round(ny/2)*2;

  // 尝试16px对齐
  let snx=nx, sny=ny;
  if(dir===U||dir===D){
    let a=Math.abs(nx%16);
    if(a<3)snx=Math.floor(nx/16)*16;
    else if(a>13)snx=Math.ceil(nx/16)*16;
  } else {
    let a=Math.abs(ny%16);
    if(a<3)sny=Math.floor(ny/16)*16;
    else if(a>13)sny=Math.ceil(ny/16)*16;
  }

  // 优先用对齐位置，不行用原始位置
  if(canM(snx,sny,t)){t.x=snx;t.y=sny;}
  else if(canM(nx,ny,t)){t.x=nx;t.y=ny;}
}
```

- [ ] **Step 2: 构建验证**

---

### Task 5: 修复 index.html 中文乱码

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 重写所有中文文本为正确 UTF-8**

将标题 `<title>鍧﹀厠澶ф垬 - Battle City</title>` 改为 `<title>坦克大战 - Battle City</title>`

将 overlay 中的 `鍧﹀厠澶ф垬` 改为 `★ 坦克大战`，`鏂瑰悜閿?绉诲姩` 改为 `方向键 移动`，`寮€ 濮?娓?鎴?` 改为 `开 始 游 戏` 等。

- [ ] **Step 2: 构建验证**

---

### Task 6: 最终验证

- [ ] **Step 1: 重新构建**

Run: `npm --prefix "D:/AI/AI产物/tank-battle" run build`

- [ ] **Step 2: 验证 dist/bundle.js 存在且不为空**
- [ ] **Step 3: Git 提交所有改动**
