export function Atmosphere({ quiet = false }: { quiet?: boolean }) {
  const petals = Array.from({ length: quiet ? 9 : 18 }, (_, index) => index);
  const goldDust = Array.from({ length: quiet ? 18 : 34 }, (_, index) => index);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.13] mix-blend-screen [background-image:radial-gradient(circle_at_1px_1px,rgba(246,232,200,0.42)_1px,transparent_0)] [background-size:9px_9px]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(200,164,93,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(200,164,93,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-[-12%] top-24 h-44 opacity-25 blur-[1px]">
        <div className="guofeng-cloud h-full w-[140%] [background-image:radial-gradient(ellipse_at_12%_48%,rgba(246,232,200,0.22)_0,rgba(246,232,200,0.08)_18%,transparent_36%),radial-gradient(ellipse_at_42%_54%,rgba(111,168,166,0.18)_0,rgba(111,168,166,0.06)_22%,transparent_42%),radial-gradient(ellipse_at_76%_46%,rgba(200,164,93,0.18)_0,rgba(200,164,93,0.06)_20%,transparent_40%)]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0,rgba(13,11,10,0.12)_40%,rgba(13,11,10,0.72)_100%)]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#6fa8a61c] blur-3xl" />
      <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-[#8b1e1e2e] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8d72b826] blur-3xl" />
      {goldDust.map((item) => (
        <span
          key={`dust-${item}`}
          className="guofeng-dust absolute block rounded-full bg-[#d6b76d]"
          style={{
            left: `${4 + ((item * 23) % 94)}%`,
            top: `${8 + ((item * 31) % 78)}%`,
            width: `${1 + (item % 3)}px`,
            height: `${1 + (item % 3)}px`,
            opacity: 0.1 + (item % 5) * 0.035,
            animationDelay: `${item * 180}ms`,
          }}
        />
      ))}
      {!quiet &&
        petals.map((item) => (
          <span
            key={item}
            className="absolute block h-2 w-1 rounded-full bg-[#c9a0a8]"
            style={{
              left: `${8 + ((item * 17) % 88)}%`,
              top: `${-10 - item * 3}%`,
              opacity: 0.18 + (item % 4) * 0.08,
              transform: `rotate(${item * 19}deg)`,
              animation: `petal-fall ${14 + (item % 5) * 3}s linear ${item * 0.7}s infinite`,
            }}
          />
        ))}
      <style>{`
        @keyframes petal-fall {
          0% { translate: 0 -10vh; rotate: 0deg; }
          50% { translate: 24px 55vh; rotate: 120deg; }
          100% { translate: -18px 115vh; rotate: 260deg; }
        }
      `}</style>
    </div>
  );
}
