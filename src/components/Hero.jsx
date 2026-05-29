import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Magnetic from './Magnetic';

const fruitsData = [
  {
    id: 'apple',
    name: 'Apple',
    image: '/fruits/apple.png',
    initialX: -320, initialY: -350,
    finalX: -70, finalY: 70,
    initialRotate: -120, finalRotate: 15,
    initialScale: 1.3, finalScale: 0.85
  },
  {
    id: 'banana',
    name: 'Banana',
    image: '/fruits/banana.png',
    initialX: -150, initialY: -450,
    finalX: -110, finalY: 20,
    initialRotate: -60, finalRotate: -35,
    initialScale: 1.4, finalScale: 0.9
  },
  {
    id: 'orange',
    name: 'Orange',
    image: '/fruits/orange.png',
    initialX: 280, initialY: -380,
    finalX: 70, finalY: 65,
    initialRotate: 90, finalRotate: -20,
    initialScale: 1.3, finalScale: 0.85
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    image: '/fruits/strawberry.png',
    initialX: -220, initialY: -250,
    finalX: -30, finalY: 90,
    initialRotate: 45, finalRotate: 10,
    initialScale: 1.1, finalScale: 0.75
  },
  {
    id: 'grapes',
    name: 'Grapes',
    image: '/fruits/grape.png',
    initialX: 180, initialY: -420,
    finalX: 35, finalY: 25,
    initialRotate: -45, finalRotate: 15,
    initialScale: 1.4, finalScale: 0.9
  },
  {
    id: 'pear',
    name: 'Pear',
    image: '/fruits/pear.png',
    initialX: -80, initialY: -400,
    finalX: 0, finalY: 75,
    initialRotate: 30, finalRotate: -5,
    initialScale: 1.3, finalScale: 0.85
  },
  {
    id: 'lemon',
    name: 'Lemon',
    image: '/fruits/lemon.png',
    initialX: 320, initialY: -220,
    finalX: 110, finalY: 15,
    initialRotate: -90, finalRotate: 40,
    initialScale: 1.2, finalScale: 0.8
  },
  {
    id: 'cherry',
    name: 'Cherry',
    image: '/fruits/cherry.png',
    initialX: -280, initialY: -180,
    finalX: -50, finalY: -10,
    initialRotate: 15, finalRotate: -15,
    initialScale: 1.0, finalScale: 0.75
  },
  {
    id: 'avocado',
    name: 'Avocado',
    image: '/fruits/avocado.png',
    initialX: 80, initialY: -320,
    finalX: -15, finalY: 20,
    initialRotate: -75, finalRotate: 12,
    initialScale: 1.3, finalScale: 0.85
  },
  {
    id: 'peach',
    name: 'Peach',
    image: '/fruits/peach.png',
    initialX: 240, initialY: -280,
    finalX: 55, finalY: -15,
    initialRotate: 110, finalRotate: -25,
    initialScale: 1.2, finalScale: 0.8
  }
];

const leavesData = [
  {
    id: 'leaf1',
    initialX: -380, initialY: -100,
    finalX: -200, finalY: 120,
    initialRotate: 0, finalRotate: 180,
    size: 40,
  },
  {
    id: 'leaf2',
    initialX: 380, initialY: -150,
    finalX: 220, finalY: 80,
    initialRotate: 45, finalRotate: -120,
    size: 35,
  },
  {
    id: 'leaf3',
    initialX: -100, initialY: -500,
    finalX: -50, finalY: -120,
    initialRotate: -30, finalRotate: 90,
    size: 30,
  },
  {
    id: 'leaf4',
    initialX: 150, initialY: -480,
    finalX: 80, finalY: -100,
    initialRotate: 60, finalRotate: -60,
    size: 32,
  }
];

const FruitItem = ({ fruit, scrollYProgress }) => {
  const x = useTransform(scrollYProgress, [0, 0.7, 1], [fruit.initialX, fruit.finalX, fruit.finalX]);
  const y = useTransform(scrollYProgress, [0, 0.7, 1], [fruit.initialY, fruit.finalY, fruit.finalY]);
  const rotate = useTransform(scrollYProgress, [0, 0.7, 1], [fruit.initialRotate, fruit.finalRotate, fruit.finalRotate]);
  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [fruit.initialScale, fruit.finalScale, fruit.finalScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.7, 1], [0, 1, 1, 1]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 85,
        height: 85,
        marginLeft: -42.5,
        marginTop: -42.5,
        zIndex: 10,
        transformOrigin: 'center center',
      }}
    >
      <img 
        src={fruit.image} 
        alt={fruit.name} 
        className="w-full h-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.18)]" 
      />
    </motion.div>
  );
};

const LeafItem = ({ leaf, scrollYProgress }) => {
  const x = useTransform(scrollYProgress, [0, 0.7, 1], [leaf.initialX, leaf.finalX, leaf.finalX]);
  const y = useTransform(scrollYProgress, [0, 0.7, 1], [leaf.initialY, leaf.finalY, leaf.finalY]);
  const rotate = useTransform(scrollYProgress, [0, 0.7, 1], [leaf.initialRotate, leaf.finalRotate, leaf.finalRotate]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.7, 1], [0, 0.8, 0.8, 0.8]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: leaf.size,
        height: leaf.size,
        marginLeft: -leaf.size / 2,
        marginTop: -leaf.size / 2,
        zIndex: 5,
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="leafGradSingle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        <path d="M50,15 C70,15 85,35 70,65 C55,80 35,80 30,65 C25,45 30,15 50,15 Z" fill="url(#leafGradSingle)" />
        <path d="M30,65 Q50,45 70,15" stroke="#14532d" strokeWidth="3" fill="none" />
      </svg>
    </motion.div>
  );
};

const Hero = () => {
  const { settings } = useSettings();
  const containerRef = useRef(null);
  
  // Track scroll position of the entire Hero height wrapper (180vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth entry transitions for left content
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.6]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[180vh] w-full"
    >
      {/* Sticky container that keeps the Hero content locked during the fruit animation scroll */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-white/40 mesh-gradient">
        
        {/* Ambient background gradients with subtle motion */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-primary/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-secondary/15 blur-[130px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full max-w-7xl pt-24 lg:pt-0">
            
            {/* Left Content Side */}
            <motion.div 
              style={{ y: textY, opacity: textOpacity }}
              className="flex flex-col gap-5 lg:gap-8 text-center lg:text-left relative z-20 order-last lg:order-first max-w-xl mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white w-fit px-5 py-2 rounded-2xl mx-auto lg:mx-0 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Elite Organic Delivery Service
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] text-slate-900 tracking-tighter">
                Freshness <br />
                <span className="text-gradient">Redefined.</span>
              </h1>

              <p className="text-slate-500 text-sm md:text-lg lg:text-xl font-medium leading-relaxed">
                Sourced from world-class organic farms. Delivered with white-glove precision. Scroll down to fill your bowl with pure freshness.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start">
                <Magnetic>
                  <button 
                    onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-gradient px-10 py-4 rounded-2xl lg:rounded-[2rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3 w-full sm:w-auto justify-center group shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    Shop Collection 
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('categories-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
                      }
                    }}
                    className="px-10 py-4 rounded-2xl lg:rounded-[2rem] font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] text-slate-600 border border-slate-200 hover:bg-white transition-all w-full sm:w-auto shadow-sm"
                  >
                    Explore Categories
                  </button>
                </Magnetic>
              </div>
            </motion.div>

            {/* Right Graphic Side (Fruits and Bowl Animation) */}
            <div className="relative flex items-center justify-center order-first lg:order-last w-full h-[320px] lg:h-[450px] translate-y-12 lg:translate-y-24">
              
              {/* Scaled animation wrapper for responsive fitting */}
              <div className="relative w-[450px] h-[320px] scale-[0.6] xs:scale-[0.75] md:scale-[0.9] lg:scale-100 origin-center">
                
                {/* 1. Ambient Glow behind the Bowl */}
                <div className="absolute top-[30%] left-[8%] right-[8%] bottom-[5%] bg-primary/5 blur-[45px] rounded-full -z-10" />
                
                {/* 2. Realistic Glass Bowl Background (Behind the fruits) */}
                {/* Added mix-blend-multiply to transparently blend the white background and inset clipping to remove edge artifacts */}
                <img 
                  src="/fruits/glass_bowl.png" 
                  alt="Glass Bowl" 
                  className="absolute inset-0 w-full h-full object-contain z-0 mix-blend-multiply filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]" 
                  style={{ clipPath: 'inset(2%)' }}
                />
                
                {/* 3. Floating Leaves and Fruits Container (Animating) */}
                <div className="absolute inset-0 z-10 overflow-visible">
                  {/* Leaves */}
                  {leavesData.map((leaf) => (
                    <LeafItem key={leaf.id} leaf={leaf} scrollYProgress={scrollYProgress} />
                  ))}
                  
                  {/* Fruits (Photorealistic PNGs) */}
                  {fruitsData.map((fruit) => (
                    <FruitItem key={fruit.id} fruit={fruit} scrollYProgress={scrollYProgress} />
                  ))}
                </div>

                {/* 4. Realistic Glass Bowl Foreground Overlay (In front of the fruits) */}
                {/* Using mix-blend-multiply and inset clipping to match the background layer perfectly */}
                <img 
                  src="/fruits/glass_bowl.png" 
                  alt="Glass Bowl Overlay" 
                  className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none mix-blend-multiply opacity-80" 
                  style={{ clipPath: 'inset(2%)' }}
                />
                
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
