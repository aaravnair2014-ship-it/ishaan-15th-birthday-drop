import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { Gift, Zap, Crown, Sprout, Share } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';

function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const scale = useMotionValue(1);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const cursorScale = useSpring(scale, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 6);
      mouseY.set(e.clientY - 6);
    };

    const handleMouseOver = (e) => {
      if (e.target && e.target.closest && (e.target.closest('button') || e.target.closest('a'))) {
        scale.set(3.333); // 12px * 3.333 ≈ 40px
      }
    };

    const handleMouseOut = () => {
      scale.set(1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, scale]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-lime-punch rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        scale: cursorScale,
      }}
    />
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
      className="fixed top-0 left-0 w-full px-6 md:px-12 flex items-center justify-between z-50 transition-colors"
      style={{
        paddingTop: py,
        paddingBottom: py,
        backgroundColor: useTransform(bgOpacity, v => `rgba(250, 249, 246, ${v})`),
        backdropFilter: useTransform(blur, v => `blur(${v}px)`),
        WebkitBackdropFilter: useTransform(blur, v => `blur(${v}px)`),
        borderBottom: useTransform(borderOpacity, v => `1px solid rgba(0, 0, 0, ${v})`)
      }}
    >
      <div className="text-xl md:text-2xl font-black tracking-tighter text-charcoal">
        FOR ISHAAN
      </div>
      <div className="font-bold tracking-tight text-xs md:text-sm uppercase text-charcoal bg-charcoal/5 px-5 py-2.5 rounded-full border border-charcoal/10 shadow-sm backdrop-blur-md">
        Gift by Aarav • 15
      </div>
    </motion.nav>
  );
}

function PandaFace() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const eyeX = useSpring(mouseX, springConfig);
  const eyeY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) / (width / 2);
      const y = (e.clientY - (top + height / 2)) / (height / 2);
      
      mouseX.set(x * 12); 
      mouseY.set(y * 12);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative w-64 h-64 md:w-[28rem] md:h-[28rem] flex items-center justify-center">
      {/* Ears */}
      <div className="absolute top-4 left-6 md:left-12 w-20 h-20 md:w-28 md:h-28 bg-charcoal rounded-full" />
      <div className="absolute top-4 right-6 md:right-12 w-20 h-20 md:w-28 md:h-28 bg-charcoal rounded-full" />
      
      {/* Face */}
      <div className="relative w-56 h-48 md:w-80 md:h-72 bg-white rounded-[100px] shadow-2xl border-4 border-bamboo-mist flex flex-col items-center justify-center overflow-hidden z-10">
        
        {/* Eye patches */}
        <div className="flex gap-8 md:gap-12 mt-4">
          <div className="w-16 h-20 md:w-20 md:h-24 bg-charcoal rounded-[3rem] rotate-[15deg] flex items-center justify-center relative overflow-hidden">
             {/* Eyeball */}
             <motion.div 
               style={{ x: eyeX, y: eyeY }}
               animate={{ scaleY: [1, 1, 0.1, 1] }}
               transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.97, 1] }}
               className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center"
             >
               <div className="w-2 h-2 md:w-3 md:h-3 bg-charcoal rounded-full" />
             </motion.div>
          </div>
          <div className="w-16 h-20 md:w-20 md:h-24 bg-charcoal rounded-[3rem] -rotate-[15deg] flex items-center justify-center relative overflow-hidden">
             {/* Eyeball */}
             <motion.div 
               style={{ x: eyeX, y: eyeY }}
               animate={{ scaleY: [1, 1, 0.1, 1] }}
               transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 0.97, 1] }}
               className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center"
             >
               <div className="w-2 h-2 md:w-3 md:h-3 bg-charcoal rounded-full" />
             </motion.div>
          </div>
        </div>

        {/* Nose */}
        <div className="w-8 h-5 md:w-10 md:h-6 bg-charcoal rounded-full mt-4 md:mt-6" />
        
        {/* Mouth */}
        <div className="w-12 h-6 md:w-16 md:h-8 border-b-[3px] md:border-b-4 border-charcoal rounded-b-full mt-1" />
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
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-24 pt-32 pb-12 gap-16 overflow-hidden">
      <motion.div 
        className="flex-1 flex flex-col items-start z-10 w-full"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-block bg-charcoal text-lime-punch text-xs md:text-sm font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8">
          A BIRTHDAY DROP FOR
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-[14vw] md:text-[8rem] leading-[0.85] font-black tracking-tighter text-charcoal mb-8">
          ISHAAN <br /> <span className="text-gray-300">//</span> FIFTEEN
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-gray-600 max-w-lg mb-10 font-medium leading-relaxed tracking-tight">
          From Aarav. Panda-powered since day one. This is your corner of the internet.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 min-h-[4rem] items-center">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.button 
                key="btn"
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenGift}
                className="bg-lime-punch text-charcoal px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-[#cbf740] transition-colors shadow-lg shadow-lime-punch/20"
              >
                Open Your Gift <Gift className="w-5 h-5 ml-1" />
              </motion.button>
            ) : (
              <motion.div 
                key="msg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-charcoal text-white px-6 py-4 md:px-8 md:py-4 rounded-[2rem] border border-white/10 font-bold text-base md:text-lg shadow-2xl tracking-tight"
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
        className="flex-1 flex justify-center md:justify-end w-full"
      >
        <PandaFace />
      </motion.div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="py-8 bg-charcoal text-lime-punch overflow-hidden flex whitespace-nowrap w-full border-y md:border-y-[3px] border-lime-punch/20 relative items-center">
      <motion.div
        className="flex whitespace-nowrap text-3xl md:text-6xl font-black tracking-tighter uppercase"
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
            <span className="mx-6 md:mx-10">FOR ISHAAN</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
            <span className="mx-6 md:mx-10">15</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
            <span className="mx-6 md:mx-10">RARE</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
            <span className="mx-6 md:mx-10">REAL</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
            <span className="mx-6 md:mx-10">CHILL</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
            <span className="mx-6 md:mx-10">BAMBOO POWERED</span>
            <span className="mx-6 md:mx-10 text-lime-punch/50">•</span>
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
  const cards = [
    {
      title: "CHILL ENERGY",
      desc: "Stays calm under pressure. Unbothered, focused, moving at his own pace.",
      icon: <Zap className="w-8 h-8 text-lime-punch" />
    },
    {
      title: "RARE & REAL",
      desc: "A 1% mindset. No fake flexes, just genuine vibes and authentic moves.",
      icon: <Crown className="w-8 h-8 text-lime-punch" />
    },
    {
      title: "LEGEND IN THE MAKING",
      desc: "15 years of leveling up. The best chapters haven't even been written yet.",
      icon: <Sprout className="w-8 h-8 text-lime-punch" />
    }
  ];

  return (
    <section className="py-24 md:py-40 px-6 md:px-24 bg-bamboo-mist">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 md:mb-24 flex justify-center"
      >
        <h2 className="text-4xl md:text-[4rem] font-black tracking-tighter text-charcoal text-center leading-none">
          WHY ISHAAN <br className="md:hidden"/> = PANDA
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.02, y: -8 }}
            className="bg-white/70 backdrop-blur-xl p-10 md:p-12 rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col items-start"
          >
            <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center mb-10 -rotate-3">
              {card.icon}
            </div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-charcoal mb-4 uppercase leading-none">{card.title}</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-lg">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Lab() {
  const [bambooCount, setBambooCount] = useState(() => {
    const saved = localStorage.getItem('ishaanBambooCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const handleFeed = () => {
    setBambooCount(prev => {
      const next = prev + 1;
      localStorage.setItem('ishaanBambooCount', next.toString());
      return next;
    });
    
    toast("Panda fed +1 bamboo from Aarav", {
      icon: '🌿',
      style: {
        background: '#D6FF57',
        color: '#0A0A0A',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '15px'
      }
    });
  };

  return (
    <section className="py-32 md:py-48 px-6 md:px-24 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full bg-charcoal rounded-[40px] p-12 md:p-24 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-lime-punch"></div>
        
        <h2 className="text-4xl md:text-[4rem] font-black tracking-tighter text-white mb-6 leading-none">
          BAMBOO LAB
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12 font-medium tracking-tight">Keep the panda energized for year 15.</p>
        
        <div className="flex flex-col items-center mb-16">
          <div className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">Bamboo Fed</div>
          <motion.div 
            key={bambooCount}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[6rem] md:text-[8rem] leading-none font-black text-lime-punch tabular-nums"
          >
            {bambooCount}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleFeed}
          className="bg-lime-punch text-charcoal px-10 py-6 rounded-full font-black text-xl md:text-2xl flex items-center justify-center gap-3 w-full md:w-auto mx-auto shadow-[0_0_40px_rgba(214,255,87,0.2)] hover:shadow-[0_0_60px_rgba(214,255,87,0.4)] transition-shadow relative z-10"
        >
          Aarav fed the Panda <Sprout className="w-6 h-6 md:w-8 md:h-8" />
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
    <footer className="bg-charcoal text-white py-16 px-6 md:px-24 flex flex-col md:flex-row items-center justify-between border-t border-white/10 rounded-t-[40px] md:rounded-t-[60px] mx-2 md:mx-6 mb-2 md:mb-6 gap-8 md:gap-0">
      <div className="flex flex-col items-center md:items-start gap-1">
        <div className="font-bold tracking-tight text-gray-400 text-center md:text-left">
          Built by Aarav for Ishaan's 15th
        </div>
        <div className="font-bold tracking-tight text-gray-500 text-sm">
          © 2026
        </div>
      </div>
      
      <div className="text-lime-punch font-black tracking-tighter text-4xl md:text-5xl order-first md:order-none text-center">
        STAY BAMBOO
      </div>
      
      <motion.button 
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/10 hover:bg-white/20 transition-colors text-white px-6 py-3 rounded-full font-bold text-sm md:text-base flex items-center gap-2"
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
      <Toaster position="bottom-center" />
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Lab />
      <Footer />
    </div>
  );
}
