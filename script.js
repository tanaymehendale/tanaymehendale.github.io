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


document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!email) {
        alert('Please fill in your email');
        return;
    }
    if (!subject) {
        alert('Please fill in subject of the message');
        return;
    }
    if (!message) {
        alert('Please type in your message');
        return;
    }

    const templateParams = {
        from_email: email,
        to_email: 'tanaymehendale@gmail.com',
        subject: subject,
        message: message
    };
    
    // EmailJS Service Added
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams) // params - serviceKey, templateKey
        .then(function(response) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
        }, function(error) {
            alert('Failed to send message. Please try again.');
        });
});
