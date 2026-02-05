/**
 * ========================================
 * COPILOTO IA - SERVICES
 * Serviços de Dados e Utilitários
 * ========================================
 */

/**
 * Serviço de Atendimentos
 */
class AtendimentosService {
    constructor() {
        this.data = [];
    }
    
    /**
     * Carregar dados
     */
    async loadData() {
        return this.data;
    }
    
    /**
     * Buscar atendimento por ID (telefone)
     */
    async getById(id) {
        return this.data.find(a => a.telefone === id);
    }
    
    /**
     * Marcar FUP como resolvido
     */
    async markFUPResolved(id) {
        const atendimento = this.data.find(a => a.telefone === id);
        if (atendimento) {
            atendimento.fup_pendente = false;
            // Atualizar estado global
            appState.setState({
                atendimentos: [...this.data],
                filteredAtendimentos: [...this.data]
            });
            appState.applyFilters();
        }
        return atendimento;
    }
    
    /**
     * Criar follow-up
     */
    async createFollowUp(id, data) {
        return { success: true, id: Date.now() };
    }
    
    /**
     * Obter estatísticas
     */
    async getStats() {
        const total = this.data.length;
        const quentes = this.data.filter(a => ['muito_quente', 'quente'].includes(a.temperatura)).length;
        const fupPendentes = this.data.filter(a => a.fup_pendente).length;
        const buscamImovel = this.data.filter(a => a.busca_imovel).length;
        const taxa = total > 0 ? Math.round((buscamImovel / total) * 100) : 0;
        
        return {
            total,
            quentes,
            fupPendentes,
            taxaInteresse: taxa
        };
    }
    
    /**
     * Adicionar novo lead
     */
    async addLead(leadData) {
        const newLead = {
            id: 'lead-' + Date.now(),
            nome: leadData.nome || '',
            telefone: leadData.telefone,
            temperatura: leadData.temperatura || 'frio',
            etapa_funil: leadData.etapa_funil || 'novo',
            ultimo_contato: new Date().toISOString(),
            created_at: new Date().toISOString(),
            busca_imovel: leadData.busca_imovel || false,
            busca_locacao: leadData.busca_locacao || false,
            busca_compra: leadData.busca_compra || false,
            caracteristicas_imovel: leadData.caracteristicas_imovel || '',
            valor_buscado: leadData.valor_buscado || 0,
            resumo: leadData.resumo || '',
            fup_pendente: leadData.fup_pendente || false
        };
        
        this.data.push(newLead);
        
        // Atualizar estado global
        appState.setState({
            atendimentos: [...this.data],
            filteredAtendimentos: [...this.data]
        });
        appState.applyFilters();
        
        return newLead;
    }
    
    /**
     * Atualizar lead existente
     */
    async updateLead(telefone, updates) {
        const lead = this.data.find(a => a.telefone === telefone);
        if (lead) {
            Object.assign(lead, updates);
            lead.ultimo_contato = new Date().toISOString();
            
            // Atualizar estado global
            appState.setState({
                atendimentos: [...this.data],
                filteredAtendimentos: [...this.data]
            });
            appState.applyFilters();
            
            return lead;
        }
        return null;
    }
    
    /**
     * Mover lead para outra etapa do funil
     */
    async moveLead(telefone, novaEtapa) {
        const lead = this.data.find(a => a.telefone === telefone);
        if (lead) {
            lead.etapa_funil = novaEtapa;
            lead.ultimo_contato = new Date().toISOString();
            
            appState.setState({
                atendimentos: [...this.data],
                filteredAtendimentos: [...this.data]
            });
            appState.applyFilters();
            
            return lead;
        }
        return null;
    }
}

// Instância do serviço
const atendimentosService = new AtendimentosService();

// Tornar global
window.atendimentosService = atendimentosService;

/**
 * Utilitários de formatação
 */
const formatters = {
    phone: (phone) => {
        if (!phone) return 'N/A';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    },
    
    date: (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    },
    
    currency: (value) => {
        if (!value || value === 0) return '-';
        return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    
    temperaturaBadge: (temp) => {
        const badges = {
            'muito_quente': '<span class="badge badge-muito-quente">Muito Quente</span>',
            'quente': '<span class="badge badge-quente">Quente</span>',
            'morna': '<span class="badge badge-morna">Morna</span>',
            'morno': '<span class="badge badge-morno">Morno</span>',
            'frio': '<span class="badge badge-frio">Frio</span>',
            'muito_frio': '<span class="badge badge-muito-frio">Muito Frio</span>'
        };
        return badges[temp] || `<span class="badge">${temp}</span>`;
    },
    
    temperaturaIcon: (temp) => {
        const icons = {
            'muito_quente': '🔥',
            'quente': '🥵',
            'morna': '🌡️',
            'morno': '😐',
            'frio': '❄️',
            'muito_frio': '🧊'
        };
        return icons[temp] || '❄️';
    },
    
    temperaturaColor: (temp) => {
        const colors = {
            'muito_quente': '#ef4444',
            'quente': '#f97316',
            'morna': '#f59e0b',
            'morno': '#3b82f6',
            'frio': '#64748b',
            'muito_frio': '#94a3b8'
        };
        return colors[temp] || '#64748b';
    },
    
    etapaLabel: (etapa) => {
        const labels = {
            'novo': 'Novo',
            'contato': 'Em Contato',
            'visita': 'Visita Agendada',
            'proposta': 'Proposta',
            'fechamento': 'Fechado'
        };
        return labels[etapa] || etapa;
    },
    
    etapaColor: (etapa) => {
        const colors = {
            'novo': '#64748b',
            'contato': '#3b82f6',
            'visita': '#f59e0b',
            'proposta': '#f97316',
            'fechamento': '#10b981'
        };
        return colors[etapa] || '#64748b';
    },
    
    timeSince: (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' anos atrás';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' meses atrás';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' dias atrás';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' horas atrás';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutos atrás';
        
        return 'Agora';
    }
};

// Tornar global
window.formatters = formatters;

/**
 * Debounce helper
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.debounce = debounce;

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.escapeHtml = escapeHtml;
