import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Language } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface HeroProps {
    onLanguageSelect: (language: Language) => void;
}

const texts = ["Try your code...", "See the output...", "Fix errors with AI..."];

const RollingText: React.FC<{onTextClick: () => void}> = ({ onTextClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
  
    useEffect(() => {
      const handleTyping = () => {
        const fullText = texts[currentIndex];
        if (isDeleting) {
          setDisplayedText(fullText.substring(0, displayedText.length - 1));
        } else {
          setDisplayedText(fullText.substring(0, displayedText.length + 1));
        }
  
        if (!isDeleting && displayedText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayedText === "") {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      };
  
      const typingSpeed = isDeleting ? 75 : 150;
      const timeoutId = setTimeout(handleTyping, typingSpeed);
      return () => clearTimeout(timeoutId);
    }, [displayedText, isDeleting, currentIndex]);
  
    return (
      <div className="text-3xl md:text-5xl font-mono cursor-pointer" onClick={onTextClick}>
        <span className="text-cyan-400">{displayedText}</span>
        <span className="animate-ping">|</span>
      </div>
    );
};

const Hero: React.FC<HeroProps> = ({ onLanguageSelect }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    // FIX: Initialize useRef with null to prevent "Expected 1 arguments, but got 0" error.
    const animationFrameIdRef = useRef<number | null>(null);
    const mouseRef = useRef<{ x: number | null, y: number | null, radius: number }>({
        x: null,
        y: null,
        radius: 150
    });

    const scrollToLanguages = () => {
        const languagesEl = document.getElementById('languages-section');
        languagesEl?.scrollIntoView({ behavior: 'smooth' });
    }

    const createParticles = useCallback((canvas: HTMLCanvasElement) => {
        const particleArray: Particle[] = [];
        const numberOfParticles = (canvas.height * canvas.width) / 4500;
        for (let i = 0; i < numberOfParticles; i++) {
            const radius = Math.random() * 2 + 1;
            particleArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.95,
                vy: (Math.random() - 0.5) * 0.95,
                radius: radius,
                color: 'rgb(0, 255, 255)'
            });
        }
        particlesRef.current = particleArray;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        connectParticles(ctx);
        
        animationFrameIdRef.current = requestAnimationFrame(animate);
    }, []);

    const connectParticles = (ctx: CanvasRenderingContext2D) => {
        let opacityValue = 1;
        for (let a = 0; a < particlesRef.current.length; a++) {
            for (let b = a; b < particlesRef.current.length; b++) {
                const distance = Math.sqrt(
                    Math.pow(particlesRef.current[a].x - particlesRef.current[b].x, 2) +
                    Math.pow(particlesRef.current[a].y - particlesRef.current[b].y, 2)
                );
                if (distance < 100) {
                    opacityValue = 1 - (distance / 100);
                    ctx.strokeStyle = `rgba(0, 180, 255, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y);
                    ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y);
                    ctx.stroke();
                }
            }
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        const handleResize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            createParticles(canvas);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = event.clientX - rect.left;
            mouseRef.current.y = event.clientY - rect.top;
        };
        
        const handleMouseOut = () => {
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        handleResize();
        animate();

        window.addEventListener('resize', handleResize);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseout', handleMouseOut);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseout', handleMouseOut);
            if(animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        }
    }, [animate, createParticles]);

  return (
    <div ref={containerRef} className="relative h-[calc(100vh-68px)] flex flex-col items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0"></canvas>
        <div className="relative z-10 text-center flex flex-col items-center justify-center p-4">
            <RollingText onTextClick={scrollToLanguages}/>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
                Select a language to start writing, compiling, and debugging your code with the power of AI.
            </p>
            <div id="languages-section" className="mt-12">
                 <h2 className="text-2xl font-semibold mb-6">Choose a Language</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                     <button onClick={() => onLanguageSelect(Language.JavaScript)} className="bg-gray-800 p-6 rounded-lg hover:bg-yellow-500/20 hover:border-yellow-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-yellow-400">JS</span>
                         <p className="mt-2 text-lg">JavaScript</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.Python)} className="bg-gray-800 p-6 rounded-lg hover:bg-blue-500/20 hover:border-blue-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-blue-400">PY</span>
                         <p className="mt-2 text-lg">Python</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.Java)} className="bg-gray-800 p-6 rounded-lg hover:bg-red-500/20 hover:border-red-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-red-400">JA</span>
                         <p className="mt-2 text-lg">Java</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.HTML)} className="bg-gray-800 p-6 rounded-lg hover:bg-orange-500/20 hover:border-orange-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-orange-400">HT</span>
                         <p className="mt-2 text-lg">HTML</p>
                     </button>
                      <button onClick={() => onLanguageSelect(Language.CSS)} className="bg-gray-800 p-6 rounded-lg hover:bg-purple-500/20 hover:border-purple-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-purple-400">CS</span>
                         <p className="mt-2 text-lg">CSS</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.C)} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-500/20 hover:border-gray-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-gray-400">C</span>
                         <p className="mt-2 text-lg">C</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.CPP)} className="bg-gray-800 p-6 rounded-lg hover:bg-indigo-500/20 hover:border-indigo-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-indigo-400">C++</span>
                         <p className="mt-2 text-lg">C++</p>
                     </button>
                     <button onClick={() => onLanguageSelect(Language.R)} className="bg-gray-800 p-6 rounded-lg hover:bg-pink-500/20 hover:border-pink-400 border-2 border-transparent transition-all duration-300">
                         <span className="text-4xl font-bold text-pink-400">R</span>
                         <p className="mt-2 text-lg">R</p>
                     </button>
                 </div>
            </div>
        </div>
    </div>
  );
};


export default Hero;