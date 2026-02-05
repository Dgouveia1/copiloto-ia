/**
 * ========================================
 * COPILOTO IA - STATE
 * Gerenciamento de Estado Centralizado
 * ========================================
 */

class AppState {
    constructor() {
        this.state = {
            // Dados
            atendimentos: [],
            filteredAtendimentos: [],
            
            // Paginação
            currentPage: 1,
            itemsPerPage: 10,
            
            // Filtros
            filters: {
                search: '',
                temperatura: '',
                fup: '',
                busca: '',
                valorMin: '',
                valorMax: '',
                tipoBusca: '',
                dataRange: ''
            },
            
            // Ordenação
            sortBy: 'data',
            sortOrder: 'desc',
            
            // UI State
            currentPageView: 'dashboard',
            drawerOpen: false,
            drawerData: null,
            modalOpen: false,
            modalType: null,
            modalData: null,
            
            // Customização
            customization: {
                companyName: 'Kiko Bim Imóveis',
                primaryColor: '#d4af37',
                secondaryColor: '#c0c0c0'
            },
            
            // Tenant atual
            currentTenant: null,
            
            // Listeners
            listeners: []
        };
        
        // Carregar estado do localStorage
        this.loadFromStorage();
    }
    
    /**
     * Subscribe para mudanças de estado
     */
    subscribe(callback) {
        this.state.listeners.push(callback);
        return () => {
            this.state.listeners = this.state.listeners.filter(l => l !== callback);
        };
    }
    
    /**
     * Notificar listeners sobre mudanças
     */
    notify() {
        this.state.listeners.forEach(listener => listener(this.state));
        this.saveToStorage();
    }
    
    /**
     * Atualizar estado
     */
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }
    
    /**
     * Atualizar filtros
     */
    setFilters(filters) {
        this.setState({
            filters: { ...this.state.filters, ...filters },
            currentPage: 1
        });
        this.applyFilters();
    }
    
    /**
     * Definir ordenação
     */
    setSorting(sortBy) {
        if (this.state.sortBy === sortBy) {
            this.setState({
                sortOrder: this.state.sortOrder === 'asc' ? 'desc' : 'asc'
            });
        } else {
            this.setState({
                sortBy: sortBy,
                sortOrder: 'desc'
            });
        }
        this.applyFilters();
    }
    
    /**
     * Aplicar filtros aos dados
     */
    applyFilters() {
        let filtered = [...this.state.atendimentos];
        const { filters, sortBy, sortOrder } = this.state;
        
        // Filtro de busca
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(a => 
                a.telefone.includes(search) || 
                (a.nome && a.nome.toLowerCase().includes(search)) ||
                a.resumo.toLowerCase().includes(search) ||
                (a.caracteristicas_imovel && a.caracteristicas_imovel.toLowerCase().includes(search))
            );
        }
        
        // Filtro de temperatura
        if (filters.temperatura) {
            filtered = filtered.filter(a => a.temperatura === filters.temperatura);
        }
        
        // Filtro de FUP
        if (filters.fup !== '') {
            filtered = filtered.filter(a => a.fup_pendente.toString() === filters.fup);
        }
        
        // Filtro de busca imóvel
        if (filters.busca !== '') {
            filtered = filtered.filter(a => a.busca_imovel.toString() === filters.busca);
        }
        
        // Filtro de valor
        if (filters.valorMin) {
            filtered = filtered.filter(a => a.valor_buscado >= parseFloat(filters.valorMin));
        }
        if (filters.valorMax) {
            filtered = filtered.filter(a => a.valor_buscado <= parseFloat(filters.valorMax) || a.valor_buscado === 0);
        }
        
        // Filtro de tipo de busca
        if (filters.tipoBusca === 'locacao') {
            filtered = filtered.filter(a => a.busca_locacao);
        } else if (filters.tipoBusca === 'compra') {
            filtered = filtered.filter(a => a.busca_compra);
        }
        
        // Filtro de data
        if (filters.dataRange) {
            const now = new Date();
            const daysAgo = parseInt(filters.dataRange);
            const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(a => new Date(a.created_at) >= cutoffDate);
        }
        
        // Ordenação
        filtered.sort((a, b) => {
            let aVal, bVal;
            
            switch (sortBy) {
                case 'temperatura':
                    const tempOrder = { 'muito_quente': 6, 'quente': 5, 'morna': 4, 'morno': 3, 'frio': 2, 'muito_frio': 1 };
                    aVal = tempOrder[a.temperatura] || 0;
                    bVal = tempOrder[b.temperatura] || 0;
                    break;
                case 'fup':
                    aVal = a.fup_pendente ? 1 : 0;
                    bVal = b.fup_pendente ? 1 : 0;
                    break;
                case 'data':
                    aVal = new Date(a.created_at).getTime();
                    bVal = new Date(b.created_at).getTime();
                    break;
                case 'valor':
                    aVal = a.valor_buscado || 0;
                    bVal = b.valor_buscado || 0;
                    break;
                default:
                    aVal = new Date(a.created_at).getTime();
                    bVal = new Date(b.created_at).getTime();
            }
            
            if (sortOrder === 'asc') {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });
        
        this.setState({ filteredAtendimentos: filtered });
    }
    
    /**
     * Mudar página
     */
    setPage(page) {
        const totalPages = Math.ceil(this.state.filteredAtendimentos.length / this.state.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.setState({ currentPage: page });
        }
    }
    
    /**
     * Abrir drawer
     */
    openDrawer(atendimento) {
        this.setState({
            drawerOpen: true,
            drawerData: atendimento
        });
    }
    
    /**
     * Fechar drawer
     */
    closeDrawer() {
        this.setState({
            drawerOpen: false,
            drawerData: null
        });
    }
    
    /**
     * Abrir modal
     */
    openModal(type, data = null) {
        this.setState({
            modalOpen: true,
            modalType: type,
            modalData: data
        });
    }
    
    /**
     * Fechar modal
     */
    closeModal() {
        this.setState({
            modalOpen: false,
            modalType: null,
            modalData: null
        });
    }
    
    /**
     * Salvar no localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('copiloto-filters', JSON.stringify(this.state.filters));
            localStorage.setItem('copiloto-customization', JSON.stringify(this.state.customization));
            localStorage.setItem('copiloto-sort', JSON.stringify({ sortBy: this.state.sortBy, sortOrder: this.state.sortOrder }));
        } catch (e) {
            console.warn('Não foi possível salvar no localStorage:', e);
        }
    }
    
    /**
     * Carregar do localStorage
     */
    loadFromStorage() {
        try {
            const savedFilters = localStorage.getItem('copiloto-filters');
            if (savedFilters) {
                this.state.filters = { ...this.state.filters, ...JSON.parse(savedFilters) };
            }
            
            const savedCustomization = localStorage.getItem('copiloto-customization');
            if (savedCustomization) {
                this.state.customization = { ...this.state.customization, ...JSON.parse(savedCustomization) };
            }
            
            const savedSort = localStorage.getItem('copiloto-sort');
            if (savedSort) {
                const sort = JSON.parse(savedSort);
                this.state.sortBy = sort.sortBy || this.state.sortBy;
                this.state.sortOrder = sort.sortOrder || this.state.sortOrder;
            }
        } catch (e) {
            console.warn('Não foi possível carregar do localStorage:', e);
        }
    }
    
    /**
     * Aplicar preset de filtros
     */
    applyPreset(presetName) {
        switch (presetName) {
            case 'quentes-fup':
                this.setFilters({
                    temperatura: '',
                    fup: 'true',
                    busca: 'true'
                });
                this.setState({ sortBy: 'temperatura', sortOrder: 'desc' });
                break;
            case 'oportunidades-reais':
                this.setFilters({
                    busca: 'true',
                    temperatura: '',
                    fup: ''
                });
                this.setState({ sortBy: 'temperatura', sortOrder: 'desc' });
                break;
            case 'fup-pendentes':
                this.setFilters({
                    fup: 'true',
                    temperatura: '',
                    busca: ''
                });
                this.setState({ sortBy: 'data', sortOrder: 'desc' });
                break;
            case 'reset':
                this.setFilters({
                    search: '',
                    temperatura: '',
                    fup: '',
                    busca: '',
                    valorMin: '',
                    valorMax: '',
                    tipoBusca: '',
                    dataRange: ''
                });
                this.setState({ sortBy: 'data', sortOrder: 'desc' });
                break;
        }
    }
    
    /**
     * Obter tenant atual da URL
     */
    getTenantFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const clientSlug = urlParams.get('cliente');
        return TENANTS[clientSlug] || TENANTS['default'];
    }
    
    /**
     * Atualizar tenant
     */
    setTenant(tenant) {
        this.setState({ currentTenant: tenant });
    }
}

// Instância singleton
const appState = new AppState();

// Tornar global para acesso em outros módulos
window.appState = appState;
