/**
 * Lukas Lutengano Portfolio - JavaScript
 * Smooth scrolling and interactive features
 */

// ============================================
// LOADING ANIMATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading animation
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hidden');
    }
    
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});

// ============================================
// SMOOTH SCROLLING
// ============================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Smooth scroll for internal links (fallback)
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ============================================
// NAVIGATION
// ============================================

// Navbar scroll effect
let navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    // Add/remove scrolled class
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide navbar on scroll down, show on scroll up
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.top = '-100px';
    } else {
        // Scrolling up
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Mobile menu toggle
let mobileMenu = document.querySelector('.mobile-menu');
let navLinks = document.querySelector('.nav-links');

if (mobileMenu && navbar) {
    mobileMenu.addEventListener('click', function() {
        navbar.classList.toggle('active');
        mobileMenu.innerHTML = navbar.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optional: unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.section-header, .stat-card, .skill-category, .timeline-item, .project-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// ============================================
// FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create mailto link with form data
        const mailtoLink = `mailto:lutengano20@gmail.com?` +
            `subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(`
Name: ${name}
Email: ${email}

${message}

---
Sent from Lukas Lutengano Portfolio
            `)}`;
        
        // Open mail client
        window.location.href = mailtoLink;
        
        // Reset form
        contactForm.reset();
        
        // Show success message
        showNotification('Message sent! Opening your mail client...', 'success');
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : 'linear-gradient(135deg, #666, #444)'};
        color: #000;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// PARALLAX EFFECT (Optional - for hero section)
// ============================================

const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

if (hero && heroContent) {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });
}

// ============================================
// TYPEWRITER EFFECT (Optional - for hero title)
// ============================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// TYPING ANIMATION FOR MISSION STATEMENT
// ============================================

function animateMissionStatement() {
    const missionElement = document.querySelector('.mission-statement p');
    if (!missionElement) return;
    
    const originalText = missionElement.textContent;
    missionElement.textContent = '';
    
    let charIndex = 0;
    const missionQuoteOpen = document.createElement('span');
    missionQuoteOpen.className = 'mission-quote';
    missionQuoteOpen.textContent = '"';
    
    const missionQuoteClose = document.createElement('span');
    missionQuoteClose.className = 'mission-quote';
    missionQuoteClose.textContent = '"';
    
    missionElement.appendChild(missionQuoteOpen);
    
    function typeChar() {
        if (charIndex < originalText.length - 1) { // -1 to exclude the closing quote
            const char = originalText.charAt(charIndex);
            const span = document.createElement('span');
            span.textContent = char;
            missionElement.appendChild(span);
            charIndex++;
            setTimeout(typeChar, 50);
        } else {
            missionElement.appendChild(missionQuoteClose);
        }
    }
    
    setTimeout(typeChar, 1000);
}

// Initialize on page load
window.addEventListener('load', function() {
    // Initialize any animations
    // animateMissionStatement(); // Uncomment to enable typing animation
});

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.classList.contains('stat-number') && !isNaN(target) ? '' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.classList.contains('stat-number') && !isNaN(target) ? '' : '');
        }
    }, 16);
}

// Initialize counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent) || 0;
                if (target > 0) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// ============================================
// ADD CSS ANIMATIONS FOR NOTIFICATIONS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c Lukas Lutengano Portfolio ', 'background: #00d4ff; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Aerospace | Robotics | Intelligent Engineering ', 'color: #00d4ff; font-size: 14px;');
console.log('%c Contact: lutengano20@gmail.com ', 'color: #666; font-size: 12px;');
