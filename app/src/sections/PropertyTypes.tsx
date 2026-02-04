import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Building, DoorOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

const searchTypeData = [
  { 
    icon: <Home size={28} />, 
    value: 44, 
    percentage: 38.9, 
    label: 'Locação', 
    description: 'Maior demanda do período. Clientes buscam imóveis para alugar, predominantemente casas e apartamentos.',
    color: '#3b82f6',
  },
  { 
    icon: <Building size={28} />, 
    value: 7, 
    percentage: 6.2, 
    label: 'Compra', 
    description: 'Menor volume, mas com ticket médio potencialmente maior. Foco em financiamentos e casas próprias.',
    color: '#10b981',
  },
  { 
    icon: <DoorOpen size={28} />, 
    value: 57, 
    percentage: 50.4, 
    label: 'Não Buscam', 
    description: 'Atendimentos de suporte, dúvidas ou comunicados. Oportunidade de educação para futura conversão.',
    color: '#64748b',
  },
];

const propertyTypeData = [
  { name: 'Casa', value: 24, percentage: 53, color: '#d4af37' },
  { name: 'Apartamento', value: 5, percentage: 11, color: '#3b82f6' },
  { name: 'Kitnet', value: 5, percentage: 11, color: '#06b6d4' },
  { name: 'Comercial', value: 3, percentage: 7, color: '#8b5cf6' },
];

export default function PropertyTypes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(searchTypeData.map(() => 0));
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação dos títulos
      gsap.fromTo('.section-title',
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

      // Animação dos cards de tipo de busca
      searchTypeData.forEach((_, index) => {
        gsap.fromTo(`.search-card-${index}`,
          { rotateY: index === 1 ? 0 : index === 0 ? -90 : 90, opacity: 0, scale: index === 1 ? 0.5 : 1 },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            duration: index === 1 ? 0.5 : 0.6,
            delay: index * 0.15,
            ease: index === 1 ? 'elastic.out(1, 0.5)' : 'expo.out',
            scrollTrigger: {
              trigger: '.search-types-grid',
              start: 'top 85%',
            },
          }
        );
      });

      // Animação de contagem
      ScrollTrigger.create({
        trigger: '.search-types-grid',
        start: 'top 85%',
        onEnter: () => {
          searchTypeData.forEach((item, index) => {
            gsap.to({ val: 0 }, {
              val: item.value,
              duration: 1.2,
              delay: index * 0.15 + 0.3,
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

      // Animação do gráfico de barras
      gsap.fromTo('.property-chart',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.property-chart',
            start: 'top 85%',
          },
        }
      );

      // Animação da estratégia box
      gsap.fromTo('.strategy-box',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.strategy-box',
            start: 'top 90%',
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
          <p className="font-semibold text-white">{data.name}</p>
          <p style={{ color: data.color }}>{data.value} buscas ({data.percentage}%)</p>
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
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Search Types Section */}
        <div>
          <div className="section-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Distribuição por Tipo de Busca
            </h2>
            <p className="text-[#a0aec0]">Locação vs Compra</p>
          </div>

          <div className="search-types-grid grid md:grid-cols-3 gap-6">
            {searchTypeData.map((item, index) => (
              <div
                key={item.label}
                className={`search-card-${index} relative p-6 rounded-2xl bg-[#0d1321]/80 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group cursor-pointer`}
                style={{ 
                  opacity: 0,
                  transform: index === 1 ? 'translateY(-10px)' : 'translateY(0)',
                }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 30px ${item.color}20` }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.icon}
                  </div>

                  {/* Value */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold" style={{ color: item.color }}>
                      {animatedValues[index]}
                    </span>
                    <span className="text-lg text-[#a0aec0]">({item.percentage}%)</span>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
                  
                  {/* Description */}
                  <p className="text-[#64748b] text-sm">{item.description}</p>
                </div>

                {/* Bottom accent */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Types Section */}
        <div>
          <div className="section-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Tipos de Imóveis Mais Buscados
            </h2>
            <p className="text-[#a0aec0]">Demanda por categoria</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Bar Chart */}
            <div className="property-chart h-[350px] bg-[#0d1321]/50 rounded-2xl border border-[#d4af37]/20 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyTypeData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#a0aec0" 
                    fontSize={13}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Details Cards */}
            <div className="space-y-4">
              {propertyTypeData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1321]/80 border border-[#d4af37]/10 hover:border-[#d4af37]/40 transition-all duration-300"
                >
                  <div 
                    className="w-3 h-12 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-lg font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-[#64748b]">buscas</span>
                      <span className="text-sm text-[#a0aec0]">{item.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Strategy Box */}
              <div className="strategy-box mt-6 p-5 rounded-xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
                <div className="flex items-start gap-3">
                  <span className="text-[#d4af37] text-xl">📊</span>
                  <div>
                    <h4 className="text-[#d4af37] font-semibold mb-1">Estratégia Recomendada</h4>
                    <p className="text-[#a0aec0] text-sm">
                      Concentrar esforços de divulgação em <span className="text-white font-medium">casas</span> na faixa de{' '}
                      <span className="text-white font-medium">R$ 1.200-2.000</span>, especialmente nos bairros{' '}
                      <span className="text-white font-medium">Santo Afonso</span> e <span className="text-white font-medium">Centro</span>, 
                      para atender 53% da demanda identificada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
