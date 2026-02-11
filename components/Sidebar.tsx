import React from 'react';
import { LayoutDashboard, Users, MessageSquare, BarChart3, Settings, User, LogOut, Hexagon, Sparkles, Smartphone } from 'lucide-react';
import { Tenant } from '../types';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  tenant: Tenant;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, tenant }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', label: 'Gestão de Leads', icon: Users },
    { id: 'funnel', label: 'Relatórios', icon: BarChart3 },
  ];

  const systemItems = [
    { id: 'whatsapp', label: 'Conexão WhatsApp', icon: Smartphone },
    { id: 'ai-calibration', label: 'Calibrar IA', icon: Sparkles },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-gray-800 flex flex-col z-50">
      {/* Header / Branding */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800 gap-3">
        <div 
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 shadow-lg"
        >
            <Hexagon className="w-6 h-6" strokeWidth={2.5} style={{ color: tenant.primaryColor }} />
        </div>
        <div>
            <h1 className="font-bold text-white tracking-wide text-sm">{tenant.name}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Copiloto 2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        
        <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operacional</div>
            {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                currentView === item.id
                    ? 'bg-gray-800/80 text-white shadow-lg shadow-black/20 border border-gray-700/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                <item.icon 
                    className={`w-4 h-4 transition-colors ${currentView === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} 
                    style={currentView === item.id ? { color: tenant.primaryColor } : {}}
                />
                {item.label}
            </button>
            ))}
        </div>

        <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inteligência & Sistema</div>
            {systemItems.map((item) => (
            <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                currentView === item.id
                    ? 'bg-gray-800/80 text-white shadow-lg shadow-black/20 border border-gray-700/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                <item.icon 
                    className={`w-4 h-4 transition-colors ${currentView === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} 
                    style={currentView === item.id ? { color: tenant.primaryColor } : {}}
                />
                {item.label}
            </button>
            ))}
        </div>
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-gray-800 bg-black/20">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-gray-600 shadow-inner">
                <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@kikobim.com</p>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
            </button>
        </div>
      </div>
    </aside>
  );
};