/**
 * Utilitário para carregar conteúdo dinamicamente de arquivos JSON
 * para o Blog Multilingue
 */

// Função para carregar e exibir artigos em destaque no carrossel
function loadFeaturedArticles() {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const featuredArticles = data.articles.filter(article => article.featured);
            const carouselInner = document.querySelector('#featuredCarousel .carousel-inner');
            
            if (carouselInner) {
                carouselInner.innerHTML = '';
                
                featuredArticles.forEach((article, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const articleHtml = `
                        <div class="carousel-item ${isActive}">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.summary}</p>
                                    <a href="pages/${article.category}/${article.slug}.html" class="btn btn-primary">Ler mais</a>
                                </div>
                            </div>
                        </div>
                    `;
                    carouselInner.innerHTML += articleHtml;
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar artigos em destaque:', error);
        });
}

// Função para carregar artigos por categoria
function loadArticlesByCategory(category, containerId, limit = 5) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const categoryArticles = data.articles.filter(article => article.category === category);
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = '';
                
                const articlesToShow = categoryArticles.slice(0, limit);
                
                articlesToShow.forEach(article => {
                    const articleHtml = `
                        <div class="article-item mb-3">
                            <h5><a href="pages/${article.category}/${article.slug}.html">${article.title}</a></h5>
                            <p>${article.summary}</p>
                            <small class="text-muted">Publicado em: ${formatDate(article.date)}</small>
                        </div>
                    `;
                    container.innerHTML += articleHtml;
                });
            }
        })
        .catch(error => {
            console.error(`Erro ao carregar artigos da categoria ${category}:`, error);
        });
}

// Função para carregar um artigo específico
function loadArticle(articleId, containerId) {
    fetch('../../data/articles.json')
        .then(response => response.json())
        .then(data => {
            const article = data.articles.find(a => a.id === articleId);
            const container = document.getElementById(containerId);
            
            if (container && article) {
                const articleHtml = `
                    <article class="blog-post">
                        <h1 class="blog-post-title">${article.title}</h1>
                        <p class="blog-post-meta">
                            ${formatDate(article.date)} por <a href="#">${article.author}</a>
                        </p>
                        <img src="${article.image}" alt="${article.title}" class="img-fluid mb-4">
                        <div class="blog-post-content">
                            ${article.content}
                        </div>
                        <div class="blog-post-tags mt-4">
                            <h5>Tags:</h5>
                            <div class="d-flex flex-wrap gap-2">
                                ${article.tags.map(tag => `<a href="#" class="btn btn-sm btn-outline-secondary">${tag}</a>`).join('')}
                            </div>
                        </div>
                    </article>
                `;
                container.innerHTML = articleHtml;
            } else {
                container.innerHTML = '<div class="alert alert-warning">Artigo não encontrado.</div>';
            }
        })
        .catch(error => {
            console.error(`Erro ao carregar artigo ${articleId}:`, error);
            if (container) {
                container.innerHTML = '<div class="alert alert-danger">Erro ao carregar o artigo. Por favor, tente novamente mais tarde.</div>';
            }
        });
}

// Função para carregar recursos (downloads)
function loadResources(category, containerId, limit = 10) {
    fetch('../../data/resources.json')
        .then(response => response.json())
        .then(data => {
            let resources = data.resources;
            
            // Filtrar por categoria se especificada
            if (category) {
                resources = resources.filter(resource => resource.category === category);
            }
            
            const container = document.getElementById(containerId);
            
            if (container) {
                container.innerHTML = '';
                
                const resourcesToShow = resources.slice(0, limit);
                
                if (resourcesToShow.length === 0) {
                    container.innerHTML = '<div class="alert alert-info">Nenhum recurso encontrado para esta categoria.</div>';
                    return;
                }
                
                resourcesToShow.forEach(resource => {
                    const resourceHtml = `
                        <div class="resource-item">
                            <h5>${resource.title}</h5>
                            <p>${resource.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-primary">${resource.type.toUpperCase()}</span>
                                <a href="${resource.url}" class="btn btn-sm btn-outline-primary" download>Download</a>
                            </div>
                            <hr>
                        </div>
                    `;
                    container.innerHTML += resourceHtml;
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar recursos:', error);
            if (container) {
                container.innerHTML = '<div class="alert alert-danger">Erro ao carregar os recursos. Por favor, tente novamente mais tarde.</div>';
            }
        });
}

// Função auxiliar para formatar datas
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', options);
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página inicial
    if (document.location.pathname === '/' || document.location.pathname.endsWith('index.html')) {
        loadFeaturedArticles();
    }
    
    // Carregar artigos por categoria se os containers existirem
    const categoryContainers = {
        'ingles': 'ingles-articles',
        'medicina': 'medicina-articles',
        'petroleo-gas': 'petroleo-gas-articles',
        'engenharias': 'engenharias-articles',
        'diversos': 'diversos-articles'
    };
    
    Object.entries(categoryContainers).forEach(([category, containerId]) => {
        const container = document.getElementById(containerId);
        if (container) {
            loadArticlesByCategory(category, containerId, 3);
        }
    });
    
    // Verificar se estamos em uma página de artigo
    const articleContainer = document.getElementById('article-content');
    if (articleContainer) {
        // Obter ID do artigo da URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (articleId) {
            loadArticle(articleId, 'article-content');
        }
    }
    
    // Verificar se estamos em uma página de recursos
    const resourcesContainer = document.getElementById('resources-container');
    if (resourcesContainer) {
        // Obter categoria da URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        loadResources(category, 'resources-container');
    }
});