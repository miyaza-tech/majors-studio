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
    
    emailjs.init("Bn7_gkZzr5mpW9QM4");
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
        'service_0ahp61o',
        'template_uc1mm7x',
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

// ===== HEADER SCROLL EFFECT =====
function initializeHeaderScroll() {
    const header = safeQuery('header');
    const heroSection = safeQuery('.hero');
    
    if (!header) return;
    
    function updateHeaderBackground() {
        // 히어로 섹션이 없는 서브페이지는 항상 배경 표시
        if (!heroSection) {
            header.classList.add('scrolled');
            return;
        }
        
        // 히어로 섹션이 있으면 히어로 높이 기준
        const threshold = heroSection.offsetHeight - 100;
        
        if (window.scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeaderBackground);
    
    // 초기 상태 설정
    updateHeaderBackground();
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = safeQuery('#backToTop');
    if (!backToTop) return;
    
    function toggleVisibility() {
        // 스크롤이 100px 이상이거나, 페이지가 viewport보다 크면 표시
        const pageHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const hasScroll = pageHeight > viewportHeight + 100;
        
        if (window.scrollY > 100 || hasScroll) {
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
    window.addEventListener('resize', toggleVisibility);
    
    // 초기 상태 설정 - 약간의 딜레이 후 체크
    setTimeout(toggleVisibility, 100);
    toggleVisibility();
}

// ===== ACTIVE NAVIGATION =====
function initializeActiveNavigation() {
    // 서브페이지(projects, gallery, blog)에서는 스크롤 기반 활성화 비활성화
    const currentPage = window.location.pathname.split('/').pop();
    const subPages = ['projects.html', 'gallery.html', 'blog.html', 'blog_post.html'];
    
    if (subPages.includes(currentPage)) {
        // 서브페이지에서는 HTML에 설정된 active 클래스 유지
        return;
    }
    
    function updateActiveNav() {
        const sections = safeQueryAll('section[id]');
        const navLinks = safeQueryAll('.nav-links a');
        
        let current = 'home'; // 기본값을 home으로 설정
        
        // 페이지 맨 아래에 도달했으면 contact 활성화
        const scrollBottom = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (scrollBottom >= pageHeight - 50) {
            current = 'contact';
        } else if (window.scrollY < 100) {
            // 페이지 맨 위에 있으면 home 활성화
            current = 'home';
        } else {
            // 각 섹션을 순회하며 현재 보이는 섹션 찾기
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                // 스크롤 위치가 섹션 시작점 - 200px 이상이면 해당 섹션으로 설정
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // #섹션 링크 또는 index.html#섹션 링크 매칭
            if (href === `#${current}` || href === `index.html#${current}`) {
                link.classList.add('active');
            }
            
            // projects, gallery, blog 섹션일 때 해당 외부 페이지 링크도 활성화
            if (current === 'projects' && href === 'projects.html') {
                link.classList.add('active');
            }
            if (current === 'gallery' && href === 'gallery.html') {
                link.classList.add('active');
            }
            if (current === 'blog' && href === 'blog.html') {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    // 초기 상태 설정
    updateActiveNav();
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // 기본 fade-up 애니메이션 옵저버
    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 순차적 애니메이션 옵저버 (stagger effect)
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.stagger-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // 섹션 타이틀 애니메이션
    safeQueryAll('section h2').forEach(el => {
        el.classList.add('scroll-animate', 'fade-up');
        fadeUpObserver.observe(el);
    });
    
    // 서비스 아이템 - stagger 효과
    const servicesGrid = safeQuery('.services-grid');
    if (servicesGrid) {
        servicesGrid.querySelectorAll('.service-item').forEach(item => {
            item.classList.add('stagger-item', 'scroll-animate', 'fade-up');
        });
        staggerObserver.observe(servicesGrid);
    }
    
    // 프로젝트 아이템 - stagger 효과
    const projectsGrid = safeQuery('.latest-projects-grid');
    if (projectsGrid) {
        projectsGrid.querySelectorAll('.latest-project-item').forEach(item => {
            item.classList.add('stagger-item', 'scroll-animate', 'fade-up');
        });
        staggerObserver.observe(projectsGrid);
    }
    
    // 갤러리 아이템 - stagger 효과
    const galleryGrid = safeQuery('.gallery-grid');
    if (galleryGrid) {
        galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.add('stagger-item', 'scroll-animate', 'scale-in');
        });
        staggerObserver.observe(galleryGrid);
    }
    
    // 후기 아이템 - stagger 효과
    const testimonialsGrid = safeQuery('.testimonials-grid');
    if (testimonialsGrid) {
        testimonialsGrid.querySelectorAll('.testimonial-item').forEach(item => {
            item.classList.add('stagger-item', 'scroll-animate', 'fade-up');
        });
        staggerObserver.observe(testimonialsGrid);
    }
    
    // About 섹션
    safeQueryAll('.about p').forEach(el => {
        el.classList.add('scroll-animate', 'fade-up');
        fadeUpObserver.observe(el);
    });
    
    // Blog Featured 섹션
    const blogFeatured = safeQuery('.featured-blog-content');
    if (blogFeatured) {
        blogFeatured.classList.add('scroll-animate', 'fade-up');
        fadeUpObserver.observe(blogFeatured);
    }
    
    // Contact 섹션
    const contactWrapper = safeQuery('.contact-wrapper');
    if (contactWrapper) {
        const contactLeft = contactWrapper.querySelector('.contact-left');
        const contactRight = contactWrapper.querySelector('.contact-right');
        if (contactLeft) {
            contactLeft.classList.add('scroll-animate', 'fade-right');
            fadeUpObserver.observe(contactLeft);
        }
        if (contactRight) {
            contactRight.classList.add('scroll-animate', 'fade-left');
            fadeUpObserver.observe(contactRight);
        }
    }
    
    // CTA 버튼들
    safeQueryAll('.cta-button, .latest-projects-cta, .gallery-cta').forEach(el => {
        el.classList.add('scroll-animate', 'fade-up');
        fadeUpObserver.observe(el);
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
        initializeHeaderScroll();
        initializeActiveNavigation();
        initializeScrollAnimations();
        initializeProjectNavigation();
        initializeErrorHandling();
        
        // EmailJS 초기화 및 Contact Form
        if (initializeEmailJS()) {
            initializeContactForm();
        }
        
        // Hero 비디오 자동 재생 (단일 영상)
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
            });
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