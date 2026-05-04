import { AppNav } from "@/components/layout/AppNav";

export default function AboutPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto min-h-screen max-w-4xl px-6 pb-16 pt-28">
        <p className="text-xs uppercase tracking-[0.36em] text-[#c8a45d]">About</p>
        <h1 className="serif-title mt-3 text-4xl text-[#f7ecd3]">这不是百科，是精神地图</h1>
        <div className="mt-7 space-y-5 text-sm leading-8 text-[#d8c8ad]">
          <p>
            「大观园情绪地图」把《红楼梦》中的空间、人物关系与命运阶段转译为一个可点击、可录屏、可扩展的 Web 体验。
          </p>
          <p>
            第一版使用 Next.js、React、TypeScript、SVG、D3 与 Framer Motion 的架构边界，内容先由本地结构化数据驱动，后续可以接入 CMS 和 AI 生成接口。
          </p>
          <p>
            本项目是文学阐释与情绪可视化作品，不替代原著阅读；章节引用和正式解读应在后续版本中继续补充来源。
          </p>
        </div>
      </main>
    </>
  );
}
