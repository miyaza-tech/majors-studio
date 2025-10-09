// ===== BLOG PAGE - JSON 데이터 연동 버전 =====

let blogData = {
    featured: null,
    posts: []
};

// ===== LOAD BLOG DATA FROM JSON =====
async function loadBlogData() {
    try {
        const response = await fetch('data/blog_json.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        blogData = data;
        
        console.log('✅ Blog data loaded successfully');
        return blogData;
    } catch (error) {
        console.error('❌ Failed to load blog data:', error);
        blogData = { featured: null, posts: [] };
        return blogData;
    }
}

// ===== CATEGORY FILTER =====
function initializeCategoryFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const blogCards = document.querySelectorAll('.blog-card');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const selectedCategory = tab.getAttribute('data-category');
            
            blogCards.forEach(card => {
                card.style.cursor = 'pointer'; 
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
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

// ===== LOAD MORE POSTS =====
let postsLoaded = 6;

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const postsGrid = document.querySelector('.posts-grid');
            
            for (let i = 0; i < 3; i++) {
                const newPost = createBlogPost(postsLoaded + i + 1);
                postsGrid.appendChild(newPost);
            }
            
            postsLoaded += 3;
            
            if (postsLoaded >= 12) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
}

function createBlogPost(id) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', 'tutorials');
    
    article.innerHTML = `
        <div class="blog-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <span class="post-category">Tutorials</span>
        </div>
        <div class="blog-content">
            <h3>Blog Post Title ${id}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>
            <div class="post-meta">
                <span class="post-date">Dec ${id}, 2024</span>
                <span class="read-time">5 min</span>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
    }, 100);
    
    return article;
}

// ===== NEWSLETTER FORM =====
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            console.log('Newsletter subscription:', email);
            
            alert('Thank you for subscribing to our newsletter!');
            
            newsletterForm.reset();
        });
    }
}

// ===== SCROLL TO TOP =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== RENDER BLOG POSTS FROM JSON =====
function renderBlogPosts(posts) {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;
    
    // Clear existing cards
    postsGrid.innerHTML = '';
    
    posts.forEach((post, index) => {
        const card = createBlogCardFromData(post, index);
        postsGrid.appendChild(card);
    });
}

function createBlogCardFromData(post, index) {
    const lang = localStorage.getItem('language') || 'en';
    
    // Helper function to get translated text
    const getText = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['en'] || '';
        }
        return field || '';
    };
    
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', getText(post.category).toLowerCase());
    article.style.cursor = 'pointer';
    
    article.innerHTML = `
        <div class="blog-image" style="background-image: url('${post.image}');">
            <span class="post-category">${getText(post.category)}</span>
        </div>
        <div class="blog-content">
            <h3>${getText(post.title)}</h3>
            <p>${getText(post.excerpt)}</p>
            <div class="post-meta">
                <span class="post-date">${getText(post.date)}</span>
                <span class="read-time">${getText(post.readTime)}</span>
            </div>
        </div>
    `;
    
    article.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const pageNumber = String(index + 1).padStart(2, '0');
        window.location.href = `blog_post_${pageNumber}.html`;
    });
    
    return article;
}

// Update featured post
function updateFeaturedPost() {
    if (!blogData.featured) return;
    
    const lang = localStorage.getItem('language') || 'en';
    
    const getText = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['en'] || '';
        }
        return field || '';
    };
    
    const featuredTitle = document.querySelector('.featured-content h1');
    const featuredExcerpt = document.querySelector('.featured-content p');
    const featuredCategory = document.querySelector('.featured-content .post-category');
    const featuredDate = document.querySelector('.featured-content .post-date');
    const featuredReadTime = document.querySelector('.featured-content .read-time');
    
    if (featuredTitle) featuredTitle.textContent = getText(blogData.featured.title);
    if (featuredExcerpt) featuredExcerpt.textContent = getText(blogData.featured.excerpt);
    if (featuredCategory) featuredCategory.textContent = getText(blogData.featured.category);
    if (featuredDate) featuredDate.textContent = getText(blogData.featured.date);
    if (featuredReadTime) featuredReadTime.textContent = getText(blogData.featured.readTime);
}

// Update blog content when language changes
function updateBlogContent() {
    if (blogData.posts && blogData.posts.length > 0) {
        renderBlogPosts(blogData.posts);
        updateFeaturedPost();
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Blog.js 초기화 시작');
    
    // Load blog data
    await loadBlogData();
    
    // Render posts from JSON with current language
    renderBlogPosts(blogData.posts);
    updateFeaturedPost();
    
    // Initialize features
    initializeCategoryFilter();
    initializeLoadMore();
    initializeNewsletter();
    
    // Featured Post 클릭
    const featured = document.querySelector('.featured-content');
    if (featured) {
        featured.style.cursor = 'pointer';
        featured.addEventListener('click', (e) => {
            if (!e.target.classList.contains('read-more-btn')) {
                e.preventDefault();
                window.location.href = 'blog_post.html';
            }
        });
    }
    
    console.log('🎉 Blog 로딩 완료');
});

// Listen for language changes
window.addEventListener('languageChanged', function() {
    updateBlogContent();
});