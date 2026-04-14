# GSAP Motion Lab

一个基于 `React + Vite + TypeScript + GSAP` 的交互 demo 仓库，用来快速预览 **常见滚动特效** 和 **鼠标交互特效**。

## 包含的 demo

### 滚动特效
- **Parallax Hero**：分层视差滚动
- **Text Reveal**：文案分段进场
- **Pinned Storytelling**：固定舞台 + 卡片切换
- **Horizontal Gallery**：纵向滚动驱动横向长廊

### 鼠标特效
- **Cursor Follower**：自定义跟随光标
- **Magnetic Buttons**：磁吸按钮
- **3D Tilt Cards**：鼠标倾斜卡片
- **Spotlight Surface**：跟随鼠标的局部高光

## 启动方式

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 技术栈

- `React 19`
- `Vite 8`
- `TypeScript 6`
- `GSAP 3`
- `ScrollTrigger`
- `lucide-react`

## 适合怎么用

如果你想从这些 demo 里挑方案，建议这样看：

- **SaaS / AI 首页**：优先看 `Parallax Hero` + `Text Reveal` + `Magnetic Buttons`
- **作品集 / 案例页**：优先看 `Horizontal Gallery` + `3D Tilt Cards`
- **产品叙事页**：优先看 `Pinned Storytelling`

## 备注

这个项目刻意选用了 **可直接落地到业务页面** 的动画结构，而不是只追求炫技。你可以在 `src/App.tsx` 里很快替换文案、面板和卡片数据，把它改成自己的展示页。
