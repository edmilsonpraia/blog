/**
 * Processa o envio do formulário de artigo
 */
async function handleArticleFormSubmission(form, button, articleId = null) {
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        // Destacar campos inválidos
        form.classList.add('was-validated');
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    const originalButtonText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    button.disabled = true;
    
    try {
        // Coletar dados do formulário
        const formData = {
            title: document.getElementById('article-title').value,
            date: document.getElementById('article-date').value,
            authors: document.getElementById('article-authors').value,
            category: document.getElementById('article-category').value,
            subcategory: document.getElementById('article-subcategory').value,
            journal: document.getElementById('article-journal').value,
            doi: document.getElementById('article-doi').value,
            abstract: document.getElementById('article-abstract').value,
            // Como Supabase não lida com uploads de arquivos diretamente, precisamos usar links
            file_link: document.getElementById('article-file-link').value, // Alterado para usar o link
            thumbnail_link: document.getElementById('article-thumbnail-link').value, // Alterado para usar o link
            content: document.getElementById('article-content').value,
            status: document.getElementById('article-status').value,
            language: document.getElementById('article-language').value,
            access: document.getElementById('article-access').value,
            tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        console.log('Dados do formulário:', formData);
        
        // Obter a referência ao serviço de dados
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            throw new Error('Serviço de dados não disponível');
        }
        
        if (articleId) {
            // Atualizar artigo existente
            if (typeof dataService.updateArticle === 'function') {
                await dataService.updateArticle(articleId, formData);
            } else {
                await dataService.articles.update(articleId, formData);
            }
            showSuccessAlert('Artigo atualizado com sucesso!');
        } else {
            // Adicionar novo artigo
            if (typeof dataService.addArticle === 'function') {
                await dataService.addArticle(formData);
            } else {
                await dataService.articles.add(formData);
            }
            showSuccessAlert('Artigo publicado com sucesso!');
        }
        
        // Fechar modal
        const modalElement = button.closest('.modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        // Atualizar a interface (estatísticas do dashboard)
        if (typeof updateDashboardCounts === 'function') {
            updateDashboardCounts();
        }
        
        // Atualizar a lista de artigos recentes
        if (typeof refreshRecentArticlesList === 'function') {
            refreshRecentArticlesList();
        }
        
        // Recarregar lista de artigos se estiver disponível
        if (typeof loadArticles === 'function') {
            loadArticles();
        }
        
        // Limpar formulário
        form.reset();
        
    } catch (error) {
        console.error('Erro ao salvar artigo:', error);
        showErrorAlert('Erro ao salvar artigo: ' + (error.message || 'Tente novamente.'));
    } finally {
        // Restaurar botão
        button.innerHTML = originalButtonText;
        button.disabled = false;
    }
}

// Função auxiliar para mostrar alertas de sucesso
function showSuccessAlert(message) {
    if (typeof alert === 'function') {
        alert(message);
        return;
    }
    
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

// Função auxiliar para mostrar alertas de erro
function showErrorAlert(message) {
    if (typeof alert === 'function') {
        alert(message);
        return;
    }
    
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