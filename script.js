document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.back-to-top a').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#lead').scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.querySelector('#scroll-down').addEventListener('click', function(event) {
    event.preventDefault();
    window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
    });
});

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
    const phrases = ["Data Engineer", "Data Analyst", "Business Analyst", "MS-MIS Grad @ Texas A&M", "DJ/Producer - @musicbytanzy"];
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

// Navbar Responsiveness

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Dark/Light theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon-o', 'fa-sun-o');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.classList.toggle('fa-sun-o', isDark);
    themeIcon.classList.toggle('fa-moon-o', !isDark);
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


// Floating Back-to-top & Resume buttons
window.addEventListener('scroll', function() {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (window.scrollY > 300) {
        floatingButtons.classList.add('visible');
    } else {
        floatingButtons.classList.remove('visible');
    }
});

document.querySelector('.scroll-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});