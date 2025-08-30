// ===== PROJECTS.JS - COMPLETE REWRITE =====

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

function addSafeEventListener(element, event, handler) {
    if (element && typeof handler === 'function') {
        element.addEventListener(event, handler);
    }
}

// 포커스 트랩 유틸리티 함수 추가
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else { // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}

// ===== PROJECT DATA =====
const projectData = {
    project1: {
        title: "Epic Fantasy Adventure",
        description: "몰입감 있는 판타지 세계관을 구축한 대규모 게임 프로젝트입니다. 독창적인 아트 스타일과 디테일한 환경 디자인으로 플레이어를 매혹적인 모험의 세계로 인도합니다.",
        client: "Creative Studio",
        duration: "3 months",
        services: "Art Direction, Concept Art, Visual Development",
        teamSize: "4 Artists",
        media: [
            { type: "image", src: "assets/image/project01/01.png" },
            { type: "video", src: "assets/videos/main_01.mp4" },
            { type: "image", src: "assets/image/project01/02.png" },
            { type: "image", src: "assets/image/project01/03.png" }
        ]
    },
    project2: {
        title: "Character Design Showcase",
        description: "캐릭터 개발과 비주얼 스토리텔링에 중점을 둔 혁신적인 디자인 솔루션입니다. 매력적인 아트워크를 통해 프로젝트의 비전을 효과적으로 전달합니다.",
        client: "Design Agency",
        duration: "2 months",
        services: "Character Design, Illustration, Art Direction",
        teamSize: "3 Artists",
        media: [
            { type: "image", src: "assets/image/project02/01.png" },
            { type: "image", src: "assets/image/project02/02.png" }
        ]
    },
    project3: {
        title: "Environmental Concept Art",
        description: "일관된 아티스틱 솔루션을 만들어내는 포괄적인 비주얼 개발 프로젝트입니다. 환경 컨셉부터 최종 프로덕션 에셋까지 비주얼 디자인의 다양한 측면을 다룹니다.",
        client: "Production Company",
        duration: "4 months",
        services: "Concept Art, Environment Design, Visual Development",
        teamSize: "5 Artists",
        media: [
            { type: "image", src: "assets/image/project03/01.png" },
            { type: "image", src: "assets/image/project03/02.png" },
            { type: "image", src: "assets/image/project03/03.png" }
        ]
    },
    project4: {
        title: "Mobile Game Trailer",
        description: "모바일 게임을 위한 다이나믹한 트레일러 영상입니다. 게임의 핵심 요소를 시각적으로 전달하여 사용자의 관심을 끌어냅니다.",
        client: "Mobile Game Studio",
        duration: "2 weeks",
        services: "Motion Graphics, Video Editing, Sound Design",
        teamSize: "2 Artists",
        media: [
            { type: "video", src: "assets/image/project04/project04.mp4" },
            { type: "image", src: "assets/image/project04/02.png" }
        ]
    }
};

// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let totalSlides = 0;
let currentProjectMedia = [];

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
            
            // Filter projects
            projectCards.forEach((card, index) => {
                const categories = card.getAttribute('data-category') || '';
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
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
    
    // 현재 프로젝트 미디어 설정
    currentProjectMedia = project.media || [];
    totalSlides = currentProjectMedia.length;
    currentSlide = 0;
    
    // 모달 콘텐츠 생성 및 표시
    createModalContent(project);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 애니메이션 및 포커스 관리
    setTimeout(() => {
        modal.classList.add('modal-visible');
        trapFocus(modal);
        
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
        
        // 첫 번째 비디오 자동 재생
        const firstVideo = modal.querySelector('.modal-slide.modal-video video');
        if (firstVideo) {
            firstVideo.play().catch(e => console.log('비디오 자동 재생 실패:', e));
        }
    }, 100);
    
    // 슬라이더 초기화
    updateSlider();
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        // Stop all videos
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
    
    const modalHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            
            <div class="modal-images">
                <div class="image-slider" id="imageSlider">
                    ${project.media.map((item, index) => {
                        if (item.type === 'video') {
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
                <h2 class="modal-title">${project.title}</h2>
                <p class="modal-description">${project.description}</p>
                
                <div class="modal-details">
                    <div class="detail-item">
                        <h4>Client</h4>
                        <p>${project.client}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Duration</h4>
                        <p>${project.duration}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Services</h4>
                        <p>${project.services}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Team Size</h4>
                        <p>${project.teamSize}</p>
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
    
    // Move slider
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Handle video autoplay
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
        if (!modal || modal.style.display !== 'block') return;
        
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
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.scrollToTop = scrollToTop;

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

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

// ===== IMAGE PATH HANDLING =====
function tryProjectCardImagePaths(element, paths, fallback, index) {
    if (index >= paths.length) {
        console.log('⚠️ Using fallback for project card');
        element.style.background = fallback;
        return;
    }
    
    const img = new Image();
    const currentPath = paths[index];
    
    img.onload = function() {
        console.log('✅ Project card image loaded:', currentPath);
        element.style.backgroundImage = `url('${currentPath}')`;
    };
    
    img.onerror = function() {
        console.log('❌ Failed to load:', currentPath);
        tryProjectCardImagePaths(element, paths, fallback, index + 1);
    };
    
    img.src = currentPath;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Projects.js 초기화 시작');
    
    // 기본 기능 초기화
    initializeFilters();
    initializeProjectVideos();
    initializeKeyboardNav();
    initializeModalOutsideClick();
    initializeBackToTop();
    handleProjectNavigation();
    
    // 프로젝트 카드 애니메이션
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    console.log('🎉 모든 프로젝트 기능 로딩 완료');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Projects.js error:', e.error);
});