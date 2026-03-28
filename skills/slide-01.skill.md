# Slide 01: 封面 (Cover)

## 布局类型: 绝对居中 (Centered)，左上角预留 Logo
## 配色方案: 纯白背景 (`var(--color-bg-white)`) 配合微弱的品牌蓝扩散光晕。主文字品牌蓝到深灰渐变。辅文字灰色。
## 字体大小: 
- 预留Logo: 左上角绝对定位 (24px 虚线框占位)
- 主标题: 82px, 粗体 800, 渐变色填充 (`var(--color-primary)` 至 `#0A1128`)
- 副标题: 36px, 常规 400, 灰色 (`var(--color-text-muted)`)
- 底部公司及演讲者信息: 24px / 20px, 淡灰色
## 动画效果:
- 页面背景：持续的 perspective 下缓慢流动的无尽网格动画 (`grid-slide`)。线条改为浅蓝色 `rgba(30, 96, 248, 0.08)`。
- 入场错帧动画（Fade up / Fade right）：
  - Logo：从左侧滑入，延迟 0.3s
  - 标题：延迟 0.5s
  - 副标题：延迟 0.7s
  - 底部信息：延迟 0.9s
## 特殊元素: 
- 纯 CSS 背景网格生成，避免加载额外图片；利用 `radial-gradient` 增加中心光晕，模拟"智算"能量。
- 新增 `slide-01-logo` 占位框。
## 设计决策: 基于用户需求，将原本深色背景改成白色系科技感背景。添加了 Logo 预留占位。
## CSS 类名: 
- `slide-01-logo`
- `slide-01-content`
- `slide-01-title`
- `slide-01-subtitle`
- `slide-01-footer`