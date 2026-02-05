/**
 * ========================================
 * COPILOTO IA - EXPORT
 * Serviço de Exportação de Dados
 * ========================================
 */

const exportService = {
    /**
     * Exportar para CSV
     */
    downloadCSV: (data = null) => {
        const leads = data || appState.state.filteredAtendimentos || appState.state.atendimentos;
        
        if (!leads || leads.length === 0) {
            showNotification('Nenhum dado para exportar', 'warning');
            return;
        }
        
        // Cabeçalho do CSV
        let csv = 'Nome,Telefone,Temperatura,Último Contato,Etapa Funil,Busca Imóvel,Valor Buscado,FUP Pendente,Resumo\n';
        
        // Linhas
        leads.forEach(row => {
            const nome = (row.nome || 'N/A').replace(/,/g, ';');
            const telefone = row.telefone || 'N/A';
            const temperatura = row.temperatura || 'N/A';
            const ultimoContato = row.ultimo_contato || row.created_at || 'N/A';
            const etapaFunil = row.etapa_funil || 'novo';
            const buscaImovel = row.busca_imovel ? 'Sim' : 'Não';
            const valorBuscado = row.valor_buscado || 0;
            const fupPendente = row.fup_pendente ? 'Sim' : 'Não';
            const resumo = (row.resumo || '').replace(/,/g, ';').replace(/\n/g, ' ');
            
            csv += `${nome},${telefone},${temperatura},${ultimoContato},${etapaFunil},${buscaImovel},${valorBuscado},${fupPendente},"${resumo}"\n`;
        });

        // Criar Blob e Link de Download
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `leads_relatorio_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Relatório CSV baixado com sucesso!', 'success');
    },
    
    /**
     * Exportar para PDF (usando window.print estilizado)
     */
    downloadPDF: (data = null) => {
        const leads = data || appState.state.filteredAtendimentos || appState.state.atendimentos;
        
        if (!leads || leads.length === 0) {
            showNotification('Nenhum dado para exportar', 'warning');
            return;
        }
        
        // Criar uma nova janela com os dados formatados
        const printWindow = window.open('', '_blank');
        const tenant = appState.state.currentTenant || TENANTS['default'];
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Leads - ${tenant.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        font-family: 'Inter', Arial, sans-serif; 
                        padding: 40px;
                        background: #f8fafc;
                        color: #1e293b;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid ${tenant.primaryColor};
                    }
                    
                    .header h1 {
                        color: ${tenant.primaryColor};
                        font-size: 28px;
                        margin-bottom: 8px;
                    }
                    
                    .header p {
                        color: #64748b;
                        font-size: 14px;
                    }
                    
                    .summary {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    
                    .summary-card {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    
                    .summary-card h3 {
                        font-size: 32px;
                        color: ${tenant.primaryColor};
                        margin-bottom: 8px;
                    }
                    
                    .summary-card p {
                        color: #64748b;
                        font-size: 14px;
                    }
                    
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                        background: white;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    
                    th, td { 
                        padding: 12px 16px; 
                        text-align: left; 
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    th { 
                        background-color: ${tenant.primaryColor}15;
                        color: ${tenant.primaryColor};
                        font-weight: 600;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    td {
                        font-size: 14px;
                        color: #334155;
                    }
                    
                    tr:hover {
                        background-color: #f8fafc;
                    }
                    
                    .badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 500;
                    }
                    
                    .badge-muito-quente { background: #fef2f2; color: #ef4444; }
                    .badge-quente { background: #fff7ed; color: #f97316; }
                    .badge-morno { background: #eff6ff; color: #3b82f6; }
                    .badge-frio { background: #f1f5f9; color: #64748b; }
                    
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #94a3b8;
                        font-size: 12px;
                    }
                    
                    @media print {
                        body { 
                            margin: 0; 
                            background: white;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${tenant.name}</h1>
                    <p>Relatório de Leads - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="summary">
                    <div class="summary-card">
                        <h3>${leads.length}</h3>
                        <p>Total de Leads</p>
                    </div>
                    <div class="summary-card">
                        <h3>${leads.filter(l => ['quente', 'muito_quente'].includes(l.temperatura)).length}</h3>
                        <p>Leads Quentes</p>
                    </div>
                    <div class="summary-card">
                        <h3>${leads.filter(l => l.fup_pendente).length}</h3>
                        <p>FUPs Pendentes</p>
                    </div>
                    <div class="summary-card">
                        <h3>${leads.filter(l => l.busca_imovel).length}</h3>
                        <p>Buscam Imóvel</p>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Temperatura</th>
                            <th>Etapa</th>
                            <th>Valor</th>
                            <th>FUP</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leads.map(row => `
                            <tr>
                                <td>${row.nome || 'N/A'}</td>
                                <td>${row.telefone || 'N/A'}</td>
                                <td><span class="badge badge-${row.temperatura}">${row.temperatura.replace('_', ' ').toUpperCase()}</span></td>
                                <td>${(row.etapa_funil || 'novo').toUpperCase()}</td>
                                <td>${row.valor_buscado ? 'R$ ' + row.valor_buscado.toLocaleString('pt-BR') : '-'}</td>
                                <td>${row.fup_pendente ? '⚠️ Pendente' : '✓ OK'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Gerado por Copiloto IA - ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Aguardar carregamento e imprimir
        setTimeout(() => {
            printWindow.print();
        }, 250);
        
        showNotification('Relatório PDF gerado com sucesso!', 'success');
    },
    
    /**
     * Gerar relatório de performance
     */
    generatePerformanceReport: () => {
        const data = appState.state.atendimentos;
        
        // Calcular métricas de performance
        const total = data.length;
        const comInteresse = data.filter(a => a.busca_imovel).length;
        const taxaConversao = total > 0 ? ((comInteresse / total) * 100).toFixed(1) : 0;
        
        const porTemperatura = {
            'muito_quente': data.filter(a => a.temperatura === 'muito_quente').length,
            'quente': data.filter(a => a.temperatura === 'quente').length,
            'morno': data.filter(a => ['morno', 'morna'].includes(a.temperatura)).length,
            'frio': data.filter(a => ['frio', 'muito_frio'].includes(a.temperatura)).length
        };
        
        // Criar relatório
        const printWindow = window.open('', '_blank');
        const tenant = appState.state.currentTenant || TENANTS['default'];
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Performance - ${tenant.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        font-family: 'Inter', Arial, sans-serif; 
                        padding: 40px;
                        background: #f8fafc;
                        color: #1e293b;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid ${tenant.primaryColor};
                    }
                    
                    .header h1 {
                        color: ${tenant.primaryColor};
                        font-size: 28px;
                        margin-bottom: 8px;
                    }
                    
                    .metrics {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    
                    .metric-card {
                        background: white;
                        padding: 24px;
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    
                    .metric-card h3 {
                        font-size: 36px;
                        color: ${tenant.primaryColor};
                        margin-bottom: 8px;
                    }
                    
                    .metric-card p {
                        color: #64748b;
                        font-size: 14px;
                    }
                    
                    .section {
                        background: white;
                        padding: 24px;
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        margin-bottom: 20px;
                    }
                    
                    .section h2 {
                        color: #1e293b;
                        font-size: 18px;
                        margin-bottom: 16px;
                    }
                    
                    .temp-bar {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    
                    .temp-bar-label {
                        width: 120px;
                        font-size: 14px;
                        color: #64748b;
                    }
                    
                    .temp-bar-fill {
                        flex: 1;
                        height: 24px;
                        background: #e2e8f0;
                        border-radius: 4px;
                        overflow: hidden;
                    }
                    
                    .temp-bar-inner {
                        height: 100%;
                        border-radius: 4px;
                        transition: width 0.5s ease;
                    }
                    
                    .temp-bar-value {
                        width: 60px;
                        text-align: right;
                        font-weight: 600;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Relatório de Performance</h1>
                    <p>${tenant.name} - ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="metrics">
                    <div class="metric-card">
                        <h3>${total}</h3>
                        <p>Total de Atendimentos</p>
                    </div>
                    <div class="metric-card">
                        <h3>${taxaConversao}%</h3>
                        <p>Taxa de Conversão</p>
                    </div>
                    <div class="metric-card">
                        <h3>${data.filter(a => a.fup_pendente).length}</h3>
                        <p>FUPs Pendentes</p>
                    </div>
                </div>
                
                <div class="section">
                    <h2>Distribuição por Temperatura</h2>
                    <div class="temp-bar">
                        <span class="temp-bar-label">Muito Quente</span>
                        <div class="temp-bar-fill">
                            <div class="temp-bar-inner" style="width: ${(porTemperatura['muito_quente'] / total * 100)}%; background: #ef4444;"></div>
                        </div>
                        <span class="temp-bar-value">${porTemperatura['muito_quente']}</span>
                    </div>
                    <div class="temp-bar">
                        <span class="temp-bar-label">Quente</span>
                        <div class="temp-bar-fill">
                            <div class="temp-bar-inner" style="width: ${(porTemperatura['quente'] / total * 100)}%; background: #f97316;"></div>
                        </div>
                        <span class="temp-bar-value">${porTemperatura['quente']}</span>
                    </div>
                    <div class="temp-bar">
                        <span class="temp-bar-label">Morno</span>
                        <div class="temp-bar-fill">
                            <div class="temp-bar-inner" style="width: ${(porTemperatura['morno'] / total * 100)}%; background: #3b82f6;"></div>
                        </div>
                        <span class="temp-bar-value">${porTemperatura['morno']}</span>
                    </div>
                    <div class="temp-bar">
                        <span class="temp-bar-label">Frio</span>
                        <div class="temp-bar-fill">
                            <div class="temp-bar-inner" style="width: ${(porTemperatura['frio'] / total * 100)}%; background: #64748b;"></div>
                        </div>
                        <span class="temp-bar-value">${porTemperatura['frio']}</span>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 250);
        
        showNotification('Relatório de performance gerado!', 'success');
    }
};

// Tornar global
window.exportService = exportService;
window.generatePerformanceReport = exportService.generatePerformanceReport;
