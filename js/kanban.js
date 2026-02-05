/**
 * ========================================
 * COPILOTO IA - KANBAN
 * Componente Kanban para Funil de Conversão
 * ========================================
 */

class KanbanComponent {
    constructor(containerId, state) {
        this.container = document.getElementById(containerId);
        this.state = state;
        this.draggedCard = null;
    }
    
    render() {
        if (!this.container) return;
        
        const atendimentos = this.state.filteredAtendimentos.length > 0 
            ? this.state.filteredAtendimentos 
            : this.state.atendimentos;
        
        const etapas = [
            { id: 'novo', label: 'Novos', color: '#64748b' },
            { id: 'contato', label: 'Em Contato', color: '#3b82f6' },
            { id: 'visita', label: 'Visita Agendada', color: '#f59e0b' },
            { id: 'proposta', label: 'Proposta', color: '#f97316' },
            { id: 'fechamento', label: 'Fechado', color: '#10b981' }
        ];
        
        this.container.innerHTML = `
            <div class="kanban-board">
                ${etapas.map(etapa => {
                    const items = atendimentos.filter(a => (a.etapa_funil || 'novo') === etapa.id);
                    return `
                        <div class="kanban-column" data-etapa="${etapa.id}">
                            <div class="kanban-column-header" style="border-top: 3px solid ${etapa.color}">
                                <h3 class="kanban-column-title">${etapa.label}</h3>
                                <span class="kanban-column-count">${items.length}</span>
                            </div>
                            <div class="kanban-column-body" data-etapa="${etapa.id}">
                                ${items.length > 0 ? items.map(item => this.renderCard(item, etapa.id)).join('') : '<div class="kanban-empty">Nenhum lead nesta etapa</div>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Adicionar event listeners para drag & drop
        this.setupDragAndDrop();
    }
    
    renderCard(item, etapaAtual) {
        const temperaturaColor = formatters.temperaturaColor(item.temperatura);
        const nome = item.nome || formatters.phone(item.telefone);
        const ultimoContato = item.ultimo_contato || item.created_at;
        
        return `
            <div class="kanban-card" 
                 draggable="true" 
                 data-id="${item.telefone}"
                 data-etapa="${etapaAtual}"
                 onclick="openLeadDetails('${item.telefone}')">
                <div class="kanban-card-header">
                    <div class="kanban-card-temp" style="background: ${temperaturaColor}20; color: ${temperaturaColor}">
                        ${formatters.temperaturaIcon(item.temperatura)} ${this.getTemperaturaLabel(item.temperatura)}
                    </div>
                    ${item.fup_pendente ? '<span class="kanban-card-fup" title="FUP Pendente">⏰</span>' : ''}
                </div>
                <div class="kanban-card-body">
                    <h4 class="kanban-card-name">${escapeHtml(nome)}</h4>
                    <p class="kanban-card-phone">${formatters.phone(item.telefone)}</p>
                    ${item.valor_buscado > 0 ? `<p class="kanban-card-value">${formatters.currency(item.valor_buscado)}</p>` : ''}
                    ${ultimoContato ? `<p class="kanban-card-date">${formatters.timeSince(ultimoContato)}</p>` : ''}
                </div>
                <div class="kanban-card-actions" onclick="event.stopPropagation()">
                    <button class="btn btn-ghost btn-sm" onclick="openLeadDetails('${item.telefone}')" title="Ver detalhes">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="openWhatsApp('${item.telefone}')" title="WhatsApp">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupDragAndDrop() {
        const cards = this.container.querySelectorAll('.kanban-card');
        const columns = this.container.querySelectorAll('.kanban-column-body');
        
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                this.draggedCard = card;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.id);
                card.classList.add('dragging');
            });
            
            card.addEventListener('dragend', (e) => {
                card.classList.remove('dragging');
                this.draggedCard = null;
            });
        });
        
        columns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                column.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', (e) => {
                column.classList.remove('drag-over');
            });
            
            column.addEventListener('drop', async (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                
                const itemId = e.dataTransfer.getData('text/plain');
                const novaEtapa = column.dataset.etapa;
                
                // Atualizar etapa do lead
                await atendimentosService.moveLead(itemId, novaEtapa);
                
                // Re-renderizar
                this.render();
                
                // Mostrar notificação
                showNotification(`Lead movido para ${formatters.etapaLabel(novaEtapa)}`, 'success');
            });
        });
    }
    
    getTemperaturaLabel(temp) {
        const labels = {
            'muito_quente': 'Muito Quente',
            'quente': 'Quente',
            'morna': 'Morna',
            'morno': 'Morno',
            'frio': 'Frio',
            'muito_frio': 'Muito Frio'
        };
        return labels[temp] || temp;
    }
}

// Instância global do kanban
let kanbanComponent;

function initKanban() {
    kanbanComponent = new KanbanComponent('kanbanContainer', appState.state);
    kanbanComponent.render();
}

function renderKanban() {
    if (kanbanComponent) {
        kanbanComponent.render();
    }
}

// Tornar global
window.KanbanComponent = KanbanComponent;
window.initKanban = initKanban;
window.renderKanban = renderKanban;
