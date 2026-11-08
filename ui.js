function t(key) { return LANG[currentLang][key] || key; }
function tCmd(fn) { return (LANG[currentLang].cmds[fn] && LANG[currentLang].cmds[fn].label) ? LANG[currentLang].cmds[fn].label : (CMD_DEFS[fn] ? CMD_DEFS[fn].label : fn); }

function openParamModal(i){
  const cmd = State.commands[i]; if(!cmd) return;
  const def = CMD_DEFS[cmd.fn]; if(!def) return;
  State.modalIdx = i;
  State.origCmd = JSON.parse(JSON.stringify(cmd));
  
  const trans = LANG[currentLang].cmds[cmd.fn];
  const titleText = trans ? trans.label : def.label;
  document.getElementById('paramTitle').textContent = titleText + ' ' + (currentLang === 'zh' ? '参数' : 'Parameters');
  
  let html = `<div class="param-row"><div class="param-label">${currentLang === 'zh' ? '延迟(秒)' : 'Delay(s)'}</div>
    <input type="range" class="param-slider" data-k="__delay__" min="0" max="5" step="0.1" value="${num(cmd.delay)}">
    <div class="param-value" data-v="__delay__">${num(cmd.delay).toFixed(1)}</div></div>`;
  
  def.params.forEach(p => {
    const v = cmd.args[p.k];
    const pName = trans && trans.p[p.k] ? trans.p[p.k] : p.t;
    html += `<div class="param-row"><div class="param-label">${pName}</div>`;
    if(p.opts){
      html += `<select class="param-select" data-k="${p.k}">`;
      p.opts.forEach((o, idx) => { 
        let optText = o.t; 
        if (trans && trans.opts && trans.opts[p.k]) optText = trans.opts[p.k][idx] || o.t; 
        html += `<option value="${o.v}"${String(o.v)===String(v)?' selected':''}>${optText}</option>`; 
      });
      html += '</select>';
    } else if(p.text){
      html += `<input type="text" class="param-text" data-k="${p.k}" value="${v||''}">`;
    } else {
      html += `<input type="range" class="param-slider" data-k="${p.k}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v!==undefined?v:p.min}"><div class="param-value" data-v="${p.k}">${v!==undefined?v:p.min}</div>`;
    }
    html += '</div>';
  });
  
  document.getElementById('paramBody').innerHTML = html;
  document.getElementById('paramMask').classList.add('show');
  
  document.querySelectorAll('#paramBody [data-k]').forEach(el => {
    const k = el.dataset.k;
    el.oninput = el.onchange = () => {
      let v = el.value;
      if(el.type === 'range') v = parseFloat(v);
      if(k === '__delay__'){
        cmd.delay = v;
        const valEl = document.querySelector('#paramBody [data-v="__delay__"]');
        if(valEl) valEl.textContent = v.toFixed(1);
      } else {
        cmd.args[k] = v;
        const valEl = document.querySelector(`#paramBody [data-v="${k}"]`);
        if(valEl) valEl.textContent = v;
      }
      drawCanvas(); renderTimeline();
    };
  });
}

function closeParamModal(){
  document.getElementById('paramMask').classList.remove('show');
  State.modalIdx = -1;
  State.origCmd = null;
}

document.getElementById('paramOk').onclick = () => { closeParamModal(); drawCanvas(); renderTimeline(); setStatus(currentLang === 'zh' ? '参数已更新' : 'Parameters updated'); };
document.getElementById('paramCancel').onclick = () => {
  if(State.modalIdx >= 0 && State.origCmd) State.commands[State.modalIdx] = State.origCmd;
  closeParamModal(); drawCanvas(); renderTimeline(); setStatus(currentLang === 'zh' ? '已取消' : 'Cancelled');
};
document.getElementById('paramClose').onclick = () => document.getElementById('paramCancel').click();
document.getElementById('paramMask').onclick = e => { if(e.target.id === 'paramMask') document.getElementById('paramCancel').click(); };
document.getElementById('paramDelete').onclick = () => {
  if(State.modalIdx < 0) return;
  pushUndo();
  State.commands.splice(State.modalIdx, 1);
  State.selectedIndex = -1;
  closeParamModal();
  renderAll(); setStatus(currentLang === 'zh' ? '已删除' : 'Deleted');
};

function createAt(fn, x, y){
  const def = CMD_DEFS[fn]; if(!def) return;
  pushUndo();
  const args = {};
  def.params.forEach(p => {
    if (p.k === 'x' || p.k === 'sx') args[p.k] = x;
    else if (p.k === 'y' || p.k === 'sy') args[p.k] = y;
    else if (p.k === 'ex') args[p.k] = x + 100;
    else if (p.k === 'ey') args[p.k] = y + 100;
    else if (p.min !== undefined) args[p.k] = p.min;
    else if (p.opts) args[p.k] = p.opts[0].v;
    else args[p.k] = '';
  });
  State.commands.push({ fn: fn, args, delay: 0 });
  const rule = AUTO_SOUND[fn];
  if(rule && rule.cond(args)) State.commands.push({ fn: 'Sound', args: {name: rule.sound, spd: 0}, delay: 0 });
  State.selectedIndex = State.commands.length - 1;
  renderAll();
  setStatus((currentLang === 'zh' ? '已创建 ' : 'Created ') + tCmd(fn));
}

function buildBottomTools(){
  const wrap = document.getElementById('bottomTools');
  const tools = [['BoneH','骨头H'],['BoneV','骨头V'],['BoneHRepeat','横阵列'],['BoneVRepeat','竖阵列'],['BoneStab','骨墙'],['GasterBlaster','龙骨炮'],['HeartMode','灵魂'],['HeartTeleport','瞬移'],['SansHead','Sans头'],['SansBody','Sans身'],['SansSlam','重力'],['Sound','音效'],['BlackScreen','黑屏'],['Platform','平台']];
  wrap.innerHTML = tools.map(([k,t]) => `<div class="tool-btn" data-tool="${k}"><span class="tn">${tCmd(k)}</span><span class="tc">${k}</span></div>`).join('');
  
  wrap.querySelectorAll('.tool-btn').forEach(el => {
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      State.dragTool = el.dataset.tool;
      const ghost = document.getElementById('dragGhost');
      ghost.textContent = tCmd(el.dataset.tool);
      ghost.classList.add('show');
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
      document.addEventListener('pointermove', onDragMove);
      document.addEventListener('pointerup', onDragEnd, {once:true});
    });
  });
}

function onDragMove(e){
  if(!State.dragTool) return;
  const ghost = document.getElementById('dragGhost');
  ghost.style.left = e.clientX + 'px';
  ghost.style.top = e.clientY + 'px';
}

function onDragEnd(e){
  document.removeEventListener('pointermove', onDragMove);
  if(!State.dragTool) return;
  document.getElementById('dragGhost').classList.remove('show');
  const rect = cv.getBoundingClientRect();
  if(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom){
    const x = Math.round((e.clientX - rect.left) / rect.width * State.zoneW);
    const y = Math.round((e.clientY - rect.top) / rect.height * State.zoneH);
    createAt(State.dragTool, x, y);
  }
  State.dragTool = null;
}

function renderTimeline(){
  const track = document.getElementById('timelineTrack');
  track.innerHTML = '';
  let total = 0;
  State.commands.forEach(c => total += num(c.delay));
  total = Math.max(total, 3);
  const pxPerSec = 60;
  track.style.width = (total * pxPerSec + 100) + 'px';
  let acc = 0;
  State.commands.forEach((cmd, i) => {
    acc += num(cmd.delay);
    const left = acc * pxPerSec;
    const label = tCmd(cmd.fn);
    const block = document.createElement('div');
    block.className = 'tl-block' + (i === State.selectedIndex ? ' selected' : '') + (cmd.fn==='Sound'?' sound':'');
    block.style.left = left + 'px';
    block.style.width = Math.max(50, label.length * 14) + 'px';
    block.textContent = label;
    block.onclick = e => {
      e.stopPropagation();
      State.selectedIndex = i;
      drawCanvas(); openParamModal(i);
    };
    track.appendChild(block);
  });
}

function openAddMenu(){
  let html = '';
  CMD_GROUPS.forEach(g => {
    const groupName = currentLang === 'zh' ? g.g : ({'骨头':'Bones', '龙骨炮':'Blaster', '灵魂':'Heart', '战斗框':'Zone', 'Sans':'Sans', '其他':'Other'}[g.g] || g.g);
    html += `<div style="margin-bottom:14px"><div style="font-size:12px;color:#888;letter-spacing:2px;margin-bottom:6px">${groupName}</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px">`;
    g.cmds.forEach(fn => {
      const def = CMD_DEFS[fn]; if(!def) return;
      html += `<div class="add-cmd-btn" data-fn="${fn}" style="padding:12px;background:#1c1c1c;border:2px solid #2a2a2a;border-radius:8px;cursor:pointer;transition:all .12s">
        <div style="font-size:15px;font-weight:600;color:#4a6cf7">${tCmd(fn)}</div>
        <div style="font-size:11px;color:#888;margin-top:3px">${fn}</div>
      </div>`;
    });
    html += '</div></div>';
  });
  document.getElementById('addBody').innerHTML = html;
  document.getElementById('addMask').classList.add('show');
  document.querySelectorAll('.add-cmd-btn').forEach(el => {
    el.onmouseenter = () => { el.style.background='#252525'; el.style.borderColor='#4a6cf7'; };
    el.onmouseleave = () => { el.style.background='#1c1c1c'; el.style.borderColor='#2a2a2a'; };
    el.onclick = () => {
      const fn = el.dataset.fn;
      document.getElementById('addMask').classList.remove('show');
      createAt(fn, Math.round(State.zoneW/2), Math.round(State.zoneH/2));
    };
  });
}

function buildCSV(){
  if(State.commands.length === 0) return '';
  let lines = ['0,CombatZoneResize,133,251,508,391,TLResume'];
  let time = 0;
  State.commands.forEach(cmd => {
    time += num(cmd.delay);
    const def = CMD_DEFS[cmd.fn];
    const parts = [time, cmd.fn];
    if(def && def.params.length) def.params.forEach(p => parts.push(cmd.args[p.k] !== undefined ? cmd.args[p.k] : 0));
    lines.push(parts.join(','));
  });
  if(!State.commands.some(c => c.fn === 'EndAttack')) lines.push((time + 3) + ',EndAttack');
  return lines.join('\n');
}

function saveCSV(){
  const csv = buildCSV();
  if(!csv){ setStatus(currentLang === 'zh' ? '没有指令' : 'No commands'); return; }
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'custom_attack.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  setStatus(currentLang === 'zh' ? '已导出 CSV' : 'Exported CSV');
}

function importCSV(){
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.csv';
  input.onchange = e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const lines = ev.target.result.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      let prevTime = 0; const imported = [];
      lines.forEach(line => {
        const cols = line.split(',').map(s => s.trim()); if(cols.length < 2) return;
        const time = parseFloat(cols[0]), fn = cols[1];
        if(isNaN(time) || !CMD_DEFS[fn]) return;
        const def = CMD_DEFS[fn];
        const args = {}; def.params.forEach((p,i) => { args[p.k] = cols[i+2] !== undefined ? cols[i+2] : 0; });
        let d = time - prevTime; if(d < 0) d = 0;
        imported.push({fn: fn, args, delay: d});
        prevTime = time;
      });
      pushUndo();
      State.commands = imported; State.selectedIndex = -1;
      renderAll(); setStatus((currentLang === 'zh' ? '已导入 ' : 'Imported ') + imported.length + (currentLang === 'zh' ? ' 条指令' : ' commands'));
    };
    r.readAsText(f);
  };
  input.click();
}

document.getElementById('btnSave').onclick = saveCSV;
document.getElementById('btnImport').onclick = importCSV;
document.getElementById('btnUndo').onclick = undo;
document.getElementById('btnClear').onclick = () => {
  if(State.commands.length === 0) return;
  if(confirm(currentLang === 'zh' ? '确定清空？' : 'Clear all?')){
    pushUndo(); State.commands = []; State.selectedIndex = -1;
    renderAll(); setStatus(currentLang === 'zh' ? '已清空' : 'Cleared');
  }
};
document.getElementById('btnAddCmd').onclick = openAddMenu;
document.getElementById('addClose').onclick = () => document.getElementById('addMask').classList.remove('show');
document.getElementById('addMask').onclick = e => { if(e.target.id === 'addMask') document.getElementById('addMask').classList.remove('show'); };
document.getElementById('btnHelp').onclick = () => document.getElementById('helpMask').classList.add('show');
document.getElementById('helpClose').onclick = () => document.getElementById('helpMask').classList.remove('show');
document.getElementById('helpMask').onclick = e => { if(e.target.id === 'helpMask') document.getElementById('helpMask').classList.remove('show'); };

document.getElementById('tabDrag').onclick = () => {
  State.mode = 'drag';
  document.getElementById('tabDrag').classList.add('active');
  document.getElementById('tabScript').classList.remove('active');
  document.getElementById('modeDrag').classList.remove('hidden');
  document.getElementById('modeScript').classList.add('hidden');
  resizeCanvas(); drawCanvas();
};
document.getElementById('tabScript').onclick = () => {
  State.mode = 'script';
  document.getElementById('tabDrag').classList.remove('active');
  document.getElementById('tabScript').classList.add('active');
  document.getElementById('modeDrag').classList.add('hidden');
  document.getElementById('modeScript').classList.remove('hidden');
};

document.getElementById('scPreview').onclick = () => setStatus(currentLang === 'zh' ? '请导出 CSV 后在游戏中测试' : 'Please export CSV and test in game');
document.getElementById('scStop').onclick = () => {};
document.getElementById('scLoadExample').onclick = () => {
  document.getElementById('scriptEditor').value = `0,CombatZoneResize,133,251,508,391,TLResume
0,HeartTeleport,320,304
0,EndAttack`;
};
document.getElementById('scClear').onclick = () => { document.getElementById('scriptEditor').value = ''; };

function updateUILanguage() {
  document.querySelector('#topbar .title').textContent = t('title');
  document.getElementById('tabDrag').textContent = t('tabDrag');
  document.getElementById('tabScript').textContent = t('tabScript');
  document.getElementById('btnHelp').textContent = t('btnHelp');
  document.getElementById('btnAddCmd').textContent = t('btnAdd');
  document.getElementById('btnPlay').textContent = t('btnPlay');
  document.getElementById('btnUndo').textContent = t('btnUndo');
  document.getElementById('btnSave').textContent = t('btnSave');

  document.querySelector('#timelineHeader .tlabel').textContent = t('tlTitle');
  document.getElementById('btnImport').textContent = t('tlImport');
  document.getElementById('btnClear').textContent = t('tlClear');

  document.getElementById('stabWrite').textContent = t('stWrite');
  document.getElementById('stabGraph').textContent = t('stGraph');
  document.getElementById('scPreview').textContent = t('stPreview');
  document.getElementById('scStop').textContent = t('stStop');
  document.getElementById('scLoadExample').textContent = t('stExample');
  document.getElementById('scClear').textContent = t('stClear');

  document.querySelector('#helpMask .modal-header span').textContent = t('helpTitle');
  document.querySelector('#addMask .modal-header span').textContent = t('addTitle');
  document.getElementById('paramCancel').textContent = t('paramCancel');
  document.getElementById('paramOk').textContent = t('paramOk');
  document.getElementById('paramDelete').textContent = t('paramDelete');

  document.getElementById('statusBar').textContent = t('statusReady');

  buildBottomTools();
  renderTimeline();
  drawCanvas();
}

document.getElementById('langSelect').onchange = (e) => {
  currentLang = e.target.value;
  updateUILanguage();
  setStatus(currentLang === 'zh' ? '已切换到中文' : 'Language switched to English');
};

buildBottomTools();
resizeCanvas();
renderAll();
updateUILanguage();