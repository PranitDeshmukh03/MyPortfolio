// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeTheme();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        // Navbar scroll effect
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active navigation link
        updateActiveNavLink();
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
        }
    });

    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current link
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes based on element type
                if (element.classList.contains('project-card')) {
                    element.classList.add('slide-up');
                } else if (element.classList.contains('skill-item')) {
                    element.classList.add('fade-in');
                } else if (element.classList.contains('timeline-item')) {
                    element.classList.add('slide-up');
                } else if (element.classList.contains('stat')) {
                    element.classList.add('scale-in');
                    animateCounter(element);
                } else {
                    element.classList.add('fade-in');
                }
                
                // Unobserve the element after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-item, .timeline-item, .stat, .highlight, .education-item, .certification-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animation for statistics
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    if (!numberElement) return;

    const finalNumber = numberElement.textContent;
    const isPercentage = finalNumber.includes('%');
    const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
    
    let currentNumber = 0;
    const increment = numericValue / 50; // Animate over 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= numericValue) {
            currentNumber = numericValue;
            clearInterval(timer);
        }
        
        numberElement.textContent = isPercentage 
            ? Math.floor(currentNumber) + '%'
            : Math.floor(currentNumber) + '+';
    }, stepTime);
}

// Contact form functionality
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(formObject)) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual implementation)
            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

// Form validation
function validateForm(formData) {
    const { name, email, subject, message } = formData;
    
    if (!name.trim()) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    
    if (!email.trim() || !validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!subject.trim()) {
        showNotification('Please enter a subject', 'error');
        return false;
    }
    
    if (!message.trim()) {
        showNotification('Please enter your message', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'hsl(142, 76%, 36%)' : 'hsl(0, 65%, 51%)'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Style notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Theme and preferences
function initializeTheme() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
    
    // Listen for changes in motion preference
    prefersReducedMotion.addEventListener('change', function() {
        if (this.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-normal', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        } else {
            document.documentElement.style.setProperty('--transition-fast', '0.15s ease-in-out');
            document.documentElement.style.setProperty('--transition-normal', '0.3s ease-in-out');
            document.documentElement.style.setProperty('--transition-slow', '0.5s ease-in-out');
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    const scrollTop = window.pageYOffset;
    
    // Navbar scroll effect
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // Update active navigation link
    updateActiveNavLink();
}, 16); // ~60fps

// Replace the scroll event listener with the optimized version
window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Enter or Space on hamburger menu
    if ((e.key === 'Enter' || e.key === ' ') && e.target === hamburger) {
        e.preventDefault();
        hamburger.click();
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could implement error reporting here
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }, 0);
    });
}

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, properties = {}) {
    // Implement analytics tracking here
    console.log('Event tracked:', eventName, properties);
}

// Track navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('navigation_click', {
            section: this.getAttribute('href').substring(1)
        });
    });
});

// Track contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        trackEvent('contact_form_submit');
    });
}

// Track resume download (if/when implemented)
const resumeLink = document.querySelector('a[href*="resume"]');
if (resumeLink) {
    resumeLink.addEventListener('click', function() {
        trackEvent('resume_download');
    });
}

// Lazy loading for images (when implemented)
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();

// Handle browser back/forward navigation
window.addEventListener('popstate', function() {
    updateActiveNavLink();
});

// Cleanup function
function cleanup() {
    // Remove event listeners and clean up resources
    window.removeEventListener('scroll', optimizedScrollHandler);
    // Add other cleanup tasks as needed
}

// Clean up when page is about to unload
window.addEventListener('beforeunload', cleanup);

console.log('Portfolio website initialized successfully!');
