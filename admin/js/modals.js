/**
 * modals.js - Gerenciamento de modais
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Modals.js carregado');
    initializeModals();
});

/**
 * Inicializa os modais
 */
function initializeModals() {
    console.log('Inicializando modals');
    
    // Verificar se os modais já existem na página
    const articleModal = document.getElementById('uploadArticleModal');
    const eventModal = document.getElementById('uploadEventModal');
    const materialModal = document.getElementById('uploadMaterialModal');
    
    // Criar modais inline se não existirem
    if (!articleModal) {
        createArticleModal();
    }
    
    if (!eventModal) {
        createEventModal();
    }
    
    if (!materialModal) {
        createMaterialModal();
    }
    
    // Inicializar botões
    initializeModalButtons();
    console.log('Bootstrap disponível para modals');
}

/**
 * Inicializa os botões que abrem os modais
 */
function initializeModalButtons() {
    console.log('Inicializando botões');
    
    // Botões para abrir modal de artigo
    document.querySelectorAll('#new-article-btn, #pub-article-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de artigo clicado');
            const modal = new bootstrap.Modal(document.getElementById('uploadArticleModal'));
            modal.show();
        });
    });
    
    // Botões para abrir modal de evento
    document.querySelectorAll('#pub-event-btn, #new-event-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de evento clicado');
            const modal = new bootstrap.Modal(document.getElementById('uploadEventModal'));
            modal.show();
        });
    });
    
    // Botões para abrir modal de material
    document.querySelectorAll('#pub-material-btn, #new-material-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de material clicado');
            const modal = new bootstrap.Modal(document.getElementById('uploadMaterialModal'));
            modal.show();
        });
    });
    
    // Botões de salvar dentro dos modais
    document.querySelectorAll('#save-article-btn, #save-event-btn, #save-material-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            
            if (modalId === 'uploadArticleModal') {
                saveArticle();
            } else if (modalId === 'uploadEventModal') {
                saveEvent();
            } else if (modalId === 'uploadMaterialModal') {
                saveMaterial();
            }
        });
    });
    
    const buttonsCount = document.querySelectorAll('#new-article-btn, #pub-article-btn').length;
    console.log(`Botões de artigos encontrados: ${buttonsCount}`);
}

/**
 * Cria o modal de artigo inline na página
 */
function createArticleModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'uploadArticleModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'uploadArticleModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadArticleModalLabel">Novo Artigo Científico</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="scientific-article-form">
                        <!-- Informações básicas -->
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <label for="article-title" class="form-label required">Título do Artigo</label>
                                <input type="text" class="form-control" id="article-title" required>
                            </div>
                            <div class="col-md-4">
                                <label for="article-date" class="form-label required">Data de Publicação</label>
                                <input type="date" class="form-control" id="article-date" required>
                            </div>
                        </div>
                        
                        <!-- Autores e categorização -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-authors" class="form-label required">Autores</label>
                                <input type="text" class="form-control" id="article-authors" placeholder="Ex: Silva, J., Oliveira, M. & Santos, P. (2025)" required>
                                <small class="text-muted">Insira todos os autores no formato: Sobrenome, Inicial. & Sobrenome, Inicial.</small>
                            </div>
                            <div class="col-md-3">
                                <label for="article-category" class="form-label required">Categoria Principal</label>
                                <select class="form-select" id="article-category" required>
                                    <option value="">Selecione uma categoria</option>
                                    <option value="medicina">Medicina</option>
                                    <option value="engenharia">Engenharias</option>
                                    <option value="petroleo-gas">Petróleo e Gás</option>
                                    <option value="ingles">Inglês</option>
                                    <option value="diversos">Diversos</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="article-subcategory" class="form-label">Subcategoria</label>
                                <select class="form-select" id="article-subcategory">
                                    <option value="">Selecione uma subcategoria</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Credenciais adicionais -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-journal" class="form-label">Revista/Journal</label>
                                <input type="text" class="form-control" id="article-journal" placeholder="Ex: Revista Brasileira de Medicina">
                            </div>
                            <div class="col-md-3">
                                <label for="article-doi" class="form-label">DOI (se disponível)</label>
                                <input type="text" class="form-control" id="article-doi" placeholder="Ex: 10.1000/xyz123">
                            </div>
                            <div class="col-md-3">
                                <label for="article-badge" class="form-label">Tipo de Badge</label>
                                <select class="form-select" id="article-badge">
                                    <option value="standard">Padrão</option>
                                    <option value="featured">Destaque</option>
                                    <option value="clinical">Clínica</option>
                                    <option value="research">Pesquisa</option>
                                    <option value="education">Educação</option>
                                    <option value="technology">Tecnologia</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Resumo/Abstract -->
                        <div class="mb-3">
                            <label for="article-abstract" class="form-label required">Resumo/Abstract</label>
                            <textarea class="form-control" id="article-abstract" rows="4" maxlength="500" required></textarea>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Resumo breve do artigo, será exibido na listagem de publicações</small>
                                <small id="abstract-counter" class="text-muted">0/500</small>
                            </div>
                        </div>
                        
                        <!-- Arquivo e imagem em destaque -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-file" class="form-label required">Arquivo do Artigo (PDF)</label>
                                <input type="file" class="form-control" id="article-file" accept=".pdf" required>
                                <small class="text-muted">Tamanho máximo: 10MB</small>
                            </div>
                            <div class="col-md-6">
                                <label for="article-thumbnail" class="form-label">Imagem em Destaque</label>
                                <input type="file" class="form-control" id="article-thumbnail" accept="image/*">
                                <small class="text-muted">Recomendado: 800x400px, formato JPG ou PNG</small>
                            </div>
                        </div>
                        
                        <!-- Conteúdo completo ou detalhes adicionais -->
                        <div class="mb-3">
                            <label for="article-content" class="form-label">Conteúdo Adicional / Detalhes</label>
                            <textarea class="form-control" id="article-content" rows="8"></textarea>
                            <small class="text-muted">Conteúdo que será exibido na página de detalhes do artigo (opcional)</small>
                        </div>
                        
                        <!-- Status e visibilidade -->
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="article-status" class="form-label">Status</label>
                                <select class="form-select" id="article-status">
                                    <option value="publicado">Publicado</option>
                                    <option value="rascunho">Rascunho</option>
                                    <option value="agendado">Agendado</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="article-language" class="form-label">Idioma Principal</label>
                                <select class="form-select" id="article-language">
                                    <option value="pt">Português</option>
                                    <option value="en">Inglês</option>
                                    <option value="es">Espanhol</option>
                                    <option value="fr">Francês</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="article-access" class="form-label">Acesso</label>
                                <select class="form-select" id="article-access">
                                    <option value="publico">Público</option>
                                    <option value="membros">Apenas Membros</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Tags e metadados SEO -->
                        <div class="mb-3">
                            <label for="article-tags" class="form-label">Tags</label>
                            <input type="text" class="form-control" id="article-tags" placeholder="Insira tags separadas por vírgula">
                            <small class="text-muted">Ex: medicina regenerativa, células-tronco, tratamento avançado</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-article-btn">Publicar Artigo</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Formulário de artigo criado');
    
    // Inicializar eventos específicos do formulário
    initArticleFormEvents();
}

/**
 * Inicializa eventos específicos do formulário de artigos
 */
function initArticleFormEvents() {
    // Contador de caracteres para o Abstract
    const abstractTextarea = document.getElementById('article-abstract');
    const abstractCounter = document.getElementById('abstract-counter');
    
    if (abstractTextarea && abstractCounter) {
        abstractTextarea.addEventListener('input', function() {
            const charCount = this.value.length;
            const maxLength = this.getAttribute('maxlength');
            abstractCounter.textContent = `${charCount}/${maxLength}`;
        });
    }
    
    // Gerenciar subcategorias com base na categoria selecionada
    const categorySelect = document.getElementById('article-category');
    const subcategorySelect = document.getElementById('article-subcategory');
    
    if (categorySelect && subcategorySelect) {
        const subcategories = {
            'medicina': [
                {value: 'clinical', text: 'Clínica'},
                {value: 'research', text: 'Pesquisas'},
                {value: 'education', text: 'Educação Médica'}
            ],
            'engenharia': [
                {value: 'civil', text: 'Civil'},
                {value: 'mechanical', text: 'Mecânica'},
                {value: 'electrical', text: 'Elétrica'},
                {value: 'computer', text: 'Computação'}
            ],
            'petroleo-gas': [
                {value: 'extraction', text: 'Extração'},
                {value: 'processing', text: 'Processamento'},
                {value: 'distribution', text: 'Distribuição'},
                {value: 'environment', text: 'Meio Ambiente'}
            ],
            'ingles': [
                {value: 'grammar', text: 'Gramática'},
                {value: 'vocabulary', text: 'Vocabulário'},
                {value: 'business', text: 'Inglês para Negócios'}
            ],
            'diversos': [
                {value: 'technology', text: 'Tecnologia'},
                {value: 'business', text: 'Negócios'},
                {value: 'culture', text: 'Cultura'},
                {value: 'language', text: 'Idiomas'}
            ]
        };
        
        categorySelect.addEventListener('change', function() {
            // Limpar opções atuais
            subcategorySelect.innerHTML = '<option value="">Selecione uma subcategoria</option>';
            
            // Adicionar novas opções baseadas na categoria selecionada
            const category = this.value;
            if (category && subcategories[category]) {
                subcategories[category].forEach(function(item) {
                    const option = document.createElement('option');
                    option.value = item.value;
                    option.textContent = item.text;
                    subcategorySelect.appendChild(option);
                });
                subcategorySelect.disabled = false;
            } else {
                subcategorySelect.disabled = true;
            }
        });
    }
}

/**
 * Cria o modal de evento inline na página
 */
function createEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'uploadEventModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'uploadEventModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadEventModalLabel">Novo Evento</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="event-form">
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <label for="event-title" class="form-label required">Título do Evento</label>
                                <input type="text" class="form-control" id="event-title" required>
                            </div>
                            <div class="col-md-4">
                                <label for="event-date" class="form-label required">Data do Evento</label>
                                <input type="date" class="form-control" id="event-date" required>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="event-location" class="form-label required">Local</label>
                                <input type="text" class="form-control" id="event-location" required>
                            </div>
                            <div class="col-md-3">
                                <label for="event-category" class="form-label required">Categoria</label>
                                <select class="form-select" id="event-category" required>
                                    <option value="">Selecione</option>
                                    <option value="medicina">Medicina</option>
                                    <option value="engenharia">Engenharias</option>
                                    <option value="petroleo-gas">Petróleo e Gás</option>
                                    <option value="ingles">Inglês</option>
                                    <option value="diversos">Diversos</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="event-type" class="form-label">Tipo</label>
                                <select class="form-select" id="event-type">
                                    <option value="congresso">Congresso</option>
                                    <option value="simposio">Simpósio</option>
                                    <option value="curso">Curso</option>
                                    <option value="webinar">Webinar</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="event-description" class="form-label">Descrição</label>
                            <textarea class="form-control" id="event-description" rows="4"></textarea>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="event-image" class="form-label">Imagem do Evento</label>
                                <input type="file" class="form-control" id="event-image" accept="image/*">
                            </div>
                            <div class="col-md-6">
                                <label for="event-link" class="form-label">Link para Inscrição</label>
                                <input type="url" class="form-control" id="event-link" placeholder="https://...">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-success" id="save-event-btn">Salvar Evento</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Formulário de evento criado');
}

/**
 * Cria o modal de material inline na página
 */
function createMaterialModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'uploadMaterialModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'uploadMaterialModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="uploadMaterialModalLabel">Novo Material</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="material-form">
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <label for="material-title" class="form-label required">Título do Material</label>
                                <input type="text" class="form-control" id="material-title" required>
                            </div>
                            <div class="col-md-4">
                                <label for="material-type" class="form-label required">Tipo</label>
                                <select class="form-select" id="material-type" required>
                                    <option value="">Selecione</option>
                                    <option value="manual">Manual</option>
                                    <option value="guia">Guia</option>
                                    <option value="ebook">E-book</option>
                                    <option value="software">Software</option>
                                    <option value="infografico">Infográfico</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="material-category" class="form-label required">Categoria</label>
                                <select class="form-select" id="material-category" required>
                                    <option value="">Selecione</option>
                                    <option value="medicina">Medicina</option>
                                    <option value="engenharia">Engenharias</option>
                                    <option value="petroleo-gas">Petróleo e Gás</option>
                                    <option value="ingles">Inglês</option>
                                    <option value="diversos">Diversos</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="material-access" class="form-label">Acesso</label>
                                <select class="form-select" id="material-access">
                                    <option value="gratuito">Gratuito</option>
                                    <option value="pago">Pago</option>
                                    <option value="restrito">Restrito</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="material-description" class="form-label">Descrição</label>
                            <textarea class="form-control" id="material-description" rows="3"></textarea>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="material-file" class="form-label required">Arquivo</label>
                                <input type="file" class="form-control" id="material-file" required>
                            </div>
                            <div class="col-md-6">
                                <label for="material-cover" class="form-label">Imagem de Capa</label>
                                <input type="file" class="form-control" id="material-cover" accept="image/*">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info text-white" id="save-material-btn">Salvar Material</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Formulário de material criado');
}

/**
 * Salva um evento
 */
function saveEvent() {
    const form = document.getElementById('event-form');
    const saveButton = document.getElementById('save-event-btn');
    
    if (!form || !saveButton) {
        console.error('Formulário ou botão não encontrado');
        return;
    }
    
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    const originalButtonText = saveButton.innerHTML;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    saveButton.disabled = true;
    
    // Coletar dados do formulário
    const eventData = {
        title: document.getElementById('event-title').value,
        eventDate: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        category: document.getElementById('event-category').value,
        eventType: document.getElementById('event-type').value,
        description: document.getElementById('event-description').value,
        link: document.getElementById('event-link').value,
        image: document.getElementById('event-image').files[0]
    };
    
    // Salvar os dados
    setTimeout(() => {
        try {
            // Adicionar novo evento
            AdminData.events.add(eventData);
            alert('Evento publicado com sucesso!');
            
            // Fechar modal
            const modalElement = saveButton.closest('.modal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            // Limpar formulário
            form.reset();
            
            // Atualizar dashboard
            updateDashboardCounts();
            
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            alert('Ocorreu um erro ao salvar o evento. Por favor, tente novamente.');
        } finally {
            // Restaurar botão
            saveButton.innerHTML = originalButtonText;
            saveButton.disabled = false;
        }
    }, 1000);
}

/**
 * Salva um material
 */
function saveMaterial() {
    const form = document.getElementById('material-form');
    const saveButton = document.getElementById('save-material-btn');
    
    if (!form || !saveButton) {
        console.error('Formulário ou botão não encontrado');
        return;
    }
    
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    const originalButtonText = saveButton.innerHTML;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    saveButton.disabled = true;
    
    // Coletar dados do formulário
    const materialData = {
        title: document.getElementById('material-title').value,
        type: document.getElementById('material-type').value,
        category: document.getElementById('material-category').value,
        access: document.getElementById('material-access').value,
        description: document.getElementById('material-description').value,
        file: document.getElementById('material-file').files[0],
        cover: document.getElementById('material-cover').files[0]
    };
    
    // Salvar os dados
    setTimeout(() => {
        try {
            // Adicionar novo material
            AdminData.materials.add(materialData);
            alert('Material publicado com sucesso!');
            
            // Fechar modal
            const modalElement = saveButton.closest('.modal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            // Limpar formulário
            form.reset();
            
            // Atualizar dashboard
            updateDashboardCounts();
            
        } catch (error) {
            console.error('Erro ao salvar material:', error);
            alert('Ocorreu um erro ao salvar o material. Por favor, tente novamente.');
        } finally {
            // Restaurar botão
            saveButton.innerHTML = originalButtonText;
            saveButton.disabled = false;
        }
    }, 1000);
}

/**
 * Atualiza os contadores no dashboard
 */
function updateDashboardCounts() {
    if (typeof AdminData !== 'undefined' && typeof AdminData.getCounts === 'function') {
        const counts = AdminData.getCounts();
        
        // Atualizar os contadores no dashboard
        const articleCount = document.querySelector('#dashboard-content .card:nth-child(1) .card-text');
        const mediaCount = document.querySelector('#dashboard-content .card:nth-child(2) .card-text');
        const resourceCount = document.querySelector('#dashboard-content .card:nth-child(3) .card-text');
        
        if (articleCount) articleCount.textContent = counts.articles;
        if (mediaCount) mediaCount.textContent = counts.events;
        if (resourceCount) resourceCount.textContent = counts.materials;
    }
}

/**
 * Atualiza a lista de artigos recentes no dashboard
 */
function refreshRecentArticlesList() {
    const recentArticlesTable = document.querySelector('#dashboard-content .table tbody');
    if (!recentArticlesTable) return;
    
    try {
        // Limpar tabela atual
        recentArticlesTable.innerHTML = '';
        
        // Obter artigos e ordenar por data (mais recentes primeiro)
        const articles = AdminData.articles.getAll();
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Exibir os 3 artigos mais recentes
        const recentArticles = articles.slice(0, 3);
        
        if (recentArticles.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" class="text-center">Nenhum artigo encontrado</td>
            `;
            recentArticlesTable.appendChild(row);
            return;
        }
        
        recentArticles.forEach(article => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${article.title}</td>
                <td>${article.category}</td>
                <td>${formatDate(article.date)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-article-btn" data-id="${article.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger delete-article-btn" data-id="${article.id}">Excluir</button>
                </td>
            `;
            recentArticlesTable.appendChild(row);
        });
        
        // Reinicializar botões de edição e exclusão
        initializeModalButtons();
        
    } catch (error) {
        console.error('Erro ao atualizar lista de artigos recentes:', error);
    }
}

/**
 * Formata uma data para exibição
 * @param {string} dateStr - String de data
 * @returns {string} - Data formatada
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}