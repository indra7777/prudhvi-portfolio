// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Portfolio filtering
const tabButtons = document.querySelectorAll('.tab-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-tab');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contact form validation and submission
const contactForm = document.querySelector('.contact-form');
const formInputs = contactForm.querySelectorAll('input, select, textarea');

// Add real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearError);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearError(e) {
    const field = e.target;
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone') || 'Not provided';
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Create email content
        const subject = `New Project Inquiry from ${name}`;
        const body = `Hello ThinkGrid Team,

You have received a new project inquiry from your website.

Client Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Service Interested: ${service}

Project Brief:
${message}

Please respond to this inquiry as soon as possible.

Best regards,
Website Contact Form`;
        
        // Create mailto link
        const mailtoLink = `mailto:thinkgrid.agency@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message after a short delay
        setTimeout(() => {
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
});

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            <h3>Email Client Opened!</h3>
            <p>Your email client has opened with your message pre-filled. Please send the email to complete your inquiry.</p>
        </div>
    `;
    
    // Add to contact section
    const contactSection = document.querySelector('.contact');
    contactSection.appendChild(successDiv);
    
    // Remove after 6 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 6000);
}

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    // Add background when scrolled
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-item, .testimonial, .stat').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent && heroVisual) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Hero title loads immediately without animation

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const target = parseInt(statNumber.textContent);
            animateCounter(statNumber, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Testimonials carousel (auto-rotate)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');

function rotateTestimonials() {
    if (testimonials.length > 1) {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }
}

// Initialize first testimonial as active
if (testimonials.length > 0) {
    testimonials[0].classList.add('active');
    // Auto-rotate every 5 seconds
    setInterval(rotateTestimonials, 5000);
}

// Add CSS for form validation errors and success message
const additionalStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: block;
    }
    
    .success-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        text-align: center;
        animation: fadeInUp 0.5s ease;
    }
    
    .success-content svg {
        width: 48px;
        height: 48px;
        color: #10b981;
        margin-bottom: 1rem;
    }
    
    .success-content h3 {
        color: #065f46;
        margin-bottom: 0.5rem;
    }
    
    .success-content p {
        color: #6b7280;
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .testimonial {
        opacity: 0.7;
        transform: scale(0.95);
        transition: all 0.3s ease;
    }
    
    .testimonial.active {
        opacity: 1;
        transform: scale(1);
    }
    
    body:not(.loaded) * {
        animation-play-state: paused !important;
    }
    
    .animate {
        animation: fadeInUp 0.8s ease forwards;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Portfolio horizontal scrolling
const portfolioGrid = document.querySelector('.portfolio-grid');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

if (portfolioGrid && scrollLeftBtn && scrollRightBtn) {
    const scrollAmount = 400;

    function updateScrollButtons() {
        const isAtStart = portfolioGrid.scrollLeft <= 0;
        const isAtEnd = portfolioGrid.scrollLeft >= portfolioGrid.scrollWidth - portfolioGrid.clientWidth;
        
        scrollLeftBtn.disabled = isAtStart;
        scrollRightBtn.disabled = isAtEnd;
    }

    scrollLeftBtn.addEventListener('click', () => {
        portfolioGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    scrollRightBtn.addEventListener('click', () => {
        portfolioGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    portfolioGrid.addEventListener('scroll', updateScrollButtons);
    
    // Initial update
    updateScrollButtons();
    
    // Update on window resize
    window.addEventListener('resize', updateScrollButtons);
}

// Auto-scroll when portfolio section is in view
let autoScrollInterval;
let isAutoScrolling = false;
const portfolioSection = document.getElementById('portfolio');

if (portfolioSection && portfolioGrid) {
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isAutoScrolling) {
                startAutoScroll();
            } else if (!entry.isIntersecting && isAutoScrolling) {
                stopAutoScroll();
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    portfolioObserver.observe(portfolioSection);

    function startAutoScroll() {
        isAutoScrolling = true;
        let scrollDirection = 1; // 1 for right, -1 for left
        
        autoScrollInterval = setInterval(() => {
            const maxScroll = portfolioGrid.scrollWidth - portfolioGrid.clientWidth;
            const currentScroll = portfolioGrid.scrollLeft;
            
            // Change direction when reaching ends
            if (currentScroll >= maxScroll && scrollDirection === 1) {
                scrollDirection = -1;
            } else if (currentScroll <= 0 && scrollDirection === -1) {
                scrollDirection = 1;
            }
            
            portfolioGrid.scrollBy({
                left: scrollDirection * 1,
                behavior: 'auto'
            });
        }, 30); // Slow motion: scroll 1px every 30ms
    }

    function stopAutoScroll() {
        isAutoScrolling = false;
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    // Stop auto-scroll when user interacts with the portfolio
    portfolioGrid.addEventListener('mouseenter', stopAutoScroll);
    portfolioGrid.addEventListener('touchstart', stopAutoScroll);
    scrollLeftBtn?.addEventListener('click', stopAutoScroll);
    scrollRightBtn?.addEventListener('click', stopAutoScroll);

    // Resume auto-scroll after user stops interacting (with delay)
    let resumeTimeout;
    portfolioGrid.addEventListener('mouseleave', () => {
        resumeTimeout = setTimeout(() => {
            const rect = portfolioSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible && !isAutoScrolling) {
                startAutoScroll();
            }
        }, 3000); // Resume after 3 seconds
    });

    // Clear resume timeout if user interacts again
    portfolioGrid.addEventListener('mouseenter', () => {
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
        }
    });
}

// Hero video audio activation on user interaction (ONLY for heroVideoMain)
let heroAudioActivated = false;

function enableHeroAudio() {
    const heroVideo = document.getElementById('heroVideoMain');
    
    if (!heroAudioActivated && heroVideo) {
        heroAudioActivated = true;
        
        // Change mute to unmute ONLY for the hero video
        const currentSrc = heroVideo.src;
        const newSrc = currentSrc.replace('&mute=1', '&mute=0');
        heroVideo.src = newSrc;
        
        // Show notification
        const notification = document.createElement('div');
        notification.innerHTML = '🔊 Hero video audio enabled';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #6366f1;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
        
        // Remove listeners after activation
        document.removeEventListener('click', enableHeroAudio);
        document.removeEventListener('scroll', enableHeroAudio);
    }
}

// Add listeners for hero video audio activation
const heroVideoElement = document.getElementById('heroVideoMain');
if (heroVideoElement) {
    document.addEventListener('click', enableHeroAudio);
    document.addEventListener('scroll', enableHeroAudio);
}

// Add CSS for notification animations
const notificationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;

const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);