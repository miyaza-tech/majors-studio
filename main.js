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

// ===== MOBILE MENU FUNCTIONALITY =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

function toggleMobileMenu() {
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');

    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('mobile-active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('mobile-active');
    document.body.style.overflow = 'auto';
}

// Mobile menu button click
addSafeEventListener(mobileMenuBtn, 'click', toggleMobileMenu);

// Close menu when clicking on nav links
addSafeEventListener(navLinks, 'click', (e) => {
    if (e.target.tagName === 'A') {
        closeMobileMenu();
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('mobile-active')) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// ===== HERO SLIDER FUNCTIONALITY =====
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const totalHeroSlides = heroSlides.length;
let heroSlideInterval;

// Optimize video handling when changing slides
function showHeroSlide(index) {
    if (totalHeroSlides === 0) return;
    
    heroSlides.forEach((slide, i) => {
        const video = slide.querySelector('.hero-video');
        
        if (i === index) {
            slide.classList.add('active');
            if (video && video.readyState >= 2) {
                // Only play the video if it is fully loaded
                video.play().catch(e => console.log('Play prevented:', e));
            }
        } else {
            slide.classList.remove('active');
            if (video) {
                video.pause();
            }
        }
    });
    
    heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    currentHeroSlide = index;
}

function nextHeroSlide() {
    if (totalHeroSlides === 0) return;
    const nextIndex = (currentHeroSlide + 1) % totalHeroSlides;
    showHeroSlide(nextIndex);
}

function prevHeroSlide() {
    if (totalHeroSlides === 0) return;
    const prevIndex = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
    showHeroSlide(prevIndex);
}

function nextHeroSlideManual() {
    nextHeroSlide();
    stopHeroSlider();
    setTimeout(startHeroSlider, 8000); // 8초 후 자동 슬라이드 재시작
}

function startHeroSlider() {
    if (totalHeroSlides > 1) {
        heroSlideInterval = setInterval(nextHeroSlide, 6000); // 6초마다 슬라이드 변경
    }
}

function stopHeroSlider() {
    clearInterval(heroSlideInterval);
}

// ===== OPTIMIZED HERO VIDEO LOADING =====
function initializeHeroVideos() {
    const videos = document.querySelectorAll('.hero-video');
    
    videos.forEach((video, index) => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', '');
        
        // 첫 번째 영상만 즉시 로드, 나머지는 lazy loading
        if (index === 0) {
            video.preload = 'auto';
            video.autoplay = true;
            
            // 첫 번째 영상 우선 로드
            video.addEventListener('loadeddata', function() {
                console.log(`✅ First video ready`);
                this.style.display = 'block';
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('video-fallback')) {
                    fallback.style.display = 'none';
                }
                
                // 첫 영상 재생 시도
                this.play().catch(e => {
                    console.log('Autoplay blocked, trying muted play');
                    this.muted = true;
                    this.play().catch(err => console.log('Play failed:', err));
                });
                
                // 첫 영상 로드 후 다음 영상들 순차적으로 로드
                loadNextVideos();
            });
        } else {
            // 나머지 영상들은 metadata만 로드
            video.preload = 'metadata';
            video.autoplay = false;
            
            video.addEventListener('loadeddata', function() {
                console.log(`✅ Video ${index + 1} ready`);
                this.style.display = 'block';
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('video-fallback')) {
                    fallback.style.display = 'none';
                }
            }, { once: true });
        }

        // 에러 처리
        video.addEventListener('error', function() {
            console.log(`❌ Video ${index + 1} failed`);
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('video-fallback')) {
                fallback.style.display = 'flex';
            }
        });
    });
    
    // 순차적 영상 로딩 함수
    function loadNextVideos() {
        videos.forEach((video, index) => {
            if (index > 0) {
                // 2초 간격으로 나머지 영상들 로드
                setTimeout(() => {
                    video.preload = 'auto';
                    video.load();
                }, index * 2000);
            }
        });
    }
}


// Dot click functionality
heroDots.forEach((dot, index) => {
    addSafeEventListener(dot, 'click', () => {
        showHeroSlide(index);
        stopHeroSlider();
        setTimeout(startHeroSlider, 10000); // 10초 후 자동 슬라이드 재시작
    });
});

// Pause slider on hero hover
const heroSection = document.querySelector('.hero');
if (heroSection) {
    addSafeEventListener(heroSection, 'mouseenter', stopHeroSlider);
    addSafeEventListener(heroSection, 'mouseleave', startHeroSlider);
}

// Handle visibility change (pause videos when tab is not active)
document.addEventListener('visibilitychange', function () {
    const activeVideo = document.querySelector('.hero-slide.active .hero-video');
    if (activeVideo) {
        if (document.hidden) {
            activeVideo.pause();
        } else {
            activeVideo.play().catch(e => console.log('Video resume prevented:', e));
        }
    }
});

// ===== SMOOTH SCROLLING FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    addSafeEventListener(anchor, 'click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== BACK TO TOP BUTTON =====
const backToTopButton = document.getElementById('backToTop');

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide back to top button based on scroll position
function toggleBackToTopButton() {
    if (backToTopButton) {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
}

// Add click event to back to top button
addSafeEventListener(backToTopButton, 'click', scrollToTop);

// Add scroll event listener for back to top button
window.addEventListener('scroll', toggleBackToTopButton);

// ===== ACTIVE NAVIGATION HIGHLIGHT =====
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener for active navigation
window.addEventListener('scroll', updateActiveNavigation);

// ===== PROJECT NAVIGATION FUNCTIONALITY =====
function goToProject(projectId) {
    // Store the project ID in sessionStorage to open the modal on the projects page
    sessionStorage.setItem('openProject', projectId);
    // Navigate to projects page
    window.location.href = 'projects.html';
}

// ===== ENHANCED IMAGE LOADING =====
function initializeProjectImages() {
    const projectImages = [
        { 
            selector: '.main-project1', 
            paths: [
                'assets/image/project01/01.png',  // 🔸 올바른 경로
                './assets/image/project01/01.png',
                '../assets/image/project01/01.png'
            ],
            fallback: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        { 
            selector: '.main-project2', 
            paths: [
                'assets/image/project02/01.png',
                './assets/image/project02/01.png',
                '../assets/image/project02/01.png'
            ],
            fallback: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        { 
            selector: '.main-project3', 
            paths: [
                'assets/image/project03/01.png',
                './assets/image/project03/01.png',
                '../assets/image/project03/01.png'
            ],
            fallback: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
    ];
    
    console.log('🔍 이미지 로딩 시작...');
    console.log('현재 위치:', window.location.pathname);
    
    projectImages.forEach((project, index) => {
        const element = safeQuerySelector(project.selector);
        if (element) {
            console.log(`✅ 요소 발견: ${project.selector}`);
            
            // 플레이스홀더 생성
            const placeholder = document.createElement('div');
            placeholder.className = 'project-placeholder';
            placeholder.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${project.fallback};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 500;
                z-index: 1;
            `;
            placeholder.textContent = `프로젝트 ${index + 1}`;
            
            element.style.position = 'relative';
            element.appendChild(placeholder);
            
            tryImagePaths(element, project.paths, project.fallback, 0, placeholder);
        }
    });
}

function tryImagePaths(element, paths, fallback, index, placeholder) {
    if (index >= paths.length) {
        console.log(`⚠️ 모든 경로 실패 - 폴백 사용`);
        return;
    }
    
    const img = new Image();
    const currentPath = paths[index];
    
    console.log(`🔄 시도 중: ${currentPath}`);
    
    img.onload = function() {
        console.log(`✅ 이미지 로딩 성공: ${currentPath}`);
        
        element.style.backgroundImage = `url('${currentPath}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
        
        if (placeholder && placeholder.parentNode) {
            placeholder.style.transition = 'opacity 0.5s ease';
            placeholder.style.opacity = '0';
            setTimeout(() => placeholder.parentNode?.removeChild(placeholder), 500);
        }
        
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease';
            element.style.opacity = '1';
        }, 100);
    };
    
    img.onerror = function() {
        console.log(`❌ 로딩 실패: ${currentPath}`);
        tryImagePaths(element, paths, fallback, index + 1, placeholder);
    };
    
    img.src = currentPath;
}

// ===== FORM HANDLING =====
// EmailJS 초기화 함수
function initializeEmailJS() {
    // 여기에 본인의 Public Key 입력
    emailjs.init("Bn7_gkZzr5mpW9QM4");
    console.log('📧 EmailJS 초기화 완료');
}

// 수정된 contact form 함수
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 검증
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!data.name || 
                !data.email || 
                !data.projectType || 
                !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // 버튼 상태 변경
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;
            
            console.log('📤 이메일 전송 시작...');
            
            // EmailJS로 이메일 전송
            emailjs.sendForm(
                'service_0ahp61o',     // 서비스 ID
                'ejs-test-mail-service',    // 템플릿 ID
                this                   // 폼 엘리먼트
            ).then(function(response) {
                console.log('✅ 전송 성공:', 
                    response.status, response.text);
                alert('문의가 성공적으로 전송되었습니다!\n' + 
                      '24시간 내에 답변드리겠습니다.');
                contactForm.reset();
            }, function(error) {
                console.error('❌ 전송 실패:', error);
                alert('전송 중 오류가 발생했습니다.\n' + 
                      '다시 시도해주세요.');
            }).finally(function() {
                // 버튼 상태 복원
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                console.log('🔄 버튼 상태 복원 완료');
            });
        });
        
        console.log('📝 Contact form 이벤트 등록 완료');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Main.js 시작');
    
    // ✅ EmailJS 초기화 추가
    initializeEmailJS();
    
    if (heroSlides.length > 0) {
        initializeHeroVideos();
        startHeroSlider();
    }
    
    setTimeout(() => {
        console.log('🖼️ 프로젝트 이미지 로딩 시작...');
        initializeProjectImages();
    }, 200);
    
    // 이미 있는 함수 (수정된 버전으로)
    initializeContactForm();
    initializeScrollAnimations();
    toggleBackToTopButton();
    
    console.log('🎉 모든 컴포넌트 초기화 완료');
});


// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.service-item, .project-item, .testimonial-item');
    animateElements.forEach(el => observer.observe(el));
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📍 Main.js 시작');
    
    if (heroSlides.length > 0) {
        initializeHeroVideos();
        startHeroSlider();
    }
    
    setTimeout(() => {
        console.log('🖼️ 프로젝트 이미지 로딩 시작...');
        initializeProjectImages();
    }, 200);
    
    initializeContactForm();
    initializeScrollAnimations();
    toggleBackToTopButton();
    
    console.log('🎉 모든 컴포넌트 초기화 완료');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.warn('JavaScript error caught:', e.error);
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Optional: Add performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
});



// gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.gallery .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});



// gallery item click to go to gallery page
document.querySelectorAll('.gallery .gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        window.location.href = 'gallery.html';
    });
});

// 프로젝트 페이지 비디오 호버 재생
document.addEventListener('DOMContentLoaded', function() {
    const projectVideos = document.querySelectorAll('.project-card .project-video');
    
    projectVideos.forEach(video => {
        const card = video.closest('.project-card');
        
        if (card) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Video play failed'));
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
});

// Intersection Observer를 활용한 영상 일시 정지
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target.querySelector('.hero-video.active');
        if (video) {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }
    });
}, { threshold: 0.5 });

// Hero 섹션 관찰
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        videoObserver.observe(heroSection);
    }
});