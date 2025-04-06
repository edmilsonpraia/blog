/**
 * publications-public.js - Gerencia a exibição e interação com publicações no blog público
 * Versão corrigida para resolver problemas de conexão com Supabase
 */

// Variáveis globais
const SUPABASE_URL = 'https://lvegldhtgalibbkmhzfz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZWdsZGh0Z2FsaWJia21oemZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODQzOTcsImV4cCI6MjA1OTI2MDM5N30.mS069eiTid0_l067PRZPD_3a7v-GJrvxQNCTCRuNpYw';

let supabase = null;

// Verificar se o documento está carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando funcionalidades de publicações para usuários');
    
    // Inicializar componentes da UI independentemente do Supabase
    initTabHandlers();
    showLoadingIndicator('articles-container');
    showLoadingIndicator('materials-container');
    initFilters();
    
    // Inicializar o Supabase
    initializeSupabase();
});

/**
 * Inicializa o cliente Supabase
 */
function initializeSupabase() {
    console.log('Tentando inicializar o cliente Supabase...');
    
    try {
        // Verificar se o Supabase já está disponível no window global
        if (window.supabase) {
            console.log('Objeto supabase já disponível globalmente');
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            onSupabaseInitialized();
            return;
        }
        
        // Verificar se o Supabase está disponível como objeto global
        if (typeof supabaseClient !== 'undefined') {
            console.log('Usando cliente Supabase existente');
            supabase = supabaseClient;
            onSupabaseInitialized();
            return;
        }
        
        // Verificar outras formas de acesso
        if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
            console.log('Usando window.supabase.createClient');
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            onSupabaseInitialized();
            return;
        } 
        else if (typeof window.createClient === 'function') {
            console.log('Usando window.createClient');
            supabase = window.createClient(SUPABASE_URL, SUPABASE_KEY);
            onSupabaseInitialized();
            return;
        }
        else if (typeof createClient === 'function') {
            console.log('Usando createClient global');
            supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
            onSupabaseInitialized();
            return;
        }
        
        // Se chegou aqui, precisamos carregar o script manualmente
        console.log('Biblioteca Supabase não encontrada. Carregando via script...');
        loadSupabaseScript();
    } catch (error) {
        console.error('Erro ao inicializar o cliente Supabase:', error);
        showErrorBanner('Erro ao conectar com o banco de dados. Tente novamente mais tarde.');
        
        // Mostrar conteúdo alternativo
        showBackupContent();
    }
}

/**
 * Carrega o script do Supabase dinamicamente
 */
function loadSupabaseScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    script.onload = function() {
        console.log('Script do Supabase carregado com sucesso');
        try {
            // Tentar diferentes métodos de inicialização
            if (typeof supabase === 'undefined') {
                if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                } else if (typeof createClient !== 'undefined') {
                    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                } else if (typeof window.supabase !== 'undefined') {
                    supabase = window.supabase(SUPABASE_URL, SUPABASE_KEY);
                } else {
                    throw new Error('Não foi possível encontrar o cliente Supabase após carregar o script');
                }
            }
            
            onSupabaseInitialized();
        } catch (error) {
            console.error('Erro ao inicializar o Supabase após carregamento do script:', error);
            showErrorBanner('Não foi possível conectar ao banco de dados. Tente novamente mais tarde.');
            showBackupContent();
        }
    };
    
    script.onerror = function() {
        console.error('Falha ao carregar o script do Supabase');
        showErrorBanner('Não foi possível carregar os recursos necessários. Tente recarregar a página.');
        showBackupContent();
    };
    
    document.head.appendChild(script);
}

/**
 * Função chamada quando o Supabase é inicializado com sucesso
 */
function onSupabaseInitialized() {
    console.log('Cliente Supabase inicializado com sucesso');
    
    // Testar conexão antes de carregar dados
    testSupabaseConnection()
        .then(connected => {
            if (connected) {
                console.log('Conexão com o Supabase confirmada');
                // Carregar dados
                loadArticlesFromSupabase();
                loadMaterialsFromSupabase();
            } else {
                console.error('Falha ao testar conexão com o Supabase');
                showBackupContent();
            }
        })
        .catch(error => {
            console.error('Erro ao testar conexão:', error);
            showBackupContent();
        });
}

/**
 * Testa a conexão com o Supabase
 */
async function testSupabaseConnection() {
    try {
        console.log('Testando conexão com o Supabase...');
        const { count, error } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .limit(1);
        
        if (error) {
            console.error('Erro ao testar conexão com o Supabase:', error);
            showErrorBanner('Não foi possível conectar ao banco de dados. Tente novamente mais tarde.');
            return false;
        }
        
        console.log('Conexão com o Supabase bem-sucedida');
        return true;
    } catch (error) {
        console.error('Erro ao testar conexão com o Supabase:', error);
        showErrorBanner('Erro ao conectar com o banco de dados. Tente novamente mais tarde.');
        return false;
    }
}

/**
 * Mostra uma mensagem de erro
 */
function showErrorBanner(message) {
    if (document.getElementById('error-banner')) {
        return; // Evitar mensagens duplicadas
    }
    
    const alertElement = document.createElement('div');
    alertElement.id = 'error-banner';
    alertElement.className = 'alert alert-danger alert-dismissible fade show';
    alertElement.style.position = 'fixed';
    alertElement.style.top = '20px';
    alertElement.style.left = '50%';
    alertElement.style.transform = 'translateX(-50%)';
    alertElement.style.zIndex = '9999';
    alertElement.style.maxWidth = '80%';
    alertElement.style.width = 'auto';
    alertElement.innerHTML = `
        <strong>Erro:</strong> ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alertElement);
    
    // Remover o alerta após 8 segundos
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 8000);
}

/**
 * Mostra conteúdo de backup em caso de falha na conexão com o Supabase
 */
function showBackupContent() {
    console.log('Exibindo conteúdo estático de backup');
    
    const articlesContainer = document.getElementById('articles-container');
    if (articlesContainer) {
        articlesContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <h4 class="alert-heading">Não foi possível carregar os artigos</h4>
                <p>Estamos enfrentando problemas técnicos temporários. Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
                <hr>
                <p class="mb-0">Enquanto isso, você pode explorar outras seções do site ou entrar em contato conosco pelo email: <a href="mailto:justificacoesacademicas@gmail.com">justificacoesacademicas@gmail.com</a></p>
                <button class="btn btn-primary mt-3" onclick="location.reload()">Tentar novamente</button>
            </div>
        `;
    }
    
    const materialsContainer = document.getElementById('materials-container');
    if (materialsContainer) {
        materialsContainer.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <h4 class="alert-heading">Não foi possível carregar os materiais</h4>
                <p>Estamos enfrentando problemas técnicos temporários. Por favor, tente novamente mais tarde ou entre em contato com o suporte.</p>
                <hr>
                <p class="mb-0">Você também pode nos contatar pelo WhatsApp: <a href="https://chat.whatsapp.com/EvNGxDj3fagINGtBsH6piL" target="_blank">Grupo WhatsApp</a></p>
            </div>
        `;
    }
}

/**
 * Mostra um indicador de carregamento em um container
 */
function showLoadingIndicator(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-indicator text-center w-100 py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando conteúdo...</p>
        </div>
    `;
}

/**
 * Mostra uma mensagem de erro no container
 */
function showErrorMessage(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-danger w-100">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> ${message}
        </div>
    `;
}

/**
 * Inicializa os manipuladores para as abas
 */
function initTabHandlers() {
    console.log('Inicializando manipuladores de abas');
    const tabButtons = document.querySelectorAll('.tab-link');
    if (tabButtons.length === 0) {
        console.warn('Nenhum botão de aba encontrado');
        return;
    }
    
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
            
            // Mostrar o conteúdo da aba selecionada
            const tabId = this.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            } else {
                console.error(`Conteúdo da aba #${tabId} não encontrado`);
            }
        });
    });
    
    console.log('Manipuladores de abas inicializados');
}

/**
 * Inicializa os filtros
 */
function initFilters() {
    console.log('Inicializando filtros');
    
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
    
    // Botão de carregar mais
    const loadMoreBtn = document.getElementById('loadMoreMaterials');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Mostrar todos os materiais ocultos
            document.querySelectorAll('#materials-container .material-card.d-none').forEach(card => {
                card.classList.remove('d-none');
            });
            
            // Desabilitar o botão após clicar
            this.classList.add('disabled');
            this.textContent = 'Todos os materiais carregados';
        });
    }
    
    console.log('Filtros inicializados');
}

/**
 * Filtra artigos com base no critério
 */
function filterArticles(filter) {
    console.log('Filtrando artigos por:', filter);
    const articleCards = document.querySelectorAll('#articles-container .article-card');
    
    if (articleCards.length === 0) {
        console.warn('Nenhum artigo encontrado para filtrar');
        return;
    }
    
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
 * Filtra materiais com base no critério
 */
function filterMaterials(filter) {
    console.log('Filtrando materiais por:', filter);
    const materialCards = document.querySelectorAll('#materials-container .material-card');
    
    if (materialCards.length === 0) {
        console.warn('Nenhum material encontrado para filtrar');
        return;
    }
    
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
        const isEvent = card.classList.contains('event-card');
        
        if (filter === 'events' && isEvent) {
            card.style.display = '';
        } else if (filter === 'materials' && !isEvent) {
            card.style.display = '';
        } else if (badgeText.includes(filter.toLowerCase())) {
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
    console.log('Buscando artigos por:', term);
    const articleCards = document.querySelectorAll('#articles-container .article-card');
    
    if (articleCards.length === 0) {
        console.warn('Nenhum artigo encontrado para buscar');
        return;
    }
    
    if (!term) {
        // Se o termo estiver vazio, mostrar todos
        articleCards.forEach(card => {
            card.style.display = '';
        });
        return;
    }
    
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
    console.log('Buscando materiais por:', term);
    const materialCards = document.querySelectorAll('#materials-container .material-card');
    
    if (materialCards.length === 0) {
        console.warn('Nenhum material encontrado para buscar');
        return;
    }
    
    if (!term) {
        // Se o termo estiver vazio, mostrar todos
        materialCards.forEach(card => {
            card.style.display = '';
        });
        return;
    }
    
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
 * Carrega os artigos do Supabase
 */
async function loadArticlesFromSupabase() {
    console.log('Carregando artigos do Supabase...');
    const container = document.getElementById('articles-container');
    if (!container) {
        console.error('Container de artigos não encontrado');
        return;
    }
    
    try {
        // Verificar se o cliente Supabase está disponível
        if (!supabase) {
            showErrorMessage(container, 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.');
            return;
        }
        
        // Obter a categoria atual
        const currentCategory = getCurrentCategory();
        console.log('Categoria atual:', currentCategory);
        
        // Buscar artigos do Supabase
        let query = supabase
            .from('articles')
            .select('*')
            .eq('status', 'publicado');
        
        // Filtrar por categoria se necessário
        if (currentCategory) {
            query = query.eq('category', currentCategory);
        }
        
        // Ordenar por data (mais recente primeiro)
        const { data: articles, error } = await query.order('date', { ascending: false });
        
        if (error) {
            console.error('Erro ao buscar artigos:', error);
            showErrorMessage(container, 'Não foi possível carregar os artigos. Por favor, tente novamente mais tarde.');
            return;
        }
        
        // Limpar o container
        container.innerHTML = '';
        
        // Verificar se existem artigos
        if (!articles || articles.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info w-100 text-center my-5">
                    Nenhum artigo encontrado para esta categoria.
                </div>
            `;
            return;
        }
        
        console.log(`Carregados ${articles.length} artigos`);
        
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
            
            // Adicionar imagem em destaque ao card do artigo
            const thumbnailHtml = article.thumbnail_link ? 
                `<div class="article-thumbnail">
                    <img src="${article.thumbnail_link}" alt="${article.title}" class="img-fluid">
                 </div>` : '';
            
            articleCard.innerHTML = `
                <div class="article-header">
                    <span class="article-badge ${badgeClass}">${badgeText}</span>
                    <span class="article-date"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
                </div>
                ${thumbnailHtml}
                <div class="article-body">
                    <h3 class="article-title">${article.title || 'Sem título'}</h3>
                    <p class="article-authors"><i class="bi bi-person-badge"></i> ${article.authors || 'Autor desconhecido'}</p>
                    <p class="article-text">${article.abstract || 'Sem resumo disponível.'}</p>
                    <div class="article-footer">
                        <div class="article-stats">
                            <span><i class="bi bi-eye"></i> ${views} visualizações</span>
                            <span><i class="bi bi-download"></i> ${downloads} downloads</span>
                            ${article.journal ? `<span><i class="bi bi-journals"></i> ${article.journal}</span>` : ''}
                        </div>
                        <a href="javascript:void(0);" class="article-link" data-id="${article.id}">Ler artigo <i class="bi bi-arrow-right"></i></a>
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
        
        // Restaurar filtros ativos
        const activeFilter = document.querySelector('#articles-tab .filter-pill.active');
        if (activeFilter && activeFilter.getAttribute('data-filter') !== 'all') {
            filterArticles(activeFilter.getAttribute('data-filter'));
        }
        
        console.log('Artigos carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
        showErrorMessage(container, 'Ocorreu um erro ao carregar os artigos. Por favor, tente novamente mais tarde.');
    }
}

/**
 * Carrega os materiais e eventos do Supabase
 */
async function loadMaterialsFromSupabase() {
    console.log('Carregando materiais e eventos do Supabase...');
    const container = document.getElementById('materials-container');
    if (!container) {
        console.error('Container de materiais não encontrado');
        return;
    }
    
    try {
        // Verificar se o cliente Supabase está disponível
        if (!supabase) {
            showErrorMessage(container, 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.');
            return;
        }
        
        // Obter a categoria atual
        const currentCategory = getCurrentCategory();
        
        // Buscar materiais do Supabase
        let materialsQuery = supabase
            .from('materials')
            .select('*');
        
        // Buscar eventos do Supabase
        let eventsQuery = supabase
            .from('events')
            .select('*');
        
        // Filtrar por categoria se necessário
        if (currentCategory) {
            materialsQuery = materialsQuery.eq('category', currentCategory);
            eventsQuery = eventsQuery.eq('category', currentCategory);
        }
        
        // Ordenar os resultados
        materialsQuery = materialsQuery.order('created_at', { ascending: false });
        eventsQuery = eventsQuery.order('event_date', { ascending: true });
        
        // Executar consultas em paralelo
        const [materialsResult, eventsResult] = await Promise.all([
            materialsQuery,
            eventsQuery
        ]);
        
        const materials = materialsResult.data || [];
        const events = eventsResult.data || [];
        
        if (materialsResult.error) {
            console.error('Erro ao carregar materiais:', materialsResult.error);
        }
        
        if (eventsResult.error) {
            console.error('Erro ao carregar eventos:', eventsResult.error);
        }
        
        // Limpar o container
        container.innerHTML = '';
        
        // Verificar se existem materiais ou eventos
        if (materials.length === 0 && events.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info w-100 text-center my-5">
                    Nenhum material ou evento encontrado para esta categoria.
                </div>
            `;
            return;
        }
        
        console.log(`Carregados ${materials.length} materiais e ${events.length} eventos`);
        
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
                case 'ebook':
                    badgeClass = 'ebook';
                    badgeText = 'E-book';
                    break;
                case 'software':
                    badgeClass = 'software';
                    badgeText = 'Software';
                    break;
                default:
                    badgeClass = 'guide';
                    badgeText = material.type || 'Material';
            }
            
            // Criar elemento de material
            const materialCard = document.createElement('div');
            materialCard.className = `material-card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`;
            
            materialCard.innerHTML = `
                <img src="${material.cover_link || 'https://via.placeholder.com/800x400?text=Material'}" alt="${material.title}" class="material-image">
                <div class="material-content">
                    <span class="material-badge ${badgeClass}">${badgeText}</span>
                    <h3 class="material-title">${material.title || 'Sem título'}</h3>
                    <p class="material-details"><i class="bi bi-file-earmark-pdf"></i> PDF${material.description ? ` - ${material.description}` : ''}</p>
                    <a href="${material.file_link || '#'}" target="_blank" class="material-button" data-id="${material.id}" data-type="material">
                        Baixar PDF <i class="bi bi-download"></i>
                    </a>
                </div>
            `;
            
            container.appendChild(materialCard);
        });
        
        // Renderizar eventos
        events.forEach((event, index) => {
            // Processar data do evento
            const eventDate = new Date(event.event_date);
            const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            const month = monthNames[eventDate.getMonth()];
            const day = eventDate.getDate();
            
            // Criar elemento de evento
            const eventCard = document.createElement('div');
            eventCard.className = `material-card event-card fade-in ${index > 0 ? `fade-in-delay-${Math.min(index, 3)}` : ''}`;
            
            eventCard.innerHTML = `
                <div class="event-date-badge">
                    <span class="event-month">${month}</span>
                    <span class="event-day">${day}</span>
                </div>
                <img src="${event.image_link || 'https://via.placeholder.com/800x400?text=Evento'}" alt="${event.title}" class="material-image">
                <div class="material-content">
                    <span class="material-badge event">${event.event_type || 'Evento'}</span>
                    <h3 class="material-title">${event.title || 'Sem título'}</h3>
                    <p class="material-details"><i class="bi bi-geo-alt"></i> ${event.location || 'Local não especificado'}</p>
                    <a href="javascript:void(0);" class="material-button" data-id="${event.id}" data-type="event">
                        Ver detalhes <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
            `;
            
            container.appendChild(eventCard);
        });
        
        // Adicionar eventos aos botões de materiais
        document.querySelectorAll('.material-button[data-type="material"]').forEach(button => {
            if (button.getAttribute('href') === '#') {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const id = this.getAttribute('data-id');
                    showMaterialDetails(id);
                });
            }
        });
        
        // Adicionar eventos aos botões de eventos
        document.querySelectorAll('.material-button[data-type="event"]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                showEventDetails(id);
            });
        });
        
        // Configurar botão "Carregar mais"
        const loadMoreBtn = document.getElementById('loadMoreMaterials');
        if (loadMoreBtn) {
            if (materials.length + events.length <= 6) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = '';
            }
        }
        
        // Restaurar filtros ativos
        const activeFilter = document.querySelector('#materials-tab .filter-pill.active');
        if (activeFilter && activeFilter.getAttribute('data-filter') !== 'all') {
            filterMaterials(activeFilter.getAttribute('data-filter'));
        }
        
        console.log('Materiais e eventos carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar materiais e eventos:', error);
        showErrorMessage(container, 'Ocorreu um erro ao carregar os materiais. Por favor, tente novamente mais tarde.');
    }
}

/**
 * Exibe os detalhes de um artigo em um modal
 */
async function showArticleDetails(articleId) {
    console.log('Exibindo detalhes do artigo:', articleId);
    
    try {
        // Verificar se o cliente Supabase está disponível
        if (!supabase) {
            showErrorBanner('Não foi possível conectar ao banco de dados. Tente recarregar a página.');
            return;
        }
        
        // Atualizar o conteúdo do modal para mostrar o loading
        const modalContent = document.getElementById('articleDetailContent');
        if (!modalContent) {
            console.error('Elemento #articleDetailContent não encontrado');
            return;
        }
        
        modalContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3">Carregando detalhes do artigo...</p>
            </div>
        `;
        
        // Abrir o modal
        const modalElement = document.getElementById('articleDetailModal');
        if (!modalElement) {
            console.error('Elemento #articleDetailModal não encontrado');
            return;
        }
        
        // Abrir o modal usando Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            // Fallback para caso o Bootstrap não esteja disponível
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
        }
        
        // Buscar artigo pelo ID no Supabase
        const { data: article, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();
        
        if (error) {
            console.error('Erro ao buscar artigo:', error);
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Não foi possível carregar os detalhes do artigo. Por favor, tente novamente mais tarde.
                </div>
            `;
            return;
        }
        
        if (!article) {
            console.error('Artigo não encontrado:', articleId);
            modalContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill"></i> Artigo não encontrado.
                </div>
            `;
            return;
        }
        
        // Adiciona a imagem em destaque ao topo dos detalhes se disponível
        const thumbnailSection = article.thumbnail_link ? 
            `<div class="image-section mb-4">
                <img src="${article.thumbnail_link}" alt="${article.title}" class="img-fluid rounded">
            </div>` : '';
        
        modalContent.innerHTML = `
            ${thumbnailSection}
            <div class="article-meta mb-4">
                <div class="article-authors mb-2">${article.authors || 'Autor desconhecido'}</div>
                <div class="d-flex flex-wrap text-muted small mb-2">
                    <span class="me-3"><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
                    ${article.journal ? `<span class="me-3"><i class="bi bi-journal"></i> ${article.journal}</span>` : ''}
                    ${article.doi ? `<span><i class="bi bi-link-45deg"></i> DOI: ${article.doi}</span>` : ''}
                </div>
                <div class="badge ${getCategoryBadgeClass(article.category, article.subcategory)}">${article.subcategory || article.category || 'Geral'}</div>
            </div>
            
            <div class="abstract-section mb-4">
                <h6>Resumo</h6>
                <p>${article.abstract || 'Sem resumo disponível.'}</p>
            </div>
            
            ${article.content ? `
            <div class="content-section mb-4">
                <h6>Conteúdo</h6>
                <div>${article.content}</div>
            </div>` : ''}
            
            ${article.tags && (typeof article.tags === 'string' || Array.isArray(article.tags)) ? `
            <div class="tags-section mt-4">
                <h6>Tags</h6>
                <div>${Array.isArray(article.tags) 
                    ? article.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag.trim()}</span>`).join('') 
                    : typeof article.tags === 'string' 
                        ? article.tags.split(',').map(tag => `<span class="badge bg-light text-dark me-1">${tag.trim()}</span>`).join('')
                        : ''
                }</div>
            </div>` : ''}
        `;
        
        // Configurar botões de download e visualização
        const downloadBtn = document.getElementById('downloadArticleBtn');
        const viewBtn = document.getElementById('viewArticleBtn');
        
        if (downloadBtn) {
            if (article.file_link) {
                downloadBtn.href = article.file_link;
                downloadBtn.classList.remove('disabled');
            } else {
                downloadBtn.href = '#';
                downloadBtn.classList.add('disabled');
            }
        }
        
        if (viewBtn) {
            if (article.file_link) {
                viewBtn.href = article.file_link;
                viewBtn.classList.remove('disabled');
            } else {
                viewBtn.href = '#';
                viewBtn.classList.add('disabled');
            }
        }
        
        console.log('Detalhes do artigo exibidos com sucesso');
    } catch (error) {
        console.error('Erro ao exibir detalhes do artigo:', error);
        const modalContent = document.getElementById('articleDetailContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Ocorreu um erro ao carregar os detalhes. Por favor, tente novamente mais tarde.
                </div>
            `;
        }
    }
}

/**
 * Exibe os detalhes de um evento em um modal
 */
async function showEventDetails(eventId) {
    console.log('Exibindo detalhes do evento:', eventId);
    
    try {
        // Verificar se o cliente Supabase está disponível
        if (!supabase) {
            showErrorBanner('Não foi possível conectar ao banco de dados. Tente recarregar a página.');
            return;
        }
        
        // Atualizar o conteúdo do modal para mostrar o loading
        const modalContent = document.getElementById('materialDetailContent');
        if (!modalContent) {
            console.error('Elemento #materialDetailContent não encontrado');
            return;
        }
        
        modalContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3">Carregando detalhes do evento...</p>
            </div>
        `;
        
        // Abrir o modal
        const modalElement = document.getElementById('materialDetailModal');
        if (!modalElement) {
            console.error('Elemento #materialDetailModal não encontrado');
            return;
        }
        
        // Abrir o modal usando Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            // Fallback para caso o Bootstrap não esteja disponível
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
        }
        
        // Configurar título do modal
        const modalTitle = document.getElementById('materialDetailModalLabel');
        if (modalTitle) {
            modalTitle.textContent = 'Detalhes do Evento';
        }
        
        // Buscar evento pelo ID no Supabase
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();
        
        if (error) {
            console.error('Erro ao buscar evento:', error);
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Não foi possível carregar os detalhes do evento. Por favor, tente novamente mais tarde.
                </div>
            `;
            return;
        }
        
        if (!event) {
            console.error('Evento não encontrado:', eventId);
            modalContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill"></i> Evento não encontrado.
                </div>
            `;
            return;
        }
        
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${event.image_link || 'https://via.placeholder.com/400x300?text=Evento'}" alt="${event.title}" class="img-fluid rounded">
                    <div class="event-date-card mt-3 text-center p-3 bg-light rounded">
                        <h5 class="mb-0">${formatDate(event.event_date)}</h5>
                        <span class="text-muted">${formatTime(event.event_date)}</span>
                    </div>
                </div>
                <div class="col-md-8">
                    <h4>${event.title || 'Sem título'}</h4>
                    <div class="d-flex flex-wrap text-muted small mb-3">
                        <span class="me-3"><i class="bi bi-tag"></i> ${event.event_type || 'Evento'}</span>
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
        
        console.log('Detalhes do evento exibidos com sucesso');
    } catch (error) {
        console.error('Erro ao exibir detalhes do evento:', error);
        const modalContent = document.getElementById('materialDetailContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Ocorreu um erro ao carregar os detalhes. Por favor, tente novamente mais tarde.
                </div>
            `;
        }
    }
}

/**
 * Exibe os detalhes de um material em um modal
 */
async function showMaterialDetails(materialId) {
    console.log('Exibindo detalhes do material:', materialId);
    
    try {
        // Verificar se o cliente Supabase está disponível
        if (!supabase) {
            showErrorBanner('Não foi possível conectar ao banco de dados. Tente recarregar a página.');
            return;
        }
        
        // Atualizar o conteúdo do modal para mostrar o loading
        const modalContent = document.getElementById('materialDetailContent');
        if (!modalContent) {
            console.error('Elemento #materialDetailContent não encontrado');
            return;
        }
        
        modalContent.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-3">Carregando detalhes do material...</p>
            </div>
        `;
        
        // Abrir o modal
        const modalElement = document.getElementById('materialDetailModal');
        if (!modalElement) {
            console.error('Elemento #materialDetailModal não encontrado');
            return;
        }
        
        // Abrir o modal usando Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } else {
            // Fallback para caso o Bootstrap não esteja disponível
            modalElement.style.display = 'block';
            modalElement.classList.add('show');
        }
        
        // Configurar título do modal
        const modalTitle = document.getElementById('materialDetailModalLabel');
        if (modalTitle) {
            modalTitle.textContent = 'Detalhes do Material';
        }
        
        // Buscar material pelo ID no Supabase
        const { data: material, error } = await supabase
            .from('materials')
            .select('*')
            .eq('id', materialId)
            .single();
        
        if (error) {
            console.error('Erro ao buscar material:', error);
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Não foi possível carregar os detalhes do material. Por favor, tente novamente mais tarde.
                </div>
            `;
            return;
        }
        
        if (!material) {
            console.error('Material não encontrado:', materialId);
            modalContent.innerHTML = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle-fill"></i> Material não encontrado.
                </div>
            `;
            return;
        }
        
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${material.cover_link || 'https://via.placeholder.com/400x500?text=Material'}" alt="${material.title}" class="img-fluid rounded">
                </div>
                <div class="col-md-8">
                    <h4>${material.title || 'Sem título'}</h4>
                    <div class="d-flex flex-wrap text-muted small mb-3">
                        <span class="me-3"><i class="bi bi-tag"></i> ${material.type || 'Material'}</span>
                        <span class="me-3"><i class="bi bi-calendar3"></i> ${formatDate(material.created_at)}</span>
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
        if (downloadBtn) {
            if (material.file_link) {
                downloadBtn.href = material.file_link;
                downloadBtn.textContent = `Baixar ${material.type || 'Material'}`;
                downloadBtn.style.display = '';
            } else {
                downloadBtn.href = '#';
                downloadBtn.style.display = 'none';
            }
        }
        
        console.log('Detalhes do material exibidos com sucesso');
    } catch (error) {
        console.error('Erro ao exibir detalhes do material:', error);
        const modalContent = document.getElementById('materialDetailContent');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Ocorreu um erro ao carregar os detalhes. Por favor, tente novamente mais tarde.
                </div>
            `;
        }
    }
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
    } else if (path.includes('misc')) {
        return 'diversos';
    }
    
    return null;
}

/**
 * Funções auxiliares para determinar classes e textos de badge
 */
function getBadgeClassForSubcategory(subcategory) {
    if (!subcategory) return 'featured';
    
    switch (subcategory.toLowerCase()) {
        case 'upstream':
            return 'upstream';
        case 'midstream':
            return 'midstream';
        case 'downstream':
            return 'downstream';
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
    if (!subcategory) return 'Destaque';
    
    switch (subcategory.toLowerCase()) {
        case 'upstream':
            return 'Upstream';
        case 'midstream':
            return 'Midstream';
        case 'downstream':
            return 'Downstream';
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
            return subcategory;
    }
}

/**
 * Retorna a classe CSS para o badge de categoria
 */
function getCategoryBadgeClass(category, subcategory) {
    if (subcategory) {
        switch (subcategory.toLowerCase()) {
            case 'upstream':
                return 'bg-success';
            case 'midstream':
                return 'bg-info';
            case 'downstream':
                return 'bg-primary';
            case 'civil':
                return 'bg-success';
            case 'mecanica':
            case 'mechanical':
                return 'bg-primary';
            case 'eletrica':
            case 'electrical':
                return 'bg-warning';
            case 'computacao':
            case 'computer':
                return 'bg-info';
        }
    }
    
    // Classes baseadas na categoria principal
    if (!category) return 'bg-secondary';
    
    switch (category.toLowerCase()) {
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
        if (isNaN(date.getTime())) return dateStr;
        
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).format(date);
    } catch (error) {
        console.warn('Erro ao formatar data:', error);
        return dateStr || '';
    }
}

/**
 * Formata a hora
 */
function formatTime(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        
        return new Intl.DateTimeFormat('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        console.warn('Erro ao formatar hora:', error);
        return '';
    }
}