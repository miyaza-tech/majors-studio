// ===== BLOG POST PAGE FUNCTIONALITY =====

let blogPostData = null;
let currentPostId = 'featured'; // Default post ID

// ===== LOAD BLOG POST DATA =====
async function loadBlogPostData() {
    try {
        const response = await fetch('data/blog_post_content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        blogPostData = await response.json();
        console.log('✅ Blog post data loaded successfully');
        return blogPostData;
    } catch (error) {
        console.error('❌ Failed to load blog post data:', error);
        return null;
    }
}

// ===== DETECT CURRENT POST ID FROM URL =====
function detectCurrentPost() {
    // URL 파라미터에서 id 가져오기 (예: blog_post.html?id=post01)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    // id 파라미터가 있으면 사용, 없으면 featured 기본값
    if (postId) {
        console.log('📌 Loading post ID from URL:', postId);
        return postId;
    }
    
    console.log('📌 No post ID in URL, using featured post');
    return 'featured';
}

// ===== UPDATE POST CONTENT =====
function updatePostContent() {
    if (!blogPostData) return;
    
    const lang = localStorage.getItem('language') || 'en';
    const postData = blogPostData.posts[currentPostId];
    
    if (!postData) return;
    
    // Helper function to get translated text
    const getText = (field) => {
        if (typeof field === 'object' && field !== null) {
            return field[lang] || field['en'] || '';
        }
        return field || '';
    };
    
    // Update breadcrumb
    const breadcrumbHome = document.querySelector('.breadcrumb a[href="index.html"]');
    const breadcrumbBlog = document.querySelector('.breadcrumb a[href="blog.html"]');
    const breadcrumbCurrent = document.querySelector('.breadcrumb span');
    
    if (breadcrumbHome) breadcrumbHome.textContent = getText(blogPostData.breadcrumb.home);
    if (breadcrumbBlog) breadcrumbBlog.textContent = getText(blogPostData.breadcrumb.blog);
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = getText(postData.breadcrumbTitle);
    
    // Update article header
    const articleCategory = document.querySelector('.article-category');
    const articleDate = document.querySelector('.article-date');
    const articleTitle = document.querySelector('.article-header h1');
    const articleSubtitle = document.querySelector('.article-subtitle');
    const authorName = document.querySelector('.author-name');
    const readTime = document.querySelector('.read-time');
    
    if (articleCategory) articleCategory.textContent = getText(postData.category);
    if (articleDate) articleDate.textContent = getText(postData.date);
    if (articleTitle) articleTitle.textContent = getText(postData.title);
    if (articleSubtitle) articleSubtitle.textContent = getText(postData.subtitle);
    if (authorName) authorName.textContent = getText(postData.author);
    if (readTime) readTime.textContent = '⏱ ' + getText(postData.readTime);
}

// Table of Contents - Active section highlighting
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    const sections = document.querySelectorAll('.article-body section');
    
    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = 100;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Share Buttons Functionality
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const pageTitle = document.querySelector('h1').textContent;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('aria-label');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'Share on Twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'Share on Facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'Share on LinkedIn':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'Copy link':
                    copyToClipboard(pageUrl);
                    showToast('Link copied to clipboard!');
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Copy to Clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        z-index: 10000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { transform: translate(-50%, 100px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, 100px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Related Posts Click Handler
function initRelatedPosts() {
    const relatedCards = document.querySelectorAll('.related-card');
    
    relatedCards.forEach(card => {
        card.addEventListener('click', () => {
            // In a real application, this would navigate to the specific post
            // For demo, we'll just reload the same page
            window.location.href = 'blog-post.html';
        });
    });
}

// Comment Form Handler
function initCommentForm() {
    const commentForm = document.querySelector('.comment-form form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(commentForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const comment = formData.get('comment');
            
            // In a real application, this would send to a server
            console.log('Comment submitted:', { name, email, comment });
            
            // Show success message
            showToast('Comment submitted for review!');
            
            // Reset form
            commentForm.reset();
        });
    }
}

// Progress Bar - 비활성화
// function initProgressBar() {
//     const progressBar = document.createElement('div');
//     progressBar.className = 'reading-progress';
//     progressBar.style.cssText = `
//         position: fixed;
//         top: 70px;
//         left: 0;
//         width: 0%;
//         height: 3px;
//         background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
//         z-index: 1000;
//         transition: width 0.2s ease;
//     `;
//     document.body.appendChild(progressBar);
//     
//     window.addEventListener('scroll', () => {
//         const windowHeight = window.innerHeight;
//         const documentHeight = document.documentElement.scrollHeight - windowHeight;
//         const scrolled = window.scrollY;
//         const progress = (scrolled / documentHeight) * 100;
//         
//         progressBar.style.width = `${progress}%`;
//     });
// }

// Back to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Detect current post
    currentPostId = detectCurrentPost();
    
    // Load blog post data
    await loadBlogPostData();
    
    // Wait a bit for language.js to initialize
    setTimeout(() => {
        updatePostContent();
    }, 100);
    
    initTableOfContents();
    initShareButtons();
    initRelatedPosts();
    initCommentForm();
    // initProgressBar(); // 프로그레스 바 비활성화
    
    // Back to top button visibility
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

// Listen for language changes
window.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.lang);
    updatePostContent();
});

console.log('Blog-post.js loaded successfully');