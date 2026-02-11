import React, { useState } from 'react';
import { Sparkles, Save, RotateCcw, MessageSquare, Play, Zap, BrainCircuit, User, Smartphone } from 'lucide-react';
import { AISettings, Tenant } from '../types';

interface AICalibrationProps {
  tenant: Tenant;
}

export const AICalibration: React.FC<AICalibrationProps> = ({ tenant }) => {
  const [settings, setSettings] = useState<AISettings>({
    modelName: 'GPT-4 Turbo (Real Estate Optimized)',
    creativity: 0.6,
    tone: 'consultative',
    responseLength: 'medium',
    systemPrompt: `Você é um consultor imobiliário sênior da ${tenant.name}. Seu objetivo é qualificar leads com empatia e levá-los ao agendamento de visita. Nunca fale preços exatos sem antes entender a necessidade.`
  });

  const [testMessage, setTestMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: `Olá! Sou a inteligência artificial da ${tenant.name}. Como posso ajudar você a encontrar o imóvel ideal hoje?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleTestSend = () => {
    if (!testMessage.trim()) return;
    
    // Add user message
    const newHistory = [...chatHistory, { role: 'user' as const, content: testMessage }];
    setChatHistory(newHistory);
    setTestMessage('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let response = "Entendo o que você busca. ";
      if (settings.tone === 'aggressive') response += "Temos oportunidades únicas que vão acabar hoje. Vamos agendar agora?";
      else if (settings.tone === 'friendly') response += "Que legal! Adoro essa região. Tenho algumas opções que são a sua cara! 😊";
      else response += "Baseado no seu perfil, seria interessante analisarmos imóveis no bairro Sul. O que acha de uma visita técnica?";
      
      setChatHistory([...newHistory, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
      
      {/* Left Panel: Configuration */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-brand-400" />
            Calibragem Neural
          </h2>
          <p className="text-gray-400 text-sm mt-1">Ajuste como o Copiloto interage com seus clientes.</p>
        </div>

        <div className="space-y-6">
          {/* Tone Selector */}
          <div className="glass-panel p-5 rounded-xl">
            <label className="text-sm font-semibold text-gray-300 mb-3 block">Tom de Voz</label>
            <div className="grid grid-cols-2 gap-3">
              {['professional', 'friendly', 'consultative', 'aggressive'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings({...settings, tone: t as any})}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all text-left ${
                    settings.tone === t 
                      ? 'bg-brand-500/20 border-brand-500 text-brand-100' 
                      : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className="capitalize block mb-1 text-white">{t}</span>
                  <span className="text-xs opacity-70 font-normal">
                    {t === 'aggressive' ? 'Foco total em fechamento rápido' : 
                     t === 'friendly' ? 'Uso de emojis e linguagem casual' : 
                     t === 'consultative' ? 'Perguntas estratégicas e guia' : 'Formal e direto'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Creativity Slider */}
          <div className="glass-panel p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
               <label className="text-sm font-semibold text-gray-300">Temperatura (Criatividade)</label>
               <span className="text-brand-400 font-mono text-sm">{settings.creativity * 100}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={settings.creativity}
              onChange={(e) => setSettings({...settings, creativity: parseFloat(e.target.value)})}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Preciso & Factual</span>
              <span>Criativo & Expansivo</span>
            </div>
          </div>

          {/* System Prompt */}
          <div className="glass-panel p-5 rounded-xl flex-1">
             <label className="text-sm font-semibold text-gray-300 mb-3 block flex items-center justify-between">
                Prompt do Sistema
                <span className="text-xs text-gray-500 font-normal">Instruções base para o modelo</span>
             </label>
             <textarea 
                className="w-full h-48 bg-dark-900/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:border-brand-500 transition-colors font-mono leading-relaxed resize-none"
                value={settings.systemPrompt}
                onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
             />
          </div>
          
          <div className="flex gap-4">
             <button className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 transition-all">
                <Save className="w-4 h-4" /> Salvar Configuração
             </button>
             <button className="px-4 py-3 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-xl border border-gray-700 transition-colors">
                <RotateCcw className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Simulator */}
      <div className="w-full lg:w-[400px] flex flex-col glass-panel rounded-2xl border-gray-700 overflow-hidden shadow-2xl">
        <div className="p-4 bg-dark-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                Simulador WhatsApp
            </h3>
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">Online</span>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 bg-black/40 p-4 overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center mr-2 border border-brand-500/30">
                            <Sparkles className="w-4 h-4 text-brand-400" />
                        </div>
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-br-none' 
                        : 'bg-dark-700 text-gray-200 rounded-bl-none border border-gray-600'
                    }`}>
                        {msg.content}
                    </div>
                     {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center ml-2">
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    )}
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                     <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center mr-2 border border-brand-500/30">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="bg-dark-700 p-3 rounded-2xl rounded-bl-none border border-gray-600 flex gap-1 items-center h-10">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-dark-800 border-t border-gray-700">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Digite como um cliente..." 
                    className="flex-1 bg-dark-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestSend()}
                />
                <button 
                    onClick={handleTestSend}
                    disabled={isTyping}
                    className="p-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-white transition-colors disabled:opacity-50"
                >
                    <Play className="w-5 h-5 fill-current" />
                </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Ambiente de teste seguro. Não envia mensagens reais.
            </p>
        </div>
      </div>
    </div>
  );
};