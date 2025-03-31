// js/components/dynamic-content.js

document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do localStorage
    function loadBlogData() {
        const blogData = {
            articles: JSON.parse(localStorage.getItem('blogArticles') || '[]'),
            events: JSON.parse(localStorage.getItem('blogEvents') || '[]'),
            materials: JSON.parse(localStorage.getItem('blogMaterials') || '[]')
        };
        return blogData;
    }
    
    // Formatar data para exibição
    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return dateStr;
        }
    }
    
    // Carregar artigos em destaque no carrossel
    function loadFeaturedArticles() {
        const blogData = loadBlogData();
        const articles = blogData.articles;
        
        // Verificar se há artigos para exibir
        if (!articles || articles.length === 0) return;
        
        // Ordenar por data (mais recentes primeiro)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Pegar até 3 artigos mais recentes para o carrossel
        const featuredArticles = articles.slice(0, 3);
        
        // Referência ao carrossel
        const carouselInner = document.querySelector('#featuredCarousel .carousel-inner');
        if (!carouselInner) return;
        
        // Limpar carrossel existente
        carouselInner.innerHTML = '';
        
        // Adicionar artigos ao carrossel
        featuredArticles.forEach((article, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            carouselItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.abstract.substring(0, 150)}...</p>
                        <a href="${article.fileLink}" target="_blank" class="btn btn-primary">Ler mais</a>
                    </div>
                </div>
            `;
            
            carouselInner.appendChild(carouselItem);
        });
    }
    
    // Carregar e-books em destaque
    function loadFeaturedEbooks() {
        const blogData = loadBlogData();
        const materials = blogData.materials;
        
        // Verificar se há materiais para exibir
        if (!materials || materials.length === 0) return;
        
        // Filtrar apenas ebooks
        const ebooks = materials.filter(material => 
            material.type === 'ebook' || material.type === 'guia' || material.type === 'manual'
        );
        
        // Ordenar por data de criação (mais recentes primeiro)
        ebooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Pegar até 3 ebooks
        const featuredEbooks = ebooks.slice(0, 3);
        
        // Referência ao container de ebooks
        const ebooksContainer = document.querySelector('.ebooks-section .row');
        if (!ebooksContainer) return;
        
        // Limpar container existente
        ebooksContainer.innerHTML = '';
        
        // Se não há ebooks para exibir, mostrar mensagem
        if (featuredEbooks.length === 0) {
            ebooksContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nenhum e-book disponível no momento.</div></div>';
            return;
        }
        
        // Adicionar ebooks ao container
        featuredEbooks.forEach(ebook => {
            const ebookCard = document.createElement('div');
            ebookCard.className = 'col-md-4 mb-4';
            
            // Determinar se o ebook é gratuito
            const badge = ebook.access === 'gratuito' 
                ? '<span class="badge bg-success publication-badge">Gratuito</span>' 
                : (ebook.access === 'pago' ? '<span class="badge bg-primary publication-badge">Pago</span>' : '');
            
            // Usar capa fornecida ou imagem padrão
            const coverImage = ebook.coverLink || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
            
            ebookCard.innerHTML = `
                <div class="card publication-card h-100">
                    ${badge}
                    <img src="${coverImage}" class="card-img-top ebook-cover" alt="${ebook.title}">
                    <div class="card-body">
                        <h5 class="card-title">${ebook.title}</h5>
                        <p class="card-text">${ebook.description || 'Sem descrição disponível.'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="${ebook.access === 'gratuito' ? 'text-success' : 'text-primary'} fw-bold">
                                ${ebook.access === 'gratuito' ? 'Download Gratuito' : (ebook.access === 'pago' ? 'R$ 39,90' : 'Acesso Restrito')}
                            </span>
                            <a href="${ebook.fileLink}" target="_blank" class="btn btn-outline-primary">
                                ${ebook.access === 'gratuito' ? 'Baixar PDF' : 'Ver Detalhes'}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            ebooksContainer.appendChild(ebookCard);
        });
    }
    
    // Carregar artigos científicos recentes
    function loadRecentPapers() {
        const blogData = loadBlogData();
        const articles = blogData.articles;
        
        // Verificar se há artigos para exibir
        if (!articles || articles.length === 0) return;
        
        // Ordenar por data (mais recentes primeiro)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Pegar até 3 artigos mais recentes
        const recentPapers = articles.slice(0, 3);
        
        // Referência ao container de artigos
        const papersContainer = document.querySelector('.papers-section');
        if (!papersContainer) return;
        
        // Manter o título da seção
        const sectionTitle = papersContainer.querySelector('.section-title');
        const viewAllButton = `<div class="text-center mt-3">
            <a href="pages/publications/papers.html" class="btn btn-outline-primary">Ver todos os artigos científicos</a>
        </div>`;
        
        // Limpar container existente (mantendo o título)
        papersContainer.innerHTML = '';
        papersContainer.appendChild(sectionTitle);
        
        // Se não há artigos para exibir, mostrar mensagem
        if (recentPapers.length === 0) {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert alert-info';
            alertElement.textContent = 'Nenhum artigo científico disponível no momento.';
            papersContainer.appendChild(alertElement);
            papersContainer.innerHTML += viewAllButton;
            return;
        }
        
        // Adicionar artigos ao container
        recentPapers.forEach(paper => {
            const paperCard = document.createElement('div');
            paperCard.className = 'card mb-4 publication-card';
            
            // Formatação de dados para exibição
            const authors = paper.authors;
            const journal = paper.journal || 'Preprint';
            const date = formatDate(paper.date);
            const doi = paper.doi || '';
            
            paperCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${paper.title}</h5>
                    <p class="publication-authors">${authors} (${date.split('/')[2]})</p>
                    ${journal ? `<p class="journal-info"><strong>Publicado em:</strong> ${journal}</p>` : ''}
                    <p class="card-text">${paper.abstract}</p>
                    <div class="publication-meta">
                        ${doi ? `<span class="text-muted">DOI: ${doi}</span>` : '<span></span>'}
                        <div>
                            <a href="#" class="btn btn-sm btn-outline-primary me-2">Resumo</a>
                            <a href="${paper.fileLink}" target="_blank" class="btn btn-sm btn-primary">PDF</a>
                        </div>
                    </div>
                </div>
            `;
            
            papersContainer.appendChild(paperCard);
        });
        
        // Adicionar botão "Ver todos"
        papersContainer.innerHTML += viewAllButton;
    }
    
    // Inicializar todos os componentes dinâmicos
    function initDynamicContent() {
        loadFeaturedArticles();
        loadFeaturedEbooks();
        loadRecentPapers();
    }
    
    // Carregar conteúdo dinâmico
    initDynamicContent();
});