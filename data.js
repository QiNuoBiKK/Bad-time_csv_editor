const CMD_DEFS = {
  BoneH:{label:'水平骨头',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1},{k:'len',t:'长度',min:10,max:500,step:5},{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'spd',t:'速度',min:50,max:800,step:10},{k:'col',t:'颜色',opts:[{v:0,t:'白'},{v:1,t:'蓝'},{v:2,t:'橙'}]}]},
  BoneV:{label:'垂直骨头',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1},{k:'len',t:'长度',min:10,max:500,step:5},{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'spd',t:'速度',min:50,max:800,step:10},{k:'col',t:'颜色',opts:[{v:0,t:'白'},{v:1,t:'蓝'},{v:2,t:'橙'}]}]},
  BoneHRepeat:{label:'水平阵列',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1},{k:'len',t:'长度',min:10,max:500,step:5},{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'spd',t:'速度',min:50,max:800,step:10},{k:'cnt',t:'数量',min:1,max:20,step:1},{k:'gap',t:'间距',min:10,max:200,step:5}]},
  BoneVRepeat:{label:'垂直阵列',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1},{k:'len',t:'长度',min:10,max:500,step:5},{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'spd',t:'速度',min:50,max:800,step:10},{k:'cnt',t:'数量',min:1,max:20,step:1},{k:'gap',t:'间距',min:10,max:200,step:5}]},
  BoneStab:{label:'骨墙',params:[{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'dist',t:'距离',min:10,max:500,step:5},{k:'warn',t:'预警',min:0,max:3,step:0.1},{k:'stay',t:'停留',min:0,max:3,step:0.1}]},
  GasterBlaster:{label:'龙骨炮',params:[{k:'size',t:'尺寸',opts:[{v:0,t:'细'},{v:1,t:'正常'},{v:2,t:'大'}]},{k:'sx',t:'起始X',min:0,max:640,step:1},{k:'sy',t:'起始Y',min:0,max:480,step:1},{k:'ex',t:'终点X',min:0,max:640,step:1},{k:'ey',t:'终点Y',min:0,max:480,step:1},{k:'ang',t:'角度',min:0,max:360,step:5},{k:'spin',t:'蓄力',min:0,max:3,step:0.05},{k:'blast',t:'开火',min:0,max:3,step:0.05}]},
  HeartMode:{label:'灵魂模式',params:[{k:'mode',t:'模式',opts:[{v:0,t:'红'},{v:1,t:'蓝'}]}]},
  HeartTeleport:{label:'灵魂瞬移',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1}]},
  HeartMaxFallSpeed:{label:'下落速度',params:[{k:'spd',t:'速度',min:100,max:2000,step:50}]},
  SansSlam:{label:'重力砸击',params:[{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]}]},
  SansSlamDamage:{label:'砸击伤害',params:[{k:'on',t:'开关',opts:[{v:0,t:'关'},{v:1,t:'开'}]}]},
  DamagePlayer:{label:'伤害玩家',params:[{k:'dmg',t:'伤害',min:1,max:20,step:1}]},
  CombatZoneResize:{label:'战斗框',params:[{k:'l',t:'左',min:-100,max:640,step:1},{k:'t',t:'上',min:-100,max:480,step:1},{k:'r',t:'右',min:0,max:740,step:1},{k:'b',t:'下',min:0,max:580,step:1}]},
  CombatZoneResizeInstant:{label:'瞬变战斗框',params:[{k:'l',t:'左',min:-100,max:640,step:1},{k:'t',t:'上',min:-100,max:480,step:1},{k:'r',t:'右',min:0,max:740,step:1},{k:'b',t:'下',min:0,max:580,step:1}]},
  SansHead:{label:'Sans表情',params:[{k:'name',t:'表情',opts:[{v:'Default',t:'默认'},{v:'LookLeft',t:'左看'},{v:'Wink',t:'眨眼'},{v:'ClosedEyes',t:'闭眼'},{v:'NoEyes',t:'黑眼'},{v:'BlueEye',t:'蓝眼'},{v:'Tired1',t:'疲劳1'},{v:'Tired2',t:'疲劳2'}]}]},
  SansBody:{label:'Sans身体',params:[{k:'name',t:'动作',opts:[{v:'HandUp',t:'手上'},{v:'HandDown',t:'手下'},{v:'HandLeft',t:'手左'},{v:'HandRight',t:'手右'}]}]},
  SansTorso:{label:'Sans躯干',params:[{k:'name',t:'姿态',opts:[{v:'Default',t:'普通'},{v:'Shrug',t:'耸肩'}]}]},
  SansAnimation:{label:'Sans动画',params:[{k:'name',t:'动画',opts:[{v:'Idle',t:'正常'},{v:'HeadBob',t:'晃头'},{v:'Tired',t:'小幅'}]}]},
  SansSweat:{label:'汗滴',params:[{k:'n',t:'数量',min:0,max:3,step:1}]},
  SansX:{label:'SansX',params:[{k:'x',t:'X',min:0,max:640,step:1}]},
  SansText:{label:'对话',params:[{k:'txt',t:'文本',text:true}]},
  Sound:{label:'音效',params:[{k:'name',t:'音效',opts:[{v:'Ding',t:'叮'},{v:'Flash',t:'咔'},{v:'GasterBlaster',t:'炮蓄'},{v:'GasterBlast',t:'炮发'},{v:'heartshatter',t:'心碎'},{v:'Slam',t:'砸地'},{v:'sansspeak',t:'说话'},{v:'warning',t:'预警'}]},{k:'spd',t:'速度',min:0,max:2,step:0.1}]},
  Music:{label:'音乐',params:[{k:'name',t:'音乐',text:true}]},
  BlackScreen:{label:'黑屏',params:[{k:'on',t:'开关',opts:[{v:0,t:'关'},{v:1,t:'开'}]}]},
  TLPause:{label:'暂停',params:[]},
  TLResume:{label:'恢复',params:[]},
  EndAttack:{label:'结束',params:[]},
  Platform:{label:'平台',params:[{k:'x',t:'X',min:0,max:640,step:1},{k:'y',t:'Y',min:0,max:480,step:1},{k:'w',t:'宽度',min:20,max:300,step:5},{k:'dir',t:'方向',opts:[{v:0,t:'右'},{v:1,t:'下'},{v:2,t:'左'},{v:3,t:'上'}]},{k:'spd',t:'速度',min:0,max:500,step:10},{k:'rev',t:'反转',opts:[{v:0,t:'否'},{v:1,t:'是'}]}]}
};

const CMD_GROUPS = [
  {g:'骨头',cmds:['BoneH','BoneV','BoneHRepeat','BoneVRepeat','BoneStab']},
  {g:'龙骨炮',cmds:['GasterBlaster']},
  {g:'灵魂',cmds:['HeartMode','HeartTeleport','HeartMaxFallSpeed','SansSlam','SansSlamDamage','DamagePlayer']},
  {g:'战斗框',cmds:['CombatZoneResize','CombatZoneResizeInstant']},
  {g:'Sans',cmds:['SansHead','SansBody','SansTorso','SansAnimation','SansSweat','SansX','SansText']},
  {g:'其他',cmds:['Sound','Music','BlackScreen','TLPause','TLResume','EndAttack','Platform']}
];

const SCRIPT_CMDS = ['SET','ADD','SUB','MUL','DIV','MOD','COS','SIN','RND','JMP','JMPNL','JMPNG','JMPNZ','JMPZ','GetHeartPos','ANGLE','GasterBlaster','BoneH','BoneV','BoneHRepeat','BoneVRepeat','BoneStab','HeartMode','HeartTeleport','HeartMaxFallSpeed','SansSlam','SansSlamDamage','DamagePlayer','CombatZoneResize','CombatZoneResizeInstant','SansHead','SansBody','SansTorso','SansAnimation','SansSweat','SansX','SansText','Sound','Music','BlackScreen','TLPause','TLResume','EndAttack','Platform'];
const SCRIPT_ARG_COUNT = { SET:2, ADD:3, SUB:3, MUL:3, DIV:3, MOD:3, COS:2, SIN:2, RND:2, JMP:1, JMPNL:3, JMPNG:3, JMPNZ:2, JMPZ:2, GetHeartPos:2, ANGLE:5, GasterBlaster:8, BoneH:6, BoneV:6, BoneHRepeat:7, BoneVRepeat:7, BoneStab:4, HeartMode:1, HeartTeleport:2, HeartMaxFallSpeed:1, SansSlam:1, SansSlamDamage:1, DamagePlayer:1, CombatZoneResize:4, CombatZoneResizeInstant:4, SansHead:1, SansBody:1, SansTorso:1, SansAnimation:1, SansSweat:1, SansX:1, SansText:1, Sound:2, Music:1, BlackScreen:1, TLPause:0, TLResume:0, EndAttack:0, Platform:6 };

const AUTO_SOUND = { BlackScreen: { cond: a => num(a.on) === 1, sound: 'Flash' }, SansSlam: { cond: () => true, sound: 'Slam' } };
const SNIPPETS = [{name:'RND', text:'RND,变量,上限'},{name:'JMPNZ', text:'JMPNZ,行号,$变量'},{name:'GetHeartPos', text:'GetHeartPos,HeartX,HeartY'},{name:'SET', text:'SET,变量,值'}];

const State = {
  mode:'drag', zoneW:640, zoneH:480, commands:[], selectedIndex:-1,
  playing:false, playStart:0, playRAF:null, undoStack:[], drag:null, dragTool:null,
  scriptPlaying:false, scriptRAF:null, scriptStart:0, scriptView:'write',
  lastVars:{}, heartX:320, heartY:304, draggingHeart:false, scriptZone:{l:133,t:251,r:508,b:391},
  pendingParamIndex:-1, modalIdx:-1, origCmd:null
};

function setStatus(m){document.getElementById('statusBar').textContent=m;}
function num(v){return parseFloat(v)||0;}
function colorOf(c){if(c===1)return'#4488ff';if(c===2)return'#ff8844';return'#fff';}
function pushUndo(){
  State.undoStack.push(JSON.parse(JSON.stringify(State.commands)));
  if(State.undoStack.length>50)State.undoStack.shift();
}
function undo(){
  if(State.undoStack.length===0){setStatus('没有可撤销的操作');return;}
  State.commands=State.undoStack.pop();
  State.selectedIndex=-1;
  renderAll();
  setStatus('已撤销');
}
function renderAll(){
  if (typeof drawCanvas === 'function') drawCanvas();
  if (typeof renderTimeline === 'function') renderTimeline();
}

const LANG = {
  zh: {
    title: 'editor', tabDrag: '拖拽编辑', tabScript: '脚本代码',
    btnHelp: '使用说明', btnAdd: '添加指令', btnPlay: '播放', btnUndo: '撤销', btnSave: '保存 CSV',
    tlTitle: 'TIMELINE 时间轴', tlImport: '导入', tlClear: '清空',
    stWrite: '编写', stGraph: '图形', stPreview: '预览', stStop: '停止', stExample: '载入示例', stClear: '清空',
    statusReady: '就绪 · 拖拽下方卡片至画布创建指令 · 点击指令修改参数',
    helpTitle: '编辑器使用说明', helpClose: '×', addTitle: '添加指令',
    paramTitle: '参数调整', paramDelete: '删除', paramCancel: '取消', paramOk: '确定修改',
    cmds: {
      BoneH: {label:'水平骨头', p:{x:'X',y:'Y',len:'长度',dir:'方向',spd:'速度',col:'颜色'}, opts:{dir:['右','下','左','上'], col:['白','蓝','橙']}},
      BoneV: {label:'垂直骨头', p:{x:'X',y:'Y',len:'长度',dir:'方向',spd:'速度',col:'颜色'}, opts:{dir:['右','下','左','上'], col:['白','蓝','橙']}},
      BoneHRepeat: {label:'水平阵列', p:{x:'X',y:'Y',len:'长度',dir:'方向',spd:'速度',cnt:'数量',gap:'间距'}, opts:{dir:['右','下','左','上']}},
      BoneVRepeat: {label:'垂直阵列', p:{x:'X',y:'Y',len:'长度',dir:'方向',spd:'速度',cnt:'数量',gap:'间距'}, opts:{dir:['右','下','左','上']}},
      BoneStab: {label:'骨墙', p:{dir:'方向',dist:'距离',warn:'预警',stay:'停留'}, opts:{dir:['右','下','左','上']}},
      GasterBlaster: {label:'龙骨炮', p:{size:'尺寸',sx:'起始X',sy:'起始Y',ex:'终点X',ey:'终点Y',ang:'角度',spin:'蓄力',blast:'开火'}, opts:{size:['细','正常','大']}},
      HeartMode: {label:'灵魂模式', p:{mode:'模式'}, opts:{mode:['红','蓝']}},
      HeartTeleport: {label:'灵魂瞬移', p:{x:'X',y:'Y'}}, HeartMaxFallSpeed: {label:'下落速度', p:{spd:'速度'}},
      SansSlam: {label:'重力砸击', p:{dir:'方向'}, opts:{dir:['右','下','左','上']}},
      SansSlamDamage: {label:'砸击伤害', p:{on:'开关'}, opts:{on:['关','开']}},
      DamagePlayer: {label:'伤害玩家', p:{dmg:'伤害'}},
      CombatZoneResize: {label:'战斗框', p:{l:'左',t:'上',r:'右',b:'下'}},
      CombatZoneResizeInstant: {label:'瞬变战斗框', p:{l:'左',t:'上',r:'右',b:'下'}},
      SansHead: {label:'Sans表情', p:{name:'表情'}, opts:{name:['默认','左看','眨眼','闭眼','黑眼','蓝眼','疲劳1','疲劳2']}},
      SansBody: {label:'Sans身体', p:{name:'动作'}, opts:{name:['手上','手下','手左','手右']}},
      SansTorso: {label:'Sans躯干', p:{name:'姿态'}, opts:{name:['普通','耸肩']}},
      SansAnimation: {label:'Sans动画', p:{name:'动画'}, opts:{name:['正常','晃头','小幅']}},
      SansSweat: {label:'汗滴', p:{n:'数量'}},
      SansX: {label:'SansX', p:{x:'X'}},
      SansText: {label:'对话', p:{txt:'文本'}},
      Sound: {label:'音效', p:{name:'音效',spd:'速度'}, opts:{name:['叮','咔','炮蓄','炮发','心碎','砸地','说话','预警']}},
      Music: {label:'音乐', p:{name:'音乐'}},
      BlackScreen: {label:'黑屏', p:{on:'开关'}, opts:{on:['关','开']}},
      TLPause: {label:'暂停', p:{}}, TLResume: {label:'恢复', p:{}}, EndAttack: {label:'结束', p:{}},
      Platform: {label:'平台', p:{x:'X',y:'Y',w:'宽度',dir:'方向',spd:'速度',rev:'反转'}, opts:{dir:['右','下','左','上'], rev:['否','是']}}
    }
  },
  en: {
    title: 'editor', tabDrag: 'Drag', tabScript: 'Script',
    btnHelp: 'Help', btnAdd: 'Add', btnPlay: 'Play', btnUndo: 'Undo', btnSave: 'Save CSV',
    tlTitle: 'TIMELINE', tlImport: 'Import', tlClear: 'Clear',
    stWrite: 'Write', stGraph: 'Graph', stPreview: 'Preview', stStop: 'Stop', stExample: 'Example', stClear: 'Clear',
    statusReady: 'Ready · Drag tools to canvas · Click to edit params',
    helpTitle: 'Help', helpClose: '×', addTitle: 'Add Command',
    paramTitle: 'Parameters', paramDelete: 'Delete', paramCancel: 'Cancel', paramOk: 'Apply',
    cmds: {
      BoneH: {label:'Bone H', p:{x:'X',y:'Y',len:'Len',dir:'Dir',spd:'Spd',col:'Color'}, opts:{dir:['R','D','L','U'], col:['White','Blue','Orange']}},
      BoneV: {label:'Bone V', p:{x:'X',y:'Y',len:'Len',dir:'Dir',spd:'Spd',col:'Color'}, opts:{dir:['R','D','L','U'], col:['White','Blue','Orange']}},
      BoneHRepeat: {label:'Bone H Rep', p:{x:'X',y:'Y',len:'Len',dir:'Dir',spd:'Spd',cnt:'Cnt',gap:'Gap'}, opts:{dir:['R','D','L','U']}},
      BoneVRepeat: {label:'Bone V Rep', p:{x:'X',y:'Y',len:'Len',dir:'Dir',spd:'Spd',cnt:'Cnt',gap:'Gap'}, opts:{dir:['R','D','L','U']}},
      BoneStab: {label:'Bone Stab', p:{dir:'Dir',dist:'Dist',warn:'Warn',stay:'Stay'}, opts:{dir:['R','D','L','U']}},
      GasterBlaster: {label:'Blaster', p:{size:'Size',sx:'StartX',sy:'StartY',ex:'EndX',ey:'EndY',ang:'Ang',spin:'Spin',blast:'Blast'}, opts:{size:['Thin','Norm','Big']}},
      HeartMode: {label:'Heart Mode', p:{mode:'Mode'}, opts:{mode:['Red','Blue']}},
      HeartTeleport: {label:'Teleport', p:{x:'X',y:'Y'}}, HeartMaxFallSpeed: {label:'Fall Speed', p:{spd:'Spd'}},
      SansSlam: {label:'Slam', p:{dir:'Dir'}, opts:{dir:['R','D','L','U']}},
      SansSlamDamage: {label:'Slam Damage', p:{on:'Toggle'}, opts:{on:['Off','On']}},
      DamagePlayer: {label:'Damage', p:{dmg:'Dmg'}},
      CombatZoneResize: {label:'Zone', p:{l:'L',t:'T',r:'R',b:'B'}},
      CombatZoneResizeInstant: {label:'Zone Instant', p:{l:'L',t:'T',r:'R',b:'B'}},
      SansHead: {label:'Sans Head', p:{name:'Face'}, opts:{name:['Default','LookLeft','Wink','ClosedEyes','NoEyes','BlueEye','Tired1','Tired2']}},
      SansBody: {label:'Sans Body', p:{name:'Pose'}, opts:{name:['HandUp','HandDown','HandLeft','HandRight']}},
      SansTorso: {label:'Sans Torso', p:{name:'Pose'}, opts:{name:['Default','Shrug']}},
      SansAnimation: {label:'Sans Anim', p:{name:'Anim'}, opts:{name:['Idle','HeadBob','Tired']}},
      SansSweat: {label:'Sweat', p:{n:'Num'}},
      SansX: {label:'Sans X', p:{x:'X'}},
      SansText: {label:'Dialog', p:{txt:'Text'}},
      Sound: {label:'Sound', p:{name:'Sound',spd:'Spd'}, opts:{name:['Ding','Flash','Blaster','Blast','Shatter','Slam','Speak','Warning']}},
      Music: {label:'Music', p:{name:'Music'}},
      BlackScreen: {label:'Black', p:{on:'Toggle'}, opts:{on:['Off','On']}},
      TLPause: {label:'Pause', p:{}}, TLResume: {label:'Resume', p:{}}, EndAttack: {label:'End', p:{}},
      Platform: {label:'Platform', p:{x:'X',y:'Y',w:'Width',dir:'Dir',spd:'Spd',rev:'Rev'}, opts:{dir:['R','D','L','U'], rev:['No','Yes']}}
    }
  }
};
let currentLang = 'zh';
function t(key) { return LANG[currentLang][key] || key; }
function tCmd(fn) { return (LANG[currentLang].cmds[fn] && LANG[currentLang].cmds[fn].label) ? LANG[currentLang].cmds[fn].label : (CMD_DEFS[fn] ? CMD_DEFS[fn].label : fn); }