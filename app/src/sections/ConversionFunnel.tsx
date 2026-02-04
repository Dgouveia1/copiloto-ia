import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Users, Home, Thermometer, Flame } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

const funnelStages = [
  { 
    icon: <Users size={24} />, 
    value: 113, 
    label: 'Total Atendimentos', 
    description: 'leads iniciais',
    color: '#3b82f6',
    width: '100%',
  },
  { 
    icon: <Home size={24} />, 
    value: 56, 
    label: 'Buscam Imóvel', 
    description: 'leads (49.6%)',
    color: '#06b6d4',
    width: '75%',
  },
  { 
    icon: <Thermometer size={24} />, 
    value: 35, 
    label: 'Leads Mornos+', 
    description: 'leads (31%)',
    color: '#f59e0b',
    width: '55%',
  },
  { 
    icon: <Flame size={24} />, 
    value: 9, 
    label: 'Leads Quentes+', 
    description: 'leads (8%)',
    color: '#ef4444',
    width: '35%',
  },
];

export default function ConversionFunnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(funnelStages.map(() => 0));
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação do título
      gsap.fromTo('.funnel-title',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Animação das etapas do funil
      funnelStages.forEach((_, index) => {
        gsap.fromTo(`.funnel-stage-${index}`,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      });

      // Animação das setas conectoras
      gsap.fromTo('.connector-arrow',
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.2,
          delay: 0.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Animação de contagem dos números
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        onEnter: () => {
          funnelStages.forEach((stage, index) => {
            gsap.to({ val: 0 }, {
              val: stage.value,
              duration: 1,
              delay: index * 0.2 + 0.3,
              ease: 'expo.out',
              onUpdate: function() {
                setAnimatedValues(prev => {
                  const newValues = [...prev];
                  newValues[index] = Math.round(this.targets()[0].val);
                  return newValues;
                });
              },
            });
          });
        },
      });

      // Animação do insight box
      gsap.fromTo('.insight-box',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="funil"
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="funnel-title mb-10">
          <div 
            className="w-16 h-1 mb-4"
            style={{ backgroundColor: customization.primaryColor }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Funil de Conversão
          </h2>
          <p className="text-[#a0aec0]">Jornada dos leads no processo</p>
        </div>

        {/* Funnel */}
        <div className="flex flex-col items-center gap-2 mb-8">
          {funnelStages.map((stage, index) => (
            <div key={stage.label} className="w-full flex flex-col items-center">
              {/* Stage Card */}
              <div
                className={`funnel-stage-${index} relative flex items-center gap-4 p-5 rounded-xl bg-[#0d1321]/80 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group cursor-pointer`}
                style={{ 
                  width: stage.width,
                  maxWidth: '600px',
                  opacity: 0,
                }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 30px ${stage.color}20` }}
                />

                <div className="relative z-10 flex items-center gap-4 w-full">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                  >
                    {stage.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: stage.color }}>
                        {animatedValues[index]}
                      </span>
                      <span className="text-[#a0aec0]">{stage.description}</span>
                    </div>
                    <span className="text-white font-medium">{stage.label}</span>
                  </div>

                  {/* Stage number */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: stage.color, color: '#040812' }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Progress fill animation */}
                <div 
                  className="absolute bottom-0 left-0 h-1 rounded-b-xl transition-all duration-1000"
                  style={{ 
                    width: '100%',
                    background: `linear-gradient(90deg, ${stage.color}40, ${stage.color})`,
                  }}
                />
              </div>

              {/* Connector Arrow */}
              {index < funnelStages.length - 1 && (
                <div className="connector-arrow py-2" style={{ opacity: 0 }}>
                  <ChevronDown 
                    size={28} 
                    className="text-[#d4af37] animate-bounce" 
                    style={{ animationDuration: '2s' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Insight Box */}
        <div className="insight-box max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-r from-[#ef4444]/10 to-transparent border border-[#ef4444]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ef4444]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#ef4444] text-xl">⚠️</span>
            </div>
            <div>
              <h4 className="text-[#ef4444] font-semibold mb-1">Ponto de Atenção</h4>
              <p className="text-[#a0aec0]">
                A maior perda ocorre na etapa inicial: <span className="text-white font-semibold">50.4%</span> dos atendimentos 
                não demonstram interesse em imóveis. Foco em qualificar melhor e educar esses leads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
