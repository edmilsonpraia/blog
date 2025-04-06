// data.js - Adaptador de compatibilidade para o Supabase
console.log('data.js carregado - Adaptador de compatibilidade para Supabase');

/**
 * Este arquivo serve como uma camada de compatibilidade para o código que depende
 * do antigo AdminData baseado em localStorage.
 * Ele redireciona todas as chamadas para os métodos do Supabase (BlogData)
 */

// Função para verificar se o Supabase está disponível
function checkSupabaseAvailability() {
    if (typeof window.supabaseClient !== 'undefined' && typeof window.BlogData !== 'undefined') {
        console.log('Cliente Supabase detectado, inicializando camada de compatibilidade');
        initAdminDataAdapter();
        return true;
    }
    return false;
}

// Inicializar AdminData como um adaptador para o BlogData/Supabase
function initAdminDataAdapter() {
    // Definir AdminData como um proxy para os métodos do BlogData
    window.AdminData = {
        // Método de inicialização (compatibilidade)
        init: function() {
            console.log('AdminData.init() chamado - usando Supabase');
            // Não é mais necessário inicializar localStorage
            console.log('Adaptador AdminData inicializado para Supabase');
        },
        
        // Métodos para Artigos
        articles: {
            getAll: async function() {
                console.log('AdminData.articles.getAll() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.fetchArticles();
                } catch (error) {
                    console.error('Erro ao obter artigos do Supabase:', error);
                    // Fallback para localStorage caso Supabase falhe
                    return JSON.parse(localStorage.getItem('blogArticles') || '[]');
                }
            },
            add: async function(article) {
                console.log('AdminData.articles.add() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.addArticle(article);
                } catch (error) {
                    console.error('Erro ao adicionar artigo no Supabase:', error);
                    // Fallback para localStorage
                    const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
                    article.id = Date.now().toString();
                    article.created_at = new Date().toISOString();
                    articles.push(article);
                    localStorage.setItem('blogArticles', JSON.stringify(articles));
                    return article;
                }
            },
            update: async function(id, updatedArticle) {
                console.log('AdminData.articles.update() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.updateArticle(id, updatedArticle);
                    return true;
                } catch (error) {
                    console.error('Erro ao atualizar artigo no Supabase:', error);
                    // Fallback para localStorage
                    const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
                    const index = articles.findIndex(article => article.id === id);
                    if (index !== -1) {
                        articles[index] = { ...articles[index], ...updatedArticle };
                        localStorage.setItem('blogArticles', JSON.stringify(articles));
                        return true;
                    }
                    return false;
                }
            },
            delete: async function(id) {
                console.log('AdminData.articles.delete() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.deleteArticle(id);
                    return true;
                } catch (error) {
                    console.error('Erro ao excluir artigo no Supabase:', error);
                    // Fallback para localStorage
                    const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
                    const filtered = articles.filter(article => article.id !== id);
                    localStorage.setItem('blogArticles', JSON.stringify(filtered));
                    return articles.length !== filtered.length;
                }
            }
        },
        
        // Métodos para Eventos
        events: {
            getAll: async function() {
                console.log('AdminData.events.getAll() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.fetchEvents();
                } catch (error) {
                    console.error('Erro ao obter eventos do Supabase:', error);
                    // Fallback para localStorage
                    return JSON.parse(localStorage.getItem('blogEvents') || '[]');
                }
            },
            add: async function(event) {
                console.log('AdminData.events.add() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.addEvent(event);
                } catch (error) {
                    console.error('Erro ao adicionar evento no Supabase:', error);
                    // Fallback para localStorage
                    const events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
                    event.id = Date.now().toString();
                    event.created_at = new Date().toISOString();
                    events.push(event);
                    localStorage.setItem('blogEvents', JSON.stringify(events));
                    return event;
                }
            },
            update: async function(id, updatedEvent) {
                console.log('AdminData.events.update() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.updateEvent(id, updatedEvent);
                    return true;
                } catch (error) {
                    console.error('Erro ao atualizar evento no Supabase:', error);
                    // Fallback para localStorage
                    const events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
                    const index = events.findIndex(event => event.id === id);
                    if (index !== -1) {
                        events[index] = { ...events[index], ...updatedEvent };
                        localStorage.setItem('blogEvents', JSON.stringify(events));
                        return true;
                    }
                    return false;
                }
            },
            delete: async function(id) {
                console.log('AdminData.events.delete() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.deleteEvent(id);
                    return true;
                } catch (error) {
                    console.error('Erro ao excluir evento no Supabase:', error);
                    // Fallback para localStorage
                    const events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
                    const filtered = events.filter(event => event.id !== id);
                    localStorage.setItem('blogEvents', JSON.stringify(filtered));
                    return events.length !== filtered.length;
                }
            }
        },
        
        // Métodos para Materiais
        materials: {
            getAll: async function() {
                console.log('AdminData.materials.getAll() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.fetchMaterials();
                } catch (error) {
                    console.error('Erro ao obter materiais do Supabase:', error);
                    // Fallback para localStorage
                    return JSON.parse(localStorage.getItem('blogMaterials') || '[]');
                }
            },
            add: async function(material) {
                console.log('AdminData.materials.add() chamado - redirecionando para Supabase');
                try {
                    return await window.BlogData.addMaterial(material);
                } catch (error) {
                    console.error('Erro ao adicionar material no Supabase:', error);
                    // Fallback para localStorage
                    const materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
                    material.id = Date.now().toString();
                    material.created_at = new Date().toISOString();
                    materials.push(material);
                    localStorage.setItem('blogMaterials', JSON.stringify(materials));
                    return material;
                }
            },
            update: async function(id, updatedMaterial) {
                console.log('AdminData.materials.update() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.updateMaterial(id, updatedMaterial);
                    return true;
                } catch (error) {
                    console.error('Erro ao atualizar material no Supabase:', error);
                    // Fallback para localStorage
                    const materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
                    const index = materials.findIndex(material => material.id === id);
                    if (index !== -1) {
                        materials[index] = { ...materials[index], ...updatedMaterial };
                        localStorage.setItem('blogMaterials', JSON.stringify(materials));
                        return true;
                    }
                    return false;
                }
            },
            delete: async function(id) {
                console.log('AdminData.materials.delete() chamado - redirecionando para Supabase');
                try {
                    await window.BlogData.deleteMaterial(id);
                    return true;
                } catch (error) {
                    console.error('Erro ao excluir material no Supabase:', error);
                    // Fallback para localStorage
                    const materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
                    const filtered = materials.filter(material => material.id !== id);
                    localStorage.setItem('blogMaterials', JSON.stringify(filtered));
                    return materials.length !== filtered.length;
                }
            }
        },
        
        // Contagem de estatísticas
        getCounts: async function() {
            console.log('AdminData.getCounts() chamado - redirecionando para Supabase');
            try {
                return await window.BlogData.getCounts();
            } catch (error) {
                console.error('Erro ao obter contagens do Supabase:', error);
                // Fallback para localStorage
                const articles = JSON.parse(localStorage.getItem('blogArticles') || '[]');
                const events = JSON.parse(localStorage.getItem('blogEvents') || '[]');
                const materials = JSON.parse(localStorage.getItem('blogMaterials') || '[]');
                
                return {
                    articles: articles.length,
                    events: events.length,
                    materials: materials.length,
                    total: articles.length + events.length + materials.length
                };
            }
        }
    };
    
    console.log('Camada de compatibilidade AdminData configurada com sucesso');
}

// Verificar se o Supabase está disponível imediatamente
let isSupabaseAvailable = checkSupabaseAvailability();

// Se o Supabase não estiver disponível, esperar o DOMContentLoaded
if (!isSupabaseAvailable) {
    console.log('Supabase ainda não disponível, tentando novamente após o DOM carregar');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('data.js: DOMContentLoaded');
        
        // Verificar novamente se o Supabase está disponível
        isSupabaseAvailable = checkSupabaseAvailability();
        
        // Se ainda não estiver disponível, iniciar temporizador para verificações periódicas
        if (!isSupabaseAvailable) {
            console.log('Aguardando inicialização do Supabase...');
            
            let attempts = 0;
            const maxAttempts = 20; // 10 segundos total
            
            const checkInterval = setInterval(() => {
                attempts++;
                isSupabaseAvailable = checkSupabaseAvailability();
                
                if (isSupabaseAvailable) {
                    console.log(`Supabase disponível após ${attempts} tentativas`);
                    clearInterval(checkInterval);
                } else if (attempts >= maxAttempts) {
                    console.error('Tempo esgotado. Supabase não inicializado. Usando localStorage como fallback');
                    clearInterval(checkInterval);
                    
                    // Configurar AdminData para usar apenas localStorage
                    initLocalStorageFallback();
                }
            }, 500);
        }
    });
}

// Inicializar AdminData usando apenas localStorage (fallback)
function initLocalStorageFallback() {
    console.log('Inicializando AdminData com localStorage (fallback)');
    
    // Recriar a implementação original do AdminData baseada em localStorage
    window.AdminData = {
        // Inicializar dados do localStorage
        init: function() {
            console.log('AdminData.init() chamado (localStorage fallback)');
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
            
            console.log('Dados do admin inicializados (localStorage fallback)');
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
                article.created_at = new Date().toISOString();
                
                articles.push(article);
                localStorage.setItem('blogArticles', JSON.stringify(articles));
                console.log('Artigo adicionado (localStorage fallback):', article);
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
                event.created_at = new Date().toISOString();
                
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
                material.created_at = new Date().toISOString();
                
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
    
    // Inicializar dados
    window.AdminData.init();
}

// Expor função para testes
window.checkAdminData = function() {
    console.log('Verificando AdminData...');
    return typeof window.AdminData !== 'undefined';
};