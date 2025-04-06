/**
 * article-handlers.js - Versão atualizada para Supabase
 */

// Verificar se o BlogData/AdminData existe
var isDataAvailable = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Article handlers carregado');
    
    // Verificar se o BlogData (ou alias AdminData) está disponível
    checkDataAvailability();
    
    // Se não estiver disponível, tentar novamente após algum tempo
    // (para garantir que o Supabase seja inicializado)
    if (!isDataAvailable) {
        console.log('BlogData/AdminData não detectado. Aguardando inicialização...');
        
        // Verificar a cada 500ms até que o BlogData esteja disponível, ou até 10 tentativas
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos
        
        const checkInterval = setInterval(() => {
            attempts++;
            checkDataAvailability();
            
            if (isDataAvailable) {
                console.log(`BlogData/AdminData disponível após ${attempts} tentativas`);
                clearInterval(checkInterval);
                initArticleButtons();
            } else if (attempts >= maxAttempts) {
                console.error('Tempo esgotado. BlogData/AdminData não disponível após múltiplas tentativas.');
                clearInterval(checkInterval);
                showErrorAlert('Erro de conexão com o banco de dados. Recarregue a página e tente novamente.');
            }
        }, 500);
    } else {
        // Se já está disponível, inicializar os botões
        initArticleButtons();
    }
});

function checkDataAvailability() {
    if (typeof window.BlogData !== 'undefined' || typeof window.AdminData !== 'undefined') {
        console.log('BlogData/AdminData encontrado e disponível');
        isDataAvailable = true;
    }
}

function initArticleButtons() {
    // Botão Novo Artigo
    const newArticleBtn = document.getElementById('new-article-btn');
    if (newArticleBtn) {
        console.log('Botão de artigo encontrado');
        
        // Verificar se o botão já tem event listener para evitar duplicação
        const btnClone = newArticleBtn.cloneNode(true);
        newArticleBtn.parentNode.replaceChild(btnClone, newArticleBtn);
        
        btnClone.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de artigo clicado');
            openArticleModal();
        });
    } else {
        console.warn('Botão de novo artigo não encontrado');
    }
    
    // Também podemos inicializar outros botões relacionados aos artigos aqui
    const pubArticleBtn = document.getElementById('pub-article-btn');
    if (pubArticleBtn) {
        const btnClone = pubArticleBtn.cloneNode(true);
        pubArticleBtn.parentNode.replaceChild(btnClone, pubArticleBtn);
        
        btnClone.addEventListener('click', function(e) {
            e.preventDefault();
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
        showErrorAlert('Erro: Modal de artigo não encontrado');
        return;
    }
    
    // Verificar se o Bootstrap está disponível
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.error('Bootstrap não está disponível');
        showErrorAlert('Erro: Bootstrap não está disponível');
        return;
    }
    
    try {
        // Limpar o formulário antes de abrir
        document.getElementById('scientific-article-form').reset();
        document.getElementById('scientific-article-form').dataset.articleId = '';
        document.getElementById('uploadArticleModalLabel').textContent = 'Novo Artigo Científico';
        
        // Tentar abrir o modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        console.log('Modal exibido com sucesso');
        
        // Adicionar evento ao botão de salvar
        const saveBtn = document.getElementById('save-article-btn');
        if (saveBtn) {
            // Remover eventos anteriores para evitar duplicação
            const saveBtnClone = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(saveBtnClone, saveBtn);
            
            saveBtnClone.addEventListener('click', saveArticle);
        }
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        showErrorAlert('Erro ao abrir modal: ' + error.message);
    }
}

async function saveArticle() {
    console.log('Salvando artigo...');
    
    if (!isDataAvailable) {
        console.error('Não é possível salvar: BlogData/AdminData não está disponível');
        showErrorAlert('Erro: Conexão com o banco de dados não está disponível');
        return;
    }
    
    const form = document.getElementById('scientific-article-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const saveBtnText = document.getElementById('save-article-btn-text');
    const saveBtnLoading = document.getElementById('save-article-btn-loading');
    saveBtnText.classList.add('d-none');
    saveBtnLoading.classList.remove('d-none');
    this.disabled = true;
    
    try {
        // Obter dados do formulário
        const article = {
            title: document.getElementById('article-title').value,
            date: document.getElementById('article-date').value,
            authors: document.getElementById('article-authors').value,
            category: document.getElementById('article-category').value,
            subcategory: document.getElementById('article-subcategory').value,
            journal: document.getElementById('article-journal').value,
            doi: document.getElementById('article-doi').value,
            abstract: document.getElementById('article-abstract').value,
            fileLink: document.getElementById('article-file-link').value,
            thumbnailLink: document.getElementById('article-thumbnail-link').value,
            content: document.getElementById('article-content').value,
            status: document.getElementById('article-status').value,
            language: document.getElementById('article-language').value,
            access: document.getElementById('article-access').value,
            tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        console.log('Dados do artigo:', article);
        
        // Verificar se é uma edição ou uma adição
        const articleId = form.dataset.articleId;
        
        // Usar o cliente Supabase através do BlogData/AdminData
        const dataClient = window.BlogData || window.AdminData;
        
        if (articleId) {
            await dataClient.updateArticle(articleId, article);
            showSuccessAlert('Artigo atualizado com sucesso!');
        } else {
            await dataClient.addArticle(article);
            showSuccessAlert('Artigo adicionado com sucesso!');
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadArticleModal'));
        modal.hide();
        
        // Atualizar a lista de artigos e contadores
        if (typeof loadArticles === 'function') {
            loadArticles();
        }
        if (typeof refreshRecentArticlesList === 'function') {
            refreshRecentArticlesList();
        }
        if (typeof updateDashboardCounts === 'function') {
            updateDashboardCounts();
        }
        
    } catch (error) {
        console.error('Erro ao salvar artigo:', error);
        showErrorAlert('Erro ao salvar artigo: ' + (error.message || 'Tente novamente.'));
    } finally {
        saveBtnText.classList.remove('d-none');
        saveBtnLoading.classList.add('d-none');
        this.disabled = false;
    }
}

// Funções auxiliares para mensagens
function showErrorAlert(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show fixed-bottom mx-4 mb-4';
    errorAlert.innerHTML = `
        <strong>Erro!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(errorAlert);
    
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}

function showSuccessAlert(message) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show fixed-bottom mx-4 mb-4';
    successAlert.innerHTML = `
        <strong>Sucesso!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(successAlert);
    
    setTimeout(() => {
        successAlert.remove();
    }, 5000);
}