# Requirements / 环境要求

## 中文

### 必需环境

- **Node.js**：`>= 20.9.0`
  - 这是当前项目使用的 Next.js `16.2.4` 在 `node_modules/next/package.json` 中声明的最低版本。
  - 本项目本地验证环境：Node.js `v22.15.0`。
- **npm**：建议 `>= 10`
  - 本项目本地验证环境：npm `10.9.2`。
- **操作系统**：macOS、Windows 或 Linux 均可。
- **浏览器**：建议使用最新版 Chrome、Edge、Safari 或 Firefox。

### 安装与启动

```bash
npm ci
npm run dev
```

访问：

```text
http://localhost:3000/atlas
```

### 验证命令

```bash
npm run validate:content
npm run typecheck
npm run lint
npm run build
```

### 运行时说明

- 项目当前不需要数据库。
- 项目当前不需要登录系统。
- 项目当前不需要 OpenAI、Midjourney、Stable Diffusion 等外部 AI API key。
- 视觉效果主要由 SVG、CSS animation 与本地结构化数据驱动。
- `playwright` 仅作为开发期视觉检查依赖，不是线上运行必需项。

## English

### Required Environment

- **Node.js**: `>= 20.9.0`
  - This is the minimum Node.js version declared by Next.js `16.2.4` in `node_modules/next/package.json`.
  - Locally tested with Node.js `v22.15.0`.
- **npm**: `>= 10` recommended
  - Locally tested with npm `10.9.2`.
- **OS**: macOS, Windows, or Linux.
- **Browser**: latest Chrome, Edge, Safari, or Firefox recommended.

### Install and Run

```bash
npm ci
npm run dev
```

Open:

```text
http://localhost:3000/atlas
```

### Validation

```bash
npm run validate:content
npm run typecheck
npm run lint
npm run build
```

### Runtime Notes

- No database is required.
- No authentication system is required.
- No external AI API key is required for the current version.
- Visuals are driven by SVG, CSS animation, and local structured data.
- `playwright` is used for development-time visual checks only; it is not required at runtime.
