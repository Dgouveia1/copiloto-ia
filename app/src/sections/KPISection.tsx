import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Flame, AlertCircle, ClipboardList, DollarSign, BarChart3, Thermometer } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

interface KPICardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  sublabel?: string;
  delay: number;
  color?: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

function KPICard({ icon, value, label, sublabel, delay, color = '#d4af37', isCurrency = false, isPercentage = false }: KPICardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (typeof value === 'number' || isCurrency) {
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.to({ val: 0 }, {
              val: numericValue,
              duration: 1.5,
              delay: delay + 0.2,
              ease: 'expo.out',
              onUpdate: function() {
                setDisplayValue(this.targets()[0].val);
              },
            });
          },
        });
      }
    }, cardRef);

    return () => ctx.revert();
  }, [value, delay, numericValue]);

  const formatValue = () => {
    if (isCurrency) {
      return `R$ ${displayValue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (isPercentage) {
      return `${value}%`;
    }
    return Math.round(displayValue).toLocaleString();
  };

  return (
    <div
      ref={cardRef}
      className="relative p-6 rounded-2xl bg-[#0d1321]/80 border border-[#d4af37]/20 backdrop-blur-sm group hover:border-[#d4af37]/50 transition-all duration-300 hover:-translate-y-2"
      style={{ opacity: 0 }}
    >
      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-115 group-hover:rotate-[5deg]"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>

      {/* Value */}
      <div 
        className="text-3xl font-bold mb-1 transition-all duration-300 group-hover:drop-shadow-lg"
        style={{ 
          color,
          textShadow: '0 0 20px transparent',
        }}
      >
        {typeof value === 'string' && !isCurrency ? value : formatValue()}
      </div>

      {/* Label */}
      <div className="text-white font-medium mb-1">{label}</div>
      
      {/* Sublabel */}
      {sublabel && (
        <div className="text-[#64748b] text-sm">{sublabel}</div>
      )}

      {/* Hover glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${color}15` }}
      />
    </div>
  );
}

export default function KPISection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.kpi-title',
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const kpisRow1 = [
    { icon: <TrendingUp size={24} />, value: 113, label: 'Total Atendimentos', sublabel: 'Volume total processado', delay: 0.1, color: undefined, isCurrency: false, isPercentage: false },
    { icon: <BarChart3 size={24} />, value: 49.6, label: 'Taxa de Interesse', sublabel: 'Atendimentos com interesse declarado', delay: 0.2, color: undefined, isCurrency: false, isPercentage: true },
    { icon: <Flame size={24} />, value: 9, label: 'Leads Quentes', sublabel: 'Leads em temperatura quente/muito quente', delay: 0.3, color: '#ef4444', isCurrency: false, isPercentage: false },
    { icon: <AlertCircle size={24} />, value: 28, label: 'FUPs Pendentes', sublabel: 'Follow-ups pendentes (24.8%)', delay: 0.4, color: '#f59e0b', isCurrency: false, isPercentage: false },
  ];

  const kpisRow2 = [
    { icon: <ClipboardList size={24} />, value: 6, label: 'Tarefas Pendentes', sublabel: 'Ações específicas pendentes', delay: 0.5, color: undefined, isCurrency: false, isPercentage: false },
    { icon: <DollarSign size={24} />, value: 1660, label: 'Valor Médio', sublabel: 'Valor médio buscado pelos clientes', delay: 0.6, color: undefined, isCurrency: true, isPercentage: false },
    { icon: <DollarSign size={24} />, value: 1400, label: 'Valor Mediano', sublabel: 'Valor que representa melhor a demanda', delay: 0.7, color: undefined, isCurrency: true, isPercentage: false },
    { icon: <Thermometer size={24} />, value: 34, label: 'Leads Mornos', sublabel: 'Leads em temperatura morna (30.1%)', delay: 0.8, color: '#3b82f6', isCurrency: false, isPercentage: false },
  ];

  return (
    <section
      ref={sectionRef}
      id="kpis"
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="kpi-title mb-10">
          <div 
            className="w-16 h-1 mb-4"
            style={{ backgroundColor: customization.primaryColor }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            KPIs Principais
          </h2>
          <p className="text-[#a0aec0]">Indicadores-chave de performance</p>
        </div>

        {/* KPIs Grid - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpisRow1.map((kpi, index) => (
            <KPICard
              key={`row1-${index}`}
              icon={kpi.icon}
              value={kpi.value}
              label={kpi.label}
              sublabel={kpi.sublabel}
              delay={kpi.delay}
              color={kpi.color || customization.primaryColor}
              isCurrency={kpi.isCurrency}
              isPercentage={kpi.isPercentage}
            />
          ))}
        </div>

        {/* KPIs Grid - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpisRow2.map((kpi, index) => (
            <KPICard
              key={`row2-${index}`}
              icon={kpi.icon}
              value={kpi.value}
              label={kpi.label}
              sublabel={kpi.sublabel}
              delay={kpi.delay}
              color={kpi.color || customization.primaryColor}
              isCurrency={kpi.isCurrency}
              isPercentage={kpi.isPercentage}
            />
          ))}
        </div>

        {/* Highlight Metric */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#f59e0b]/10 to-transparent border border-[#f59e0b]/30">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-[#f59e0b]" />
            </div>
            <div>
              <h4 className="text-[#f59e0b] font-semibold mb-1">Métrica Destaque</h4>
              <p className="text-[#a0aec0]">
                Os <span className="text-white font-semibold">28 follow-ups pendentes</span> representam oportunidades imediatas de conversão. 
                Priorizar o contato desses leads nas próximas 48h pode aumentar significativamente a taxa de fechamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
