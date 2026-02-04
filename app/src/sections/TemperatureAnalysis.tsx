import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

const temperatureData = [
  { name: 'Muito Quente', value: 8, percentage: 7.1, color: '#ef4444', description: 'Prontos para fechamento imediato' },
  { name: 'Quente', value: 1, percentage: 0.9, color: '#f97316', description: 'Alto interesse, próximos de decidir' },
  { name: 'Morna', value: 2, percentage: 1.8, color: '#f59e0b', description: 'Interesse moderado, precisam de estímulo' },
  { name: 'Morno', value: 32, percentage: 28.3, color: '#3b82f6', description: 'Iniciando pesquisa, precisam de nutrição' },
  { name: 'Frio', value: 66, percentage: 58.4, color: '#64748b', description: 'Pouco interesse, necessitam educação' },
  { name: 'Muito Frio', value: 4, percentage: 3.5, color: '#94a3b8', description: 'Sem interesse identificado' },
];

export default function TemperatureAnalysis() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação do título
      gsap.fromTo('.temp-title',
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

      // Animação do gráfico
      gsap.fromTo(chartRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 85%',
          },
        }
      );

      // Animação dos cards da legenda
      gsap.fromTo('.legend-card',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.legend-container',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0d1321] border border-[#d4af37]/30 rounded-lg p-3 shadow-xl">
          <p className="font-semibold" style={{ color: data.color }}>{data.name}</p>
          <p className="text-white">{data.value} leads ({data.percentage}%)</p>
          <p className="text-[#a0aec0] text-sm">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      ref={sectionRef}
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="temp-title mb-10">
          <div 
            className="w-16 h-1 mb-4"
            style={{ backgroundColor: customization.primaryColor }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Análise de Temperatura dos Leads
          </h2>
          <p className="text-[#a0aec0]">Distribuição por estágio de interesse</p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Chart */}
          <div
            ref={chartRef}
            className="relative h-[400px] bg-[#0d1321]/50 rounded-2xl border border-[#d4af37]/20 p-6"
            style={{ 
              perspective: '1000px',
              opacity: 0,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={temperatureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {temperatureData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? customization.primaryColor : 'none'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? `drop-shadow(0 0 10px ${entry.color})` : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold text-white">113</span>
              <span className="text-[#a0aec0] text-sm">Total de Leads</span>
            </div>

            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse-gold"
              style={{ boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.1)' }}
            />
          </div>

          {/* Legend Cards */}
          <div className="legend-container space-y-3">
            {temperatureData.map((item, index) => (
              <div
                key={item.name}
                className="legend-card p-4 rounded-xl bg-[#0d1321]/80 border border-[#d4af37]/10 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                style={{ opacity: 0 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-4">
                  {/* Color indicator */}
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: item.color }}
                  />
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#64748b]">{item.description}</span>
                      <span className="text-sm text-[#a0aec0]">{item.percentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-[#040812] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
