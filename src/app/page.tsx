import Link from "next/link";
import { ArrowRight, VolumeX } from "lucide-react";
import { Atmosphere } from "@/components/visual-effects/Atmosphere";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Atmosphere />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm uppercase tracking-[0.42em] text-[#c8a45d]">
            Dream of the Red Chamber Emotional Landscape
          </p>
          <h1 className="serif-title text-balance-safe text-5xl leading-tight text-[#f7ecd3] sm:text-7xl">
            贾府不是宅院。
          </h1>
          <p className="serif-title mt-7 max-w-2xl text-2xl leading-relaxed text-[#dfd1bb] sm:text-3xl">
            它是一套由爱、秩序、权力、孤独与命运构成的情绪系统。
          </p>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#b9aa93]">
            拖动一百二十回章节，观看人物如何在潇湘馆、怡红院、荣国府与太虚幻境之间被空间缓慢改写。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/atlas"
              className="gold-button inline-flex h-12 items-center justify-center gap-2 rounded px-6 text-sm font-medium"
            >
              进入情绪地图
              <ArrowRight size={17} />
            </Link>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded border border-[#c8a45d26] bg-[#0d0b0a88] px-6 text-sm text-[#cdbf9f]">
              <VolumeX size={16} />
              声音默认关闭
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 right-6 hidden w-72 border-l border-[#c8a45d44] pl-5 text-sm leading-7 text-[#b9aa93] md:block">
          我把《红楼梦》做成了一张情绪地图：
          <br />
          贾府不是宅院，而是一张命运地景。
        </div>
      </section>
    </main>
  );
}
