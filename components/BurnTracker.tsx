import React from 'react';
import { Flame } from 'lucide-react';

const BurnTracker: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <a 
      href="https://basescan.org/token/0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A?a=0x0000000000000000000000000000000000000000#tokentxns" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`group flex items-center bg-chuck-primary border-2 border-chuck-secondary h-10 shadow-[4px_4px_0px_rgba(110,152,218,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(110,152,218,0.3)] hover:border-white transition-all cursor-pointer overflow-hidden w-full max-w-[360px] md:max-w-[420px] ${className}`}
    >
      <div className="h-full px-3 flex items-center justify-center border-r-2 border-chuck-secondary bg-chuck-dark group-hover:bg-chuck-secondary/20 transition-colors">
        <Flame size={16} className="text-chuck-burn animate-pulse-fast" fill="#FF4500" />
      </div>
      
      <div className="flex flex-col px-3 py-1 leading-none justify-center h-full">
        <span className="font-arcade text-[6px] text-chuck-secondary mb-1 uppercase tracking-wider group-hover:text-white">Total Burned</span>
        <span className="font-mono text-xs font-black text-white tracking-tighter group-hover:text-chuck-secondary transition-colors">113,078,664</span>
      </div>
    </a>
  );
};

export default BurnTracker;
