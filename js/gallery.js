// ===== gallery GALLERY FUNCTIONALITY =====

// gallery data
const galleryData = [
    {
        id: 1,
        title: "Fantasy Illustration",
        description: "Digital Painting",
        category: "illustration",
        type: "image",
        image: "assets/image/gallery/01.png"
    },
    {
        id: 2,
        title: "Sci-Fi Environment",
        description: "Concept Art",
        category: "concept",
        type: "image",
        image: "assets/image/gallery/02.png"
    },
    {
        id: 3,
        title: "Character Design",
        description: "Character Concept",
        category: "character",
        type: "image",
        image: "assets/image/gallery/03.png"
    },
    {
        id: 4,
        title: "Fantasy Landscape",
        description: "Environment Art",
        category: "environment",
        type: "image",
        image: "assets/image/gallery/04.png"
    },
    {
        id: 5,
        title: "Game Key Art",
        description: "Promotional Art",
        category: "keyart",
        type: "image",
        image: "assets/image/gallery/05.png"
    },
    {
        id: 6,
        title: "Creature Design",
        description: "Concept Development",
        category: "concept",
        type: "image",
        image: "assets/image/gallery/06.png"
    },
    {
        id: 7,
        title: "Book Illustration",
        description: "Digital Art",
        category: "illustration",
        type: "image",
        image: "assets/image/gallery/07.png"
    },
    {
        id: 8,
        title: "Hero Character",
        description: "Character Art",
        category: "character",
        type: "image",
        image: "assets/image/gallery/08.png"
    },
    {
        id: 9,
        title: "Motion Concept",
        description: "Animation Reel",
        category: "concept",
        type: "video",
        media: "assets/videos/gallery_01.mp4"
    },
    {
        id: 10,
        title: "Character Animation",
        description: "Character Motion Study",
        category: "character",
        type: "video",
        media: "assets/videos/gallery_02.mp4"
    }
];

let currentImageIndex = 0;
let filteredData = [...galleryData];

// Filter functionality
const filterTabs = document.querySelectorAll('.filter-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const filter = tab.getAttribute('data-filter');
        
        // Filter gallery items
        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                // Stagger animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Update filtered data for lightbox
        if (filter === 'all') {
            filteredData = [...galleryData];
        } else {
            filteredData = galleryData.filter(item => item.category === filter);
        }
    });
});

// ===== Lightbox functionality =====
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
        lightbox.style.display = 'block';
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
    
    // 비디오인 경우
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
        // 이미지인 경우
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

// Load more functionality
let itemsLoaded = 10; // 초기 아이템 수 (비디오 2개 추가했으므로)
const itemsPerLoad = 4;

function loadMoregallery() {
    const container = document.querySelector('.gallery-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Simulate loading more items
    for (let i = 0; i < itemsPerLoad; i++) {
        const newItem = createGalleryItem(itemsLoaded + i + 1);
        container.appendChild(newItem);
    }
    
    itemsLoaded += itemsPerLoad;
    
    // Hide button after loading certain amount
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
    
    // Add to galleryData
    galleryData.push({
        id: id,
        title: `Artwork ${id}`,
        description: 'Digital Art',
        category: 'illustration',
        type: 'image',
        image: `assets/image/gallery/${id}.png`
    });
    
    // Add fade-in animation
    setTimeout(() => {
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
    }, 100);
    
    return div;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'block') {
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

// Click outside to close lightbox
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate gallery items on load
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
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

console.log('gallery.js loaded successfully');