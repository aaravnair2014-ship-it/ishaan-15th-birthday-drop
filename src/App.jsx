import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Gift, Zap, Crown, Sprout, Share } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';

function CustomCursor() {
  const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring spring (smooth lag, zero wiggle)
  const outerX = useSpring(mouseX, { stiffness: 400, damping: 45 });
  const outerY = useSpring(mouseY, { stiffness: 400, damping: 45 });

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target && e.target.closest && (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-cursor-hover]'))) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target && e.target.closest && (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-cursor-hover]'))) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block">
      {/* Outer Ring */}
      <motion.div style={{ x: outerX, y: outerY, willChange: 'transform' }} className="absolute top-0 left-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={false}
          animate={{
            width: isHovering ? 64 : 36,
            height: isHovering ? 64 : 36,
            border: isHovering ? '1px solid rgba(214,255,87,1)' : '1px solid rgba(10,10,10,0.15)',
            backgroundColor: isHovering ? 'rgba(214,255,87,0.08)' : 'rgba(0,0,0,0)',
            backdropFilter: isHovering ? 'blur(12px)' : 'blur(0px)',
            WebkitBackdropFilter: isHovering ? 'blur(12px)' : 'blur(0px)',
          }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Inner Dot - raw values, no spring, zero wiggle */}
      <motion.div style={{ x: mouseX, y: mouseY, willChange: 'transform' }} className="absolute top-0 left-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={false}
          animate={{
            width: isHovering ? 4 : 8,
            height: isHovering ? 4 : 8,
            backgroundColor: isHovering ? '#D6FF57' : '#0A0A0A',
            border: isHovering ? '0px solid #D6FF57' : '2px solid #D6FF57',
            boxShadow: '0 0 10px rgba(214,255,87,0.8)'
          }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}

function Navbar() {
  const { scrollY } = useScroll();
  
  const py = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.7]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full px-6 sm:px-12 lg:px-24 flex items-center justify-between z-50 transition-colors"
      style={{
        paddingTop: py,
        paddingBottom: py,
        backgroundColor: useTransform(bgOpacity, v => `rgba(250, 249, 246, ${v})`),
        backdropFilter: useTransform(blur, v => `blur(${v}px)`),
        WebkitBackdropFilter: useTransform(blur, v => `blur(${v}px)`),
        borderBottom: useTransform(borderOpacity, v => `1px solid rgba(0, 0, 0, ${v})`)
      }}
    >
      <div className="text-xl sm:text-2xl font-black tracking-tighter text-charcoal">
        FOR ISHAAN
      </div>
      <div className="font-bold tracking-tight text-[10px] sm:text-xs lg:text-sm uppercase text-charcoal bg-charcoal/5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-charcoal/10 shadow-sm backdrop-blur-md">
        Gift by Aarav • 15
      </div>
    </motion.nav>
  );
}

function PandaFace() {
  const containerRef = useRef(null);
  
  const targetEyeWhiteX = useMotionValue(0);
  const targetEyeWhiteY = useMotionValue(0);
  const targetPupilX = useMotionValue(0);
  const targetPupilY = useMotionValue(0);
  const idleX = useMotionValue(0);

  const combinedPupilX = useTransform(() => targetPupilX.get() + idleX.get());

  const springConfig = { type: "spring", stiffness: 150, damping: 15 };
  
  const eyeWhiteX = useSpring(targetEyeWhiteX, springConfig);
  const eyeWhiteY = useSpring(targetEyeWhiteY, springConfig);
  const pupilX = useSpring(combinedPupilX, springConfig);
  const pupilY = useSpring(targetPupilY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const headCenterX = left + width / 2;
      const headCenterY = top + height / 2;
      
      const deltaX = e.clientX - headCenterX;
      const deltaY = e.clientY - headCenterY;
      
      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(18, Math.hypot(deltaX, deltaY) / 25);
      const normDist = dist / 18;
      
      targetEyeWhiteX.set(Math.cos(angle) * 2.5 * normDist);
      targetEyeWhiteY.set(Math.sin(angle) * 1.5 * normDist);
      targetPupilX.set(Math.cos(angle) * 5 * normDist);
      targetPupilY.set(Math.sin(angle) * 3 * normDist);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [targetEyeWhiteX, targetEyeWhiteY, targetPupilX, targetPupilY]);

  useEffect(() => {
    const interval = setInterval(() => {
      idleX.set((Math.random() - 0.5) * 1.5);
    }, 2000);
    return () => clearInterval(interval);
  }, [idleX]);

  return (
    <div ref={containerRef} className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[28rem] lg:h-[28rem] flex items-center justify-center shrink-0">
      {/* Ears */}
      <div className="absolute top-3 sm:top-4 lg:top-4 left-5 sm:left-8 lg:left-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-charcoal rounded-full" />
      <div className="absolute top-3 sm:top-4 lg:top-4 right-5 sm:right-8 lg:right-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-charcoal rounded-full" />
      
      {/* Face */}
      <div className="relative w-56 h-48 sm:w-72 sm:h-60 lg:w-80 lg:h-72 bg-white rounded-[100px] shadow-2xl border-[3px] sm:border-4 border-bamboo-mist flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Eye patches */}
        <div className="flex gap-8 sm:gap-10 lg:gap-12 mt-4 sm:mt-6">
          <div className="w-16 h-20 sm:w-18 sm:h-22 lg:w-20 lg:h-24 bg-charcoal rounded-[2.5rem] sm:rounded-[3rem] rotate-[15deg] flex items-center justify-center relative overflow-hidden">
             {/* Eyeball White */}
             <motion.div 
               style={{ x: eyeWhiteX, y: eyeWhiteY }}
               animate={{ scaleY: [1, 1, 0.1, 1] }}
               transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.97, 1] }}
               className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center relative overflow-hidden"
             >
               {/* Pupil Black */}
               <motion.div 
                 style={{ x: pupilX, y: pupilY }}
                 whileHover={{ scale: 1.2 }}
                 className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-charcoal rounded-full" 
               />
             </motion.div>
          </div>
          <div className="w-16 h-20 sm:w-18 sm:h-22 lg:w-20 lg:h-24 bg-charcoal rounded-[2.5rem] sm:rounded-[3rem] -rotate-[15deg] flex items-center justify-center relative overflow-hidden">
             {/* Eyeball White */}
             <motion.div 
               style={{ x: eyeWhiteX, y: eyeWhiteY }}
               animate={{ scaleY: [1, 1, 0.1, 1] }}
               transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.97, 1] }}
               className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white rounded-full flex items-center justify-center relative overflow-hidden"
             >
               {/* Pupil Black */}
               <motion.div 
                 style={{ x: pupilX, y: pupilY }}
                 whileHover={{ scale: 1.2 }}
                 className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 bg-charcoal rounded-full" 
               />
             </motion.div>
          </div>
        </div>

        {/* Nose */}
        <div className="w-8 h-5 sm:w-9 sm:h-5 lg:w-10 lg:h-6 bg-charcoal rounded-full mt-4 sm:mt-5 lg:mt-6" />
        
        {/* Mouth */}
        <div className="w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 border-b-[3px] lg:border-b-4 border-charcoal rounded-b-full mt-1 sm:mt-2" />
      </div>
    </div>
  );
}

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#D6FF57', '#0A0A0A', '#FAF9F6'],
      zIndex: 10000
    });
    setIsOpen(true);
  };

  return (
    <section className="min-h-[100svh] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 sm:px-12 lg:px-24 pt-32 sm:pt-40 lg:pt-32 pb-16 lg:pb-12 gap-12 sm:gap-16 lg:gap-16 overflow-hidden">
      <motion.div 
        className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full max-w-3xl lg:max-w-none"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-block bg-charcoal text-lime-punch text-xs sm:text-sm font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-6 sm:mb-8">
          A BIRTHDAY DROP FOR
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-[16vw] sm:text-[12vw] lg:text-[8rem] leading-[0.85] font-black tracking-tighter text-charcoal mb-6 sm:mb-8">
          ISHAAN <br className="hidden sm:block lg:hidden" /> <span className="text-gray-300">//</span> FIFTEEN
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-lg mb-8 sm:mb-10 font-medium leading-relaxed tracking-tight">
          From Aarav. Panda-powered since day one. This is your corner of the internet.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row flex-wrap gap-4 min-h-[4rem] items-center justify-center lg:justify-start">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.button 
                key="btn"
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenGift}
                className="bg-lime-punch text-charcoal px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-lg sm:text-xl flex items-center gap-2 hover:bg-[#cbf740] transition-colors shadow-lg shadow-lime-punch/20"
              >
                Open Your Gift <Gift className="w-5 h-5 ml-1" />
              </motion.button>
            ) : (
              <motion.div 
                key="msg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-charcoal text-white px-6 py-4 sm:px-8 sm:py-5 rounded-[2rem] border border-white/10 font-bold text-base sm:text-lg lg:text-xl shadow-2xl tracking-tight"
              >
                Happy 15th Ishaan - Stay Bamboo 🐼 - Aarav
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex justify-center lg:justify-end w-full"
      >
        <PandaFace />
      </motion.div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="py-6 sm:py-8 bg-charcoal text-lime-punch overflow-hidden flex whitespace-nowrap w-full border-y-2 sm:border-y-[3px] border-lime-punch/20 relative items-center">
      <motion.div
        className="flex whitespace-nowrap text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter uppercase"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
        style={{ width: "fit-content" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-4 sm:mx-6 lg:mx-10">FOR ISHAAN</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
            <span className="mx-4 sm:mx-6 lg:mx-10">15</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
            <span className="mx-4 sm:mx-6 lg:mx-10">RARE</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
            <span className="mx-4 sm:mx-6 lg:mx-10">REAL</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
            <span className="mx-4 sm:mx-6 lg:mx-10">CHILL</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
            <span className="mx-4 sm:mx-6 lg:mx-10">BAMBOO POWERED</span>
            <span className="mx-4 sm:mx-6 lg:mx-10 text-lime-punch/50">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

function Features() {
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      title: "CHILL ENERGY",
      desc: "Stays calm under pressure. Unbothered, focused, moving at his own pace.",
      icon: <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-lime-punch" />
    },
    {
      title: "RARE & REAL",
      desc: "A 1% mindset. No fake flexes, just genuine vibes and authentic moves.",
      icon: <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-lime-punch" />
    },
    {
      title: "LEGEND IN THE MAKING",
      desc: "15 years of leveling up. The best chapters haven't even been written yet.",
      icon: <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-lime-punch" />
    }
  ];

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-24 bg-bamboo-mist relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 sm:mb-20 lg:mb-24 flex justify-center"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter text-charcoal text-center leading-none">
          WHY ISHAAN <br className="sm:hidden lg:hidden"/> = PANDA
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto relative">
        {cards.map((card, i) => {
          const isActive = activeCard === i;
          const isBlurred = activeCard !== null && activeCard !== i;

          return (
            <motion.div
              key={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
              animate={{
                scale: isActive ? 1.03 : isBlurred ? 0.97 : 1,
                filter: isBlurred ? 'blur(6px)' : 'blur(0px)',
                opacity: isBlurred ? 0.6 : 1,
                y: isActive ? -8 : 0,
              }}
              transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
              className="relative p-8 sm:p-10 lg:p-12 rounded-[24px] sm:rounded-[28px] flex flex-col items-start cursor-default"
              style={{
                background: isActive ? 'rgba(250,249,246,0.85)' : 'rgba(255,255,255,0.7)',
                backdropFilter: isActive ? 'blur(20px) saturate(180%)' : 'blur(12px)',
                WebkitBackdropFilter: isActive ? 'blur(20px) saturate(180%)' : 'blur(12px)',
                border: isActive ? '1px solid rgba(214,255,87,0.5)' : '1px solid rgba(10,10,10,0.06)',
                boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.08)' : '0 8px 30px rgba(0,0,0,0.04)',
              }}
            >
              {/* Radial lime glow behind active card */}
              {isActive && (
                <div className="absolute -inset-12 -z-10 rounded-full bg-[#D6FF57] opacity-15 blur-[60px] pointer-events-none" />
              )}

              <motion.div
                animate={{
                  rotate: isActive ? 8 : -3,
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive ? '0 0 20px rgba(214,255,87,0.5)' : '0 0 0px rgba(214,255,87,0)',
                }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-charcoal rounded-2xl flex items-center justify-center mb-8 sm:mb-10"
              >
                {card.icon}
              </motion.div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-charcoal mb-3 sm:mb-4 uppercase leading-none">{card.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed text-base sm:text-lg">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Lab() {
  const [bambooCount, setBambooCount] = useState(() => {
    const saved = localStorage.getItem('ishaanBambooCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const COOLDOWN_MS = 800;
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const messages = [
    "Bamboo +1 from Aarav 🎋",
    "Panda is full of love 🐼",
    "Ishaan's panda is vibing",
    "Fed with friendship"
  ];
  
  const handleFeed = () => {
    if (isCooldown) return;
    
    setIsCooldown(true);
    setTimeLeft(COOLDOWN_MS);

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= COOLDOWN_MS) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsCooldown(false);
      } else {
        setTimeLeft(COOLDOWN_MS - elapsed);
      }
    }, 16);

    setBambooCount(prev => {
      const next = prev + 1;
      localStorage.setItem('ishaanBambooCount', next.toString());
      
      toast(messages[next % messages.length], {
        duration: 2000,
        style: {
          background: 'rgba(10,10,10,0.75)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(214,255,87,0.3)',
          color: '#FAF9F6',
          borderRadius: '16px',
          fontWeight: '600',
          fontSize: '13px',
          letterSpacing: '-0.02em'
        }
      });
      
      return next;
    });
  };

  return (
    <section className="py-24 sm:py-32 lg:py-48 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full bg-charcoal rounded-[32px] sm:rounded-[40px] p-8 sm:p-16 lg:p-24 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-lime-punch"></div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter text-white mb-4 sm:mb-6 leading-none">
          BAMBOO LAB
        </h2>
        <p className="text-gray-400 text-base sm:text-lg lg:text-xl mb-10 sm:mb-12 font-medium tracking-tight">Keep the panda energized for year 15.</p>
        
        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <div className="text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 sm:mb-4">Bamboo Fed</div>
          <motion.div 
            key={bambooCount}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[5rem] sm:text-[7rem] lg:text-[8rem] leading-none font-black text-lime-punch tabular-nums"
          >
            {bambooCount}
          </motion.div>
        </div>

        <motion.button
          disabled={isCooldown}
          whileHover={!isCooldown ? { scale: 1.04 } : {}}
          whileTap={!isCooldown ? { scale: 0.96 } : {}}
          animate={{ scale: isCooldown ? 0.95 : 1, opacity: isCooldown ? 0.7 : 1 }}
          onClick={handleFeed}
          className="bg-lime-punch text-charcoal px-8 py-5 sm:px-10 sm:py-6 rounded-full font-black text-lg sm:text-xl lg:text-2xl flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto mx-auto shadow-[0_0_40px_rgba(214,255,87,0.2)] hover:shadow-[0_0_60px_rgba(214,255,87,0.4)] transition-shadow relative z-10 min-w-[280px]"
        >
          {isCooldown ? (
            <span className="tabular-nums">{(timeLeft / 1000).toFixed(1)}s</span>
          ) : (
            <>
              Aarav fed the Panda <Sprout className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            </>
          )}

          {isCooldown && (
            <svg width="24" height="24" className="absolute bottom-1/2 translate-y-1/2 right-4 -rotate-90 bg-black/20 rounded-full">
              <motion.circle 
                cx="12" cy="12" r="10" 
                stroke="#D6FF57" 
                strokeWidth="2.5" 
                fill="none" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            </svg>
          )}
        </motion.button>
      </motion.div>
    </section>
  );
}

function Footer() {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Gift link copied!", {
      icon: '🔗',
      style: {
        background: '#FAF9F6',
        color: '#0A0A0A',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '15px'
      }
    });
  };

  return (
    <footer className="bg-charcoal text-white py-12 sm:py-16 px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between border-t border-white/10 rounded-t-[32px] sm:rounded-t-[40px] lg:rounded-t-[60px] mx-2 sm:mx-4 lg:mx-6 mb-2 sm:mb-4 lg:mb-6 gap-8 lg:gap-0">
      <div className="flex flex-col items-center lg:items-start gap-1">
        <div className="font-bold tracking-tight text-gray-400 text-center lg:text-left text-sm sm:text-base">
          Built by Aarav for Ishaan's 15th
        </div>
        <div className="font-bold tracking-tight text-gray-500 text-xs sm:text-sm">
          © 2026
        </div>
      </div>
      
      <div className="text-lime-punch font-black tracking-tighter text-4xl sm:text-5xl order-first lg:order-none text-center">
        STAY BAMBOO
      </div>
      
      <motion.button 
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/10 hover:bg-white/20 transition-colors text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2"
      >
        Share this gift <Share className="w-4 h-4" />
      </motion.button>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-off-white text-charcoal font-sans selection:bg-lime-punch selection:text-charcoal relative">
      <div 
        className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      <CustomCursor />
      <Toaster position="bottom-right" />
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Lab />
      <Footer />
    </div>
  );
}
