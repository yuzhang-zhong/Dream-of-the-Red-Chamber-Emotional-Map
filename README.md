# 红楼梦情绪地景图

**Dream of the Red Chamber Emotional Landscape**

一个用空间视角阅读《红楼梦》的交互式 Web 项目。它将 120 回章节、贾府空间、人物出现与情绪热度组织成一张可以播放、暂停、拖动和探索的文学地景图。

这个项目不是传统的百科页或人物关系图，而是尝试回答一个问题：如果经典小说不只是一条情节线，而是一套空间系统，我们能不能看见爱、秩序、权力、衰败与命运如何在不同地点之间流动？

## 核心功能

- **章节播放**：拖动或播放 1-120 回，观察地点热度随章节变化。
- **空间热力**：潇湘馆、怡红院、蘅芜苑、荣国府权力中枢、太虚幻境等地点会根据章节与人物出现发光。
- **人物出现**：每一回显示对应人物，并将人物放置到相关地点。
- **地点简介**：点击地点查看精炼的文学解释、情绪含义与命运注释。
- **热点分析**：查看当前章节最重要的发光地点和关联人物。
- **人物去向**：查看主要人物更常出现在哪些空间，以及关键章节。
- **视觉氛围**：使用 SVG、CSS 动画和光影层表现季节符号、兴衰渐变与重要章节特效。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- D3.js
- Framer Motion
- Lucide React
- SVG / CSS animation

## 本地运行

请先确认环境满足 [REQUIREMENTS.md](./REQUIREMENTS.md)。

```bash
npm ci
npm run dev
```

打开：

```text
http://localhost:3000/atlas
```

## 常用命令

```bash
npm run dev              # 启动本地开发服务器
npm run build            # 生产构建
npm run start            # 启动生产构建后的服务
npm run lint             # ESLint 检查
npm run typecheck        # TypeScript 类型检查
npm run validate:content # 校验章节、人物、地点与关系数据
```

## 数据结构

主要内容数据位于：

- `src/data/atlas.ts`：地点、人物、关系、时间线基础数据
- `src/data/chapter-titles.ts`：120 回章节标题
- `src/data/chapter-appearances.ts`：章节人物出现与地点对应
- `src/data/chapter-seasons.ts`：章节季节氛围推断

## 项目理念

《红楼梦》中的空间从来不是中性的背景。贾府、大观园、潇湘馆、怡红院、太虚幻境等地点，都在承载不同的人际结构、情绪压力和命运暗示。

这个项目用交互式可视化把这些结构显影：用户不是阅读一份解释，而是在章节流动中看见空间如何被人物点亮，又如何随着家族秩序的衰败逐渐变暗。

---

# Dream of the Red Chamber Emotional Landscape

An interactive web project for reading *Dream of the Red Chamber* through space. It maps the novel's 120 chapters, Jia family spaces, character appearances, and emotional intensity into a playable literary landscape.

Rather than presenting the novel as a static encyclopedia or a character relationship chart, this project explores one question: what if a classic novel could also be read as a spatial system?

## Features

- **Chapter playback**: play, pause, or scrub through chapters 1-120.
- **Spatial heat map**: key locations glow according to chapter-level narrative heat and character appearances.
- **Character appearances**: characters appear at their corresponding locations for each chapter.
- **Location summaries**: click a place to read a concise literary interpretation and emotional note.
- **Hotspot analysis**: inspect the most active locations and mentioned characters in the current chapter.
- **Character lens**: explore where major characters appear most often and which chapters define their paths.
- **Visual atmosphere**: SVG and CSS-based light effects, seasonal symbols, rise-and-decline color transitions, and cinematic chapter highlights.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- D3.js
- Framer Motion
- Lucide React
- SVG / CSS animation

## Run Locally

Check [REQUIREMENTS.md](./REQUIREMENTS.md) first.

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:3000/atlas
```

## Why This Project

In *Dream of the Red Chamber*, space is never just background. The Jia family compound, the Grand View Garden, Xiaoxiang Pavilion, Yihong Courtyard, and the Illusory Realm all carry emotional pressure, social hierarchy, memory, decline, and fate.

This project makes that structure visible through interaction: as chapters move forward, users can watch how places light up, how characters gather or disperse, and how the emotional geography of the novel changes over time.
