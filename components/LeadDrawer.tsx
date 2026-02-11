import React from 'react';
import { X, Phone, Calendar, Thermometer, AlertCircle, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { Lead } from '../types';

interface LeadDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    primaryColor: string;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({ isOpen, onClose, lead, primaryColor }) => {
    if (!lead) return null;

    const tempColors: Record<string, string> = {
        'muito_quente': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        'quente': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'morna': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'morno': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'frio': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        'muito_frio': 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    };

    const getTempLabel = (t: string) => t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-dark-900 border-l border-gray-800 z-[70] transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-800 flex items-start justify-between bg-dark-800">
                        <div>
                            <h2 className="text-xl font-bold text-white">{lead.nome || 'Lead sem nome'}</h2>
                            <p className="text-sm text-gray-400 font-mono mt-1">{lead.telefone}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* AI Summary Card */}
                        <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 blur-2xl -mr-10 -mt-10"></div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300">Resumo da IA</h3>
                            </div>
                            <p className="text-sm text-indigo-100 leading-relaxed">
                                {lead.resumo}
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <div className="text-xs text-gray-500 mb-1">Temperatura</div>
                                <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${tempColors[lead.temperatura] || 'text-gray-500'}`}>
                                    <Thermometer className="w-3 h-3 mr-1.5" />
                                    {getTempLabel(lead.temperatura)}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                                <div className="text-xs text-gray-500 mb-1">Valor Buscado</div>
                                <div className="text-lg font-bold text-white" style={{ color: primaryColor }}>
                                    {lead.valor_buscado > 0 ? `R$ ${lead.valor_buscado.toLocaleString('pt-BR')}` : '-'}
                                </div>
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Detalhes</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm text-gray-500">Data Criação</span>
                                    <span className="text-sm text-gray-300 font-mono">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm text-gray-500">Busca Imóvel</span>
                                    <span className={`text-sm font-medium ${lead.busca_imovel ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {lead.busca_imovel ? 'Sim' : 'Não'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-800">
                                    <span className="text-sm text-gray-500">FUP Pendente</span>
                                    <span className={`text-sm font-medium flex items-center gap-2 ${lead.fup_pendente ? 'text-amber-400' : 'text-gray-400'}`}>
                                        {lead.fup_pendente ? (
                                            <><AlertCircle className="w-4 h-4" /> Sim</>
                                        ) : (
                                            <><CheckCircle2 className="w-4 h-4" /> Resolvido</>
                                        )}
                                    </span>
                                </div>
                                <div className="py-2">
                                    <span className="text-sm text-gray-500 block mb-2">Interesse</span>
                                    <span className="text-sm text-gray-300 bg-gray-800 px-3 py-2 rounded-lg block">
                                        {lead.caracteristicas_imovel || 'Não especificado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-gray-800 bg-dark-800 flex flex-col gap-3">
                        <button
                            className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-emerald-900/20"
                            style={{ backgroundColor: '#25D366' }} // WhatsApp Green
                            onClick={() => window.open(`https://wa.me/55${lead.telefone}`, '_blank')}
                        >
                            <MessageSquare className="w-5 h-5" />
                            Abrir no WhatsApp
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium text-sm transition-colors">
                                Editar Lead
                            </button>
                            <button
                                className="py-3 rounded-lg text-dark-900 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Resolver FUP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};