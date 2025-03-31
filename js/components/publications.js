/**
 * publications.js - Componente para exibir publicações no blog público
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o componente de publicações
    initPublicationsComponent();
});

/**
 * Inicializa todas as funcionalidades do componente de publicações
 */
function initPublicationsComponent() {
    // Carrega os artigos do localStorage
    loadPublications();
    
    // Inicializa a funcionalidade de busca
    initializeSearch();
    
    // Inicializa a funcionalidade de filtro por categorias
    initializeFilterButtons();
    
    // Inicializa o botão de carregar mais materiais
    initLoadMoreButton();
    
    // Inicializa animações e efeitos visuais
    initVisualEffects();
}

/**
 * Carrega as publicações do localStorage e as exibe na página
 */
function loadPublications() {
    // Determina a seção atual com base na URL
    const currentSection = getCurrentSection();
    
    // Carrega os artigos do localStorage
    let articles = [];
    try {
        articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
        
        // Filtra os artigos pela seção atual (se aplicável)
        if (currentSection) {
            articles = articles.filter(article => 
                article.category.toLowerCase() === currentSection.toLowerCase());
        }
        
        // Ordena por data (mais recentes primeiro)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
        articles = [];
    }
    
    // Exibe os artigos no container
    displayArticles(articles);
    
    // Carrega eventos e materiais, se necessário
    loadEventsAndMaterials(currentSection);
}

/**
 * Determina a seção atual com base na URL
 */
function getCurrentSection() {
    const urlPath = window.location.pathname;
    
    if (urlPath.includes('/english/')) {
        return 'ingles';
    } else if (urlPath.includes('/medicine/')) {
        return 'medicina';
    } else if (urlPath.includes('/oil-gas/')) {
        return 'petroleo-gas';
    } else if (urlPath.includes('/engineering/')) {
        return 'engenharia';
    } else if (urlPath.includes('/misc/')) {
        return 'diversos';
    }
    
    return null;
}

/**
 * Exibe os artigos no container
 * @param {Array} articles - Lista de artigos a serem exibidos
 */
function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    if (!container) return;
    
    // Limpa o container
    container.innerHTML = '';
    
    if (articles.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100">
                Nenhum artigo encontrado para esta categoria.
            </div>
        `;
        return;
    }
    
    // Adiciona cada artigo ao container
    articles.forEach((article, index) => {
        const badgeClass = getBadgeClass(article.category, article.subcategory);
        const badgeText = article.subcategory || article.category;
        
        const articleElement = document.createElement('div');
        articleElement.className = 'article-card fade-in';
        if (index > 0) {
            articleElement.classList.add(`fade-in-delay-${Math.min(index, 3)}`);
        }
        
        articleElement.innerHTML = `
            <div class="article-header">
                <span class="article-badge ${badgeClass}">${badgeText}</span>
                <span class="article-date"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
            </div>
            <div class="article-body">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-authors"><i class="bi bi-person-badge"></i> ${article.authors}</p>
                <p class="article-text">${article.abstract}</p>
                <div class="article-footer">
                    <div class="article-stats">
                        <span><i class="bi bi-eye"></i> ${getRandomViews()} visualizações</span>
                        <span><i class="bi bi-download"></i> ${getRandomDownloads()} downloads</span>
                        ${article.journal ? `<span><i class="bi bi-journals"></i> ${article.journal}</span>` : ''}
                    </div>
                    <a href="#" class="article-link" data-article-id="${article.id}">Ler artigo <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        `;
        
        container.appendChild(articleElement);
    });
    
    // Inicializa os links dos artigos
    initArticleLinks();
}

/**
 * Carrega eventos e materiais complementares
 * @param {string} section - Seção atual
 */
function loadEventsAndMaterials(section) {
    const materialsContainer = document.getElementById('materials-container');
    if (!materialsContainer) return;
    
    // Limpa o container
    materialsContainer.innerHTML = '';
    
    try {
        // Carrega eventos do localStorage
        let events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
        
        // Filtra eventos pela seção atual
        if (section) {
            events = events.filter(event => 
                event.category.toLowerCase() === section.toLowerCase());
        }
        
        // Carrega materiais do localStorage
        let materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
        
        // Filtra materiais pela seção atual
        if (section) {
            materials = materials.filter(material => 
                material.category.toLowerCase() === section.toLowerCase());
        }
        
        // Combina eventos e materiais
        const combinedItems = [...events, ...materials];
        
        // Ordena por data
        combinedItems.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        
        // Exibe os itens
        displayEventsAndMaterials(combinedItems);
        
    } catch (error) {
        console.error('Erro ao carregar eventos e materiais:', error);
    }
}

/**
 * Exibe eventos e materiais no container
 * @param {Array} items - Lista de eventos e materiais
 */
function displayEventsAndMaterials(items) {
    const container = document.getElementById('materials-container');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info w-100">
                Nenhum material ou evento encontrado para esta categoria.
            </div>
        `;
        return;
    }
    
    // Adiciona cada item ao container
    items.forEach((item, index) => {
        const isEvent = !!item.eventDate;
        
        // Determina o tipo de badge
        let badgeClass = 'guide';
        let badgeText = 'Material';
        
        if (isEvent) {
            badgeClass = 'event';
            badgeText = item.eventType || 'Evento';
        } else if (item.type) {
            badgeClass = item.type.toLowerCase();
            badgeText = item.type;
        }
        
        const materialCard = document.createElement('div');
        materialCard.className = 'material-card fade-in';
        if (index > 0) {
            materialCard.classList.add(`fade-in-delay-${Math.min(index, 3)}`);
        }
        
        // Cria o HTML do evento ou material
        if (isEvent) {
            const eventDate = new Date(item.eventDate);
            const month = eventDate.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            
            materialCard.innerHTML = `
                <div class="event-date-badge">
                    <span class="event-month">${month}</span>
                    <span class="event-day">${day}</span>
                </div>
                <img src="${item.image || 'https://via.placeholder.com/400x200'}" alt="${item.title}" class="material-image">
                <div class="material-content">
                    <span class="material-badge ${badgeClass}">${badgeText}</span>
                    <h3 class="material-title">${item.title}</h3>
                    <p class="material-details"><i class="bi bi-geo-alt"></i> ${item.location || 'Local não especificado'}</p>
                    <a href="#" class="material-button" data-event-id="${item.id}">Ver detalhes <i class="bi bi-arrow-right"></i></a>
                </div>
            `;
        } else {
            materialCard.innerHTML = `
                <img src="${item.cover || 'https://via.placeholder.com/400x200'}" alt="${item.title}" class="material-image">
                <div class="material-content">
                    <span class="material-badge ${badgeClass}">${badgeText}</span>
                    <h3 class="material-title">${item.title}</h3>
                    <p class="material-details"><i class="bi bi-file-earmark-${item.fileType || 'pdf'}"></i> ${item.fileType?.toUpperCase() || 'PDF'} - ${formatFileSize(item.fileSize)}</p>
                    <a href="#" class="material-button" data-material-id="${item.id}">Baixar ${item.fileType?.toUpperCase() || 'PDF'} <i class="bi bi-download"></i></a>
                </div>
            `;
        }
        
        container.appendChild(materialCard);
    });
    
    // Inicializa os botões de evento e material
    initMaterialButtons();
}

/**
 * Formata o tamanho do arquivo para exibição
 * @param {number} size - Tamanho em bytes
 * @returns {string} - Tamanho formatado
 */
function formatFileSize(size) {
    if (!size) return 'Tamanho desconhecido';
    
    const kb = size / 1024;
    if (kb < 1024) {
        return Math.round(kb) + ' KB';
    } else {
        return (kb / 1024).toFixed(1) + ' MB';
    }
}

/**
 * Inicializa os botões de materiais e eventos
 */
function initMaterialButtons() {
    // Inicializa botões de materiais
    document.querySelectorAll('[data-material-id]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const materialId = this.getAttribute('data-material-id');
            handleMaterialDownload(materialId);
        });
    });
    
    // Inicializa botões de eventos
    document.querySelectorAll('[data-event-id]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventId = this.getAttribute('data-event-id');
            showEventDetail(eventId);
        });
    });
}

/**
 * Simula o download de um material
 * @param {string} materialId - ID do material
 */
function handleMaterialDownload(materialId) {
    try {
        const materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
        const material = materials.find(m => m.id === materialId);
        
        if (!material) {
            alert('Material não encontrado.');
            return;
        }
        
        // Simula o download (na versão real, redirecionaria para o arquivo)
        alert(`Download iniciado: ${material.title}`);
        
    } catch (error) {
        console.error('Erro ao processar download:', error);
        alert('Erro ao iniciar o download. Por favor, tente novamente.');
    }
}

/**
 * Exibe os detalhes de um evento
 * @param {string} eventId - ID do evento
 */
function showEventDetail(eventId) {
    try {
        const events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            alert('Evento não encontrado.');
            return;
        }
        
        // Cria um modal para exibir os detalhes do evento
        const modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.id = 'eventDetailModal';
        modalElement.setAttribute('tabindex', '-1');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${event.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${event.image || 'https://via.placeholder.com/400x200'}" alt="${event.title}" class="img-fluid mb-3">
                            </div>
                            <div class="col-md-6">
                                <h6>Detalhes do Evento</h6>
                                <p><strong>Data:</strong> ${formatDate(event.eventDate)}</p>
                                <p><strong>Local:</strong> ${event.location || 'Local não especificado'}</p>
                                <p><strong>Categoria:</strong> ${event.category}</p>
                                ${event.price ? `<p><strong>Preço:</strong> ${event.price}</p>` : ''}
                            </div>
                        </div>
                        <div class="mt-4">
                            <h6>Descrição</h6>
                            <div>${event.description || 'Sem descrição disponível.'}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary">Inscrever-se</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Remove o modal do DOM quando for fechado
        modalElement.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalElement);
        });
        
    } catch (error) {
        console.error('Erro ao exibir detalhes do evento:', error);
        alert('Erro ao exibir detalhes do evento. Por favor, tente novamente.');
    }
}

/**
 * Exibe os detalhes de um artigo
 * @param {string} articleId - ID do artigo
 */
function showArticleDetail(articleId) {
    try {
        const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
        const article = articles.find(a => a.id === articleId);
        
        if (!article) {
            alert('Artigo não encontrado.');
            return;
        }
        
        // Cria um modal para exibir os detalhes do artigo
        const modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.id = 'articleDetailModal';
        modalElement.setAttribute('tabindex', '-1');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${article.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="article-meta mb-4">
                            <div class="article-authors mb-2">${article.authors}</div>
                            <div class="text-muted small">
                                <span class="me-3"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
                                ${article.journal ? `<span class="me-3"><i class="bi bi-journals"></i> ${article.journal}</span>` : ''}
                                ${article.doi ? `<span><i class="bi bi-link-45deg"></i> DOI: ${article.doi}</span>` : ''}
                            </div>
                        </div>
                        <div class="abstract mb-4">
                            <h6>Resumo</h6>
                            <p>${article.abstract}</p>
                        </div>
                        ${article.content ? `
                        <div class="content">
                            <h6>Conteúdo</h6>
                            <div>${article.content}</div>
                        </div>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary"><i class="bi bi-download"></i> Baixar PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
        
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        
        // Remove o modal do DOM quando for fechado
        modalElement.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalElement);
        });
        
    } catch (error) {
        console.error('Erro ao exibir detalhes do artigo:', error);
        alert('Erro ao exibir detalhes do artigo. Por favor, tente novamente.');
    }
}

/**
 * Retorna a classe CSS para o badge de acordo com a categoria/subcategoria
 * @param {string} category - Categoria do artigo
 * @param {string} subcategory - Subcategoria do artigo
 * @returns {string} - Classe CSS para o badge
 */
function getBadgeClass(category, subcategory) {
    // Mapeamento de categorias/subcategorias para classes CSS de badges
    const badgeMapping = {
        'medicina': 'medicine',
        'engenharia': 'engineering',
        'civil': 'civil',
        'mecanica': 'mechanical',
        'eletrica': 'electrical',
        'computacao': 'computer',
        'petroleo-gas': 'oil-gas',
        'ingles': 'english',
        'diversos': 'misc'
    };
    
    // Retorna a classe CSS baseada na subcategoria ou na categoria
    return badgeMapping[subcategory?.toLowerCase()] || 
           badgeMapping[category?.toLowerCase()] || 
           'featured';
}

/**
 * Formata uma data para exibição
 * @param {string} dateString - String de data
 * @returns {string} - Data formatada
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return dateString;
    }
}

/**
 * Gera um número aleatório para contagem de visualizações
 * @returns {number} - Número aleatório
 */
function getRandomViews() {
    return Math.floor(Math.random() * 3000) + 500;
}

/**
 * Gera um número aleatório para contagem de downloads
 * @returns {number} - Número aleatório
 */
function getRandomDownloads() {
    return Math.floor(Math.random() * 1000) + 100;
}

/**
 * Inicializa os links dos artigos para exibir o artigo completo
 */
function initArticleLinks() {
    document.querySelectorAll('.article-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.getAttribute('data-article-id');
            showArticleDetail(articleId);
        });
    });
}

/**
 * Inicializa a funcionalidade de busca
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchArticles');
    if (!searchInput) return;
    
    let searchTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            const searchTerm = this.value.trim().toLowerCase();
            filterItems('articles-container', searchTerm);
        }, 300);
    });
    
    // Botão de busca
    const searchButton = document.getElementById('searchArticlesBtn');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterItems('articles-container', searchTerm);
        });
    }
    
    // Busca em materiais
    const searchMaterialsInput = document.getElementById('searchMaterials');
    if (searchMaterialsInput) {
        let materialsSearchTimer;
        searchMaterialsInput.addEventListener('input', function() {
            clearTimeout(materialsSearchTimer);
            materialsSearchTimer = setTimeout(() => {
                const searchTerm = this.value.trim().toLowerCase();
                filterItems('materials-container', searchTerm);
            }, 300);
        });
        
        const searchMaterialsButton = document.getElementById('searchMaterialsBtn');
        if (searchMaterialsButton) {
            searchMaterialsButton.addEventListener('click', function() {
                const searchTerm = searchMaterialsInput.value.trim().toLowerCase();
                filterItems('materials-container', searchTerm);
            });
        }
    }
}

/**
 * Filtra itens em um container com base em um termo de busca
 * @param {string} containerId - ID do container
 * @param {string} searchTerm - Termo de busca
 */
function filterItems(containerId, searchTerm) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.children;
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Se for um alerta, não filtra
        if (item.classList.contains('alert')) continue;
        
        const title = item.querySelector('.article-title, .material-title')?.textContent.toLowerCase() || '';
        const text = item.querySelector('.article-text, .material-details')?.textContent.toLowerCase() || '';
        const authors = item.querySelector('.article-authors')?.textContent.toLowerCase() || '';
        
        if (searchTerm === '' || 
            title.includes(searchTerm) || 
            text.includes(searchTerm) || 
            authors.includes(searchTerm)) {
            item.style.display = '';
            
            // Destaca o texto que corresponde à busca se houver um termo de busca
            if (searchTerm) {
                highlightText(item, searchTerm);
            } else {
                removeHighlights(item);
            }
        } else {
            item.style.display = 'none';
        }
    }
}

/**
 * Destaca o texto que corresponde à busca
 * @param {HTMLElement} item - Elemento onde o texto será destacado
 * @param {string} searchTerm - Termo de busca
 */
function highlightText(item, searchTerm) {
    // Remove qualquer destaque anterior
    removeHighlights(item);
    
    // Elementos onde o texto pode ser destacado
    const elements = [
        item.querySelector('.article-title, .material-title'),
        item.querySelector('.article-text, .material-details'),
        item.querySelector('.article-authors')
    ];
    
    elements.forEach(element => {
        if (!element) return;
        
        const originalText = element.textContent;
        const lowerText = originalText.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        if (lowerText.includes(searchLower)) {
            let newHtml = '';
            let lastIndex = 0;
            let index = lowerText.indexOf(searchLower);
            
            while (index !== -1) {
                // Texto antes da correspondência
                newHtml += originalText.substring(lastIndex, index);
                
                // Texto correspondente destacado
                newHtml += `<span class="highlight">${originalText.substring(index, index + searchTerm.length)}</span>`;
                
                lastIndex = index + searchTerm.length;
                index = lowerText.indexOf(searchLower, lastIndex);
            }
            
            // Resto do texto
            newHtml += originalText.substring(lastIndex);
            element.innerHTML = newHtml;
        }
    });
}

/**
 * Remove os destaques de texto
 * @param {HTMLElement} item - Elemento onde os destaques serão removidos
 */
function removeHighlights(item) {
    const elements = [
        item.querySelector('.article-title, .material-title'),
        item.querySelector('.article-text, .material-details'),
        item.querySelector('.article-authors')
    ];
    
    elements.forEach(element => {
        if (!element) return;
        
        // Verifica se há destaques
        if (element.querySelector('.highlight')) {
            const originalText = element.textContent;
            element.innerHTML = originalText;
        }
    });
}

/**
 * Inicializa os botões de filtro por categoria
 */
function initializeFilterButtons() {
    const filterPills = document.querySelectorAll('.filter-pill');
    if (filterPills.length === 0) return;
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove a classe active de todos os pills
            filterPills.forEach(p => p.classList.remove('active'));
            
            // Adiciona a classe active ao pill clicado
            this.classList.add('active');
            
            // Filtra os itens de acordo com a categoria
            const filter = this.getAttribute('data-filter');
            
            // Determina o container a ser filtrado
            const container = this.closest('.tab-content').querySelector('.article-card') 
                ? 'articles-container' 
                : 'materials-container';
            
            filterByCategory(container, filter);
        });
    });
}

/**
 * Filtra itens por categoria
 * @param {string} containerId - ID do container
 * @param {string} filter - Categoria para filtrar
 */
function filterByCategory(containerId, filter) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.children;
    
    // Se o filtro for "all", mostra todos os itens
    if (filter === 'all') {
        for (let i = 0; i < items.length; i++) {
            // Não altera os alertas
            if (items[i].classList.contains('alert')) continue;
            items[i].style.display = '';
        }
        return;
    }
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Não altera os alertas
        if (item.classList.contains('alert')) continue;
        
        const badge = item.querySelector('.article-badge, .material-badge');
        const badgeText = badge ? badge.textContent.toLowerCase() : '';
        
        if (badgeText.includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    }
}

/**
 * Inicializa o botão de carregar mais materiais
 */
function initLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreFlyers');
    if (!loadMoreButton) return;
    
    loadMoreButton.addEventListener('click', function() {
        // Adiciona classe para mostrar o estado de carregamento
        this.classList.add('loading');
        this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...';
        
        // Simula uma requisição assíncrona
        setTimeout(() => {
            // Na implementação real, carregaria mais itens do banco de dados
            // Nesta versão, apenas desabilita o botão após o "carregamento"
            this.classList.remove('loading');
            this.textContent = 'Todos os materiais carregados';
            this.disabled = true;
            this.classList.remove('btn-primary');
            this.classList.add('btn-secondary');
        }, 1000);
    });
}

/**
 * Inicializa animações e efeitos visuais
 */
function initVisualEffects() {
    // Aplica animações de fade-in para elementos que entram na viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observa elementos com classes fade-in
        document.querySelectorAll('.fade-in').forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback para navegadores sem suporte a IntersectionObserver
        document.querySelectorAll('.fade-in').forEach(item => {
            item.classList.add('visible');
        });
    }
    
    // Inicializa tabs para navegação entre seções
    document.querySelectorAll('#publicationTabs .tab-link').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove a classe active de todas as tabs
            document.querySelectorAll('#publicationTabs .tab-link').forEach(t => {
                t.classList.remove('active');
            });
            
            // Adiciona a classe active na tab clicada
            this.classList.add('active');
            
            // Esconde todas as seções de conteúdo
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostra a seção correspondente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Adiciona estilos CSS dinâmicos para os efeitos visuais
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background-color: rgba(255, 235, 59, 0.5);
            border-radius: 3px;
            padding: 0 2px;
        }
        
        .highlight {
            background-color: rgba(255, 235, 59, 0.5);
            border-radius: 3px;
            padding: 0 2px;
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .fade-in-delay-1 {
            transition-delay: 0.1s;
        }
        
        .fade-in-delay-2 {
            transition-delay: 0.2s;
        }
        
        .fade-in-delay-3 {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);
}

// Executa a adição de estilos dinâmicos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', addDynamicStyles);