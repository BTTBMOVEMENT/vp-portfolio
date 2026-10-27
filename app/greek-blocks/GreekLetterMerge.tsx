"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
const LETTERS=["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","ο","π","ρ","σ","τ","υ","φ","χ","ψ","ω"];
type GameApi={drop:(l:string)=>void,reset:()=>void};
export default function GreekLetterForest(){
 const mount=useRef<HTMLDivElement>(null),api=useRef<GameApi|null>(null),[score,setScore]=useState(0),[merges,setMerges]=useState(0),[count,setCount]=useState(0),[selected,setSelected]=useState("α"),[status,setStatus]=useState("숲속 세계를 불러오는 중…");
 useEffect(()=>{
  let cancelled=false,cleanup=()=>{};
  (async()=>{try{
   const url="https://esm.sh/three@0.180.0";
   const T=await import(/* webpackIgnore: true */ url);if(cancelled||!mount.current)return;
   const host=mount.current,scene=new T.Scene();scene.background=new T.Color("#e6f5ee");
   const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);
   const camera=new T.OrthographicCamera(-9,9,9,-9,.1,100);camera.position.set(0,6.5,22);camera.lookAt(0,2,0);const keyboardScene=new T.Scene();keyboardScene.background=new T.Color("#e7dbcd");const keyboardCamera=new T.PerspectiveCamera(35,1,.1,100);keyboardCamera.position.set(0,9.2,14);keyboardCamera.lookAt(0,0,0);keyboardScene.add(new T.HemisphereLight("#ffffff","#a7a2b4",3));const keySun=new T.DirectionalLight("#fff5e5",3);keySun.position.set(-5,10,7);keyboardScene.add(keySun);
   scene.add(new T.HemisphereLight("#fff7e5","#91b69a",2.5));const sun=new T.DirectionalLight("#fff3cf",3.1);sun.position.set(-7,17,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-18;scene.add(sun);
   const material=(c:string,roughness=.85)=>new T.MeshStandardMaterial({color:c,roughness});
   const grass=material("#9dce8d"),earth=material("#b89b76"),trunk=material("#ac7c58"),leaf=[material("#7fbf8d"),material("#94d0a2"),material("#6faf91")],pink=material("#eeb6c9"),cream=material("#f5e4c5"),lavender=material("#c9b4dc");
   function mesh(geometry:any,mat:any,x:number,y:number,z:number,parent:any=scene){const o=new T.Mesh(geometry,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
   const world=new T.Group();scene.add(world);
   mesh(new T.CylinderGeometry(9.2,9.5,.85,64),earth,0,-.75,0,world);
   mesh(new T.CylinderGeometry(9,9.2,.4,64),grass,0,-.15,0,world);
   mesh(new T.CylinderGeometry(6.2,6.2,.12,64),material("#b2d99a"),0,.08,0,world);
   // Soft miniature forest frames a central open play area.
   function tree(x:number,z:number,s:number,tint:number){
    mesh(new T.CylinderGeometry(.19*s,.28*s,1.8*s,9),trunk,x,.86*s,z,world);
    for(let i=0;i<3;i++)mesh(new T.SphereGeometry((.85-i*.12)*s,12,9),leaf[tint],x+Math.sin(i*2)*.3*s,(1.7+i*.46)*s,z,world);
   }
   [[-7,-2,1.1,0],[-7,1,1.3,1],[-6.8,3,1,2],[7,-2,1.25,1],[7,1,1,0],[6.7,3,1.25,2],[-4.8,-3.8,.85,1],[4.9,-3.8,.9,0],[-4.4,4,.75,2],[4.6,4,.8,1]].forEach(a=>tree(a[0],a[1],a[2],a[3]));
   for(let i=0;i<36;i++){const a=i*2.399,r=4.5+(i%5)*.5,x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(Math.abs(x)<4.3&&Math.abs(z)<3.2)continue;
    mesh(new T.CylinderGeometry(.04,.04,.35,7),material("#6caa71"),x,.23,z,world);
    mesh(new T.SphereGeometry(.15,8,7),i%3===0?pink:i%3===1?cream:lavender,x,.47,z,world);
   }
   for(let i=0;i<12;i++){const a=i*2.4,x=Math.cos(a)*7.5,z=Math.sin(a)*3.6;
    mesh(new T.CylinderGeometry(.08,.1,.35,8),cream,x,.25,z,world);mesh(new T.SphereGeometry(.25,12,8),pink,x,.5,z,world);
   }
   // Keyboard is a physically tilted 3D object, not flat HTML buttons.
   const keyboard=new T.Group();keyboard.position.set(0,0,0);keyboard.rotation.x=-.12;keyboardScene.add(keyboard);
   const shell=material("#f6e6d4"),edge=material("#cbbba9"),keyTop=[material("#fffaf1"),material("#e6d8f3"),material("#d3ebd8"),material("#f6d7d8")];
   mesh(new T.BoxGeometry(13.8,.8,6.5),edge,0,-.32,0,keyboard);
   mesh(new T.BoxGeometry(13.55,.55,6.25),shell,0,.16,0,keyboard);
   mesh(new T.BoxGeometry(12.5,.08,.23),material("#c9b3d4"),0,.46,-2.75,keyboard);
   const keyMeshes:any[]=[];const keyGroups:{group:any,letter:string,until:number}[]=[];
   function labelTexture(l:string){const cv=document.createElement("canvas");cv.width=cv.height=256;const cx=cv.getContext("2d")!;cx.clearRect(0,0,256,256);cx.fillStyle="#665a70";cx.font="bold 155px Georgia,serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(l,128,135);const tex=new T.CanvasTexture(cv);tex.colorSpace=T.SRGBColorSpace;return tex}
   LETTERS.forEach((l,i)=>{const col=i%8,row=Math.floor(i/8),g=new T.Group();g.position.set((col-3.5)*1.52,.58,(row-1)*1.57-.45);keyboard.add(g);
    const key=mesh(new T.BoxGeometry(1.28,.44,1.34),keyTop[i%4],0,0,0,g);key.userData.letter=l;keyMeshes.push(key);
    const top=mesh(new T.PlaneGeometry(.8,.85),new T.MeshBasicMaterial({map:labelTexture(l),transparent:true,depthWrite:false}),0,.228,0,g);top.rotation.x=-Math.PI/2;top.userData.letter=l;keyMeshes.push(top);keyGroups.push({group:g,letter:l,until:0});
   });
   // Actual glyph silhouettes have thickness, bevel-like layered extrusion, and cast shadows.
   const glyphCache=new Map<string,any>();
   function glyphGeometry(l:string){
    if(glyphCache.has(l))return glyphCache.get(l);
    const cv=document.createElement("canvas");cv.width=cv.height=256;const c=cv.getContext("2d")!;c.fillStyle="white";c.font="bold 205px Georgia,serif";c.textAlign="center";c.textBaseline="middle";c.fillText(l,128,137);
    const img=c.getImageData(0,0,256,256),solid=new Uint8Array(256*256);
    for(let i=0;i<solid.length;i++)solid[i]=img.data[i*4+3]>100?1:0;
    // Build a real 3D extruded voxel silhouette from the glyph's raster mask.
    const vertices:number[]=[],indices:number[]=[];const step=4;
    function face(v:number[][]){const start=vertices.length/3;for(const p of v)vertices.push(...p);indices.push(start,start+1,start+2,start,start+2,start+3)}
    for(let y=0;y<256;y+=step)for(let x=0;x<256;x+=step){
      let on=false;for(let yy=y;yy<Math.min(256,y+step)&&!on;yy++)for(let xx=x;xx<Math.min(256,x+step);xx++)if(solid[yy*256+xx]){on=true;break}
      if(!on)continue;
      const X=(x-128)/128,Y=(128-y)/128,s=step/128,z0=-.18,z1=.18;
      face([[X,Y,z1],[X+s,Y,z1],[X+s,Y-s,z1],[X,Y-s,z1]]);
      face([[X+s,Y,z0],[X,Y,z0],[X,Y-s,z0],[X+s,Y-s,z0]]);
      const neighbor=(xx:number,yy:number)=>xx>=0&&xx<256&&yy>=0&&yy<256&&solid[yy*256+xx]===1;
      if(!neighbor(x-step,y))face([[X,Y,z0],[X,Y,z1],[X,Y-s,z1],[X,Y-s,z0]]);
      if(!neighbor(x+step,y))face([[X+s,Y,z1],[X+s,Y,z0],[X+s,Y-s,z0],[X+s,Y-s,z1]]);
      if(!neighbor(x,y-step))face([[X,Y,z0],[X+s,Y,z0],[X+s,Y,z1],[X,Y,z1]]);
      if(!neighbor(x,y+step))face([[X,Y-s,z1],[X+s,Y-s,z1],[X+s,Y-s,z0],[X,Y-s,z0]]);
    }
    const geo=new T.BufferGeometry();geo.setAttribute("position",new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();glyphCache.set(l,geo);return geo;
   }
   type Piece={id:number,l:string,level:number,x:number,y:number,v:number,mesh:any,held:boolean,age:number};
   const pieces:Piece[]= [];let nextId=1,points=0,combos=0,dragPiece:Piece|null=null,dragKey:string|null=null,downX=0,downY=0,downTime=0;
   const colors=["#f2b96f","#8ed1dc","#c7a5e5","#f3a3b8","#a8d69a"];
   function add(l:string,level=1,x=(Math.random()-.5)*4,y=10){
    const m=mesh(glyphGeometry(l),material(colors[Math.min(level-1,4)],.45),x,y,1.2);
    const size=.86*Math.pow(1.19,level-1);m.scale.setScalar(size);
    const p:Piece={id:nextId++,l,level,x,y,v:0,mesh:m,held:false,age:0};pieces.push(p);setCount(pieces.length);
   }
   function drop(l:string){add(l);setSelected(l);const k=keyGroups.find(q=>q.letter===l);if(k)k.until=performance.now()+160}
   function reset(){for(const p of pieces)scene.remove(p.mesh);pieces.length=0;nextId=1;points=0;combos=0;setScore(0);setMerges(0);setCount(0)}
   const ray=new T.Raycaster(),pointer=new T.Vector2();let splitY=0;
   function setPointer(e:PointerEvent){const rect=renderer.domElement.getBoundingClientRect();const px=(e.clientX-rect.left)/rect.width,py=(e.clientY-rect.top)/rect.height;const forest=py<.65;pointer.set(px*2-1,forest?-(py/.65)*2+1:-((py-.65)/.35)*2+1);ray.setFromCamera(pointer,forest?camera:keyboardCamera);return forest}
   function hitPlane(e:PointerEvent){if(!setPointer(e))return null;const plane=new T.Plane(new T.Vector3(0,0,1),-1.2),out=new T.Vector3();return ray.ray.intersectPlane(plane,out)?out:null}
   function down(e:PointerEvent){const forest=setPointer(e);downX=e.clientX;downY=e.clientY;downTime=performance.now();
    const keys=forest?[]:ray.intersectObjects(keyMeshes,false);if(keys.length){dragKey=keys[0].object.userData.letter;renderer.domElement.setPointerCapture(e.pointerId);return}
    const hits=forest?ray.intersectObjects(pieces.map(p=>p.mesh),false):[];if(hits.length){dragPiece=pieces.find(p=>p.mesh===hits[0].object)||null;if(dragPiece){dragPiece.held=true;renderer.domElement.setPointerCapture(e.pointerId)}}
   }
   function move(e:PointerEvent){if(!dragPiece)return;const v=hitPlane(e);if(v){dragPiece.x=Math.max(-4.1,Math.min(4.1,v.x));dragPiece.y=Math.max(.9,Math.min(10,v.y));dragPiece.v=0}}
   function up(e:PointerEvent){if(dragKey){const l=dragKey;dragKey=null;drop(l)}if(dragPiece){dragPiece.held=false;dragPiece=null}}
   renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointermove",move);renderer.domElement.addEventListener("pointerup",up);renderer.domElement.addEventListener("pointercancel",up);renderer.domElement.style.touchAction="none";
   function merge(){
    for(const p of [...pieces]){
     const matching=pieces.filter(q=>q.l===p.l&&q.level===p.level&&Math.hypot(q.x-p.x,q.y-p.y)<1.5);
     if(matching.length<3)continue;
     const group=matching.slice(0,3),x=group.reduce((a,q)=>a+q.x,0)/3,y=group.reduce((a,q)=>a+q.y,0)/3;
     for(const q of group){scene.remove(q.mesh);pieces.splice(pieces.indexOf(q),1)}
     add(p.l,p.level+1,x,Math.max(1.2,y+1));points+=100*p.level*p.level;combos++;setScore(points);setMerges(combos);setCount(pieces.length);break;
    }
   }
   const resize=()=>{const w=host.clientWidth,h=host.clientHeight,fh=h*.65,kh=h*.35;const aspect=w/fh;const halfHeight=7.3;camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();keyboardCamera.aspect=w/kh;keyboardCamera.updateProjectionMatrix();renderer.setSize(w,h,false)};const observer=new ResizeObserver(resize);observer.observe(host);resize();
   camera.position.set(0,5.2,20);camera.lookAt(0,1.7,0);
   keyboardCamera.position.set(0,10.5,17.5);keyboardCamera.lookAt(0,0,0);
   let raf=0,last=performance.now(),mergeTime=0;
   function frame(now:number){raf=requestAnimationFrame(frame);const dt=Math.min(.045,(now-last)/1000);last=now;
    for(const p of pieces){p.age+=dt;if(!p.held){p.v=Math.min(7,p.v+12*dt);let target=.85;
     for(const q of pieces)if(q!==p&&Math.abs(q.x-p.x)<.78&&q.y<p.y)target=Math.max(target,q.y+.95*Math.pow(1.16,Math.max(q.level,p.level)-1));
     p.y=Math.max(target,p.y-p.v*dt);if(p.y<=target+.01)p.v=0;
    }p.mesh.position.set(p.x,p.y,1.2);p.mesh.rotation.y=Math.sin(now*.001+p.id)*.055}
    if(now-mergeTime>300){merge();mergeTime=now}
    for(const k of keyGroups)k.group.position.y=now<k.until?.36:.5;
    const w=host.clientWidth,h=host.clientHeight,fh=Math.round(h*.65);renderer.setScissorTest(true);renderer.setViewport(0,h-fh,w,fh);renderer.setScissor(0,h-fh,w,fh);renderer.render(scene,camera);renderer.setViewport(0,0,w,h-fh);renderer.setScissor(0,0,w,h-fh);renderer.render(keyboardScene,keyboardCamera);renderer.setScissorTest(false);
   }raf=requestAnimationFrame(frame);api.current={drop,reset};setStatus("키보드를 눌러 숲속에 글자를 떨어뜨려 보세요!");
   cleanup=()=>{cancelAnimationFrame(raf);observer.disconnect();renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointermove",move);renderer.domElement.removeEventListener("pointerup",up);renderer.domElement.removeEventListener("pointercancel",up);api.current=null;[scene,keyboardScene].forEach(sc=>sc.traverse((o:any)=>{if(o.isMesh){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach((m:any)=>m.dispose());else o.material?.dispose()}}));renderer.dispose();if(host.contains(renderer.domElement))host.removeChild(renderer.domElement)};
  }catch(e){console.error(e);setStatus("3D 화면을 불러오지 못했습니다. 네트워크를 확인해 주세요.")}})();
  return()=>{cancelled=true;cleanup()};
 },[]);
 return <main className="min-h-screen bg-[#f4f4e9] px-3 pb-20 pt-24 text-[#34483e] md:px-8">
  <div className="mx-auto max-w-5xl">
   <Link href="/bible" className="text-xs uppercase tracking-[.2em] text-[#658975]">← The Bible</Link>
   <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.3em] text-[#739a83]">A tiny woodland language game</p><h1 className="mt-2 font-serif text-4xl md:text-6xl">Greek Letter Forest</h1><p className="mt-2 text-sm text-[#6b8678]">A cozy little world where Greek letters fall from the sky</p></div><div className="flex gap-6 text-center"><div><p className="text-xs text-[#829589]">SCORE</p><p className="text-2xl font-bold">{score}</p></div><div><p className="text-xs text-[#829589]">MERGES</p><p className="text-2xl font-bold">{merges}</p></div><div><p className="text-xs text-[#829589]">LETTERS</p><p className="text-2xl font-bold">{count}</p></div></div></div>
   <div className="mt-7 overflow-hidden rounded-[32px] border-[9px] border-[#e6d9c4] bg-[#e6f5ee] shadow-[0_24px_65px_#7b987544]">
    <div ref={mount} className="h-[760px] w-full md:h-[900px]" aria-label="3D miniature forest and 3D Greek mechanical keyboard"/>
    <div className="bg-[#fff8ed] px-5 py-3 text-center text-sm text-[#66836f]">{status}</div>
   </div>
   <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{LETTERS.map(l=><button key={l} onClick={()=>{setSelected(l);api.current?.drop(l)}} className={`rounded-lg border px-3 py-2 font-serif text-xl transition hover:bg-[#d4ead9] ${selected===l?"border-[#85ac91] bg-[#e0f0df]":"border-[#e0e5d7] bg-white"}`}>{l}</button>)}</div>
   <div className="mt-5 flex items-center justify-center gap-5"><button onClick={()=>api.current?.reset()} className="rounded-xl bg-[#7baf8c] px-6 py-3 font-semibold text-white hover:bg-[#689f7a]">Start over</button><p className="text-sm text-[#6b8678]">Click the 3D keyboard to drop · Drag a letter to move it · Match three to grow</p></div>
   <p className="mt-5 text-center text-xs text-[#879c8b]">Development prototype · Two separate fixed 3D cameras · Full 3D keyboard with perspective · Lightweight custom falling/stacking simulation (not a full rigid-body physics engine)</p>
  </div>
 </main>;
}