"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
const LETTERS=["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"];
type GameApi={drop:(letter:string)=>void,reset:()=>void,dispose:()=>void};
export default function GreekLetterMerge(){
 const mount=useRef<HTMLDivElement>(null),api=useRef<GameApi|null>(null);
 const [letter,setLetter]=useState("α"),[score,setScore]=useState(0),[merges,setMerges]=useState(0),[count,setCount]=useState(0),[status,setStatus]=useState("Loading 3D engine…"),[gameOver,setGameOver]=useState(false);
 const selected=useRef("α");selected.current=letter;
 useEffect(()=>{
  let cancelled=false;let cleanup=()=>{};
  (async()=>{
   try{
    const threeUrl="https://esm.sh/three@0.180.0";
    const cannonUrl="https://esm.sh/cannon-es@0.20.0";
    const [T,C]=await Promise.all([import(/* webpackIgnore: true */ threeUrl),import(/* webpackIgnore: true */ cannonUrl)]);
    if(cancelled||!mount.current)return;
    const host=mount.current;
    const scene=new T.Scene();scene.background=new T.Color("#101b26");scene.fog=new T.Fog("#101b26",24,65);
    const camera=new T.PerspectiveCamera(48,1,.1,120);
    const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);
    scene.add(new T.HemisphereLight("#c9e3ff","#4c3c2a",2.0));
    const sun=new T.DirectionalLight("#fff0d2",3);sun.position.set(-5,14,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-14;scene.add(sun);
    const world=new C.World({gravity:new C.Vec3(0,-19,0)});world.allowSleep=true;world.defaultContactMaterial.friction=.65;world.defaultContactMaterial.restitution=.12;
    const groundBody=new C.Body({mass:0,shape:new C.Box(new C.Vec3(6,.5,6)),position:new C.Vec3(0,-.5,0)});world.addBody(groundBody);
    const floor=new T.Mesh(new T.BoxGeometry(12,.8,12),new T.MeshStandardMaterial({color:"#293a46",roughness:.85}));floor.position.y=-.4;floor.receiveShadow=true;scene.add(floor);
    const grid=new T.GridHelper(12,12,"#647f91","#364c5d");grid.position.y=.012;scene.add(grid);
    const railMat=new T.MeshStandardMaterial({color:"#bb9161",metalness:.5,roughness:.35});
    for(const [x,z,sx,sz] of [[-6,0,.16,12],[6,0,.16,12],[0,-6,12,.16],[0,6,12,.16]]){
      const rail=new T.Mesh(new T.BoxGeometry(sx,.5,sz),railMat);rail.position.set(x,.22,z);scene.add(rail);
      const wall=new C.Body({mass:0,shape:new C.Box(new C.Vec3(sx/2,.6,sz/2)),position:new C.Vec3(x,.3,z)});world.addBody(wall);
    }
    const items:{mesh:any,body:any,letter:string,level:number,size:number,age:number}[]=[];
    const mats=new Map<string,any[]>();
    function material(l:string,level:number){
      const key=l+"-"+level;if(mats.has(key))return mats.get(key)!;
      const canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;
      const ctx=canvas.getContext("2d")!;ctx.fillStyle=["#c9aa75","#7eafba","#ba8dc5","#e7bd76","#93bfa0"][Math.min(level-1,4)];ctx.fillRect(0,0,256,256);
      ctx.strokeStyle="#ffffff55";ctx.lineWidth=12;ctx.strokeRect(12,12,232,232);
      ctx.fillStyle="#292334";ctx.font="bold 165px Georgia,serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(l,128,133);
      ctx.fillStyle="#403747";ctx.font="bold 20px sans-serif";ctx.fillText("LV "+level,128,227);
      const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
      const face=new T.MeshStandardMaterial({map:texture,roughness:.66,metalness:.05});
      const arr=[face,face,face,face,face,face];mats.set(key,arr);return arr;
    }
    let aimX=0,aimZ=0,angle=.65,elevation=.63,radius=23,dragging=false,lastX=0,lastY=0,dragged=false,over=false,frame=0,raf=0;
    const aim=new T.Mesh(new T.RingGeometry(.35,.45,32),new T.MeshBasicMaterial({color:"#ffe4a1",side:T.DoubleSide}));aim.rotation.x=-Math.PI/2;aim.position.y=.045;scene.add(aim);
    function spawn(l:string,level=1,x=aimX,z=aimZ,y=13){
      if(over)return;
      const size=1.05*Math.pow(1.3,level-1);
      const mesh=new T.Mesh(new T.BoxGeometry(size,size,size),material(l,level));mesh.castShadow=true;mesh.receiveShadow=true;mesh.position.set(x,y,z);scene.add(mesh);
      const body=new C.Body({mass:Math.pow(size,3),shape:new C.Box(new C.Vec3(size/2,size/2,size/2)),position:new C.Vec3(x,y,z),linearDamping:.12,angularDamping:.35});body.quaternion.setFromEuler((Math.random()-.5)*.15,(Math.random()-.5)*.15,0);world.addBody(body);
      items.push({mesh,body,letter:l,level,size,age:0});setCount(items.length);
    }
    function remove(item:typeof items[number]){
      scene.remove(item.mesh);item.mesh.geometry.dispose();world.removeBody(item.body);const i=items.indexOf(item);if(i>=0)items.splice(i,1);
    }
    function merge(){
      const used=new Set<typeof items[number]>();
      for(const a of [...items]){
       if(used.has(a)||a.age<.8||a.body.position.y>11)continue;
       const near=items.filter(b=>!used.has(b)&&b.letter===a.letter&&b.level===a.level&&b.age>.8&&Math.hypot(b.body.position.x-a.body.position.x,b.body.position.y-a.body.position.y,b.body.position.z-a.body.position.z)<a.size*2.15);
       if(near.length<3)continue;
       const trio=near.slice(0,3);trio.forEach(v=>used.add(v));
       const x=trio.reduce((s,v)=>s+v.body.position.x,0)/3,z=trio.reduce((s,v)=>s+v.body.position.z,0)/3,y=Math.max(2,trio.reduce((s,v)=>s+v.body.position.y,0)/3+1.5);
       trio.forEach(remove);spawn(a.letter,a.level+1,Math.max(-4.5,Math.min(4.5,x)),Math.max(-4.5,Math.min(4.5,z)),y);
       setMerges(v=>v+1);setScore(v=>v+100*a.level*a.level);setCount(items.length);break;
      }
    }
    function reset(){for(const i of [...items])remove(i);setCount(0);setScore(0);setMerges(0);setGameOver(false);over=false;aimX=0;aimZ=0}
    function updateCamera(){camera.position.set(radius*Math.sin(angle)*Math.cos(elevation),radius*Math.sin(elevation),radius*Math.cos(angle)*Math.cos(elevation));camera.lookAt(0,4,0)}
    const onDown=(e:PointerEvent)=>{dragging=true;dragged=false;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
    const onMove=(e:PointerEvent)=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)dragged=true;angle-=dx*.008;elevation=Math.max(.15,Math.min(1.4,elevation+dy*.006));lastX=e.clientX;lastY=e.clientY};
    const onUp=()=>{dragging=false};
    const onWheel=(e:WheelEvent)=>{e.preventDefault();radius=Math.max(13,Math.min(38,radius+e.deltaY*.02))};
    const onKey=(e:KeyboardEvent)=>{if(e.code==="Space"&&!(e.target instanceof HTMLInputElement)){e.preventDefault();spawn(selected.current)}if(e.key==="ArrowLeft")aimX=Math.max(-5,aimX-.6);if(e.key==="ArrowRight")aimX=Math.min(5,aimX+.6);if(e.key==="ArrowUp")aimZ=Math.max(-5,aimZ-.6);if(e.key==="ArrowDown")aimZ=Math.min(5,aimZ+.6)};
    renderer.domElement.addEventListener("pointerdown",onDown);renderer.domElement.addEventListener("pointermove",onMove);renderer.domElement.addEventListener("pointerup",onUp);renderer.domElement.addEventListener("pointercancel",onUp);renderer.domElement.addEventListener("wheel",onWheel,{passive:false});window.addEventListener("keydown",onKey);
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};const observer=new ResizeObserver(resize);observer.observe(host);resize();
    let last=performance.now(),acc=0;
    function tick(now:number){raf=requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;acc+=dt;while(acc>=1/60){world.step(1/60);acc-=1/60}
      frame++;if(frame%12===0)merge();
      for(const item of items){item.age+=dt;item.mesh.position.copy(item.body.position);item.mesh.quaternion.copy(item.body.quaternion);if(item.body.position.y>11&&item.age>5&&!over){over=true;setGameOver(true)}}
      aim.position.x=aimX;aim.position.z=aimZ;updateCamera();renderer.render(scene,camera);
    }
    raf=requestAnimationFrame(tick);api.current={drop:l=>spawn(l),reset,dispose:()=>{}};
    setStatus("Ready — select a Greek letter and drop!");
    cleanup=()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener("keydown",onKey);renderer.domElement.removeEventListener("pointerdown",onDown);renderer.domElement.removeEventListener("pointermove",onMove);renderer.domElement.removeEventListener("pointerup",onUp);renderer.domElement.removeEventListener("pointercancel",onUp);renderer.domElement.removeEventListener("wheel",onWheel);for(const i of [...items])remove(i);for(const arr of mats.values()){arr[0].map.dispose();arr[0].dispose()}renderer.dispose();if(host.contains(renderer.domElement))host.removeChild(renderer.domElement);api.current=null};
   }catch(e){setStatus("3D engine failed to load. Check your network and refresh.");console.error(e)}
  })();
  return()=>{cancelled=true;cleanup()};
 },[]);
 return <main className="min-h-screen bg-[#0b1119] px-4 pb-20 pt-28 text-[#eee9dd] md:px-10">
  <div className="mx-auto max-w-7xl">
   <Link href="/bible" className="text-xs uppercase tracking-[.25em] text-[#bfa77c]">← The Bible</Link>
   <div className="mt-7 flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.3em] text-[#bfa77c]">Interactive 3D language laboratory</p><h1 className="mt-2 font-serif text-4xl md:text-6xl">Greek Letter Merge</h1><p className="mt-3 text-sm text-[#aab7c4]">Drop Greek letter cubes · Match three nearby cubes · Grow their level</p></div>
    <div className="flex gap-6 text-center"><div><p className="text-xs text-[#9caab9]">SCORE</p><p className="text-2xl font-bold">{score}</p></div><div><p className="text-xs text-[#9caab9]">MERGES</p><p className="text-2xl font-bold">{merges}</p></div><div><p className="text-xs text-[#9caab9]">BLOCKS</p><p className="text-2xl font-bold">{count}</p></div></div>
   </div>
   <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_310px]">
    <div className="relative overflow-hidden rounded-2xl border border-[#526374] bg-[#101b26]">
      <div ref={mount} className="h-[510px] w-full md:h-[660px]" aria-label="Interactive 3D Greek block game"/>
      <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-black/45 px-3 py-2 text-xs text-[#dce3e8]">Drag: orbit camera · Scroll: zoom<br/>Arrow keys: move drop point · Space: drop</div>
      {gameOver&&<div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1119]/85"><h2 className="font-serif text-4xl">Stack Overflow!</h2><p className="mt-3">Final score: {score}</p><button className="mt-6 rounded-lg bg-[#cba56d] px-7 py-3 font-bold text-[#1b1b1b]" onClick={()=>api.current?.reset()}>Play again</button></div>}
      <div className="absolute bottom-3 left-4 text-xs text-[#c5d2da]">{status}</div>
    </div>
    <aside className="rounded-2xl border border-[#465363] bg-[#16212c] p-5">
      <p className="text-xs uppercase tracking-[.25em] text-[#c7ac7e]">Greek keyboard</p>
      <p className="mt-2 text-sm text-[#aab7c4]">Choose a letter, then press DROP.</p>
      <div className="mt-5 grid grid-cols-4 gap-2">{LETTERS.map(l=><button key={l} onClick={()=>setLetter(l)} aria-pressed={letter===l} className={`aspect-square rounded-lg border font-serif text-2xl transition ${letter===l?"border-[#e8c58c] bg-[#bba071] text-[#1a2026]":"border-white/10 bg-white/5 hover:bg-white/15"}`}>{l}</button>)}</div>
      <button disabled={gameOver||status.startsWith("Loading")||status.startsWith("3D engine failed")} onClick={()=>api.current?.drop(letter)} className="mt-5 w-full rounded-xl bg-[#d7ae72] py-4 text-lg font-bold text-[#18212b] transition hover:bg-[#f0cb93] disabled:opacity-40">DROP {letter} ↓</button>
      <button onClick={()=>api.current?.reset()} className="mt-3 w-full rounded-lg border border-white/20 py-3 text-sm hover:bg-white/10">Restart game</button>
      <div className="mt-7 border-t border-white/10 pt-5 text-sm leading-7 text-[#bbc7d0]"><p className="font-semibold text-[#e7d1a8]">How to play</p><p>Drop cubes into the 3D arena. Three nearby cubes with the same Greek letter and level merge into one larger cube. Keep the stack below the danger height.</p><p className="mt-3 text-xs text-[#93a4b3]">Prototype: WebGL 3D + rigid-body physics. Requires an internet connection to load the 3D modules.</p></div>
    </aside>
   </div>
  </div>
 </main>;
}