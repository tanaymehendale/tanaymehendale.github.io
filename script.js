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

// Dynamic tab highlights in navbar (top + bottom)
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const bottomNavLinks = document.querySelectorAll('.bottom-nav > a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

        bottomNavLinks.forEach(link => {
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


// Collapsible Experience and Education cards
document.addEventListener('DOMContentLoaded', () => {
    function setupCollapsible(sectionSelector, cardSelector) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        const cards = section.querySelectorAll(cardSelector);
        cards.forEach(card => {
            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-expanded', 'false');

            const toggle = () => {
                const isActive = card.classList.contains('active');
                // Collapse all others
                cards.forEach(c => {
                    c.classList.remove('active');
                    c.setAttribute('aria-expanded', 'false');
                });
                // Toggle this one
                if (!isActive) {
                    card.classList.add('active');
                    card.setAttribute('aria-expanded', 'true');
                }
            };

            card.addEventListener('click', toggle);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    setupCollapsible('#experience', '.timeline-item');
    setupCollapsible('#education', '.education-block');
});
