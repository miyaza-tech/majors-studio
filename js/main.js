// ===== MAJORS STUDIO - MAIN.JS =====
// 깔끔하게 재작성된 메인 스크립트

// ===== GLOBAL VARIABLES =====
let currentHeroSlide = 0;
let heroSlideInterval;
let isSubmitting = false; // 이메일 전송 중복 방지

// ===== UTILITY FUNCTIONS =====
function safeQuery(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Query error for ${selector}:`, error);
        return null;
    }
}

function safeQueryAll(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.warn(`QueryAll error for ${selector}:`, error);
        return [];
    }
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const menuBtn = safeQuery('#mobileMenuBtn');
    const navLinks = safeQuery('#navLinks');
    
    if (!menuBtn || !navLinks) return;
    
    function toggleMenu() {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
        document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : 'auto';
    }
    
    function closeMenu() {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('mobile-active');
        document.body.style.overflow = 'auto';
    }
    
    // 이벤트 리스너
    menuBtn.addEventListener('click', toggleMenu);
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') closeMenu();
    });
    
    // 외부 클릭으로 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('mobile-active') && 
            !navLinks.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });
    
    // 화면 크기 변경 시 메뉴 닫기
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

// ===== HERO SLIDER =====
function initializeHeroSlider() {
    const heroSlides = safeQueryAll('.hero-slide');
    const heroDots = safeQueryAll('.hero-dot');
    const heroSection = safeQuery('.hero');
    
    if (heroSlides.length === 0) return;
    
    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            const video = slide.querySelector('.hero-video');
            
            if (i === index) {
                slide.classList.add('active');
                if (video && video.readyState >= 2) {
                    video.play().catch(() => {});
                }
            } else {
                slide.classList.remove('active');
                if (video) video.pause();
            }
        });
        
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentHeroSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentHeroSlide + 1) % heroSlides.length;
        showSlide(nextIndex);
    }
    
    function startSlider() {
        if (heroSlides.length > 1) {
            heroSlideInterval = setInterval(nextSlide, 6000);
        }
    }
    
    function stopSlider() {
        clearInterval(heroSlideInterval);
    }
    
    // 네비게이션 이벤트
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlider();
            setTimeout(startSlider, 10000);
        });
    });
    
    // 화살표 네비게이션
    window.nextHeroSlideManual = () => {
        nextSlide();
        stopSlider();
        setTimeout(startSlider, 8000);
    };
    
    window.prevHeroSlide = () => {
        const prevIndex = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prevIndex);
        stopSlider();
        setTimeout(startSlider, 8000);
    };
    
    // 호버 시 슬라이더 일시정지
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlider);
        heroSection.addEventListener('mouseleave', startSlider);
    }
    
    // 탭 변경 시 비디오 제어
    document.addEventListener('visibilitychange', () => {
        const activeVideo = safeQuery('.hero-slide.active .hero-video');
        if (activeVideo) {
            if (document.hidden) {
                activeVideo.pause();
            } else {
                activeVideo.play().catch(() => {});
            }
        }
    });
    
    // 슬라이더 시작
    startSlider();
}

// ===== HERO VIDEO LOADING =====
function initializeHeroVideos() {
    const videos = safeQueryAll('.hero-video');
    
    videos.forEach((video, index) => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        if (index === 0) {
            video.preload = 'auto';
            video.addEventListener('loadeddata', () => {
                console.log('First video ready');
                video.style.display = 'block';
                const fallback = video.nextElementSibling;
                if (fallback?.classList.contains('video-fallback')) {
                    fallback.style.display = 'none';
                }
                video.play().catch(() => {});
                
                // 나머지 비디오들 순차 로딩
                setTimeout(() => {
                    videos.forEach((v, i) => {
                        if (i > 0) {
                            setTimeout(() => {
                                v.preload = 'auto';
                                v.load();
                            }, i * 2000);
                        }
                    });
                }, 1000);
            });
        } else {
            video.preload = 'metadata';
            video.addEventListener('loadeddata', () => {
                video.style.display = 'block';
                const fallback = video.nextElementSibling;
                if (fallback?.classList.contains('video-fallback')) {
                    fallback.style.display = 'none';
                }
            });
        }
        
        // 비디오 로딩 실패 시 폴백
        video.addEventListener('error', () => {
            video.style.display = 'none';
            const fallback = video.nextElementSibling;
            if (fallback?.classList.contains('video-fallback')) {
                fallback.style.display = 'flex';
            }
        });
    });
}

// ===== EMAIL FUNCTIONALITY =====
function initializeEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded');
        return false;
    }
    
    if (typeof EMAIL_CONFIG === 'undefined') {
        console.error('⚠️ EMAIL_CONFIG not found. Please create js/config.js file.');
        return false;
    }
    
    emailjs.init(EMAIL_CONFIG.publicKey);
    console.log('EmailJS initialized');
    return true;
}

function initializeContactForm() {
    const contactForm = safeQuery('#contactForm');
    if (!contactForm) return;
    
    // 기존 이벤트 리스너 제거 (중복 방지)
    const newForm = contactForm.cloneNode(true);
    contactForm.parentNode.replaceChild(newForm, contactForm);
    
    newForm.addEventListener('submit', handleFormSubmit);
    console.log('Contact form initialized');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // 중복 전송 방지
    if (isSubmitting) {
        console.log('Email already sending...');
        return;
    }
    
    // 폼 데이터 검증
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.email || !data.projectType || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // 전송 시작
    isSubmitting = true;
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    console.log('Sending email...');
    
    // EmailJS 전송
    emailjs.sendForm(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        e.target
    ).then((response) => {
        console.log('Email sent successfully:', response.status);
        alert('문의가 성공적으로 전송되었습니다!\n24시간 내에 답변드리겠습니다.');
        e.target.reset();
    }).catch((error) => {
        console.error('Email send failed:', error);
        alert('전송 중 오류가 발생했습니다.\n다시 시도해주세요.');
    }).finally(() => {
        // 상태 복원
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
        console.log('Email form reset');
    });
}

// ===== PROJECT IMAGES =====
function initializeProjectImages() {
    const projects = [
        {
            selector: '.main-project1',
            image: 'assets/image/project01/01.png',
            fallback: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            selector: '.main-project2', 
            image: 'assets/image/project02/01.png',
            fallback: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            selector: '.main-project3',
            image: 'assets/image/project03/01.png', 
            fallback: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
    ];
    
    projects.forEach((project, index) => {
        const element = safeQuery(project.selector);
        if (!element) return;
        
        element.style.position = 'relative';
        
        const img = new Image();
        img.onload = () => {
            element.style.backgroundImage = `url('${project.image}')`;
            element.style.backgroundSize = 'cover';
            element.style.backgroundPosition = 'center';
            console.log(`Project ${index + 1} image loaded`);
        };
        
        img.onerror = () => {
            element.style.background = project.fallback;
            console.log(`Project ${index + 1} using fallback`);
        };
        
        img.src = project.image;
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    safeQueryAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = safeQuery(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = safeQuery('#backToTop');
    if (!backToTop) return;
    
    function toggleVisibility() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show', 'visible');
        } else {
            backToTop.classList.remove('show', 'visible');
        }
    }
    
    window.scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    backToTop.addEventListener('click', window.scrollToTop);
    window.addEventListener('scroll', toggleVisibility);
    
    // 초기 상태 설정
    toggleVisibility();
}

// ===== ACTIVE NAVIGATION =====
function initializeActiveNavigation() {
    function updateActiveNav() {
        const sections = safeQueryAll('section[id]');
        const navLinks = safeQueryAll('.nav-links a');
        
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
    
    window.addEventListener('scroll', updateActiveNav);
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    safeQueryAll('.service-item, .project-item, .testimonial-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== PROJECT NAVIGATION =====
function initializeProjectNavigation() {
    // 기존 onclick 함수 유지 (다른 페이지에서 사용 가능)
    window.goToProject = (projectId) => {
        sessionStorage.setItem('openProject', projectId);
        window.location.href = 'projects.html';
    };
    
    // index 페이지의 latest-project-item에 이벤트 리스너 추가
    const latestProjectItems = document.querySelectorAll('.latest-project-item');
    latestProjectItems.forEach(item => {
        const projectId = item.getAttribute('data-project');
        if (projectId) {
            item.addEventListener('click', () => {
                sessionStorage.setItem('openProject', projectId);
                window.location.href = 'projects.html';
            });
        }
    });
}

// ===== GALLERY FUNCTIONALITY =====
function initializeGallery() {
    const filterBtns = safeQueryAll('.gallery .filter-btn');
    const galleryItems = safeQueryAll('.gallery-item');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성 버튼 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // 갤러리 아이템 필터링
            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
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
    
    // 갤러리 아이템 클릭
    safeQueryAll('.gallery .gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = 'gallery.html';
        });
    });
}

// ===== PROJECT VIDEOS =====
function initializeProjectVideos() {
    const projectVideos = safeQueryAll('.project-card .project-video');
    
    projectVideos.forEach(video => {
        const card = video.closest('.project-card');
        if (!card) return;
        
        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// ===== VIDEO INTERSECTION OBSERVER =====
function initializeVideoObserver() {
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
    
    const heroSection = safeQuery('.hero');
    if (heroSection) {
        videoObserver.observe(heroSection);
    }
}

// ===== ERROR HANDLING =====
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('JavaScript error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.warn('Unhandled promise rejection:', e.reason);
    });
}

// ===== PERFORMANCE MONITORING =====
function initializePerformanceMonitoring() {
    window.addEventListener('load', () => {
        console.log('Page fully loaded');
        
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }
    });
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('MAJORS STUDIO - Initializing...');
    
    try {
        // 기본 기능들
        initializeMobileMenu();
        initializeSmoothScrolling();
        initializeBackToTop();
        initializeActiveNavigation();
        initializeScrollAnimations();
        initializeProjectNavigation();
        initializeErrorHandling();
        
        // EmailJS 초기화 및 Contact Form
        if (initializeEmailJS()) {
            initializeContactForm();
        }
        
        // Hero 슬라이더 (존재하는 경우에만)
        const heroSlides = safeQueryAll('.hero-slide');
        if (heroSlides.length > 0) {
            initializeHeroVideos();
            initializeHeroSlider();
        }
        
        // 프로젝트 이미지 (지연 로딩)
        setTimeout(() => {
            initializeProjectImages();
        }, 200);
        
        // 페이지별 기능들
        initializeGallery();
        initializeProjectVideos();
        initializeVideoObserver();
        initializePerformanceMonitoring();
        
        console.log('MAJORS STUDIO - All components initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});