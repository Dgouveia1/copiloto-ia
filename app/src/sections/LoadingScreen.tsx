import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animação do logo - entrada 3D
      tl.fromTo(logoRef.current,
        { rotateY: 180, scale: 0.3, opacity: 0 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 1, ease: 'expo.out' }
      );

      // Animação de flutuação contínua do logo
      gsap.to(logoRef.current, {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Efeito de brilho no logo
      gsap.to('.logo-shimmer', {
        backgroundPosition: '200% center',
        duration: 2,
        repeat: -1,
        ease: 'linear',
      });

      // Animação do texto - typewriter effect
      tl.fromTo(textRef.current,
        { width: 0, opacity: 0 },
        { width: 'auto', opacity: 1, duration: 0.8, ease: 'none' },
        '-=0.3'
      );

      // Animação da barra de progresso
      tl.fromTo(progressBarRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: 'expo.out' },
        '-=0.5'
      );

      // Simulação de progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Sequência de saída
      tl.to({}, { duration: 0.5 }); // Espera

      tl.to([logoRef.current, textRef.current, progressRef.current], {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.in',
        onComplete: () => {
          // Efeito de clip-path circular expandindo
          gsap.to(containerRef.current, {
            clipPath: 'circle(0% at 50% 50%)',
            duration: 0.8,
            ease: 'expo.inOut',
            onComplete,
          });
        },
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0f1f 0%, #040812 100%)',
        clipPath: 'circle(150% at 50% 50%)',
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ perspective: '1000px' }}>
        {/* Logo 3D */}
        <div
          ref={logoRef}
          className="relative w-32 h-32 md:w-40 md:h-40"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Círculo externo */}
          <div className="absolute inset-0 rounded-full border-4 border-[#d4af37] opacity-80" />
          
          {/* Círculo interno */}
          <div className="absolute inset-3 rounded-full border-2 border-[#d4af37] opacity-60" />
          
          {/* Avião de papel SVG */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full p-6"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#f4d03f" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 15 L85 70 L50 55 L15 70 Z"
              fill="url(#goldGradient)"
              filter="url(#glow)"
              className="logo-shimmer"
              style={{
                background: 'linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)',
                backgroundSize: '200% 100%',
              }}
            />
            <path
              d="M50 55 L50 85 L60 65 Z"
              fill="#b8941f"
              filter="url(#glow)"
            />
          </svg>

          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4af37]/20 via-transparent to-[#d4af37]/20 animate-pulse" />
        </div>

        {/* Texto Copiloto */}
        <div
          ref={textRef}
          className="overflow-hidden whitespace-nowrap"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient tracking-wider">
            Copiloto
          </h1>
        </div>

        {/* Barra de progresso */}
        <div ref={progressRef} className="w-64 md:w-80">
          <div className="flex justify-between text-sm text-[#a0aec0] mb-2">
            <span>Carregando</span>
            <span>{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="h-2 bg-[#0d1321] rounded-full overflow-hidden border border-[#d4af37]/20">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] rounded-full origin-left"
              style={{
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
              }}
            />
          </div>
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#d4af37] rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
