import { Lead, Tenant } from './types';

export const TENANTS: Record<string, Tenant> = {
  'default': {
      id: 'default',
      name: 'Kiko Bim Imóveis',
      primaryColor: '#d4af37', // Gold
      secondaryColor: '#1e293b',
      logoText: 'KB',
      slug: 'kiko-bim'
  },
  'investt': {
      id: 'investt',
      name: 'Investt Imóveis',
      primaryColor: '#3b82f6', // Blue
      secondaryColor: '#eff6ff',
      logoText: 'IV',
      slug: 'investt' 
  },
  'lux': {
      id: 'lux',
      name: 'Lux Properties',
      primaryColor: '#10b981', // Emerald
      secondaryColor: '#ecfdf5',
      logoText: 'LP',
      slug: 'lux'
  }
};

export const MOCK_LEADS: Lead[] = [
    { created_at: "2026-02-03 18:00:40", telefone: "11986458562", nome: "Maria Silva", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "Apartamento 2 quartos", valor_buscado: 2500, temperatura: "morno", resumo: "Cliente interessado em locação, discutindo valores de aluguel, condomínio e IPTU.", fup_pendente: false, etapa_funil: "contato" },
    { created_at: "2026-02-03 18:00:55", telefone: "13955493094", nome: "Ana Paula", busca_imovel: false, busca_locacao: false, busca_compra: true, caracteristicas_imovel: "Casa alto padrão", valor_buscado: 1500000, temperatura: "muito_quente", resumo: "Cliente já está na fase final do processo, enviou contrato assinado.", fup_pendente: false, etapa_funil: "fechamento" },
    { created_at: "2026-02-03 18:01:09", telefone: "14997306200", nome: "Fernanda Lima", busca_imovel: true, busca_locacao: false, busca_compra: false, caracteristicas_imovel: "apartamento 254", valor_buscado: 0, temperatura: "frio", resumo: "Cliente interessado em apartamento 254, ainda não respondeu sobre visita.", fup_pendente: true, etapa_funil: "novo" },
    { created_at: "2026-02-03 18:01:31", telefone: "17988190257", nome: "Marcos Almeida", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "kitnet região central", valor_buscado: 800, temperatura: "morno", resumo: "Cliente busca kitnet. Perguntou sobre envio de documentação digital.", fup_pendente: false, etapa_funil: "contato" },
    { created_at: "2026-02-03 18:02:08", telefone: "17991390757", nome: "Gabriel Mendes", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "Casa condomínio", valor_buscado: 4500, temperatura: "quente", resumo: "Enviou endereço do imóvel e confirmou dados. Escolheu assinatura digital.", fup_pendente: true, etapa_funil: "proposta" },
    { created_at: "2026-02-03 18:04:07", telefone: "17996374894", nome: "Beatriz Lima", busca_imovel: true, busca_locacao: false, busca_compra: true, caracteristicas_imovel: "casa 2 quartos varanda", valor_buscado: 380000, temperatura: "quente", resumo: "Interesse em casa específica à venda. Agendamento pendente.", fup_pendente: true, etapa_funil: "visita" },
    { created_at: "2026-02-03 18:06:13", telefone: "17997351038", nome: "Alice Martins", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "apartamento centro", valor_buscado: 1200, temperatura: "muito_quente", resumo: "Interessada em fechar aluguel. Aguardando valores finais.", fup_pendente: true, etapa_funil: "proposta" },
    { created_at: "2026-02-03 18:07:47", telefone: "17997658606", nome: "Sarah Rocha", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "Comercial", valor_buscado: 2400, temperatura: "muito_quente", resumo: "Aceitou proposta com carência. Acertando contrato.", fup_pendente: false, etapa_funil: "fechamento" },
    { created_at: "2026-02-03 18:08:29", telefone: "18996631558", nome: "Yuri Pereira", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "salão comercial", valor_buscado: 3500, temperatura: "quente", resumo: "Busca salão comercial, enviou dados para simulação.", fup_pendente: false, etapa_funil: "proposta" },
    { created_at: "2026-02-03 18:05:16", telefone: "17997134561", nome: "Rafaela Costa", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "kitnet", valor_buscado: 700, temperatura: "morno", resumo: "Interesse em visitar kitnet. Dúvidas sobre garantia.", fup_pendente: false, etapa_funil: "visita" },
    { created_at: "2026-02-03 18:09:05", telefone: "19995639961", nome: "Elisa Costa", busca_imovel: true, busca_locacao: false, busca_compra: true, caracteristicas_imovel: "casa bairro nobre", valor_buscado: 350000, temperatura: "morno", resumo: "Interesse em casa, sem detalhes. Follow-up necessário.", fup_pendente: true, etapa_funil: "contato" },
    { created_at: "2026-02-03 18:02:27", telefone: "17991849107", nome: "Valentina Rocha", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "casa padrão", valor_buscado: 2200, temperatura: "morno", resumo: "Solicitou info sobre documentos e garantias.", fup_pendente: true, etapa_funil: "contato" },
    { created_at: "2026-02-03 18:04:44", telefone: "17996783478", nome: "Miguel Lima", busca_imovel: true, busca_locacao: false, busca_compra: true, caracteristicas_imovel: "casas diversas", valor_buscado: 420000, temperatura: "morno", resumo: "Quer ver duas casas. Pergunta sobre horário almoço.", fup_pendente: false, etapa_funil: "visita" },
    { created_at: "2026-02-03 18:06:53", telefone: "17997475948", nome: "Isis Souza", busca_imovel: true, busca_locacao: true, busca_compra: false, caracteristicas_imovel: "casa cód 1431", valor_buscado: 2800, temperatura: "quente", resumo: "Visita agendada para amanhã na casa 1431.", fup_pendente: true, etapa_funil: "visita" },
    { created_at: "2026-02-03 18:01:03", telefone: "14996250907", nome: "Carlos Oliveira", busca_imovel: false, busca_locacao: false, busca_compra: false, caracteristicas_imovel: "", valor_buscado: 0, temperatura: "frio", resumo: "Apenas dúvidas sobre regras de condomínio.", fup_pendente: false, etapa_funil: "novo" }
];