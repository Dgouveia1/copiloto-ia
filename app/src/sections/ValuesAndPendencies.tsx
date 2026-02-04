import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

const valueStats = [
  { label: 'Valor Médio', value: 1660, icon: <DollarSign size={20} />, color: '#d4af37' },
  { label: 'Valor Mediano', value: 1400, icon: <TrendingUp size={20} />, color: '#10b981' },
  { label: 'Mínimo', value: 400, icon: <TrendingDown size={20} />, color: '#3b82f6' },
  { label: 'Máximo', value: 3800, icon: <DollarSign size={20} />, color: '#8b5cf6' },
];

const distributionData = [
  { range: 'Até R$ 800', percentage: 13, color: '#3b82f6' },
  { range: 'R$ 801-1.200', percentage: 27, color: '#06b6d4' },
  { range: 'R$ 1.201-2.000', percentage: 27, color: '#d4af37' },
  { range: 'R$ 2.001-3.000', percentage: 20, color: '#f59e0b' },
  { range: 'Acima R$ 3.000', percentage: 13, color: '#ef4444' },
];

const pendenciesData = [
  { 
    icon: <Clock size={28} />, 
    value: 28, 
    percentage: 24.8, 
    label: 'Follow-ups Pendentes', 
    description: 'Leads aguardando retorno. Cada follow-up é uma chance de conversão que não pode ser perdida.',
    color: '#f59e0b',
    urgency: 'OPORTUNIDADES IMEDIATAS',
  },
  { 
    icon: <AlertTriangle size={28} />, 
    value: 6, 
    percentage: 5.3, 
    label: 'Tarefas Pendentes', 
    description: 'Documentos pendentes, confirmações de visita, envio de valores. Priorizar para desbloquear negócios.',
    color: '#ef4444',
    urgency: 'AÇÕES ESPECÍFICAS',
  },
  { 
    icon: <CheckCircle size={28} />, 
    value: 85, 
    percentage: 75.2, 
    label: 'Sem Pendência', 
    description: 'Leads já qualificados ou em espera. Manter nutrição para aquecimento futuro.',
    color: '#10b981',
    urgency: 'ATENDIMENTOS CONCLUÍDOS',
  },
];

export default function ValuesAndPendencies() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(valueStats.map(() => 0));
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação dos títulos
      gsap.fromTo('.values-title',
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

      // Animação dos cards de valores
      valueStats.forEach((_, index) => {
        gsap.fromTo(`.value-card-${index}`,
          { rotateY: 90, opacity: 0 },
          {
            rotateY: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.values-grid',
              start: 'top 85%',
            },
          }
        );
      });

      // Animação de contagem dos valores
      ScrollTrigger.create({
        trigger: '.values-grid',
        start: 'top 85%',
        onEnter: () => {
          valueStats.forEach((item, index) => {
            gsap.to({ val: 0 }, {
              val: item.value,
              duration: 1.5,
              delay: index * 0.1 + 0.3,
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

      // Animação das barras de distribuição
      gsap.fromTo('.distribution-bar',
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.distribution-grid',
            start: 'top 85%',
          },
        }
      );

      // Animação do alerta
      gsap.fromTo('.alert-box',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.distribution-grid',
            start: 'top 85%',
          },
        }
      );

      // Animação dos cards de pendências
      pendenciesData.forEach((_, index) => {
        gsap.fromTo(`.pendency-card-${index}`,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.pendencies-grid',
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Values Analysis Section */}
        <div>
          <div className="values-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Análise de Valores Buscados
            </h2>
            <p className="text-[#a0aec0]">Faixas de preço mais buscadas</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stats Cards */}
            <div className="values-grid grid grid-cols-2 gap-4">
              {valueStats.map((item, index) => (
                <div
                  key={item.label}
                  className={`value-card-${index} p-5 rounded-xl bg-[#0d1321]/80 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group`}
                  style={{ 
                    opacity: 0,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                    R$ {animatedValues[index].toLocaleString()}
                  </div>
                  <div className="text-sm text-[#a0aec0]">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Distribution Bars */}
            <div className="distribution-grid space-y-4">
              {distributionData.map((item) => (
                <div key={item.range} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a0aec0]">{item.range}</span>
                    <span className="text-white font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-[#040812] rounded-full overflow-hidden">
                    <div
                      className="distribution-bar h-full rounded-full transition-all duration-500 hover:opacity-80 origin-left"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Alert Box */}
              <div className="alert-box mt-6 p-4 rounded-xl bg-gradient-to-r from-[#ef4444]/10 to-transparent border border-[#ef4444]/30 flex items-start gap-3">
                <AlertTriangle size={20} className="text-[#ef4444] flex-shrink-0 mt-0.5" />
                <p className="text-[#a0aec0] text-sm">
                  <span className="text-[#ef4444] font-semibold">ALERTA:</span> Apenas{' '}
                  <span className="text-white font-medium">15 de 56 clientes</span> (26.8%) que buscam imóvel informaram valor. 
                  Necessário implementar script de qualificação para capturar orçamento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pendencies Section */}
        <div>
          <div className="values-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Gestão de Pendências
            </h2>
            <p className="text-[#a0aec0]">Follow-ups e tarefas</p>
          </div>

          <div className="pendencies-grid grid md:grid-cols-3 gap-6">
            {pendenciesData.map((item, index) => (
              <div
                key={item.label}
                className={`pendency-card-${index} relative p-6 rounded-2xl bg-[#0d1321]/80 border hover:border-opacity-60 transition-all duration-300 group cursor-pointer`}
                style={{ 
                  opacity: 0,
                  borderColor: `${item.color}40`,
                  boxShadow: index === 0 ? `0 0 30px ${item.color}20` : 'none',
                }}
              >
                {/* Urgency badge */}
                <div 
                  className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  {item.urgency}
                </div>

                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 30px ${item.color}20` }}
                />

                <div className="relative z-10 pt-4">
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
                      {item.value}
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

                {/* Pulse animation for urgent items */}
                {index === 0 && (
                  <div 
                    className="absolute inset-0 rounded-2xl animate-pulse-gold pointer-events-none"
                    style={{ boxShadow: `inset 0 0 20px ${item.color}30` }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-[#f59e0b]/10 to-transparent border border-[#f59e0b]/30">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#f59e0b] font-semibold mb-1">Prazo Recomendado</h4>
                <p className="text-[#a0aec0]">
                  Realizar todos os <span className="text-white font-medium">28 follow-ups pendentes</span> nas próximas{' '}
                  <span className="text-white font-medium">48 horas</span> para maximizar taxa de conversão enquanto o interesse está fresco.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
