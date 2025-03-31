/**
 * uploads.js
 * Script para gerenciar os modais de upload de publicações no painel administrativo
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script uploads.js carregado');
    // Inicializar componentes quando a página carrega
    initializeModals();
    initializeButtons();
    initializeFormHandlers();
    initializeFilters();
});

/**
 * Inicializa os modais de upload
 */
function initializeModals() {
    console.log('Inicializando modais');
    // Verificar se os modais já foram inicializados pelo Bootstrap
    if (typeof bootstrap !== 'undefined') {
        console.log('Bootstrap disponível para modais');
        // Modal de artigos científicos
        const uploadArticleModal = document.getElementById('uploadArticleModal');
        if (uploadArticleModal) {
            // Detectar quando o modal é fechado para resetar o formulário
            uploadArticleModal.addEventListener('hidden.bs.modal', function() {
                document.getElementById('scientific-article-form')?.reset();
                // Limpar mensagens de erro e validação
                clearValidationErrors(uploadArticleModal);
            });
        } else {
            console.error('Modal de artigos não encontrado no DOM');
        }

        // Modal de eventos
        const uploadEventModal = document.getElementById('uploadEventModal');
        if (uploadEventModal) {
            uploadEventModal.addEventListener('hidden.bs.modal', function() {
                document.getElementById('event-form')?.reset();
                clearValidationErrors(uploadEventModal);
            });
        } else {
            console.error('Modal de eventos não encontrado no DOM');
        }

        // Modal de materiais didáticos
        const uploadMaterialModal = document.getElementById('uploadMaterialModal');
        if (uploadMaterialModal) {
            uploadMaterialModal.addEventListener('hidden.bs.modal', function() {
                document.getElementById('material-form')?.reset();
                clearValidationErrors(uploadMaterialModal);
            });
        } else {
            console.error('Modal de materiais não encontrado no DOM');
        }
    } else {
        console.error('Bootstrap não encontrado. Os modais não funcionarão corretamente.');
    }
}

/**
 * Inicializa os botões que abrem os modais
 */
function initializeButtons() {
    console.log('Inicializando botões');
    
    // Botões para abrir o modal de artigos (nas abas Artigos e Publicações)
    const articleButtons = document.querySelectorAll('#new-article-btn');
    console.log('Botões de artigos encontrados:', articleButtons.length);
    
    articleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Botão de novo artigo clicado');
            try {
                const uploadArticleModal = new bootstrap.Modal(document.getElementById('uploadArticleModal'));
                uploadArticleModal.show();
                console.log('Modal de artigo exibido');
            } catch (error) {
                console.error('Erro ao abrir modal de artigo:', error);
                alert('Erro ao abrir o formulário de artigo. Verifique o console para mais detalhes.');
            }
        });
    });

    // Botões para abrir o modal de eventos
    const eventButtons = document.querySelectorAll('#new-event-btn');
    console.log('Botões de eventos encontrados:', eventButtons.length);
    
    eventButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Botão de novo evento clicado');
            try {
                const uploadEventModal = new bootstrap.Modal(document.getElementById('uploadEventModal'));
                uploadEventModal.show();
                console.log('Modal de evento exibido');
            } catch (error) {
                console.error('Erro ao abrir modal de evento:', error);
                alert('Erro ao abrir o formulário de evento. Verifique o console para mais detalhes.');
            }
        });
    });

    // Botões para abrir o modal de materiais
    const materialButtons = document.querySelectorAll('#new-material-btn');
    console.log('Botões de materiais encontrados:', materialButtons.length);
    
    materialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Botão de novo material clicado');
            try {
                const uploadMaterialModal = new bootstrap.Modal(document.getElementById('uploadMaterialModal'));
                uploadMaterialModal.show();
                console.log('Modal de material exibido');
            } catch (error) {
                console.error('Erro ao abrir modal de material:', error);
                alert('Erro ao abrir o formulário de material. Verifique o console para mais detalhes.');
            }
        });
    });

    // Botões de edição nas tabelas
    document.querySelectorAll('.actions-cell .btn-outline-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const title = row.querySelector('.title-cell a').textContent;
            const tab = this.closest('.tab-pane').id;
            
            // Determinar qual modal abrir com base na aba ativa
            let modalId, formId;
            if (tab === 'scientific') {
                modalId = 'uploadArticleModal';
                formId = 'scientific-article-form';
            } else if (tab === 'events') {
                modalId = 'uploadEventModal';
                formId = 'event-form';
            } else if (tab === 'materials') {
                modalId = 'uploadMaterialModal';
                formId = 'material-form';
            }
            
            if (modalId) {
                try {
                    const modal = new bootstrap.Modal(document.getElementById(modalId));
                    modal.show();
                    
                    // Preencher o formulário com os dados do item (simulado)
                    setTimeout(() => {
                        // Aqui você carregaria os dados reais do servidor
                        // Por enquanto, apenas preenchemos o título
                        const titleInput = document.querySelector(`#${formId} [id$="-title"]`);
                        if (titleInput) titleInput.value = title;
                    }, 300);
                } catch (error) {
                    console.error(`Erro ao abrir modal ${modalId}:`, error);
                }
            }
        });
    });

    // Botões de exclusão nas tabelas
    document.querySelectorAll('.actions-cell .btn-outline-danger').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const title = row.querySelector('.title-cell a').textContent;
            
            if (confirm(`Tem certeza que deseja excluir "${title}"?`)) {
                // Simulação de exclusão
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                    showToast('Item excluído com sucesso!', 'success');
                }, 500);
                
                // Em produção, você faria uma chamada AJAX para excluir o item no servidor
                // fetch('/api/publications/delete', { method: 'POST', body: JSON.stringify({ id: itemId }) });
            }
        });
    });
}

/**
 * Inicializa os manipuladores de formulários de upload
 */
function initializeFormHandlers() {
    // Formulário de artigos científicos
    const articleForm = document.getElementById('scientific-article-form');
    if (articleForm) {
        console.log('Inicializando formulário de artigos');
        
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
            categorySelect.addEventListener('change', function() {
                updateSubcategories(this.value, subcategorySelect);
            });
        }
        
        // Botão de salvar artigo
        const saveArticleBtn = document.getElementById('save-article-btn');
        if (saveArticleBtn) {
            saveArticleBtn.addEventListener('click', function() {
                handleFormSubmission(articleForm, this, 'Artigo científico publicado com sucesso!');
            });
        }
    } else {
        console.warn('Formulário de artigos não encontrado');
    }
    
    // Formulário de eventos
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        console.log('Inicializando formulário de eventos');
        
        // Contador de caracteres para a descrição
        const eventDescTextarea = document.getElementById('event-description');
        const eventDescCounter = document.getElementById('event-description-counter');
        
        if (eventDescTextarea && eventDescCounter) {
            eventDescTextarea.addEventListener('input', function() {
                const charCount = this.value.length;
                const maxLength = this.getAttribute('maxlength');
                eventDescCounter.textContent = `${charCount}/${maxLength}`;
            });
        }
        
        // Manipular o tipo de taxa (pago/gratuito)
        const eventFeeType = document.getElementById('event-fee-type');
        const eventRegistrationFee = document.getElementById('event-registration-fee');
        
        if (eventFeeType && eventRegistrationFee) {
            eventFeeType.addEventListener('change', function() {
                if (this.value === 'free') {
                    eventRegistrationFee.value = '0.00';
                    eventRegistrationFee.disabled = true;
                } else {
                    eventRegistrationFee.disabled = false;
                }
            });
        }
        
        // Gerenciar subcategorias para eventos
        const eventCategorySelect = document.getElementById('event-category');
        const eventSubcategorySelect = document.getElementById('event-subcategory');
        
        if (eventCategorySelect && eventSubcategorySelect) {
            eventCategorySelect.addEventListener('change', function() {
                updateSubcategories(this.value, eventSubcategorySelect);
            });
        }
        
        // Validar datas (data término depois de data início)
        const eventStartDate = document.getElementById('event-start-date');
        const eventEndDate = document.getElementById('event-end-date');
        
        if (eventStartDate && eventEndDate) {
            eventEndDate.addEventListener('change', function() {
                validateDateRange(eventStartDate, eventEndDate);
            });
        }
        
        // Botão de salvar evento
        const saveEventBtn = document.getElementById('save-event-btn');
        if (saveEventBtn) {
            saveEventBtn.addEventListener('click', function() {
                handleFormSubmission(eventForm, this, 'Evento publicado com sucesso!');
            });
        }
    } else {
        console.warn('Formulário de eventos não encontrado');
    }
    
    // Formulário de materiais didáticos
    const materialForm = document.getElementById('material-form');
    if (materialForm) {
        console.log('Inicializando formulário de materiais');
        
        // Contador de caracteres para a descrição
        const materialDescTextarea = document.getElementById('material-description');
        const materialDescCounter = document.getElementById('material-description-counter');
        
        if (materialDescTextarea && materialDescCounter) {
            materialDescTextarea.addEventListener('input', function() {
                const charCount = this.value.length;
                const maxLength = this.getAttribute('maxlength');
                materialDescCounter.textContent = `${charCount}/${maxLength}`;
            });
        }
        
        // Gerenciar subcategorias para materiais
        const materialCategorySelect = document.getElementById('material-category');
        const materialSubcategorySelect = document.getElementById('material-subcategory');
        
        if (materialCategorySelect && materialSubcategorySelect) {
            materialCategorySelect.addEventListener('change', function() {
                updateSubcategories(this.value, materialSubcategorySelect);
            });
        }
        
        // Mostrar campos relevantes baseados no tipo de material
        const materialTypeSelect = document.getElementById('material-type');
        if (materialTypeSelect) {
            materialTypeSelect.addEventListener('change', function() {
                updateMaterialTypeFields(this.value);
            });
        }
        
        // Botão de salvar material
        const saveMaterialBtn = document.getElementById('save-material-btn');
        if (saveMaterialBtn) {
            saveMaterialBtn.addEventListener('click', function() {
                handleFormSubmission(materialForm, this, 'Material publicado com sucesso!');
            });
        }
    } else {
        console.warn('Formulário de materiais não encontrado');
    }
}

/**
 * Inicializa os filtros de busca
 */
function initializeFilters() {
    // Filtro de busca por texto
    const searchInput = document.getElementById('search-publications');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterPublications(searchTerm);
        });
    }
    
    // Filtro por categoria
    const categoryFilter = document.getElementById('filter-category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Filtro por status
    const statusFilter = document.getElementById('filter-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Botão para limpar filtros
    const clearFiltersBtn = document.getElementById('filter-clear');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

/**
 * Subcategorias para cada categoria principal
 */
const subcategories = {
    'medicine': [
        {value: 'clinical', text: 'Clínica'},
        {value: 'research', text: 'Pesquisas'},
        {value: 'education', text: 'Educação Médica'}
    ],
    'engineering': [
        {value: 'civil', text: 'Civil'},
        {value: 'mechanical', text: 'Mecânica'},
        {value: 'electrical', text: 'Elétrica'},
        {value: 'computer', text: 'Computação'}
    ],
    'oil-gas': [
        {value: 'extraction', text: 'Extração'},
        {value: 'processing', text: 'Processamento'},
        {value: 'distribution', text: 'Distribuição'},
        {value: 'environment', text: 'Meio Ambiente'}
    ],
    'english': [
        {value: 'grammar', text: 'Gramática'},
        {value: 'vocabulary', text: 'Vocabulário'},
        {value: 'business', text: 'Inglês para Negócios'}
    ],
    'misc': [
        {value: 'technology', text: 'Tecnologia'},
        {value: 'business', text: 'Negócios'},
        {value: 'culture', text: 'Cultura'},
        {value: 'language', text: 'Idiomas'}
    ]
};

/**
 * Atualiza as opções de subcategoria com base na categoria selecionada
 * @param {string} category A categoria selecionada
 * @param {HTMLElement} subcategorySelect O elemento select de subcategoria
 */
function updateSubcategories(category, subcategorySelect) {
    // Limpar opções atuais
    subcategorySelect.innerHTML = '<option value="">Selecione uma subcategoria</option>';
    
    // Adicionar novas opções baseadas na categoria selecionada
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
}

/**
 * Valida que a data de término seja posterior à data de início
 * @param {HTMLElement} startDateElem Elemento de data de início
 * @param {HTMLElement} endDateElem Elemento de data de término
 */
function validateDateRange(startDateElem, endDateElem) {
    if (startDateElem.value && endDateElem.value) {
        if (new Date(endDateElem.value) < new Date(startDateElem.value)) {
            alert('A data de término deve ser posterior à data de início.');
            endDateElem.value = '';
        }
    }
}

/**
 * Atualiza campos específicos baseados no tipo de material
 * @param {string} materialType O tipo de material selecionado
 */
function updateMaterialTypeFields(materialType) {
    const pagesField = document.getElementById('material-pages')?.parentElement;
    const versionField = document.getElementById('material-version')?.parentElement;
    
    if (pagesField && versionField) {
        // Mostrar/esconder campos relevantes com base no tipo
        if (['guide', 'ebook', 'case', 'protocol', 'checklist'].includes(materialType)) {
            pagesField.style.display = 'block';
        } else {
            pagesField.style.display = 'none';
            document.getElementById('material-pages').value = '';
        }
        
        if (['tool'].includes(materialType)) {
            versionField.style.display = 'block';
        } else {
            versionField.style.display = 'none';
            document.getElementById('material-version').value = '';
        }
    }
}

/**
 * Processa o envio de formulário
 * @param {HTMLElement} form O formulário a ser enviado
 * @param {HTMLElement} button O botão de envio
 * @param {string} successMessage Mensagem de sucesso
 */
function handleFormSubmission(form, button, successMessage) {
    console.log('Processando envio de formulário');
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Simular envio
    const btnText = button.textContent;
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    button.disabled = true;
    
    // Em produção, você enviaria os dados via AJAX
    // const formData = new FormData(form);
    // fetch('/api/publications/save', { method: 'POST', body: formData });
    
    // Simulando um tempo de processamento
    setTimeout(() => {
        // Exibir mensagem de sucesso
        showToast(successMessage, 'success');
        
        // Limpar formulário
        form.reset();
        
        // Fechar modal
        try {
            const modal = bootstrap.Modal.getInstance(button.closest('.modal'));
            if (modal) modal.hide();
        } catch (error) {
            console.error('Erro ao fechar modal:', error);
        }
        
        // Restaurar botão
        button.innerHTML = btnText;
        button.disabled = false;
        
        // Atualizar a lista de publicações (em produção, você recarregaria do servidor)
        simulateTableUpdate();
    }, 1500);
}

/**
 * Filtra publicações com base no texto de busca
 * @param {string} searchTerm Termo de busca
 */
function filterPublications(searchTerm) {
    const tables = document.querySelectorAll('.publications-table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const title = row.querySelector('.title-cell a')?.textContent.toLowerCase() || '';
            const shouldShow = title.includes(searchTerm);
            
            row.style.display = shouldShow ? '' : 'none';
        });
    });
}

/**
 * Aplica todos os filtros ativos
 */
function applyFilters() {
    const searchTerm = document.getElementById('search-publications')?.value.toLowerCase() || '';
    const categoryValue = document.getElementById('filter-category')?.value || '';
    const statusValue = document.getElementById('filter-status')?.value || '';
    
    const tables = document.querySelectorAll('.publications-table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const title = row.querySelector('.title-cell a')?.textContent.toLowerCase() || '';
            const category = row.querySelector('.category-cell')?.textContent.toLowerCase() || '';
            const statusElement = row.querySelector('.badge.bg-success, .badge.bg-warning');
            const status = statusElement ? statusElement.textContent.toLowerCase() : '';
            
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = !categoryValue || category.includes(categoryValue.toLowerCase());
            const matchesStatus = !statusValue || status === statusValue.toLowerCase();
            
            const shouldShow = matchesSearch && matchesCategory && matchesStatus;
            row.style.display = shouldShow ? '' : 'none';
        });
    });
}

/**
 * Reseta todos os filtros
 */
function resetFilters() {
    const searchInput = document.getElementById('search-publications');
    const categoryFilter = document.getElementById('filter-category');
    const statusFilter = document.getElementById('filter-status');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    const tables = document.querySelectorAll('.publications-table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = '';
        });
    });
}

/**
 * Limpa mensagens de erro de validação
 * @param {HTMLElement} container Elemento contendo campos a serem limpos
 */
function clearValidationErrors(container) {
    container.querySelectorAll('.is-invalid').forEach(element => {
        element.classList.remove('is-invalid');
    });
}

/**
 * Exibe uma mensagem toast
 * @param {string} message Mensagem a ser exibida
 * @param {string} type Tipo de mensagem (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    // Verificar se o container de toasts já existe
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Criar o container de toasts
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Criar o elemento toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('id', toastId);
    
    // Conteúdo do toast
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
        </div>
    `;
    
    // Adicionar ao container
    toastContainer.appendChild(toast);
    
    // Inicializar e mostrar o toast
    try {
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 5000
        });
        bsToast.show();
    } catch (error) {
        console.error('Erro ao mostrar toast:', error);
        // Fallback se o Bootstrap não estiver disponível
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    // Remover após ocultar
    toast.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

/**
 * Simula atualização da tabela após uma operação
 * Em produção, você recarregaria os dados do servidor
 */
function simulateTableUpdate() {
    // Em um sistema real, você faria uma chamada AJAX para obter dados atualizados
    // Aqui apenas simulamos um refresh visual
    const tables = document.querySelectorAll('.publications-table tbody');
    
    tables.forEach(tbody => {
        tbody.style.opacity = '0.5';
        setTimeout(() => {
            tbody.style.opacity = '1';
        }, 300);
    });
}