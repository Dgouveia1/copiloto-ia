import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Home, Flame, Bell } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay: number;
  color?: string;
}

function StatCard({ icon, value, label, suffix = '', prefix = '', delay, color = '#d4af37' }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação de entrada 3D
      gsap.fromTo(cardRef.current,
        { rotateX: -90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.7,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Animação de contagem
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: value,
            duration: 2,
            delay: delay + 0.3,
            ease: 'expo.out',
            onUpdate: function() {
              setDisplayValue(Math.round(this.targets()[0].val));
            },
          });
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [value, delay]);

  // Efeito 3D no hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(cardRef.current, {
      rotateX: -rotateX,
      rotateY: -rotateY,
      translateZ: 30,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative p-6 rounded-2xl bg-[#0d1321]/80 border border-[#d4af37]/20 backdrop-blur-sm cursor-pointer group"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        opacity: 0,
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        
        <div className="flex items-baseline gap-1">
          <span 
            ref={numberRef}
            className="text-4xl font-bold transition-all duration-300 group-hover:animate-glow-text"
            style={{ color }}
          >
            {prefix}{displayValue.toLocaleString()}{suffix}
          </span>
        </div>
        
        <p className="text-[#a0aec0] text-sm mt-2">{label}</p>
      </div>

      {/* Border glow on hover */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 20px ${color}30` }}
      />
    </div>
  );
}

export default function HeroDashboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação da linha decorativa
      gsap.fromTo('.title-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animação do título
      gsap.fromTo('.title-word',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animação do subtítulo
      gsap.fromTo('.subtitle',
        { opacity: 0, filter: 'blur(10px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animação do badge de data
      gsap.fromTo('.date-badge',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.6,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <MessageSquare size={24} />, value: 113, label: 'Total de Atendimentos', delay: 0.4 },
    { icon: <Home size={24} />, value: 56, label: 'Buscam Imóvel (49.6%)', delay: 0.55 },
    { icon: <Flame size={24} />, value: 9, label: 'Leads Quentes (8.0%)', delay: 0.7, color: '#ef4444' },
    { icon: <Bell size={24} />, value: 28, label: 'FUPs Pendentes (24.8%)', delay: 0.85, color: '#f59e0b' },
  ];

  return (
    <section
      ref={sectionRef}
      id="dashboard"
      className="section-padding pt-32 md:pt-40"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title Block */}
        <div ref={titleRef} className="mb-12">
          {/* Decorative line */}
          <div 
            className="title-line w-20 h-1 mb-6 origin-left"
            style={{ backgroundColor: customization.primaryColor }}
          />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {'Dashboard de Performance'.split(' ').map((word, i) => (
              <span key={i} className="title-word inline-block mr-4">
                {word}
              </span>
            ))}
          </h1>
          
          <p className="subtitle text-lg md:text-xl text-[#a0aec0] max-w-2xl mb-6">
            Visão completa dos seus atendimentos e métricas em tempo real
          </p>
          
          <div 
            className="date-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ 
              backgroundColor: `${customization.primaryColor}15`,
              border: `1px solid ${customization.primaryColor}30`,
              color: customization.primaryColor,
            }}
          >
            <span>Período: 03 de Fevereiro de 2026</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={stat.delay}
              color={stat.color || customization.primaryColor}
            />
          ))}
        </div>

        {/* Insight Box */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border border-[#d4af37]/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#d4af37] text-xl">💡</span>
            </div>
            <div>
              <h4 className="text-[#d4af37] font-semibold mb-1">Insight do Dia</h4>
              <p className="text-[#a0aec0]">
                Apenas metade dos atendimentos demonstram interesse ativo em imóveis. 
                Os outros 50.4% representam oportunidades de educação e nutrição de leads para futura conversão.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
