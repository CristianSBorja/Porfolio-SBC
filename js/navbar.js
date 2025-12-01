document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = menuBtn.querySelector('svg');

    function toggleMenu() {
        const isMenuOpen = !mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');

        // Cambia el ícono de hamburguesa a una 'X' y viceversa
        if (isMenuOpen) {
            menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />`;
        } else {
            menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Cierra el menú cuando se hace clic en un enlace
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
});
