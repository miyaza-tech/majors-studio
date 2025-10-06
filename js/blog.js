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

// ===== RENDER BLOG POSTS FROM JSON (선택적) =====
function renderBlogPosts(posts) {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;
    
    // 기존 카드 유지하려면 주석처리
    // postsGrid.innerHTML = '';
    
    posts.forEach((post, index) => {
        const card = createBlogCardFromData(post, index);
        // postsGrid.appendChild(card);
    });
}

function createBlogCardFromData(post, index) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', post.category);
    article.style.cursor = 'pointer';
    
    article.innerHTML = `
        <div class="blog-image" style="background-image: url('${post.image}');">
            <span class="post-category">${post.category}</span>
        </div>
        <div class="blog-content">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
                <span class="read-time">${post.readTime}</span>
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ Blog.js 초기화 시작');
    
    // Load blog data
    await loadBlogData();
    
    // Initialize features
    initializeCategoryFilter();
    initializeLoadMore();
    initializeNewsletter();
    
    // Optional: Render posts from JSON
    // renderBlogPosts(blogData.posts);
    
    // Blog Card 클릭 이벤트
    const cards = document.querySelectorAll('.blog-card');
    
    cards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const pageNumber = String(index + 1).padStart(2, '0');
            window.location.href = `blog_post_${pageNumber}.html`;
        });
    });
    
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