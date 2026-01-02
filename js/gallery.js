// ===== GALLERY - JSON 데이터 연동 버전 =====

let galleryData = [];
let filteredData = [];
let currentImageIndex = 0;

// ===== LOAD GALLERY DATA FROM JSON =====
async function loadGalleryData() {
    try {
        const response = await fetch('data/gallery_json.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        galleryData = data.items;
        filteredData = [...galleryData];
        
        console.log('✅ Gallery data loaded successfully');
        return galleryData;
    } catch (error) {
        console.error('❌ Failed to load gallery data:', error);
        galleryData = [];
        filteredData = [];
        return galleryData;
    }
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            // 먼저 모든 아이템을 fade out
            galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            
            // 잠시 후 필터링 및 fade in
            setTimeout(() => {
                let visibleIndex = 0;
                galleryItems.forEach((item) => {
                    const category = item.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, visibleIndex * 80);
                        visibleIndex++;
                    } else {
                        item.style.display = 'none';
                    }
                });
            }, 300);
            
            // Update filtered data for lightbox
            if (filter === 'all') {
                filteredData = [...galleryData];
            } else {
                filteredData = galleryData.filter(item => item.category === filter);
            }
        });
    });
}

// ===== LIGHTBOX FUNCTIONALITY =====
function openLightbox(index) {
    console.log('Opening lightbox for item:', index);
    const lightbox = document.getElementById('lightbox');
    const item = galleryData.find(p => p.id === index);
    
    console.log('Found item:', item);
    
    if (item) {
        currentImageIndex = filteredData.findIndex(p => p.id === index);
        if (currentImageIndex === -1) {
            currentImageIndex = 0;
        }
        updateLightboxContent(item);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Item not found for index:', index);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateLightboxContent(item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    
    if (!lightboxContent) {
        console.error('Lightbox content not found');
        return;
    }
    
    if (item.type === 'video') {
        const videoSrc = item.media || item.image;
        lightboxContent.innerHTML = `
            <video controls autoplay muted style="max-width: 90%; max-height: 80vh; border-radius: 8px;">
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="lightbox-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
    } else {
        const imageSrc = item.media || item.image;
        lightboxContent.innerHTML = `
            <img src="${imageSrc}" alt="${item.title}" style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
            <div class="lightbox-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
    }
}

function nextImage() {
    if (filteredData.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % filteredData.length;
    updateLightboxContent(filteredData[currentImageIndex]);
}

function prevImage() {
    if (filteredData.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + filteredData.length) % filteredData.length;
    updateLightboxContent(filteredData[currentImageIndex]);
}

// ===== MAKE FUNCTIONS GLOBAL =====
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;

// ===== LOAD MORE FUNCTIONALITY =====
let itemsLoaded = 10;
const itemsPerLoad = 4;

function loadMoregallery() {
    const container = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    for (let i = 0; i < itemsPerLoad; i++) {
        const newItem = createGalleryItem(itemsLoaded + i + 1);
        container.appendChild(newItem);
    }
    
    itemsLoaded += itemsPerLoad;
    
    if (itemsLoaded >= 20) {
        loadMoreBtn.style.display = 'none';
    }
}

function createGalleryItem(id) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-category', 'illustration');
    div.onclick = () => openLightbox(id);
    
    div.innerHTML = `
        <div class="gallery-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="gallery-overlay">
                <div class="overlay-content">
                    <h3>Artwork ${id}</h3>
                    <p>Digital Art</p>
                </div>
            </div>
        </div>
    `;
    
    galleryData.push({
        id: id,
        title: `Artwork ${id}`,
        description: 'Digital Art',
        category: 'illustration',
        type: 'image',
        image: `assets/image/gallery/${id}.png`
    });
    
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
    }, 100);
    
    return div;
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// ===== CLICK OUTSIDE TO CLOSE =====
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Gallery.js 초기화 시작');
    
    // Load gallery data
    await loadGalleryData();
    
    // Debug: Check if openLightbox is available
    console.log('🔍 openLightbox 함수 사용 가능:', typeof window.openLightbox === 'function');
    console.log('🔍 로드된 갤러리 아이템 수:', galleryData.length);
    
    // Initialize filters
    initializeFilters();
    
    // Animate gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
        }, index * 100);
    });
    
    // Video hover preview
    const videoItems = document.querySelectorAll('.gallery-video');
    videoItems.forEach(item => {
        const video = item.querySelector('.gallery-preview-video');
        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log('Preview play failed:', e));
            });
            
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }
    });
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }
    
    console.log('🎉 Gallery 로딩 완료');
});

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

console.log('Gallery.js loaded successfully');