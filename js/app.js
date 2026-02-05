/**
 * ========================================
 * COPILOTO IA - APP
 * Aplicação Principal
 * ========================================
 */

// ========================================
// INICIALIZAÇÃO
// ========================================

async function initApp() {
    // Criar partículas na tela de loading
    createParticles();

    // Simular carregamento
    await simulateLoading();

    // Detectar tenant da URL
    const tenant = appState.getTenantFromURL();
    appState.setTenant(tenant);

    // Aplicar cores do tenant
    applyTenantColors(tenant);

    // Atualizar branding
    updateBranding(tenant);

    // Carregar dados
    await loadData();

    // Inicializar componentes
    initDrawer();
    initFilters();
    initKanban();

    // Renderizar dashboard inicial
    renderDashboard();

    // Configurar navegação
    setupNavigation();

    // Configurar eventos globais
    setupGlobalEvents();

    // Esconder loading
    hideLoadingScreen();

    // Mostrar app
    document.getElementById('app').classList.add('loaded');

    console.log('Copiloto IA iniciado com sucesso!');
}

// ========================================
// LOADING SCREEN
// ========================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        container.appendChild(particle);
    }
}

function simulateLoading() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

// ========================================
// TENANT & BRANDING
// ========================================

function applyTenantColors(tenant) {
    if (!tenant) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-accent', tenant.primaryColor);
    root.style.setProperty('--primary-accent-light', adjustColor(tenant.primaryColor, 20));
    root.style.setProperty('--primary-accent-dark', adjustColor(tenant.primaryColor, -20));
}

function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function updateBranding(tenant) {
    if (!tenant) return;

    // Logo e Nome da empresa
    const companyNameDisplay = document.getElementById('companyNameDisplay');
    const clientLogoImg = document.getElementById('clientLogoImg');
    const clientInfo = document.getElementById('clientInfo');
    const logoSeparator = document.querySelector('.logo-separator');

    if (clientLogoImg && tenant.logoUrl) {
        clientLogoImg.src = tenant.logoUrl;
        clientLogoImg.style.display = 'block';
        if (logoSeparator) logoSeparator.style.display = 'block';
    } else if (clientLogoImg) {
        clientLogoImg.style.display = 'none';
        if (logoSeparator) logoSeparator.style.display = 'none';
    }

    if (companyNameDisplay) {
        companyNameDisplay.textContent = tenant.name;
    }

    // Avatar do usuário
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.textContent = tenant.logoText;
    }

    // Perfil
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        profileAvatar.textContent = tenant.logoText;
    }

    // Configurações
    const configCompanyName = document.getElementById('configCompanyName');
    if (configCompanyName) {
        configCompanyName.value = tenant.name;
    }
}

function saveBranding() {
    const companyName = document.getElementById('configCompanyName').value;
    const activeColor = document.querySelector('.color-option.active');
    const color = activeColor ? activeColor.dataset.color : '#d4af37';

    appState.setState({
        customization: {
            companyName: companyName,
            primaryColor: color
        }
    });

    applyTenantColors({
        primaryColor: color,
        secondaryColor: '#1e293b',
        logoText: companyName.substring(0, 2).toUpperCase(),
        name: companyName
    });

    updateBranding({
        name: companyName,
        primaryColor: color,
        logoText: companyName.substring(0, 2).toUpperCase()
    });

    showNotification('Configurações salvas com sucesso!', 'success');
}

// ========================================
// CARREGAMENTO DE DADOS
// ========================================

async function loadData() {
    // Carregar dados do data.js
    const data = window.atendimentosData || [];

    // Atualizar estado
    appState.setState({
        atendimentos: data,
        filteredAtendimentos: data
    });

    // Aplicar filtros iniciais
    appState.applyFilters();

    // Atualizar serviço
    atendimentosService.data = data;

    return data;
}

// ========================================
// NAVEGAÇÃO
// ========================================

function setupNavigation() {
    // Menu toggle (mobile)
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('open');
        });
    }

    // Nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);

            // Fechar sidebar no mobile
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('open');
        });
    });
}

function navigateTo(page) {
    // Atualizar estado
    appState.setState({ currentPageView: page });

    // Atualizar título da página
    const pageTitles = {
        'dashboard': 'Visão Geral',
        'atendimentos': 'Todos os Atendimentos',
        'leads': 'Gestão de Leads',
        'funil': 'Análise de Funil',
        'temperatura': 'Mapa de Temperatura',
        'relatorios': 'Central de Relatórios',
        'configuracoes': 'Configurações',
        'perfil': 'Meu Perfil'
    };

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = pageTitles[page] || page;
    }

    // Atualizar nav items ativos
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    // Mostrar/esconder páginas
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(page + 'Page');
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Renderizar conteúdo específico da página
    switch (page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'atendimentos':
            renderAtendimentosTable(appState.state.filteredAtendimentos);
            break;
        case 'leads':
            renderKanban();
            break;
        case 'funil':
            renderFunnelChart(appState.state.filteredAtendimentos);
            renderFunnelMetrics(appState.state.filteredAtendimentos);
            break;
        case 'temperatura':
            renderTemperatureChart(appState.state.filteredAtendimentos);
            renderTempTable(appState.state.filteredAtendimentos);
            break;
        case 'relatorios':
            // Nada específico para renderizar
            break;
        case 'configuracoes':
            // Nada específico para renderizar
            break;
        case 'perfil':
            // Nada específico para renderizar
            break;
    }
}

// ========================================
// EVENTOS GLOBAIS
// ========================================

function setupGlobalEvents() {
    // Botão de exportar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportService.downloadCSV();
        });
    }

    // Botão de notificações
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            openNotificationModal();
        });
    }

    // Cores na configuração
    const colorGrid = document.getElementById('colorGrid');
    if (colorGrid) {
        colorGrid.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                colorGrid.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // Listener para mudanças de estado
    appState.subscribe((state) => {
        // Atualizar badge de notificações
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            const unreadCount = notificationsData.filter(n => !n.read).length;
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    });
}

// ========================================
// MODAIS
// ========================================

function openLeadModal(lead = null) {
    const modal = document.getElementById('leadModal');
    const title = document.getElementById('leadModalTitle');

    if (modal) {
        modal.classList.add('active');

        if (lead) {
            title.textContent = 'Editar Lead';
            document.getElementById('leadNome').value = lead.nome || '';
            document.getElementById('leadTelefone').value = lead.telefone || '';
            document.getElementById('leadTemperatura').value = lead.temperatura || 'frio';
            document.getElementById('leadEtapa').value = lead.etapa_funil || 'novo';
            document.getElementById('leadBuscaImovel').checked = lead.busca_imovel || false;
            document.getElementById('leadValor').value = lead.valor_buscado || '';
            document.getElementById('leadResumo').value = lead.resumo || '';
        } else {
            title.textContent = 'Novo Lead';
            // Limpar formulário
            document.getElementById('leadNome').value = '';
            document.getElementById('leadTelefone').value = '';
            document.getElementById('leadTemperatura').value = 'frio';
            document.getElementById('leadEtapa').value = 'novo';
            document.getElementById('leadBuscaImovel').checked = false;
            document.getElementById('leadValor').value = '';
            document.getElementById('leadResumo').value = '';
        }
    }
}

function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function saveLead() {
    const nome = document.getElementById('leadNome').value;
    const telefone = document.getElementById('leadTelefone').value;
    const temperatura = document.getElementById('leadTemperatura').value;
    const etapa = document.getElementById('leadEtapa').value;
    const buscaImovel = document.getElementById('leadBuscaImovel').checked;
    const valor = document.getElementById('leadValor').value;
    const resumo = document.getElementById('leadResumo').value;

    if (!telefone) {
        showNotification('Telefone é obrigatório', 'error');
        return;
    }

    const leadData = {
        nome,
        telefone,
        temperatura,
        etapa_funil: etapa,
        busca_imovel: buscaImovel,
        busca_locacao: buscaImovel,
        valor_buscado: parseFloat(valor) || 0,
        resumo,
        fup_pendente: false
    };

    await atendimentosService.addLead(leadData);
    closeLeadModal();
    showNotification('Lead salvo com sucesso!', 'success');

    // Re-renderizar kanban
    renderKanban();
}

function openNotificationModal() {
    const modal = document.getElementById('notificationModal');
    const list = document.getElementById('notificationList');

    if (modal && list) {
        list.innerHTML = notificationsData.map(n => `
            <div class="notification-item">
                <div class="notification-icon" style="background: ${n.type === 'hot' ? '#fef2f2' : n.type === 'warning' ? '#fffbeb' : '#eff6ff'}; color: ${n.type === 'hot' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#3b82f6'}">
                    ${n.type === 'hot' ? '🔥' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${n.title}</div>
                    <div class="notification-text">${n.message}</div>
                    <div class="notification-time">${n.time}</div>
                </div>
            </div>
        `).join('');

        modal.classList.add('active');
    }
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========================================
// NOTIFICAÇÕES
// ========================================

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
        </div>
    `;

    // Estilos inline para notificação
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'warning' ? 'background: #f59e0b; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========================================
// INICIALIZAÇÃO QUANDO DOM ESTIVER PRONTO
// ========================================

document.addEventListener('DOMContentLoaded', initApp);

// Tornar funções globais
window.navigateTo = navigateTo;
window.openLeadModal = openLeadModal;
window.closeLeadModal = closeLeadModal;
window.saveLead = saveLead;
window.openNotificationModal = openNotificationModal;
window.closeNotificationModal = closeNotificationModal;
window.showNotification = showNotification;
window.saveBranding = saveBranding;
