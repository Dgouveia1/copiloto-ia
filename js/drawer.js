/**
 * ========================================
 * COPILOTO IA - DRAWER
 * Componente Drawer Lateral
 * ========================================
 */

class DrawerComponent {
    constructor(containerId, overlayId, state) {
        this.container = document.getElementById(containerId);
        this.overlay = document.getElementById(overlayId);
        this.state = state;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listener para mudanças de estado
        this.state.subscribe((state) => {
            this.render(state);
        });
        
        // Fechar ao clicar no overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    appState.closeDrawer();
                }
            });
        }
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.state.drawerOpen) {
                appState.closeDrawer();
            }
        });
    }
    
    render(state) {
        const { drawerOpen, drawerData } = state;
        
        if (!this.overlay || !this.container) return;
        
        if (drawerOpen && drawerData) {
            this.overlay.classList.add('active');
            this.container.classList.add('active');
            this.renderContent(drawerData);
        } else {
            this.overlay.classList.remove('active');
            this.container.classList.remove('active');
        }
    }
    
    renderContent(atendimento) {
        const body = this.container.querySelector('.drawer-body');
        const footer = this.container.querySelector('.drawer-footer');
        
        if (!body) return;
        
        body.innerHTML = `
            <div class="drawer-section">
                <div class="drawer-section-title">Informações do Cliente</div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Nome</span>
                    <span class="drawer-info-value">${atendimento.nome || 'N/A'}</span>
                </div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Telefone</span>
                    <span class="drawer-info-value">${formatters.phone(atendimento.telefone)}</span>
                </div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Data do Atendimento</span>
                    <span class="drawer-info-value">${formatters.date(atendimento.created_at)}</span>
                </div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Busca Imóvel</span>
                    <span class="drawer-info-value">${atendimento.busca_imovel ? '<span class="badge badge--success">Sim</span>' : '<span class="badge badge--danger">Não</span>'}</span>
                </div>
                ${atendimento.busca_imovel ? `
                    <div class="drawer-info-item">
                        <span class="drawer-info-label">Tipo de Busca</span>
                        <span class="drawer-info-value">
                            ${atendimento.busca_locacao ? '<span class="badge badge--info">Locação</span>' : ''}
                            ${atendimento.busca_compra ? '<span class="badge badge--info">Compra</span>' : ''}
                        </span>
                    </div>
                ` : ''}
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Temperatura</span>
                    <span class="drawer-info-value">${formatters.temperaturaBadge(atendimento.temperatura)}</span>
                </div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">Etapa do Funil</span>
                    <span class="drawer-info-value">
                        <span class="badge" style="background: ${formatters.etapaColor(atendimento.etapa_funil)}20; color: ${formatters.etapaColor(atendimento.etapa_funil)}">
                            ${formatters.etapaLabel(atendimento.etapa_funil || 'novo')}
                        </span>
                    </span>
                </div>
                <div class="drawer-info-item">
                    <span class="drawer-info-label">FUP Pendente</span>
                    <span class="drawer-info-value">${atendimento.fup_pendente ? '<span class="badge badge--warning">Sim</span>' : '<span class="badge badge--success">Não</span>'}</span>
                </div>
                ${atendimento.valor_buscado > 0 ? `
                    <div class="drawer-info-item">
                        <span class="drawer-info-label">Valor Buscado</span>
                        <span class="drawer-info-value" style="color: var(--primary-accent); font-weight: 700;">${formatters.currency(atendimento.valor_buscado)}</span>
                    </div>
                ` : ''}
                ${atendimento.caracteristicas_imovel ? `
                    <div class="drawer-info-item">
                        <span class="drawer-info-label">Características</span>
                        <span class="drawer-info-value">${escapeHtml(atendimento.caracteristicas_imovel)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="drawer-section">
                <div class="drawer-section-title">Resumo da Conversa</div>
                <div class="drawer-resumo">${escapeHtml(atendimento.resumo)}</div>
            </div>
        `;
        
        // Renderizar ações no footer
        if (footer) {
            footer.innerHTML = `
                ${atendimento.fup_pendente ? `
                    <button class="btn btn-primary drawer-action-btn" onclick="markFUPResolved('${atendimento.telefone}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Marcar FUP como Resolvido
                    </button>
                ` : ''}
                <button class="btn btn-secondary drawer-action-btn" onclick="openWhatsApp('${atendimento.telefone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    Abrir WhatsApp
                </button>
                <button class="btn btn-secondary drawer-action-btn" onclick="createFollowUp('${atendimento.telefone}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Criar Follow-up
                </button>
            `;
        }
    }
}

// Instância global do drawer
let drawerComponent;

function initDrawer() {
    drawerComponent = new DrawerComponent('drawer', 'drawerOverlay', appState);
}

// Funções auxiliares
async function markFUPResolved(telefone) {
    await atendimentosService.markFUPResolved(telefone);
    appState.closeDrawer();
    showNotification('FUP marcado como resolvido!', 'success');
    renderDashboard();
}

function openWhatsApp(telefone) {
    const cleaned = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleaned}`, '_blank');
}

function createFollowUp(telefone) {
    appState.closeDrawer();
    showNotification('Follow-up criado com sucesso!', 'success');
}

// Tornar global
window.DrawerComponent = DrawerComponent;
window.initDrawer = initDrawer;
window.markFUPResolved = markFUPResolved;
window.openWhatsApp = openWhatsApp;
window.createFollowUp = createFollowUp;
