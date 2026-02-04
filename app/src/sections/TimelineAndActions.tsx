import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Phone, MessageSquare, FileText, Home, Users, CheckCircle, Target, TrendingUp, Zap } from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    period: 'IMEDIATO',
    timeframe: '0-24 horas',
    color: '#ef4444',
    actions: [
      { icon: <Phone size={18} />, text: 'Contatar 9 Leads Quentes', description: 'Priorizar leads em temperatura quente/muito quente para fechamento imediato' },
      { icon: <MessageSquare size={18} />, text: 'Realizar 28 Follow-ups', description: 'Contatar todos os leads com follow-up pendente nas próximas 48h' },
    ],
  },
  {
    period: 'CURTO PRAZO',
    timeframe: '1-3 dias',
    color: '#f59e0b',
    actions: [
      { icon: <FileText size={18} />, text: 'Implementar Script de Qualificação', description: 'Criar roteiro para capturar valor buscado e características do imóvel' },
      { icon: <Users size={18} />, text: 'Campanha para Leads Mornos', description: 'Criar campanha específica para aquecer 34 leads em temperatura morna' },
    ],
  },
  {
    period: 'MÉDIO PRAZO',
    timeframe: '1 semana',
    color: '#3b82f6',
    actions: [
      { icon: <Home size={18} />, text: 'Priorizar Divulgação de Casas', description: 'Focar em casas na faixa R$ 1.200-2.000, especialmente em Santo Afonso e Centro' },
      { icon: <CheckCircle size={18} />, text: 'Revisar Processo de Qualificação', description: 'Avaliar e otimizar o fluxo de captação de informações dos leads' },
    ],
  },
];

const strategicActions = [
  { number: 1, title: 'Priorizar Leads Quentes', description: 'Contatar imediatamente os 9 leads quentes/muito quentes com potencial de fechamento rápido.', urgency: 'URGENTE', timeframe: '0-24h', color: '#ef4444' },
  { number: 2, title: 'Follow-up Estratégico', description: 'Realizar os 28 follow-ups pendentes nas próximas 48h. Cada follow-up é uma oportunidade de conversão.', urgency: 'URGENTE', timeframe: '48h', color: '#ef4444' },
  { number: 3, title: 'Aquecer Leads Mornos', description: 'Criar campanha específica para os 34 leads em temperatura morna. Enviar conteúdo relevante e novos imóveis.', urgency: 'IMPORTANTE', timeframe: '3-5 dias', color: '#f59e0b' },
  { number: 4, title: 'Focar em Casas', description: 'Priorizar divulgação de casas para alugar, que representam 53% da demanda.', urgency: 'IMPORTANTE', timeframe: '1 semana', color: '#f59e0b' },
  { number: 5, title: 'Qualificar Melhor', description: 'Implementar script de qualificação para capturar valor buscado e características.', urgency: 'IMPORTANTE', timeframe: '1 semana', color: '#3b82f6' },
  { number: 6, title: 'Faixa de Valor', description: 'Concentrar esforços em imóveis entre R$ 1.200-2.000, que concentra a maior demanda.', urgency: 'IMPORTANTE', timeframe: 'Contínuo', color: '#10b981' },
];

const goals = [
  { icon: <Target size={20} />, label: 'Converter Leads Quentes', target: '70%', color: '#ef4444' },
  { icon: <TrendingUp size={20} />, label: 'Aquecer Leads Mornos', target: '40%', color: '#f59e0b' },
  { icon: <Zap size={20} />, label: 'Reduzir FUPs Pendentes', target: '<10%', color: '#10b981' },
];

export default function TimelineAndActions() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { customization } = useCustomization();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animação do título da timeline
      gsap.fromTo('.timeline-title',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top 80%',
          },
        }
      );

      // Animação da linha do tempo
      gsap.fromTo('.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 80%',
          },
        }
      );

      // Animação dos períodos
      timelineData.forEach((_, index) => {
        gsap.fromTo(`.timeline-period-${index}`,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.timeline-container',
              start: 'top 80%',
            },
          }
        );

        gsap.fromTo(`.timeline-cards-${index} .action-card`,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            delay: index * 0.2 + 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.timeline-container',
              start: 'top 80%',
            },
          }
        );
      });

      // Animação do plano estratégico
      gsap.fromTo('.strategy-title',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.strategy-section',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo('.strategy-card',
        { rotateX: -90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.strategy-grid',
            start: 'top 85%',
          },
        }
      );

      // Animação do summary
      gsap.fromTo('.summary-box',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.summary-box',
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="section-padding"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Timeline Section */}
        <div className="timeline-section">
          <div className="timeline-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Timeline de Ações Prioritárias
            </h2>
            <p className="text-[#a0aec0]">Cronograma prioritário</p>
          </div>

          <div className="timeline-container relative">
            {/* Timeline Line */}
            <div 
              className="timeline-line absolute left-6 md:left-8 top-0 bottom-0 w-0.5 origin-top"
              style={{ 
                background: `linear-gradient(to bottom, #ef4444, #f59e0b, #3b82f6)`,
              }}
            />

            {/* Timeline Periods */}
            <div className="space-y-8">
              {timelineData.map((period, periodIndex) => (
                <div key={period.period} className={`timeline-period-${periodIndex} relative pl-16 md:pl-20`}>
                  {/* Timeline Dot */}
                  <div 
                    className="absolute left-3 md:left-5 w-6 h-6 rounded-full border-4 flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#040812',
                      borderColor: period.color,
                      top: '0.5rem',
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: period.color }}
                    />
                  </div>

                  {/* Period Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-1">
                      <Clock size={16} style={{ color: period.color }} />
                      <span 
                        className="text-sm font-bold px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${period.color}20`,
                          color: period.color,
                        }}
                      >
                        {period.period}
                      </span>
                    </div>
                    <span className="text-[#64748b] text-sm">{period.timeframe}</span>
                  </div>

                  {/* Action Cards */}
                  <div className={`timeline-cards-${periodIndex} grid md:grid-cols-2 gap-4`}>
                    {period.actions.map((action, actionIndex) => (
                      <div
                        key={actionIndex}
                        className="action-card p-4 rounded-xl bg-[#0d1321]/80 border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${period.color}20`, color: period.color }}
                          >
                            {action.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">{action.text}</h4>
                            <p className="text-[#64748b] text-sm">{action.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Plan Section */}
        <div className="strategy-section">
          <div className="strategy-title mb-10">
            <div 
              className="w-16 h-1 mb-4"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Plano de Ação Estratégico
            </h2>
            <p className="text-[#a0aec0]">Estratégias para conversão</p>
          </div>

          <div className="strategy-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategicActions.map((action) => (
              <div
                key={action.number}
                className="strategy-card relative p-5 rounded-xl bg-[#0d1321]/80 border hover:border-opacity-60 transition-all duration-300 group hover:-translate-y-2"
                style={{ 
                  opacity: 0,
                  borderColor: `${action.color}40`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Number Badge */}
                <div 
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ 
                    backgroundColor: action.color,
                    color: '#040812',
                  }}
                >
                  {action.number}
                </div>

                {/* Urgency Badge */}
                <div 
                  className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold"
                  style={{ 
                    backgroundColor: `${action.color}20`,
                    color: action.color,
                  }}
                >
                  {action.urgency}
                </div>

                <div className="pt-4">
                  <h4 className="text-white font-semibold mb-2 pr-16">{action.title}</h4>
                  <p className="text-[#64748b] text-sm mb-3">{action.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: action.color }} />
                    <span className="text-sm" style={{ color: action.color }}>{action.timeframe}</span>
                  </div>
                </div>

                {/* Hover glow */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 20px ${action.color}20` }}
                />
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="summary-box mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#d4af37]/10 to-transparent border border-[#d4af37]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gold-gradient mb-2">Foco na Execução</h3>
                <p className="text-[#a0aec0]">
                  Priorizar ações imediatas para converter leads quentes, aquecer leads mornos e otimizar o funil de atendimento.
                </p>
              </div>

              {/* Goals */}
              <div className="flex flex-wrap gap-4">
                {goals.map((goal, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: `${goal.color}15` }}
                  >
                    <span style={{ color: goal.color }}>{goal.icon}</span>
                    <div>
                      <div className="text-xs text-[#64748b]">{goal.label}</div>
                      <div className="font-bold" style={{ color: goal.color }}>{goal.target}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Numbers */}
            <div className="mt-6 pt-6 border-t border-[#d4af37]/20 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ef4444]">9</div>
                <div className="text-sm text-[#64748b]">Leads Quentes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f59e0b]">28</div>
                <div className="text-sm text-[#64748b]">FUPs Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3b82f6]">34</div>
                <div className="text-sm text-[#64748b]">Leads Mornos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
