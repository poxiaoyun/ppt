/* =========================================
   核心缩放逻辑与初始化 (app.js)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('viewport');
    
    const TARGET_WIDTH = 1920;
    const TARGET_HEIGHT = 1080;

    /**
     * 根据窗口大小缩放画布，保持 16:9 比例
     */
    function scaleViewport() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 计算 X 和 Y 方向的缩放比例
        const scaleX = windowWidth / TARGET_WIDTH;
        const scaleY = windowHeight / TARGET_HEIGHT;
        
        // 取较小的值以确保完整显示
        let scale = Math.min(scaleX, scaleY);
        
        // 应用缩放
        viewport.style.transform = `scale(${scale})`;
    }

    /**
     * 根据实际卡片位置重新计算 Slide 09 的数据流路径
     */
    function updateSlide09Connections() {
        const slide = document.getElementById('slide-9');
        if (!slide) return;

        const stage = slide.querySelector('.slide-09-stage');
        const svg = slide.querySelector('.slide-09-connection-lines svg');
        const orb = slide.querySelector('.slide-09-core-orb');
        const clientCards = slide.querySelectorAll('.slide-09-client-card');
        const modelCards = slide.querySelectorAll('.slide-09-model-group');

        if (!stage || !svg || !orb || clientCards.length !== 4 || modelCards.length !== 3) {
            return;
        }

        const svgRect = svg.getBoundingClientRect();
        const orbRect = orb.getBoundingClientRect();
        const orbCenterX = orbRect.left - svgRect.left + orbRect.width / 2;
        const orbCenterY = orbRect.top - svgRect.top + orbRect.height / 2;
        const orbRadiusX = orbRect.width / 2;

        const leftTargets = [-74, -28, 26, 78];
        const rightTargets = [-50, 0, 50];
        const pathIds = [
            'slide-09-path-agent',
            'slide-09-path-robot',
            'slide-09-path-vibe',
            'slide-09-path-driving',
            'slide-09-path-provider',
            'slide-09-path-rune-service',
            'slide-09-path-small-model'
        ];

        function setPath(id, d) {
            const path = svg.querySelector(`#${id}`);
            if (path) {
                path.setAttribute('d', d);
            }
        }

        clientCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const startX = rect.right - svgRect.left + 8;
            const startY = rect.top - svgRect.top + rect.height / 2;
            const endX = orbCenterX - orbRadiusX + 10;
            const endY = orbCenterY + leftTargets[index];
            const cp1X = startX + 72;
            const cp2X = endX - 88;
            const d = `M ${startX} ${startY} C ${cp1X} ${startY}, ${cp2X} ${endY}, ${endX} ${endY}`;
            setPath(pathIds[index], d);
        });

        modelCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const startX = orbCenterX + orbRadiusX - 10;
            const startY = orbCenterY + rightTargets[index];
            const endX = rect.left - svgRect.left - 8;
            const endY = rect.top - svgRect.top + rect.height / 2;
            const cp1X = startX + 88;
            const cp2X = endX - 72;
            const d = `M ${startX} ${startY} C ${cp1X} ${startY}, ${cp2X} ${endY}, ${endX} ${endY}`;
            setPath(pathIds[4 + index], d);
        });
    }

    // 初始化缩放
    scaleViewport();
    window.requestAnimationFrame(updateSlide09Connections);

    // 监听窗口尺寸变化
    window.addEventListener('resize', () => {
        // 利用 requestAnimationFrame 优化性能
        window.requestAnimationFrame(() => {
            scaleViewport();
            updateSlide09Connections();
        });
    });

    window.addEventListener('load', updateSlide09Connections);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateSlide09Connections).catch(() => {});
    }

    // 监听全屏按钮
    const btnFullscreen = document.getElementById('btn-fullscreen');
    btnFullscreen.addEventListener('click', toggleFullScreen);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`尝试启动全屏模式失败: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
});
