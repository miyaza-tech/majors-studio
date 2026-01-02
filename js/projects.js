// ===== PROJECTS.JS - JSON 데이터 연동 버전 =====

// ===== GLOBAL VARIABLES =====
let projectData = {};
let currentSlide = 0;
let totalSlides = 0;
let currentProjectMedia = [];

// ===== UTILITY FUNCTIONS =====
function safeQuerySelector(selector, callback) {
    try {
        const element = document.querySelector(selector);
        if (element && typeof callback === 'function') {
            callback(element);
        }
        return element;
    } catch (error) {
        console.warn(`Error selecting ${selector}:`, error);
        return null;
    }
}

// ===== LOAD PROJECT DATA FROM JSON =====
async function loadProjectData() {
    try {
        const response = await fetch('data/projects_json.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Convert array to object for backward compatibility
        projectData = data.projects.reduce((acc, project) => {
            acc[project.id] = project;
            return acc;
        }, {});
        
        console.log('✅ Project data loaded successfully');
        return projectData;
    } catch (error) {
        console.error('❌ Failed to load project data:', error);
        // Fallback to empty data
        projectData = {};
        return projectData;
    }
}

// ===== RENDER PROJECT CARDS =====
function renderProjectCards(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    // Clear existing cards
    projectsGrid.innerHTML = '';
    
    Object.values(projects).forEach(project => {
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
}

function createProjectCard(project) {
    const lang = localStorage.getItem('language') || 'en';
    
    // Helper function to get translated text
    const getText = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['en'] || '';
        }
        return field || '';
    };
    
    // Get translated tags
    const tags = Array.isArray(project.tags) 
        ? project.tags 
        : (project.tags && project.tags[lang] ? project.tags[lang] : []);
    
    const card = document.createElement('div');
    card.className = 'project-card';
    card.id = project.id;
    card.setAttribute('data-category', project.category.join(' '));
    card.onclick = () => openModal(project.id);
    
    const thumbnail = project.media[0];
    const isVideo = thumbnail.type === 'video';
    
    card.innerHTML = `
        ${isVideo ? `<div class="video-indicator">Video</div>` : ''}
        <div class="project-image">
            <div class="project-image-inner" style="background-image: url('${project.thumbnail}');"></div>
            ${isVideo ? `
                <video class="project-video" muted loop playsinline>
                    <source src="${thumbnail.src}" type="video/mp4">
                </video>
            ` : ''}
        </div>
        <div class="project-info">
            <h3 class="project-title">${getText(project.title)}</h3>
            <p class="project-description">${getText(project.description)}</p>
            <div class="project-tags">
                ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Update project cards when language changes
function updateProjectCards() {
    if (Object.keys(projectData).length > 0) {
        renderProjectCards(projectData);
        initializeProjectVideos();
        
        // Re-animate cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// ===== FOCUS TRAP =====
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            // 먼저 모든 카드를 fade out
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            });
            
            // 잠시 후 필터링 및 fade in
            setTimeout(() => {
                let visibleIndex = 0;
                projectCards.forEach((card) => {
                    const categories = card.getAttribute('data-category') || '';
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    if (shouldShow) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, visibleIndex * 80);
                        visibleIndex++;
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 300);
        });
    });
}

// ===== MODAL FUNCTIONS =====
function openModal(projectId) {
    console.log('Opening modal for project:', projectId);
    
    const modal = document.querySelector('#projectModal');
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }
    
    const project = projectData[projectId];
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    currentProjectMedia = project.media || [];
    totalSlides = currentProjectMedia.length;
    currentSlide = 0;
    
    createModalContent(project);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.classList.add('modal-visible');
        trapFocus(modal);
        
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
        
        const firstVideo = modal.querySelector('.modal-slide.modal-video video');
        if (firstVideo) {
            firstVideo.play().catch(e => console.log('비디오 자동 재생 실패:', e));
        }
    }, 100);
    
    updateSlider();
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createModalContent(project) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Get current language
    const lang = localStorage.getItem('language') || 'en';
    
    // Helper function to get translated text
    const getText = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['en'] || '';
        }
        return field || '';
    };
    
    // Get translated tags
    const tags = Array.isArray(project.tags) 
        ? project.tags 
        : (project.tags && project.tags[lang] ? project.tags[lang] : []);
    
    const modalHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            
            <div class="modal-images">
                <div class="image-slider" id="imageSlider">
                    ${project.media.map((item, index) => {
                        if (item.type === 'youtube') {
                            return `
                                <div class="modal-slide modal-video modal-youtube">
                                    <iframe 
                                        src="https://www.youtube.com/embed/${item.src}?autoplay=0&mute=1&loop=1&playlist=${item.src}&controls=1&rel=0"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen>
                                    </iframe>
                                </div>
                            `;
                        } else if (item.type === 'video') {
                            return `
                                <div class="modal-slide modal-video">
                                    <video src="${item.src}" muted loop playsinline controls>
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="modal-slide modal-image" style="background-image: url('${item.src}');">
                                    <div class="image-placeholder">Image ${index + 1}</div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
                
                ${project.media.length > 1 ? `
                    <button class="image-nav prev-btn" onclick="prevImage()">❮</button>
                    <button class="image-nav next-btn" onclick="nextImage()">❯</button>
                    <div class="image-dots">
                        ${project.media.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="modal-info">
                <h2 class="modal-title">${getText(project.title)}</h2>
                <p class="modal-description">${getText(project.description)}</p>
                
                <div class="modal-details">
                    <div class="detail-item">
                        <h4>${lang === 'ko' ? '클라이언트' : 'Client'}</h4>
                        <p>${getText(project.client)}</p>
                    </div>
                    <div class="detail-item">
                        <h4>${lang === 'ko' ? '기간' : 'Duration'}</h4>
                        <p>${getText(project.duration)}</p>
                    </div>
                    <div class="detail-item">
                        <h4>${lang === 'ko' ? '서비스' : 'Services'}</h4>
                        <p>${getText(project.services)}</p>
                    </div>
                    <div class="detail-item">
                        <h4>${lang === 'ko' ? '팀 규모' : 'Team Size'}</h4>
                        <p>${getText(project.teamSize)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalHTML;
}

// ===== SLIDER NAVIGATION =====
function updateSlider() {
    const slider = document.getElementById('imageSlider');
    const dots = document.querySelectorAll('.dot');
    
    if (!slider) return;
    
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    const slides = slider.querySelectorAll('.modal-slide');
    slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video) {
            if (index === currentSlide) {
                video.currentTime = 0;
                video.play().catch(e => console.log('Video play failed:', e));
            } else {
                video.pause();
            }
        }
    });
}

function nextImage() {
    if (totalSlides <= 1) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevImage() {
    if (totalSlides <= 1) return;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.goToSlide = goToSlide;

// ===== PROJECT VIDEO HOVER =====
function initializeProjectVideos() {
    const projectVideos = document.querySelectorAll('.project-card .project-video');
    
    projectVideos.forEach(video => {
        const card = video.closest('.project-card');
        if (!card) return;
        
        card.addEventListener('mouseenter', () => {
            video.play().catch(e => console.log('Video hover play failed'));
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('projectModal');
        if (!modal || modal.style.display !== 'flex') return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
}

// ===== MODAL OUTSIDE CLICK =====
function initializeModalOutsideClick() {
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('projectModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ===== SCROLL TO TOP =====
// main.js에서 처리하므로 여기서는 제거

// ===== PROJECT NAVIGATION FROM MAIN PAGE =====
function handleProjectNavigation() {
    const projectToOpen = sessionStorage.getItem('openProject');
    if (projectToOpen) {
        sessionStorage.removeItem('openProject');
        setTimeout(() => {
            const projectCard = document.getElementById(projectToOpen);
            if (projectCard) {
                projectCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                projectCard.classList.add('project-scale-highlight');
                setTimeout(() => {
                    projectCard.classList.remove('project-scale-highlight');
                }, 1000);
            }
        }, 500);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('✅ Projects.js 초기화 시작');
    
    // Load project data from JSON
    await loadProjectData();
    
    // Render project cards with current language
    renderProjectCards(projectData);
    
    // Debug: Check if openModal is available
    console.log('🔍 openModal 함수 사용 가능:', typeof window.openModal === 'function');
    console.log('🔍 로드된 프로젝트 수:', Object.keys(projectData).length);
    
    // Initialize features
    initializeFilters();
    initializeProjectVideos();
    initializeKeyboardNav();
    initializeModalOutsideClick();
    handleProjectNavigation();
    
    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    console.log('🎉 모든 프로젝트 기능 로딩 완료');
});

// Listen for language changes
window.addEventListener('languageChanged', function() {
    updateProjectCards();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Projects.js error:', e.error);
});