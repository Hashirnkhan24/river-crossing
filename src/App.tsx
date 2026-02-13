import { useEffect, useRef } from "react";

export function App() {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (iframeRef.current) {
			const doc = iframeRef.current.contentDocument;
			if (doc) {
				doc.open();
				doc.write(GAME_HTML);
				doc.close();
			}
		}
	}, []);

	return (
		<iframe
			ref={iframeRef}
			title="River Crossing Puzzle"
			style={{
				width: "100vw",
				height: "100vh",
				border: "none",
				margin: 0,
				padding: 0,
				display: "block",
			}}
		/>
	);
}

const GAME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>River Crossing Puzzle</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Nunito',sans-serif;overflow-x:hidden;min-height:100vh;width:100vw;background:linear-gradient(180deg,#0f0c29 0%,#302b63 15%,#24243e 30%,#0077b6 50%,#023e8a 70%,#03045e 100%);user-select:none;}
  .stars-container{position:fixed;top:0;left:0;width:100%;height:35%;z-index:0;pointer-events:none;}
  .star{position:absolute;background:white;border-radius:50%;animation:twinkle 2s infinite alternate;}
  @keyframes twinkle{0%{opacity:0.2;transform:scale(1);}100%{opacity:1;transform:scale(1.4);}}
  .celestial{position:fixed;top:8%;left:50%;transform:translateX(-50%);width:70px;height:70px;background:radial-gradient(circle,#fff7a1,#f5af19,#e96443);border-radius:50%;box-shadow:0 0 40px #f5af19,0 0 80px #e9644366;z-index:1;pointer-events:none;}
  .cloud{position:fixed;background:rgba(255,255,255,0.12);border-radius:50px;z-index:2;pointer-events:none;animation:cloudDrift linear infinite;}
  @keyframes cloudDrift{0%{transform:translateX(-250px);}100%{transform:translateX(calc(100vw + 250px));}}
  .waves-layer{position:fixed;top:40%;left:0;right:0;bottom:0;z-index:1;pointer-events:none;overflow:hidden;}
  .wave-line{position:absolute;width:250%;height:25px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 25'%3E%3Cpath fill='rgba(255,255,255,0.06)' d='M0,12 C360,25 720,0 1080,12 C1260,18 1350,6 1440,12 L1440,25 L0,25 Z'/%3E%3C/svg%3E");background-size:600px 25px;animation:waveSlide 5s linear infinite;}
  @keyframes waveSlide{0%{transform:translateX(0);}100%{transform:translateX(-600px);}}
  .fish{position:fixed;font-size:22px;z-index:2;pointer-events:none;animation:fishGo linear infinite;}
  @keyframes fishGo{0%{transform:translateX(-60px) scaleX(1);}49%{transform:translateX(calc(100vw + 60px)) scaleX(1);}50%{transform:translateX(calc(100vw + 60px)) scaleX(-1);}100%{transform:translateX(-60px) scaleX(-1);}}
  .game-wrapper{position:relative;z-index:10;max-width:1100px;margin:0 auto;padding:12px 8px 30px;}
  .header{text-align:center;margin-bottom:10px;}
  .header h1{font-family:'Fredoka One',cursive;font-size:30px;color:#fff;text-shadow:0 3px 15px rgba(0,0,0,0.5);}
  .header .sub{font-size:13px;color:rgba(255,255,255,0.6);margin-top:2px;}
  .stats-row{display:flex;justify-content:center;gap:12px;margin-top:8px;flex-wrap:wrap;}
  .stat-badge{background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:5px 16px;color:#fff;font-size:13px;font-weight:700;}
  .msg-bar{text-align:center;padding:10px 16px;margin:8px auto 12px;max-width:560px;border-radius:14px;font-size:13px;font-weight:700;color:#fff;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);transition:background 0.3s;}
  .msg-bar.err{background:rgba(220,38,38,0.6);border-color:rgba(220,38,38,0.4);}
  .msg-bar.ok{background:rgba(22,163,74,0.6);border-color:rgba(22,163,74,0.4);}
  .msg-bar.warn{background:rgba(217,119,6,0.6);border-color:rgba(217,119,6,0.4);}
  .board{display:flex;align-items:flex-start;gap:8px;justify-content:center;}
  .bank{width:200px;min-height:320px;border-radius:20px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;background:linear-gradient(180deg,#86efac 0%,#4ade80 30%,#22c55e 70%,#15803d 100%);border:2px solid rgba(255,255,255,0.2);box-shadow:0 8px 30px rgba(0,0,0,0.3);}
  .bank-label{font-family:'Fredoka One',cursive;font-size:13px;color:#14532d;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;background:rgba(255,255,255,0.3);padding:3px 12px;border-radius:10px;}
  .bank-chars{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;position:relative;z-index:2;}
  .bank-trees{position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:28px;opacity:0.4;z-index:1;}
  .char-card{width:72px;height:86px;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;border:2.5px solid rgba(255,255,255,0.35);box-shadow:0 4px 16px rgba(0,0,0,0.25);transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);}
  .char-card:hover{transform:translateY(-7px) scale(1.1);box-shadow:0 10px 30px rgba(0,0,0,0.4);border-color:#fff;}
  .char-card:active{transform:translateY(-2px) scale(1.03);}
  .char-card .emoji{font-size:30px;line-height:1;}
  .char-card .cname{font-size:9px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;text-shadow:0 1px 4px rgba(0,0,0,0.5);}
  .char-card .driver-icon{position:absolute;top:-5px;right:-5px;background:linear-gradient(135deg,#fbbf24,#f59e0b);width:20px;height:20px;border-radius:50%;font-size:11px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;}
  .c-father{background:linear-gradient(135deg,#1e88e5,#0d47a1);}
  .c-mother{background:linear-gradient(135deg,#ec407a,#ad1457);}
  .c-son{background:linear-gradient(135deg,#42a5f5,#1565c0);}
  .c-daughter{background:linear-gradient(135deg,#f48fb1,#c2185b);}
  .c-police{background:linear-gradient(135deg,#546e7a,#263238);}
  .c-thief{background:linear-gradient(135deg,#8d6e63,#3e2723);}
  .river-zone{flex:1;max-width:400px;min-width:220px;display:flex;flex-direction:column;align-items:center;gap:12px;}
  .raft-wrapper{position:relative;transition:all 0.8s cubic-bezier(0.45,0,0.55,1);animation:raftBob 3s ease-in-out infinite;}
  .raft-wrapper.pos-left{transform:translateX(-50px);}
  .raft-wrapper.pos-right{transform:translateX(50px);}
  @keyframes raftBob{0%,100%{margin-top:0;}50%{margin-top:8px;}}
  .raft-body{width:190px;min-height:110px;padding:12px;background:linear-gradient(180deg,#d7a86e 0%,#b8845a 40%,#8d6534 100%);border-radius:18px 18px 26px 26px;border:3px solid #6d4c2a;box-shadow:0 10px 35px rgba(0,0,0,0.45),inset 0 2px 0 rgba(255,255,255,0.15);display:flex;gap:8px;justify-content:center;align-items:center;position:relative;}
  .raft-body::before{content:'';position:absolute;top:7px;left:12px;right:12px;height:3px;background:rgba(255,255,255,0.12);border-radius:2px;}
  .wood-grain{position:absolute;left:8px;right:8px;height:1px;background:linear-gradient(90deg,transparent,rgba(100,60,20,0.25),transparent);}
  .raft-anchor{text-align:center;margin-top:-6px;font-size:16px;opacity:0.4;}
  .raft-label-top{font-family:'Fredoka One',cursive;font-size:12px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:2px;}
  .raft-slot{width:74px;height:88px;border:2.5px dashed rgba(255,255,255,0.2);border-radius:12px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.25);font-size:11px;font-weight:700;transition:border-color 0.3s;}
  .raft-slot.filled{border-color:transparent;}
  .sail-btn{padding:14px 40px;font-family:'Fredoka One',cursive;font-size:17px;color:#fff;background:linear-gradient(135deg,#ff8f00,#e65100);border:none;border-radius:30px;cursor:pointer;transition:all 0.3s;box-shadow:0 6px 20px rgba(230,81,0,0.45);letter-spacing:1px;text-transform:uppercase;}
  .sail-btn:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(230,81,0,0.6);background:linear-gradient(135deg,#ffa000,#ff6f00);}
  .sail-btn:disabled{background:#555;cursor:not-allowed;box-shadow:0 2px 8px rgba(0,0,0,0.2);transform:none;}
  .sail-btn:active:not(:disabled){transform:translateY(-1px);}
  .driver-warn{font-size:11px;color:#fca5a5;background:rgba(127,29,29,0.5);padding:4px 12px;border-radius:8px;}
  .ctrl-row{display:flex;justify-content:center;gap:8px;margin-top:14px;flex-wrap:wrap;}
  .ctrl-btn{padding:8px 18px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;color:#fff;border:1.5px solid rgba(255,255,255,0.25);border-radius:20px;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.08);text-transform:uppercase;letter-spacing:1px;backdrop-filter:blur(6px);}
  .ctrl-btn:hover{background:rgba(255,255,255,0.22);border-color:rgba(255,255,255,0.5);transform:translateY(-1px);}
  .ctrl-btn.active{background:rgba(34,197,94,0.35);border-color:rgba(34,197,94,0.6);}
  .rules-box{max-width:650px;margin:20px auto 0;padding:16px 20px;background:rgba(0,0,0,0.35);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.12);border-radius:18px;display:none;}
  .rules-box.show{display:block;}
  .rules-box h3{font-family:'Fredoka One',cursive;font-size:15px;color:#fcd34d;margin-bottom:10px;text-align:center;}
  .rules-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
  .rule-item{display:flex;align-items:flex-start;gap:6px;background:rgba(255,255,255,0.07);border-radius:10px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,0.85);}
  .rule-item .ri{font-size:16px;flex-shrink:0;}
  .solution-box{max-width:650px;margin:14px auto 0;padding:16px 20px;background:rgba(0,0,0,0.4);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.12);border-radius:18px;display:none;}
  .solution-box.show{display:block;}
  .solution-box h3{font-family:'Fredoka One',cursive;font-size:15px;color:#a78bfa;margin-bottom:10px;text-align:center;}
  .sol-step{display:flex;align-items:center;gap:8px;padding:7px 10px;margin:4px 0;border-radius:10px;font-size:12px;color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.05);transition:all 0.3s;}
  .sol-step .step-num{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);}
  .sol-step.current{background:rgba(167,139,250,0.25);border:1px solid rgba(167,139,250,0.4);}
  .sol-step.current .step-num{background:#7c3aed;color:#fff;}
  .sol-step.done{opacity:0.5;}
  .sol-step.done .step-num{background:#22c55e;color:#fff;}
  .sol-step .arrow{font-size:16px;}
  .sol-step .step-text{flex:1;font-weight:600;}
  .sol-auto-btn{display:block;margin:12px auto 0;padding:8px 22px;font-family:'Fredoka One',cursive;font-size:13px;color:#fff;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;border-radius:20px;cursor:pointer;transition:all 0.3s;box-shadow:0 4px 14px rgba(124,58,237,0.4);}
  .sol-auto-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(124,58,237,0.6);}
  .sol-auto-btn:disabled{background:#555;cursor:not-allowed;box-shadow:none;transform:none;}
  .overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:100;display:none;align-items:center;justify-content:center;animation:fadeIn 0.35s;}
  .overlay.show{display:flex;}
  @keyframes fadeIn{from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}}
  .overlay-card{background:linear-gradient(135deg,#1e1b4b,#1e293b);border:2px solid rgba(255,255,255,0.2);border-radius:28px;padding:44px 40px;text-align:center;max-width:400px;width:90%;box-shadow:0 25px 60px rgba(0,0,0,0.6);}
  .overlay-card .oc-icon{font-size:60px;margin-bottom:14px;}
  .overlay-card h2{font-family:'Fredoka One',cursive;font-size:30px;color:#fff;margin-bottom:8px;}
  .overlay-card p{color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:22px;line-height:1.7;}
  .overlay-card .oc-moves{color:#fcd34d;font-family:'Fredoka One',cursive;font-size:20px;}
  .ol-btn{padding:12px 30px;font-family:'Fredoka One',cursive;font-size:15px;color:#fff;border:none;border-radius:25px;cursor:pointer;transition:all 0.3s;margin:0 6px;}
  .ol-btn:hover{transform:translateY(-2px);}
  .ol-btn.orange{background:linear-gradient(135deg,#ff6f00,#e65100);box-shadow:0 4px 16px rgba(230,81,0,0.4);}
  .ol-btn.green{background:linear-gradient(135deg,#16a34a,#15803d);box-shadow:0 4px 16px rgba(22,163,74,0.4);}
  .ol-btn.ghost{background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.3);}
  .confetti-piece{position:fixed;z-index:101;width:10px;height:10px;pointer-events:none;animation:confettiFall linear forwards;}
  @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}
  @media(max-width:750px){.board{flex-direction:column;align-items:center;gap:14px;}.bank{width:100%;max-width:340px;min-height:auto;padding:12px;}.bank-chars{gap:6px;}.river-zone{max-width:100%;min-width:unset;}.raft-wrapper.pos-left,.raft-wrapper.pos-right{transform:translateX(0);}.char-card{width:62px;height:74px;}.char-card .emoji{font-size:24px;}.char-card .cname{font-size:8px;}.header h1{font-size:24px;}.rules-grid{grid-template-columns:1fr;}.raft-body{width:165px;min-height:95px;}.raft-slot{width:64px;height:76px;}}
</style>
</head>
<body>
<div class="stars-container" id="starsContainer"></div>
<div class="celestial"></div>
<div class="cloud" style="top:6%;width:130px;height:42px;animation-duration:28s;"></div>
<div class="cloud" style="top:13%;width:85px;height:30px;animation-duration:38s;animation-delay:-12s;"></div>
<div class="cloud" style="top:3%;width:110px;height:36px;animation-duration:33s;animation-delay:-20s;"></div>
<div class="waves-layer">
  <div class="wave-line" style="top:0;"></div>
  <div class="wave-line" style="top:35px;animation-delay:-1.2s;"></div>
  <div class="wave-line" style="top:70px;animation-delay:-2.4s;"></div>
  <div class="wave-line" style="top:105px;animation-delay:-0.6s;"></div>
  <div class="wave-line" style="top:140px;animation-delay:-1.8s;"></div>
  <div class="wave-line" style="top:175px;animation-delay:-3s;"></div>
</div>
<div class="fish" style="top:58%;animation-duration:14s;">&#x1F41F;</div>
<div class="fish" style="top:72%;animation-duration:20s;animation-delay:-5s;">&#x1F420;</div>
<div class="fish" style="top:88%;animation-duration:17s;animation-delay:-9s;">&#x1F421;</div>
<div class="game-wrapper">
  <div class="header">
    <h1>&#x1F3DE;&#xFE0F; River Crossing Puzzle</h1>
    <div class="sub">Get all 6 characters safely to the Destination!</div>
    <div class="stats-row">
      <div class="stat-badge">&#x1F6B6; Moves: <span id="sMoves">0</span></div>
      <div class="stat-badge">&#x1F465; Crossed: <span id="sCrossed">0</span> / 6</div>
    </div>
  </div>
  <div class="msg-bar" id="msgBar">&#x1F4A1; Click a character to board the raft, then press Sail!</div>
  <div class="board">
    <div class="bank" id="leftBankEl">
      <div class="bank-label">&#x2B05; Start</div>
      <div class="bank-chars" id="leftChars"></div>
      <div class="bank-trees">&#x1F332; &#x1F333; &#x1F334; &#x1F332;</div>
    </div>
    <div class="river-zone">
      <div class="raft-label-top">&#x1F6A3; The Raft</div>
      <div class="raft-wrapper pos-left" id="raftWrapper">
        <div class="raft-body" id="raftBody">
          <div class="wood-grain" style="top:25%;"></div>
          <div class="wood-grain" style="top:45%;"></div>
          <div class="wood-grain" style="top:65%;"></div>
          <div class="wood-grain" style="top:80%;"></div>
          <div class="raft-slot" id="slot0">Empty</div>
          <div class="raft-slot" id="slot1">Empty</div>
        </div>
        <div class="raft-anchor">&#x2693;</div>
      </div>
      <button class="sail-btn" id="sailBtn" onclick="doSail()">&#x26F5; Sail &#x2192;</button>
      <div class="driver-warn" id="driverWarn" style="display:none;">&#x26A0;&#xFE0F; Need a driver</div>
    </div>
    <div class="bank" id="rightBankEl">
      <div class="bank-label">Finish &#x27A1;</div>
      <div class="bank-chars" id="rightChars"></div>
      <div class="bank-trees">&#x1F333; &#x1F3E1; &#x1F332;</div>
    </div>
  </div>
  <div class="ctrl-row">
    <button class="ctrl-btn" onclick="doUndo()">&#x21A9; Undo</button>
    <button class="ctrl-btn" onclick="doReset()">&#x1F504; Reset</button>
    <button class="ctrl-btn" onclick="toggleRules()">&#x1F4DC; Rules</button>
    <button class="ctrl-btn" onclick="giveHint()">&#x1F4A1; Hint</button>
    <button class="ctrl-btn" id="solToggle" onclick="toggleSolution()">&#x1F511; Solution</button>
  </div>
  <div class="rules-box" id="rulesBox">
    <h3>&#x1F4DC; Game Rules</h3>
    <div class="rules-grid">
      <div class="rule-item"><span class="ri">&#x1F6A3;</span><span><b>Drivers:</b> Only Father, Mother, or Policeman can drive.</span></div>
      <div class="rule-item"><span class="ri">&#x26F5;</span><span><b>Raft:</b> Max 2 people. Needs at least 1 driver.</span></div>
      <div class="rule-item"><span class="ri">&#x1F9B9;</span><span><b>Thief:</b> Cannot be with family without the Policeman.</span></div>
      <div class="rule-item"><span class="ri">&#x1F467;</span><span><b>Daughters:</b> Cannot be with Father unless Mother is present.</span></div>
      <div class="rule-item"><span class="ri">&#x1F466;</span><span><b>Sons:</b> Cannot be with Mother unless Father is present.</span></div>
      <div class="rule-item"><span class="ri">&#x1F3C6;</span><span><b>Win:</b> All 6 characters reach the Destination!</span></div>
    </div>
  </div>
  <div class="solution-box" id="solutionBox">
    <h3>&#x1F511; Verified Solution (7 Sail Moves)</h3>
    <div id="solSteps"></div>
    <button class="sol-auto-btn" id="autoPlayBtn" onclick="autoPlayNext()">&#x25B6; Auto-Play Next Step</button>
  </div>
</div>
<div class="overlay" id="overGameOver">
  <div class="overlay-card">
    <div class="oc-icon">&#x1F6A8;</div>
    <h2>Rule Violated!</h2>
    <p id="goMsg">Something went wrong...</p>
    <div>
      <button class="ol-btn ghost" onclick="doUndo()">&#x21A9; Undo</button>
      <button class="ol-btn orange" onclick="doReset()">&#x1F504; Try Again</button>
    </div>
  </div>
</div>
<div class="overlay" id="overWin">
  <div class="overlay-card">
    <div class="oc-icon">&#x1F389;&#x1F3C6;&#x1F389;</div>
    <h2>You Won!</h2>
    <p>All characters crossed safely!<br><span class="oc-moves" id="winMoves">0 moves</span></p>
    <button class="ol-btn green" onclick="doReset()">&#x1F504; Play Again</button>
  </div>
</div>
<script>
var CHARS=[
{id:'father',emoji:'\u{1F468}',name:'Father',css:'c-father',driver:true},
{id:'mother',emoji:'\u{1F469}',name:'Mother',css:'c-mother',driver:true},
{id:'son',emoji:'\u{1F466}',name:'Son',css:'c-son',driver:false},
{id:'daughter',emoji:'\u{1F467}',name:'Daughter',css:'c-daughter',driver:false},
{id:'policeman',emoji:'\u{1F46E}',name:'Police',css:'c-police',driver:true},
{id:'thief',emoji:'\u{1F9B9}',name:'Prisoner',css:'c-thief',driver:false}
];

var SOLUTION=[
{passengers:['policeman','thief'],dir:'right',desc:'👮 Policeman + 🧑‍🦱 Prisoner → Right'},
{passengers:['policeman'],dir:'left',desc:'👮 Policeman ← Left'},
{passengers:['father','daughter'],dir:'right',desc:'👨 Father + 👧 Daughter → Right'},
{passengers:['father'],dir:'left',desc:'👨 Father ← Left'},
{passengers:['mother','son'],dir:'right',desc:'👩 Mother + 👦 Son → Right'},
{passengers:['mother'],dir:'left',desc:'👩 Mother ← Left'},
{passengers:['policeman','thief'],dir:'right',desc:'👮 Policeman + 🧑‍🦱 Prisoner → Right'}
];

var S={},historyStack=[],moves=0,dead=false,autoStep=0,autoPlaying=false;
function init(){S={left:CHARS.map(function(c){return c.id}),right:[],raft:[],side:'left'};historyStack=[];moves=0;dead=false;autoStep=0;autoPlaying=false;hide('overGameOver');hide('overWin');msg('\\u{1F4A1} Click a character to board the raft, then press Sail!','');renderSolution();draw();}
function draw(){el('sMoves').textContent=moves;el('sCrossed').textContent=S.right.length;renderBank('leftChars',S.left);renderBank('rightChars',S.right);for(var i=0;i<2;i++){var sl=el('slot'+i);if(S.raft[i]){sl.innerHTML='';sl.appendChild(charEl(S.raft[i],'raft'));sl.classList.add('filled');}else{sl.innerHTML='Empty';sl.classList.remove('filled');}}var rw=el('raftWrapper');rw.classList.remove('pos-left','pos-right');rw.classList.add('pos-'+S.side);var sb=el('sailBtn');var hasD=S.raft.some(function(id){return getC(id).driver});sb.disabled=S.raft.length===0||!hasD||dead;sb.textContent=S.side==='left'?'\\u26F5 Sail \\u2192':'\\u26F5 \\u2190 Sail';el('driverWarn').style.display=(S.raft.length>0&&!hasD&&!dead)?'block':'none';renderSolution();}
function renderBank(elId,ids){var c=el(elId);c.innerHTML='';ids.forEach(function(id){c.appendChild(charEl(id,'bank'))});}
function charEl(id,loc){var c=getC(id);var d=document.createElement('div');d.className='char-card '+c.css;d.onclick=function(){clickChar(id,loc)};var h='<div class="emoji">'+c.emoji+'</div><div class="cname">'+c.name+'</div>';if(c.driver)h+='<div class="driver-icon">\\u{1F6A3}</div>';d.innerHTML=h;return d;}
function getC(id){return CHARS.find(function(c){return c.id===id});}
function el(id){return document.getElementById(id);}
function clickChar(id,loc){if(dead)return;if(loc==='raft'){save();S.raft=S.raft.filter(function(x){return x!==id});S[S.side==='left'?'left':'right'].push(id);msg('\\u2705 '+getC(id).name+' left the raft','');draw();return;}var onLeft=S.left.includes(id);var bankSide=onLeft?'left':'right';if(bankSide!==S.side){msg('\\u{1F6AB} The raft is on the other side!','warn');return;}if(S.raft.length>=2){msg('\\u{1F6AB} The raft is full! (Max 2)','warn');return;}save();if(onLeft)S.left=S.left.filter(function(x){return x!==id});else S.right=S.right.filter(function(x){return x!==id});S.raft.push(id);msg('\\u2705 '+getC(id).name+' boarded the raft','');draw();}
function doSail(){if(dead)return;if(S.raft.length===0)return;if(!S.raft.some(function(id){return getC(id).driver})){msg('\\u{1F6AB} Need a driver! (Father, Mother, or Policeman)','err');return;}save();var ns=S.side==='left'?'right':'left';S.side=ns;var bank=ns==='left'?'left':'right';S.raft.forEach(function(id){S[bank].push(id)});S.raft=[];moves++;draw();var v=checkAll();if(v){dead=true;el('goMsg').textContent=v;show('overGameOver');return;}if(S.right.length===6){el('winMoves').textContent=moves+' move'+(moves!==1?'s':'');show('overWin');spawnConfetti();return;}msg('\\u26F5 Sailed to the '+ns+' bank! (Move #'+moves+')','ok');}
function checkAll(){return checkBank(S.left,'Left Bank')||checkBank(S.right,'Right Bank');}
function checkBank(b,name){if(!b.length)return null;var h=function(id){return b.includes(id)};var thief=h('thief'),police=h('policeman'),fa=h('father'),mo=h('mother');var sons=h('son'), daughters=h('daughter');var family=fa||mo||sons||daughters;if(thief&&family&&!police)return '\\u{1F6A8} '+name+': Thief is with family without the Policeman!';if(daughters&&fa&&!mo)return '\\u{1F6A8} '+name+': Daughter(s) left with Father without Mother!';if(sons&&mo&&!fa)return '\\u{1F6A8} '+name+': Son(s) left with Mother without Father!';return null;}
function save(){historyStack.push(JSON.parse(JSON.stringify({s:S,m:moves,a:autoStep})));if(historyStack.length>60)historyStack.shift();}
function doUndo(){if(!historyStack.length){msg('\\u{1F6AB} Nothing to undo!','warn');return;}var p=historyStack.pop();S=p.s;moves=p.m;autoStep=p.a;dead=false;hide('overGameOver');msg('\\u21A9 Move undone!','');draw();}
function doReset(){init();}
function toggleRules(){el('rulesBox').classList.toggle('show');}
function toggleSolution(){el('solutionBox').classList.toggle('show');el('solToggle').classList.toggle('active');}
function renderSolution(){var container=el('solSteps');if(!container)return;container.innerHTML='';SOLUTION.forEach(function(step,i){var div=document.createElement('div');div.className='sol-step';if(i<autoStep)div.className+=' done';else if(i===autoStep)div.className+=' current';var arrow=step.dir==='right'?'\\u2192':'\\u2190';div.innerHTML='<div class="step-num">'+(i+1)+'</div><span class="arrow">'+arrow+'</span><span class="step-text">'+step.desc+'</span>';container.appendChild(div);});var btn=el('autoPlayBtn');if(btn){btn.disabled=autoStep>=SOLUTION.length||dead;btn.textContent=autoStep>=SOLUTION.length?'\\u2705 Solution Complete':'\\u25B6 Auto-Play Step '+(autoStep+1);}}
function autoPlayNext(){if(autoStep>=SOLUTION.length||dead||autoPlaying)return;autoPlaying=true;var step=SOLUTION[autoStep];if(S.raft.length>0){msg('\\u{1F6AB} Clear the raft first!','warn');autoPlaying=false;return;}var srcSide=step.dir==='right'?'left':'right';if(S.side!==srcSide){msg('\\u{1F6AB} Raft is on the wrong side!','warn');autoPlaying=false;return;}save();step.passengers.forEach(function(id){S[srcSide]=S[srcSide].filter(function(x){return x!==id});S.raft.push(id);});draw();setTimeout(function(){var ns=step.dir;S.side=ns;S.raft.forEach(function(id){S[ns].push(id)});S.raft=[];moves++;autoStep++;draw();var v=checkAll();if(v){dead=true;el('goMsg').textContent=v;show('overGameOver');autoPlaying=false;return;}if(S.right.length===6){el('winMoves').textContent=moves+' move'+(moves!==1?'s':'');show('overWin');spawnConfetti();autoPlaying=false;return;}msg('\\u26F5 Step '+autoStep+'/'+SOLUTION.length+' complete!','ok');autoPlaying=false;},800);}
function giveHint(){if(autoStep<SOLUTION.length){var next=SOLUTION[autoStep];msg('\\u{1F4A1} Next: '+next.desc,'');}else{var hints=["\\u{1F4A1} Start by sending the Policeman and Thief across first.","\\u{1F4A1} The Policeman often needs to shuttle back and forth.","\\u{1F4A1} Try moving sons with the Policeman or Father.","\\u{1F4A1} Think carefully about who brings the raft back!"];msg(hints[Math.floor(Math.random()*hints.length)],'');}}
function msg(text,type){var b=el('msgBar');b.textContent=text;b.className='msg-bar';if(type)b.classList.add(type);}
function show(id){el(id).classList.add('show');}
function hide(id){el(id).classList.remove('show');}
function makeStars(){var c=el('starsContainer');for(var i=0;i<80;i++){var s=document.createElement('div');s.className='star';var sz=Math.random()*3+1;Object.assign(s.style,{width:sz+'px',height:sz+'px',left:Math.random()*100+'%',top:Math.random()*100+'%',animationDelay:(Math.random()*3)+'s',animationDuration:(Math.random()*2+1.5)+'s'});c.appendChild(s);}}
function spawnConfetti(){var colors=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6eb4','#a855f7','#06d6a0'];for(var i=0;i<60;i++){var p=document.createElement('div');p.className='confetti-piece';var c=colors[Math.floor(Math.random()*colors.length)];var shapes=['50%','4px','0'];Object.assign(p.style,{left:Math.random()*100+'%',top:'-20px',width:(Math.random()*8+6)+'px',height:(Math.random()*8+6)+'px',background:c,borderRadius:shapes[Math.floor(Math.random()*shapes.length)],animationDuration:(Math.random()*2+2)+'s',animationDelay:(Math.random()*1.5)+'s'});document.body.appendChild(p);setTimeout(function(){p.remove()},5000);}}
makeStars();init();
</script>
</body>
</html>`;

// import { useEffect, useRef } from "react";

// export function App() {
// 	const iframeRef = useRef<HTMLIFrameElement>(null);

// 	useEffect(() => {
// 		if (iframeRef.current) {
// 			const doc = iframeRef.current.contentDocument;
// 			if (doc) {
// 				doc.open();
// 				doc.write(GAME_HTML);
// 				doc.close();
// 			}
// 		}
// 	}, []);

// 	return (
// 		<iframe
// 			ref={iframeRef}
// 			title="River Crossing Puzzle"
// 			style={{
// 				width: "100vw",
// 				height: "100vh",
// 				border: "none",
// 				margin: 0,
// 				padding: 0,
// 				display: "block",
// 			}}
// 		/>
// 	);
// }

// const GAME_HTML = `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
// <title>River Crossing Puzzle</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');

//   * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

//   body {
//     font-family: 'Nunito', sans-serif;
//     background: #0f172a;
//     color: white;
//     overflow-x: hidden;
//     line-height: 1.4;
//   }

//   /* Responsive Container */
//   .game-wrapper {
//     display: flex;
//     flex-direction: column;
//     min-height: 100vh;
//     padding: 10px;
//     max-width: 800px;
//     margin: 0 auto;
//   }

//   .header { text-align: center; padding: 10px 0; }
//   .header h1 { font-family: 'Fredoka One', cursive; font-size: 1.8rem; color: #fbbf24; }

//   .stats-row {
//     display: flex;
//     justify-content: center;
//     gap: 10px;
//     margin: 10px 0;
//   }
//   .stat-badge {
//     background: rgba(255,255,255,0.1);
//     padding: 5px 12px;
//     border-radius: 15px;
//     font-size: 0.9rem;
//     font-weight: bold;
//   }

//   /* The Message Bar - Key for Readability */
//   .msg-bar {
//     background: #1e293b;
//     border: 1px solid #334155;
//     padding: 12px;
//     border-radius: 10px;
//     text-align: center;
//     font-size: 0.95rem;
//     margin-bottom: 15px;
//     min-height: 50px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
//   .msg-bar.err { background: #7f1d1d; border-color: #ef4444; }
//   .msg-bar.ok { background: #064e3b; border-color: #10b981; }

//   /* GAME BOARD LAYOUT */
//   .board {
//     display: flex;
//     flex-direction: column; /* Mobile First: Vertical Stack */
//     gap: 15px;
//     flex: 1;
//   }

//   .bank {
//     background: linear-gradient(to bottom, #15803d, #14532d);
//     border-radius: 15px;
//     padding: 15px;
//     min-height: 100px;
//     box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);
//   }

//   .bank-label {
//     font-family: 'Fredoka One', cursive;
//     font-size: 0.8rem;
//     text-transform: uppercase;
//     color: #bbf7d0;
//     margin-bottom: 10px;
//     display: block;
//   }

//   .bank-chars {
//     display: flex;
//     flex-wrap: wrap;
//     gap: 10px;
//     justify-content: center;
//   }

//   /* River and Raft Zone */
//   .river-zone {
//     background: #0369a1;
//     padding: 20px 10px;
//     border-radius: 15px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 15px;
//     position: relative;
//     overflow: hidden;
//   }

//   .raft-body {
//     width: 100%;
//     max-width: 200px;
//     background: #78350f;
//     border: 3px solid #451a03;
//     border-radius: 12px;
//     padding: 10px;
//     display: flex;
//     justify-content: space-around;
//     min-height: 80px;
//     box-shadow: 0 10px 20px rgba(0,0,0,0.4);
//   }

//   /* Character Cards - Optimized for Touch */
//   .char-card {
//     width: 65px;
//     height: 75px;
//     border-radius: 10px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     font-weight: 800;
//     border: 2px solid rgba(255,255,255,0.2);
//     position: relative;
//   }
//   .char-card .emoji { font-size: 1.5rem; }
//   .char-card .cname { font-size: 0.65rem; margin-top: 4px; text-transform: uppercase; }
//   .char-card.driver::after {
//     content: '⚓';
//     position: absolute;
//     top: -5px;
//     right: -5px;
//     background: #fbbf24;
//     font-size: 10px;
//     border-radius: 50%;
//     width: 18px;
//     height: 18px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: #000;
//   }

//   .c-father { background: #2563eb; }
//   .c-mother { background: #db2777; }
//   .c-son { background: #60a5fa; }
//   .c-daughter { background: #f472b6; }
//   .c-police { background: #475569; }
//   .c-thief { background: #713f12; }

//   /* Controls */
//   .sail-btn {
//     width: 100%;
//     max-width: 250px;
//     padding: 15px;
//     font-family: 'Fredoka One', cursive;
//     font-size: 1.2rem;
//     border: none;
//     border-radius: 50px;
//     background: #f59e0b;
//     color: white;
//     cursor: pointer;
//     box-shadow: 0 4px 0 #b45309;
//   }
//   .sail-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #b45309; }
//   .sail-btn:disabled { background: #64748b; box-shadow: 0 4px 0 #334155; opacity: 0.6; }

//   .ctrl-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 10px;
//     margin-top: 15px;
//   }
//   .ctrl-btn {
//     padding: 10px;
//     background: #334155;
//     border: none;
//     border-radius: 8px;
//     color: white;
//     font-weight: bold;
//     font-size: 0.85rem;
//   }

//   /* Rules Box */
//   .rules-box {
//     margin-top: 20px;
//     background: rgba(0,0,0,0.4);
//     padding: 15px;
//     border-radius: 12px;
//     font-size: 0.85rem;
//     display: none;
//   }
//   .rules-box.show { display: block; }
//   .rule-item { margin-bottom: 8px; display: flex; gap: 8px; }

//   /* Desktop Adjustments */
//   @media (min-width: 600px) {
//     .board { flex-direction: row; align-items: stretch; height: 400px; }
//     .bank { flex: 1; }
//     .river-zone { flex: 1.5; justify-content: center; }
//     .header h1 { font-size: 2.5rem; }
//     .char-card { width: 80px; height: 95px; }
//     .char-card .emoji { font-size: 2rem; }
//   }

//   /* Overlays */
//   .overlay {
//     position: fixed; inset: 0; background: rgba(0,0,0,0.9);
//     display: none; align-items: center; justify-content: center; z-index: 100; padding: 20px;
//   }
//   .overlay.show { display: flex; }
//   .overlay-card { background: #1e293b; padding: 30px; border-radius: 20px; text-align: center; width: 100%; max-width: 400px; }
// </style>
// </head>
// <body>

// <div class="game-wrapper">
//   <div class="header">
//     <h1>River Crossing</h1>
//     <div class="stats-row">
//       <div class="stat-badge">Moves: <span id="sMoves">0</span></div>
//       <div class="stat-badge">Safe: <span id="sCrossed">0</span>/6</div>
//     </div>
//   </div>

//   <div class="msg-bar" id="msgBar">Tap a person to board the raft!</div>

//   <div class="board">
//     <div class="bank" id="leftBank">
//       <span class="bank-label">Start Side</span>
//       <div class="bank-chars" id="leftChars"></div>
//     </div>

//     <div class="river-zone">
//       <div class="raft-body" id="raftBody">
//         <div id="slot0"></div>
//         <div id="slot1"></div>
//       </div>
//       <button class="sail-btn" id="sailBtn" onclick="doSail()">SAIL</button>
//     </div>

//     <div class="bank" id="rightBank">
//       <span class="bank-label">Goal Side</span>
//       <div class="bank-chars" id="rightChars"></div>
//     </div>
//   </div>

//   <div class="ctrl-row">
//     <button class="ctrl-btn" onclick="doUndo()">Undo</button>
//     <button class="ctrl-btn" onclick="doReset()">Reset</button>
//     <button class="ctrl-btn" onclick="toggleRules()">Rules</button>
//     <button class="ctrl-btn" onclick="toggleSolution()">Solution</button>
//   </div>

//   <div class="rules-box" id="rulesBox">
//     <div class="rule-item"><span>⚠️</span> Raft needs a driver (Father, Mother, or Police).</div>
//     <div class="rule-item"><span>⚠️</span> Max 2 people on raft.</div>
//     <div class="rule-item"><span>⚠️</span> Thief cannot be with family without Police.</div>
//     <div class="rule-item"><span>⚠️</span> Daughters cannot be with Father without Mother.</div>
//     <div class="rule-item"><span>⚠️</span> Sons cannot be with Mother without Father.</div>
//   </div>

//   <div class="rules-box" id="solutionBox" style="background: #1e1b4b;">
//     <p><strong>Step 1:</strong> Police + Thief →<br>
//     <strong>Step 2:</strong> Police ←<br>
//     <strong>Step 3:</strong> Police + Son/Daughter →<br>
//     ... (Use the Auto-Hint in-game for more)</p>
//   </div>
// </div>

// <div class="overlay" id="overGameOver">
//   <div class="overlay-card">
//     <h2 style="color: #ef4444; margin-bottom: 10px;">Rule Broken!</h2>
//     <p id="goMsg" style="margin-bottom: 20px;"></p>
//     <button class="sail-btn" onclick="doUndo()">Back One Move</button>
//   </div>
// </div>

// <div class="overlay" id="overWin">
//   <div class="overlay-card">
//     <h2 style="color: #10b981; margin-bottom: 10px;">Success!</h2>
//     <p style="margin-bottom: 20px;">You got everyone across safely!</p>
//     <button class="sail-btn" onclick="doReset()">Play Again</button>
//   </div>
// </div>

// <script>
// // Game State & Logic (Condensed for space)
// var CHARS=[
//   {id:'father',emoji:'👨',name:'Father',css:'c-father',driver:true},
//   {id:'mother',emoji:'👩',name:'Mother',css:'c-mother',driver:true},
//   {id:'son',emoji:'👦',name:'Son',css:'c-son',driver:false},
//   {id:'daughter',emoji:'👧',name:'Daughter',css:'c-daughter',driver:false},
//   {id:'policeman',emoji:'👮',name:'Police',css:'c-police',driver:true},
//   {id:'thief',emoji:'🧑‍🦱',name:'Prisoner',css:'c-thief',driver:false}
// ];

// var S, historyStack=[], moves=0, dead=false;

// function init(){
//   S={left:CHARS.map(c=>c.id), right:[], raft:[], side:'left'};
//   historyStack=[]; moves=0; dead=false;
//   hide('overGameOver'); hide('overWin');
//   msg("Select passengers and tap SAIL");
//   draw();
// }

// function draw(){
//   document.getElementById('sMoves').textContent = moves;
//   document.getElementById('sCrossed').textContent = S.right.length;

//   renderBank('leftChars', S.left);
//   renderBank('rightChars', S.right);

//   // Render Raft
//   for(let i=0; i<2; i++){
//     let slot = document.getElementById('slot'+i);
//     slot.innerHTML = S.raft[i] ? '' : '<div style="opacity:0.2; font-size:0.7rem;">Empty</div>';
//     if(S.raft[i]) slot.appendChild(charEl(S.raft[i], 'raft'));
//   }

//   let hasDriver = S.raft.some(id => CHARS.find(c=>c.id===id).driver);
//   let btn = document.getElementById('sailBtn');
//   btn.disabled = S.raft.length === 0 || !hasDriver || dead;
//   btn.textContent = S.side === 'left' ? 'SAIL →' : '← SAIL';
// }

// function renderBank(elId, ids){
//   const container = document.getElementById(elId);
//   container.innerHTML = '';
//   ids.forEach(id => container.appendChild(charEl(id, 'bank')));
// }

// function charEl(id, loc){
//   const c = CHARS.find(x=>x.id===id);
//   const d = document.createElement('div');
//   d.className = 'char-card ' + c.css + (c.driver ? ' driver' : '');
//   d.innerHTML = '<div class="emoji">'+c.emoji+'</div><div class="cname">'+c.name+'</div>';
//   d.onclick = () => clickChar(id, loc);
//   return d;
// }

// function clickChar(id, loc){
//   if(dead) return;
//   save();
//   if(loc === 'raft'){
//     S.raft = S.raft.filter(x => x !== id);
//     S[S.side].push(id);
//   } else {
//     if(S.side === (S.left.includes(id) ? 'left' : 'right')){
//       if(S.raft.length < 2){
//         S[S.side] = S[S.side].filter(x => x !== id);
//         S.raft.push(id);
//       } else { msg("Raft is full!", "err"); return; }
//     } else { msg("Raft is on other side!", "err"); return; }
//   }
//   draw();
// }

// function doSail(){
//   save();
//   let oldSide = S.side;
//   S.side = (S.side === 'left' ? 'right' : 'left');
//   S.raft.forEach(id => S[S.side].push(id));
//   S.raft = [];
//   moves++;

//   let violation = checkRules();
//   if(violation){
//     dead = true;
//     document.getElementById('goMsg').textContent = violation;
//     show('overGameOver');
//   } else if(S.right.length === 6){
//     show('overWin');
//   }
//   draw();
// }

// function checkRules(){
//   const banks = [S.left, S.right];
//   for(let b of banks){
//     const h = (id) => b.includes(id);
//     if(h('thief') && (h('father')||h('mother')||h('son')||h('daughter')) && !h('policeman'))
//       return "The Prisoner attacked the family!";
//     if(h('daughter') && h('father') && !h('mother'))
//       return "The Mother can't leave daughters with the Father alone!";
//     if(h('son') && h('mother') && !h('father'))
//       return "The Father can't leave sons with the Mother alone!";
//   }
//   return null;
// }

// function save(){ historyStack.push(JSON.parse(JSON.stringify(S))); }
// function doUndo(){ if(historyStack.length){ S = historyStack.pop(); dead=false; hide('overGameOver'); draw(); } }
// function doReset(){ init(); }
// function toggleRules(){ document.getElementById('rulesBox').classList.toggle('show'); }
// function toggleSolution(){ document.getElementById('solutionBox').classList.toggle('show'); }
// function msg(t, cls=""){ const m = document.getElementById('msgBar'); m.textContent=t; m.className="msg-bar "+cls; }
// function show(id){ document.getElementById(id).classList.add('show'); }
// function hide(id){ document.getElementById(id).classList.remove('show'); }

// init();
// </script>
// </body>
// </html>`;
