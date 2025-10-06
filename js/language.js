// ===== LANGUAGE SWITCHER =====

// 현재 언어 상태
let currentLang = localStorage.getItem('language') || 'en';
let translations = {};

// 번역 데이터 로드
async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        translations = await response.json();
        console.log('✅ 번역 데이터 로드 완료');
        return translations;
    } catch (error) {
        console.error('❌ 번역 데이터 로드 실패:', error);
        return null;
    }
}

// 프로젝트 데이터 로드 (양방향)
async function loadProjectData() {
    try {
        const response = await fetch('data/projects_json.json');
        const data = await response.json();
        console.log('✅ 프로젝트 데이터 로드 완료');
        return data;
    } catch (error) {
        console.error('❌ 프로젝트 데이터 로드 실패:', error);
        return null;
    }
}

// 언어 전환 함수
function switchLanguage(lang) {
    if (!translations || Object.keys(translations).length === 0) {
        console.warn('⚠️ 번역 데이터가 아직 로드되지 않았습니다.');
        return;
    }

    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // 언어 버튼 활성화 상태 업데이트
    updateLanguageButtons();
    
    // 페이지 콘텐츠 업데이트
    updatePageContent();
    updateProjectsPage();
    
    // HTML lang 속성 업데이트
    document.documentElement.lang = lang === 'ko' ? 'ko' : 'en';
    
    console.log(`🌐 언어 전환: ${lang.toUpperCase()}`);
}

// 언어 버튼 활성화 상태 업데이트
function updateLanguageButtons() {
    const enBtn = document.getElementById('langEN');
    const koBtn = document.getElementById('langKO');
    
    if (enBtn && koBtn) {
        if (currentLang === 'en') {
            enBtn.classList.add('active');
            koBtn.classList.remove('active');
        } else {
            enBtn.classList.remove('active');
            koBtn.classList.add('active');
        }
    }
}

// 페이지 콘텐츠 업데이트
function updatePageContent() {
    // 네비게이션
    updateNavigation();
    
    // About 섹션
    updateAbout();
    
    // Latest Projects 섹션
    updateLatestProjects();
    
    // Gallery 섹션
    updateGallery();
    
    // Services 섹션
    updateServices();
    
    // Clients 섹션
    updateClients();
    
    // Testimonials 섹션
    updateTestimonials();
    
    // Contact 섹션
    updateContact();
    
    // Footer
    updateFooter();
    
    // Meta 태그
    updateMetaTags();
}

// 네비게이션 업데이트
function updateNavigation() {
    const nav = translations.nav;
    if (!nav) return;
    
    const navLinks = {
        'home': document.querySelector('a[href="#home"]'),
        'about': document.querySelector('a[href="#about"]'),
        'projects': document.querySelector('a[href="projects.html"]'),
        'gallery': document.querySelector('a[href="gallery.html"]'),
        'blog': document.querySelector('a[href="blog.html"]'),
        'services': document.querySelector('a[href="#services"]'),
        'contact': document.querySelector('a[href="#contact"]')
    };
    
    Object.keys(navLinks).forEach(key => {
        if (navLinks[key] && nav[key]) {
            navLinks[key].textContent = nav[key][currentLang];
        }
    });
}

// About 섹션 업데이트
function updateAbout() {
    const about = translations.about;
    if (!about) return;
    
    const titleElement = document.querySelector('.about h2');
    const contentElement = document.querySelector('.about p');
    
    if (titleElement && about.title) {
        titleElement.textContent = about.title[currentLang];
    }
    
    if (contentElement && about.content) {
        contentElement.textContent = about.content[currentLang];
    }
}

// Latest Projects 섹션 업데이트
function updateLatestProjects() {
    const projects = translations.latestProjects;
    if (!projects) return;
    
    const titleElement = document.querySelector('.latest-projects h2');
    if (titleElement && projects.title) {
        titleElement.textContent = projects.title[currentLang];
    }
    
    const ctaButton = document.querySelector('.latest-projects-cta .cta-button');
    if (ctaButton && projects.viewAll) {
        ctaButton.textContent = projects.viewAll[currentLang];
    }
    
    // 프로젝트 아이템 업데이트
    const projectItems = document.querySelectorAll('.latest-project-item');
    projectItems.forEach((item, index) => {
        if (projects.items && projects.items[index]) {
            const titleEl = item.querySelector('.latest-project-overlay h4');
            const categoryEl = item.querySelector('.latest-project-overlay p');
            
            if (titleEl && projects.items[index].title) {
                titleEl.textContent = projects.items[index].title[currentLang];
            }
            if (categoryEl && projects.items[index].category) {
                categoryEl.textContent = projects.items[index].category[currentLang];
            }
        }
    });
}

// Gallery 섹션 업데이트
function updateGallery() {
    const gallery = translations.gallery;
    if (!gallery) return;
    
    const titleElement = document.querySelector('.gallery h2');
    if (titleElement && gallery.title) {
        titleElement.textContent = gallery.title[currentLang];
    }
    
    const ctaButton = document.querySelector('.gallery-cta .cta-button');
    if (ctaButton && gallery.viewFull) {
        ctaButton.textContent = gallery.viewFull[currentLang];
    }
    
    // 갤러리 아이템 업데이트
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        if (gallery.items && gallery.items[index]) {
            const titleEl = item.querySelector('.gallery-overlay h4');
            const categoryEl = item.querySelector('.gallery-overlay p');
            
            if (titleEl && gallery.items[index].title) {
                titleEl.textContent = gallery.items[index].title[currentLang];
            }
            if (categoryEl && gallery.items[index].category) {
                categoryEl.textContent = gallery.items[index].category[currentLang];
            }
        }
    });
}

// Services 섹션 업데이트
function updateServices() {
    const services = translations.services;
    if (!services) return;
    
    const titleElement = document.querySelector('.services h2');
    if (titleElement && services.title) {
        titleElement.textContent = services.title[currentLang];
    }
    
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        if (services.items && services.items[index]) {
            const titleEl = item.querySelector('h3');
            const descEl = item.querySelector('p');
            
            if (titleEl && services.items[index].title) {
                titleEl.textContent = services.items[index].title[currentLang];
            }
            if (descEl && services.items[index].description) {
                descEl.textContent = services.items[index].description[currentLang];
            }
        }
    });
}

// Clients 섹션 업데이트
function updateClients() {
    const clients = translations.clients;
    if (!clients) return;
    
    const titleElement = document.querySelector('.clients h2');
    if (titleElement && clients.title) {
        titleElement.textContent = clients.title[currentLang];
    }
}

// Testimonials 섹션 업데이트
function updateTestimonials() {
    const testimonials = translations.testimonials;
    if (!testimonials) return;
    
    const titleElement = document.querySelector('.testimonials h2');
    if (titleElement && testimonials.title) {
        titleElement.textContent = testimonials.title[currentLang];
    }
    
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    testimonialItems.forEach((item, index) => {
        if (testimonials.items && testimonials.items[index]) {
            const textEl = item.querySelector('p');
            const authorEl = item.querySelector('.testimonial-author');
            
            if (textEl && testimonials.items[index].text) {
                textEl.textContent = `"${testimonials.items[index].text[currentLang]}"`;
            }
            if (authorEl && testimonials.items[index].author) {
                authorEl.textContent = testimonials.items[index].author[currentLang];
            }
        }
    });
}

// Contact 섹션 업데이트
function updateContact() {
    const contact = translations.contact;
    if (!contact) return;
    
    // 왼쪽 정보
    const infoTitle = document.querySelector('.contact-left h2');
    if (infoTitle && contact.infoTitle) {
        infoTitle.textContent = contact.infoTitle[currentLang];
    }
    
    const intro = document.querySelector('.contact-intro');
    if (intro && contact.intro) {
        intro.textContent = contact.intro[currentLang];
    }
    
    const contactItems = document.querySelectorAll('.contact-item h4');
    if (contactItems[0] && contact.location) {
        contactItems[0].textContent = contact.location[currentLang];
    }
    if (contactItems[1] && contact.email) {
        contactItems[1].textContent = contact.email[currentLang];
    }
    if (contactItems[2] && contact.social) {
        contactItems[2].textContent = contact.social[currentLang];
    }
    
    const locationText = document.querySelector('.contact-item p');
    if (locationText && contact.locationText) {
        locationText.textContent = contact.locationText[currentLang];
    }
    
    // 오른쪽 폼
    const formTitle = document.querySelector('.contact-right h2');
    if (formTitle && contact.formTitle) {
        formTitle.textContent = contact.formTitle[currentLang];
    }
    
    const nameInput = document.getElementById('name');
    if (nameInput && contact.namePlaceholder) {
        nameInput.placeholder = contact.namePlaceholder[currentLang];
    }
    
    const emailInput = document.getElementById('email');
    if (emailInput && contact.emailPlaceholder) {
        emailInput.placeholder = contact.emailPlaceholder[currentLang];
    }
    
    const projectTypeSelect = document.getElementById('projectType');
    if (projectTypeSelect && contact.projectTypePlaceholder) {
        projectTypeSelect.options[0].textContent = contact.projectTypePlaceholder[currentLang];
        
        if (contact.projectTypes) {
            projectTypeSelect.options[1].textContent = contact.projectTypes.conceptArt[currentLang];
            projectTypeSelect.options[2].textContent = contact.projectTypes.characterDesign[currentLang];
            projectTypeSelect.options[3].textContent = contact.projectTypes.environmentDesign[currentLang];
            projectTypeSelect.options[4].textContent = contact.projectTypes.illustration[currentLang];
            projectTypeSelect.options[5].textContent = contact.projectTypes.artDirection[currentLang];
            projectTypeSelect.options[6].textContent = contact.projectTypes.multiple[currentLang];
            projectTypeSelect.options[7].textContent = contact.projectTypes.consultation[currentLang];
        }
    }
    
    const messageInput = document.getElementById('message');
    if (messageInput && contact.messagePlaceholder) {
        messageInput.placeholder = contact.messagePlaceholder[currentLang];
    }
    
    const submitButton = document.querySelector('.submit-btn');
    if (submitButton && contact.submitButton) {
        submitButton.textContent = contact.submitButton[currentLang];
    }
}

// Footer 업데이트
function updateFooter() {
    const footer = translations.footer;
    if (!footer) return;
    
    const copyright = document.querySelector('footer p');
    if (copyright && footer.copyright) {
        copyright.textContent = footer.copyright[currentLang];
    }
}

// Meta 태그 업데이트
function updateMetaTags() {
    const meta = translations.meta;
    if (!meta) return;
    
    if (meta.title) {
        document.title = meta.title[currentLang];
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && meta.description) {
        metaDescription.setAttribute('content', meta.description[currentLang]);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && meta.keywords) {
        metaKeywords.setAttribute('content', meta.keywords[currentLang]);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.title) {
        ogTitle.setAttribute('content', meta.title[currentLang]);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && meta.ogDescription) {
        ogDescription.setAttribute('content', meta.ogDescription[currentLang]);
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && meta.title) {
        twitterTitle.setAttribute('content', meta.title[currentLang]);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && meta.ogDescription) {
        twitterDescription.setAttribute('content', meta.ogDescription[currentLang]);
    }
}

// Projects 페이지 업데이트
function updateProjectsPage() {
    // Projects 페이지용 번역 데이터
    const projectsTranslations = {
        filterTabs: {
            all: { en: 'All Projects', ko: '모든 프로젝트' },
            games: { en: 'Games', ko: '게임' },
            character: { en: 'Character Design', ko: '캐릭터 디자인' },
            concept: { en: 'Concept Art', ko: '컨셉 아트' },
            promotional: { en: 'Promotional', ko: '프로모션' }
        }
    };
    
    // 필터 탭 업데이트
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (filterTabs.length > 0) {
        filterTabs[0].textContent = projectsTranslations.filterTabs.all[currentLang];
        filterTabs[1].textContent = projectsTranslations.filterTabs.games[currentLang];
        filterTabs[2].textContent = projectsTranslations.filterTabs.character[currentLang];
        filterTabs[3].textContent = projectsTranslations.filterTabs.concept[currentLang];
        filterTabs[4].textContent = projectsTranslations.filterTabs.promotional[currentLang];
    }
}

// 초기화 함수
async function initLanguage() {
    console.log('🌐 언어 시스템 초기화 중...');
    
    // 번역 데이터 로드
    await loadTranslations();
    
    // 저장된 언어 설정 복원
    currentLang = localStorage.getItem('language') || 'en';
    
    // 언어 버튼 활성화
    updateLanguageButtons();
    
    // 페이지 콘텐츠 업데이트
    if (currentLang === 'ko') {
        updatePageContent();
        updateProjectsPage();
    }
    
    console.log(`✅ 언어 시스템 초기화 완료 (현재: ${currentLang.toUpperCase()})`);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initLanguage);
