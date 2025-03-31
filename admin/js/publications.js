/**
 * Processa o envio do formulário de artigo
 */
function handleArticleFormSubmission(form, button, articleId = null) {
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
        file: document.getElementById('article-file').files[0],
        thumbnail: document.getElementById('article-image').files[0],
        content: document.getElementById('article-content').value,
        status: document.getElementById('article-status').value,
        language: document.getElementById('article-language').value,
        access: document.getElementById('article-access').value,
        tags: document.getElementById('article-tags').value
    };
    
    console.log('Dados do formulário:', formData);
    
    // Salvar os dados usando a API AdminData
    setTimeout(() => {
        try {
            if (articleId) {
                // Atualizar artigo existente
                AdminData.articles.update(articleId, formData);
                alert('Artigo atualizado com sucesso!');
            } else {
                // Adicionar novo artigo
                AdminData.articles.add(formData);
                alert('Artigo publicado com sucesso!');
            }
            
            // Fechar modal
            const modalElement = button.closest('.modal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            // Atualizar a interface (estatísticas do dashboard)
            updateDashboardCounts();
            
            // Atualizar a lista de artigos recentes
            refreshRecentArticlesList();
        } catch (error) {
            console.error('Erro ao salvar artigo:', error);
            alert('Ocorreu um erro ao salvar o artigo. Por favor, tente novamente.');
        } finally {
            // Restaurar botão
            button.innerHTML = originalButtonText;
            button.disabled = false;
        }
    }, 1000);
}