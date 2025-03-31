// data.js - Armazena e gerencia dados do blog
console.log('data.js carregado - versão simplificada');

// Definir AdminData como variável global
window.AdminData = {
    // Inicializar dados do localStorage
    init: function() {
        console.log('AdminData.init() chamado');
        // Verificar se já existem dados salvos
        if (!localStorage.getItem('blogArticles')) {
            localStorage.setItem('blogArticles', JSON.stringify([]));
        }
        if (!localStorage.getItem('blogEvents')) {
            localStorage.setItem('blogEvents', JSON.stringify([]));
        }
        if (!localStorage.getItem('blogMaterials')) {
            localStorage.setItem('blogMaterials', JSON.stringify([]));
        }
        
        console.log('Dados do admin inicializados');
    },
    
    // Métodos para Artigos
    articles: {
        getAll: function() {
            return JSON.parse(localStorage.getItem('blogArticles') || '[]');
        },
        add: function(article) {
            const articles = this.getAll();
            // Adicionar ID único e data de criação
            article.id = Date.now().toString();
            article.createdAt = new Date().toISOString();
            
            articles.push(article);
            localStorage.setItem('blogArticles', JSON.stringify(articles));
            console.log('Artigo adicionado:', article);
            return article;
        },
        update: function(id, updatedArticle) {
            const articles = this.getAll();
            const index = articles.findIndex(article => article.id === id);
            if (index !== -1) {
                articles[index] = { ...articles[index], ...updatedArticle };
                localStorage.setItem('blogArticles', JSON.stringify(articles));
                return true;
            }
            return false;
        },
        delete: function(id) {
            const articles = this.getAll();
            const filtered = articles.filter(article => article.id !== id);
            localStorage.setItem('blogArticles', JSON.stringify(filtered));
            return articles.length !== filtered.length;
        }
    },
    
    // Métodos para Eventos
    events: {
        getAll: function() {
            return JSON.parse(localStorage.getItem('blogEvents') || '[]');
        },
        add: function(event) {
            const events = this.getAll();
            event.id = Date.now().toString();
            event.createdAt = new Date().toISOString();
            
            events.push(event);
            localStorage.setItem('blogEvents', JSON.stringify(events));
            return event;
        },
        update: function(id, updatedEvent) {
            const events = this.getAll();
            const index = events.findIndex(event => event.id === id);
            if (index !== -1) {
                events[index] = { ...events[index], ...updatedEvent };
                localStorage.setItem('blogEvents', JSON.stringify(events));
                return true;
            }
            return false;
        },
        delete: function(id) {
            const events = this.getAll();
            const filtered = events.filter(event => event.id !== id);
            localStorage.setItem('blogEvents', JSON.stringify(filtered));
            return events.length !== filtered.length;
        }
    },
    
    // Métodos para Materiais
    materials: {
        getAll: function() {
            return JSON.parse(localStorage.getItem('blogMaterials') || '[]');
        },
        add: function(material) {
            const materials = this.getAll();
            material.id = Date.now().toString();
            material.createdAt = new Date().toISOString();
            
            materials.push(material);
            localStorage.setItem('blogMaterials', JSON.stringify(materials));
            return material;
        },
        update: function(id, updatedMaterial) {
            const materials = this.getAll();
            const index = materials.findIndex(material => material.id === id);
            if (index !== -1) {
                materials[index] = { ...materials[index], ...updatedMaterial };
                localStorage.setItem('blogMaterials', JSON.stringify(materials));
                return true;
            }
            return false;
        },
        delete: function(id) {
            const materials = this.getAll();
            const filtered = materials.filter(material => material.id !== id);
            localStorage.setItem('blogMaterials', JSON.stringify(filtered));
            return materials.length !== filtered.length;
        }
    },
    
    // Contagem de estatísticas
    getCounts: function() {
        return {
            articles: this.articles.getAll().length,
            events: this.events.getAll().length,
            materials: this.materials.getAll().length,
            total: this.articles.getAll().length + this.events.getAll().length + this.materials.getAll().length
        };
    }
};

// Inicializar dados quando o script carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('data.js: DOMContentLoaded');
    window.AdminData.init();
});

// Expor função para testes
window.checkAdminData = function() {
    console.log('Verificando AdminData...');
    return typeof AdminData !== 'undefined';
};