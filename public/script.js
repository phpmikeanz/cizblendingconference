const body = document.body;
const ADMIN_AUTH_KEY = 'adminAuthenticated';
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;
const supabaseClient = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY)
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Enhanced Mobile Navigation Toggle
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) {
        console.log('Mobile navigation elements not found');
        return;
    }

    // Mobile menu toggle with body scroll lock
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }));

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Touch-friendly navigation improvements
function initTouchNavigation() {
    if ('ontouchstart' in window) {
        // Add touch feedback to navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length > 0) {
            navLinks.forEach(link => {
                link.addEventListener('touchstart', function() {
                    this.style.backgroundColor = 'rgba(44, 90, 160, 0.1)';
                });
                
                link.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                    }, 150);
                });
            });
        }
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    if (anchors.length > 0) {
        anchors.forEach(anchor => {
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
    }
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) {
        console.log('Navigation links or sections not found');
        return;
    }
    
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 100; // Offset for better detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Throttled scroll event for better performance
    const throttledUpdate = throttle(updateActiveNav, 100);
    window.addEventListener('scroll', throttledUpdate);
    
    // Initial call to set active state
    updateActiveNav();
    
    console.log('Active navigation initialized');
}

// Navbar background change on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    // Throttled scroll event for better performance
    const throttledUpdate = throttle(updateScrollProgress, 10);
    window.addEventListener('scroll', throttledUpdate);
    
    console.log('Scroll progress bar initialized');
}

// Embedded Google Maps - No initialization needed

// Registration Form Handling
function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    if (!registrationForm) {
        console.log('Registration form not found');
        return;
    }

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registrationForm);
        const registrationData = {};
        
        for (let [key, value] of formData.entries()) {
            registrationData[key] = value;
        }
        
        // Validate required fields
        const requiredFields = ['fullName', 'email', 'phone', 'registrationType'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!registrationData[field]) {
                isValid = false;
                const input = document.getElementById(field);
                if (input) {
                    input.style.borderColor = '#dc3545';
                    input.addEventListener('input', function() {
                        this.style.borderColor = '#e0e0e0';
                    });
                }
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Registration submitted successfully! We will contact you soon.', 'success');
        
        // Reset form
        registrationForm.reset();
        
        // In a real application, you would send the data to a server
        console.log('Registration Data:', registrationData);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature, .timeline-item, .price-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Pricing calculator
function updatePricing() {
    const registrationType = document.getElementById('registrationType');
    const priceDisplay = document.querySelector('.price-display');
    
    if (registrationType && priceDisplay) {
        const prices = {
            'early-bird': '₱500',
            'regular': '₱750',
            'student-senior': '₱400'
        };
        
        registrationType.addEventListener('change', function() {
            const selectedPrice = prices[this.value] || '';
            priceDisplay.textContent = selectedPrice;
        });
    }
}

// Initialize pricing calculator
document.addEventListener('DOMContentLoaded', updatePricing);

// Form validation enhancements
function enhanceFormValidation() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
                showNotification('Please enter a valid email address.', 'error');
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (this.value && !phoneRegex.test(this.value)) {
                this.style.borderColor = '#dc3545';
                showNotification('Please enter a valid phone number.', 'error');
            } else {
                this.style.borderColor = '#28a745';
            }
        });
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', enhanceFormValidation);

// Transportation selection handler
document.addEventListener('DOMContentLoaded', function() {
    const transportationSelect = document.getElementById('transportation');
    const vehicleDetails = document.getElementById('vehicleDetails');
    
    if (transportationSelect && vehicleDetails) {
        transportationSelect.addEventListener('change', function() {
            if (this.value === 'own-vehicle') {
                vehicleDetails.style.display = 'block';
                document.getElementById('vehicleInfo').required = true;
            } else {
                vehicleDetails.style.display = 'none';
                document.getElementById('vehicleInfo').required = false;
            }
        });
    }
});

// Enhanced form validation for new fields
function enhanceRegistrationForm() {
    const form = document.getElementById('registrationForm');
    const requiredFields = [
        'localityProvince', 'numberOfRegistrants', 'englishOutlines', 
        'cebuanoOutlines', 'joiningFor', 'packedLunches', 'transportation',
        'modeOfPayment', 'paymentProof', 'arrivalDateTime', 'departureDateTime',
        'coordinatorName', 'coordinatorContact', 'participantsList'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#dc3545';
                    showNotification(`${this.previousElementSibling.textContent.replace('*', '').trim()} is required.`, 'error');
                } else {
                    this.style.borderColor = '#28a745';
                }
            });
        }
    });
    
    // File upload validation
    const paymentProof = document.getElementById('paymentProof');
    if (paymentProof) {
        paymentProof.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
                if (validTypes.includes(file.type)) {
                    this.style.borderColor = '#28a745';
                    showNotification('Payment proof uploaded successfully.', 'success');
                } else {
                    this.style.borderColor = '#dc3545';
                    showNotification('Please upload a valid image (JPG, PNG) or PDF file.', 'error');
                }
            }
        });
    }
}

// Initialize enhanced form validation
document.addEventListener('DOMContentLoaded', enhanceRegistrationForm);

// Loading animation for map
function showMapLoading() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa;">
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #2c5aa0; margin-bottom: 1rem;"></i>
                    <p style="color: #666; margin: 0;">Loading map...</p>
                </div>
            </div>
        `;
    }
}

// Show loading when page loads
document.addEventListener('DOMContentLoaded', showMapLoading);

// Smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-header, .about-text, .timeline-content, .location-info');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('revealed');
        }
    });
}

// Add reveal styles
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .section-header, .about-text, .timeline-content, .location-info {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-header.revealed, .about-text.revealed, .timeline-content.revealed, .location-info.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Initialize scroll reveal
window.addEventListener('scroll', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

// Mobile-specific enhancements
function initMobileEnhancements() {
    // Add mobile-specific classes for better styling
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate hero height on orientation change
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.height = '100vh';
            }
        }, 100);
    });
    
    // Improve form interactions on mobile
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        // Prevent zoom on input focus (iOS Safari)
        if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'number') {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px';
                }
            });
        }
        
        // Add touch feedback
        input.addEventListener('touchstart', function() {
            this.style.backgroundColor = 'rgba(44, 90, 160, 0.05)';
        });
        
        input.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 150);
        });
    });
    
    // Improve button touch interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    // Add swipe gestures for mobile navigation (optional)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to open menu (only if menu is closed)
        if (swipeDistance > swipeThreshold && !navMenu.classList.contains('active')) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            body.style.overflow = 'hidden';
        }
        // Swipe left to close menu (only if menu is open)
        else if (swipeDistance < -swipeThreshold && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    }
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', initMobileEnhancements);

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    // Remove mobile class if screen is large
    if (window.innerWidth > 768) {
        document.body.classList.remove('mobile-device');
        // Close mobile menu if open
        if (navMenu && hamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    } else {
        document.body.classList.add('mobile-device');
    }
});

// Mobile-optimized scroll behavior
let ticking = false;
function updateScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Embedded map is automatically responsive

// Payment Modal Functions
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('paymentModal');
    if (modal && event.target === modal) {
        closePaymentModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePaymentModal();
    }
});

// Mobile-specific modal enhancements
function initMobileModalEnhancements() {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;
    
    // Prevent modal from closing when scrolling on mobile
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
        
        modalBody.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle mobile orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (modal.classList.contains('active')) {
                // Recalculate modal height after orientation change
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.height = 'auto';
                    modalContent.style.maxHeight = '90vh';
                }
            }
        }, 100);
    });
    
    // Improve touch scrolling on mobile
    if (modalBody) {
        modalBody.style.webkitOverflowScrolling = 'touch';
        modalBody.style.overflowScrolling = 'touch';
    }
    
    // Handle mobile keyboard appearance
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        const originalContent = viewport.getAttribute('content');
        
        // Prevent zoom when modal is open
        modal.addEventListener('DOMNodeInserted', function() {
            if (modal.classList.contains('active')) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        // Restore original viewport when modal closes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!modal.classList.contains('active')) {
                        viewport.setAttribute('content', originalContent);
                    }
                }
            });
        });
        
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
}

// Initialize mobile modal enhancements
document.addEventListener('DOMContentLoaded', initMobileModalEnhancements);

// Back to Top Button Functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide back to top button based on scroll position
let lastScrollTop = 0;
let isScrollingDown = false;

function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    const currentScrollTop = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        isScrollingDown = true;
    } else {
        // Scrolling up
        isScrollingDown = false;
    }
    
    // Show button when scrolled down more than 300px
    if (currentScrollTop > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
    
    lastScrollTop = currentScrollTop;
}

// Throttle function for better performance
function throttle(func, wait) {
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

// --- Admin Panel Data & Rendering (Supabase) ---
let adminRegistrants = [];
let adminFilteredCache = [];
let adminActionsBound = false;
let adminCurrentPage = 1;
let adminPageSize = 25;

async function fetchAdminRegistrants() {
    const isAdminPage = !!document.getElementById('adminTableBody');
    
    if (!supabaseClient) {
        if (isAdminPage) {
            showNotification('Supabase client not configured.', 'error');
        }
        return [];
    }

    const tbody = document.getElementById('adminTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="22" class="empty-row">Loading registrants from Supabase...</td>
            </tr>
        `;
    }

    // Supabase has a default limit of 1000 rows, so we need to fetch all rows using pagination
    let allData = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error, count } = await supabaseClient
            .from('registrants')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, from + pageSize - 1);

        if (error) {
            console.error('Supabase fetch error:', error);
            const isAdminPage = !!document.getElementById('adminTableBody');
            if (isAdminPage) {
                showNotification('Failed to load registrants from Supabase.', 'error');
            }
            // Return what we have so far if there's an error
            break;
        }

        if (data && data.length > 0) {
            allData = allData.concat(data);
            from += pageSize;
            hasMore = data.length === pageSize; // If we got a full page, there might be more
        } else {
            hasMore = false;
        }
    }

    console.log(`Fetched ${allData.length} total registrants from database`);

    // Debug: Log first row to check column mapping
    if (allData.length > 0) {
        console.log('Sample row from Supabase:', {
            id: allData[0].id,
            province: allData[0].province,
            city: allData[0].city,
            name: allData[0].name,
            age: allData[0].age,
            allKeys: Object.keys(allData[0])
        });
    }

    return allData.map(row => ({
        id: row.id, // Include ID for updates
        province: row.province ? String(row.province).trim() : null,
        city: row.city ? String(row.city).trim() : null,
        name: row.name ? String(row.name).trim() : null,
        age: row.age,
        brethren: row.brethren ? String(row.brethren).trim() : null,
        outline: row.outline ? String(row.outline).trim() : null,
        accommodation: row.accommodation ? String(row.accommodation).trim() : null,
        registration: row.registration ? String(row.registration).trim() : null,
        food: row.food ? String(row.food).trim() : null,
        status: row.status ? String(row.status).trim() : null,
        transportation: row.transportation ? String(row.transportation).trim() : null,
        arrivalDate: row.arrival_date,
        arrivalTime: row.arrival_time ? String(row.arrival_time).trim() : null,
        arrivalTranspo: row.arrival_transpo ? String(row.arrival_transpo).trim() : null,
        departureDate: row.departure_date,
        departureTime: row.departure_time ? String(row.departure_time).trim() : null,
        departureTranspo: row.departure_transpo ? String(row.departure_transpo).trim() : null,
        paymentMode: row.payment_mode ? String(row.payment_mode).trim() : null,
        amount: row.amount,
        remarks: row.remarks ? String(row.remarks).trim() : null
    }));
}

function normalizeHeader(key) {
    return (key || '').toString().trim().toLowerCase();
}

function normalizeString(value) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    return str.length ? str : null;
}

function parseAmount(value) {
    const numeric = parseFloat(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function excelNumberToDate(value) {
    const epoch = Date.UTC(1899, 11, 30); // Excel epoch
    const ms = value * 24 * 60 * 60 * 1000;
    return new Date(epoch + ms);
}

function toIsoDate(value) {
    if (!value && value !== 0) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'number') {
        const d = excelNumberToDate(value);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    const asString = normalizeString(value);
    if (!asString) return null;
    // Expect YYYY-MM-DD
    const parsed = new Date(asString);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function toTime(value) {
    if (!value && value !== 0) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(11, 16);
    }
    if (typeof value === 'number') {
        // Excel time is fraction of a day
        const totalSeconds = Math.round(value * 24 * 60 * 60);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const asString = normalizeString(value);
    if (!asString) return null;
    // Accept HH:MM or HH:MM:SS (24h)
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(asString)) {
        const [h, m] = asString.split(':');
        const hour = parseInt(h, 10);
        const minute = parseInt(m, 10);
        if (Number.isNaN(hour) || Number.isNaN(minute) || hour > 23 || minute > 59) {
            return null;
        }
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    // Accept 12h with AM/PM, e.g., "1:00:00 PM" or "1:00 PM"
    const ampmMatch = asString.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (ampmMatch) {
        let hour = parseInt(ampmMatch[1], 10);
        const minute = ampmMatch[2];
        const period = ampmMatch[3].toUpperCase();
        if (Number.isNaN(hour) || Number.isNaN(parseInt(minute, 10)) || parseInt(minute, 10) > 59 || hour > 12 || hour < 1) {
            return null;
        }
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        return `${String(hour).padStart(2, '0')}:${minute}`;
    }
    return null;
}

function toTimeString(value) {
    const converted = toTime(value);
    if (converted) return converted;
    const asString = normalizeString(value);
    return asString || null; // allow free-form text if conversion fails
}

function toTimeText12Hour(value) {
    // Convert Excel time serial number or Date to 12-hour format text like "1:00:00 PM"
    if (typeof value === 'number' && value >= 0 && value < 1) {
        // Excel time serial number (fraction of day)
        const totalSeconds = Math.round(value * 24 * 60 * 60);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        let hour12 = hours;
        const period = hour12 >= 12 ? 'PM' : 'AM';
        if (hour12 === 0) hour12 = 12;
        else if (hour12 > 12) hour12 -= 12;
        
        return `${hour12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const hours = value.getHours();
        const minutes = value.getMinutes();
        const seconds = value.getSeconds();
        
        let hour12 = hours;
        const period = hour12 >= 12 ? 'PM' : 'AM';
        if (hour12 === 0) hour12 = 12;
        else if (hour12 > 12) hour12 -= 12;
        
        return `${hour12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    }
    // If already text or can't convert, return as-is
    const asString = normalizeString(value);
    return asString || null;
}

// Lightweight loader overlay for long operations (e.g., Excel import)
let importLoaderEl = null;
let importLoaderStyleInjected = false;

function ensureImportLoaderStyle() {
    if (importLoaderStyleInjected) return;
    const style = document.createElement('style');
    style.textContent = `
        .import-loader-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            backdrop-filter: blur(2px);
        }
        .import-loader-box {
            background: white;
            border-radius: 12px;
            padding: 18px 20px 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 260px;
            color: #0f172a;
            font-family: Inter, Arial, sans-serif;
        }
        .import-loader-spinner {
            width: 28px;
            height: 28px;
            border: 3px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: import-spin 0.9s linear infinite;
        }
        .import-loader-text {
            font-size: 14px;
            line-height: 1.4;
            font-weight: 700;
            text-align: center;
        }
        .import-loader-subtext {
            font-size: 12px;
            line-height: 1.4;
            color: #475569;
            text-align: center;
        }
        .import-loader-bar {
            position: relative;
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 999px;
            overflow: hidden;
        }
        .import-loader-bar::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, #2563eb, transparent);
            animation: import-shimmer 1.2s ease-in-out infinite;
        }
        @keyframes import-spin {
            to { transform: rotate(360deg); }
        }
        @keyframes import-shimmer {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
        }
    `;
    document.head.appendChild(style);
    importLoaderStyleInjected = true;
}

function showImportLoader(message = 'Importing Excel, please wait...', progress = null) {
    ensureImportLoaderStyle();
    if (!importLoaderEl) {
        importLoaderEl = document.createElement('div');
        importLoaderEl.className = 'import-loader-overlay';
        importLoaderEl.innerHTML = `
            <div class="import-loader-box">
                <div class="import-loader-spinner" aria-hidden="true"></div>
                <div class="import-loader-text"></div>
                <div class="import-loader-subtext">This may take a few seconds.</div>
                <div class="import-loader-progress-container" style="width: 100%; margin-top: 8px;">
                    <div class="import-loader-progress-bar" style="width: 0%; height: 4px; background: #2563eb; border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
                <div class="import-loader-bar" aria-hidden="true"></div>
            </div>
        `;
        document.body.appendChild(importLoaderEl);
    }
    const textEl = importLoaderEl.querySelector('.import-loader-text');
    const progressBar = importLoaderEl.querySelector('.import-loader-progress-bar');
    if (textEl) textEl.textContent = message;
    if (progressBar && progress !== null) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    importLoaderEl.style.display = 'flex';
}

function hideImportLoader() {
    if (importLoaderEl) {
        importLoaderEl.style.display = 'none';
    }
}

function printAdminView(rows, options = {}) {
    let data = rows && rows.length ? rows : [];
    
    // Apply province filter if specified
    if (options.province && options.province !== 'all') {
        data = data.filter(r => (r.province || '').toString().trim() === options.province);
    }
    
    // Apply city filter if specified
    if (options.city && options.city !== 'all') {
        data = data.filter(r => (r.city || '').toString().trim() === options.city);
    }
    
    if (!data.length) {
        showNotification('No rows to print for the selected filters.', 'info');
        return;
    }

    const styles = `
        <style>
            @media print {
                @page { margin: 1cm; size: A4 landscape; }
                .page-break { page-break-after: always; }
            }
            body { font-family: Inter, Arial, sans-serif; margin: 24px; color: #1f2937; }
            h2 { margin: 0 0 12px 0; font-size: 20px; }
            h3 { margin: 16px 0 8px 0; font-size: 16px; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
            .meta { margin: 0 0 16px 0; font-size: 12px; color: #6b7280; }
            .summary { margin: 12px 0; padding: 12px; background: #f8fafc; border-radius: 6px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px; vertical-align: top; }
            th { background: #f8fafc; font-weight: 600; }
            tr:nth-child(even) { background: #f9fafb; }
            .number { text-align: right; }
            .group-header { background: #e0e7ff !important; font-weight: 600; }
        </style>
    `;

    const headers = [
        'Province', 'Locality', 'Name', 'Age', 'Bro/Sis', 'Outline', 'Accommodation',
        'Registration', 'Food', 'Status', 'Mode of Transportation', 'Arrival Date',
        'Arrival Time', 'Arrival Transpo', 'Departure Date', 'Departure Time', 'Departure Transpo',
        'Mode of Payment', 'Amount', 'Remarks'
    ];

    const headerHtml = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    
    let rowsHtml = '';
    let summaryText = `Total: ${data.length} registrant(s)`;
    
    if (options.province && options.province !== 'all') {
        summaryText += ` | Province: ${options.province}`;
    }
    if (options.city && options.city !== 'all') {
        summaryText += ` | City: ${options.city}`;
    }

    // Group by province and/or city if requested
    if (options.groupByProvince || options.groupByCity) {
        const grouped = {};
        
        data.forEach(row => {
            let groupKey = '';
            if (options.groupByProvince && options.groupByCity) {
                groupKey = `${safeText(row.province)} - ${safeText(row.city)}`;
            } else if (options.groupByProvince) {
                groupKey = safeText(row.province);
            } else if (options.groupByCity) {
                groupKey = safeText(row.city);
            }
            
            if (!grouped[groupKey]) {
                grouped[groupKey] = [];
            }
            grouped[groupKey].push(row);
        });

        // Sort groups
        const sortedGroups = Object.keys(grouped).sort();
        
        sortedGroups.forEach((groupKey, groupIndex) => {
            const groupRows = grouped[groupKey];
            const groupCount = groupRows.length;
            
            // Add group header
            rowsHtml += `
                <tr class="group-header">
                    <td colspan="20" style="font-weight: 600; padding: 10px;">
                        ${groupKey} (${groupCount} registrant${groupCount !== 1 ? 's' : ''})
                    </td>
                </tr>
            `;
            
            // Add rows for this group
            rowsHtml += groupRows.map(r => `
                <tr>
                    <td>${safeText(r.province)}</td>
                    <td>${safeText(r.city)}</td>
                    <td>${safeText(r.name)}</td>
                    <td>${safeText(r.age)}</td>
                    <td>${safeText(r.brethren)}</td>
                    <td>${safeText(r.outline)}</td>
                    <td>${safeText(r.accommodation)}</td>
                    <td>${safeText(r.registration)}</td>
                    <td>${safeText(r.food)}</td>
                    <td>${safeText(r.status)}</td>
                    <td>${safeText(r.transportation)}</td>
                    <td>${safeText(r.arrivalDate)}</td>
                    <td>${safeText(r.arrivalTime)}</td>
                    <td>${safeText(r.arrivalTranspo)}</td>
                    <td>${safeText(r.departureDate)}</td>
                    <td>${safeText(r.departureTime)}</td>
                    <td>${safeText(r.departureTranspo)}</td>
                    <td>${safeText(r.paymentMode)}</td>
                    <td class="number">${formatAdminAmount(r.amount)}</td>
                    <td>${safeText(r.remarks)}</td>
                </tr>
            `).join('');
        });
    } else {
        // No grouping - just print all rows
        rowsHtml = data.map(r => `
            <tr>
                <td>${safeText(r.province)}</td>
                <td>${safeText(r.city)}</td>
                <td>${safeText(r.name)}</td>
                <td>${safeText(r.age)}</td>
                <td>${safeText(r.brethren)}</td>
                <td>${safeText(r.outline)}</td>
                <td>${safeText(r.accommodation)}</td>
                <td>${safeText(r.registration)}</td>
                <td>${safeText(r.food)}</td>
                <td>${safeText(r.status)}</td>
                <td>${safeText(r.transportation)}</td>
                <td>${safeText(r.arrivalDate)}</td>
                <td>${safeText(r.arrivalTime)}</td>
                <td>${safeText(r.arrivalTranspo)}</td>
                <td>${safeText(r.departureDate)}</td>
                <td>${safeText(r.departureTime)}</td>
                <td>${safeText(r.departureTranspo)}</td>
                <td>${safeText(r.paymentMode)}</td>
                <td class="number">${formatAdminAmount(r.amount)}</td>
                <td>${safeText(r.remarks)}</td>
            </tr>
        `).join('');
    }

    const html = `
        <html>
            <head>${styles}</head>
            <body>
                <h2>Registrants Report</h2>
                <div class="summary">${summaryText}</div>
                <p class="meta">Printed ${new Date().toLocaleString()}</p>
                <table>
                    <thead>${headerHtml}</thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showNotification('Pop-up blocked. Allow pop-ups to print.', 'error');
        return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function downloadAdminTemplate() {
    if (!window.XLSX) {
        showNotification('Excel parser not loaded.', 'error');
        return;
    }

    const headers = [
        'Province', 'Locality', 'Name', 'Age', 'Bro/Sis', 'Outline', 'Accommodation',
        'Registration', 'Food', 'Status', 'Mode of Transportation', 'Arrival Date',
        'Arrival Time', 'Arrival Transpo', 'Departure Date', 'Departure Time', 'Departure Transpo',
        'Mode of Payment', 'Amount', 'Remarks'
    ];

    const sample = {
        Province: 'Zamboanga del Sur',
        Locality: 'Zamboanga City',
        Name: 'Juan Dela Cruz',
        Age: 28,
        'Bro/Sis': 'Brother',
        Outline: 'English',
        Accommodation: 'Hotel',
        Registration: 'regular',
        Food: 'Yes',
        Status: 'Pending',
        'Mode of Transportation': 'Bus',
        'Arrival Date': '2025-02-20',
        'Arrival Time': '1:00 AM',          // free-form time text allowed
        'Arrival Transpo': 'Van',
        'Departure Date': '2025-02-23',
        'Departure Time': 'no exact time',  // free-form text allowed
        'Departure Transpo': 'Bus',
        'Mode of Payment': 'GCash',
        Amount: 750,
        Remarks: 'N/A'
    };

    const worksheet = XLSX.utils.json_to_sheet([sample], { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registrants-template.xlsx';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showNotification('Template downloaded. Fill and import to upload data.', 'success');
}

function mapExcelRow(row) {
    const headerMap = {
        'province': 'province',
        'city': 'city',
        'locality': 'city',
        'locality/city': 'city',
        'name': 'name',
        'full name': 'name',
        'fullname': 'name',
        'age': 'age',
        'bro/sis': 'brethren',
        'bro sis': 'brethren',
        'brother/sister': 'brethren',
        'brethren': 'brethren',
        'outline': 'outline',
        'accommodation': 'accommodation',
        'registration': 'registration',
        'food': 'food',
        'status': 'status',
        'mode of transportation': 'transportation',
        'transportation': 'transportation',
        'mode of transport': 'transportation',
        'transport': 'transportation',
        'arrival date': 'arrival_date',
        'arrivaldate': 'arrival_date',
        'arrival time': 'arrival_time',
        'arrivaltime': 'arrival_time',
        'arrival transpo': 'arrival_transpo',
        'arrivaltranspo': 'arrival_transpo',
        'arrival transportation': 'arrival_transpo',
        'departure date': 'departure_date',
        'departuredate': 'departure_date',
        'departure time': 'departure_time',
        'departuretime': 'departure_time',
        'departure transpo': 'departure_transpo',
        'departuretranspo': 'departure_transpo',
        'departure transportation': 'departure_transpo',
        'mode of payment': 'payment_mode',
        'payment mode': 'payment_mode',
        'paymentmode': 'payment_mode',
        'payment': 'payment_mode',
        'amount': 'amount',
        'remarks': 'remarks',
        'remark': 'remarks',
        'notes': 'remarks'
    };

    const mapped = {};
    const unmappedKeys = [];
    
    Object.entries(row || {}).forEach(([key, value]) => {
        const normalizedKey = headerMap[normalizeHeader(key)];
        if (normalizedKey) {
            mapped[normalizedKey] = value;
        } else {
            // Track unmapped keys for debugging
            const normalized = normalizeHeader(key);
            if (normalized && value !== '' && value !== null && value !== undefined) {
                unmappedKeys.push({ original: key, normalized });
            }
        }
    });
    
    // Log unmapped keys on first row only (to avoid spam)
    if (unmappedKeys.length > 0 && !mapExcelRow._loggedUnmapped) {
        console.warn('Unmapped Excel columns found:', unmappedKeys);
        mapExcelRow._loggedUnmapped = true;
    }
    
    return mapped;
}

async function handleAdminImportFile(file) {
    if (!isAdminAuthenticated()) {
        showNotification('Login first to import data.', 'error');
        return;
    }

    if (!supabaseClient) {
        showNotification('Supabase client not configured.', 'error');
        return;
    }

    if (!window.XLSX) {
        showNotification('Excel parser not loaded.', 'error');
        return;
    }

    showImportLoader();
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        if (!sessionData?.session) {
            showNotification('Your session expired. Please log in again.', 'error');
            return;
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        console.log(`Excel import: Found ${rows.length} rows in sheet "${sheetName}"`);
        if (rows.length > 0) {
            console.log('Sample Excel headers:', Object.keys(rows[0]));
            console.log('First row sample:', rows[0]);
        }

        // Map Excel headers to database fields
        const mappedRows = rows.map(mapExcelRow);
        console.log(`After mapping: ${mappedRows.length} rows`);
        if (mappedRows.length > 0) {
            console.log('Sample mapped row keys:', Object.keys(mappedRows[0]));
            console.log('Sample mapped row:', mappedRows[0]);
        }

        // Transform to database payload
        const payload = mappedRows.map((row, index) => {
            const transformed = {
                province: normalizeString(row.province),
                city: normalizeString(row.city),
                name: normalizeString(row.name),
                age: row.age ? Number(row.age) : null,
                brethren: normalizeString(row.brethren),
                outline: normalizeString(row.outline),
                accommodation: normalizeString(row.accommodation),
                registration: normalizeString(row.registration),
                food: normalizeString(row.food),
                status: normalizeString(row.status),
                transportation: normalizeString(row.transportation),
                arrival_date: toIsoDate(row.arrival_date),
                arrival_time: toTimeString(row.arrival_time),
                arrival_transpo: normalizeString(row.arrival_transpo),
                departure_date: toIsoDate(row.departure_date),
                departure_time: toTimeText12Hour(row.departure_time),
                departure_transpo: normalizeString(row.departure_transpo),
                payment_mode: normalizeString(row.payment_mode),
                amount: parseAmount(row.amount),
                remarks: normalizeString(row.remarks)
            };
            
            // Log rows without names for debugging
            if (!transformed.name) {
                console.warn(`Row ${index + 1} has no name. Original data:`, row);
            }
            
            return transformed;
        });

        // Filter out rows without names
        const validPayload = payload.filter(row => row.name);
        const skippedCount = payload.length - validPayload.length;
        
        console.log(`Payload preparation: ${payload.length} total rows, ${validPayload.length} valid (with names), ${skippedCount} skipped (no name)`);
        
        if (skippedCount > 0) {
            console.warn(`Skipped ${skippedCount} row(s) without names`);
        }

        if (!validPayload.length) {
            const errorMsg = rows.length === 0 
                ? 'No rows found in the Excel file. Please check that your file has data.'
                : `No valid rows found. ${skippedCount > 0 ? `${skippedCount} row(s) were skipped because they have no name. ` : ''}Please ensure your Excel file has a "Name" column with data.`;
            showNotification(errorMsg, 'error');
            hideImportLoader();
            return;
        }

        console.log(`Attempting to insert ${validPayload.length} row(s) into database...`);
        console.log('Sample payload row:', validPayload[0]);

        // Supabase has a limit of ~1000 rows per insert, so we need to batch large imports
        const BATCH_SIZE = 1000;
        const totalBatches = Math.ceil(validPayload.length / BATCH_SIZE);
        let totalInserted = 0;
        let totalFailed = 0;
        const errors = [];

        // Update loader message for batch processing
        if (totalBatches > 1) {
            showImportLoader(`Importing batch 1 of ${totalBatches} (${validPayload.length} total rows)...`);
        }

        // Process in batches
        for (let i = 0; i < totalBatches; i++) {
            const start = i * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, validPayload.length);
            const batch = validPayload.slice(start, end);
            const progress = ((i + 1) / totalBatches) * 100;
            
            if (totalBatches > 1) {
                showImportLoader(`Importing batch ${i + 1} of ${totalBatches} (rows ${start + 1}-${end} of ${validPayload.length})...`, progress);
            } else {
                showImportLoader(`Importing ${validPayload.length} row(s)...`, progress);
            }

            try {
                const { data: insertData, error } = await supabaseClient
                    .from('registrants')
                    .insert(batch)
                    .select();

                if (error) {
                    console.error(`Supabase import error for batch ${i + 1}:`, error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    errors.push({
                        batch: i + 1,
                        error: error.message || 'Unknown error',
                        rows: batch.length
                    });
                    totalFailed += batch.length;
                } else {
                    const batchInserted = insertData?.length || batch.length;
                    totalInserted += batchInserted;
                    console.log(`Batch ${i + 1}/${totalBatches}: Inserted ${batchInserted} row(s)`);
                    
                    if (batchInserted < batch.length) {
                        console.warn(`Batch ${i + 1}: Expected ${batch.length} rows but only ${batchInserted} were inserted`);
                        totalFailed += (batch.length - batchInserted);
                    }
                }
            } catch (err) {
                console.error(`Exception during batch ${i + 1} insert:`, err);
                errors.push({
                    batch: i + 1,
                    error: err.message || 'Unknown exception',
                    rows: batch.length
                });
                totalFailed += batch.length;
            }

            // Small delay between batches to avoid overwhelming the database
            if (i < totalBatches - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log(`Import complete: ${totalInserted} inserted, ${totalFailed} failed out of ${validPayload.length} total`);
        
        if (errors.length > 0) {
            console.error('Import errors:', errors);
        }

        // Reset unmapped keys logging for next import
        mapExcelRow._loggedUnmapped = false;

        // Refresh data from database to get accurate count
        showImportLoader('Refreshing data...');
        adminRegistrants = await fetchAdminRegistrants();
        populateFilterOptions(); // Update filters with new data
        const filtered = getFilteredAdminData();
        adminFilteredCache = filtered;
        const { pageData } = getPagedAdminData(filtered);
        renderAdminTable(pageData);
        updateAdminStats(adminRegistrants); // Show stats for ALL data, not filtered
        updateAdminResultCount(filtered.length, adminRegistrants.length);
        const totalPages = Math.max(1, Math.ceil(filtered.length / adminPageSize));
        updateAdminPagination(totalPages);

        // Show detailed import results
        let successMsg;
        let notificationType;
        
        if (totalFailed === 0 && totalInserted === validPayload.length) {
            successMsg = `Successfully imported all ${totalInserted} row(s) from Excel.`;
            notificationType = 'success';
        } else if (totalInserted > 0) {
            successMsg = `Imported ${totalInserted} of ${validPayload.length} row(s). `;
            if (totalFailed > 0) {
                successMsg += `${totalFailed} row(s) failed. `;
            }
            if (errors.length > 0) {
                successMsg += `Check console for details.`;
            }
            notificationType = totalInserted === validPayload.length ? 'success' : 'info';
        } else {
            successMsg = `Import failed: ${totalFailed} row(s) could not be inserted. Check console for error details.`;
            notificationType = 'error';
        }
        
        showNotification(successMsg, notificationType);
        
        // Log summary to console
        console.log('=== IMPORT SUMMARY ===');
        console.log(`Total rows in Excel: ${rows.length}`);
        console.log(`Rows after mapping: ${mappedRows.length}`);
        console.log(`Rows with valid names: ${validPayload.length}`);
        console.log(`Rows skipped (no name): ${skippedCount}`);
        console.log(`Rows successfully inserted: ${totalInserted}`);
        console.log(`Rows failed: ${totalFailed}`);
        console.log(`Total registrants in database now: ${adminRegistrants.length}`);
        if (errors.length > 0) {
            console.log('Errors:', errors);
        }
        console.log('=====================');
    } catch (err) {
        console.error('Excel import error:', err);
        showNotification('Failed to read the Excel file. Please use .xlsx or .xls.', 'error');
    } finally {
        hideImportLoader();
    }
}

function safeText(value) {
    return value ? String(value).trim() : '-';
}

function formatAdminDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return safeText(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAdminAmount(amount) {
    const numeric = parseFloat(amount);
    if (Number.isNaN(numeric)) return '₱0';
    return `₱${numeric.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;
}

function updateAdminStats(rows) {
    const total = rows.length;
    const needsAccommodation = rows.filter(r => r.accommodation && r.accommodation !== 'None').length;
    const pending = rows.filter(r => (r.status || '').toLowerCase() === 'pending').length;
    const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

    const totalEl = document.getElementById('statTotal');
    const accommodationEl = document.getElementById('statAccommodation');
    const pendingEl = document.getElementById('statPending');
    const amountEl = document.getElementById('statAmount');

    if (totalEl) totalEl.textContent = total;
    if (accommodationEl) accommodationEl.textContent = needsAccommodation;
    if (pendingEl) pendingEl.textContent = pending;
    if (amountEl) amountEl.textContent = formatAdminAmount(totalAmount);
}

function updateAdminResultCount(filtered, total) {
    const resultCount = document.getElementById('adminResultCount');
    if (resultCount) {
        resultCount.textContent = `Showing ${filtered} of ${total} entries`;
    }
}

function getPagedAdminData(rows) {
    const totalPages = Math.max(1, Math.ceil(rows.length / adminPageSize));
    const clampedPage = Math.min(Math.max(adminCurrentPage, 1), totalPages);
    adminCurrentPage = clampedPage;
    const start = (clampedPage - 1) * adminPageSize;
    const pageData = rows.slice(start, start + adminPageSize);
    return { pageData, totalPages };
}

function updateAdminPagination(totalPages) {
    const pageInfo = document.getElementById('adminPageInfo');
    const pagePrev = document.getElementById('adminPagePrev');
    const pageNext = document.getElementById('adminPageNext');
    if (pageInfo) {
        pageInfo.textContent = `Page ${adminCurrentPage} of ${totalPages}`;
    }
    if (pagePrev) pagePrev.disabled = adminCurrentPage <= 1;
    if (pageNext) pageNext.disabled = adminCurrentPage >= totalPages;
}

function renderAdminTable(rows) {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;

    if (!rows.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="22" class="empty-row">No registrants match the current filters.</td>
            </tr>
        `;
        return;
    }

    const buildRow = (row, index, startNumber = 1) => {
        const rowData = encodeURIComponent(JSON.stringify(row));
        const rowNumber = startNumber + index;
        // Debug: Log what we're about to render for first row
        if (index === 0) {
            console.log('Building first row with data:', {
                rowNumber: rowNumber,
                province: row.province,
                city: row.city,
                name: row.name,
                age: row.age
            });
        }
        return `<tr>
            <td data-column="number" style="text-align: center; font-weight: 600; color: #64748b; width: 50px; min-width: 50px; padding: 0.75rem; display: table-cell !important; visibility: visible !important;">${rowNumber}</td>
            <td class="action-cell" data-column="actions" style="width: 90px; min-width: 90px; padding: 0.75rem; text-align: center; display: table-cell !important; visibility: visible !important;">
                <div class="action-buttons" style="display: flex; gap: 0.5rem; align-items: center; justify-content: center;">
                    <button class="btn-view-details" data-row-data="${rowData}" aria-label="View details" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-registrant" data-row-data="${rowData}" aria-label="Edit registrant" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
            <td class="province-cell" data-column="province">${safeText(row.province)}</td>
            <td data-column="city">${safeText(row.city)}</td>
            <td data-column="name">${safeText(row.name)}</td>
            <td data-column="age">${safeText(row.age)}</td>
            <td><span class="chip chip-quiet">${safeText(row.brethren)}</span></td>
            <td>${safeText(row.outline)}</td>
            <td><span class="chip ${row.accommodation === 'None' ? 'chip-muted' : 'chip-primary'}">${safeText(row.accommodation)}</span></td>
            <td>${safeText(row.registration)}</td>
            <td>${safeText(row.food)}</td>
            <td><span class="status-badge status-${safeText(row.status).toLowerCase()}">${safeText(row.status)}</span></td>
            <td>${safeText(row.transportation)}</td>
            <td>${formatAdminDate(row.arrivalDate)}</td>
            <td>${safeText(row.arrivalTime)}</td>
            <td>${safeText(row.arrivalTranspo)}</td>
            <td>${formatAdminDate(row.departureDate)}</td>
            <td>${safeText(row.departureTime)}</td>
            <td>${safeText(row.departureTranspo)}</td>
            <td>${safeText(row.paymentMode)}</td>
            <td>${formatAdminAmount(row.amount)}</td>
            <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${safeText(row.remarks)}</td>
        </tr>`;
    };

    // Calculate starting row number based on current page
    const startRowNumber = (adminCurrentPage - 1) * adminPageSize + 1;
    
    // Clear and rebuild table row by row to ensure proper structure
    tbody.innerHTML = '';
    const rowsHtml = rows.map((row, index) => buildRow(row, index, startRowNumber));
    tbody.innerHTML = rowsHtml.join('');
    
    // Debug: Verify first row rendering
    if (rows.length > 0) {
        const firstRow = rows[0];
        const firstTr = tbody.querySelector('tr');
        if (firstTr) {
            const cells = firstTr.querySelectorAll('td');
            console.log('First row rendered cells:', {
                cellCount: cells.length,
                cell1_action: cells[0]?.textContent?.trim(),
                cell2_province: cells[1]?.textContent?.trim(),
                cell3_city: cells[2]?.textContent?.trim(),
                cell4_name: cells[3]?.textContent?.trim(),
                cell5_age: cells[4]?.textContent?.trim(),
                expectedProvince: firstRow.province,
                expectedCity: firstRow.city,
                expectedName: firstRow.name,
                expectedAge: firstRow.age
            });
        }
    }
    
    // Attach click handlers to view buttons
    tbody.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const rowDataAttr = btn.getAttribute('data-row-data');
            if (rowDataAttr) {
                try {
                    const rowData = JSON.parse(decodeURIComponent(rowDataAttr));
                    showRegistrantModal(rowData);
                } catch (e) {
                    console.error('Failed to parse row data:', e);
                }
            }
        });
    });
    
    // Attach click handlers to edit buttons
    tbody.querySelectorAll('.btn-edit-registrant').forEach(btn => {
        btn.addEventListener('click', () => {
            const rowDataAttr = btn.getAttribute('data-row-data');
            if (rowDataAttr) {
                try {
                    const rowData = JSON.parse(decodeURIComponent(rowDataAttr));
                    showEditRegistrantModal(rowData);
                } catch (e) {
                    console.error('Failed to parse row data:', e);
                }
            }
        });
    });
}

function populateFilterOptions() {
    if (!adminRegistrants.length) return;

    // Get unique values from database
    const accommodations = [...new Set(adminRegistrants.map(r => r.accommodation).filter(Boolean))].sort();
    const statuses = [...new Set(adminRegistrants.map(r => r.status).filter(Boolean))].sort();
    const transportations = [...new Set(adminRegistrants.map(r => r.transportation).filter(Boolean))].sort();
    const outlines = [...new Set(adminRegistrants.map(r => r.outline).filter(Boolean))].sort();

    // Populate Accommodation filter
    const accommodationFilter = document.getElementById('adminAccommodationFilter');
    if (accommodationFilter) {
        const currentValue = accommodationFilter.value;
        accommodationFilter.innerHTML = '<option value="all">All</option>';
        accommodations.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            accommodationFilter.appendChild(option);
        });
        if (currentValue && accommodations.includes(currentValue)) {
            accommodationFilter.value = currentValue;
        }
    }

    // Populate Status filter
    const statusFilter = document.getElementById('adminStatusFilter');
    if (statusFilter) {
        const currentValue = statusFilter.value;
        statusFilter.innerHTML = '<option value="all">All</option>';
        statuses.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            statusFilter.appendChild(option);
        });
        if (currentValue && statuses.includes(currentValue)) {
            statusFilter.value = currentValue;
        }
    }

    // Populate Transportation filter
    const transportationFilter = document.getElementById('adminTransportationFilter');
    if (transportationFilter) {
        const currentValue = transportationFilter.value;
        transportationFilter.innerHTML = '<option value="all">All</option>';
        transportations.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            transportationFilter.appendChild(option);
        });
        if (currentValue && transportations.includes(currentValue)) {
            transportationFilter.value = currentValue;
        }
    }

    // Populate Outline filter
    const outlineFilter = document.getElementById('adminOutlineFilter');
    if (outlineFilter) {
        const currentValue = outlineFilter.value;
        outlineFilter.innerHTML = '<option value="all">All</option>';
        outlines.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            outlineFilter.appendChild(option);
        });
        if (currentValue && outlines.includes(currentValue)) {
            outlineFilter.value = currentValue;
        }
    }
}

// Helper function to normalize search strings
function normalizeSearchString(str) {
    if (!str) return '';
    return String(str)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
}

// Helper function to check if search term matches a field value
function fieldMatchesSearch(fieldValue, searchTerm) {
    if (!searchTerm) return true; // Empty search matches everything
    if (!fieldValue) return false; // Empty field doesn't match
    
    const normalizedField = normalizeSearchString(fieldValue);
    const normalizedSearch = normalizeSearchString(searchTerm);
    
    // Exact match
    if (normalizedField === normalizedSearch) return true;
    
    // Contains match
    if (normalizedField.includes(normalizedSearch)) return true;
    
    // Word boundary match (matches whole words)
    const words = normalizedField.split(/\s+/);
    if (words.some(word => word === normalizedSearch || word.startsWith(normalizedSearch))) return true;
    
    // Partial word match (for abbreviations, etc.)
    if (normalizedSearch.length >= 2 && normalizedField.includes(normalizedSearch)) return true;
    
    return false;
}

function getFilteredAdminData() {
    const searchInput = document.getElementById('adminSearch');
    const search = searchInput?.value || '';
    const accommodation = document.getElementById('adminAccommodationFilter')?.value || 'all';
    const status = document.getElementById('adminStatusFilter')?.value || 'all';
    const transportation = document.getElementById('adminTransportationFilter')?.value || 'all';
    const outline = document.getElementById('adminOutlineFilter')?.value || 'all';

    return adminRegistrants.filter((row) => {
        // Search filter - improved search across multiple fields
        let matchesSearch = true;
        if (search) {
            const normalizedSearch = normalizeSearchString(search);
            
            // Search across all relevant fields with priority order
            const searchableFields = [
                { value: row.name, weight: 3 }, // Name has highest priority
                { value: row.province, weight: 2 }, // Province and city are important
                { value: row.city, weight: 2 },
                { value: row.registration, weight: 1 },
                { value: row.remarks, weight: 1 },
                { value: row.brethren, weight: 1 },
                { value: row.paymentMode, weight: 1 },
                { value: row.accommodation, weight: 1 },
                { value: row.status, weight: 1 },
                { value: row.transportation, weight: 1 },
                { value: row.outline, weight: 1 },
                { value: row.food, weight: 1 },
                { value: row.arrivalTime, weight: 1 },
                { value: row.departureTime, weight: 1 },
                { value: row.arrivalTranspo, weight: 1 },
                { value: row.departureTranspo, weight: 1 }
            ];
            
            // Check if search term matches any field
            matchesSearch = searchableFields.some(field => {
                if (!field.value) return false;
                return fieldMatchesSearch(field.value, search);
            });
            
            // Also try searching with individual words (for multi-word searches like "Zamboanga City")
            if (!matchesSearch && normalizedSearch.includes(' ')) {
                const searchWords = normalizedSearch.split(/\s+/).filter(w => w.length > 0);
                // For multi-word searches, at least one word should match
                matchesSearch = searchWords.some(word => 
                    searchableFields.some(field => field.value && fieldMatchesSearch(field.value, word))
                );
            }
            
            // Additional fuzzy matching: try without spaces (e.g., "ZamboangaCity" matches "Zamboanga City")
            if (!matchesSearch) {
                const searchNoSpaces = normalizedSearch.replace(/\s+/g, '');
                matchesSearch = searchableFields.some(field => {
                    if (!field.value) return false;
                    const fieldNoSpaces = normalizeSearchString(field.value).replace(/\s+/g, '');
                    return fieldNoSpaces.includes(searchNoSpaces) || searchNoSpaces.includes(fieldNoSpaces);
                });
            }
        }

        // Accommodation filter - exact match (case-sensitive to match database)
        const rowAccommodation = (row.accommodation || '').toString().trim();
        const matchesAccommodation = accommodation === 'all' || rowAccommodation === accommodation;

        // Status filter - case-insensitive match
        const rowStatus = (row.status || '').toString().trim().toLowerCase();
        const matchesStatus = status === 'all' || rowStatus === status.toLowerCase();

        // Transportation filter - case-insensitive match
        const rowTransportation = (row.transportation || '').toString().trim().toLowerCase();
        const matchesTransportation = transportation === 'all' || rowTransportation === transportation.toLowerCase();

        // Outline filter - case-insensitive match
        const rowOutline = (row.outline || '').toString().trim().toLowerCase();
        const matchesOutline = outline === 'all' || rowOutline === outline.toLowerCase();

        return matchesSearch && matchesAccommodation && matchesStatus && matchesTransportation && matchesOutline;
    });
}

function exportAdminCsv(rows) {
    if (!rows || !rows.length) {
        showNotification('No data to export for the current filters.', 'info');
        return;
    }

    const headers = [
        'Province', 'Locality', 'Name', 'Age', 'Bro/Sis', 'Outline', 'Accommodation',
        'Registration', 'Food', 'Status', 'Mode of Transportation', 'Arrival Date',
        'Arrival Time', 'Arrival Transpo', 'Departure Date', 'Departure Time', 'Departure Transpo',
        'Mode of Payment', 'Amount', 'Remarks'
    ];

    const csvRows = rows.map(row => [
        row.province, row.city, row.name, row.age, row.brethren, row.outline,
        row.accommodation, row.registration, row.food, row.status, row.transportation,
        row.arrivalDate, row.arrivalTime, row.arrivalTranspo, row.departureDate, row.departureTime,
        row.departureTranspo, row.paymentMode, row.amount, row.remarks
    ].map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registrants-admin.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showNotification('CSV exported for current admin view.', 'success');
}

async function initAdminPanel() {
    const tableBody = document.getElementById('adminTableBody');
    if (!tableBody) return;

    if (!isAdminAuthenticated()) {
        applyAdminAuthState();
        return;
    }

    if (!supabaseClient) {
        showNotification('Supabase client not configured.', 'error');
        return;
    }

    const controls = [
        'adminSearch',
        'adminAccommodationFilter',
        'adminStatusFilter',
        'adminTransportationFilter',
        'adminOutlineFilter'
    ].map(id => document.getElementById(id)).filter(Boolean);

    const resetButton = document.getElementById('adminResetFilters');
    const exportButtons = [
        document.getElementById('adminExportCsv'),
        document.getElementById('adminExportCsvTop')
    ];

    const render = () => {
        const filtered = getFilteredAdminData();
        adminFilteredCache = filtered;
        const { pageData, totalPages } = getPagedAdminData(filtered);
        renderAdminTable(pageData);
        updateAdminStats(adminRegistrants); // Show stats for ALL data, not filtered
        updateAdminResultCount(filtered.length, adminRegistrants.length);
        updateAdminPagination(totalPages);
    };

    if (!adminActionsBound) {
        controls.forEach(control => {
            const eventName = control.tagName === 'INPUT' ? 'input' : 'change';
            control.addEventListener(eventName, throttle(render, 150));
        });

        const importButtons = [
            document.getElementById('adminImportExcel'),
            document.getElementById('adminImportExcelTop')
        ];
        const templateButtons = [
            document.getElementById('adminDownloadTemplate'),
            document.getElementById('adminDownloadTemplateTop')
        ];
        const printButtons = [
            document.getElementById('adminPrintViewTop')
        ];
        const pagePrev = document.getElementById('adminPagePrev');
        const pageNext = document.getElementById('adminPageNext');
        const pageSizeSelect = document.getElementById('adminPageSize');
        const importInput = document.getElementById('adminImportFile');

        if (importInput && importButtons.length) {
            importButtons.forEach(button => {
                if (button) {
                    button.addEventListener('click', () => importInput.click());
                }
            });

            importInput.addEventListener('change', async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                await handleAdminImportFile(file);
                importInput.value = '';
            });
        }

        templateButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', downloadAdminTemplate);
            }
        });

        printButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', () => showPrintOptionsModal());
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                controls.forEach(control => {
                    if (control.tagName === 'INPUT') control.value = '';
                    if (control.tagName === 'SELECT') control.value = 'all';
                });
                adminCurrentPage = 1;
                render();
            });
        }

        exportButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', () => exportAdminCsv(adminFilteredCache));
            }
        });

        if (pagePrev) {
            pagePrev.addEventListener('click', () => {
                adminCurrentPage = Math.max(1, adminCurrentPage - 1);
                render();
            });
        }
        if (pageNext) {
            pageNext.addEventListener('click', () => {
                adminCurrentPage += 1; // clamped in updateAdminPagination
                render();
            });
        }
        if (pageSizeSelect) {
            pageSizeSelect.value = String(adminPageSize);
            pageSizeSelect.addEventListener('change', () => {
                const newSize = parseInt(pageSizeSelect.value, 10);
                if (Number.isFinite(newSize) && newSize > 0) {
                    adminPageSize = newSize;
                    adminCurrentPage = 1;
                    render();
                }
            });
        }

        adminActionsBound = true;
    }

    adminRegistrants = await fetchAdminRegistrants();
    adminFilteredCache = adminRegistrants;
    populateFilterOptions(); // Populate filters with actual database values
    render();
}

function isAdminAuthenticated() {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

function setAdminAuthenticated(value) {
    if (value) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
    }
}

function applyAdminAuthState() {
    const adminPanel = document.querySelector('.admin-panel');
    const loginSection = document.getElementById('admin-login');
    const exportButtons = [
        document.getElementById('adminExportCsv'),
        document.getElementById('adminExportCsvTop')
    ];
    const logoutButtons = [
        document.getElementById('adminLogout'),
        document.getElementById('adminLogoutTop')
    ];
    const locked = !isAdminAuthenticated();

    if (adminPanel) {
        adminPanel.classList.toggle('locked', locked);
    }
    if (loginSection) {
        loginSection.classList.toggle('hidden', !locked);
    }
    exportButtons.forEach(btn => {
        if (btn) {
            btn.disabled = locked;
            btn.title = locked ? 'Login to export' : '';
        }
    });
    logoutButtons.forEach(btn => {
        if (btn) {
            btn.style.display = locked ? 'none' : 'inline-flex';
        }
    });
}

function initAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    const passwordInput = document.getElementById('adminPassword');
    const emailInput = document.getElementById('adminEmail');
    const togglePassword = document.querySelector('.toggle-password');
    const logoutButtons = [
        document.getElementById('adminLogout'),
        document.getElementById('adminLogoutTop')
    ];

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            togglePassword.querySelector('i').className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!supabaseClient) {
                showNotification('Supabase client not configured.', 'error');
                return;
            }
            const email = emailInput?.value.trim();
            const password = passwordInput?.value.trim();

            if (!email || !password) {
                showNotification('Email and password are required.', 'error');
                return;
            }

            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                showNotification('Invalid credentials or auth error.', 'error');
                return;
            }

            setAdminAuthenticated(true);
            applyAdminAuthState();
            showNotification('Admin unlocked via Supabase.', 'success');
            document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
            await initAdminPanel();
        });
    }

    logoutButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', async () => {
                if (supabaseClient) {
                    await supabaseClient.auth.signOut();
                }
                setAdminAuthenticated(false);
                applyAdminAuthState();
                showNotification('Logged out of admin.', 'info');
                document.getElementById('admin-login')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    applyAdminAuthState();

    // Sync existing session if already logged in with Supabase
    (async () => {
        if (supabaseClient) {
            const { data } = await supabaseClient.auth.getSession();
            const hasSession = !!data?.session;
            setAdminAuthenticated(hasSession);
            applyAdminAuthState();
            if (hasSession) {
                await initAdminPanel();
            }
        }
    })();
}

// Initialize back to top button
function initBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // Add throttled scroll event listener for better performance
    const throttledToggle = throttle(toggleBackToTopButton, 100);
    window.addEventListener('scroll', throttledToggle);
    
    // Add touch support for mobile
    if ('ontouchstart' in window) {
        backToTopButton.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-1px) scale(0.95)';
        });
        
        backToTopButton.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    }
    
    // Debug: Log scroll events
    console.log('Back to top button initialized');
}

// Registrant Details Modal Functions
function showRegistrantModal(row) {
    const modal = document.getElementById('registrantModal');
    const modalBody = document.getElementById('registrantModalBody');
    if (!modal || !modalBody) return;

    const formatValue = (val) => val && String(val).trim() ? String(val).trim() : '<em class="text-muted">Not provided</em>';
    
    modalBody.innerHTML = `
        <div class="registrant-details-grid">
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <div class="detail-item detail-item-name">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value detail-value-name">${formatValue(row.name)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">${formatValue(row.age)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bro/Sis:</span>
                    <span class="detail-value">${formatValue(row.brethren)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Province:</span>
                    <span class="detail-value">${formatValue(row.province)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Locality:</span>
                    <span class="detail-value">${formatValue(row.city)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-calendar-check"></i> Registration Details</h3>
                <div class="detail-item">
                    <span class="detail-label">Outline:</span>
                    <span class="detail-value">${formatValue(row.outline)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Registration:</span>
                    <span class="detail-value">${formatValue(row.registration)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Food:</span>
                    <span class="detail-value">${formatValue(row.food)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge status-${safeText(row.status).toLowerCase()}">${row.status && String(row.status).trim() ? String(row.status).trim() : 'Not provided'}</span></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Accommodation:</span>
                    <span class="detail-value"><span class="chip ${row.accommodation === 'None' ? 'chip-muted' : 'chip-primary'}">${row.accommodation && String(row.accommodation).trim() ? String(row.accommodation).trim() : 'Not provided'}</span></span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-plane-departure"></i> Arrival Information</h3>
                <div class="detail-item">
                    <span class="detail-label">Arrival Date:</span>
                    <span class="detail-value">${formatValue(formatAdminDate(row.arrivalDate))}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Arrival Time:</span>
                    <span class="detail-value">${formatValue(row.arrivalTime)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Arrival Transportation:</span>
                    <span class="detail-value">${formatValue(row.arrivalTranspo)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Mode of Transportation:</span>
                    <span class="detail-value">${formatValue(row.transportation)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-plane-arrival"></i> Departure Information</h3>
                <div class="detail-item">
                    <span class="detail-label">Departure Date:</span>
                    <span class="detail-value">${formatValue(formatAdminDate(row.departureDate))}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Departure Time:</span>
                    <span class="detail-value">${formatValue(row.departureTime)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Departure Transportation:</span>
                    <span class="detail-value">${formatValue(row.departureTranspo)}</span>
                </div>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-money-bill-wave"></i> Payment Information</h3>
                <div class="detail-item">
                    <span class="detail-label">Mode of Payment:</span>
                    <span class="detail-value">${formatValue(row.paymentMode)}</span>
                </div>
                <div class="detail-item detail-item-amount">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value detail-value-amount">${formatAdminAmount(row.amount)}</span>
                </div>
            </div>

            <div class="detail-section full-width">
                <h3><i class="fas fa-sticky-note"></i> Remarks</h3>
                <div class="detail-item">
                    <span class="detail-value">${formatValue(row.remarks)}</span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeRegistrantModal() {
    const modal = document.getElementById('registrantModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
}

function initRegistrantModal() {
    const modal = document.getElementById('registrantModal');
    const closeBtn = modal?.querySelector('.registrant-modal-close');
    const overlay = modal?.querySelector('.registrant-modal-overlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeRegistrantModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeRegistrantModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeRegistrantModal();
        }
    });
}

// All Registrants Modal Functions
function showAllRegistrantsModal() {
    const modal = document.getElementById('allRegistrantsModal');
    const modalBody = document.getElementById('allRegistrantsModalBody');
    if (!modal || !modalBody) return;

    if (!adminRegistrants.length) {
        modalBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">No registrants found. Please import data first.</td>
            </tr>
        `;
        modal.classList.add('active');
        body.style.overflow = 'hidden';
        return;
    }

    renderAllRegistrantsTable(adminRegistrants);
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function renderAllRegistrantsTable(rows) {
    const modalBody = document.getElementById('allRegistrantsModalBody');
    if (!modalBody) return;

    if (!rows.length) {
        modalBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">No registrants match your search.</td>
            </tr>
        `;
        return;
    }

    const buildRow = (row) => {
        const rowData = encodeURIComponent(JSON.stringify(row));
        return `
        <tr>
            <td>${safeText(row.name)}</td>
            <td>${safeText(row.city)}</td>
            <td>${safeText(row.province)}</td>
            <td><span class="status-badge status-${safeText(row.status).toLowerCase()}">${safeText(row.status)}</span></td>
            <td><span class="chip ${row.accommodation === 'None' ? 'chip-muted' : 'chip-primary'}">${safeText(row.accommodation)}</span></td>
            <td class="action-cell">
                <button class="btn-view-details-small" data-row-data="${rowData}" aria-label="View details">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `;
    };

    modalBody.innerHTML = rows.map(buildRow).join('');

    // Attach click handlers to view buttons
    modalBody.querySelectorAll('.btn-view-details-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const rowDataAttr = btn.getAttribute('data-row-data');
            if (rowDataAttr) {
                try {
                    const rowData = JSON.parse(decodeURIComponent(rowDataAttr));
                    closeAllRegistrantsModal();
                    setTimeout(() => showRegistrantModal(rowData), 300);
                } catch (e) {
                    console.error('Failed to parse row data:', e);
                }
            }
        });
    });
}

function closeAllRegistrantsModal() {
    const modal = document.getElementById('allRegistrantsModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
}

function initAllRegistrantsModal() {
    const modal = document.getElementById('allRegistrantsModal');
    const closeBtn = modal?.querySelector('.registrant-modal-close');
    const overlay = modal?.querySelector('.registrant-modal-overlay');
    const searchInput = document.getElementById('registrantsModalSearch');
    const showBtn = document.getElementById('btnShowRegistrantsModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeAllRegistrantsModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeAllRegistrantsModal);
    }
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            if (isAdminAuthenticated()) {
                showAllRegistrantsModal();
            } else {
                showNotification('Please login first to view registrants.', 'info');
                document.getElementById('admin-login')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', throttle((e) => {
            const search = e.target.value.toLowerCase().trim();
            if (!adminRegistrants.length) return;
            
            const filtered = adminRegistrants.filter(row => {
                return !search || [
                    row.name,
                    row.city,
                    row.province,
                    row.status,
                    row.accommodation
                ].some(field => (field || '').toString().toLowerCase().includes(search));
            });
            
            renderAllRegistrantsTable(filtered);
        }, 200));
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeAllRegistrantsModal();
        }
    });
}

// New Registrant Modal Functions
function showNewRegistrantModal() {
    const modal = document.getElementById('newRegistrantModal');
    if (!modal) return;
    
    const form = document.getElementById('newRegistrantForm');
    if (form) {
        form.reset();
    }
    
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeNewRegistrantModal() {
    const modal = document.getElementById('newRegistrantModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
}

async function handleNewRegistrantSubmit(e) {
    e.preventDefault();
    
    if (!isAdminAuthenticated()) {
        showNotification('Please login first to add registrants.', 'error');
        return;
    }

    if (!supabaseClient) {
        showNotification('Supabase client not configured.', 'error');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    
    // Build payload matching database schema
    const payload = {
        name: normalizeString(formData.get('name')),
        age: formData.get('age') ? parseInt(formData.get('age'), 10) : null,
        brethren: normalizeString(formData.get('brethren')),
        province: normalizeString(formData.get('province')),
        city: normalizeString(formData.get('city')),
        outline: normalizeString(formData.get('outline')),
        accommodation: normalizeString(formData.get('accommodation')),
        registration: normalizeString(formData.get('registration')),
        food: normalizeString(formData.get('food')),
        status: normalizeString(formData.get('status')),
        transportation: normalizeString(formData.get('transportation')),
        arrival_date: formData.get('arrivalDate') || null,
        arrival_time: normalizeString(formData.get('arrivalTime')),
        arrival_transpo: normalizeString(formData.get('arrivalTranspo')),
        departure_date: formData.get('departureDate') || null,
        departure_time: normalizeString(formData.get('departureTime')),
        departure_transpo: normalizeString(formData.get('departureTranspo')),
        payment_mode: normalizeString(formData.get('paymentMode')),
        amount: formData.get('amount') ? parseFloat(formData.get('amount')) : null,
        remarks: normalizeString(formData.get('remarks'))
    };

    // Validate required field
    if (!payload.name) {
        showNotification('Name is required.', 'error');
        return;
    }

    showImportLoader('Saving new registrant...');
    
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        if (!sessionData?.session) {
            showNotification('Your session expired. Please log in again.', 'error');
            return;
        }

        const { error } = await supabaseClient.from('registrants').insert([payload]);
        
        if (error) {
            console.error('Supabase insert error:', error);
            const msg = error?.message ? `Failed to add registrant: ${error.message}` : 'Failed to add registrant. Please try again.';
            showNotification(msg, 'error');
            return;
        }

        // Refresh data
        adminRegistrants = await fetchAdminRegistrants();
        populateFilterOptions();
        const filtered = getFilteredAdminData();
        adminFilteredCache = filtered;
        const { pageData } = getPagedAdminData(filtered);
        renderAdminTable(pageData);
        updateAdminStats(adminRegistrants); // Show stats for ALL data, not filtered
        updateAdminResultCount(filtered.length, adminRegistrants.length);
        const totalPages = Math.max(1, Math.ceil(filtered.length / adminPageSize));
        updateAdminPagination(totalPages);

        showNotification('New registrant added successfully!', 'success');
        closeNewRegistrantModal();
    } catch (err) {
        console.error('Error adding registrant:', err);
        showNotification('An error occurred while adding the registrant.', 'error');
    } finally {
        hideImportLoader();
    }
}

function initNewRegistrantModal() {
    const modal = document.getElementById('newRegistrantModal');
    const closeBtn = modal?.querySelector('.registrant-modal-close');
    const overlay = modal?.querySelector('.registrant-modal-overlay');
    const cancelBtn = document.getElementById('cancelNewRegistrant');
    const newBtn = document.getElementById('adminNewRegistrant');
    const form = document.getElementById('newRegistrantForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeNewRegistrantModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeNewRegistrantModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNewRegistrantModal);
    }
    if (newBtn) {
        newBtn.addEventListener('click', () => {
            if (isAdminAuthenticated()) {
                showNewRegistrantModal();
            } else {
                showNotification('Please login first to add registrants.', 'info');
                document.getElementById('admin-login')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    if (form) {
        form.addEventListener('submit', handleNewRegistrantSubmit);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeNewRegistrantModal();
        }
    });
}

// Edit Registrant Modal Functions
function showEditRegistrantModal(row) {
    const modal = document.getElementById('editRegistrantModal');
    if (!modal) return;
    
    if (!row.id) {
        showNotification('Cannot edit: Missing registrant ID.', 'error');
        return;
    }
    
    const form = document.getElementById('editRegistrantForm');
    if (form) {
        // Populate form with existing data
        document.getElementById('editRegistrantId').value = row.id || '';
        document.getElementById('editName').value = row.name || '';
        document.getElementById('editAge').value = row.age || '';
        document.getElementById('editBrethren').value = row.brethren || '';
        document.getElementById('editProvince').value = row.province || '';
        document.getElementById('editCity').value = row.city || '';
        document.getElementById('editOutline').value = row.outline || '';
        document.getElementById('editAccommodation').value = row.accommodation || '';
        document.getElementById('editRegistration').value = row.registration || '';
        document.getElementById('editFood').value = row.food || '';
        document.getElementById('editStatus').value = row.status || '';
        document.getElementById('editTransportation').value = row.transportation || '';
        document.getElementById('editArrivalDate').value = row.arrivalDate ? row.arrivalDate.split('T')[0] : '';
        document.getElementById('editArrivalTime').value = row.arrivalTime || '';
        document.getElementById('editArrivalTranspo').value = row.arrivalTranspo || '';
        document.getElementById('editDepartureDate').value = row.departureDate ? row.departureDate.split('T')[0] : '';
        document.getElementById('editDepartureTime').value = row.departureTime || '';
        document.getElementById('editDepartureTranspo').value = row.departureTranspo || '';
        document.getElementById('editPaymentMode').value = row.paymentMode || '';
        document.getElementById('editAmount').value = row.amount || '';
        document.getElementById('editRemarks').value = row.remarks || '';
    }
    
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeEditRegistrantModal() {
    const modal = document.getElementById('editRegistrantModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
        // Reset form
        const form = document.getElementById('editRegistrantForm');
        if (form) {
            form.reset();
        }
    }
}

async function handleEditRegistrantSubmit(e) {
    e.preventDefault();
    
    if (!isAdminAuthenticated()) {
        showNotification('Please login first to edit registrants.', 'error');
        return;
    }

    if (!supabaseClient) {
        showNotification('Supabase client not configured.', 'error');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const registrantId = formData.get('id');
    
    if (!registrantId) {
        showNotification('Cannot update: Missing registrant ID.', 'error');
        return;
    }
    
    // Build payload matching database schema
    const payload = {
        name: normalizeString(formData.get('name')),
        age: formData.get('age') ? parseInt(formData.get('age'), 10) : null,
        brethren: normalizeString(formData.get('brethren')),
        province: normalizeString(formData.get('province')),
        city: normalizeString(formData.get('city')),
        outline: normalizeString(formData.get('outline')),
        accommodation: normalizeString(formData.get('accommodation')),
        registration: normalizeString(formData.get('registration')),
        food: normalizeString(formData.get('food')),
        status: normalizeString(formData.get('status')),
        transportation: normalizeString(formData.get('transportation')),
        arrival_date: formData.get('arrivalDate') || null,
        arrival_time: normalizeString(formData.get('arrivalTime')),
        arrival_transpo: normalizeString(formData.get('arrivalTranspo')),
        departure_date: formData.get('departureDate') || null,
        departure_time: normalizeString(formData.get('departureTime')),
        departure_transpo: normalizeString(formData.get('departureTranspo')),
        payment_mode: normalizeString(formData.get('paymentMode')),
        amount: formData.get('amount') ? parseFloat(formData.get('amount')) : null,
        remarks: normalizeString(formData.get('remarks'))
    };

    // Validate required field
    if (!payload.name) {
        showNotification('Name is required.', 'error');
        return;
    }

    showImportLoader('Updating registrant...');
    
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        if (!sessionData?.session) {
            showNotification('Your session expired. Please log in again.', 'error');
            return;
        }

        const { error } = await supabaseClient
            .from('registrants')
            .update(payload)
            .eq('id', registrantId);
        
        if (error) {
            console.error('Supabase update error:', error);
            const msg = error?.message ? `Failed to update registrant: ${error.message}` : 'Failed to update registrant. Please try again.';
            showNotification(msg, 'error');
            return;
        }

        // Refresh data
        adminRegistrants = await fetchAdminRegistrants();
        populateFilterOptions();
        const filtered = getFilteredAdminData();
        adminFilteredCache = filtered;
        const { pageData } = getPagedAdminData(filtered);
        renderAdminTable(pageData);
        updateAdminStats(adminRegistrants); // Show stats for ALL data, not filtered
        updateAdminResultCount(filtered.length, adminRegistrants.length);
        const totalPages = Math.max(1, Math.ceil(filtered.length / adminPageSize));
        updateAdminPagination(totalPages);

        showNotification('Registrant updated successfully!', 'success');
        closeEditRegistrantModal();
    } catch (err) {
        console.error('Error updating registrant:', err);
        showNotification('An error occurred while updating the registrant.', 'error');
    } finally {
        hideImportLoader();
    }
}

function initEditRegistrantModal() {
    const modal = document.getElementById('editRegistrantModal');
    const closeBtn = modal?.querySelector('.registrant-modal-close');
    const overlay = modal?.querySelector('.registrant-modal-overlay');
    const cancelBtn = document.getElementById('cancelEditRegistrant');
    const form = document.getElementById('editRegistrantForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditRegistrantModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeEditRegistrantModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditRegistrantModal);
    }
    if (form) {
        form.addEventListener('submit', handleEditRegistrantSubmit);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeEditRegistrantModal();
        }
    });
}

// Print Options Modal Functions
function showPrintOptionsModal() {
    const modal = document.getElementById('printOptionsModal');
    if (!modal) return;
    
    // Populate province dropdown
    const provinceSelect = document.getElementById('printProvinceFilter');
    const citySelect = document.getElementById('printCityFilter');
    
    if (provinceSelect) {
        const currentProvince = provinceSelect.value;
        const provinces = [...new Set(adminRegistrants.map(r => r.province).filter(Boolean))].sort();
        provinceSelect.innerHTML = '<option value="all">All Provinces</option>';
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
        if (currentProvince && provinces.includes(currentProvince)) {
            provinceSelect.value = currentProvince;
        }
    }
    
    // Populate city dropdown
    if (citySelect) {
        const currentCity = citySelect.value;
        const cities = [...new Set(adminRegistrants.map(r => r.city).filter(Boolean))].sort();
        citySelect.innerHTML = '<option value="all">All Cities/Localities</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        if (currentCity && cities.includes(currentCity)) {
            citySelect.value = currentCity;
        }
    }
    
    // Update city options when province changes (only add listener once)
    if (provinceSelect && citySelect && !provinceSelect.hasAttribute('data-listener-added')) {
        provinceSelect.setAttribute('data-listener-added', 'true');
        provinceSelect.addEventListener('change', function() {
            const selectedProvince = this.value;
            const currentCity = citySelect.value;
            
            let cities = [];
            if (selectedProvince === 'all') {
                cities = [...new Set(adminRegistrants.map(r => r.city).filter(Boolean))];
            } else {
                cities = [...new Set(
                    adminRegistrants
                        .filter(r => (r.province || '').toString().trim() === selectedProvince)
                        .map(r => r.city)
                        .filter(Boolean)
                )];
            }
            
            cities.sort();
            citySelect.innerHTML = '<option value="all">All Cities/Localities</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
            
            // Reset city if it's no longer valid
            if (currentCity && !cities.includes(currentCity)) {
                citySelect.value = 'all';
            } else if (currentCity && cities.includes(currentCity)) {
                citySelect.value = currentCity;
            }
        });
    }
    
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closePrintOptionsModal() {
    const modal = document.getElementById('printOptionsModal');
    if (modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
}

function initPrintOptionsModal() {
    const modal = document.getElementById('printOptionsModal');
    const closeBtn = modal?.querySelector('.registrant-modal-close');
    const overlay = modal?.querySelector('.registrant-modal-overlay');
    const cancelBtn = document.getElementById('cancelPrintOptions');
    const form = document.getElementById('printOptionsForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', closePrintOptionsModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closePrintOptionsModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePrintOptionsModal);
    }
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const options = {
                province: formData.get('province') || 'all',
                city: formData.get('city') || 'all',
                groupByProvince: formData.get('groupByProvince') === 'on',
                groupByCity: formData.get('groupByCity') === 'on'
            };
            
            closePrintOptionsModal();
            printAdminView(adminFilteredCache, options);
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closePrintOptionsModal();
        }
    });
}

// Main initialization function
function initAll() {
    console.log('Initializing website...');
    
    // Initialize all components
    initMobileNavigation();
    initTouchNavigation();
    initSmoothScrolling();
    initActiveNavigation();
    initNavbarScroll();
    initScrollProgress();
    initRegistrationForm();
    initBackToTopButton();
    initMobileModalEnhancements();
    
    // Only initialize admin features if on admin page
    if (document.getElementById('adminLoginForm') || document.getElementById('adminTableBody')) {
        initAdminLogin();
        initAdminPanel();
        initRegistrantModal();
        initAllRegistrantsModal();
        initNewRegistrantModal();
        initEditRegistrantModal();
        initPrintOptionsModal();
    }
    
    console.log('Website initialization complete');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initAll);
