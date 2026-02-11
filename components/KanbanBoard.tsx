import React from 'react';
import { Calendar, DollarSign, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Lead, FunnelStage } from '../types';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  primaryColor: string;
}

const COLUMNS: { id: FunnelStage; label: string; color: string }[] = [
  { id: 'novo', label: 'Novos', color: 'border-blue-500' },
  { id: 'contato', label: 'Em Contato', color: 'border-yellow-500' },
  { id: 'visita', label: 'Visita Agendada', color: 'border-purple-500' },
  { id: 'proposta', label: 'Proposta', color: 'border-orange-500' },
  { id: 'fechamento', label: 'Fechamento', color: 'border-emerald-500' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onLeadClick, primaryColor }) => {
  return (
    <div className="h-full overflow-x-auto p-6">
      <div className="flex h-full gap-6 min-w-[1200px]">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter(l => l.etapa_funil === col.id);
          return (
            <div key={col.id} className="flex-1 flex flex-col min-w-[280px] max-w-[320px]">
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
                <h3 className="font-bold text-gray-200 text-sm uppercase tracking-wide">
                  {col.label}
                </h3>
                <span className="bg-dark-800 text-gray-400 px-2 py-0.5 rounded text-xs font-mono">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {colLeads.map((lead) => (
                  <div 
                    key={lead.telefone}
                    onClick={() => onLeadClick(lead)}
                    className="bg-dark-800 hover:bg-dark-700 border border-gray-700 hover:border-gray-500 rounded-xl p-4 cursor-pointer transition-all shadow-lg group relative"
                  >
                    {lead.fup_pendente && (
                      <div className="absolute -top-1 -right-1">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider 
                            ${lead.temperatura.includes('quente') ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {lead.temperatura.replace('_', ' ')}
                        </span>
                        <button className="text-gray-600 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <h4 className="text-white font-semibold mb-1 truncate">{lead.nome}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{lead.resumo}</p>

                    <div className="flex items-center gap-3 pt-3 border-t border-gray-700/50">
                        {lead.valor_buscado > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-300">
                                <DollarSign className="w-3 h-3 text-gray-500" />
                                {lead.valor_buscado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.created_at).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};