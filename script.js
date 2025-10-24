// Enhanced Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

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

// Touch-friendly navigation improvements
if ('ontouchstart' in window) {
    // Add touch feedback to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Google Maps Integration
function initMap() {
    // Zamboanga City coordinates
    const zamboangaCity = { lat: 6.9214, lng: 122.0790 };
    
    // Create the map
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: zamboangaCity,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Add a marker for the church location
    const marker = new google.maps.Marker({
        position: { lat: 6.9214, lng: 122.0790 },
        map: map,
        title: 'The Church in Zamboanga City',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#2c5aa0" stroke="white" stroke-width="2"/>
                    <path d="M20 8 L25 15 L30 15 L25 20 L30 25 L25 25 L20 30 L15 25 L10 25 L15 20 L10 15 L15 15 Z" fill="white"/>
                </svg>
            `),
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: #2c5aa0; font-size: 16px;">The Church in Zamboanga City</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px;">Paseo del Mar, Zamboanga City</p>
                <p style="margin: 0; font-size: 14px; color: #666;">Zamboanga del Sur, Philippines</p>
                <div style="margin-top: 10px;">
                    <a href="https://maps.google.com/?q=6.9214,122.0790" target="_blank" 
                       style="color: #2c5aa0; text-decoration: none; font-size: 14px;">
                        Get Directions
                    </a>
                </div>
            </div>
        `
    });
    
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    // Add click listener to open info window by default
    infoWindow.open(map, marker);
}

// Registration Form Handling
const registrationForm = document.getElementById('registrationForm');

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
            input.style.borderColor = '#dc3545';
            input.addEventListener('input', function() {
                this.style.borderColor = '#e0e0e0';
            });
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
    // Remove mobile class if screen is large
    if (window.innerWidth > 768) {
        document.body.classList.remove('mobile-device');
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
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

// Mobile-friendly map loading
function initMobileMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer && window.innerWidth <= 768) {
        // Add mobile-specific map styles
        mapContainer.style.height = '250px';
        mapContainer.style.borderRadius = '10px';
    }
}

// Initialize mobile map on load
document.addEventListener('DOMContentLoaded', initMobileMap);
