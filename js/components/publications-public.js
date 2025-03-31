/**
 * publications-public.js - Gerencia a exibição e interação com publicações no blog público
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando funcionalidades de publicações para usuários');
    
    // Inicializar manipuladores de abas
    initTabHandlers();
    
    // Carregar artigos do localStorage
    loadArticlesFromStorage();
    
    // Carregar materiais e eventos do localStorage
    loadMaterialsFromStorage();
    
    // Inicializar filtros
    initFilters();
});

/**
 * Inicializa os manipuladores para as abas
 */
function initTabHandlers() {
    const tabButtons = document.querySelectorAll('.tab-link');
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Ocultar todos os conteúdos de abas
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar o conteúdo de aba correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Carrega os artigos do localStorage e exibe na página
 */
function loadArticlesFromStorage() {
    const container = document.getElementById('articles-container');
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Obter artigos do localStorage
    let articles = [];
    try {
        const storedArticles = localStorage.getItem('blogArticles');
        if (storedArticles) {
            articles = JSON.parse(storedArticles);
        }
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
    }
    
    // Filtrar apenas artigos publicados
    articles = articles.filter(article => article.status === 'publicado');
    
    // Filtrar para categoria de engenharia (baseado na página atual)
    const currentCategory = getCurrentCategory();
    articles = articles.filter(article => 
        article.category.toLowerCase() === currentCategory.toLowerCase());
    
    // Ordenar por data (mais recentes primeiro)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Verificar se existem artigos
    if (articles.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100 text-center my-5">
                Nenhum artigo encontrado para esta categoria.
            </div>
        `;
        return;
    }
    
    // Renderizar artigos
    articles.forEach((article, index) => {
        // Determinar a classe da badge com base na subcategoria
        let badgeClass = getBadgeClassForSubcategory(article.subcategory);
        let badgeText = getDisplayTextForSubcategory(article.subcategory);
        
        // Criar elemento de artigo
        const articleCard = document.createElement('div');
        articleCard.className = `article-card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`;
        
        // Gerar visualizações e downloads aleatórios para simulação
        const views = Math.floor(Math.random() * 3000) + 500;
        const downloads = Math.floor(Math.random() * 1000) + 100;
        
        // MODIFICAÇÃO IMPORTANTE: Adicionar imagem em destaque ao card do artigo
        const thumbnailHtml = article.thumbnailLink ? 
            `<div class="article-thumbnail">
                <img src="${article.thumbnailLink}" alt="${article.title}" class="img-fluid">
             </div>` : '';
        
        articleCard.innerHTML = `
            <div class="article-header">
                <span class="article-badge ${badgeClass}">${badgeText}</span>
                <span class="article-date"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
            </div>
            ${thumbnailHtml}
            <div class="article-body">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-authors"><i class="bi bi-person-badge"></i> ${article.authors}</p>
                <p class="article-text">${article.abstract}</p>
                <div class="article-footer">
                    <div class="article-stats">
                        <span><i class="bi bi-eye"></i> ${views} visualizações</span>
                        <span><i class="bi bi-download"></i> ${downloads} downloads</span>
                        ${article.journal ? `<span><i class="bi bi-journals"></i> ${article.journal}</span>` : ''}
                    </div>
                    <a href="#" class="article-link" data-id="${article.id}">Ler artigo <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        `;
        
        container.appendChild(articleCard);
    });
    
    // Adicionar eventos aos links de artigos
    document.querySelectorAll('.article-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.getAttribute('data-id');
            showArticleDetails(articleId);
        });
    });
}

/**
 * Função auxiliar para determinar a categoria atual baseada na URL
 */
function getCurrentCategory() {
    // Verificar se estamos na página de uma categoria específica
    const path = window.location.pathname;
    if (path.includes('engineering') || path.includes('engenharia')) {
        return 'engenharia';
    } else if (path.includes('medicine') || path.includes('medicina')) {
        return 'medicina';
    } else if (path.includes('oil-gas') || path.includes('petroleo-gas')) {
        return 'petroleo-gas';
    } else if (path.includes('english') || path.includes('ingles')) {
        return 'ingles';
    } else {
        return 'diversos'; // Categoria padrão
    }
}

/**
 * Funções auxiliares para determinar classes e textos de badge
 */
function getBadgeClassForSubcategory(subcategory) {
    switch (subcategory?.toLowerCase()) {
        case 'civil':
            return 'civil';
        case 'mecanica':
        case 'mechanical':
            return 'mechanical';
        case 'eletrica':
        case 'electrical':
            return 'electrical';
        case 'computacao':
        case 'computer':
            return 'computer';
        default:
            return 'featured';
    }
}

function getDisplayTextForSubcategory(subcategory) {
    switch (subcategory?.toLowerCase()) {
        case 'civil':
            return 'Civil';
        case 'mecanica':
        case 'mechanical':
            return 'Mecânica';
        case 'eletrica':
        case 'electrical':
            return 'Elétrica';
        case 'computacao':
        case 'computer':
            return 'Computação';
        default:
            return 'Destaque';
    }
}

/**
 * Carrega os materiais do localStorage e exibe na página
 */
function loadMaterialsFromStorage() {
    const container = document.getElementById('materials-container');
    if (!container) return;
    
    // Limpar o container
    container.innerHTML = '';
    
    // Obter materiais e eventos do localStorage
    let materials = [];
    let events = [];
    try {
        const storedMaterials = localStorage.getItem('blogMaterials');
        if (storedMaterials) {
            materials = JSON.parse(storedMaterials);
        }
        
        const storedEvents = localStorage.getItem('blogEvents');
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        }
    } catch (error) {
        console.error('Erro ao carregar materiais e eventos:', error);
    }
    
    // Filtrar para categoria de engenharia
    const currentCategory = getCurrentCategory();
    materials = materials.filter(material => 
        material.category.toLowerCase() === currentCategory.toLowerCase());
    events = events.filter(event => 
        event.category.toLowerCase() === currentCategory.toLowerCase());
    
    // Verificar se existem materiais ou eventos
    if (materials.length === 0 && events.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100 text-center my-5">
                Nenhum material ou evento encontrado para esta categoria.
            </div>
        `;
        return;
    }
    
    // Renderizar materiais
    materials.forEach((material, index) => {
        // Determinar a classe da badge
        let badgeClass = '';
        let badgeText = '';
        
        switch (material.type?.toLowerCase()) {
            case 'manual':
                badgeClass = 'guide';
                badgeText = 'Manual';
                break;
            case 'guia':
                badgeClass = 'guide';
                badgeText = 'Guia';
                break;
            case 'software':
                badgeClass = 'software';
                badgeText = 'Software';
                break;
            default:
                badgeClass = 'guide';
                badgeText = material.type || 'Manual';
        }
        
        // Criar elemento de material
        const materialCard = document.createElement('div');
        materialCard.className = `material-card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`;
        
        materialCard.innerHTML = `
            <img src="${material.coverLink || 'https://via.placeholder.com/800x400?text=Material'}" alt="${material.title}" class="material-image">
            <div class="material-content">
                <span class="material-badge ${badgeClass}">${badgeText}</span>
                <h3 class="material-title">${material.title}</h3>
                <p class="material-details"><i class="bi bi-file-earmark-pdf"></i> PDF${material.description ? ` - ${material.description}` : ''}</p>
                <a href="#" class="material-button" data-id="${material.id}" data-type="material">
                    Baixar PDF <i class="bi bi-download"></i>
                </a>
            </div>
        `;
        
        container.appendChild(materialCard);
    });
    
    // Renderizar eventos
    events.forEach((event, index) => {
        // Processar data do evento
        const eventDate = new Date(event.eventDate);
        const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const month = monthNames[eventDate.getMonth()];
        const day = eventDate.getDate();
        
        // Criar elemento de evento
        const eventCard = document.createElement('div');
        eventCard.className = `material-card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`;
        
        eventCard.innerHTML = `
            <div class="event-date-badge">
                <span class="event-month">${month}</span>
                <span class="event-day">${day}</span>
            </div>
            <img src="${event.imageLink || 'https://via.placeholder.com/800x400?text=Evento'}" alt="${event.title}" class="material-image">
            <div class="material-content">
                <span class="material-badge event">${event.eventType || 'Evento'}</span>
                <h3 class="material-title">${event.title}</h3>
                <p class="material-details"><i class="bi bi-geo-alt"></i> ${event.location || 'Local não especificado'}</p>
                <a href="#" class="material-button" data-id="${event.id}" data-type="event">
                    Ver detalhes <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        `;
        
        container.appendChild(eventCard);
    });
    
    // Adicionar eventos aos botões de materiais e eventos
    document.querySelectorAll('.material-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            const type = this.getAttribute('data-type');
            
            if (type === 'material') {
                showMaterialDetails(id);
            } else if (type === 'event') {
                showEventDetails(id);
            }
        });
    });
    
    // Configurar botão "Carregar mais"
    const loadMoreBtn = document.getElementById('loadMoreMaterials');
    if (loadMoreBtn) {
        if (materials.length + events.length <= 6) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.addEventListener('click', function() {
                // Simular carregamento
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = 'Todos os materiais carregados';
                    this.classList.add('disabled');
                }, 1500);
            });
        }
    }
}

/**
 * Exibe os detalhes de um artigo em um modal
 */
function showArticleDetails(articleId) {
    // Obter artigos do localStorage
    let articles = [];
    try {
        const storedArticles = localStorage.getItem('blogArticles');
        if (storedArticles) {
            articles = JSON.parse(storedArticles);
        }
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
        return;
    }
    
    // Encontrar o artigo pelo ID
    const article = articles.find(a => a.id === articleId);
    if (!article) {
        console.error('Artigo não encontrado:', articleId);
        return;
    }
    
    // Preencher o modal com os dados do artigo
    const modalContent = document.getElementById('articleDetailContent');
    if (!modalContent) return;
    
    // MODIFICAÇÃO IMPORTANTE: Adiciona a imagem em destaque ao topo dos detalhes se disponível
    const thumbnailSection = article.thumbnailLink ? 
        `<div class="image-section mb-4">
            <img src="${article.thumbnailLink}" alt="${article.title}" class="img-fluid rounded">
        </div>` : '';
    
    modalContent.innerHTML = `
        ${thumbnailSection}
        <div class="article-meta mb-4">
            <div class="article-authors mb-2">${article.authors}</div>
            <div class="d-flex flex-wrap text-muted small mb-2">
                <span class="me-3"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
                ${article.journal ? `<span class="me-3"><i class="bi bi-journal"></i> ${article.journal}</span>` : ''}
                ${article.doi ? `<span><i class="bi bi-link-45deg"></i> DOI: ${article.doi}</span>` : ''}
            </div>
            <div class="badge ${getCategoryBadgeClass(article.category, article.subcategory)}">${article.subcategory || article.category}</div>
        </div>
        
        <div class="abstract-section mb-4">
            <h6>Resumo</h6>
            <p>${article.abstract}</p>
        </div>
        
        ${article.content ? `
        <div class="content-section mb-4">
            <h6>Conteúdo</h6>
            <div>${article.content}</div>
        </div>` : ''}
        
        ${article.tags ? `
        <div class="tags-section mt-4">
            <h6>Tags</h6>
            <div>${article.tags.split(',').map(tag => `<span class="badge bg-light text-dark me-1">${tag.trim()}</span>`).join('')}</div>
        </div>` : ''}
    `;
    
    // Configurar botões de download e visualização
    const downloadBtn = document.getElementById('downloadArticleBtn');
    const viewBtn = document.getElementById('viewArticleBtn');
    
    if (downloadBtn && article.fileLink) {
        downloadBtn.href = article.fileLink;
    }
    
    if (viewBtn && article.fileLink) {
        viewBtn.href = article.fileLink;
    }
    
    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('articleDetailModal'));
    modal.show();
}

/**
 * Exibe os detalhes de um material em um modal
 */
function showMaterialDetails(materialId) {
    // Obter materiais do localStorage
    let materials = [];
    try {
        const storedMaterials = localStorage.getItem('blogMaterials');
        if (storedMaterials) {
            materials = JSON.parse(storedMaterials);
        }
    } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        return;
    }
    
    // Encontrar o material pelo ID
    const material = materials.find(m => m.id === materialId);
    if (!material) {
        console.error('Material não encontrado:', materialId);
        return;
    }
    
    // Preencher o modal com os dados do material
    const modalContent = document.getElementById('materialDetailContent');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${material.coverLink || 'https://via.placeholder.com/400x500?text=Material'}" alt="${material.title}" class="img-fluid rounded">
            </div>
            <div class="col-md-8">
                <h4>${material.title}</h4>
                <div class="d-flex flex-wrap text-muted small mb-3">
                    <span class="me-3"><i class="bi bi-tag"></i> ${material.type || 'Material'}</span>
                    <span class="me-3"><i class="bi bi-calendar3"></i> ${formatDate(material.createdAt)}</span>
                    <span><i class="bi bi-lock"></i> ${material.access || 'Público'}</span>
                </div>
                
                <div class="description-section mb-4">
                    <h6>Descrição</h6>
                    <p>${material.description || 'Sem descrição disponível.'}</p>
                </div>
            </div>
        </div>
    `;
    
    // Configurar botão de download
    const downloadBtn = document.getElementById('downloadMaterialBtn');
    
    if (downloadBtn && material.fileLink) {
        downloadBtn.href = material.fileLink;
        downloadBtn.textContent = `Baixar ${material.type || 'Material'}`;
    }
    
    // Configurar título do modal
    const modalTitle = document.getElementById('materialDetailModalLabel');
    if (modalTitle) {
        modalTitle.textContent = `${material.type || 'Material'}: ${material.title}`;
    }
    
    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('materialDetailModal'));
    modal.show();
}

/**
 * Exibe os detalhes de um evento em um modal
 */
function showEventDetails(eventId) {
    // Obter eventos do localStorage
    let events = [];
    try {
        const storedEvents = localStorage.getItem('blogEvents');
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        }
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        return;
    }
    
    // Encontrar o evento pelo ID
    const event = events.find(e => e.id === eventId);
    if (!event) {
        console.error('Evento não encontrado:', eventId);
        return;
    }
    
    // Preencher o modal com os dados do evento
    const modalContent = document.getElementById('materialDetailContent');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${event.imageLink || 'https://via.placeholder.com/400x300?text=Evento'}" alt="${event.title}" class="img-fluid rounded">
                <div class="event-date-card mt-3 text-center p-3 bg-light rounded">
                    <h5 class="mb-0">${formatDate(event.eventDate)}</h5>
                    <span class="text-muted">${formatTime(event.eventDate)}</span>
                </div>
            </div>
            <div class="col-md-8">
                <h4>${event.title}</h4>
                <div class="d-flex flex-wrap text-muted small mb-3">
                    <span class="me-3"><i class="bi bi-tag"></i> ${event.eventType || 'Evento'}</span>
                    <span><i class="bi bi-geo-alt"></i> ${event.location || 'Local não especificado'}</span>
                </div>
                
                <div class="description-section mb-4">
                    <h6>Descrição</h6>
                    <p>${event.description || 'Sem descrição disponível.'}</p>
                </div>
                
                ${event.link ? `
                <div class="link-section">
                    <a href="${event.link}" target="_blank" class="btn btn-primary">
                        <i class="bi bi-link-45deg"></i> Link para Inscrição
                    </a>
                </div>` : ''}
            </div>
        </div>
    `;
    
    // Configurar botão de download (ocultar para eventos)
    const downloadBtn = document.getElementById('downloadMaterialBtn');
    if (downloadBtn) {
        downloadBtn.style.display = 'none';
    }
    
    // Configurar título do modal
    const modalTitle = document.getElementById('materialDetailModalLabel');
    if (modalTitle) {
        modalTitle.textContent = `${event.eventType || 'Evento'}: ${event.title}`;
    }
    
    // Abrir o modal
    const modal = new bootstrap.Modal(document.getElementById('materialDetailModal'));
    modal.show();
}

/**
 * Inicializa os filtros
 */
function initFilters() {
    // Botões de filtro na seção de artigos
    const articleFilterPills = document.querySelectorAll('#articles-tab .filter-pill');
    articleFilterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remover classe active de todos os pills
            articleFilterPills.forEach(p => p.classList.remove('active'));
            
            // Adicionar classe active ao pill clicado
            this.classList.add('active');
            
            // Aplicar filtro
            const filter = this.getAttribute('data-filter');
            filterArticles(filter);
        });
    });
    
    // Botões de filtro na seção de materiais
    const materialFilterPills = document.querySelectorAll('#materials-tab .filter-pill');
    materialFilterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remover classe active de todos os pills
            materialFilterPills.forEach(p => p.classList.remove('active'));
            
            // Adicionar classe active ao pill clicado
            this.classList.add('active');
            
            // Aplicar filtro
            const filter = this.getAttribute('data-filter');
            filterMaterials(filter);
        });
    });
    
    // Campo de busca de artigos
    const searchArticlesInput = document.getElementById('searchArticles');
    const searchArticlesBtn = document.getElementById('searchArticlesBtn');
    
    if (searchArticlesInput && searchArticlesBtn) {
        searchArticlesBtn.addEventListener('click', function() {
            const searchTerm = searchArticlesInput.value.trim();
            searchArticles(searchTerm);
        });
        
        searchArticlesInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                searchArticles(searchTerm);
            }
        });
    }
    
    // Campo de busca de materiais
    const searchMaterialsInput = document.getElementById('searchMaterials');
    const searchMaterialsBtn = document.getElementById('searchMaterialsBtn');
    
    if (searchMaterialsInput && searchMaterialsBtn) {
        searchMaterialsBtn.addEventListener('click', function() {
            const searchTerm = searchMaterialsInput.value.trim();
            searchMaterials(searchTerm);
        });
        
        searchMaterialsInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                searchMaterials(searchTerm);
            }
        });
    }
}

/**
 * Filtra artigos com base no filtro selecionado
 */
function filterArticles(filter) {
    const articleCards = document.querySelectorAll('#articles-container .article-card');
    
    // Se filtro for "all", mostrar todos
    if (filter === 'all') {
        articleCards.forEach(card => {
            card.style.display = '';
        });
        return;
    }
    
    // Aplicar filtro
    articleCards.forEach(card => {
        const badge = card.querySelector('.article-badge');
        const badgeText = badge ? badge.textContent.toLowerCase() : '';
        
        if (badgeText.includes(filter.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Filtra materiais com base no filtro selecionado
 */
function filterMaterials(filter) {
    const materialCards = document.querySelectorAll('#materials-container .material-card');
    
    // Se filtro for "all", mostrar todos
    if (filter === 'all') {
        materialCards.forEach(card => {
            card.style.display = '';
        });
        return;
    }
    
    // Aplicar filtro
    materialCards.forEach(card => {
        const badge = card.querySelector('.material-badge');
        const badgeText = badge ? badge.textContent.toLowerCase() : '';
        
        if (badgeText.includes(filter.toLowerCase()) || 
            (filter === 'events' && (badgeText.includes('congresso') || badgeText.includes('simpósio') || badgeText.includes('curso')))) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Busca artigos por termo
 */
function searchArticles(term) {
    if (!term) {
        filterArticles('all');
        return;
    }
    
    const articleCards = document.querySelectorAll('#articles-container .article-card');
    const termLower = term.toLowerCase();
    
    articleCards.forEach(card => {
        const title = card.querySelector('.article-title')?.textContent.toLowerCase() || '';
        const authors = card.querySelector('.article-authors')?.textContent.toLowerCase() || '';
        const text = card.querySelector('.article-text')?.textContent.toLowerCase() || '';
        
        if (title.includes(termLower) || authors.includes(termLower) || text.includes(termLower)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Busca materiais por termo
 */
function searchMaterials(term) {
    if (!term) {
        filterMaterials('all');
        return;
    }
    
    const materialCards = document.querySelectorAll('#materials-container .material-card');
    const termLower = term.toLowerCase();
    
    materialCards.forEach(card => {
        const title = card.querySelector('.material-title')?.textContent.toLowerCase() || '';
        const details = card.querySelector('.material-details')?.textContent.toLowerCase() || '';
        
        if (title.includes(termLower) || details.includes(termLower)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Retorna a classe CSS para o badge de categoria
 */
function getCategoryBadgeClass(category, subcategory) {
    if (subcategory?.toLowerCase() === 'civil') return 'bg-success';
    if (subcategory?.toLowerCase() === 'mecanica' || subcategory?.toLowerCase() === 'mechanical') return 'bg-primary';
    if (subcategory?.toLowerCase() === 'eletrica' || subcategory?.toLowerCase() === 'electrical') return 'bg-warning';
    if (subcategory?.toLowerCase() === 'computacao' || subcategory?.toLowerCase() === 'computer') return 'bg-info';
    
    // Classes baseadas na categoria principal
    switch (category?.toLowerCase()) {
        case 'medicina':
            return 'bg-danger';
        case 'engenharia':
            return 'bg-primary';
        case 'petroleo-gas':
            return 'bg-warning';
        case 'ingles':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

/**
 * Formata uma data
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).format(date);
    } catch (error) {
        return dateStr;
    }
}

/**
 * Formata a hora
 */
function formatTime(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        return '';
    }
}