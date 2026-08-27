import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Gift, Zap, Crown, Sprout, Share } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';

// ─── SCROLL PROGRESS BAR ───
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-lime-punch z-[9998] origin-left"
      style={{ scaleX: scrollYProgress, willChange: 'transform' }}
    />
  );
}

// ─── CUSTOM CURSOR ───
function CustomCursor() {
  const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

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

// ─── NAVBAR (glass blur 24px) ───
function Navbar() {
  const { scrollY } = useScroll();
  
  const py = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.7]);
  const blur = useTransform(scrollY, [0, 100], [0, 24]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.06]);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full px-6 sm:px-12 lg:px-24 flex items-center justify-between z-50"
      style={{
        paddingTop: py,
        paddingBottom: py,
        backgroundColor: useTransform(bgOpacity, v => `rgba(250, 249, 246, ${v})`),
        backdropFilter: useTransform(blur, v => `blur(${v}px) saturate(180%)`),
        WebkitBackdropFilter: useTransform(blur, v => `blur(${v}px) saturate(180%)`),
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

// ─── PANDA FACE (OG lively full-eyeball movement) ───
function PandaFace() {
  const containerRef = useRef(null);

  const targetWhiteX = useMotionValue(0);
  const targetWhiteY = useMotionValue(0);
  const targetPupilX = useMotionValue(0);
  const targetPupilY = useMotionValue(0);
  const [isNear, setIsNear] = useState(false);

  const springCfg = { stiffness: 200, damping: 18 };
  const whiteX = useSpring(targetWhiteX, springCfg);
  const whiteY = useSpring(targetWhiteY, springCfg);
  const pupilX = useSpring(targetPupilX, springCfg);
  const pupilY = useSpring(targetPupilY, springCfg);

  useEffect(() => {
    let idleRaf;
    let lastMoveTime = 0;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      lastMoveTime = Date.now();
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const headCenterX = left + width / 2;
      const headCenterY = top + height / 2;

      const rawDX = e.clientX - headCenterX;
      const rawDY = e.clientY - headCenterY;
      const dist = Math.hypot(rawDX, rawDY);

      setIsNear(dist < 200);

      const eyeRange = 8;
      const dx = Math.max(-eyeRange, Math.min(eyeRange, (rawDX / window.innerWidth) * eyeRange * 3));
      const dy = Math.max(-eyeRange, Math.min(eyeRange, (rawDY / window.innerHeight) * eyeRange * 3));

      targetWhiteX.set(dx * 1.5);
      targetWhiteY.set(dy);
      targetPupilX.set(dx * 2.5);
      targetPupilY.set(dy * 2);
    };

    const runIdle = () => {
      const now = Date.now();
      if (now - lastMoveTime > 1500) {
        const idleVal = Math.sin(now / 1000) * 1;
        targetWhiteX.set(idleVal * 0.6);
        targetPupilX.set(idleVal);
      }
      idleRaf = requestAnimationFrame(runIdle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    idleRaf = requestAnimationFrame(runIdle);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(idleRaf);
    };
  }, [targetWhiteX, targetWhiteY, targetPupilX, targetPupilY]);

  const EyePatch = ({ rotate }) => (
    <div className={`w-16 h-20 sm:w-18 sm:h-22 lg:w-20 lg:h-24 bg-charcoal rounded-[2.5rem] sm:rounded-[3rem] ${rotate} flex items-center justify-center relative overflow-hidden`}>
      <motion.div
        style={{ x: whiteX, y: whiteY, willChange: 'transform' }}
        animate={{
          scaleY: [1, 1, 0.1, 1],
          scale: isNear ? 1.1 : 1,
        }}
        transition={{
          scaleY: { duration: 3.5, repeat: Infinity, times: [0, 0.95, 0.97, 1] },
          scale: { type: "spring", stiffness: 300, damping: 20 },
        }}
        className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-white rounded-full flex items-center justify-center relative overflow-hidden"
      >
        <motion.div
          style={{ x: pupilX, y: pupilY }}
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] bg-charcoal rounded-full"
        />
      </motion.div>
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[28rem] lg:h-[28rem] flex items-center justify-center shrink-0"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute top-3 sm:top-4 lg:top-4 left-5 sm:left-8 lg:left-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-charcoal rounded-full" />
      <div className="absolute top-3 sm:top-4 lg:top-4 right-5 sm:right-8 lg:right-12 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-charcoal rounded-full" />
      
      <div className="relative w-56 h-48 sm:w-72 sm:h-60 lg:w-80 lg:h-72 bg-white rounded-[100px] shadow-2xl border-[3px] sm:border-4 border-bamboo-mist flex flex-col items-center justify-center overflow-hidden z-10">
        <div className="flex gap-8 sm:gap-10 lg:gap-12 mt-4 sm:mt-6">
          <EyePatch rotate="rotate-[15deg]" />
          <EyePatch rotate="-rotate-[15deg]" />
        </div>
        <div className="w-8 h-5 sm:w-9 sm:h-5 lg:w-10 lg:h-6 bg-charcoal rounded-full mt-4 sm:mt-5 lg:mt-6" />
        <div className="w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 border-b-[3px] lg:border-b-4 border-charcoal rounded-b-full mt-1 sm:mt-2" />
      </div>
    </motion.div>
  );
}

// ─── HERO ───
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
    <section className="min-h-[100svh] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 sm:px-12 lg:px-24 pt-32 sm:pt-40 lg:pt-32 pb-16 lg:pb-12 gap-12 sm:gap-16 lg:gap-16 overflow-hidden relative">
      {/* Floating lime blobs — static divs, no backdrop-filter, GPU-forced */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#D6FF57] opacity-[0.12] blur-[120px] pointer-events-none"
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#D6FF57] opacity-[0.12] blur-[120px] pointer-events-none"
        animate={{ x: [0, -20, 15, 0], y: [0, 15, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      />

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
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(214,255,87,0.4)' }}
                whileTap={{ scale: 0.95 }}
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
        className="flex-1 flex justify-center lg:justify-end w-full relative z-10"
      >
        <PandaFace />
      </motion.div>
    </section>
  );
}

// ─── MARQUEE ───
function Marquee() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-6 sm:py-8 bg-charcoal text-lime-punch overflow-hidden flex whitespace-nowrap w-full border-y-2 sm:border-y-[3px] border-lime-punch/20 relative items-center"
    >
      <motion.div
        className="flex whitespace-nowrap text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter uppercase"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
        style={{ width: "fit-content", willChange: 'transform' }}
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
    </motion.div>
  );
}

// ─── STAGGERED TITLE ───
function StaggeredTitle({ text }) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter text-charcoal text-center leading-none flex flex-wrap justify-center"
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] } },
          }}
          className={char === ' ' ? 'w-3 sm:w-4' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h2>
  );
}

// ─── FEATURES (2-layer cards: motion wrapper + glass inner) ───
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
      <div className="mb-16 sm:mb-20 lg:mb-24 flex justify-center">
        <StaggeredTitle text="WHY ISHAAN = PANDA" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto relative">
        {cards.map((card, i) => {
          const isActive = activeCard === i;
          const isBlurred = activeCard !== null && activeCard !== i;

          return (
            /* Outer motion wrapper — handles transform (scale, y). No blur here. */
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
              animate={{
                scale: isActive ? 1.03 : isBlurred ? 0.97 : 1,
                y: isActive ? -8 : 0,
              }}
              style={{ willChange: 'transform' }}
            >
              {/* Inner glass card — handles backdrop-filter. No transform animation. */}
              <div
                className="relative p-8 sm:p-10 lg:p-12 rounded-[24px] sm:rounded-[28px] flex flex-col items-start cursor-default h-full"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(12px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                  border: isActive ? '1px solid rgba(214,255,87,0.5)' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: isActive
                    ? '0 20px 40px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.9)'
                    : '0 8px 30px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.6)',
                  filter: isBlurred ? 'blur(4px) brightness(0.95)' : 'blur(0px) brightness(1)',
                  opacity: isBlurred ? 0.85 : 1,
                  transition: 'filter 0.35s ease-out, opacity 0.35s ease-out, background 0.35s ease-out, border 0.35s ease-out, box-shadow 0.35s ease-out',
                }}
              >
                {isActive && (
                  <div className="absolute -inset-12 -z-10 rounded-full bg-[#D6FF57] opacity-15 blur-[60px] pointer-events-none" />
                )}

                <motion.div
                  animate={{
                    rotate: isActive ? 8 : -3,
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive ? '0 0 20px rgba(214,255,87,0.5)' : '0 0 0px rgba(214,255,87,0)',
                  }}
                  whileHover={{ rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-charcoal rounded-2xl flex items-center justify-center mb-8 sm:mb-10"
                  style={{ willChange: 'transform' }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-charcoal mb-3 sm:mb-4 uppercase leading-none">{card.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base sm:text-lg">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── BAMBOO LAB (1000X better) ───
function Lab() {
  const [bambooCount, setBambooCount] = useState(() => {
    const saved = localStorage.getItem('ishaanBambooCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const COOLDOWN_MS = 800;
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [burstKey, setBurstKey] = useState(0);

  const messages = [
    "Bamboo +1 from Aarav 🎋",
    "Panda is full of love 🐼",
    "Ishaan's panda is vibing",
    "Fed with friendship ✨",
    "Year 15 energy loaded 🔋",
    "Bamboo stonks 📈"
  ];
  
  const handleFeed = () => {
    if (isCooldown) return;
    
    setIsCooldown(true);
    setTimeLeft(COOLDOWN_MS);
    setBurstKey(k => k + 1);

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

  // Milestone text
  const getMilestone = () => {
    if (bambooCount >= 100) return "LEGENDARY FEEDER";
    if (bambooCount >= 50) return "PANDA WHISPERER";
    if (bambooCount >= 25) return "BAMBOO BOSS";
    if (bambooCount >= 10) return "DEDICATED";
    if (bambooCount >= 5) return "GETTING STARTED";
    return "FIRST BAMBOO?";
  };

  return (
    <section className="py-24 sm:py-32 lg:py-48 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D6FF57] opacity-[0.06] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform' }}
      >
        {/* Outer motion wrapper */}
        <div
          className="max-w-4xl w-full rounded-[32px] sm:rounded-[40px] p-8 sm:p-16 lg:p-24 relative overflow-hidden"
          style={{
            background: 'rgba(10,10,10,0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(214,255,87,0.15)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Top lime strip */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D6FF57] to-transparent"></div>
          
          {/* Floating bamboo particles on feed */}
          <AnimatePresence>
            {burstKey > 0 && Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={`${burstKey}-${idx}`}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: -120 - Math.random() * 80,
                  x: (Math.random() - 0.5) * 200,
                  scale: 0.3,
                  rotate: Math.random() * 360,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute bottom-24 left-1/2 text-2xl pointer-events-none z-20"
              >
                🎋
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter text-white mb-2 sm:mb-3 leading-none"
          >
            BAMBOO LAB
          </motion.h2>

          {/* Milestone badge */}
          <motion.div
            key={getMilestone()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-[#D6FF57]/10 border border-[#D6FF57]/20 text-[#D6FF57] text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 sm:mb-8"
          >
            {getMilestone()}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg lg:text-xl mb-10 sm:mb-12 font-medium tracking-tight"
          >
            Keep the panda energized for year 15.
          </motion.p>
          
          <div className="flex flex-col items-center mb-12 sm:mb-16">
            <div className="text-gray-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-3 sm:mb-4">Bamboo Fed</div>
            <motion.div 
              key={bambooCount}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-[5rem] sm:text-[7rem] lg:text-[8rem] leading-none font-black text-lime-punch tabular-nums"
              style={{ textShadow: '0 0 60px rgba(214,255,87,0.3)' }}
            >
              {bambooCount}
            </motion.div>
          </div>

          {/* Feed button */}
          <motion.div style={{ willChange: 'transform' }}>
            <motion.button
              disabled={isCooldown}
              whileHover={!isCooldown ? { scale: 1.05, boxShadow: '0 0 40px rgba(214,255,87,0.5)' } : {}}
              whileTap={!isCooldown ? { scale: 0.95 } : {}}
              animate={{ scale: isCooldown ? 0.95 : 1, opacity: isCooldown ? 0.7 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={handleFeed}
              className="bg-lime-punch text-charcoal px-8 py-5 sm:px-10 sm:py-6 rounded-full font-black text-lg sm:text-xl lg:text-2xl flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto mx-auto shadow-[0_0_40px_rgba(214,255,87,0.15)] transition-shadow relative z-10 min-w-[280px]"
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
        </div>
      </motion.div>
    </section>
  );
}

// ─── FOOTER (glass blur) ───
function Footer() {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Gift link copied!", {
      icon: '🔗',
      style: {
        background: 'rgba(10,10,10,0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(214,255,87,0.3)',
        color: '#FAF9F6',
        borderRadius: '16px',
        fontWeight: 'bold',
        fontSize: '15px'
      }
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-white py-12 sm:py-16 px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between rounded-t-[32px] sm:rounded-t-[40px] lg:rounded-t-[60px] mx-2 sm:mx-4 lg:mx-6 mb-2 sm:mb-4 lg:mb-6 gap-8 lg:gap-0"
      style={{
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex flex-col items-center lg:items-start gap-1">
        <div className="font-bold tracking-tight text-gray-400 text-center lg:text-left text-sm sm:text-base">
          Built by Aarav for Ishaan's 15th
        </div>
        <div className="font-bold tracking-tight text-gray-500 text-xs sm:text-sm">
          © 2026
        </div>
      </div>
      
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-lime-punch font-black tracking-tighter text-4xl sm:text-5xl order-first lg:order-none text-center"
      >
        STAY BAMBOO
      </motion.div>
      
      <motion.button 
        onClick={handleShare}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(214,255,87,0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/10 hover:bg-white/20 transition-colors text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2"
      >
        Share this gift <Share className="w-4 h-4" />
      </motion.button>
    </motion.footer>
  );
}

// ─── APP ───
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
      <ScrollProgress />
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
