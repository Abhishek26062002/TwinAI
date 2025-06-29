import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { gsap } from "gsap";
import { Cloud, Sun, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Utility functions
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

// DotGrid Component
const DotGrid = ({
  dotSize = 3,
  gap = 24,
  baseColor = "#4A5568",
  activeColor = "#E2E8F0",
  proximity = 120,
  speedTrigger = 80,
  shockRadius = 180,
  shockStrength = 4,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;

    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (baseRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 16);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
  ]);

  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
};

// Logo Component
const Logo = ({ isDark }) => {
  return (
    <div className={`flex items-center gap-2 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'} font-dm-sans`}>
      <div className="relative">
        <Cloud className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'fill-white' : 'fill-gray-900'} transition-colors duration-500`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}></div>
        </div>
      </div>
      <span className="text-lg sm:text-xl font-bold tracking-tight">twin.ai</span>
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative rounded-full p-2 sm:p-3 transition-all duration-300 ease-out
        ${isDark 
          ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700' 
          : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
        }
        hover:scale-105 active:scale-95
      `}
    >
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative w-4 h-4 sm:w-5 sm:h-5">
          <Sun 
            className={`
              absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ease-out
              ${isDark 
                ? 'opacity-0 rotate-90 scale-50 text-orange-400' 
                : 'opacity-100 rotate-0 scale-100 text-orange-500'
              }
            `}
          />
          <Moon 
            className={`
              absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ease-out
              ${isDark 
                ? 'opacity-100 rotate-0 scale-100 text-gray-300' 
                : 'opacity-0 -rotate-90 scale-50 text-gray-600'
              }
            `}
          />
        </div>
      </div>
    </button>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const leftFigureRef = useRef(null);
  const rightFigureRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    // Animate content in sequence
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    )
    .fromTo([leftFigureRef.current, rightFigureRef.current],
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.1 },
      "-=0.5"
    );
  }, []);

  const handleGetStarted = () => {
    const getUID = () => sessionStorage.getItem('uid');
    if(getUID){
      navigate('/share');
    }
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        navigate('/login');
      }
    });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`h-screen transition-all duration-500 relative overflow-hidden font-dm-sans ${
      isDark 
        ? 'bg-black' 
        : 'bg-white light-theme'
    }`}>
      {/* Dot Grid Background */}
      <div className="absolute inset-0">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor={isDark ? "#374151" : "#D1D5DB"}
          activeColor={isDark ? "#9CA3AF" : "#374151"}
          proximity={120}
          speedTrigger={80}
          shockRadius={180}
          shockStrength={4}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 md:p-8 lg:p-12 flex justify-between items-center flex-shrink-0">
          <Logo isDark={isDark} />
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </header>

        {/* Main Content - Hero Section moved much higher */}
        <main className="flex-1 flex flex-col justify-start items-center px-4 sm:px-6 md:px-8 lg:px-12 text-center pt-2 sm:pt-4 md:pt-6 lg:pt-4">
          <div className="max-w-7xl mx-auto w-full">
            {/* Title - positioned much higher */}
            <h1 
              ref={titleRef}
              className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-7xl font-bold mb-2 sm:mb-3 md:mb-4 leading-[0.85] sm:leading-[0.9] transition-colors duration-500 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Create Your Digital Twin
              <br />
              <span className={`text-transparent bg-clip-text transition-all duration-500 ${
                isDark 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-800'
              }`}>
                In Minutes
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              ref={subtitleRef}
              className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed transition-colors duration-500 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Transform your digital presence with AI-powered twin technology. 
              Experience the future of virtual interaction today.
            </p>

            {/* Beautiful Blob Button */}
            <button
              ref={buttonRef}
              onClick={handleGetStarted}
              className="blob-button mx-auto"
            >
              <div className="blob"></div>
              <div className="blob"></div>
              <div className="blob"></div>
              <div className="blob"></div>
              <div className="text">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </div>
            </button>
          </div>
        </main>

        {/* Bottom Images - Significantly larger and stick to bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end pointer-events-none px-2 sm:px-4 md:px-8 lg:px-12">
          {/* Left Figure - Much larger */}
          <img
            ref={leftFigureRef}
            src="https://res.cloudinary.com/dy1txrjmy/image/upload/v1751150421/black-Picsart-AiImageEnhancer_2_es5o8b.png"
            alt="Digital Twin Left"
            className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[26rem] 3xl:w-[44rem] h-auto grayscale opacity-80"
          />
          
          {/* Right Figure - Much larger */}
          <img
            ref={rightFigureRef}
            src="https://res.cloudinary.com/dy1txrjmy/image/upload/v1751150421/black-Picsart-AiImageEnhancer_2_es5o8b.png"
            alt="Digital Twin Right"
            className="w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[26rem] 3xl:w-[44rem] h-auto scale-x-[-1] grayscale opacity-80"
          />
        </div>

        {/* Footer */}
        <footer className="p-4 sm:p-6 md:p-8 lg:p-12 text-center flex-shrink-0 relative z-10">
          <p className={`text-xs sm:text-sm transition-colors duration-500 ${
            isDark ? 'text-gray-600' : 'text-gray-500'
          }`}>
            Experience the next generation of digital interaction
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
