import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Copy, 
  Flame, 
  Heart, 
  Menu, 
  X,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  Lock,
  Skull,
  ShoppingBag,
  Trophy,
  Zap,
  Crown,
  Unlock,
  PieChart,
  ExternalLink,
  Info,
  Download,
  Globe,
  Award,
  ArrowUpCircle,
  Coins,
  Crosshair,
  Store,
  Mail,
  FileText,
  AlertTriangle,
  Twitter,
  Send
} from 'lucide-react';
import BurnTracker from './components/BurnTracker';
import Reveal from './components/Reveal';

const CONTRACT_ADDRESS = "0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A";
const CHARITY_WALLET = "0x222A62871904553b8F2A0bdab433E798c4691BFF";

// KONAMI CODE HOOK
const useKonamiCode = () => {
  const [triggered, setTriggered] = useState(false);
  const sequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  
  useEffect(() => {
    let history: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      history = [...history, e.key.toLowerCase()].slice(-10);
      if (JSON.stringify(history) === JSON.stringify(sequence)) {
        setTriggered(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return triggered;
};

// SCROLL ANIMATION HOOK - Refactored to Callback Ref
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Trigger once
        }
      }, { threshold });
      
      observer.observe(node);
      observerRef.current = observer;
    }
  }, [threshold]);

  return [setRef, isInView] as const;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const godMode = useKonamiCode();

  // Scroll Animations Hooks for specific sections
  const [questRef, questInView] = useInView(0.1);
  const [tokenomicsRef, tokenomicsInView] = useInView(0.1);

  useEffect(() => {
    // Slower initial load sequence (4.5s)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Robust Navigation Handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      // behavior: 'smooth' gives the nice scroll
      // block: 'start' aligns it to the top, respecting scroll-margin-top from CSS
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without jumping
      window.history.pushState(null, '', id);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center font-mono text-chuck-secondary overflow-hidden">
        {/* Scanlines Effect - Kept only on Loading Screen where it is static/aesthetic */}
        <div className="absolute inset-0 bg-scanlines bg-[size:100%_4px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <Reveal animation="scale" duration={1000}>
            <img 
              src="http://emoprince.github.io/Chuck95/LOGO_C-W.svg" 
              alt="Loading Logo" 
              className="w-24 h-24 mb-8 animate-pulse" 
            />
          </Reveal>
          
          <div className="w-64 mb-4">
            <div className="flex justify-between text-xs mb-1">
               <span>LOADING ASSETS</span>
               <span>v1.0.4</span>
            </div>
            <div className="h-4 border-2 border-chuck-secondary p-0.5">
               <div className="h-full bg-chuck-secondary animate-progress"></div>
            </div>
          </div>
          <div className="text-xs animate-blink text-white mt-4">INITIALIZING BASE PROTOCOL...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans text-white bg-chuck-primary selection:bg-chuck-secondary selection:text-white flex flex-col overflow-x-hidden transition-all duration-1000 ${godMode ? 'theme-god-mode' : ''}`}>
      
      {/* GOD MODE NOTIFICATION */}
      {godMode && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-bounce">
           <div className="bg-yellow-400 text-black font-arcade text-xs px-4 py-2 border-4 border-white shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
              CHEAT CODE ACTIVATED: ROSTER UNLOCKED
           </div>
        </div>
      )}

      {/* DISCLAIMER MODAL */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-chuck-dark border-4 border-chuck-secondary max-w-2xl w-full h-[80vh] shadow-neon relative animate-scale-in flex flex-col">
              <div className="bg-chuck-secondary text-chuck-primary p-2 font-arcade text-sm flex justify-between items-center shrink-0">
                 <span className="flex items-center gap-2"><AlertTriangle size={16} /> SYSTEM WARNING</span>
                 <button onClick={() => setIsDisclaimerOpen(false)} className="hover:bg-white/20 p-1"><X size={16} /></button>
              </div>
              <div className="p-6 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto custom-scrollbar">
                 <h2 className="font-arcade text-xl text-chuck-burn mb-6 border-b border-chuck-burn/30 pb-2">DISCLAIMER</h2>
                 <p className="mb-4">Please read the following disclaimer carefully before engaging in any buying, selling, or trading on cryptocurrency exchanges such as Uniswap.</p>
                 
                 <div className="space-y-4 text-xs border border-chuck-secondary/20 p-4 bg-black/40 mb-6">
                    <p><strong className="text-white">Acknowledgment of Risk:</strong> Trading goods, products, or digital currencies carries inherent risk. The value of digital assets can drastically change within short timeframes, potentially leading to significant gains or losses. Given the unpredictable nature of digital currencies, which may even become valueless, consider your financial position carefully before participating in such transactions.</p>
                    <p><strong className="text-white">Transaction Fees:</strong> Be advised that transaction fees, including a 0.99% sell tax, may apply when trading digital assets. Buying may not incur this tax. Fee structures are subject to change, and staying informed of the current fees is your responsibility.</p>
                    <p><strong className="text-white">General Investment Disclaimer:</strong> This document is current as of its last revision and does not offer investment, financial, or trading advice. Prior to any investment action, it is recommended to undertake personal research and seek advice from a financial professional. When you engage in transactions, it is under the acknowledgement that you are not investing in a security. All products are provided 'as is' with no guarantee or obligation of support.</p>
                    <p><strong className="text-white">Regulatory Uncertainty:</strong> The regulatory environment for digital currencies is evolving and may differ widely between jurisdictions. It is incumbent upon you to ensure that you are compliant with all applicable laws and regulations for your area regarding digital currency use and trading.</p>
                    <p><strong className="text-white">Accuracy of Information:</strong> We aim to maintain accurate information but will not be held responsible for any inaccuracies. Information is offered without warranty, and reliance upon it is at your own risk.</p>
                    <p><strong className="text-white">No Guarantees:</strong> There are no guaranteed profits or assurances against losses in the digital currency market. No representation regarding the potential value performance of any digital asset has been made to you.</p>
                    <p><strong className="text-white">Fictional Representation:</strong> Any entities, names, marks, emblems, and images related to Chuck and the digital asset discussed are purely fictional for illustrative purposes and not connected to any real individuals or entities. Their use implies no official endorsement or association.</p>
                 </div>
                 
                 <p className="text-center text-white/50">By engaging in any transactions, you affirm that you have read, comprehended, and agreed to the terms outlined in this disclaimer. You acknowledge that you bear sole responsibility for your investment decisions and transactions.</p>

                 <div className="mt-8">
                     <button 
                        onClick={() => setIsDisclaimerOpen(false)}
                        className="w-full bg-chuck-secondary/20 hover:bg-chuck-secondary text-chuck-secondary hover:text-chuck-primary font-arcade py-3 border border-chuck-secondary transition-colors"
                     >
                        I UNDERSTAND & ACCEPT
                     </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* WHITEPAPER MODAL */}
      {isWhitepaperOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-chuck-dark border-4 border-chuck-secondary max-w-3xl w-full h-[85vh] shadow-neon relative animate-scale-in flex flex-col">
              {/* Header */}
              <div className="bg-chuck-secondary text-chuck-primary p-3 font-arcade text-sm flex justify-between items-center shrink-0">
                 <span className="flex items-center gap-2"><FileText size={16} /> CHUCK_WHITEPAPER.TXT</span>
                 <button onClick={() => setIsWhitepaperOpen(false)} className="hover:bg-white/20 p-1"><X size={20} /></button>
              </div>
              
              {/* Content */}
              <div className="p-8 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 custom-scrollbar">
                 <h2 className="font-arcade text-xl text-white mb-6 border-b border-chuck-secondary/30 pb-2">What is CHUCK ?</h2>
                 <p className="mb-8">
                   $CHUCK is a project that embodies the spirit of dog-themed meme coins within the crypto space. It pays homage to the enduring relationship between iconic figures and their canine companions, represented through $CHUCK, a symbol of resilience and strength.
                   <br/><br/>
                   As a nod to pop culture heroes and their beloved dogs, $CHUCK stands as a tribute to the unique bond shared between them, encapsulating the essence of companionship and loyalty.
                 </p>

                 <h2 className="font-arcade text-xl text-white mb-6 border-b border-chuck-secondary/30 pb-2">The vision</h2>
                 <p className="mb-8">
                   $CHUCK is a community-centric project with a focus on spotlighting the BASE ecosystem. Meme coins serve as an accessible entry point for the general public into the realm of cryptocurrency.
                   <br/><br/>
                   BASE, being an innovative layer two scaling solution for Ethereum, remains relatively unknown outside the crypto community. $CHUCK’s mission is to amplify interest and engagement within the BASE environment, foster increased activity on decentralized exchanges (DEXes), boost the total value locked (TVL) on the BASE platform, and support the overarching goals set forth by Brian Armstrong and the Coinbase team.
                   <br/><br/>
                   Moreover, $CHUCK is dedicated to cultivating a themed ecosystem and community, offering members a platform to connect, share, and create inspired NFTs, merchandise, and games that echo the adventurous spirit of 1980’s action movies and retro gaming aesthetics.
                 </p>

                 <h2 className="font-arcade text-xl text-white mb-6 border-b border-chuck-secondary/30 pb-2">The utility</h2>
                 <p className="mb-8">
                   Designed with fun and community engagement at its core, $CHUCK serves as more than just a token; it’s a passport to an exclusive club. Owning $CHUCK tokens grants access to the $CHUCK Telegram group and Chuck-Bot, a specialized bot providing community members with crucial insights into the crypto market, including updates on trending coins and ETH gas fees.
                   <br/><br/>
                   Token holders are also privy to communitygenerated NFTs, games, and exclusive content. Beyond its role as a dog-themed meme coin, $CHUCK is committed to making a tangible impact on the welfare of dogs. Each $CHUCK transaction includes a 0.99% tax, a portion of which is allocated to supporting dog charities. This initiative positions $CHUCK as the pioneering meme coin with a commitment to benefiting our furry friends, in harmony with the extensive meme culture found within the crypto industry.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* --- HUD NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full z-[100] ${godMode ? 'bg-yellow-400 border-b-4 border-black' : 'bg-chuck-primary/95 backdrop-blur-md border-b border-chuck-secondary/30'} h-16 transition-colors duration-500 shadow-lg`}>
        <div className="max-w-[1920px] mx-auto h-full px-4 md:px-6 flex items-center justify-between relative">
            
            {/* Left: Menu Icon (Universal) */}
            <div className="flex items-center gap-8">
               <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className={`p-2 hover:bg-chuck-secondary/20 transition-colors border border-transparent hover:border-chuck-secondary/50 ${godMode ? 'text-black' : 'text-white'}`}
                  aria-label="Toggle Menu"
               >
                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end ml-auto">
               {/* Burn Tracker - Matched Size */}
               <div className="h-10 hidden sm:block">
                 <BurnTracker />
               </div>
               
               {/* Insert Coin - Without Animation */}
               <a 
                 href="https://app.uniswap.org/swap?chain=base&outputCurrency=0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A" 
                 target="_blank" 
                 rel="noreferrer"
                 className="relative group h-9 sm:h-10 overflow-hidden bg-chuck-dark text-center px-0"
                >
                 {/* Inner Content Mask */}
                 <div className="absolute inset-[2px] bg-chuck-dark group-hover:bg-yellow-400/10 transition-colors"></div>
                 
                 {/* Button Content */}
                 <div className="relative h-full px-4 sm:px-6 flex items-center gap-2 font-arcade text-[11px] sm:text-xs border border-chuck-secondary group-hover:border-transparent text-chuck-secondary group-hover:text-yellow-400 transition-colors z-10 shadow-[0_0_10px_rgba(110,152,218,0.2)] group-hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] justify-center">
                   INSERT COIN
                 </div>
               </a>
            </div>
        </div>

        {/* Dropdown Menu (Universal) */}
        {isMenuOpen && (
          <div className="bg-chuck-primary border-b border-chuck-secondary/30 absolute w-full left-0 top-16 z-50 shadow-xl border-t border-chuck-secondary/30">
             <div className="flex flex-col max-w-7xl mx-auto">
                <a href="#character" onClick={(e) => handleNavClick(e, '#character')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <Gamepad2 size={16} className="text-chuck-secondary" /> SELECT PLAYER
                </a>
                <a href="#quest" onClick={(e) => handleNavClick(e, '#quest')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <Heart size={16} className="text-chuck-secondary" /> MAIN QUEST
                </a>
                <a href="#stats" onClick={(e) => handleNavClick(e, '#stats')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <PieChart size={16} className="text-chuck-secondary" /> GAME STATS
                </a>
                <a href="#bonus" onClick={(e) => handleNavClick(e, '#bonus')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <Flame size={16} className="text-chuck-secondary" /> BURN LOTTERY
                </a>
                <a href="#partners" onClick={(e) => handleNavClick(e, '#partners')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <Trophy size={16} className="text-chuck-secondary" /> HALL OF FAME
                </a>
                <a href="#memes" onClick={(e) => handleNavClick(e, '#memes')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark border-b border-white/5 flex items-center gap-3">
                   <Download size={16} className="text-chuck-secondary" /> GALLERY
                </a>
                <a href="#merchant" onClick={(e) => handleNavClick(e, '#merchant')} className="p-4 text-white font-arcade text-sm hover:bg-chuck-dark flex items-center gap-3">
                   <Store size={16} className="text-chuck-secondary" /> MERCHANT
                </a>
             </div>
          </div>
        )}
      </nav>

      <main className="flex-1 relative pt-16">
        
        {/* --- HERO: START SCREEN --- */}
        <section className="relative min-h-[55vh] md:min-h-[90vh] flex flex-col items-center justify-start md:justify-center overflow-hidden pt-12 pb-4 md:py-20">
           {/* Background Grid - No scanlines here to prevent moire */}
           <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(110,152,218,0.05)_0%,rgba(2,4,10,1)_100%)]"></div>

           <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4">
              
              {/* Top Banner */}
              <div className="w-full flex flex-col items-center gap-2 md:flex-row md:justify-between md:items-end border-b border-chuck-secondary/30 pb-1 md:pb-2 mb-3 md:mb-10 font-mono text-chuck-secondary text-[11px] md:text-xs uppercase tracking-[0.2em] text-center md:text-left">
                 <span className="flex items-center gap-2 justify-center">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-blink shadow-[0_0_10px_#22c55e]"></div> 
                   <span className="text-green-500 shadow-green-500/50 drop-shadow-sm">SERVER: ONLINE</span>
                 </span>
                 <span>CHAIN ID: 8453 // TICKER: $CHUCK</span>
              </div>

              {/* Hero Stack - equal spacing */}
              <div className="w-full flex flex-col items-center gap-5 md:gap-6">
                {/* Main Logo */}
                <div className="relative w-full max-w-[520px] sm:max-w-[640px] md:max-w-6xl group">
                  <Reveal animation="epic" duration={1500}>
                    <div className="relative z-10 flex justify-center">
                      <img 
                        src="https://emoprince.github.io/Chuck95/LOGO_CHUCK-W.svg" 
                        alt="Chuck Logo" 
                        className="w-full h-auto drop-shadow-[0_0_40px_rgba(110,152,218,0.2)]"
                        style={{
                          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                        }}
                      />
                    </div>
                  </Reveal>
                </div>

                {/* Lore Box */}
                <div className="bg-chuck-dark/80 backdrop-blur-md border border-chuck-secondary/30 p-3 sm:p-5 max-w-[90%] sm:max-w-md md:max-w-lg shadow-neon">
                   <p className="font-mono text-chuck-secondary text-center text-[11px] sm:text-xs md:text-sm leading-relaxed">
                      The round house kicking crypto canine, unleashed strength for a pawsitive cause !
                   </p>
                </div>

                {/* Primary Action */}
                <div className="flex flex-col items-center gap-3 md:gap-4 mt-3 md:mt-0">
                   <a 
                     href="#character"
                     onClick={(e) => handleNavClick(e, '#character')}
                     className="group relative"
                   >
                      <div className="absolute inset-0 bg-chuck-secondary translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 opacity-50"></div>
                      <div className={`relative text-white font-arcade text-sm px-8 py-3 border-2 border-white hover:-translate-y-1 transition-all flex items-center gap-4 ${godMode ? 'bg-yellow-500 text-black border-black' : 'bg-chuck-burn hover:bg-chuck-burn/90 shadow-neon-burn'}`}>
                         <Gamepad2 size={20} /> {godMode ? 'GOD START' : 'START GAME'}
                      </div>
                   </a>
                   <span className="font-mono text-[10px] text-white/40 tracking-widest animate-pulse">PRESS TO CONTINUE</span>
                </div>
              </div>

           </div>
        </section>

        {/* --- LEVEL 1: CHARACTER SELECT --- */}
        <section id="character" className="relative py-12 md:py-24 px-4 border-t border-chuck-secondary/20 bg-chuck-primary scroll-mt-12 md:scroll-mt-16">
           {/* Subtle Grid Background - No Scanlines */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#001a4d_1px,transparent_1px),linear-gradient(to_bottom,#001a4d_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
           
           <div className="max-w-7xl mx-auto relative z-10">
              {/* Header */}
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12 md:mb-16">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="bg-chuck-secondary text-chuck-primary font-arcade px-3 py-1 text-sm">LEVEL 01</div>
                    <h2 className="font-arcade text-2xl md:text-4xl text-white drop-shadow-[0_0_10px_rgba(110,152,218,0.5)]">SELECT FIGHTER</h2>
                 </div>
                 <div className="hidden md:flex gap-1">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-8 bg-chuck-secondary/20 skew-x-12"></div>)}
                 </div>
              </div>

              {/* Removed Fixed height to fix overlap issue */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                 
                 {/* P1: CHUCK (Featured) */}
                 <div className="lg:col-span-7">
                   <div className="h-full">
                     <div className="flex flex-col relative bg-black/40 border border-chuck-secondary/50 p-4 sm:p-6 shadow-neon backdrop-blur-sm min-h-[380px] md:min-h-[500px] h-full">
                        <div className="absolute -top-3 -left-3 z-20 bg-chuck-secondary text-chuck-primary font-arcade text-xs px-2 py-1 border border-white">
                           PLAYER 1
                        </div>
                        
                        {/* Character Visual */}
                        <div className="flex-1 relative overflow-hidden border border-chuck-secondary/30 mb-2 group bg-black">
                           <img 
                              src="https://emoprince.github.io/Chuck95/Ready%20Chuck.jpg" 
                              alt="Chuck"
                              // Removed grayscale filters to give color by default
                              className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                           />
                           {/* CRT Scanline Overlay - Kept here because image is small/contained */}
                           <div className="absolute inset-0 bg-scanlines bg-[length:100%_4px] pointer-events-none z-10 opacity-30"></div>
                           
                           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-chuck-primary to-transparent p-6 pt-24 z-20">
                              <h3 className="font-arcade text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-white to-chuck-secondary mb-2 italic drop-shadow-md">CHUCK</h3>
                              <div className="flex gap-2 font-mono text-xs text-chuck-secondary">
                                 <span className="bg-chuck-primary/80 border border-chuck-secondary/30 px-2 py-1">TYPE: BEAST</span>
                                 <span className="bg-chuck-primary/80 border border-chuck-secondary/30 px-2 py-1">RANGE: MELEE</span>
                              </div>
                           </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="bg-chuck-dark/80 p-4 grid grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 font-mono text-xs text-white border-t border-chuck-secondary/20">
                           <Attribute label="STRENGTH" value={95} />
                           <Attribute label="SPEED" value={80} />
                           <Attribute label="LOYALTY" value={100} />
                           <Attribute label="BURN" value={90} />
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Roster Grid (Right Side) */}
                 <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 content-start">
                    {/* Locked Characters - Updated Icons */}
                    <RosterCard unlocked={godMode} name={godMode ? "DIAMOND" : "THE JEET"} icon={godMode ? <Crown size={32} /> : <Crosshair size={32} />} desc={godMode ? "NEVER SELLS" : "SOLD TOO EARLY"} />
                    <RosterCard unlocked={godMode} name={godMode ? "BELIEVER" : "FUDDER"} icon={godMode ? <Heart size={32} /> : <Skull size={32} />} desc={godMode ? "HELD THE LINE" : "DOESN'T BELIEVE"} />
                    <RosterCard unlocked={godMode} name={godMode ? "COMMUNITY" : "CABAL"} icon={godMode ? <ShieldCheck size={32} /> : <Lock size={32} />} desc={godMode ? "STRONGER TOGETHER" : "SECRET BOSS"} />
                    
                    {/* Random Select */}
                    <div className={`aspect-square border flex items-center justify-center cursor-help group overflow-hidden relative h-full ${godMode ? 'bg-yellow-900/20 border-yellow-400' : 'bg-chuck-dark border-chuck-secondary/30 border-dashed'}`}>
                       <span className={`font-arcade text-4xl group-hover:scale-125 transition-transform ${godMode ? 'text-yellow-500' : 'text-chuck-secondary/30'}`}>?</span>
                    </div>

                    {/* Context Box */}
                     <div className="col-span-2">
                       <div className="bg-chuck-dark text-chuck-secondary p-4 font-mono text-[11px] sm:text-xs mt-4 border-l-4 border-chuck-secondary h-full leading-snug">
                           <span className="text-white font-bold block mb-2">{'>'} CHARACTER BIO:</span>
                           "Chuck is a French Briard with a black belt temperament: all business when he hunts, all heart when he’s with the pack. He stalks the Base network, boots bad actors, and torches tokens so his crew grows stronger together."
                       </div>
                     </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- NEW SECTION: DONATIONS (MAIN QUEST) --- */}
        <section id="quest" className="bg-chuck-dark py-16 md:py-24 px-4 border-t border-chuck-secondary/20 relative overflow-hidden scroll-mt-16">
             {/* Heart Background Pattern */}
             <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,69,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             
             <div className="max-w-5xl mx-auto relative z-10">
                <div className="bg-chuck-primary border-4 border-white/10 p-1 shadow-2xl">
                   <div className="bg-chuck-primary border-2 border-chuck-secondary/50 p-8 md:p-12 relative">
                      {/* Quest Marker */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-chuck-secondary text-chuck-primary font-arcade px-6 py-2 border-2 border-white shadow-neon text-sm whitespace-nowrap">
                         MAIN QUEST: SAVE THE PACK
                      </div>

                      <div className="flex flex-col md:flex-row gap-12 items-center mt-6">
                         <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                              {/* SMOOTHER HEART ANIMATION */}
                              <div className="relative mb-6 animate-pulse-smooth">
                                 <Heart size={100} fill="#FF4500" className="text-chuck-burn drop-shadow-[0_0_25px_rgba(255,69,0,0.6)]" />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-arcade text-2xl text-white">+1UP</span>
                                 </div>
                              </div>
                            <h3 className="font-arcade text-xl text-white mb-2">DONATIONS</h3>
                            <p className="font-mono text-xs text-chuck-secondary">Chuck isn't just a mascot. He's a guardian. A portion of taxes and burns supports real dog shelters.</p>
                         </div>

                         {/* ATTACH REF HERE FOR QUEST ANIMATION */}
                         <div className="w-full md:w-2/3 space-y-6" ref={questRef}>
                            <div className="bg-chuck-dark border border-chuck-secondary/30 p-6 relative">
                               <div className="font-arcade text-sm text-white mb-4 flex justify-between">
                                  <span>MISSION PROGRESS</span>
                                  <span className="text-chuck-secondary">LVL 5</span>
                               </div>
                               
                               {/* Progress Bar - ANIMATED ON SCROLL */}
                               <div className="h-6 bg-black border-2 border-white/20 p-1 mb-2">
                                  <div className="h-full w-full">
                                    <div 
                                      className="h-full bg-gradient-to-r from-chuck-secondary to-white shadow-[0_0_10px_rgba(255,255,255,0.5)] relative overflow-hidden transition-all duration-1000 ease-out"
                                      style={{ width: questInView ? '15%' : '0%' }}
                                    >
                                       <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1))] bg-[size:10px_10px]"></div>
                                    </div>
                                  </div>
                               </div>
                               <div className="flex justify-between font-mono text-[10px] text-chuck-secondary">
                                  <span>$15,000 DONATED</span>
                                  <span>GOAL: $100,000</span>
                               </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                               <div className="flex-1 bg-chuck-secondary/10 border border-chuck-secondary/30 p-4 flex items-center gap-3">
                                  <Heart className="text-chuck-burn shrink-0" size={20} />
                                  <div className="flex flex-col">
                                     <span className="font-arcade text-xs text-white">CHARITY WALLET</span>
                                     <span className="font-mono text-[10px] text-chuck-secondary break-all">{CHARITY_WALLET}</span>
                                  </div>
                               </div>
                               <a 
                                 href="https://commerce.coinbase.com/checkout/1d554b19-f75f-4014-a272-d2ea6547dbbd"
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="px-6 py-3 bg-chuck-secondary hover:bg-white text-chuck-primary font-arcade text-xs flex items-center justify-center gap-2 transition-colors"
                               >
                                 <Heart size={16} /> DONATE
                               </a>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
        </section>

        {/* --- LEVEL 2: TOKENOMICS --- */}
        <section id="stats" className="bg-chuck-primary py-14 md:py-24 px-4 relative border-t border-chuck-secondary/20 scroll-mt-14 md:scroll-mt-16">
           {/* Tech Background - No Scanlines */}
           <div className="absolute inset-0 bg-grid-pattern bg-[size:30px_30px] opacity-10"></div>
           
           <div className="max-w-7xl mx-auto relative z-10">
              {/* Header */}
              <div className="flex items-center justify-end mb-16 gap-4">
                 <h2 className="font-arcade text-2xl md:text-4xl text-white text-right">SYSTEM STATS</h2>
                 <div className="bg-chuck-secondary text-chuck-primary font-arcade px-3 py-1 text-sm">LEVEL 02</div>
              </div>

              <div className="bg-chuck-dark/50 border border-chuck-secondary/30 backdrop-blur-md p-8 shadow-neon">
                  <div className="flex gap-2 border-b border-chuck-secondary/20 pb-6 mb-8">
                     <div className="bg-chuck-secondary/20 text-chuck-secondary border border-chuck-secondary font-arcade text-xs px-4 py-2">TOKENOMICS.CFG</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                     {/* Left: Token Repartition Chart */}
                     <div className="relative group flex flex-col gap-6">
                        <div className="font-arcade text-white text-lg mb-2 flex items-center gap-2 h-7">
                           <PieChart className="text-chuck-secondary" /> REPARTITION
                        </div>
                        
                        {/* Custom Bar Chart Visuals - ANIMATED ON SCROLL */}
                        <div className="space-y-4" ref={tokenomicsRef}>
                           {/* Liquidity Pool: 70% */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>LIQUIDITY POOL</span>
                                 <span>70%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-chuck-secondary shadow-[0_0_10px_#6E98DA] transition-all duration-1000 ease-out" 
                                    style={{ width: tokenomicsInView ? '70%' : '0%' }}
                                 ></div>
                                 <div className="h-full w-[30%] bg-transparent flex gap-1 px-1">
                                    {[...Array(5)].map((_,i) => <div key={i} className="h-full w-px bg-chuck-secondary/20"></div>)}
                                 </div>
                              </div>
                           </div>

                           {/* Team: 10% */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>TEAM</span>
                                 <span>10%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7] transition-all duration-1000 ease-out"
                                    style={{ width: tokenomicsInView ? '10%' : '0%' }}
                                 ></div>
                              </div>
                           </div>

                            {/* Airdrop: 7.5% */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>AIRDROP</span>
                                 <span>7.5%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308] transition-all duration-1000 ease-out"
                                    style={{ width: tokenomicsInView ? '7.5%' : '0%' }}
                                 ></div>
                              </div>
                           </div>
                           
                           {/* Additional Liquidity: 4.5% */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>ADDITIONAL LIQUIDITY</span>
                                 <span>4.5%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-blue-400 shadow-[0_0_10px_#60a5fa] transition-all duration-1000 ease-out"
                                    style={{ width: tokenomicsInView ? '4.5%' : '0%' }}
                                 ></div>
                              </div>
                           </div>

                           {/* Marketing & Development: 4.5% (Summed up) */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>MARKETING & DEV</span>
                                 <span>4.5%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-green-500 shadow-[0_0_10px_#22c55e] transition-all duration-1000 ease-out"
                                    style={{ width: tokenomicsInView ? '4.5%' : '0%' }}
                                 ></div>
                              </div>
                           </div>

                           {/* Burn: 3.5% */}
                           <div className="space-y-1">
                              <div className="flex justify-between text-xs font-mono text-chuck-secondary">
                                 <span>BURN</span>
                                 <span>3.5%</span>
                              </div>
                              <div className="h-4 bg-chuck-dark border border-chuck-secondary/30 flex">
                                 <div 
                                    className="h-full bg-chuck-burn shadow-[0_0_10px_#ff4500] transition-all duration-1000 ease-out"
                                    style={{ width: tokenomicsInView ? '3.5%' : '0%' }}
                                 ></div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center p-4 border border-chuck-secondary/20 bg-black/40">
                            <div className="text-center w-full">
                               <div className="font-arcade text-2xl sm:text-3xl text-white mb-2 leading-tight break-words">1,000,000,000</div>
                               <div className="font-mono text-chuck-secondary text-[10px] tracking-widest uppercase mb-4">MAX SUPPLY</div>
                               
                               <div className="flex justify-between text-xs font-mono text-chuck-secondary border-t border-chuck-secondary/20 pt-2">
                                  <div className="text-left">
                                    <div className="text-white text-sm sm:text-base leading-tight">899,427,882</div>
                                    <div className="text-[9px]">CIRCULATING</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white text-sm sm:text-base leading-tight">964,999,999</div>
                                    <div className="text-[9px]">TOTAL</div>
                                  </div>
                               </div>
                            </div>
                        </div>
                     </div>

                     {/* Right: Data List */}
                     <div className="flex flex-col gap-6">
                        {/* Invisible Spacer Header to align Contract Address with Liquidity Pool bar */}
                        <div className="font-arcade text-lg mb-2 flex items-center gap-2 opacity-0 select-none h-7">
                           <PieChart /> SPACER
                        </div>
                        
                        <div className="space-y-6">
                           <StatRow label="CONTRACT ADDRESS" value={CONTRACT_ADDRESS} isCopyable action={() => copyToClipboard(CONTRACT_ADDRESS)} />
                           <StatRow label="NETWORK" value="BASE (L2)" />
                           <StatRow label="TAX (BUY/SELL)" value="0% / 0%" highlight />
                           <StatRow label="TICKER" value="$CHUCK" />
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        </section>

        {/* --- LEVEL 3: BONUS STAGE (BURN LOTTERY) --- */}
        <section id="bonus" className="bg-[#000000] py-16 md:py-24 px-4 relative overflow-hidden border-t-2 border-chuck-burn/50 scroll-mt-16">
           {/* No Scanlines here to prevent scrolling glitch */}
           <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex items-center justify-between mb-12 gap-4">
                 <div className="bg-chuck-burn text-white font-arcade px-3 py-1 text-sm shadow-neon-burn">BONUS STAGE</div>
                 <h2 className="font-arcade text-2xl md:text-4xl text-white text-right drop-shadow-[0_0_10px_rgba(255,69,0,0.5)]">BURN LOTTERY</h2>
              </div>

              <div className="flex flex-col md:flex-row items-stretch bg-chuck-primary/60 border border-chuck-burn/30 backdrop-blur-sm shadow-[0_0_30px_rgba(255,69,0,0.1)]">
                 
                 {/* Left Panel: Visuals */}
                 <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-chuck-burn/30 relative overflow-hidden group">
                    <div className="flex flex-col items-center z-10">
                      <div className="absolute inset-0 bg-chuck-burn/5 mix-blend-screen group-hover:bg-chuck-burn/10 transition-colors pointer-events-none"></div>
                      
                      <Flame size={120} className="text-chuck-burn mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(255,69,0,0.8)]" fill="currentColor" />
                      <h2 className="font-arcade text-4xl text-white text-center">THE INCINERATOR</h2>
                      
                      {/* Burn Tracker Inserted Here */}
                      <div className="mt-8 scale-110">
                        <BurnTracker className="border-chuck-burn shadow-none" />
                      </div>
                    </div>
                 </div>

                 {/* Right Panel: Action */}
                 <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative bg-chuck-primary/10">
                    <div>
                      {/* Removed Zap Icon */}

                      <h3 className="font-arcade text-chuck-burn text-xl mb-4">BURN LOTTERY EVENT</h3>
                      <div className="font-mono text-sm text-gray-300 mb-6 leading-relaxed">
                         Every transaction feeds the beast. Tokens are accumulated from taxes and then incinerated in random, high-voltage events to reduce supply and reward holders.
                      </div>

                      <div className="bg-chuck-burn/10 border border-chuck-burn/30 p-4 mb-8">
                         <div className="flex items-start gap-2 text-chuck-burn text-xs font-mono">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <span>NEXT BURN: UNKNOWN. SYSTEM GENERATED.</span>
                         </div>
                      </div>
                      
                      <a href="#" className="w-full bg-transparent text-white font-arcade py-4 border border-chuck-secondary hover:bg-chuck-secondary hover:text-chuck-primary transition-all flex justify-between px-6 items-center group">
                         <span>READ MANIFESTO</span>
                         <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* --- PARTNERS: HALL OF FAME --- */}
        <section id="partners" className="bg-black py-16 md:py-24 px-4 border-t border-chuck-secondary/20 relative overflow-hidden scroll-mt-16">
            <div className="max-w-4xl mx-auto relative z-10">
               <div className="text-center mb-12">
                   <h2 className="font-arcade text-3xl md:text-5xl text-white mb-2 animate-pulse">HALL OF FAME</h2>
                   <p className="font-mono text-xs text-chuck-secondary tracking-widest uppercase">Official Alliances & Supporters</p>
               </div>

               {/* CRT Screen Container */}
               <div className="bg-chuck-primary border-[6px] border-chuck-secondary/30 rounded-lg p-6 md:p-12 shadow-[0_0_50px_rgba(110,152,218,0.15)] relative overflow-hidden">
                   {/* Screen Glare */}
                   <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>
                   
                   {/* High Score Table - CATEGORIZED */}
                   <div className="font-arcade text-xs md:text-sm w-full">
                       
                       {/* CATEGORY: ALLIANCES */}
                       <div className="mb-8">
                         <div className="text-chuck-secondary mb-4 border-b border-chuck-secondary/30 pb-1">ALLIANCES & COMMUNITY</div>
                         <div className="space-y-3 font-mono">
                             <HighScoreRow rank="1ST" name="METACADE" score="9,999,999" stage="L2 ARCADE" isFirst link="https://www.metacade.co/" />
                             <HighScoreRow rank="2ND" name="PIGMO" score="8,850,200" stage="CASINO" link="https://pigmo.com" />
                             <HighScoreRow rank="3RD" name="SHOCKWAVES" score="7,740,100" stage="GAME" link="https://www.shockwaves.ai/" />
                             <HighScoreRow rank="4TH" name="METABREW SOCIETY" score="6,900,550" stage="COMMUNITY" link="https://www.metabrewsociety.com/" />
                         </div>
                       </div>

                       {/* CATEGORY: MARKETS */}
                       <div className="mb-8">
                         <div className="text-chuck-secondary mb-4 border-b border-chuck-secondary/30 pb-1">MARKETS & FIAT</div>
                         <div className="space-y-3 font-mono">
                             <HighScoreRow rank="5TH" name="UNISWAP" score="5,900,000" stage="DEX" link="https://app.uniswap.org/swap?chain=base&outputCurrency=0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A" />
                             <HighScoreRow rank="6TH" name="ASCENDEX" score="5,200,000" stage="CEX" link="https://ascendex.com/en/cashtrade-spottrading/usdt/chuck" />
                             <HighScoreRow rank="7TH" name="FLOOZ" score="4,800,000" stage="FIAT ONRAMP" link="https://flooz.xyz/CHUCK_on_Base" />
                         </div>
                       </div>

                       {/* CATEGORY: DATA */}
                       <div className="mb-8">
                         <div className="text-chuck-secondary mb-4 border-b border-chuck-secondary/30 pb-1">DATA & TRACKING</div>
                         <div className="space-y-3 font-mono">
                             <HighScoreRow rank="8TH" name="COINGECKO" score="6,500,000" stage="DATA" link="https://www.coingecko.com/" />
                             <HighScoreRow rank="9TH" name="COINMARKETCAP" score="6,450,000" stage="DATA" link="https://coinmarketcap.com/" />
                         </div>
                       </div>

                       {/* CATEGORY: TOOLS */}
                       <div className="mb-8">
                         <div className="text-chuck-secondary mb-4 border-b border-chuck-secondary/30 pb-1">TOOLS & WALLETS</div>
                         <div className="space-y-3 font-mono">
                             <HighScoreRow rank="10TH" name="ETHOS" score="4,100,000" stage="WALLET" link="https://www.ethos.io/" />
                             <HighScoreRow rank="11TH" name="BICONOMY" score="3,500,000" stage="INFRA" link="https://www.biconomy.io/" />
                             <HighScoreRow rank="12TH" name="COINBASE WALLET" score="3,000,000" stage="WALLET" link="https://wallet.coinbase.com/assets/crypto/ETH%2FCHUCK%2FETHEREUM_CHAIN%3A8453%2Ffalse%2F0x7a8a5012022bccbf3ea4b03cd2bb5583d915fb1a?assetUUID=7ab29046-e9d9-4916-b888-b56936532d27&assetName=Chuck" />
                         </div>
                       </div>
                   </div>
               </div>
            </div>
        </section>

        {/* --- LEVEL 4: UNLOCKABLES (MEMES) --- */}
        <section id="memes" className="py-16 md:py-24 px-4 relative bg-chuck-primary border-t border-chuck-secondary/20 scroll-mt-16">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#6E98DA_1px,transparent_1px),linear-gradient(to_bottom,#6E98DA_1px,transparent_1px)] bg-[size:50px_50px] opacity-5"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex items-center justify-between mb-16">
                 <div className="flex items-center gap-4">
                    <div className="bg-chuck-secondary text-chuck-primary font-arcade px-3 py-1 text-sm">LEVEL 04</div>
                    <h2 className="font-arcade text-2xl md:text-4xl text-white">UNLOCKABLES</h2>
                 </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20can%20see%20you.jpg" title="I SEE YOU" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20chainsaw.jpg" title="CHAINSAW MAN" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20chasing%20bear.jpg" title="BEAR HUNT" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20cologne.jpg" title="EAU DE CHUCK" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20dead%20coffin.jpg" title="RIP JEETS" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20eating%20cake.jpg" title="LET THEM EAT CAKE" />
                 <MemeCard src="https://emoprince.github.io/Chuck95/Chuck%20email%20run.jpg" title="WORK HARD" />
                 
                 {/* 8th Slot - LOCKED */}
                 <div className="aspect-square bg-chuck-dark/50 border border-chuck-secondary/20 border-dashed flex flex-col items-center justify-center p-4 group hover:bg-chuck-dark/80 transition-colors cursor-not-allowed h-full">
                    <Lock className="text-chuck-secondary/40 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-arcade text-[10px] text-chuck-secondary/60 text-center">LOCKED CONTENT</span>
                 </div>
              </div>
            </div>
        </section>

        {/* --- MERCHANT (SHOP) --- */}
        <section id="merchant" className="bg-chuck-primary py-16 md:py-24 px-4 border-t border-chuck-secondary/20 scroll-mt-16">
           <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12 border-b border-chuck-secondary/30 pb-4">
                 <div>
                    <h2 className="font-arcade text-3xl text-white mb-2">MERCHANT</h2>
                    <p className="font-mono text-xs text-chuck-secondary">EXCHANGE FIAT FOR RARE EQUIPMENT</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {/* Updated Shop Items with specific links */}
                 <ShopItem 
                    name="CHUCK HEADBAND" 
                    price="$25.00" 
                    image="http://emoprince.github.io/Chuck95/all-over-print-headband-white-front-667f7dad15453(1).jpg" 
                    desc="+10 FOCUS" 
                    link="https://shop.chuckonbase.io/products/chuck-headband"
                 />
                 <ShopItem 
                    name="CHUCK CAP" 
                    price="$30.00" 
                    image="http://emoprince.github.io/Chuck95/classic-dad-hat-black-front-66fbcff2a1390.jpg" 
                    desc="+5 STYLE" 
                    link="https://shop.chuckonbase.io/products/chuck-cap"
                 />
                 <ShopItem 
                    name="CHUCKINI BLACK" 
                    price="$45.00" 
                    image="http://emoprince.github.io/Chuck95/all-over-print-recycled-string-bikini-white-back-66d10495f33dd.jpg" 
                    desc="+100 CHARISMA" 
                    link="https://shop.chuckonbase.io/products/chuckini-black"
                 />
                 <ShopItem 
                    name="CHUCK BRIEFS" 
                    price="$25.00" 
                    image="http://emoprince.github.io/Chuck95/all-over-print-boxer-briefs-white-back-66c2d33a19755.jpg" 
                    desc="MAX COMFORT" 
                    link="https://shop.chuckonbase.io/products/chuck-briefs"
                 />
              </div>

              <div className="mt-12 text-center">
                <a 
                   href="https://shop.chuckonbase.io/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-3 bg-chuck-secondary text-chuck-primary font-arcade px-12 py-4 text-xl hover:bg-white transition-all shadow-neon group"
                >
                   <Lock size={24} className="group-hover:hidden" /> 
                   <Unlock size={24} className="hidden group-hover:block" />
                   UNLOCK SHOP
                </a>
              </div>
           </div>
        </section>

        {/* --- DISCREET SOCIAL STRIP --- */}
        <section className="bg-chuck-dark border-t border-chuck-secondary/30 py-2 overflow-hidden">
           <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-4 text-xs font-mono text-chuck-secondary w-full">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-blink"></div>
                 <span className="font-arcade whitespace-nowrap">COMMS UPLINK:</span>
                 <div className="flex-1 overflow-hidden relative h-4">
                    <div className="animate-marquee whitespace-nowrap absolute top-0 left-0">
                       JOIN THE PACK // FREQUENCY 8453 // TRANSMISSION ACTIVE // JOIN THE PACK // FREQUENCY 8453 // TRANSMISSION ACTIVE // JOIN THE PACK // FREQUENCY 8453 // TRANSMISSION ACTIVE // JOIN THE PACK // FREQUENCY 8453 // TRANSMISSION ACTIVE
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 border-l border-chuck-secondary/20 pl-4">
                  <a href="https://x.com/CHUCK_on_Base" target="_blank" rel="noopener noreferrer" className="text-chuck-secondary hover:text-white transition-colors" title="Twitter / X"><Twitter size={14} /></a>
                  <a href="https://t.me/Chuck_on_Base" target="_blank" rel="noopener noreferrer" className="text-chuck-secondary hover:text-white transition-colors" title="Telegram"><Send size={14} /></a>
              </div>
           </div>
        </section>

        {/* --- FOOTER (EXPANDED) --- */}
        <footer className="bg-black border-t-2 border-chuck-secondary/50 pt-20 pb-8 px-4">
           <div className="max-w-7xl mx-auto text-center">
               
               {/* PLAY AGAIN Section */}
               <div className="mb-20">
                  <h2 className="font-arcade text-4xl md:text-6xl text-white transition-colors cursor-default drop-shadow-neon">PLAY AGAIN</h2>
                  <div className="font-mono text-chuck-secondary text-xs mt-4 animate-pulse">THANK YOU FOR PLAYING!</div>
                  
                  <button 
                     onClick={scrollToTop}
                     className="mt-8 bg-chuck-secondary text-chuck-primary font-arcade px-8 py-3 hover:bg-white transition-all shadow-neon flex items-center gap-2 mx-auto"
                  >
                     <ArrowUpCircle size={20} />
                     RESTART GAME
                  </button>
               </div>

               {/* COMPREHENSIVE LINKS GRID */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-12 mb-12 font-mono text-xs">
                  {/* SITEMAP */}
                  <div className="flex flex-col gap-4 items-center">
                     <h4 className="font-arcade text-white text-sm mb-2 text-chuck-secondary">SITEMAP</h4>
                     <a href="#quest" onClick={(e) => handleNavClick(e, '#quest')} className="hover:text-chuck-secondary transition-colors">MAIN QUEST</a>
                     <a href="#stats" onClick={(e) => handleNavClick(e, '#stats')} className="hover:text-chuck-secondary transition-colors">GAME STATS</a>
                     <a href="#partners" onClick={(e) => handleNavClick(e, '#partners')} className="hover:text-chuck-secondary transition-colors">HALL OF FAME</a>
                     <a href="#memes" onClick={(e) => handleNavClick(e, '#memes')} className="hover:text-chuck-secondary transition-colors">GALLERY</a>
                  </div>

                   {/* SHOP & TOOLS */}
                   <div className="flex flex-col gap-4 items-center">
                     <h4 className="font-arcade text-white text-sm mb-2 text-chuck-secondary">RESOURCES</h4>
                     <a href="#merchant" onClick={(e) => handleNavClick(e, '#merchant')} className="hover:text-chuck-secondary transition-colors">MERCHANT SHOP</a>
                     <a href="https://app.uniswap.org/swap?chain=base&outputCurrency=0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A" target="_blank" rel="noreferrer" className="hover:text-chuck-secondary transition-colors">BUY $CHUCK</a>
                     <a href="https://basescan.org/token/0x7A8A5012022BCCBf3EA4b03cD2bb5583d915fb1A" target="_blank" rel="noreferrer" className="hover:text-chuck-secondary transition-colors">CONTRACT</a>
                  </div>

                   {/* CONTACT */}
                   <div className="flex flex-col gap-4 items-center">
                     <h4 className="font-arcade text-white text-sm mb-2 text-chuck-secondary">CONNECT</h4>
                     <a href="mailto:info@chuckonbase.io" className="hover:text-chuck-secondary transition-colors flex items-center gap-2"><Mail size={12}/> INFO@CHUCKONBASE.IO</a>
                     <a href="https://x.com/CHUCK_on_Base" target="_blank" rel="noopener noreferrer" className="hover:text-chuck-secondary transition-colors flex items-center gap-2"><Twitter size={12}/> TWITTER / X</a>
                     <a href="https://t.me/Chuck_on_Base" target="_blank" rel="noopener noreferrer" className="hover:text-chuck-secondary transition-colors flex items-center gap-2"><Send size={12}/> TELEGRAM</a>
                  </div>

                  {/* LEGAL */}
                   <div className="flex flex-col gap-4 items-center">
                     <h4 className="font-arcade text-white text-sm mb-2 text-chuck-secondary">DOCS</h4>
                     <button onClick={() => setIsWhitepaperOpen(true)} className="hover:text-chuck-secondary transition-colors flex items-center gap-2"><FileText size={12}/> WHITEPAPER</button>
                     <button onClick={() => setIsDisclaimerOpen(true)} className="hover:text-chuck-secondary transition-colors flex items-center gap-2"><AlertTriangle size={12}/> DISCLAIMER</button>
                  </div>
               </div>

               {/* BOTTOM COPYRIGHT */}
               <div className="font-mono text-[10px] text-white/30 max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-8">
                  $CHUCK is a community-driven project on Base. No financial advice provided. 
                  Do not spend money you cannot afford to lose.
                  <br/><br/>
                  © 2024 Chuck On Base. ALL RIGHTS RESERVED.
               </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

// UI COMPONENTS

const Attribute = ({ label, value }: { label: string, value: number }) => {
   const [ref, inView] = useInView(0.1);
   
   return (
      <div className="flex items-center justify-between" ref={ref}>
         <span className="text-chuck-secondary/80">{label}</span>
         <div className="w-24 h-2 bg-chuck-primary border border-chuck-secondary/30 overflow-hidden">
            <div 
              className="h-full bg-chuck-secondary shadow-[0_0_10px_#6E98DA] transition-all duration-1000 ease-out" 
              style={{ width: inView ? `${value}%` : '0%' }}
            ></div>
         </div>
      </div>
   );
};

const RosterCard = ({ unlocked, name, icon, desc }: { unlocked?: boolean, name: string, icon: any, desc: string }) => (
   <div className={`aspect-square border ${unlocked ? 'border-yellow-400 bg-yellow-900/20' : 'border-chuck-secondary/30 bg-chuck-dark/50'} relative p-4 flex flex-col items-center justify-center text-center group transition-all hover:scale-[1.02] h-full`}>
      {!unlocked && <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-[1px] opacity-100 transition-all"></div>}
      {unlocked && <div className="absolute top-2 right-2 text-yellow-500"><Unlock size={12} /></div>}
      <div className={`mb-2 ${unlocked ? 'text-yellow-500' : 'text-chuck-secondary opacity-50'}`}>{icon}</div>
      <div className={`font-arcade text-xs z-20 relative ${unlocked ? 'text-yellow-100' : 'text-chuck-secondary'}`}>{name}</div>
      <div className={`font-mono text-[8px] mt-1 z-20 transition-opacity ${unlocked ? 'text-yellow-500/80' : 'text-chuck-secondary/60'}`}>{desc}</div>
   </div>
);

const StatRow = ({ label, value, highlight, isCopyable, action }: any) => (
   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-chuck-secondary/10 pb-2">
      <span className="font-mono text-chuck-secondary text-xs">{label}</span>
      <div className="flex items-center gap-2">
         <span className={`font-mono font-bold ${highlight ? 'text-chuck-burn' : 'text-white'} ${isCopyable ? 'text-[10px] sm:text-sm break-all' : ''}`}>
            {value}
         </span>
         {isCopyable && (
            <button onClick={action} className="text-chuck-secondary hover:text-white transition-colors">
               <Copy size={14} />
            </button>
         )}
      </div>
   </div>
);

const MemeCard = ({ src, title }: { src: string, title: string }) => (
   <div className="aspect-square bg-chuck-dark border border-chuck-secondary/30 relative group overflow-hidden shadow-none hover:shadow-neon hover:border-chuck-secondary transition-all h-full">
      {/* Updated Meme Visual: Blur -> Focus */}
      <img src={src} alt={title} className="w-full h-full object-cover blur-[2px] opacity-80 group-hover:blur-0 group-hover:opacity-100 transition-all duration-300" />
      <div className="absolute inset-0 bg-gradient-to-t from-chuck-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
         <div className="flex justify-between items-end">
            <div className="font-arcade text-white text-sm drop-shadow-md">{title}</div>
            <a href={src} target="_blank" rel="noopener noreferrer" className="p-2 bg-chuck-secondary text-chuck-primary hover:bg-white transition-colors" title="Download">
               <Download size={16} />
            </a>
         </div>
      </div>
   </div>
);

const ShopItem = ({ name, price, image, desc, link }: any) => (
   <a href={link} target="_blank" rel="noopener noreferrer" className="border border-chuck-secondary/30 bg-chuck-dark p-2 hover:border-chuck-secondary transition-all cursor-pointer group h-[300px] flex flex-col block">
      <div className="bg-black/40 flex-1 mb-4 p-8 relative overflow-hidden flex items-center justify-center">
         <div className="absolute top-2 right-2 bg-chuck-secondary/20 text-chuck-secondary border border-chuck-secondary/50 font-mono text-[10px] px-2 py-1">RARE</div>
         <img src={image} alt={name} className="w-32 h-32 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      </div>
      <div className="px-2 pb-2">
         <div className="font-arcade text-sm text-white truncate">{name}</div>
         <div className="font-mono text-[10px] text-chuck-secondary mb-2">{desc}</div>
         <div className="flex justify-between items-center border-t border-chuck-secondary/10 pt-2">
            <span className="font-bold text-white font-mono">{price}</span>
            <div className="w-2 h-2 bg-chuck-burn rounded-full shadow-[0_0_5px_#FF4500]"></div>
         </div>
      </div>
   </a>
);

type HighScoreRowProps = {
   rank: string;
   name: string;
   score: string;
   stage: string;
   isFirst?: boolean;
   link?: string;
};

const HighScoreRow = ({ rank, name, score, stage, isFirst, link }: HighScoreRowProps) => {
   const baseClasses = `grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 items-center p-2 transition-all hover:bg-chuck-secondary/10 cursor-pointer group text-[11px] sm:text-xs leading-tight ${isFirst ? 'text-white' : 'text-chuck-secondary'}`;

   const content = (
      <>
         <div className="col-span-2 text-center font-bold">
             {isFirst ? <span className="animate-pulse text-yellow-400">{rank}</span> : rank}
         </div>
         <div className="col-span-4 flex items-center gap-2 min-w-0">
             {isFirst && <Crown size={12} className="text-yellow-400" />}
             <span className={`group-hover:translate-x-1 transition-transform break-words ${isFirst ? 'font-bold tracking-widest' : ''}`}>{name}</span>
         </div>
         <div className="col-span-3 text-right font-arcade text-[10px] sm:text-[11px] opacity-80">{score}</div>
         <div className="col-span-3 text-right text-[10px] sm:text-[11px] opacity-60 group-hover:opacity-100">{stage}</div>
      </>
   );

   if (link) {
      return (
         <a href={link} target="_blank" rel="noopener noreferrer" className={baseClasses}>
            {content}
         </a>
      );
   }

   return (
      <div className={baseClasses}>
         {content}
      </div>
   );
};

const FooterLink = ({ label }: { label: string }) => (
   <a href="#" className="font-arcade text-xs text-chuck-secondary border-b border-transparent hover:border-chuck-secondary hover:text-white transition-all">
      {label}
   </a>
);

export default App;
