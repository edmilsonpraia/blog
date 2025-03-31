/**
 * navigation.js
 * Script para gerenciar a navegação do painel administrativo
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation.js carregado');
    
    // Carregar a sidebar se estiver usando o modo component
    if (document.getElementById('sidebar-container')) {
        loadSidebar();
    } else {
        // Se a sidebar já estiver no HTML, apenas configurar os eventos
        setupSidebarEvents();
        // Mostrar a seção padrão (dashboard)
        showSection('dashboard');
    }
    
    // Verificar login
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
    }
});

/**
 * Carrega a sidebar via AJAX
 */
function loadSidebar() {
    console.log('Carregando sidebar via AJAX');
    const sidebarContainer = document.getElementById('sidebar-container');
    
    fetch('components/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            sidebarContainer.innerHTML = html;
            console.log('Sidebar carregada com sucesso');
            
            // Inicializar ícones Feather
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
            
            // Configurar eventos após carregar
            setupSidebarEvents();
            
            // Mostrar a seção padrão (dashboard)
            showSection('dashboard');
        })
        .catch(error => {
            console.error('Erro ao carregar sidebar:', error);
            sidebarContainer.innerHTML = '<div class="alert alert-danger m-3">Erro ao carregar menu lateral. <button class="btn btn-sm btn-outline-danger" onclick="location.reload()">Tentar novamente</button></div>';
        });
}

/**
 * Configura os eventos da sidebar
 */
function setupSidebarEvents() {
    console.log('Configurando eventos da sidebar');
    
    // Links de navegação
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            console.log(`Link clicado: ${section}`);
            
            // Atualizar classes ativas
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mostrar a seção correspondente
            showSection(section);
        });
    });
    
    // Botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('adminLoggedIn');
                window.location.href = 'login.html';
            }
        });
    }
}

/**
 * Mostra uma seção específica e esconde as outras
 * @param {string} sectionName Nome da seção a ser exibida
 */
function showSection(sectionName) {
    console.log(`Mostrando seção: ${sectionName}`);
    
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar a seção solicitada
    const sectionToShow = document.getElementById(`${sectionName}-content`);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
        
        // Disparar evento para que outros scripts possam reagir à mudança de seção
        const event = new CustomEvent('sectionChanged', {
            detail: { section: sectionName }
        });
        document.dispatchEvent(event);
        
        console.log(`Seção ${sectionName} exibida`);
    } else {
        console.error(`Seção não encontrada: ${sectionName}-content`);
    }
}