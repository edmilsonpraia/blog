/**
 * article-handlers.js - Versão simplificada
 */

// Verificar se o AdminData existe
var isAdminDataAvailable = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Article handlers carregado');
    
    // Verificar se o AdminData está disponível
    if (typeof AdminData !== 'undefined') {
        console.log('AdminData encontrado e disponível');
        isAdminDataAvailable = true;
    } else {
        console.error('ERRO: AdminData não está disponível. Verifique se data.js foi carregado.');
    }
    
    // Inicializar botões
    initArticleButtons();
});

function initArticleButtons() {
    // Botão Novo Artigo
    const newArticleBtn = document.getElementById('new-article-btn');
    if (newArticleBtn) {
        console.log('Botão de artigo encontrado');
        newArticleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de artigo clicado');
            openArticleModal();
        });
    }
}

function openArticleModal() {
    console.log('Abrindo modal de artigo');
    
    // Obter o modal
    const modal = document.getElementById('uploadArticleModal');
    
    if (!modal) {
        console.error('Modal não encontrado');
        return;
    }
    
    // Verificar se o Bootstrap está disponível
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error('Bootstrap não está disponível');
        alert('Erro: Bootstrap não está disponível');
        return;
    }
    
    try {
        // Tentar abrir o modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        console.log('Modal exibido com sucesso');
        
        // Adicionar evento ao botão de salvar
        const saveBtn = document.getElementById('save-article-btn');
        if (saveBtn) {
            saveBtn.onclick = saveArticle;
        }
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Erro ao abrir modal: ' + error.message);
    }
}

function saveArticle() {
    console.log('Salvando artigo...');
    
    if (!isAdminDataAvailable) {
        console.error('Não é possível salvar: AdminData não está disponível');
        alert('Erro: AdminData não está disponível');
        return;
    }
    
    try {
        // Obter dados do formulário
        const articleData = {
            title: document.getElementById('article-title').value,
            date: document.getElementById('article-date').value,
            authors: document.getElementById('article-authors').value,
            category: document.getElementById('article-category').value,
            subcategory: document.getElementById('article-subcategory').value || '',
            journal: document.getElementById('article-journal').value || '',
            doi: document.getElementById('article-doi').value || '',
            abstract: document.getElementById('article-abstract').value,
            content: document.getElementById('article-content').value || '',
            status: document.getElementById('article-status').value || 'publicado',
            language: document.getElementById('article-language').value || 'pt',
            access: document.getElementById('article-access').value || 'publico',
            tags: document.getElementById('article-tags').value || '',
            // Não incluímos os arquivos aqui para simplificar
        };
        
        console.log('Dados do artigo:', articleData);
        
        // Salvar usando AdminData
        AdminData.articles.add(articleData);
        
        console.log('Artigo salvo com sucesso');
        alert('Artigo salvo com sucesso!');
        
        // Fechar modal
        const modalElement = document.getElementById('uploadArticleModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
        
        // Limpar formulário
        document.getElementById('scientific-article-form').reset();
        
    } catch (error) {
        console.error('Erro ao salvar artigo:', error);
        alert('Erro ao salvar artigo: ' + error.message);
    }
}