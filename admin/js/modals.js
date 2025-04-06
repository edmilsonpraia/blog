/**
 * modals.js - Gerenciamento de modais (versão compatível com Supabase)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Modals.js carregado');
    
    // Verificar se o Supabase/BlogData já está disponível
    if (typeof window.supabaseClient !== 'undefined' && 
        (typeof window.BlogData !== 'undefined' || typeof window.AdminData !== 'undefined')) {
        initializeModals();
    } else {
        // Aguardar inicialização do Supabase
        console.log('Aguardando inicialização do Supabase...');
        
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if ((typeof window.supabaseClient !== 'undefined' && 
                (typeof window.BlogData !== 'undefined' || typeof window.AdminData !== 'undefined'))) {
                console.log(`Supabase disponível após ${attempts} tentativas. Inicializando modais.`);
                clearInterval(checkInterval);
                initializeModals();
            } else if (attempts >= maxAttempts) {
                console.error('Tempo esgotado. Supabase/BlogData não inicializado. Inicializando modais sem Supabase.');
                clearInterval(checkInterval);
                initializeModals();
            }
        }, 500);
    }
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
    
    // Criar modais se não existirem
    if (!articleModal) {
        console.log('Modal de artigo não encontrado, criando...');
        createArticleModal();
    } else {
        console.log('Modal de artigo já existe na página');
    }
    
    if (!eventModal) {
        console.log('Modal de evento não encontrado, criando...');
        createEventModal();
    } else {
        console.log('Modal de evento já existe na página');
    }
    
    if (!materialModal) {
        console.log('Modal de material não encontrado, criando...');
        createMaterialModal();
    } else {
        console.log('Modal de material já existe na página');
    }
    
    // Inicializar botões
    initializeModalButtons();
    console.log('Modais inicializados com sucesso');
}

/**
 * Inicializa os botões que abrem os modais
 */
function initializeModalButtons() {
    console.log('Inicializando botões para modais');
    
    // Para evitar duplicação de event listeners, remove os botões existentes e recria-os
    function setupButton(selector, action) {
        document.querySelectorAll(selector).forEach(button => {
            // Clonar o botão para remover todos os event listeners
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
                
                // Adicionar o novo event listener
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log(`Botão ${selector} clicado`);
                    action();
                });
            }
        });
    }
    
    // Configurar botões para abrir modais
    setupButton('#new-article-btn, #pub-article-btn', function() {
        openModal('uploadArticleModal');
    });
    
    setupButton('#new-event-btn, #pub-event-btn', function() {
        openModal('uploadEventModal');
    });
    
    setupButton('#new-material-btn, #pub-material-btn', function() {
        openModal('uploadMaterialModal');
    });
    
    // Botões dentro dos modais
    setupButton('#save-article-btn', function() {
        saveArticle();
    });
    
    setupButton('#save-event-btn', function() {
        saveEvent();
    });
    
    setupButton('#save-material-btn', function() {
        saveMaterial();
    });
    
    const buttonsCount = document.querySelectorAll('#new-article-btn, #pub-article-btn').length;
    console.log(`Botões para modais configurados (${buttonsCount} botões de artigos encontrados)`);
}

/**
 * Abre um modal pelo ID
 */
function openModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (!modalElement) {
        console.error(`Modal ${modalId} não encontrado`);
        return;
    }
    
    try {
        // Resetar formulário antes de abrir
        const form = modalElement.querySelector('form');
        if (form) {
            form.reset();
            
            // Limpar ID de edição se houver
            form.dataset.articleId = '';
            form.dataset.eventId = '';
            form.dataset.materialId = '';
        }
        
        // Atualizar título para "Novo"
        const titleElement = modalElement.querySelector('.modal-title');
        if (titleElement) {
            if (modalId === 'uploadArticleModal') {
                titleElement.textContent = 'Novo Artigo Científico';
            } else if (modalId === 'uploadEventModal') {
                titleElement.textContent = 'Novo Evento';
            } else if (modalId === 'uploadMaterialModal') {
                titleElement.textContent = 'Novo Material';
            }
        }
        
        // Abrir o modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        console.log(`Modal ${modalId} aberto com sucesso`);
        
    } catch (error) {
        console.error(`Erro ao abrir modal ${modalId}:`, error);
        showErrorAlert(`Erro ao abrir modal: ${error.message}`);
    }
}

/**
 * Cria o modal de artigo inline na página
 */
function createArticleModal() {
    // Verificar se já existe um modal com o mesmo ID
    if (document.getElementById('uploadArticleModal')) {
        console.log('Modal de artigo já existe, não será recriado');
        return;
    }
    
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
                                <label for="article-title" class="form-label">Título do Artigo <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="article-title" required>
                            </div>
                            <div class="col-md-4">
                                <label for="article-date" class="form-label">Data de Publicação <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="article-date" required>
                            </div>
                        </div>
                        
                        <!-- Autores e categorização -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-authors" class="form-label">Autores <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="article-authors" placeholder="Ex: Silva, J., Oliveira, M. & Santos, P." required>
                            </div>
                            <div class="col-md-3">
                                <label for="article-category" class="form-label">Categoria <span class="text-danger">*</span></label>
                                <select class="form-select" id="article-category" required>
                                    <option value="">Selecione</option>
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
                                    <option value="">Selecione</option>
                                </select>
                            </div>
                        </div>

                        <!-- Journal e DOI -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-journal" class="form-label">Revista/Journal</label>
                                <input type="text" class="form-control" id="article-journal" placeholder="Ex: Revista Brasileira de Medicina">
                            </div>
                            <div class="col-md-6">
                                <label for="article-doi" class="form-label">DOI (se disponível)</label>
                                <input type="text" class="form-control" id="article-doi" placeholder="Ex: 10.1000/xyz123">
                            </div>
                        </div>
                        
                        <!-- Resumo -->
                        <div class="mb-3">
                            <label for="article-abstract" class="form-label">Resumo/Abstract <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="article-abstract" rows="4" maxlength="500" required></textarea>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Resumo breve do artigo, será exibido na listagem de publicações</small>
                                <small id="abstract-counter" class="text-muted">0/500</small>
                            </div>
                        </div>
                        
                        <!-- Links de arquivo e imagem -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="article-file-link" class="form-label">Link do Artigo (PDF) <span class="text-danger">*</span></label>
                                <input type="url" class="form-control" id="article-file-link" placeholder="https://drive.google.com/file/d/..." required>
                                <small class="text-muted">Cole o link compartilhável do Google Drive, Dropbox, etc.</small>
                            </div>
                            <div class="col-md-6">
                                <label for="article-thumbnail-link" class="form-label">Link da Imagem em Destaque</label>
                                <input type="url" class="form-control" id="article-thumbnail-link" placeholder="https://i.imgur.com/...">
                                <small class="text-muted">Cole o link direto da imagem (JPG, PNG, etc.)</small>
                            </div>
                        </div>
                        
                        <!-- Conteúdo -->
                        <div class="mb-3">
                            <label for="article-content" class="form-label">Conteúdo Adicional / Detalhes</label>
                            <textarea class="form-control" id="article-content" rows="4"></textarea>
                            <small class="text-muted">Conteúdo que será exibido na página de detalhes do artigo (opcional)</small>
                        </div>
                        
                        <!-- Status, idioma e acesso -->
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="article-status" class="form-label">Status</label>
                                <select class="form-select" id="article-status">
                                    <option value="publicado">Publicado</option>
                                    <option value="rascunho">Rascunho</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="article-language" class="form-label">Idioma Principal</label>
                                <select class="form-select" id="article-language">
                                    <option value="pt">Português</option>
                                    <option value="en">Inglês</option>
                                    <option value="es">Espanhol</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label for="article-access" class="form-label">Acesso</label>
                                <select class="form-select" id="article-access">
                                    <option value="publico">Público</option>
                                    <option value="restrito">Restrito</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Tags -->
                        <div class="mb-3">
                            <label for="article-tags" class="form-label">Tags</label>
                            <input type="text" class="form-control" id="article-tags" placeholder="Separe as tags por vírgulas">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="save-article-btn">
                        <span id="save-article-btn-text">Salvar Artigo</span>
                        <span id="save-article-btn-loading" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
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
            'medicina': ['Cardiologia', 'Neurologia', 'Oncologia'],
            'engenharia': ['Civil', 'Mecânica', 'Elétrica'],
            'petroleo-gas': ['Exploração', 'Produção', 'Refino'],
            'ingles': ['Gramática', 'Vocabulário', 'Conversação'],
            'diversos': ['Tecnologia', 'Educação', 'Cultura']
        };
        
        categorySelect.addEventListener('change', function() {
            // Limpar opções atuais
            subcategorySelect.innerHTML = '<option value="">Selecione</option>';
            
            // Adicionar novas opções baseadas na categoria selecionada
            const category = this.value;
            if (category && subcategories[category]) {
                subcategories[category].forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
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
    // Verificar se já existe um modal com o mesmo ID
    if (document.getElementById('uploadEventModal')) {
        console.log('Modal de evento já existe, não será recriado');
        return;
    }
    
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
                                <label for="event-image-link" class="form-label">Link da Imagem do Evento</label>
                                <input type="url" class="form-control" id="event-image-link" placeholder="https://i.imgur.com/...">
                                <small class="text-muted">Cole o link direto da imagem (JPG, PNG, etc.)</small>
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
                    <button type="button" class="btn btn-success" id="save-event-btn">
                        <span id="save-event-btn-text">Salvar Evento</span>
                        <span id="save-event-btn-loading" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
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
    // Verificar se já existe um modal com o mesmo ID
    if (document.getElementById('uploadMaterialModal')) {
        console.log('Modal de material já existe, não será recriado');
        return;
    }
    
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
                                <label for="material-file-link" class="form-label required">Link do Arquivo</label>
                                <input type="url" class="form-control" id="material-file-link" placeholder="https://drive.google.com/file/d/..." required>
                                <small class="text-muted">Cole o link compartilhável do Google Drive, Dropbox, etc.</small>
                            </div>
                            <div class="col-md-6">
                                <label for="material-cover-link" class="form-label">Link da Imagem de Capa</label>
                                <input type="url" class="form-control" id="material-cover-link" placeholder="https://i.imgur.com/...">
                                <small class="text-muted">Cole o link direto da imagem (JPG, PNG, etc.)</small>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-info text-white" id="save-material-btn">
                        <span id="save-material-btn-text">Salvar Material</span>
                        <span id="save-material-btn-loading" class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Formulário de material criado');
}

/**
 * Salva um artigo
 */
async function saveArticle() {
    const form = document.getElementById('scientific-article-form');
    const saveButton = document.getElementById('save-article-btn');
    const saveBtnText = document.getElementById('save-article-btn-text');
    const saveBtnLoading = document.getElementById('save-article-btn-loading');
    
    if (!form || !saveButton) {
        console.error('Formulário ou botão não encontrado');
        return;
    }
    
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    saveBtnText.classList.add('d-none');
    saveBtnLoading.classList.remove('d-none');
    saveButton.disabled = true;
    
    try {
        // Coletar dados do formulário
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
        
        console.log('Dados do artigo coletados:', article);
        
        // Verificar se é para editar ou adicionar
        const articleId = form.dataset.articleId;
        
        // Obter referência para o serviço de dados (BlogData ou AdminData)
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            throw new Error('Serviço de dados não está disponível (BlogData/AdminData)');
        }
        
        if (articleId) {
            console.log(`Atualizando artigo existente (ID: ${articleId})`);
            // Editar artigo existente
            if (typeof dataService.updateArticle === 'function') {
                await dataService.updateArticle(articleId, article);
            } else {
                await dataService.articles.update(articleId, article);
            }
            showSuccessAlert('Artigo atualizado com sucesso!');
        } else {
            console.log('Adicionando novo artigo');
            // Adicionar novo artigo
            if (typeof dataService.addArticle === 'function') {
                await dataService.addArticle(article);
            } else {
                await dataService.articles.add(article);
            }
            showSuccessAlert('Artigo adicionado com sucesso!');
        }
        
        // Fechar modal
        const modalElement = saveButton.closest('.modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        // Limpar formulário
        form.reset();
        
        // Atualizar interface
        if (typeof loadArticles === 'function') loadArticles();
        if (typeof refreshRecentArticlesList === 'function') refreshRecentArticlesList();
        if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
        
    } catch (error) {
        console.error('Erro ao salvar artigo:',error);
        showErrorAlert('Erro ao salvar artigo: ' + (error.message || 'Tente novamente.'));
    } finally {
        // Restaurar botão
        saveBtnText.classList.remove('d-none');
        saveBtnLoading.classList.add('d-none');
        saveButton.disabled = false;
    }
}

/**
 * Salva um evento
 */
async function saveEvent() {
    const form = document.getElementById('event-form');
    const saveButton = document.getElementById('save-event-btn');
    const saveBtnText = document.getElementById('save-event-btn-text');
    const saveBtnLoading = document.getElementById('save-event-btn-loading');
    
    if (!form || !saveButton) {
        console.error('Formulário ou botão não encontrado');
        return;
    }
    
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    saveBtnText.classList.add('d-none');
    saveBtnLoading.classList.remove('d-none');
    saveButton.disabled = true;
    
    try {
        // Coletar dados do formulário
        const event = {
            title: document.getElementById('event-title').value,
            eventDate: document.getElementById('event-date').value,
            location: document.getElementById('event-location').value,
            category: document.getElementById('event-category').value,
            eventType: document.getElementById('event-type').value,
            description: document.getElementById('event-description').value,
            imageLink: document.getElementById('event-image-link').value,
            link: document.getElementById('event-link').value
        };
        
        console.log('Dados do evento coletados:', event);
        
        // Verificar se é para editar ou adicionar
        const eventId = form.dataset.eventId;
        
        // Obter referência para o serviço de dados (BlogData ou AdminData)
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            throw new Error('Serviço de dados não está disponível (BlogData/AdminData)');
        }
        
        if (eventId) {
            console.log(`Atualizando evento existente (ID: ${eventId})`);
            // Editar evento existente
            if (typeof dataService.updateEvent === 'function') {
                await dataService.updateEvent(eventId, event);
            } else {
                await dataService.events.update(eventId, event);
            }
            showSuccessAlert('Evento atualizado com sucesso!');
        } else {
            console.log('Adicionando novo evento');
            // Adicionar novo evento
            if (typeof dataService.addEvent === 'function') {
                await dataService.addEvent(event);
            } else {
                await dataService.events.add(event);
            }
            showSuccessAlert('Evento adicionado com sucesso!');
        }
        
        // Fechar modal
        const modalElement = saveButton.closest('.modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        // Limpar formulário
        form.reset();
        
        // Atualizar interface
        if (typeof loadEvents === 'function') loadEvents();
        if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
        
    } catch (error) {
        console.error('Erro ao salvar evento:', error);
        showErrorAlert('Erro ao salvar evento: ' + (error.message || 'Tente novamente.'));
    } finally {
        // Restaurar botão
        saveBtnText.classList.remove('d-none');
        saveBtnLoading.classList.add('d-none');
        saveButton.disabled = false;
    }
}

/**
 * Salva um material
 */
async function saveMaterial() {
    const form = document.getElementById('material-form');
    const saveButton = document.getElementById('save-material-btn');
    const saveBtnText = document.getElementById('save-material-btn-text');
    const saveBtnLoading = document.getElementById('save-material-btn-loading');
    
    if (!form || !saveButton) {
        console.error('Formulário ou botão não encontrado');
        return;
    }
    
    // Verificar validação do formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Desabilitar botão e mostrar indicador de carregamento
    saveBtnText.classList.add('d-none');
    saveBtnLoading.classList.remove('d-none');
    saveButton.disabled = true;
    
    try {
        // Coletar dados do formulário
        const material = {
            title: document.getElementById('material-title').value,
            type: document.getElementById('material-type').value,
            category: document.getElementById('material-category').value,
            access: document.getElementById('material-access').value,
            description: document.getElementById('material-description').value,
            fileLink: document.getElementById('material-file-link').value,
            coverLink: document.getElementById('material-cover-link').value
        };
        
        console.log('Dados do material coletados:', material);
        
        // Verificar se é para editar ou adicionar
        const materialId = form.dataset.materialId;
        
        // Obter referência para o serviço de dados (BlogData ou AdminData)
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            throw new Error('Serviço de dados não está disponível (BlogData/AdminData)');
        }
        
        if (materialId) {
            console.log(`Atualizando material existente (ID: ${materialId})`);
            // Editar material existente
            if (typeof dataService.updateMaterial === 'function') {
                await dataService.updateMaterial(materialId, material);
            } else {
                await dataService.materials.update(materialId, material);
            }
            showSuccessAlert('Material atualizado com sucesso!');
        } else {
            console.log('Adicionando novo material');
            // Adicionar novo material
            if (typeof dataService.addMaterial === 'function') {
                await dataService.addMaterial(material);
            } else {
                await dataService.materials.add(material);
            }
            showSuccessAlert('Material adicionado com sucesso!');
        }
        
        // Fechar modal
        const modalElement = saveButton.closest('.modal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        // Limpar formulário
        form.reset();
        
        // Atualizar interface
        if (typeof loadMaterials === 'function') loadMaterials();
        if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
        
    } catch (error) {
        console.error('Erro ao salvar material:', error);
        showErrorAlert('Erro ao salvar material: ' + (error.message || 'Tente novamente.'));
    } finally {
        // Restaurar botão
        saveBtnText.classList.remove('d-none');
        saveBtnLoading.classList.add('d-none');
        saveButton.disabled = false;
    }
}

/**
 * Atualiza os contadores no dashboard
 */
async function updateDashboardCounts() {
    try {
        console.log('Atualizando contadores do dashboard...');
        
        // Obter referência para o serviço de dados (BlogData ou AdminData)
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            console.error('Serviço de dados não está disponível (BlogData/AdminData)');
            return;
        }
        
        let counts;
        
        // Compatibilidade com ambas as interfaces (antiga e nova)
        if (typeof dataService.getCounts === 'function') {
            counts = await dataService.getCounts();
        } else {
            const articles = await dataService.fetchArticles();
            const events = await dataService.fetchEvents();
            const materials = await dataService.fetchMaterials();
            
            counts = {
                articles: articles.length,
                events: events.length,
                materials: materials.length
            };
        }
        
        console.log('Contagens obtidas:', counts);
        
        // Atualizar os contadores no dashboard
        const articleCount = document.querySelector('#dashboard-content .card:nth-child(1) .card-text');
        const eventsCount = document.querySelector('#dashboard-content .card:nth-child(2) .card-text');
        const materialsCount = document.querySelector('#dashboard-content .card:nth-child(3) .card-text');
        
        if (articleCount) articleCount.textContent = counts.articles;
        if (eventsCount) eventsCount.textContent = counts.events;
        if (materialsCount) materialsCount.textContent = counts.materials;
        
        // Atualizar na seção de publicações
        const pubArticlesCount = document.getElementById('pub-articles-count');
        const pubEventsCount = document.getElementById('pub-events-count');
        const pubMaterialsCount = document.getElementById('pub-materials-count');
        
        if (pubArticlesCount) pubArticlesCount.textContent = counts.articles;
        if (pubEventsCount) pubEventsCount.textContent = counts.events;
        if (pubMaterialsCount) pubMaterialsCount.textContent = counts.materials;
        
    } catch (error) {
        console.error('Erro ao atualizar contadores:', error);
    }
}

/**
 * Atualiza a lista de artigos recentes no dashboard
 */
async function refreshRecentArticlesList() {
    const recentArticlesTable = document.querySelector('#recent-articles-list');
    if (!recentArticlesTable) {
        console.log('Tabela de artigos recentes não encontrada');
        return;
    }
    
    try {
        console.log('Atualizando lista de artigos recentes...');
        
        // Obter referência para o serviço de dados (BlogData ou AdminData)
        const dataService = window.BlogData || window.AdminData;
        
        if (!dataService) {
            console.error('Serviço de dados não está disponível (BlogData/AdminData)');
            return;
        }
        
        // Limpar tabela atual
        recentArticlesTable.innerHTML = '<tr><td colspan="4" class="text-center">Carregando...</td></tr>';
        
        // Obter artigos
        let articles;
        if (typeof dataService.fetchArticles === 'function') {
            articles = await dataService.fetchArticles();
        } else {
            articles = await dataService.articles.getAll();
        }
        
        // Limpar tabela
        recentArticlesTable.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            recentArticlesTable.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum artigo encontrado</td></tr>';
            return;
        }
        
        // Exibir os 3 artigos mais recentes
        const recentArticles = articles.slice(0, 3);
        
        recentArticles.forEach(article => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${article.title}</td>
                <td>${article.category}</td>
                <td>${formatDate(article.date)}</td>
                <td>
                    <a href="${article.file_link}" target="_blank" class="btn btn-sm btn-info text-white me-1">Ver</a>
                    <button class="btn btn-sm btn-danger delete-article-btn" data-id="${article.id}">Excluir</button>
                </td>
            `;
            recentArticlesTable.appendChild(row);
        });
        
        // Inicializar botões de exclusão
        document.querySelectorAll('.delete-article-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const articleId = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este artigo?')) {
                    try {
                        if (typeof dataService.deleteArticle === 'function') {
                            await dataService.deleteArticle(articleId);
                        } else {
                            await dataService.articles.delete(articleId);
                        }
                        
                        refreshRecentArticlesList();
                        updateDashboardCounts();
                        if (typeof loadArticles === 'function') loadArticles();
                        
                        showSuccessAlert('Artigo excluído com sucesso.');
                    } catch (error) {
                        showErrorAlert('Erro ao excluir artigo: ' + (error.message || 'Tente novamente.'));
                    }
                }
            });
        });
        
        console.log('Lista de artigos recentes atualizada com sucesso');
        
    } catch (error) {
        console.error('Erro ao atualizar lista de artigos recentes:', error);
        recentArticlesTable.innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar artigos</td></tr>';
    }
}

/**
 * Formata uma data para exibição
 * @param {string} dateStr - String de data
 * @returns {string} - Data formatada
 */
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return dateStr;
    }
}

/**
 * Exibe uma mensagem de erro
 * @param {string} message - Mensagem de erro
 */
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

/**
 * Exibe uma mensagem de sucesso
 * @param {string} message - Mensagem de sucesso
 */
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

// Iniciar verificação quando o script é carregado
console.log('Modals.js está aguardando inicialização do sistema...');