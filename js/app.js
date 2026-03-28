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

    // 初始化缩放
    scaleViewport();

    // 监听窗口尺寸变化
    window.addEventListener('resize', () => {
        // 利用 requestAnimationFrame 优化性能
        window.requestAnimationFrame(scaleViewport);
    });

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