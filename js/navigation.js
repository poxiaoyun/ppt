/* =========================================
   导航逻辑 (翻页、键盘控制、进度条、hash 路由) (navigation.js)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    // UI 元素
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progressBar = document.getElementById('progress-bar');
    const pageCounter = document.getElementById('current-page');
    const elTotalPages = document.getElementById('total-pages');
    const slideTitle = document.getElementById('slide-title');

    elTotalPages.textContent = totalSlides;

    function ensureSlideWatermarks() {
        slides.forEach((slide) => {
            if (slide.classList.contains('no-watermark') || slide.querySelector('.slide-watermark')) {
                return;
            }

            const watermark = document.createElement('div');
            watermark.className = 'slide-watermark';
            watermark.innerHTML = `
                <img src="assets/images/logo.png" alt="Rune AI Logo" onerror="this.style.display='none'">
                <span>晓石云</span>
            `;
            slide.appendChild(watermark);
        });
    }

    /**
     * 更新幻灯片状态
     */
    function updateSlide(index) {
        // 边界检查
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        // 更新前后样式 (为过渡动画做准备)
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'past');
            if (i < index) {
                slide.classList.add('past');
            }
        });

        // 激活当前页
        slides[index].classList.add('active');
        currentSlideIndex = index;

        document.querySelectorAll('.slide-watermark').forEach((watermark) => {
            watermark.classList.toggle('on-dark', slides[index].classList.contains('theme-dark'));
        });

        // 更新 UI
        pageCounter.textContent = index + 1;
        progressBar.style.width = `${((index + 1) / totalSlides) * 100}%`;
        
        const title = slides[index].getAttribute('data-title');
        slideTitle.textContent = title ? title : `Slide ${index + 1}`;

        // 更新 URL Hash
        window.location.hash = `slide-${index + 1}`;
    }

    /**
     * 下一页
     */
    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            updateSlide(currentSlideIndex + 1);
        }
    }

    /**
     * 上一页
     */
    function prevSlide() {
        if (currentSlideIndex > 0) {
            updateSlide(currentSlideIndex - 1);
        }
    }

    // 绑定按钮事件
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // 绑定键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // 处理触摸滑动 (移动端)
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const threshold = 50; // 滑动阈值
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // 向左滑 -> 下一页
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide(); // 向右滑 -> 上一页
        }
    }

    // 初始路由检查 (允许直接打开 #slide-N 跳转)
    function initFromHash() {
        if (window.location.hash) {
            const match = window.location.hash.match(/slide-(\d+)/);
            if (match && match[1]) {
                const targetIndex = parseInt(match[1]) - 1;
                if (targetIndex >= 0 && targetIndex < totalSlides) {
                    updateSlide(targetIndex);
                    return;
                }
            }
        }
        updateSlide(0); // 默认第一页
    }

    ensureSlideWatermarks();
    initFromHash();
});
