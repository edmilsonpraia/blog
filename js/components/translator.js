/**
 * Componente Tradutor
 * Gerencia a mudança de idioma no blog
 */

document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
});

/**
 * Inicializa o alternador de idiomas
 */
function initLanguageToggle() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    // Verifica se há preferência de idioma salva
    const currentLang = localStorage.getItem('language') || 'pt';
    setActiveLanguage(currentLang);
    
    // Carregar as traduções para o idioma atual
    loadTranslations(currentLang);
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Atualizar botões
            setActiveLanguage(lang);
            
            // Carregar e aplicar traduções
            loadTranslations(lang);
            
            // Salvar preferência
            localStorage.setItem('language', lang);
        });
    });
    
    function setActiveLanguage(lang) {
        languageButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

/**
 * Carrega e aplica traduções para o idioma especificado
 */
function loadTranslations(lang) {
    // Em produção, isto seria carregado de um arquivo JSON
    const translations = {
        'pt': {
            'nav_home': 'Home',
            'nav_english': 'Inglês',
            'nav_medicine': 'Medicina',
            'nav_oilgas': 'Petróleo e Gás',
            'nav_engineering': 'Engenharias',
            'nav_misc': 'Diversos',
            'featured_title': 'Artigos em Destaque',
            'newsletter_title': 'Inscreva-se na nossa Newsletter',
            'newsletter_text': 'Receba as últimas atualizações diretamente no seu email.',
            'newsletter_button': 'Inscrever-se',
            'footer_about': 'Sobre o Blog',
            'footer_about_text': 'Blog multilingue focado em compartilhar conhecimento especializado em diversas áreas.',
            'footer_quicklinks': 'Links Rápidos',
            'footer_contact': 'Contato',
            'footer_rights': 'Todos os direitos reservados.'
        },
        'en': {
            'nav_home': 'Home',
            'nav_english': 'English',
            'nav_medicine': 'Medicine',
            'nav_oilgas': 'Oil & Gas',
            'nav_engineering': 'Engineering',
            'nav_misc': 'Miscellaneous',
            'featured_title': 'Featured Articles',
            'newsletter_title': 'Subscribe to our Newsletter',
            'newsletter_text': 'Receive the latest updates directly in your email.',
            'newsletter_button': 'Subscribe',
            'footer_about': 'About the Blog',
            'footer_about_text': 'Multilingual blog focused on sharing specialized knowledge in various areas.',
            'footer_quicklinks': 'Quick Links',
            'footer_contact': 'Contact',
            'footer_rights': 'All rights reserved.'
        }
    };
    
    // Aplicar traduções aos elementos com atributo data-translate
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Para elementos sem atributo data-translate, podemos buscar por conteúdo específico
    // Este é um método simplificado - em produção, todos os elementos deveriam usar data-translate
    
    // Atualizar título da seção de destaque
    const featuredTitle = document.querySelector('.section-title');
    if (featuredTitle) {
        featuredTitle.textContent = translations[lang]['featured_title'];
    }
    
    // Atualizar título da newsletter
    const newsletterTitle = document.querySelector('.newsletter-section h3');
    if (newsletterTitle) {
        newsletterTitle.textContent = translations[lang]['newsletter_title'];
    }
    
    // Atualizar texto da newsletter
    const newsletterText = document.querySelector('.newsletter-section p');
    if (newsletterText) {
        newsletterText.textContent = translations[lang]['newsletter_text'];
    }
    
    // Atualizar botão da newsletter
    const newsletterButton = document.querySelector('.newsletter-section button');
    if (newsletterButton) {
        newsletterButton.textContent = translations[lang]['newsletter_button'];
    }
}