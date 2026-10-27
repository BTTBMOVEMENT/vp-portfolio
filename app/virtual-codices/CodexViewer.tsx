"use client";
import {useState} from "react";
import Link from "next/link";
const leaves=[
 {folio:"Folio 01",head:"ΚΑΤΑ ΜΑΤΘΑΙΟΝ",lines:["ΒΙΒΛΟΣ ΓΕΝΕΣΕΩΣ ΙΗΣΟΥ ΧΡΙΣΤΟΥ","ΥΙΟΥ ΔΑΥΙΔ ΥΙΟΥ ΑΒΡΑΑΜ","ΑΒΡΑΑΜ ΕΓΕΝΝΗΣΕ ΤΟΝ ΙΣΑΑΚ","ΙΣΑΑΚ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΙΑΚΩΒ","ΙΑΚΩΒ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΙΟΥΔΑΝ","ΚΑΙ ΤΟΥΣ ΑΔΕΛΦΟΥΣ ΑΥΤΟΥ","ΙΟΥΔΑΣ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΦΑΡΕΣ","ΚΑΙ ΤΟΝ ΖΑΡΑ ΕΚ ΤΗΣ ΘΑΜΑΡ","ΦΑΡΕΣ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΕΣΡΩΜ","ΕΣΡΩΜ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΑΡΑΜ"]},
 {folio:"Folio 02",head:"ΚΑΤΑ ΜΑΤΘΑΙΟΝ",lines:["ΑΡΑΜ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΑΜΙΝΑΔΑΒ","ΑΜΙΝΑΔΑΒ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΝΑΑΣΣΩΝ","ΝΑΑΣΣΩΝ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΣΑΛΜΩΝ","ΣΑΛΜΩΝ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΒΟΟΖ","ΕΚ ΤΗΣ ΡΑΧΑΒ ΒΟΟΖ ΔΕ ΕΓΕΝΝΗΣΕ","ΤΟΝ ΩΒΗΔ ΕΚ ΤΗΣ ΡΟΥΘ","ΩΒΗΔ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΙΕΣΣΑΙ","ΙΕΣΣΑΙ ΔΕ ΕΓΕΝΝΗΣΕ ΤΟΝ ΔΑΥΙΔ","ΤΟΝ ΒΑΣΙΛΕΑ ΔΑΥΙΔ ΔΕ ΕΓΕΝΝΗΣΕ","ΤΟΝ ΣΟΛΟΜΩΝΑ ΕΚ ΤΗΣ ΤΟΥ ΟΥΡΙΟΥ"]},
 {folio:"Folio 03",head:"ΚΑΤΑ ΜΑΤΘΑΙΟΝ",lines:["ΙΩΣΗΦ ΔΕ Ο ΑΝΗΡ ΑΥΤΗΣ","ΔΙΚΑΙΟΣ ΩΝ ΚΑΙ ΜΗ ΘΕΛΩΝ","ΑΥΤΗΝ ΠΑΡΑΔΕΙΓΜΑΤΙΣΑΙ","ΕΒΟΥΛΗΘΗ ΛΑΘΡΑ ΑΠΟΛΥΣΑΙ","ΑΥΤΗΝ ΤΑΥΤΑ ΔΕ ΑΥΤΟΥ","ΕΝΘΥΜΗΘΕΝΤΟΣ ΙΔΟΥ ΑΓΓΕΛΟΣ","ΚΥΡΙΟΥ ΚΑΤ ΟΝΑΡ ΕΦΑΝΗ ΑΥΤΩ","ΛΕΓΩΝ ΙΩΣΗΦ ΥΙΟΣ ΔΑΥΙΔ","ΜΗ ΦΟΒΗΘΗΣ ΠΑΡΑΛΑΒΕΙΝ","ΜΑΡΙΑΜ ΤΗΝ ΓΥΝΑΙΚΑ ΣΟΥ"]},
 {folio:"Folio 04",head:"ΚΑΤΑ ΜΑΤΘΑΙΟΝ",lines:["ΙΔΟΥ Η ΠΑΡΘΕΝΟΣ ΕΝ ΓΑΣΤΡΙ","ΕΞΕΙ ΚΑΙ ΤΕΞΕΤΑΙ ΥΙΟΝ","ΚΑΙ ΚΑΛΕΣΟΥΣΙ ΤΟ ΟΝΟΜΑ","ΑΥΤΟΥ ΕΜΜΑΝΟΥΗΛ","Ο ΕΣΤΙ ΜΕΘΕΡΜΗΝΕΥΟΜΕΝΟΝ","ΜΕΘ ΗΜΩΝ Ο ΘΕΟΣ","ΔΙΕΓΕΡΘΕΙΣ ΔΕ Ο ΙΩΣΗΦ","ΑΠΟ ΤΟΥ ΥΠΝΟΥ ΕΠΟΙΗΣΕΝ","ΩΣ ΠΡΟΣΕΤΑΞΕΝ ΑΥΤΩ Ο ΑΓΓΕΛΟΣ","ΚΥΡΙΟΥ ΚΑΙ ΠΑΡΕΛΑΒΕ ΤΗΝ ΓΥΝΑΙΚΑ"]}
];
export default function CodexViewer(){
 const [leaf,setLeaf]=useState(0),[zoom,setZoom]=useState(1),[turn,setTurn]=useState(false),[modern,setModern]=useState(false);
 const move=(d:number)=>{if(turn)return;setTurn(true);window.setTimeout(()=>{setLeaf(n=>Math.min(leaves.length-1,Math.max(0,n+d)));setTurn(false)},320)};
 const p=leaves[leaf];
 return <main className="min-h-screen bg-[#0b1014] text-[#e9e3d8]">
  <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-10">
   <Link href="/bible" className="text-xs tracking-[.2em] uppercase text-[#aaa08d] hover:text-white">← The Bible</Link>
   <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
    <div><p className="text-xs tracking-[.35em] uppercase text-[#c5a878]">Manuscript laboratory / Prototype 01</p><h1 className="mt-3 font-serif text-5xl md:text-7xl">Virtual Codices</h1><p className="mt-3 text-[#aeb2b2]">Codex α · Interactive study reconstruction</p></div>
    <div className="flex flex-wrap items-center gap-2 text-sm">
     <button aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(.7,+(z-.15).toFixed(2)))} className="rounded border border-white/20 px-4 py-3 hover:bg-white/10">−</button>
     <span className="min-w-14 text-center">{Math.round(zoom*100)}%</span>
     <button aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(1.6,+(z+.15).toFixed(2)))} className="rounded border border-white/20 px-4 py-3 hover:bg-white/10">+</button>
     <button onClick={()=>setZoom(1)} className="rounded border border-white/20 px-4 py-3 hover:bg-white/10">Reset</button>
    </div>
   </div>
   <section aria-label="Interactive manuscript viewer" className="relative mt-9 overflow-hidden rounded-2xl border border-[#6c6252]/40 bg-[radial-gradient(ellipse_at_center,#343029,#161a1d_68%)] px-4 py-12 shadow-2xl md:py-16">
    <div className="flex min-h-[570px] items-center justify-center overflow-auto py-8" style={{perspective:"1400px"}}>
     <div className="relative origin-center transition-transform duration-300" style={{transform:`scale(${zoom})`}}>
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-r-xl bg-[#4a3624] shadow-[14px_18px_40px_#0009]"/>
      <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-lg bg-[#a58b64]"/>
      <article className="relative flex h-[490px] w-[305px] flex-col overflow-hidden rounded-r-lg border-l-[13px] border-[#806344] px-7 pb-8 pt-9 text-[#352818] shadow-[inset_0_0_45px_#98754a77,8px_12px_28px_#0008] sm:h-[550px] sm:w-[400px] sm:px-10" style={{background:"repeating-linear-gradient(95deg,transparent 0px,#7656310b 2px,transparent 4px,transparent 16px),linear-gradient(115deg,#dfc89c,#e8d5ad 40%,#d4b98a)",transformOrigin:"left center",transform:turn?"rotateY(-74deg)":"rotateY(0deg)",transition:"transform 320ms ease-in-out"}}>
       <div className="text-center text-[10px] tracking-[.25em] text-[#7a5d36]">{p.folio.toUpperCase()} · CODEX α</div>
       <h2 className="mt-7 text-center font-serif text-lg tracking-[.16em]">{p.head}</h2>
       <div className="mt-8 flex-1 space-y-3 overflow-hidden text-center font-serif text-[12px] leading-[1.55] tracking-[.045em] sm:text-[15px]" lang="grc">{p.lines.map((line,i)=><p key={i} className={modern?"normal-case tracking-normal":""}>{modern?line.toLocaleLowerCase("el"):line}</p>)}</div>
       <div className="mt-5 text-center text-[10px] tracking-widest text-[#795c39]">✦ {leaf+1} ✦</div>
      </article>
     </div>
    </div>
    <div className="mx-auto mt-4 flex max-w-md items-center justify-between gap-3">
     <button disabled={leaf===0||turn} onClick={()=>move(-1)} className="rounded-full border border-[#aa9475]/50 px-5 py-3 text-sm disabled:opacity-30 hover:bg-white/10">← Previous</button>
     <span className="text-sm text-[#c9b99d]">{leaf+1} / {leaves.length}</span>
     <button disabled={leaf===leaves.length-1||turn} onClick={()=>move(1)} className="rounded-full border border-[#aa9475]/50 px-5 py-3 text-sm disabled:opacity-30 hover:bg-white/10">Next →</button>
    </div>
   </section>
   <div className="mt-7 grid gap-6 md:grid-cols-[1fr_1fr]">
    <div className="rounded-xl border border-white/10 p-6"><p className="text-xs tracking-[.2em] uppercase text-[#c5a878]">Display settings</p><button onClick={()=>setModern(m=>!m)} className="mt-4 rounded-lg border border-white/20 px-4 py-3 text-sm hover:bg-white/10">{modern?"Restore uppercase manuscript style":"Toggle lowercase transcription"}</button><p className="mt-4 text-sm leading-6 text-[#aeb2b2]">Navigate folios with Previous / Next. Use + and − to zoom. The page-turn effect is a prototype animation.</p></div>
    <div className="rounded-xl border border-[#c5a878]/30 bg-[#c5a878]/5 p-6"><p className="text-xs tracking-[.2em] uppercase text-[#c5a878]">Scholarly notice</p><p className="mt-4 text-sm leading-7 text-[#d3c9b7]">Codex α is an <strong>illustrative virtual codex</strong>, not a photographic or diplomatic facsimile of a historical manuscript. Its sample lines are selective and not a continuous, verified transcription. Folio numbering, layout, material, and letterforms are artistic reconstructions. Do not cite this prototype as manuscript evidence.</p></div>
   </div>
  </div>
 </main>;
}