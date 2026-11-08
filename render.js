/* ==================== 画布渲染 ==================== */
const cv = document.getElementById('canvas');
const ctx = cv.getContext('2d');
const coordDisplay = document.getElementById('coordDisplay');

// 坐标追踪
cv.addEventListener('pointermove', e => {
  const rect = cv.getBoundingClientRect();
  const mx = Math.round((e.clientX - rect.left) / rect.width * State.zoneW);
  const my = Math.round((e.clientY - rect.top) / rect.height * State.zoneH);
  coordDisplay.textContent = `X: ${mx} Y: ${my}`;
});

// 缩放画布，保持比例
function resizeCanvas(){
  const w = document.getElementById('canvasArea');
  if(!w) return;
  const maxW = w.clientWidth - 32;
  const maxH = w.clientHeight - 32;
  const ratio = State.zoneW / State.zoneH;
  let cw = maxW, ch = cw / ratio;
  if(ch > maxH) { ch = maxH; cw = ch * ratio; }
  cv.width = Math.round(cw);
  cv.height = Math.round(ch);
  cv.style.width = Math.round(cw) + 'px';
  cv.style.height = Math.round(ch) + 'px';
}

// 绘制画布
function drawCanvas(){
  const w = cv.width, h = cv.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0a0a'; 
  ctx.fillRect(0, 0, w, h);
  
  // 背景网格
  ctx.strokeStyle = '#1a1a1a'; 
  ctx.lineWidth = 1;
  for(let i=1; i<10; i++) {
    ctx.beginPath(); ctx.moveTo(i/10*w, 0); ctx.lineTo(i/10*w, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i/10*h); ctx.lineTo(w, i/10*h); ctx.stroke();
  }

  // 战斗框
  const f = State.scriptZone;
  ctx.strokeStyle = '#fff'; 
  ctx.lineWidth = 2;
  ctx.strokeRect(f.l/State.zoneW*w, f.t/State.zoneH*h, (f.r-f.l)/State.zoneW*w, (f.b-f.t)/State.zoneH*h);

  // 红心
  const hx = State.heartX/State.zoneW*w;
  const hy = State.heartY/State.zoneH*h;
  ctx.fillStyle = '#f00'; 
  ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#ff8899'; 
  ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI*2); ctx.stroke();

  // 弹幕指令绘制
  State.commands.forEach((c, i) => {
    const isSel = (i === State.selectedIndex);
    ctx.lineWidth = isSel ? 4 : 2;
    let color = isSel ? '#ffcc44' : colorOf(num(c.args.col));
    ctx.strokeStyle = color;
    
    const sx = v => num(v)/State.zoneW*w;
    const sy = v => num(v)/State.zoneH*h;

    switch(c.fn){
      case 'BoneV':
        ctx.beginPath(); ctx.moveTo(sx(c.args.x), sy(c.args.y)); ctx.lineTo(sx(c.args.x), sy(c.args.y) + num(c.args.len)/State.zoneH*h); ctx.stroke();
        break;
      case 'BoneH':
        ctx.beginPath(); ctx.moveTo(sx(c.args.x), sy(c.args.y)); ctx.lineTo(sx(c.args.x) + num(c.args.len)/State.zoneW*w, sy(c.args.y)); ctx.stroke();
        break;
      case 'BoneHRepeat': {
        const cnt = num(c.args.cnt), gap = num(c.args.gap);
        for(let j=0; j<cnt; j++){
          const yy = sy(num(c.args.y) + j*gap);
          ctx.beginPath(); ctx.moveTo(sx(c.args.x), yy); ctx.lineTo(sx(c.args.x) + num(c.args.len)/State.zoneW*w, yy); ctx.stroke();
        }
        break;
      }
      case 'BoneVRepeat': {
        const cnt = num(c.args.cnt), gap = num(c.args.gap);
        for(let j=0; j<cnt; j++){
          const xx = sx(num(c.args.x) + j*gap);
          ctx.beginPath(); ctx.moveTo(xx, sy(c.args.y)); ctx.lineTo(xx, sy(c.args.y) + num(c.args.len)/State.zoneH*h); ctx.stroke();
        }
        break;
      }
      case 'GasterBlaster': {
        const size = 40 + num(c.args.size)*15;
        ctx.save();
        const ang = Math.atan2(c.args.ey - c.args.sy, c.args.ex - c.args.sx);
        ctx.translate(sx(c.args.sx), sy(c.args.sy));
        ctx.rotate(ang);
        ctx.fillStyle = 'rgba(102,221,255,0.15)';
        ctx.fillRect(-size/2, -size/3, size, size*0.8);
        ctx.strokeRect(-size/2, -size/3, size, size*0.8);
        // 射击瞄准线
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.hypot(c.args.ex - c.args.sx, c.args.ey - c.args.sy)/State.zoneW*w, 0); ctx.stroke();
        ctx.restore();
        break;
      }
      case 'HeartTeleport':
        ctx.beginPath(); ctx.arc(sx(c.args.x), sy(c.args.y), 12, 0, Math.PI*2); ctx.stroke();
        break;
      case 'CombatZoneResize':
      case 'CombatZoneResizeInstant':
        ctx.lineWidth = 1; 
        ctx.setLineDash([5, 5]); 
        ctx.strokeStyle = '#ff8844';
        ctx.strokeRect(sx(c.args.l), sy(c.args.t), num(c.args.r - c.args.l)/State.zoneW*w, num(c.args.b - c.args.t)/State.zoneH*h);
        ctx.setLineDash([]);
        break;
    }
  });
}

/* ==================== 鼠标交互：点击、拖拽 ==================== */
function hitTest(mx, my){
  const w = cv.width, h = cv.height;
  for(let i = State.commands.length - 1; i >= 0; i--){
    const c = State.commands[i], a = c.args;
    const sx = v => num(v)/State.zoneW*w;
    const sy = v => num(v)/State.zoneH*h;
    if(c.fn === 'BoneV' && mx >= sx(a.x)-10 && mx <= sx(a.x)+10 && my >= sy(a.y)-10 && my <= sy(a.y)+num(a.len)/State.zoneH*h+10) return i;
    if(c.fn === 'BoneH' && mx >= sx(a.x)-10 && mx <= sx(a.x)+num(a.len)/State.zoneW*w+10 && my >= sy(a.y)-10 && my <= sy(a.y)+10) return i;
    if(c.fn === 'HeartTeleport' && Math.hypot(mx - sx(a.x), my - sy(a.y)) < 20) return i;
    if(c.fn === 'GasterBlaster' && Math.hypot(mx - sx(a.sx), my - sy(a.sy)) < 30) return i;
  }
  return -1;
}

cv.addEventListener('pointerdown', e => {
  const rect = cv.getBoundingClientRect();
  const mx = (e.clientX - rect.left) / rect.width * cv.width;
  const my = (e.clientY - rect.top) / rect.height * cv.height;
  const idx = hitTest(mx, my);
  if(idx >= 0){
    pushUndo();
    State.selectedIndex = idx;
    State.drag = {
      type: 'move',
      index: idx,
      startX: e.clientX,
      startY: e.clientY,
      origArgs: JSON.parse(JSON.stringify(State.commands[idx].args))
    };
    cv.setPointerCapture(e.pointerId);
    renderAll();
  } else {
    State.selectedIndex = -1;
    renderAll();
  }
});

cv.addEventListener('pointermove', e => {
  if(!State.drag || State.drag.type !== 'move') return;
  const rect = cv.getBoundingClientRect();
  const dx = (e.clientX - State.drag.startX) / rect.width * State.zoneW;
  const dy = (e.clientY - State.drag.startY) / rect.height * State.zoneH;
  const cmd = State.commands[State.drag.index];
  const orig = State.drag.origArgs;
  if(!cmd) return;
  
  if(cmd.fn.includes('Bone') || cmd.fn === 'HeartTeleport' || cmd.fn === 'Platform'){
    if(cmd.args.x !== undefined) cmd.args.x = Math.round(num(orig.x) + dx);
    if(cmd.args.y !== undefined) cmd.args.y = Math.round(num(orig.y) + dy);
  } else if(cmd.fn === 'GasterBlaster'){
    if(cmd.args.sx !== undefined) cmd.args.sx = Math.round(num(orig.sx) + dx);
    if(cmd.args.sy !== undefined) cmd.args.sy = Math.round(num(orig.sy) + dy);
    if(cmd.args.ex !== undefined) cmd.args.ex = Math.round(num(orig.ex) + dx);
    if(cmd.args.ey !== undefined) cmd.args.ey = Math.round(num(orig.ey) + dy);
  }
  drawCanvas();
});

cv.addEventListener('pointerup', e => {
  if(State.drag && State.drag.type === 'move'){
    const rect = cv.getBoundingClientRect();
    const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
    const moved = Math.abs(e.clientX - State.drag.startX) + Math.abs(e.clientY - State.drag.startY) > 4;
    
    if(outside){
      State.commands.splice(State.drag.index, 1);
      State.selectedIndex = -1;
      setStatus('已删除（拖出画布）');
    } else if(!moved){
      const pi = State.drag.index;
      State.drag = null;
      if (typeof openParamModal === 'function') openParamModal(pi);
      return;
    }
    State.drag = null;
    renderAll();
  }
});

window.addEventListener('resize', () => { resizeCanvas(); drawCanvas(); });