# Slide 02: 企业 AI 落地的核心挑战 

## 布局类型: 两栏排版加底部通栏 (Two-column + Footer Bar)
- 左栏：2x2 数据卡片网格
- 右栏：大白底卡片容器，顶部包含核心洞察文字（Insight），下方包含三个痛点分析列表。
- 底部：全宽单行且字号很大的总结横幅

## 配色方案: 
- 整体背景：浅灰色 `var(--color-bg-light)`
- 点缀色：数据卡片左侧边框及数字分别沿用品牌的主次强调色（蓝、绿、紫、红）。
- 底部结论：渐变深蓝背景带白色文字。

## 动画效果:
- 标题：初始淡入并稍微下落（`translateY`）
- 左侧数据卡片：依次从缩小状态 `scale(0.9)` 缩放淡入（带 `delay`）
- 右侧大框（洞察+痛点）：统一从右侧平移 `translateX(40px)` 扫入
- 底部总结：最后由下向上 `translateY(30px)` 淡入

## 特殊元素: 
- SVG 矢量图标（警示、漏洞、隔离）。
- 右侧痛点卡片包含悬停微交互：向石水平位移 `translateX(10px)` 并加深阴影。

## 设计决策: 根据用户要求调整。核心洞察单独提炼为纯文字说明并置于右侧大框头部，三个痛点作为它的论据紧随其下。底部仅保留最核心加粗的结论句作收尾。

## CSS 类名: 
- `slide-02-header`, `slide-02-title`
- `slide-02-body`, `slide-02-left`, `slide-02-right`, `insight-pain-container`
- `data-card`, `data-number`, `data-desc`
- `insight-text-top`, `pain-points-wrapper`, `pain-point-card`
- `slide-02-footer.conclusion-only`