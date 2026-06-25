import React from "react";

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505] pointer-events-none">
      {/* Ambient color blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)] blur-[80px] animate-mesh-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] blur-[80px] animate-mesh-2" />
      <div className="absolute top-[20%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.08)_0%,transparent_70%)] blur-[80px] animate-mesh-3" />
      <div className="absolute bottom-[10%] left-[-20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.10)_0%,transparent_70%)] blur-[80px] animate-mesh-4" />
      
      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050505_95%)]" />
    </div>
  );
}
