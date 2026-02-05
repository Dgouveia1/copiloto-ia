/**
 * ========================================
 * COPILOTO IA - DASHBOARD
 * Controller de Dashboard com Métricas e Gráficos
 * ========================================
 */

/**
 * Renderizar Dashboard
 */
function renderDashboard(data) {
    if (!data) data = appState.state.filteredAtendimentos;
    
    // Métricas de Topo (KPIs)
    calculateKPIMetrics(data);
    
    // Gráficos
    renderTemperatureChart(data);
    renderFunnelChart(data);
    
    // Tabelas
    renderPriorityTable(data);
    renderRecentTable(data);
}

/**
 * Calcular métricas KPI
 */
function calculateKPIMetrics(data) {
    const total = data.length;
    const quentes = data.filter(i => ['quente', 'muito_quente'].includes(i.temperatura)).length;
    const fupPendentes = data.filter(a => a.fup_pendente).length;
    const activeLeads = data.filter(i => i.busca_imovel).length;
    const taxa = total > 0 ? Math.round((activeLeads / total) * 100) : 0;

    animateValue('statTotal', total, false);
    animateValue('statQuentes', quentes, false);
    animateValue('statFUP', fupPendentes, false);
    
    const taxEl = document.getElementById('statTaxa');
    if (taxEl) {
        taxEl.textContent = taxa + '%';
    }
}

/**
 * Renderizar gráfico de temperatura
 */
function renderTemperatureChart(data) {
    const containers = ['tempDistribution', 'tempChartPage']
        .map(id => document.getElementById(id))
        .filter(el => el);
    
    if (containers.length === 0) return;

    // Contagem por temperatura
    const counts = {
        'muito_quente': 0,
        'quente': 0,
        'morna': 0,
        'morno': 0,
        'frio': 0,
        'muito_frio': 0
    };

    data.forEach(item => {
        let temp = item.temperatura;
        if (temp === 'morna') temp = 'morno'; // Agrupar
        if (counts[temp] !== undefined) counts[temp]++;
        else counts['frio']++;
    });

    const total = data.length || 1;
    const maxVal = Math.max(...Object.values(counts));

    // Configuração Visual
    const config = [
        { key: 'muito_quente', label: 'Muito Quente', color: '#ef4444' },
        { key: 'quente', label: 'Quente', color: '#f97316' },
        { key: 'morno', label: 'Morno', color: '#eab308' },
        { key: 'frio', label: 'Frio', color: '#3b82f6' }
    ];

    // Gerar HTML das Barras
    const barsHtml = config.map(c => {
        const count = counts[c.key] || 0;
        const pct = ((count / total) * 100).toFixed(1);
        const width = count > 0 ? Math.max((count / maxVal) * 100, 5) : 0;

        return `
            <div class="temp-item">
                <div class="temp-label">${c.label}</div>
                <div class="temp-bar-container">
                    <div class="temp-bar-bg">
                        <div class="temp-fill" style="width: 0%; background: ${c.color};" data-width="${width}%"></div>
                    </div>
                    <div class="temp-value">${count} (${pct}%)</div>
                </div>
            </div>
        `;
    }).join('');

    containers.forEach(container => {
        container.innerHTML = `<div class="temp-chart-wrapper">${barsHtml}</div>`;
        
        // Animar as barras
        setTimeout(() => {
            container.querySelectorAll('.temp-fill').forEach(el => {
                el.style.width = el.getAttribute('data-width');
            });
        }, 100);
    });
}

/**
 * Renderizar gráfico de funil
 */
function renderFunnelChart(data) {
    const containers = ['funnelChart', 'funnelChartPage']
        .map(id => document.getElementById(id))
        .filter(el => el);

    if (containers.length === 0) return;

    // Definir Etapas do Funil
    const stages = [
        { label: 'Total de Leads', count: data.length, color: '#64748b' },
        { label: 'Interessados', count: data.filter(i => i.busca_imovel).length, color: '#3b82f6' },
        { label: 'Em Negociação', count: data.filter(i => ['morno', 'morna', 'quente', 'muito_quente'].includes(i.temperatura)).length, color: '#eab308' },
        { label: 'Quentes/Fechamento', count: data.filter(i => ['quente', 'muito_quente'].includes(i.temperatura)).length, color: '#ef4444' }
    ];

    const maxCount = stages[0].count || 1;

    const funnelHtml = stages.map((stage, index) => {
        const widthPct = ((stage.count / maxCount) * 100).toFixed(0);
        const opacity = 0.4 + (index * 0.15);

        return `
            <div class="funnel-stage">
                <div class="funnel-label">${stage.label}</div>
                <div class="funnel-bar-container">
                    <div class="funnel-bar" style="width: 0%; background: ${stage.color}; opacity: ${opacity}" data-width="${widthPct}%">
                        <span class="funnel-value">${stage.count}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    containers.forEach(container => {
        container.innerHTML = `<div class="funnel-wrapper">${funnelHtml}</div>`;
        
        // Animar
        setTimeout(() => {
            container.querySelectorAll('.funnel-bar').forEach(el => {
                el.style.width = el.getAttribute('data-width');
            });
        }, 200);
    });
}

/**
 * Renderizar tabela de prioridades
 */
function renderPriorityTable(data) {
    const tbody = document.getElementById('priorityTable');
    if (!tbody) return;

    const priorityLeads = data
        .filter(item => item.valor_buscado > 0 || ['muito_quente', 'quente'].includes(item.temperatura))
        .sort((a, b) => b.valor_buscado - a.valor_buscado)
        .slice(0, 5);

    tbody.innerHTML = priorityLeads.map((lead, index) => `
        <tr onclick="openLeadDetails('${lead.telefone}')" class="fade-in-row" style="animation-delay: ${index * 0.1}s">
            <td style="font-weight: 700; color: var(--text-primary);">
                ${lead.valor_buscado > 0 ? formatters.currency(lead.valor_buscado) : '<span style="opacity:0.5">-</span>'}
            </td>
            <td>
                <div style="font-weight: 500;">${lead.nome || formatters.phone(lead.telefone)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${lead.caracteristicas_imovel ? lead.caracteristicas_imovel.substring(0, 30) + '...' : 'Interesse Geral'}</div>
            </td>
            <td>${formatters.temperaturaBadge(lead.temperatura)}</td>
            <td>
                ${lead.fup_pendente
                    ? `<span style="color: #ef4444; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                        <span style="width:6px; height:6px; background:#ef4444; border-radius:50%; display:inline-block; animation: pulse 2s infinite;"></span>
                        Ação Necessária
                       </span>`
                    : `<span style="color: var(--color-success); font-size: 0.75rem;">Em dia</span>`}
            </td>
        </tr>
    `).join('');
}

/**
 * Renderizar tabela de atendimentos recentes
 */
function renderRecentTable(data) {
    const tbody = document.getElementById('recentTable');
    if (!tbody) return;

    const recentData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);

    tbody.innerHTML = recentData.map((lead, index) => `
        <tr onclick="openLeadDetails('${lead.telefone}')" class="fade-in-row" style="animation-delay: ${index * 0.05}s">
            <td>
                <div style="font-weight: 500;">${formatters.phone(lead.telefone)}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">${formatters.timeSince(lead.created_at)}</div>
            </td>
            <td>
                ${lead.busca_locacao ? '<span class="tag-type">Locação</span>' : ''}
                ${lead.busca_compra ? '<span class="tag-type">Compra</span>' : ''}
                ${!lead.busca_locacao && !lead.busca_compra ? '<span class="tag-type" style="opacity:0.5">Outro</span>' : ''}
            </td>
            <td>${formatters.temperaturaBadge(lead.temperatura)}</td>
            <td style="text-align: center;">
                ${lead.fup_pendente
                    ? `<span style="color:#ef4444; font-size: 1.2rem;">⚠️</span>`
                    : `<span style="color:#10b981">✓</span>`}
            </td>
            <td class="truncate" style="max-width: 250px; color: var(--text-secondary); font-size: 0.8rem;">
                ${escapeHtml(lead.resumo)}
            </td>
        </tr>
    `).join('');
}

/**
 * Renderizar tabela de atendimentos completa
 */
function renderAtendimentosTable(data) {
    const tbody = document.getElementById('atendimentosTable');
    if (!tbody) return;

    const { currentPage, itemsPerPage } = appState.state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    tbody.innerHTML = paginatedData.map(lead => `
        <tr onclick="openLeadDetails('${lead.telefone}')">
            <td>${formatters.date(lead.created_at)}</td>
            <td>${formatters.phone(lead.telefone)}</td>
            <td>${lead.busca_imovel ? '<span class="badge badge--success">Sim</span>' : '<span class="badge badge--danger">Não</span>'}</td>
            <td>${formatters.temperaturaBadge(lead.temperatura)}</td>
            <td>${lead.fup_pendente ? '<span class="badge badge--warning">Pendente</span>' : '<span class="badge badge--success">OK</span>'}</td>
            <td>${formatters.currency(lead.valor_buscado)}</td>
            <td class="truncate" style="max-width: 300px;">${escapeHtml(lead.resumo)}</td>
        </tr>
    `).join('');

    // Atualizar info de paginação
    document.getElementById('showingStart').textContent = data.length > 0 ? startIndex + 1 : 0;
    document.getElementById('showingEnd').textContent = Math.min(endIndex, data.length);
    document.getElementById('totalItems').textContent = data.length;

    // Renderizar paginação
    renderPagination(data.length, itemsPerPage, currentPage);
}

/**
 * Renderizar paginação
 */
function renderPagination(totalItems, itemsPerPage, currentPage) {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let html = '';
    
    // Botão anterior
    html += `<button class="pagination-btn" onclick="appState.setPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="appState.setPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="pagination-btn" style="cursor: default;">...</span>`;
        }
    }
    
    // Botão próximo
    html += `<button class="pagination-btn" onclick="appState.setPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    
    container.innerHTML = html;
}

/**
 * Renderizar métricas do funil
 */
function renderFunnelMetrics(data) {
    const container = document.getElementById('funnelMetrics');
    if (!container) return;

    const etapas = [
        { id: 'novo', label: 'Novos Leads', color: 'blue' },
        { id: 'contato', label: 'Em Contato', color: 'cyan' },
        { id: 'visita', label: 'Visita Agendada', color: 'amber' },
        { id: 'proposta', label: 'Proposta', color: 'purple' },
        { id: 'fechamento', label: 'Fechado', color: 'green' }
    ];

    container.innerHTML = etapas.map(etapa => {
        const count = data.filter(a => (a.etapa_funil || 'novo') === etapa.id).length;
        const total = data.length || 1;
        const pct = ((count / total) * 100).toFixed(1);

        return `
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon ${etapa.color}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${count}</div>
                <div class="stat-label">${etapa.label} (${pct}%)</div>
            </div>
        `;
    }).join('');
}

/**
 * Renderizar tabela de temperaturas
 */
function renderTempTable(data) {
    const tbody = document.getElementById('tempTable');
    if (!tbody) return;

    const temps = ['muito_quente', 'quente', 'morna', 'morno', 'frio', 'muito_frio'];
    const labels = {
        'muito_quente': 'Muito Quente',
        'quente': 'Quente',
        'morna': 'Morna',
        'morno': 'Morno',
        'frio': 'Frio',
        'muito_frio': 'Muito Frio'
    };

    const total = data.length || 1;

    tbody.innerHTML = temps.map(temp => {
        const items = data.filter(a => a.temperatura === temp);
        const count = items.length;
        const pct = ((count / total) * 100).toFixed(1);
        const valorTotal = items.reduce((sum, item) => sum + (item.valor_buscado || 0), 0);

        return `
            <tr>
                <td>${formatters.temperaturaBadge(temp)}</td>
                <td>${count}</td>
                <td>${pct}%</td>
                <td>${formatters.currency(valorTotal)}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="filterByTemperatura('${temp}')">
                        Ver Leads
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Animação de contador
 */
function animateValue(id, end, isCurrency = false) {
    const obj = document.getElementById(id);
    if (!obj) return;
    if (end === 0) {
        obj.textContent = isCurrency ? 'R$ 0,00' : '0';
        return;
    }

    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * end);
        
        obj.textContent = isCurrency
            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(current)
            : current;
            
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            obj.textContent = isCurrency
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(end)
                : end;
        }
    };
    
    requestAnimationFrame(step);
}

/**
 * Filtrar por temperatura
 */
function filterByTemperatura(temp) {
    appState.setFilters({ temperatura: temp });
    navigateTo('atendimentos');
}

/**
 * Abrir detalhes do lead
 */
function openLeadDetails(telefone) {
    const lead = appState.state.atendimentos.find(a => a.telefone === telefone);
    if (lead) {
        appState.openDrawer(lead);
    }
}

// Tornar funções globais
window.renderDashboard = renderDashboard;
window.renderAtendimentosTable = renderAtendimentosTable;
window.renderFunnelMetrics = renderFunnelMetrics;
window.renderTempTable = renderTempTable;
window.animateValue = animateValue;
window.filterByTemperatura = filterByTemperatura;
window.openLeadDetails = openLeadDetails;
