# AI 图像资产计划

首版项目先不阻塞在 AI 出图上。当前实现使用程序化 SVG 地图、CSS 纹理、金线、雾气、墨晕热力和花瓣层，已经能完成可交互 Web Demo。AI 图像更适合作为视觉增强和传播素材，在首版功能稳定后生成并替换。

当前 Atlas 主体验应继续保持程序化 SVG：章节播放、地点热力、人物小像和光影兴衰都需要精确可控。AI 图像优先服务封面、Landing 和局部纹理，不直接替代可交互地图热区。

## 需要 AI 生成的图

### 1. 小红书封面图

用途：

- 小红书封面。
- GitHub README 顶部图。
- 项目主页分享图。

画面要求：

- 深黑红背景。
- 中央是一张发光的大观园情绪地图。
- 金线标注潇湘馆、怡红院、蘅芜苑、太虚幻境。
- 局部出现竹影、红花、冷雪、紫雾、落花。
- 不要出现现代城市、真实人物脸、密集文字。

推荐尺寸：

- `1600 x 2134`，适合小红书 3:4。

推荐 prompt：

```text
An exquisite dark oriental fantasy map of the Grand View Garden from Dream of the Red Chamber, black and deep crimson background, delicate gold linework, glowing garden atlas, bamboo shadows, red flowers, pale snow garden, violet mist dream realm, falling petals, museum exhibition poster style, elegant Chinese literary atmosphere, no readable text, no people, high detail, cinematic lighting
```

### 2. Landing 背景氛围图

用途：

- 首页首屏背景。
- 可替换当前 CSS 纹理层。

画面要求：

- 深色水墨纸纹。
- 若隐若现的园林轮廓。
- 金线、薄雾、花影。
- 中央留出文字安全区。

推荐尺寸：

- `1920 x 1080`。

推荐 prompt：

```text
Dark ink wash Chinese garden atmosphere background, subtle classical garden silhouettes, deep black brown and dark red palette, delicate antique gold lines, faint mist, soft falling petals, elegant museum-like literary mood, empty center space for title text, no readable text, no characters
```

### 3. 地图底图 / 绢本纹理

用途：

- Atlas 页面底层氛围或绢本纹理。
- SVG marker、地点符号、墨晕热区和人物图层仍由代码控制。

画面要求：

- 俯视东方幻想园林或暗色绢本园林纹理。
- 不要求真实地理准确。
- 需要暗色、低对比，方便上面叠加 SVG 标签。
- 不能生成文字标签。
- 不要让建筑细节太满，避免和程序化地点符号抢戏。

推荐尺寸：

- `2400 x 1536`。

推荐 prompt：

```text
Top-down fantasy Chinese classical garden map, inspired by Grand View Garden, dark oriental aesthetic, ponds, pavilions, bamboo grove, red courtyard, snowy pale courtyard, autumn studio, dreamlike purple mist area, burial flower slope, antique gold accents, low contrast background for interactive overlay, no text, no people
```

### 4. 局部意象纹理

用途：

- 地点详情卡背景。
- 角色卡氛围。
- 时间线状态变化。

需要的小图：

- 竹影纹理：潇湘馆。
- 胭脂花影：怡红院。
- 雪色药香纹理：蘅芜苑。
- 秋风海棠：秋爽斋。
- 紫雾镜面：太虚幻境。
- 落花残月：花冢。

推荐尺寸：

- `1024 x 1024`。

## 为什么首版先不生成

- 当前核心任务是建立可运行的交互系统，图像不应该阻塞数据、组件和接口。
- 交互热区需要精确坐标，AI 底图不能直接承担点击逻辑。
- 程序化 SVG 更容易调试、响应式适配和做时间线状态变化。
- AI 图适合在项目可运行后做视觉替换，这样更容易判断生成图是否真的服务体验。

## 接入方式

推荐目录：

```text
public/
  images/
    cover-xiaohongshu.webp
    landing-atmosphere.webp
    garden-map-base.webp
  textures/
    bamboo-shadow.webp
    rouge-flower.webp
    pale-snow.webp
    autumn-begonia.webp
    purple-mist.webp
    fallen-flower.webp
```

接入原则：

- 背景图只作为视觉层。
- 地图点击点、标签、情绪光晕仍由 SVG 数据驱动。
- 所有图像压缩为 WebP / AVIF。
- Landing 背景需要保留文字安全区。
