let stopSprite;
let walkSprite;
let jumpSprite;
let pushSprite;
let toolSprite;
let stopSprite2;
let stopSprite3;
let touchSprite3;
let smileSprite2;
let fallSprite2;
let spriteSheet;
let totalFrames = 8;
let currentFrame = 0;
let frameWidth;
let frameHeight;
let playerX;
let playerY;
let stop2X;
let stop2Y;
let stop3X;
let stop3Y;
let isFlipped = false;
let isJumping = false;
let jumpStartY;
let isPushing = false;
let projectiles = [];
let inputBox;
let char2Text = '需要我解答嗎?';
let isChar2Falling = false;
let char2FallFrame = 0;

function preload() {
  spriteSheet = loadImage('1/stop/stop_1.png');
  stopSprite = loadImage('1/stop/stop_1.png');
  walkSprite = loadImage('1/walk/walk_1.png');
  jumpSprite = loadImage('1/jump/jump_1.png');
  pushSprite = loadImage('1/push/push_1.png');
  toolSprite = loadImage('1/tool/tool_1.png');
  stopSprite2 = loadImage('2/stop/stop_2.png');
  smileSprite2 = loadImage('2/smile/smile_2.png');
  fallSprite2 = loadImage('2/fall_down/fall_down_2.png');
  stopSprite3 = loadImage('3/stop/stop_3.png');
  touchSprite3 = loadImage('3/touch/touch_3.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 根據說明，檔案寬高為 699*190，內有 8 張圖片
  // 計算單張圖片的寬度
  frameWidth = 699 / totalFrames;
  frameHeight = 190;
  playerX = width / 2;
  playerY = height / 2;
  stop2X = playerX - 120;
  stop2Y = playerY;
  stop3X = playerX + 120;
  stop3Y = playerY;

  inputBox = createInput();
  inputBox.hide();
  inputBox.changed(() => { char2Text = inputBox.value() + ', 歡迎你'; });
}

function draw() {
  background('#eef4ed');

  // 處理投射物 (新的角色)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed * p.dir;

    // 判斷是否擊中角色2 (stop2X, stop2Y)
    if (!isChar2Falling && dist(p.x, p.y, stop2X, stop2Y) < 60) {
      isChar2Falling = true;
      char2FallFrame = 0;
      projectiles.splice(i, 1); // 移除投射物
      continue;
    }

    // 投射物動畫
    if (frameCount % 5 === 0) {
      p.frame = (p.frame + 1) % 4;
    }

    let toolW = 331 / 4;
    let toolH = 75;
    let sx = p.frame * toolW;

    push();
    translate(p.x, p.y);
    if (p.dir === -1) {
      scale(-1, 1);
    }
    image(toolSprite, -toolW / 2, -toolH / 2, toolW, toolH, sx, 0, toolW, toolH);
    pop();

    // 移除超出畫面的投射物
    if (p.x < -width || p.x > width * 2) {
      projectiles.splice(i, 1);
    }
  }

  // 處理移動與動作狀態
  if (isPushing) {
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23; // 圖片精靈檔案，內有23張圖片，寬高為5101*191
    frameHeight = 191;
  } else if (isJumping) {
    // 跳躍狀態下鎖定圖片與寬高
    spriteSheet = jumpSprite;
    frameWidth = 3054 / 19; // 圖片精靈檔案，內有19張圖片，寬高為3054*214
    frameHeight = 214;
  } else if (keyIsDown(UP_ARROW)) {
    isJumping = true;
    jumpStartY = playerY;
    currentFrame = 0;
    spriteSheet = jumpSprite;
  } else if (keyIsDown(DOWN_ARROW)) { // 下鍵
    isPushing = true;
    currentFrame = 0;
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23;
    frameHeight = 191;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5;
    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = false;
  } else if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5;
    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = true;
  } else {
    spriteSheet = stopSprite;
    frameWidth = 699 / totalFrames;
    frameHeight = 190;
  }

  // 設定動畫速度 (每 5 個 frame 更新一次動作)
  if (frameCount % 5 === 0) {
    if (isPushing) {
      currentFrame++;
      // 當23圖片播放完畢後
      if (currentFrame >= 23) {
        isPushing = false;
        currentFrame = 0;
        // 產生一個新的角色 (投射物)
        projectiles.push({
          x: playerX,
          y: playerY,
          dir: isFlipped ? -1 : 1,
          speed: 10,
          frame: 0
        });
      }
    } else if (isJumping) {
      currentFrame++;
      // 跳躍位移邏輯：前 8 格往上，之後往下 (回到原點)
      if (currentFrame <= 8) {
        playerY -= 20;
      } else if (currentFrame <= 16) {
        playerY += 20;
      }

      // 動畫播放完畢 (19張)
      if (currentFrame >= 19) {
        isJumping = false;
        playerY = jumpStartY; // 強制回到地面
        currentFrame = 0;
      }
    } else {
      currentFrame = (currentFrame + 1) % totalFrames;
    }
  }

  // 繪製左側的新角色 (stop_2)
  // 檔案寬高 275*60，5張圖 -> 單張 55*60
  let stop2W = 275 / 5;
  let stop2H = 60;
  let stop2Frame = Math.floor(frameCount / 5) % 5;
  let currentStop2Sprite = stopSprite2;

  if (isChar2Falling) {
    currentStop2Sprite = fallSprite2;
    stop2W = 211 / 4;
    stop2H = 54;
    
    if (frameCount % 5 === 0) {
      if (char2FallFrame < 3) {
        char2FallFrame++;
      }
    }
    stop2Frame = char2FallFrame;
    
    // 當動畫播放完畢且角色1靠近時，才恢復
    if (char2FallFrame >= 3 && dist(playerX, playerY, stop2X, stop2Y) < 200) {
      isChar2Falling = false;
      char2FallFrame = 0;
    }
    inputBox.hide();
  } else if (dist(playerX, playerY, stop2X, stop2Y) < 200) {
    currentStop2Sprite = smileSprite2;
    inputBox.show();
    inputBox.position(playerX - 60, playerY - 150);

    push();
    textSize(20);
    let tWidth = textWidth(char2Text);
    fill('#caf0f8');
    rectMode(CENTER);
    rect(stop2X, stop2Y - 66, tWidth + 20, 40, 5);
    fill(0);
    textAlign(CENTER);
    text(char2Text, stop2X, stop2Y - 60);
    pop();
  } else {
    inputBox.hide();
  }

  push();
  translate(stop2X, stop2Y); // 位於角色左方
  image(currentStop2Sprite, -50, -50, 100, 100, stop2Frame * stop2W, 0, stop2W, stop2H);
  pop();

  // 繪製右側的新角色 (stop_3)
  // 預設使用 stop_3 (123*38, 4張)
  let currentStop3Sprite = stopSprite3;
  let stop3TotalFrames = 4;
  let stop3SheetW = 123;
  let stop3SheetH = 38;

  // 判斷距離，如果接近 (距離 < 200) 則切換為 touch_3 (91*38, 3張)
  if (dist(playerX, playerY, stop3X, stop3Y) < 200) {
    currentStop3Sprite = touchSprite3;
    stop3TotalFrames = 3;
    stop3SheetW = 91;
    stop3SheetH = 38;
  }

  let stop3W = stop3SheetW / stop3TotalFrames;
  let stop3H = stop3SheetH;
  let stop3Frame = Math.floor(frameCount / 5) % stop3TotalFrames;

  push();
  translate(stop3X, stop3Y); // 位於角色右方
  if (playerX < stop3X) {
    // 角色1在角色3左邊
    if (currentStop3Sprite === touchSprite3) {
      scale(-3, 3); // touch_3 左右反向顯示
    } else {
      scale(3, 3); // stop_3 左右相同顯示
    }
  } else {
    // 角色1在角色3右邊
    if (currentStop3Sprite === touchSprite3) {
      scale(3, 3);
    } else {
      scale(-3, 3); // stop_3 左右相反顯示
    }
  }
  image(currentStop3Sprite, -stop3W / 2, -stop3H / 2, stop3W, stop3H, stop3Frame * stop3W, 0, stop3W, stop3H);
  pop();

  // 計算精靈圖的來源 X 座標與畫布上的中心位置
  let sx = currentFrame * frameWidth;
  let x = (width - frameWidth) / 2;
  let y = (height - frameHeight) / 2;

  push();
  translate(playerX, playerY);
  if (isFlipped) {
    scale(-1, 1);
  }
  // 由於使用了 translate，這裡的座標設為圖片中心點的負偏移量
  image(spriteSheet, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight, sx, 0, frameWidth, frameHeight);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
