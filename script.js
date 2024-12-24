document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.back-to-top a').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#lead').scrollIntoView({
            behavior: 'smooth'
        });
    });
});
