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

    for (let i = 1; i <= 6; i++) initializeCarousel(i);

    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const carouselImages = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-2 .w-full.h-96 img');

    function openModal(src) {
        modalImage.src = src;
        imageModal.classList.remove('hidden');
    }
    function closeModal() {
        imageModal.classList.add('hidden');
        modalImage.classList.remove('zoomed');
        modalImage.src = '';
    }
    carouselImages.forEach(img => img.addEventListener('click', () => openModal(img.src)));
    closeModalBtn.addEventListener('click', closeModal);
    modalContent.addEventListener('click', (e) => { if (e.target === modalContent) closeModal(); });
    modalImage.addEventListener('click', (e) => { e.stopPropagation(); modalImage.classList.toggle('zoomed'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && imageModal && !imageModal.classList.contains('hidden')) closeModal(); });
});