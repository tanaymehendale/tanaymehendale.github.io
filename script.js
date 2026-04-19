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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
} else {
    document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Header scroll state — frosted glass after hero + pill→full-width past hero
const siteHeader = document.querySelector('header');
function updateHeaderScroll() {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    const lead = document.querySelector('#lead');
    const heroHeight = lead ? lead.offsetHeight : window.innerHeight;
    siteHeader.classList.toggle('past-hero', window.scrollY > heroHeight * 0.65);
}
window.addEventListener('scroll', updateHeaderScroll, { passive: true });
updateHeaderScroll();


// Dynamic tab highlights in navbar (top + bottom)
// Active section highlighting in desktop nav
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 80)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('href').replace(/.*#/, '');
            if (linkSection === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
});

// Full-screen mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('nav-hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    function openMenu() {
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close navigation menu');
        navOverlay.classList.add('is-open');
        navOverlay.removeAttribute('aria-hidden');
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        navOverlay.classList.remove('is-open');
        navOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) closeMenu();
    });

    // Close when a link is tapped
    navOverlay.querySelectorAll('.overlay-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});

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


// Journey section: animated spine + strip active state + scroll-to
document.addEventListener('DOMContentLoaded', () => {
    const log = document.querySelector('.journey-log');
    if (!log) return;

    const chapters = [...log.querySelectorAll('.journey-chapter')];
    const stripBtns = [...document.querySelectorAll('.strip-year')];

    // Animate spine in when log enters viewport
    const spineObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { log.classList.add('spine-active'); spineObs.disconnect(); }
    }, { threshold: 0.05 });
    spineObs.observe(log);

    // Fade-in chapters + sync active strip year
    const chapterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                stripBtns.forEach(b => {
                    const isActive = b.dataset.target === entry.target.id;
                    b.classList.toggle('active', isActive);
                    entry.target.classList.toggle('strip-active', isActive);
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '-10% 0px -50% 0px' });
    chapters.forEach(c => chapterObs.observe(c));

    // Strip button click → smooth scroll to chapter
    stripBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});
