/**
 * ========================================
 * COPILOTO IA - FILTERS
 * Componente de Filtros
 * ========================================
 */

class FiltersComponent {
    constructor(state) {
        this.state = state;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Search com debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const debouncedSearch = debounce((value) => {
                appState.setFilters({ search: value });
                renderAtendimentosTable(appState.state.filteredAtendimentos);
            }, 300);
            
            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
        
        // Filtros
        const filterTemperatura = document.getElementById('filterTemperatura');
        const filterFUP = document.getElementById('filterFUP');
        const filterBusca = document.getElementById('filterBusca');
        
        if (filterTemperatura) {
            filterTemperatura.addEventListener('change', (e) => {
                appState.setFilters({ temperatura: e.target.value });
                renderAtendimentosTable(appState.state.filteredAtendimentos);
            });
        }
        
        if (filterFUP) {
            filterFUP.addEventListener('change', (e) => {
                appState.setFilters({ fup: e.target.value });
                renderAtendimentosTable(appState.state.filteredAtendimentos);
            });
        }
        
        if (filterBusca) {
            filterBusca.addEventListener('change', (e) => {
                appState.setFilters({ busca: e.target.value });
                renderAtendimentosTable(appState.state.filteredAtendimentos);
            });
        }
        
        // Listener para atualizar valores dos inputs quando estado mudar
        this.state.subscribe((state) => {
            this.updateFilterInputs(state.filters);
        });
    }
    
    updateFilterInputs(filters) {
        const searchInput = document.getElementById('searchInput');
        const filterTemperatura = document.getElementById('filterTemperatura');
        const filterFUP = document.getElementById('filterFUP');
        const filterBusca = document.getElementById('filterBusca');
        
        if (searchInput) searchInput.value = filters.search || '';
        if (filterTemperatura) filterTemperatura.value = filters.temperatura || '';
        if (filterFUP) filterFUP.value = filters.fup || '';
        if (filterBusca) filterBusca.value = filters.busca || '';
    }
}

// Instância global
let filtersComponent;

function initFilters() {
    filtersComponent = new FiltersComponent(appState);
}

// Tornar global
window.FiltersComponent = FiltersComponent;
window.initFilters = initFilters;
