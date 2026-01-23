document.addEventListener('DOMContentLoaded', function () {
    function initializeCarousel(carouselId) {
        const carouselContainer = document.getElementById(`carousel-${carouselId}`);
        const prevBtn = document.getElementById(`prev-btn-${carouselId}`);
        const nextBtn = document.getElementById(`next-btn-${carouselId}`);
        if (!carouselContainer || !prevBtn || !nextBtn) return;
        const slides = carouselContainer.children;
        const totalSlides = slides.length;
        let currentIndex = 0;
        Array.from(slides).forEach(slide => slide.classList.add('cursor-pointer'));
        function updateCarousel() {
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    for (let i = 1; i <= 11; i++) initializeCarousel(i);

    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const prevModalBtn = document.getElementById('prev-modal');
    const nextModalBtn = document.getElementById('next-modal');

    let currentGroupImages = [];
    let currentImageIndex = 0;

    function openModal(src) {
        modalImage.src = src;
        imageModal.classList.remove('hidden');
    }

    function updateModalImage() {
        if (currentGroupImages.length > 0) {
            modalImage.src = currentGroupImages[currentImageIndex];
            modalImage.classList.remove('zoomed'); // Quitar zoom al cambiar
        }
    }

    function closeModal() {
        imageModal.classList.add('hidden');
        modalImage.classList.remove('zoomed');
        modalImage.src = '';
    }

    // Seleccionar todas las imágenes dentro de los carruseles
    const carouselImages = document.querySelectorAll('[id^="carousel-"] img');
    
    carouselImages.forEach(img => {
        img.addEventListener('click', () => {
            // Encontrar el carrusel padre para obtener el grupo de imágenes
            const parentCarousel = img.closest('[id^="carousel-"]');
            if (parentCarousel) {
                const images = parentCarousel.querySelectorAll('img');
                currentGroupImages = Array.from(images).map(i => i.src);
                currentImageIndex = currentGroupImages.indexOf(img.src);
                openModal(img.src);
            }
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modalContent.addEventListener('click', (e) => { if (e.target === modalContent) closeModal(); });
    modalImage.addEventListener('click', (e) => { e.stopPropagation(); modalImage.classList.toggle('zoomed'); });
    
    // Eventos para botones de navegación del modal
    if (prevModalBtn) prevModalBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(-1); });
    if (nextModalBtn) nextModalBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal(1); });

    function navigateModal(direction) {
        if (currentGroupImages.length > 0) {
            currentImageIndex = (currentImageIndex + direction + currentGroupImages.length) % currentGroupImages.length;
            updateModalImage();
        }
    }

    document.addEventListener('keydown', (e) => { 
        if (imageModal && !imageModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateModal(-1);
            if (e.key === 'ArrowRight') navigateModal(1);
        }
    });

    // Lógica de filtrado de proyectos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mobileFilterSelect = document.getElementById('mobile-filter-select');
    const projects = document.querySelectorAll('.project-item');

    function applyFilter(filterValue) {
        projects.forEach(project => {
            if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                project.classList.remove('hidden');
                project.classList.add('flex');
            } else {
                project.classList.add('hidden');
                project.classList.remove('flex');
            }
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar estilos de botones
            filterButtons.forEach(b => {
                b.classList.remove('bg-white', 'text-black');
                b.classList.add('bg-transparent', 'text-white');
            });
            btn.classList.remove('bg-transparent', 'text-white');
            btn.classList.add('bg-white', 'text-black');

            const filterValue = btn.getAttribute('data-filter');
            applyFilter(filterValue);
            
            // Sincronizar select móvil
            if (mobileFilterSelect) {
                mobileFilterSelect.value = filterValue;
            }
        });
    });

    if (mobileFilterSelect) {
        mobileFilterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            applyFilter(filterValue);

            // Sincronizar botones de escritorio
            filterButtons.forEach(b => {
                if (b.getAttribute('data-filter') === filterValue) {
                    b.classList.remove('bg-transparent', 'text-white');
                    b.classList.add('bg-white', 'text-black');
                } else {
                    b.classList.remove('bg-white', 'text-black');
                    b.classList.add('bg-transparent', 'text-white');
                }
            });
        });
    }
});