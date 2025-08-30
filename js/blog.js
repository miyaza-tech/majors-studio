// ===== BLOG PAGE FUNCTIONALITY =====

// Category Filter
const categoryTabs = document.querySelectorAll('.category-tab');
const blogCards = document.querySelectorAll('.blog-card');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        tab.classList.add('active');
        
        const selectedCategory = tab.getAttribute('data-category');
        
        // Filter blog posts
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

// Load More Posts
const loadMoreBtn = document.querySelector('.load-more-btn');
let postsLoaded = 6;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more posts
        const postsGrid = document.querySelector('.posts-grid');
        
        for (let i = 0; i < 3; i++) {
            const newPost = createBlogPost(postsLoaded + i + 1);
            postsGrid.appendChild(newPost);
        }
        
        postsLoaded += 3;
        
        // Hide button after loading enough posts
        if (postsLoaded >= 12) {
            loadMoreBtn.style.display = 'none';
        }
    });
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
    
    // Add animation
    setTimeout(() => {
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
    }, 100);
    
    return article;
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Here you would normally send the email to your server
        console.log('Newsletter subscription:', email);
        
        // Show success message
        alert('Thank you for subscribing to our newsletter!');
        
        // Reset form
        newsletterForm.reset();
    });
}

// Blog Card Click - Navigate to post
blogCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            window.location.href = 'blog-post.html';
        }
        // In a real application, this would navigate to the individual blog post
        console.log('Navigate to blog post');
        // window.location.href = '/blog/post-slug';
    });
});

// Featured post 클릭 이벤트
const featuredContent = document.querySelector('.featured-content');
if (featuredContent) {
    featuredContent.style.cursor = 'pointer';
    featuredContent.addEventListener('click', (e) => {
        // Read More 버튼을 클릭한 게 아니면
        if (!e.target.classList.contains('read-more-btn')) {
            window.location.href = 'blog-post.html';
        }
    });
}

// Smooth scroll for back to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== 페이지 로드 후 실행 =====
document.addEventListener('DOMContentLoaded', () => {
    // Blog Card 클릭 이벤트
    const cards = document.querySelectorAll('.blog-card');
    
    cards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 인덱스에 따라 다른 페이지로 이동
            const pageNumber = String(index + 1).padStart(2, '0');  // 01, 02, 03...
            window.location.href = `blog_post_${pageNumber}.html`;
        });
    });
    
   // Featured Post는 메인 포스트로
    const featured = document.querySelector('.featured-content');
    if (featured) {
        featured.style.cursor = 'pointer';
        featured.addEventListener('click', (e) => {
            if (!e.target.classList.contains('read-more-btn')) {
                e.preventDefault();
                window.location.href = 'blog_post.html';  // 메인 상세 페이지
            }
        });
    }
});