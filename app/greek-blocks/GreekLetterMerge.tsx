"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";

const LETTERS=["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"];
const COLS=8,ROWS=13;
type Piece={id:number,l:string,x:number,y:number,level:number,falling:boolean};
type Game={pieces:Piece[],nextId:number,selected:number|null,dragging:boolean,last:number,over:boolean,score:number,merges:number};
const palette=["#e8b87e","#87d9e7","#e9a3db","#a4e2a4","#e7db84"];
function initial():Game{return {pieces:[],nextId:1,selected:null,dragging:false,last:0,over:false,score:0,merges:0}}
export default function GreekLetterMerge(){
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<Game>(initial()),[active,setActive]=useState("α"),[score,setScore]=useState(0),[merges,setMerges]=useState(0),[over,setOver]=useState(false),[count,setCount]=useState(0);
 const activeRef=useRef("α");activeRef.current=active;
 const spawn=useCallback((letter:string)=>{const g=game.current;if(g.over)return;const x=3;if(g.pieces.some(p=>!p.falling&&p.x===x&&p.y<=0)){g.over=true;setOver(true);return}g.pieces.push({id:g.nextId++,l:letter,x,y:-1,level:1,falling:true});g.selected=g.pieces[g.pieces.length-1].id;setCount(g.pieces.length)},[]);
 const reset=()=>{game.current=initial();setScore(0);setMerges(0);setOver(false);setCount(0)};
 useEffect(()=>{
  const c=canvas.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
  let raf=0;let last=0;const w=480,h=650,cell=50,left=40,top=0;
  function occupied(x:number,y:number,exclude:number){return game.current.pieces.some(p=>p.id!==exclude&&p.x===x&&p.y===y)}
  function settle(p:Piece){p.falling=false;p.y=Math.max(0,p.y);game.current.selected=null;resolve()}
  function resolve(){
   const g=game.current;let changed=true,rounds=0;
   while(changed&&rounds++<20){
    changed=false;
    for(const p of [...g.pieces]){
     const cluster:Piece[]=[];const seen=new Set<number>();const queue=[p];
     while(queue.length){const q=queue.pop()!;if(seen.has(q.id))continue;seen.add(q.id);cluster.push(q);for(const n of g.pieces){if(!n.falling&&n.l===q.l&&n.level===q.level&&!seen.has(n.id)&&Math.abs(n.x-q.x)+Math.abs(n.y-q.y)===1)queue.push(n)}}
     if(cluster.length>=3){
      const triple=cluster.slice(0,3),base=triple[0];g.pieces=g.pieces.filter(q=>!triple.includes(q));g.pieces.push({...base,level:base.level+1,id:g.nextId++});
      g.score+=100*base.level*base.level;g.merges++;setScore(g.score);setMerges(g.merges);changed=true;
      // Gravity after a merge, with stable ordering per column.
      for(let x=0;x<COLS;x++){const col=g.pieces.filter(q=>!q.falling&&q.x===x).sort((a,b)=>b.y-a.y);col.forEach((q,i)=>q.y=ROWS-1-i)}
      break;
     }
    }
   }
   setCount(g.pieces.length);
   if(g.pieces.some(q=>q.y<0)){g.over=true;setOver(true)}
  }
  function tick(t:number){raf=requestAnimationFrame(tick);const g=game.current;
   if(t-last>410&&!g.over){last=t;for(const p of g.pieces.filter(p=>p.falling)){
    if(p.y+1>=ROWS||occupied(p.x,p.y+1,p.id)){settle(p)}else p.y++;
   }}
   ctx!.clearRect(0,0,w,h);
   const bg=ctx!.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#192d43");bg.addColorStop(1,"#0a1729");ctx!.fillStyle=bg;ctx!.fillRect(0,0,w,h);
   ctx!.strokeStyle="#8cc6db19";ctx!.lineWidth=1;
   for(let x=0;x<=COLS;x++){ctx!.beginPath();ctx!.moveTo(left+x*cell,0);ctx!.lineTo(left+x*cell,h);ctx!.stroke()}
   for(let y=0;y<=ROWS;y++){ctx!.beginPath();ctx!.moveTo(left,y*cell);ctx!.lineTo(left+COLS*cell,y*cell);ctx!.stroke()}
   ctx!.fillStyle="#e6c18b";ctx!.font="bold 11px sans-serif";ctx!.textAlign="left";ctx!.fillText("GREEK LETTER LAB",10,18);
   for(const p of g.pieces){
    const x=left+p.x*cell+cell/2,y=(p.y+.5)*cell;if(y<0)continue;
    const color=palette[Math.min(p.level-1,palette.length-1)];
    ctx!.save();ctx!.textAlign="center";ctx!.textBaseline="middle";ctx!.font="bold "+(p.level>1?42:39)+"px Georgia,serif";
    // Layered offset silhouettes produce extruded glyphs, not printed cubes.
    ctx!.lineJoin="round";ctx!.lineWidth=2.5;
    for(let d=7;d>=1;d--){ctx!.strokeStyle="#152637";ctx!.fillStyle="#385269";ctx!.strokeText(p.l,x+d*.62,y+d*.65);ctx!.fillText(p.l,x+d*.62,y+d*.65)}
    ctx!.shadowColor=color;ctx!.shadowBlur=p.id===g.selected?24:8;ctx!.strokeStyle="#fff2cf";ctx!.fillStyle=color;ctx!.strokeText(p.l,x,y);ctx!.fillText(p.l,x,y);ctx!.shadowBlur=0;
    if(p.level>1){ctx!.font="bold 10px sans-serif";ctx!.fillStyle="#ffffff";ctx!.fillText("×"+p.level,x,y+23)}
    if(p.id===g.selected){ctx!.strokeStyle="#fff3a6aa";ctx!.setLineDash([3,4]);ctx!.strokeRect(left+p.x*cell+3,p.y*cell+3,cell-6,cell-6)}
    ctx!.restore();
   }
  }
  raf=requestAnimationFrame(tick);
  function cellAt(e:PointerEvent){const rect=c!.getBoundingClientRect();const px=(e.clientX-rect.left)*w/rect.width,py=(e.clientY-rect.top)*h/rect.height;return {x:Math.floor((px-left)/cell),y:Math.floor(py/cell)}}
  function down(e:PointerEvent){const g=game.current;if(g.over)return;const v=cellAt(e);const p=[...g.pieces].reverse().find(q=>q.x===v.x&&q.y===v.y);if(!p)return;g.selected=p.id;g.dragging=true;c!.setPointerCapture(e.pointerId)}
  function move(e:PointerEvent){const g=game.current;if(!g.dragging)return;const v=cellAt(e);const p=g.pieces.find(q=>q.id===g.selected);if(!p)return;const nx=Math.max(0,Math.min(COLS-1,v.x));if(nx!==p.x&&!occupied(nx,p.y,p.id))p.x=nx}
  function up(){const g=game.current;if(!g.dragging)return;g.dragging=false;const p=g.pieces.find(q=>q.id===g.selected);if(p){p.falling=true;g.last=0}g.selected=null}
  function key(e:KeyboardEvent){if(e.code==="Space"){e.preventDefault();spawn(activeRef.current)}if(e.key==="ArrowLeft"||e.key==="ArrowRight"){const p=game.current.pieces.find(q=>q.id===game.current.selected);if(p){const nx=Math.max(0,Math.min(COLS-1,p.x+(e.key==="ArrowLeft"?-1:1)));if(!occupied(nx,p.y,p.id))p.x=nx}}}
  c.addEventListener("pointerdown",down);c.addEventListener("pointermove",move);c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);window.addEventListener("keydown",key);
  return()=>{cancelAnimationFrame(raf);c.removeEventListener("pointerdown",down);c.removeEventListener("pointermove",move);c.removeEventListener("pointerup",up);c.removeEventListener("pointercancel",up);window.removeEventListener("keydown",key)};
 },[spawn]);
 return <main className="min-h-screen bg-[#090f1c] px-4 pb-24 pt-28 text-[#e9e7e2] md:px-8">
  <div className="mx-auto max-w-5xl"><Link href="/bible" className="text-xs uppercase tracking-[.22em] text-[#d2b685]">← The Bible</Link>
   <div className="mt-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.3em] text-[#d2b685]">Greek Arcade · Prototype 02</p><h1 className="mt-2 font-serif text-4xl md:text-6xl">Greek Letter Merge</h1><p className="mt-3 text-sm text-[#b3c4d2]">An arcade-style Greek keyboard and a fixed-view falling-letter world</p></div><div className="flex gap-7 text-center"><div><p className="text-xs text-[#9eb0c3]">SCORE</p><p className="text-2xl font-bold">{score}</p></div><div><p className="text-xs text-[#9eb0c3]">MERGES</p><p className="text-2xl font-bold">{merges}</p></div><div><p className="text-xs text-[#9eb0c3]">LETTERS</p><p className="text-2xl font-bold">{count}</p></div></div></div>
   <div className="mx-auto mt-8 max-w-[740px] rounded-[38px] border-[7px] border-[#31485f] bg-gradient-to-b from-[#2d4359] via-[#172638] to-[#0b1422] p-3 shadow-[0_28px_70px_#000a,inset_0_3px_2px_#b4d3ec55] md:p-6">
    <div className="relative mx-auto max-w-[520px] overflow-hidden rounded-2xl border-[8px] border-[#0a1727] bg-[#122238] shadow-[inset_0_0_30px_#000b,0_6px_18px_#0007]">
      <canvas ref={canvas} width={480} height={650} className="block aspect-[480/650] w-full touch-none" aria-label="Fixed front-view Greek letter puzzle board. Drag letters horizontally to move them."/>
      {over&&<div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07111e]/90"><h2 className="font-serif text-4xl text-[#f6dbab]">Game Over</h2><p className="mt-3">Score {score}</p><button onClick={reset} className="mt-6 rounded-xl bg-[#e1bc7f] px-8 py-3 font-bold text-[#172536]">Play Again</button></div>}
    </div>
    <div className="mx-auto mt-5 flex max-w-[520px] items-center justify-between px-3"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7deda5] shadow-[0_0_12px_#7deda5]"/><span className="text-[10px] tracking-[.2em] text-[#b6cad9]">HELLENIC CONSOLE</span></div><button onClick={reset} className="rounded-full border border-white/20 px-4 py-2 text-xs text-[#d8e2e9] hover:bg-white/10">RESET</button></div>
    <div className="mx-auto mt-5 max-w-[620px] rounded-[25px] border border-[#708ba5]/40 bg-gradient-to-b from-[#30465f] to-[#152539] px-3 pb-6 pt-5 shadow-[inset_0_3px_5px_#b4cee633,0_12px_20px_#0009] md:px-6" style={{perspective:"850px"}}>
     <p className="mb-4 text-center text-[10px] font-bold tracking-[.38em] text-[#a5c0d2]">ΕΛΛΗΝΙΚΟ ΠΛΗΚΤΡΟΛΟΓΙΟ</p>
     <div className="grid grid-cols-6 gap-2 md:gap-3" style={{transform:"rotateX(10deg)",transformOrigin:"center bottom"}}>{LETTERS.map(l=><button key={l} onClick={()=>{setActive(l);spawn(l)}} title={`Drop ${l}`} className={`relative aspect-[1.12] rounded-lg border-b-[6px] border-r-[3px] font-serif text-2xl font-bold transition active:translate-y-[4px] active:border-b-[2px] md:text-3xl ${active===l?"border-b-[#74502c] border-r-[#aa7b43] bg-gradient-to-b from-[#ffdfa6] to-[#cfa46b] text-[#392817] shadow-[0_0_15px_#d8b47a55]":"border-b-[#111d2d] border-r-[#182738] bg-gradient-to-b from-[#9eafbe] via-[#60798f] to-[#344d66] text-[#fff4df] shadow-[inset_0_2px_2px_#ffffff77,0_5px_5px_#0007]"}`}>{l}</button>)}</div>
     <div className="mt-6 flex items-center gap-3"><div className="flex-1 text-xs leading-5 text-[#b6c9d7]">Press a key to drop a letter. Drag falling letters sideways in the playfield.</div><button disabled={over} onClick={()=>spawn(active)} className="rounded-xl border-b-[5px] border-[#8b5b37] bg-gradient-to-b from-[#f2d8a9] to-[#bc8754] px-5 py-3 font-bold text-[#33251c] active:translate-y-1 active:border-b-0 disabled:opacity-40">DROP ↓</button></div>
    </div>
   </div>
   <p className="mx-auto mt-5 max-w-[740px] text-center text-sm leading-7 text-[#a8bbcb]">Fixed front-view arcade board · Sculpted Greek letter silhouettes · Drag to move and release · Three adjacent identical letters merge into a larger letter. Keyboard uses 3D-styled keys; glyph extrusion is simulated in canvas, not a polygonal 3D mesh.</p>
  </div>
 </main>;
}