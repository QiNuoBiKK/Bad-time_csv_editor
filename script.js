/* ==================== 脚本模式核心 ==================== */
const scriptEditor = document.getElementById('scriptEditor');
const scriptLineNums = document.getElementById('scriptLineNums');
const autocomplete = document.getElementById('autocomplete');

/* 行号同步 */
function updateLineNums(){
  if(!scriptEditor || !scriptLineNums) return;
  const lines = scriptEditor.value.split('\n').length;
  let s = '';
  for(let i = 0; i < lines; i++) s += i + '\n';
  scriptLineNums.textContent = s;
}

function syncLineNumsScroll(){
  if(!scriptEditor || !scriptLineNums) return;
  scriptLineNums.scrollTop = scriptEditor.scrollTop;
}

scriptEditor.addEventListener('input', () => {
  updateLineNums();
  showAutocomplete();
});

scriptEditor.addEventListener('scroll', syncLineNumsScroll);

/* ==================== 自动补全 ==================== */
let acItems = [];
let acIndex = 0;
let acWordStart = 0;

function getScriptVars(){
  const text = scriptEditor.value;
  const set = new Set();
  const re = /\$([A-Za-z_][A-Za-z0-9_]*)/g;
  let m;
  while((m = re.exec(text))) set.add(m[1]);
  return Array.from(set);
}

function buildCandidates(prefix){
  const out = [];
  const p = prefix.toLowerCase();
  
  SCRIPT_CMDS.forEach(c => {
    if(c.toLowerCase().startsWith(p)) out.push({kind:'cmd', text:c, label:c});
  });
  
  getScriptVars().forEach(v => {
    const t = '$' + v;
    if(t.toLowerCase().startsWith(p)) out.push({kind:'var', text:t, label:t});
  });
  
  SNIPPETS.forEach(s => {
    if(s.name.toLowerCase().startsWith(p)) out.push({kind:'snip', text:s.text, label:s.name + ' → ' + s.text});
  });
  
  return out.slice(0, 20);
}

function showAutocomplete(){
  const pos = scriptEditor.selectionStart;
  const before = scriptEditor.value.slice(0, pos);
  const m = before.match(/([A-Za-z_$][A-Za-z0-9_$]*)$/);
  if(!m) return hideAutocomplete();
  const word = m[1];
  if(word.length < 1) return hideAutocomplete();
  
  acItems = buildCandidates(word);
  if(acItems.length === 0) return hideAutocomplete();
  
  acWordStart = pos - word.length;
  acIndex = 0;
  
  autocomplete.innerHTML = acItems.map((it, i) => {
    const kindCls = it.kind === 'cmd' ? 'cmd' : (it.kind === 'var' ? 'var' : 'snip');
    const kindLabel = it.kind === 'cmd' ? '指令' : (it.kind === 'var' ? '变量' : '片段');
    return `<div class="ac-item${i === 0 ? ' active' : ''}" data-i="${i}"><span class="ac-kind ${kindCls}">${kindLabel}</span><span>${it.label}</span></div>`;
  }).join('');
  
  autocomplete.classList.add('show');
  
  const rect = scriptEditor.getBoundingClientRect();
  const lineHeight = 13 * 1.6;
  const linesBefore = before.split('\n');
  const lineIdx = linesBefore.length - 1;
  const colIdx = linesBefore[lineIdx].length;
  const x = rect.left + 10 + Math.min(colIdx, 40) * 7.8;
  const y = rect.top + 10 + (lineIdx + 1) * lineHeight - scriptEditor.scrollTop;
  
  autocomplete.style.left = Math.min(x, window.innerWidth - 260) + 'px';
  autocomplete.style.top = Math.min(y, window.innerHeight - 240) + 'px';
  
  autocomplete.querySelectorAll('.ac-item').forEach(el => {
    el.onmousedown = ev => { ev.preventDefault(); applyAutocomplete(parseInt(el.dataset.i)); };
  });
}

function hideAutocomplete(){
  autocomplete.classList.remove('show');
}

function applyAutocomplete(i){
  if(i < 0 || i >= acItems.length) return;
  const pos = scriptEditor.selectionStart;
  const item = acItems[i];
  const newText = scriptEditor.value.slice(0, acWordStart) + item.text + scriptEditor.value.slice(pos);
  scriptEditor.value = newText;
  const newPos = acWordStart + item.text.length;
  scriptEditor.selectionStart = scriptEditor.selectionEnd = newPos;
  scriptEditor.focus();
  hideAutocomplete();
  updateLineNums();
}

function updateAcActive(){
  autocomplete.querySelectorAll('.ac-item').forEach((el, i) => el.classList.toggle('active', i === acIndex));
  const active = autocomplete.querySelector('.ac-item.active');
  if(active) active.scrollIntoView({block:'nearest'});
}

/* 键盘控制补全列表 */
scriptEditor.addEventListener('keydown', e => {
  if(!autocomplete.classList.contains('show')) return;
  if(e.key === 'ArrowDown'){ e.preventDefault(); acIndex = Math.min(acIndex + 1, acItems.length - 1); updateAcActive(); }
  else if(e.key === 'ArrowUp'){ e.preventDefault(); acIndex = Math.max(acIndex - 1, 0); updateAcActive(); }
  else if(e.key === 'Tab' || e.key === 'Enter'){ e.preventDefault(); applyAutocomplete(acIndex); }
  else if(e.key === 'Escape'){ e.preventDefault(); hideAutocomplete(); }
});

document.addEventListener('mousedown', e => {
  if(!autocomplete.contains(e.target) && e.target !== scriptEditor) hideAutocomplete();
});

/* ==================== 图形模式空壳 ==================== */
function syncGraphFromText(){}
function writeGraphToText(){}

/* ==================== 脚本预演空壳 ==================== */
function runScriptPreview(){
  setStatus('脚本模式已就绪，导出CSV后在游戏内测试');
}

/* ==================== 初始运行 ==================== */
updateLineNums();
