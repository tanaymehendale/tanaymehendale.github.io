document.addEventListener('DOMContentLoaded', function() {
    const backTop = document.querySelector('.back-to-top a');
    if (backTop) {
        backTop.addEventListener('click', function(e) {
            e.preventDefault();
            const lead = document.querySelector('#lead');
            if (lead) {
                lead.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Remove floating buttons on mobile
    if (window.innerWidth <= 768) {
        const floatingButtons = document.querySelector('.floating-buttons');
        if (floatingButtons) floatingButtons.remove();
    }
});

const scrollDown = document.getElementById('scroll-down');
if (scrollDown) {
    scrollDown.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// Lazy loading for lead background
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("lead-video");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                video.setAttribute("preload", "auto");
                observer.disconnect();
            }
        });
    });
    observer.observe(video);
});

// Lead content typing effect
document.addEventListener("DOMContentLoaded", () => {
    const phrases = ["Data Engineer", "Data Analyst", "AI Engineer", "MS-MIS Grad @ Texas A&M", "DJ/Producer - @musicbytanzy"];
    const typingElement = document.getElementById("typing-effect");
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            // Remove characters
            charIndex--;
            typingElement.textContent = currentPhrase.substring(0, charIndex);
        } else {
            // Add characters
            charIndex++;
            typingElement.textContent = currentPhrase.substring(0, charIndex);
        }

        // Determine typing speed
        let typingSpeed = isDeleting ? 50 : 70;

        // When phrase is fully typed or deleted
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
});

// Dark/Light theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const navLogo = document.getElementById('nav-logo');

function updateLogo(isDark) {
    navLogo.src = isDark ? '/assets/images/portfolio-logo.png' : '/assets/images/portfolio-logo-black.png';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
    themeIcon.classList.add('fa-moon-o');
    themeIcon.classList.remove('fa-sun-o');
    updateLogo(false);
} else {
    document.body.classList.add('dark-mode');
    themeIcon.classList.add('fa-sun-o');
    themeIcon.classList.remove('fa-moon-o');
    updateLogo(true);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.classList.toggle('fa-sun-o', isDark);
    themeIcon.classList.toggle('fa-moon-o', !isDark);
    updateLogo(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Dynamic tab highlights in navbar
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 60)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Bottom navigation drop-up menu
const moreBtn = document.getElementById('more-btn');
const moreMenu = document.getElementById('more-menu');

if (moreBtn && moreMenu) {
    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moreMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
            moreMenu.classList.remove('show');
        }
    });

    moreMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            moreMenu.classList.remove('show');
        });
    });
}

// Floating Back-to-top & Resume buttons
window.addEventListener('scroll', function() {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (!floatingButtons) return;
    if (window.scrollY > 300) {
        floatingButtons.classList.add('visible');
    } else {
        floatingButtons.classList.remove('visible');
    }
});

const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Project section filters
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (filterBtns.length && projectCards.length) {
        const showCategory = (cat) => {
            projectCards.forEach(card => {
                card.classList.toggle('show', card.dataset.category === cat);
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showCategory(btn.dataset.filter);
            });
        });

        showCategory('data-engineering');
    }
});

// Collapsible Experience and Education cards
document.addEventListener('DOMContentLoaded', () => {
    function setupCollapsible(sectionSelector, cardSelector) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        const cards = section.querySelectorAll(cardSelector);
        cards.forEach(card => {
            card.addEventListener('click', () => {
                cards.forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });
                card.classList.toggle('active');
            });
        });
    }

    setupCollapsible('#experience', '.timeline-item');
    setupCollapsible('#education', '.education-block');
});
