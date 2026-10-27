"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const GREEK = "αβγδεζηθικλμνξοπρστυφχψω".split("");
const COLORS = ["#efb5a2","#acd7e6","#d5b7ec","#b6dcb4","#f1d18b","#9cc4df"];
type Piece = { id:number; letter:string; level:number; x:number; y:number; vx:number; vy:number; spin:number; radius:number; group:any; held:boolean; age:number };
type Sparkle = { mesh:any; vx:number; vy:number; life:number };
type Controller = { drop:(letter:string)=>void; reset:()=>void; ready:boolean };
type Key = { label:string; group:any; until:number; centerX:number };
export default function GreekLetterForest() {
  const canvasHost = useRef<HTMLDivElement>(null);
  const game = useRef<Controller|null>(null);
  const [status,setStatus] = useState("작은 숲을 준비하고 있습니다…");
  const [score,setScore] = useState(0);
  const [merges,setMerges] = useState(0);
  const [piecesCount,setPiecesCount] = useState(0);
  const [lastLetter,setLastLetter] = useState("α");
  useEffect(()=>{
    let disposed=false;
    let dispose=()=>{};
    (async()=>{
      try {
        // The renderer is loaded at runtime so the existing production build and lockfile stay untouched.
        const moduleUrl="https://esm.sh/three@0.180.0";
        const T=await import(/* webpackIgnore: true */ moduleUrl);
        if(disposed||!canvasHost.current)return;
        const host=canvasHost.current;
        const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
        renderer.outputColorSpace=T.SRGBColorSpace;
        renderer.shadowMap.enabled=true;
        renderer.shadowMap.type=T.PCFSoftShadowMap;
        renderer.toneMapping=T.ACESFilmicToneMapping;
        renderer.toneMappingExposure=1.55;
        renderer.domElement.style.width="100%";
        renderer.domElement.style.height="100%";
        renderer.domElement.style.display="block";
        renderer.domElement.style.touchAction="none";
        host.appendChild(renderer.domElement);
        const forest=new T.Scene();forest.background=new T.Color("#dcefe9");
        const keyboard=new T.Scene();keyboard.background=new T.Color("#e7e3dc");
        const forestCamera=new T.OrthographicCamera(-8,8,7,-7,.1,100);
        // Front-fixed camera, aimed at the actual center of the woodland playfield.
        forestCamera.position.set(0,7.8,24);forestCamera.lookAt(0,4.2,0);
        const keyboardCamera=new T.PerspectiveCamera(30,2.5,.1,100);
        keyboardCamera.position.set(0,9.8,15.2);keyboardCamera.lookAt(0,0,0);
        forest.add(new T.HemisphereLight("#ffffff","#82ab93",2.8));
        const sun=new T.DirectionalLight("#fff6db",3.4);
        sun.position.set(-6,13,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
        sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-12;
        sun.shadow.normalBias=.025;forest.add(sun);
        keyboard.add(new T.HemisphereLight("#ffffff","#b9a5a9",3.1));
        const keySun=new T.DirectionalLight("#fff1e5",3.4);
        keySun.position.set(-6,12,8);keySun.castShadow=true;keySun.shadow.mapSize.set(2048,2048);
        keySun.shadow.camera.left=-16;keySun.shadow.camera.right=16;keySun.shadow.camera.top=16;keySun.shadow.camera.bottom=-16;keyboard.add(keySun);
        function mat(color:string,roughness=.8,metalness=0){return new T.MeshStandardMaterial({color,roughness,metalness})}
        const grass=mat("#a5d69c"),dirt=mat("#b59172"),stem=mat("#967257"),flowerColors=["#f5c4d8","#fcf0b6","#e2c8fa","#ffe1c0"];
        function mesh(parent:any,geometry:any,material:any,x=0,y=0,z=0) {
          const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
        }
        function sphere(parent:any,color:string,r:number,x:number,y:number,z:number,w=16,h=12) {
          return mesh(parent,new T.SphereGeometry(r,w,h),mat(color),x,y,z);
        }
        // A curated miniature island. Trees stay at the perimeter; the falling arena remains unobstructed.
        const island=new T.Group();forest.add(island);
        mesh(island,new T.CylinderGeometry(6.6,6.35,.66,64),dirt,0,-.46,-.25);
        mesh(island,new T.CylinderGeometry(6.52,6.57,.27,64),grass,0,-.065,-.25);
        mesh(island,new T.CylinderGeometry(5.1,5.15,.025,64),mat("#b6dcaa"),0,.085,-.1);
        const shadow=mesh(island,new T.CircleGeometry(7.3,64),new T.MeshBasicMaterial({color:"#8caa99",transparent:true,opacity:.12}),0,-.83,-.3);shadow.rotation.x=-Math.PI/2;
        function createTree(x:number,z:number,scale:number,tint:number) {
          const g=new T.Group();g.position.set(x,0,z);island.add(g);
          const trunk=mesh(g,new T.CylinderGeometry(.18*scale,.29*scale,1.45*scale,10),stem,0,.8*scale,0);
          trunk.rotation.z=(x<0?-.07:.07);
          const greens=["#79b999","#8dcc9e","#aad5a7","#86c1ad"];
          sphere(g,greens[tint%4],.8*scale,-.27*scale,1.85*scale,0,14,12);
          sphere(g,greens[(tint+1)%4],.92*scale,.23*scale,2.17*scale,0,14,12);
          sphere(g,greens[tint%4],.68*scale,.05*scale,2.64*scale,0,14,12);
          return g;
        }
        [
          [-5.05,-1.9,1.04,0],[-5.0,1.3,.82,1],[-4.3,-3.2,.85,3],
          [5.1,-1.8,1.08,2],[4.98,1.8,.85,0],[4.0,-3.35,.85,1],
          [-2.6,-4.7,.7,2],[2.5,-4.65,.73,3]
        ].forEach(q=>createTree(q[0],q[1],q[2],q[3]));
        for(let i=0;i<52;i++){
          const a=i*2.399,r=3.8+(i%7)*.37,x=Math.cos(a)*r,z=Math.sin(a)*r*.8;
          if(Math.abs(x)<3.8&&Math.abs(z)<1.7)continue;
          mesh(island,new T.CylinderGeometry(.025,.028,.24,6),mat("#75ac7a"),x,.23,z);
          sphere(island,flowerColors[i%4],.115,x,.37,z,8,6);
          if(i%4===0)sphere(island,"#fff8c5",.05,x,.39,z+.08,8,6);
        }
        function mushroom(x:number,z:number,c:string){
          mesh(island,new T.CylinderGeometry(.10,.13,.43,10),mat("#f5e9d9"),x,.3,z);
          const cap=mesh(island,new T.SphereGeometry(.34,14,10),mat(c),x,.57,z);cap.scale.y=.45;
          for(let i=0;i<3;i++)sphere(island,"#fff7e4",.05,x+Math.cos(i*2.1)*.16,.69,z+Math.sin(i*2.1)*.14,8,6);
        }
        [[-4.5,2.1,"#e5a6a5"],[4.5,2.8,"#e6ad95"],[-3.3,-3.6,"#d1b5eb"],[3.5,-3.5,"#e9b69a"]].forEach(m=>mushroom(m[0] as number,m[1] as number,m[2] as string));
        // Decorative drifting cloud banks, always behind the actual 3D letters.
        const clouds:any[]=[];
        for(let i=0;i<4;i++){
          const g=new T.Group();g.position.set(-5.7+i*3.8,8.6+(i%2)*.85,-6.5);forest.add(g);
          sphere(g,"#fffdf3",.55,-.65,0,0,16,12);sphere(g,"#fffdf3",.8,0,.17,0,16,12);sphere(g,"#fffdf3",.55,.66,0,0,16,12);
          clouds.push(g);
        }
        // True sculpted mechanical keyboard on a tabletop, seen from an elevated 3D perspective.
        const deskMat=mat("#e5ded2");mesh(keyboard,new T.BoxGeometry(40,.35,20),deskMat,0,-1.2,0);
        function roundShape(width:number,depth:number,r:number) {
          const s=new T.Shape(),x=-width/2,y=-depth/2,w=width,h=depth;
          s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
          s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
          s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
          s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
        }
        function sculpted(parent:any,w:number,d:number,h:number,r:number,color:string,x:number,y:number,z:number,bevel=.04) {
          const geo=new T.ExtrudeGeometry(roundShape(w,d,r),{depth:h,steps:1,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:8});
          geo.rotateX(-Math.PI/2);
          return mesh(parent,geo,mat(color,.46),x,y,z);
        }
        const board=new T.Group();keyboard.add(board);board.position.y=-.11;
        // Desk mat and double-layer anodized frame, rounded corners and visible front lip.
        sculpted(keyboard,15.7,8.65,.06,.65,"#d0dcd0",0,-.94,.13,.02);
        sculpted(board,15.25,7.85,.61,.64,"#9bada3",0,-.49,0,.13);
        sculpted(board,15.02,7.62,.38,.58,"#f8eee1",0,-.12,0,.08);
        sculpted(board,14.45,6.94,.075,.47,"#cfcdc3",0,.26,-.09,.03);
        // Small metallic badge, decorative power LED and rotary dial.
        sculpted(board,2.25,.38,.015,.08,"#b8c8bd",-5.7,.36,-3.57,.005);
        const led=sphere(board,"#b6e8b5",.085,6.52,.44,-3.57,12,8);
        const dial=mesh(board,new T.CylinderGeometry(.37,.37,.31,32),mat("#dcbf96",.32,.3),6.67,.53,-3.15);
        mesh(board,new T.CylinderGeometry(.29,.29,.015,32),mat("#f9e7c9",.3),6.67,.7,-3.15);
        const keys:Key[]=[];const hitKeys:any[]=[];
        function labelMaterial(value:string,accent=false){
          const c=document.createElement("canvas");c.width=256;c.height=256;
          const context=c.getContext("2d")!;
          context.clearRect(0,0,256,256);
          context.fillStyle=accent?"#526c63":"#716a72";
          const fontSize=value.length>3?62:value.length>1?90:160;
          context.font=(accent?"600 ":"700 ")+fontSize+"px "+(GREEK.includes(value)?"Georgia,serif":"Arial,sans-serif");
          context.textAlign="center";context.textBaseline="middle";context.fillText(value,128,133);
          const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
          return new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});
        }
        const keyThemes=["#fff9ed","#efe4f5","#deeee3","#f9e5e2"];
        function addKey(label:string,width:number,row:number,x:number,colorIndex:number){
          const g=new T.Group();g.position.set(x,.37,-2.74+row*1.34);board.add(g);
          const isGreek=GREEK.includes(label);
          sculpted(g,width-.10,1.12,.3,.14,isGreek?keyThemes[colorIndex%4]:"#f1ece5",0,0,0,.045);
          // Subtle inset on the key top and a tiny engraved legend.
          const depression=sculpted(g,width-.29,.88,.012,.105,isGreek?"#fffaf4":"#f9f4e9",0,.343,0,.013);
          depression.material.roughness=.68;
          const legend=mesh(g,new T.PlaneGeometry(Math.min(.87,width*.63),.78),labelMaterial(label,isGreek),0,.376,0);
          legend.rotation.x=-Math.PI/2;legend.castShadow=false;
          hitKeys.push(g.children[0]);hitKeys[hitKeys.length-1].userData.label=label;
          keys.push({label,group:g,until:0,centerX:x});
        }
        function addRow(row:number,entries:{label:string,w:number}[]){
          const spacing=.10,total=entries.reduce((a,e)=>a+e.w,0)+spacing*(entries.length-1);
          let x=-total/2;
          entries.forEach((e,i)=>{addKey(e.label,e.w,row,x+e.w/2,i+row);x+=e.w+spacing});
        }
        addRow(0,["esc","☼","1","2","3","4","5","6","7","8","9","⌫"].map(label=>({label,w:label==="⌫"?1.45:label==="esc"?1.17:1.03})));
        addRow(1,[{label:"tab",w:1.43},...GREEK.slice(0,10).map(label=>({label,w:1.03})),{label:"↵",w:1.32}]);
        addRow(2,[{label:"caps",w:1.72},...GREEK.slice(10,19).map(label=>({label,w:1.03})),{label:"enter",w:2.0}]);
        addRow(3,[{label:"shift",w:2.1},...GREEK.slice(19).map(label=>({label,w:1.03})),...["←","↓","↑","→"].map(label=>({label,w:1.02})),{label:"shift",w:1.4}]);
        addRow(4,[{label:"ctrl",w:1.28},{label:"fn",w:1.05},{label:"alt",w:1.15},{label:"space",w:6.35},{label:"alt",w:1.15},{label:"fn",w:1.05},{label:"ctrl",w:1.28}]);
        // A ceramic pot and pencil make the tabletop an intentional miniature product scene.
        const pot=mesh(keyboard,new T.CylinderGeometry(.52,.43,.65,18),mat("#d7b4a5"),-8.4,-.52,.8);
        sphere(keyboard,"#84b990",.64,-8.4,.1,.8,12,10);
        const pencil=mesh(keyboard,new T.CylinderGeometry(.08,.08,5.2,9),mat("#e0b88b"),8.65,-.69,1.2);pencil.rotation.z=.09;pencil.rotation.x=Math.PI/2;
        // Smooth vector-style Greek outlines converted to actual extruded 3D geometries.
        // The contour follows the font's anti-aliased silhouette: no square voxel faces.
        const glyphShapes=new Map<string,any[]>();
        function glyphOutlines(letter:string){
          const cached=glyphShapes.get(letter);if(cached)return cached;
          const size=288,step=2,n=size/step;
          const cv=document.createElement("canvas");cv.width=cv.height=size;
          const ctx=cv.getContext("2d",{willReadFrequently:true})!;
          let fontSize=238;ctx.textAlign="center";ctx.textBaseline="middle";
          do{ctx.font="700 "+fontSize+"px Georgia, 'Times New Roman', serif";if(ctx.measureText(letter).width<=size*.77)break;fontSize-=5}while(fontSize>125);
          ctx.fillStyle="#fff";ctx.fillText(letter,size/2,size/2+8);
          const rgba=ctx.getImageData(0,0,size,size).data;
          const mask=new Uint8Array(n*n);
          for(let y=0;y<n;y++)for(let x=0;x<n;x++){
            const px=(y*step+1)*size+(x*step+1);mask[y*n+x]=rgba[px*4+3]>90?1:0;
          }
          const inside=(x:number,y:number)=>x>=0&&y>=0&&x<n&&y<n&&mask[y*n+x]===1;
          const edges=new Map<string,{x:number,y:number}[]>();
          function edge(x:number,y:number,xx:number,yy:number){const k=x+","+y,a=edges.get(k)||[];a.push({x:xx,y:yy});edges.set(k,a)}
          for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(inside(x,y)){
            if(!inside(x,y-1))edge(x,y,x+1,y);
            if(!inside(x+1,y))edge(x+1,y,x+1,y+1);
            if(!inside(x,y+1))edge(x+1,y+1,x,y+1);
            if(!inside(x-1,y))edge(x,y+1,x,y);
          }
          type Point={x:number,y:number};
          const loops:Point[][]=[];
          while(edges.size){
            const startKey=edges.keys().next().value as string;
            const [sx,sy]=startKey.split(",").map(Number);
            const poly:Point[]=[];let x=sx,y=sy,limit=0;
            while(limit++<4000){
              poly.push({x,y});const k=x+","+y,out=edges.get(k);
              if(!out?.length)break;
              const next=out.pop()!;if(!out.length)edges.delete(k);
              x=next.x;y=next.y;
              if(x===sx&&y===sy)break;
            }
            if(poly.length>7)loops.push(poly);
          }
          const area=(p:Point[])=>p.reduce((s,q,i)=>{const r=p[(i+1)%p.length];return s+q.x*r.y-r.x*q.y},0)/2;
          const contains=(p:Point,polygon:Point[])=>{
            let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
              const a=polygon[i],b=polygon[j];
              if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)hit=!hit;
            }return hit;
          };
          const coords=(p:Point)=>({x:(p.x/n-.5)*2.13,y:(.5-p.y/n)*2.13});
          function smoothing(points:Point[]){
            // One gentle Chaikin pass makes the raster-derived contours smooth at any zoom.
            const result:Point[]=[];
            for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];
              result.push({x:.8*a.x+.2*b.x,y:.8*a.y+.2*b.y});result.push({x:.2*a.x+.8*b.x,y:.2*a.y+.8*b.y});
            }return result;
          }
          const outer=loops.filter(p=>area(p)>6).sort((a,b)=>Math.abs(area(b))-Math.abs(area(a)));
          const holes=loops.filter(p=>area(p)<-6);
          const shapes:any[]=[];
          for(const polygon of outer){
            const pts=smoothing(polygon),sh=new T.Shape();const first=coords(pts[0]);sh.moveTo(first.x,first.y);
            for(let i=1;i<pts.length;i++){const v=coords(pts[i]);sh.lineTo(v.x,v.y)}sh.closePath();
            for(const hole of holes)if(contains(hole[0],polygon)){
              const hp=smoothing(hole),p0=coords(hp[0]),h=new T.Path();h.moveTo(p0.x,p0.y);
              for(let i=1;i<hp.length;i++){const v=coords(hp[i]);h.lineTo(v.x,v.y)}h.closePath();sh.holes.push(h);
            }
            shapes.push(sh);
          }
          glyphShapes.set(letter,shapes);return shapes;
        }
        const glyphGeometry=new Map<string,any[]>();
        function letterMeshes(letter:string,level:number){
          if(!glyphGeometry.has(letter)){
            const geometries=glyphOutlines(letter).map(shape=>new T.ExtrudeGeometry(shape,{depth:.23,steps:1,bevelEnabled:true,bevelThickness:.045,bevelSize:.022,bevelSegments:3,curveSegments:6}));
            for(const g of geometries)g.computeVertexNormals();
            glyphGeometry.set(letter,geometries);
          }
          const group=new T.Group();
          const gold=mat(COLORS[Math.min(level-1,COLORS.length-1)],.32,.07);
          for(const geo of glyphGeometry.get(letter)!)mesh(group,geo,gold);
          const scale=.69*Math.pow(1.22,level-1);
          group.scale.setScalar(scale);
          return group;
        }
        const letters:Piece[]=[];const sparkles:Sparkle[]=[];
        let nextId=1,points=0,combo=0,activeDrag:Piece|null=null,pressedKey:string|null=null;
        const random=(a:number,b:number)=>a+Math.random()*(b-a);
        function addLetter(letter:string,level=1,x=random(-2,2),y=10.35) {
          const group=letterMeshes(letter,level);forest.add(group);
          const p:Piece={id:nextId++,letter,level,x,y,vx:random(-.4,.4),vy:0,spin:random(-.4,.4),radius:.54*Math.pow(1.18,level-1),group,held:false,age:0};
          letters.push(p);setPiecesCount(letters.length);return p;
        }
        function press(letter:string){
          const k=keys.find(k=>k.label===letter);if(k)k.until=performance.now()+190;
          if(!GREEK.includes(letter))return;
          addLetter(letter);setLastLetter(letter);
        }
        function clear(){
          for(const p of letters)forest.remove(p.group);
          letters.length=0;
          for(const s of sparkles)forest.remove(s.mesh);
          sparkles.length=0;points=0;combo=0;nextId=1;setScore(0);setMerges(0);setPiecesCount(0);
        }
        function pop(x:number,y:number){
          for(let i=0;i<20;i++){
            const m=mesh(forest,new T.IcosahedronGeometry(random(.05,.12),0),new T.MeshBasicMaterial({color:COLORS[i%COLORS.length]}),x,y,random(.4,1.2));
            sparkles.push({mesh:m,vx:random(-2.6,2.6),vy:random(1,4),life:random(.45,.9)});
          }
        }
        function resolve(){
          const checked=new Set<number>();
          for(const p of [...letters]){
            if(checked.has(p.id)||p.held||p.age<.65)continue;
            const group:Piece[]=[],queue=[p];
            while(queue.length){
              const q=queue.pop()!;if(checked.has(q.id)||q.held)continue;checked.add(q.id);group.push(q);
              for(const v of letters){
                if(v.id!==q.id&&!checked.has(v.id)&&v.letter===q.letter&&v.level===q.level&&Math.hypot(v.x-q.x,v.y-q.y)<v.radius+q.radius+.21)queue.push(v);
              }
            }
            if(group.length<3)continue;
            const trio=group.slice(0,3);
            const x=trio.reduce((s,q)=>s+q.x,0)/3,y=trio.reduce((s,q)=>s+q.y,0)/3;
            trio.forEach(q=>{forest.remove(q.group);letters.splice(letters.indexOf(q),1)});
            pop(x,y);const grown=addLetter(p.letter,p.level+1,Math.max(-3.05,Math.min(3.05,x)),Math.max(1,y+.4));
            grown.vy=1.5;points+=100*p.level*p.level;combo++;setScore(points);setMerges(combo);setPiecesCount(letters.length);break;
          }
        }
        const ray=new T.Raycaster(),cursor=new T.Vector2(),dragPlane=new T.Plane(new T.Vector3(0,0,1),-.4);
        let forestFraction=.68;
        function getPoint(e:PointerEvent){
          const rect=renderer.domElement.getBoundingClientRect();
          const x=(e.clientX-rect.left)/rect.width;
          const y=(e.clientY-rect.top)/rect.height;
          const top=y<forestFraction;
          cursor.set(x*2-1,top?1-2*y/forestFraction:1-2*(y-forestFraction)/(1-forestFraction));
          ray.setFromCamera(cursor,top?forestCamera:keyboardCamera);
          return top;
        }
        function pointerDown(e:PointerEvent){
          const top=getPoint(e);
          if(top){
            const hits=ray.intersectObjects(letters.flatMap(q=>q.group.children),false);
            if(hits.length){
              activeDrag=letters.find(q=>q.group.children.includes(hits[0].object))||null;
              if(activeDrag){activeDrag.held=true;activeDrag.vx=activeDrag.vy=0;renderer.domElement.setPointerCapture(e.pointerId)}
            }
          }else{
            const hits=ray.intersectObjects(hitKeys,false);
            if(hits.length){
              const label=hits[0].object.userData.label;
              pressedKey=label;const k=keys.find(k=>k.label===label);if(k)k.until=performance.now()+230;
              renderer.domElement.setPointerCapture(e.pointerId);
            }
          }
        }
        function pointerMove(e:PointerEvent){
          if(!activeDrag)return;
          if(!getPoint(e))return;
          const at=new T.Vector3();
          if(ray.ray.intersectPlane(dragPlane,at)){
            activeDrag.x=Math.max(-3.45,Math.min(3.45,at.x));
            activeDrag.y=Math.max(.85,Math.min(10.2,at.y));
            activeDrag.vy=0;activeDrag.vx=0;
          }
        }
        function pointerUp(){
          if(activeDrag){activeDrag.held=false;activeDrag.vy=-1.1;activeDrag=null}
          if(pressedKey){const l=pressedKey;pressedKey=null;press(l)}
        }
        function onKey(e:KeyboardEvent){
          if(e.code==="Space"){e.preventDefault();press("α")}
          if(e.key.length===1&&GREEK.includes(e.key))press(e.key);
        }
        renderer.domElement.addEventListener("pointerdown",pointerDown);
        renderer.domElement.addEventListener("pointermove",pointerMove);
        renderer.domElement.addEventListener("pointerup",pointerUp);
        renderer.domElement.addEventListener("pointercancel",pointerUp);
        window.addEventListener("keydown",onKey);
        function resize(){
          const w=host.clientWidth,h=host.clientHeight,topH=h*forestFraction,bottomH=h-topH;
          const aspect=w/topH,halfHeight=6.8,halfWidth=Math.max(6.5,halfHeight*aspect);
          forestCamera.left=-halfWidth;forestCamera.right=halfWidth;
          forestCamera.top=halfWidth/aspect;forestCamera.bottom=-halfWidth/aspect;forestCamera.updateProjectionMatrix();
          keyboardCamera.aspect=w/bottomH;
          // Fit the full keyboard even on narrow screens without changing the fixed viewing direction.
          const distance=keyboardCamera.position.distanceTo(new T.Vector3(0,0,0));
          const verticalRequired=2*Math.atan(8.3/(distance*keyboardCamera.aspect))*180/Math.PI;
          keyboardCamera.fov=Math.max(29,Math.min(65,verticalRequired));keyboardCamera.updateProjectionMatrix();
          renderer.setSize(w,h,false);
        }
        const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
        addLetter("α",1,-1.25,8.4);addLetter("β",1,.85,10.1);
        let last=performance.now(),mergeAt=0,raf=0;
        function render(now:number){
          raf=requestAnimationFrame(render);
          const dt=Math.min(.035,(now-last)/1000);last=now;
          for(const p of letters){
            p.age+=dt;
            if(!p.held){
              p.vy-=14.8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
              p.vx*=Math.pow(.985,dt*60);
              const wall=3.53-p.radius;
              if(p.x< -wall){p.x=-wall;p.vx=Math.abs(p.vx)*.45}
              if(p.x> wall){p.x=wall;p.vx=-Math.abs(p.vx)*.45}
              if(p.y<p.radius+.16){
                p.y=p.radius+.16;
                if(p.vy<-.6)p.vy=-p.vy*.29;else p.vy=0;
                p.vx*=.82;p.spin*=.8;
              }
            }
          }
          // Pairwise collision responses: continuously moving, stacking extruded glyphs.
          for(let i=0;i<letters.length;i++)for(let j=i+1;j<letters.length;j++){
            const a=letters[i],b=letters[j];
            let dx=b.x-a.x,dy=b.y-a.y;
            const min=a.radius+b.radius,dist=Math.hypot(dx,dy);
            if(dist>=min||dist<.0001)continue;
            const nx=dx/dist,ny=dy/dist,penetration=min-dist;
            const wa=a.held?0:.5,wb=b.held?0:.5;
            if(wa+wb===0)continue;
            if(!a.held){a.x-=nx*penetration*wa*2;a.y-=ny*penetration*wa*2}
            if(!b.held){b.x+=nx*penetration*wb*2;b.y+=ny*penetration*wb*2}
            const relative=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
            if(relative<0){
              const impulse=-(1.28)*relative/(wa+wb);
              if(!a.held){a.vx-=impulse*nx*wa;a.vy-=impulse*ny*wa}
              if(!b.held){b.vx+=impulse*nx*wb;b.vy+=impulse*ny*wb}
            }
          }
          for(const p of letters){
            p.group.position.set(p.x,p.y,1.18);
            if(!p.held)p.spin=Math.max(-.7,Math.min(.7,p.spin+p.vx*.001));
            p.group.rotation.z+=p.spin*dt*.19;
          }
          for(const k of keys){
            const press=now<k.until;
            const target=press?-.18:0;
            k.group.position.y+=(.37+target-k.group.position.y)*Math.min(1,dt*18);
          }
          clouds.forEach((c,i)=>{c.position.x=(-5.7+i*3.8)+Math.sin(now*.00015+i)*.38});
          for(let i=sparkles.length-1;i>=0;i--){
            const s=sparkles[i];s.life-=dt;s.mesh.position.x+=s.vx*dt;s.mesh.position.y+=s.vy*dt;s.vy-=7*dt;
            const sm=Math.max(.01,s.life);s.mesh.scale.setScalar(sm);
            if(s.life<=0){forest.remove(s.mesh);s.mesh.geometry.dispose();s.mesh.material.dispose();sparkles.splice(i,1)}
          }
          if(now-mergeAt>200){resolve();mergeAt=now}
          const w=host.clientWidth,h=host.clientHeight,topH=Math.round(h*forestFraction),bottomH=h-topH;
          renderer.setScissorTest(true);
          renderer.setViewport(0,bottomH,w,topH);renderer.setScissor(0,bottomH,w,topH);renderer.render(forest,forestCamera);
          renderer.setViewport(0,0,w,bottomH);renderer.setScissor(0,0,w,bottomH);renderer.render(keyboard,keyboardCamera);
          renderer.setScissorTest(false);
        }
        raf=requestAnimationFrame(render);
        game.current={drop:press,reset:clear,ready:true};
        setStatus("키보드를 누르면 글자가 숲속으로 떨어집니다. 글자를 마우스로 잡아 움직일 수도 있어요.");
        dispose=()=>{
          cancelAnimationFrame(raf);resizeObserver.disconnect();
          renderer.domElement.removeEventListener("pointerdown",pointerDown);
          renderer.domElement.removeEventListener("pointermove",pointerMove);
          renderer.domElement.removeEventListener("pointerup",pointerUp);
          renderer.domElement.removeEventListener("pointercancel",pointerUp);
          window.removeEventListener("keydown",onKey);
          for(const geo of glyphGeometry.values())for(const g of geo)g.dispose();
          for(const scene of [forest,keyboard])scene.traverse((object:any)=>{
            if(!object.isMesh)return;
            // Glyph geometry is shared and disposed above.
            if(!Array.from(glyphGeometry.values()).some(a=>a.includes(object.geometry)))object.geometry?.dispose();
            if(Array.isArray(object.material))object.material.forEach((m:any)=>m.dispose());else object.material?.dispose();
          });
          renderer.dispose();game.current=null;
          if(host.contains(renderer.domElement))host.removeChild(renderer.domElement);
        };
      }catch(e){console.error("Greek Letter Forest renderer failed",e);setStatus("3D 환경을 표시할 수 없습니다. 네트워크 연결이나 브라우저 WebGL 지원을 확인해 주세요.")}
    })();
    return()=>{disposed=true;dispose()};
  },[]);
  return <main className="min-h-screen bg-[#f6f6ef] px-3 pb-20 pt-24 text-[#3d594b] sm:px-6">
    <div className="mx-auto max-w-5xl">
      <Link href="/bible" className="text-xs font-medium uppercase tracking-[.22em] text-[#6e9b80]">← The Bible</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs uppercase tracking-[.31em] text-[#95b2a0]">A little woodland game · 3D study prototype</p>
          <h1 className="mt-2 font-serif text-4xl text-[#4a705b] sm:text-6xl">Greek Letter Forest</h1>
          <p className="mt-3 text-sm text-[#749181]">A tiny world of Greek letters, flowers and playful discoveries</p>
        </div>
        <div className="flex gap-5 rounded-2xl border border-[#d9e8dc] bg-white/80 px-5 py-3 text-center shadow-sm">
          <div><p className="text-[10px] font-semibold tracking-[.16em] text-[#9aaea0]">SCORE</p><p className="text-2xl font-bold">{score}</p></div>
          <div><p className="text-[10px] font-semibold tracking-[.16em] text-[#9aaea0]">MERGES</p><p className="text-2xl font-bold">{merges}</p></div>
          <div><p className="text-[10px] font-semibold tracking-[.16em] text-[#9aaea0]">LETTERS</p><p className="text-2xl font-bold">{piecesCount}</p></div>
        </div>
      </div>
      <div className="relative mt-6 overflow-hidden rounded-[32px] border-[8px] border-[#fdf5e9] bg-[#dcefe9] shadow-[0_28px_80px_#849f8c44]">
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold tracking-widest text-[#6e977c] shadow-sm">✿ LITTLE GREEK WOODLAND</div>
        <div ref={canvasHost} className="h-[720px] w-full sm:h-[820px]" aria-label="Actual 3D miniature Greek forest above an angled, modeled mechanical Greek keyboard" />
        <div className="border-t border-[#e9e1d5] bg-[#fffaf2] px-4 py-3 text-center text-xs text-[#7e9486]">{status}</div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button onClick={()=>game.current?.reset()} className="rounded-full bg-[#83b895] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#6da984]">↺ Restart</button>
        <p className="text-sm text-[#728b7b]">Click the physical 3D keyboard · Drag falling letters · Match 3 of a kind</p>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-1.5" aria-label="Accessible alternative Greek keyboard">
        {GREEK.map(l=><button key={l} title={"Drop "+l} onClick={()=>game.current?.drop(l)} className={"min-w-9 rounded-lg border px-2 py-1.5 font-serif text-lg shadow-sm transition hover:bg-[#e4f0e7] "+(lastLetter===l?"border-[#9ebda7] bg-[#deeddf]":"border-[#e2e9df] bg-white")}>{l}</button>)}
      </div>
      <p className="mt-5 text-center text-xs text-[#9aaa9d]">Experimental WebGL scene · Real extruded 3D Greek letter silhouettes · Fixed forest camera + dedicated perspective keyboard camera · Lightweight collision simulation</p>
    </div>
  </main>;
}
