export type Temperature = 'muito_quente' | 'quente' | 'morna' | 'morno' | 'frio' | 'muito_frio';
export type FunnelStage = 'novo' | 'contato' | 'visita' | 'proposta' | 'fechamento';

export interface Lead {
  id?: string;
  created_at: string;
  telefone: string;
  nome: string;
  busca_imovel: boolean;
  busca_locacao: boolean;
  busca_compra: boolean;
  caracteristicas_imovel: string;
  valor_buscado: number;
  temperatura: Temperature;
  resumo: string;
  fup_pendente: boolean;
  etapa_funil: FunnelStage;
  ultimo_contato?: string;
}

export interface Tenant {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  slug: string;
}

export interface FilterState {
  search: string;
  temperatura: string;
  fup: string;
}

export interface DashboardMetrics {
  total: number;
  hot: number;
  fupPending: number;
  conversionRate: number;
}

// New Types for AI and WhatsApp
export interface AISettings {
  modelName: string;
  creativity: number; // 0 to 1
  tone: 'professional' | 'friendly' | 'aggressive' | 'consultative';
  responseLength: 'short' | 'medium' | 'long';
  systemPrompt: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
