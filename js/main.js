/**
 * main.js - Funções principais para o blog público
 */
document.addEventListener('DOMContentLoaded', function() {
    // Carregar artigos em destaque na página inicial
    loadFeaturedArticles();
    
    // Inicializar outras funcionalidades
    initThemeToggle();
    initLanguageToggle();
});

/**
 * Carrega os artigos em destaque na página inicial
 */
function loadFeaturedArticles() {
    const carouselInner = document.querySelector('#featuredCarousel .carousel-inner');
    if (!carouselInner) return;
    
    try {
        // Carregar artigos do localStorage
        const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
        
        // Filtrar apenas artigos publicados e ordenar por data
        const publishedArticles = articles
            .filter(article => article.status === 'publicado')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Pegar os 3 primeiros para o carrossel
        const featuredArticles = publishedArticles.slice(0, 3);
        
        if (featuredArticles.length === 0) return;
        
        // Limpar o carrossel
        carouselInner.innerHTML = '';
        
        // Adicionar os artigos ao carrossel
        featuredArticles.forEach((article, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            carouselItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.abstract.substring(0, 120)}...</p>
                        <a href="${getCategoryUrl(article.category)}/publications.html#article-${article.id}" class="btn btn-primary">Ler mais</a>
                    </div>
                </div>
            `;
            
            carouselInner.appendChild(carouselItem);
        });
    } catch (error) {
        console.error('Erro ao carregar artigos em destaque:', error);
    }
}

/**
 * Retorna a URL da categoria
 * @param {string} category - Categoria do artigo
 * @returns {string} - URL da categoria
 */
function getCategoryUrl(category) {
    const categoryMap = {
        'medicina': 'medicine',
        'engenharia': 'engineering',
        'petroleo-gas': 'oil-gas',
        'ingles': 'english',
        'diversos': 'misc'
    };
    
    return `pages/${categoryMap[category.toLowerCase()] || 'misc'}`;
}

/**
 * Inicializa o alternador de tema claro/escuro
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const themeStyleLink = document.getElementById('theme-style');
    
    // Verificar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Adicionar evento de clique
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    function setTheme(theme) {
        if (themeStyleLink) {
            themeStyleLink.href = `css/themes/${theme}.css`;
        }
        
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        localStorage.setItem('theme', theme);
    }
}

/**
 * Inicializa o alternador de idiomas
 */
function initLanguageToggle() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    // Verificar idioma salvo
    const savedLang = localStorage.getItem('language') || 'pt';
    setActiveLanguage(savedLang);
    
    // Adicionar eventos de clique
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setActiveLanguage(lang);
            localStorage.setItem('language', lang);
            
            // Idealmente, aqui chamaria uma função para traduzir o conteúdo
            // Mas vamos apenas recarregar a página por simplicidade
            // window.location.reload();
        });
    });
    
    function setActiveLanguage(lang) {
        languageButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}