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



// // Contact Form
// document.getElementById('contact-form').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value.trim();
//     const subject = document.getElementById('subject').value.trim();
//     const message = document.getElementById('message').value.trim();

//     if (!email) {
//         alert('Please fill in your email');
//         return;
//     }
//     if (!subject) {
//         alert('Please fill in subject of the message');
//         return;
//     }
//     if (!message) {
//         alert('Please type in your message');
//         return;
//     }

//     const templateParams = {
//         from_email: email,
//         to_email: 'tanaymehendale@gmail.com',
//         subject: subject,
//         message: message
//     };
    
//     // EmailJS Service Added
//     emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams) // params - serviceKey, templateKey
//         .then(function(response) {
//             alert('Message sent successfully!');
//             document.getElementById('contact-form').reset();
//         }, function(error) {
//             alert('Failed to send message. Please try again.');
//         });
// });
