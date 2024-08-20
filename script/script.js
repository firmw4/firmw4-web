document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('nav ul li a');
    const slides = document.querySelectorAll('.slide');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSlide = document.getElementById(targetId);

            slides.forEach(slide => {
                slide.classList.remove('active');
            });

            targetSlide.classList.add('active');
        });
    });

    // Set the first slide as active on load
    slides[0].classList.add('active');
});