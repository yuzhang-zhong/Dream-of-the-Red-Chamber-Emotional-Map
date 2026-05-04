"use client";

import type { CharacterSummary, LocationViewModel } from "@/contracts/atlas";
import { getChapterSeason } from "@/data/chapter-seasons";
import { getLocationHeatAtChapter } from "@/lib/atlas";

const cinematicChapterEffects: Record<
  number,
  {
    name: string;
    color: string;
    secondary: string;
    opacity: number;
    center: { x: number; y: number };
    mood: "dream" | "entrance" | "banquet" | "poetry" | "flower" | "raid" | "ending";
  }
> = {
  1: {
    name: "通灵初现",
    color: "#8D72B8",
    secondary: "#D6B76D",
    opacity: 0.48,
    center: { x: 680, y: 480 },
    mood: "dream",
  },
  3: {
    name: "黛玉入府",
    color: "#6FA8A6",
    secondary: "#C8A45D",
    opacity: 0.42,
    center: { x: 820, y: 170 },
    mood: "entrance",
  },
  11: {
    name: "寿宴群场",
    color: "#C8A45D",
    secondary: "#8B1E1E",
    opacity: 0.52,
    center: { x: 820, y: 170 },
    mood: "banquet",
  },
  18: {
    name: "省亲极盛",
    color: "#D6B76D",
    secondary: "#8B1E1E",
    opacity: 0.54,
    center: { x: 820, y: 170 },
    mood: "banquet",
  },
  27: {
    name: "葬花春尽",
    color: "#C9A0A8",
    secondary: "#6FA8A6",
    opacity: 0.5,
    center: { x: 340, y: 493 },
    mood: "flower",
  },
  37: {
    name: "诗社初光",
    color: "#C8A45D",
    secondary: "#6FA8A6",
    opacity: 0.46,
    center: { x: 510, y: 288 },
    mood: "poetry",
  },
  55: {
    name: "探春理家",
    color: "#D98A4E",
    secondary: "#8B1E1E",
    opacity: 0.44,
    center: { x: 740, y: 365 },
    mood: "raid",
  },
  74: {
    name: "抄检大观",
    color: "#8B1E1E",
    secondary: "#D6B76D",
    opacity: 0.56,
    center: { x: 820, y: 170 },
    mood: "raid",
  },
  97: {
    name: "错婚病影",
    color: "#6FA8A6",
    secondary: "#C9A0A8",
    opacity: 0.5,
    center: { x: 250, y: 230 },
    mood: "flower",
  },
  120: {
    name: "梦醒归幻",
    color: "#8D72B8",
    secondary: "#D8D2C4",
    opacity: 0.62,
    center: { x: 680, y: 480 },
    mood: "ending",
  },
};

function getCinematicChapterEffect(chapter: number) {
  return cinematicChapterEffects[Math.round(chapter)] ?? null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);

  return x * x * (3 - 2 * x);
}

function getRiseFallTone(chapter: number) {
  const springRise = smoothstep(1, 38, chapter);
  const goldenPeak = smoothstep(12, 46, chapter) * (1 - smoothstep(52, 82, chapter));
  const decline = smoothstep(58, 120, chapter);
  const lateDark = smoothstep(82, 120, chapter);

  return {
    brightness: 0.75 + springRise * 0.28 + goldenPeak * 0.08 - decline * 0.24,
    saturation: 0.84 + springRise * 0.2 + goldenPeak * 0.12 - lateDark * 0.22,
    contrast: 0.95 + goldenPeak * 0.08 + lateDark * 0.16,
    warmthOpacity: 0.04 + goldenPeak * 0.18 + springRise * 0.04,
    dawnOpacity: 0.14 * (1 - springRise),
    duskOpacity: 0.04 + decline * 0.2,
    edgeOpacity: 0.16 + lateDark * 0.2,
    inkOpacity: lateDark * 0.14,
  };
}

function CinematicChapterLight({ chapter }: { chapter: number }) {
  const effect = getCinematicChapterEffect(chapter);

  if (!effect) {
    return null;
  }

  const { center, color, secondary, opacity, mood } = effect;
  const isHardLight = mood === "raid";
  const isBanquet = mood === "banquet";
  const isDream = mood === "dream" || mood === "ending";
  const isFlower = mood === "flower";
  const particleCount = isBanquet ? 18 : isFlower ? 16 : isDream ? 14 : 10;
  const captionY = isHardLight ? center.y + 154 : center.y - (isBanquet ? 132 : 98);

  return (
    <g className={`cinematic-light cinematic-${mood}`} pointerEvents="none" opacity={opacity}>
      <circle cx={center.x} cy={center.y} r={isDream ? 220 : 184} fill={color} opacity="0.24" filter="url(#cinemaBlur)" />
      <circle cx={center.x} cy={center.y} r={isBanquet ? 118 : 92} fill="none" stroke={secondary} strokeWidth="2" strokeOpacity="0.42" strokeDasharray={isHardLight ? "18 8" : "5 10"} />
      <circle cx={center.x} cy={center.y} r={isDream ? 62 : 44} fill={secondary} opacity={isBanquet ? 0.14 : 0.1} filter="url(#softGlow)" />

      {isHardLight && (
        <g stroke={secondary} strokeLinecap="round" strokeOpacity="0.28">
          <path d={`M ${center.x - 210} 32 L ${center.x + 36} ${center.y + 36}`} strokeWidth="9" />
          <path d={`M ${center.x - 90} 38 L ${center.x + 160} ${center.y + 86}`} strokeWidth="5" />
          <path d={`M ${center.x + 130} 26 L ${center.x - 90} ${center.y + 122}`} strokeWidth="4" />
        </g>
      )}

      {isBanquet && (
        <g fill={secondary} opacity="0.34">
          {[0, 1, 2, 3, 4].map((item) => (
            <path
              key={item}
              d={`M ${center.x - 150 + item * 68} ${center.y - 116} C ${center.x - 120 + item * 62} ${center.y - 74}, ${center.x - 82 + item * 58} ${center.y + 42}, ${center.x - 52 + item * 64} ${center.y + 108}`}
              stroke={secondary}
              strokeWidth="3"
              fill="none"
              strokeOpacity="0.28"
            />
          ))}
        </g>
      )}

      {isDream && (
        <g stroke={secondary} fill="none" strokeOpacity="0.34">
          <path d={`M ${center.x - 138} ${center.y + 8} C ${center.x - 42} ${center.y - 92}, ${center.x + 72} ${center.y + 112}, ${center.x + 166} ${center.y - 4}`} />
          <path d={`M ${center.x - 96} ${center.y - 46} C ${center.x - 12} ${center.y + 38}, ${center.x + 98} ${center.y - 86}, ${center.x + 154} ${center.y + 54}`} />
        </g>
      )}

      {Array.from({ length: particleCount }).map((_, index) => {
        const angle = (index / particleCount) * Math.PI * 2;
        const radius = 58 + (index % 5) * 27;
        const px = center.x + Math.cos(angle) * radius;
        const py = center.y + Math.sin(angle) * radius * 0.62;

        return (
          <circle
            key={`${effect.name}-${index}`}
            cx={px}
            cy={py}
            r={isFlower ? 3 + (index % 3) : 2 + (index % 2)}
            fill={index % 2 ? color : secondary}
            opacity={0.32 + (index % 4) * 0.08}
            className="cinematic-particle"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        );
      })}

      <text
        x={center.x}
        y={captionY}
        textAnchor="middle"
        className="map-text-shadow serif-title cinematic-caption"
        fill="#F4E3BF"
        fontSize="13"
        opacity="0.68"
      >
        {effect.name}
      </text>
    </g>
  );
}

function CharacterSprite({
  character,
  x,
  y,
  opacity,
  index,
}: {
  character: CharacterSummary;
  x: number;
  y: number;
  opacity: number;
  index: number;
}) {
  const robe = character.color;
  const dark = "#120c0a";
  const gold = "#D6B76D";

  return (
    <g
      transform={`translate(${x} ${y})`}
      opacity={opacity}
      pointerEvents="none"
      style={{ transition: "opacity 360ms ease" }}
    >
      <g className="character-sprite" style={{ animationDelay: `${index * 90}ms` }}>
        <ellipse cx="0" cy="31" rx="18" ry="5" fill="#0d0b0a" opacity="0.58" />
        <circle cx="0" cy="0" r="31" fill="#0d0b0a" opacity="0.38" />
        <circle className="character-aura" cx="0" cy="2" r="24" fill={character.color} opacity="0.1" filter="url(#softGlow)" />
        <circle cx="0" cy="-19" r="8" fill="#E8C9A7" stroke={gold} strokeOpacity="0.35" />
        <path d="M -8 -22 Q 0 -34 8 -22" fill={dark} />
        <path d="M -15 28 Q 0 -9 15 28 Z" fill={robe} stroke="#F4E3BF" strokeOpacity="0.22" />
        <path d="M -8 -9 Q 0 4 8 -9" fill="#f4ead433" />

        {character.id === "lin-daiyu" && (
          <g>
            <path d="M -18 -24 C -30 -34, -22 -4, -30 10" stroke="#6FA8A6" strokeWidth="2" fill="none" />
            <path d="M -24 -18 C -34 -24, -34 -8, -24 -12" fill="#6FA8A6" opacity="0.72" />
            <circle cx="8" cy="-13" r="1.6" fill="#6FA8A6" />
          </g>
        )}

        {character.id === "jia-baoyu" && (
        <g>
          <circle cx="0" cy="5" r="4" fill="#D8D2C4" stroke={gold} />
          <path d="M -10 -31 L 10 -31" stroke="#C76B7A" strokeWidth="3" strokeLinecap="round" />
        </g>
        )}

        {character.id === "xue-baochai" && (
        <g>
          <circle cx="0" cy="6" r="4" fill={gold} />
          <path d="M -15 -25 Q 0 -36 15 -25" stroke="#D8D2C4" strokeWidth="2" fill="none" />
        </g>
        )}

        {character.id === "wang-xifeng" && (
        <g>
          <path d="M -13 -30 L 0 -40 L 13 -30" fill="none" stroke={gold} strokeWidth="2.5" />
          <path d="M -17 8 L -29 -1 M 17 8 L 29 -1" stroke="#B94B3F" strokeWidth="2" />
        </g>
        )}

        {character.id === "jia-tanchun" && (
        <g>
          <rect x="10" y="-2" width="13" height="20" rx="2" fill="#D98A4E" stroke={gold} strokeOpacity="0.5" />
          <path d="M -17 5 L -28 15" stroke="#D98A4E" strokeWidth="2" />
        </g>
        )}

        {character.id === "shi-xiangyun" && (
        <g>
          <path d="M -16 -27 Q 0 -41 16 -27" stroke={gold} strokeWidth="2" fill="none" />
          <circle cx="-12" cy="-27" r="3" fill={gold} />
          <circle cx="12" cy="-27" r="3" fill={gold} />
        </g>
        )}

        {character.id === "li-wan" && (
        <g>
          <path d="M -18 -4 L -28 21 M -10 -1 L -20 24" stroke="#A8A36D" strokeWidth="2" />
          <path d="M -25 11 L -16 7 M -18 18 L -8 14" stroke="#D6B76D" />
        </g>
        )}

        {character.id === "qingwen" && (
        <g>
          <path d="M 14 2 L 29 -10" stroke="#E2808D" strokeWidth="2" />
          <path d="M 12 -29 L 19 -38" stroke="#E2808D" strokeWidth="2" strokeLinecap="round" />
        </g>
        )}

        {character.id === "xiren" && (
        <g>
          <path d="M -17 9 Q 0 22 17 9" stroke="#C9A0A8" strokeWidth="2" fill="none" />
          <circle cx="-12" cy="-27" r="2" fill="#C9A0A8" />
        </g>
        )}

        {character.id === "jiamu" && (
        <g>
          <path d="M -13 -30 Q 0 -42 13 -30" fill="none" stroke={gold} strokeWidth="2" />
          <path d="M -16 25 L 16 25" stroke={gold} strokeWidth="2" />
        </g>
        )}

        {character.id === "wang-furen" && (
        <g>
          <path d="M -13 -27 L 13 -27" stroke="#8B1E1E" strokeWidth="3" />
          <path d="M -18 4 L 18 4" stroke={gold} strokeOpacity="0.7" />
        </g>
        )}

        {character.id === "zijuan" && (
        <g>
          <path d="M -16 -4 Q -28 4 -24 18" stroke="#79B7B4" strokeWidth="2" fill="none" />
          <circle cx="-23" cy="5" r="3" fill="#79B7B4" />
        </g>
        )}

        {character.id === "jinghuan" && (
        <g>
          <circle cx="0" cy="-19" r="15" fill="none" stroke="#8D72B8" strokeOpacity="0.52" />
          <path d="M -18 0 C -8 -14, 8 14, 18 0" stroke="#8D72B8" fill="none" />
        </g>
        )}

        <text
          x="0"
          y="48"
          textAnchor="middle"
          className="map-text-shadow serif-title"
          fill="#F4E3BF"
          fontSize="11"
          fontWeight="600"
        >
          {character.name}
        </text>
      </g>
    </g>
  );
}

function CharacterCluster({
  location,
  cx,
  cy,
  heat,
  characters,
}: {
  location: LocationViewModel;
  cx: number;
  cy: number;
  heat: number;
  characters: CharacterSummary[];
}) {
  if (characters.length === 0) {
    return null;
  }

  const visibleCharacters = characters.slice(0, heat > 72 ? 6 : 4);
  const effectiveHeat = Math.max(heat, 46);
  const opacity = Math.min(0.96, 0.28 + effectiveHeat / 105);
  const offsetPresets = [
    { x: 0, y: -8 },
    { x: -25, y: 1 },
    { x: 27, y: 1 },
    { x: -47, y: 13 },
    { x: 0, y: 17 },
    { x: 48, y: 13 },
  ];
  const offsets =
    visibleCharacters.length === 1
      ? [{ x: 0, y: 0 }]
      : visibleCharacters.length === 2
        ? [
            { x: -18, y: 0 },
            { x: 20, y: -3 },
          ]
        : offsetPresets;

  const clusterAnchor =
    location.id === "taixu"
      ? { x: cx - 6, y: cy - 94 }
      : location.atmosphere === "power"
        ? { x: cx, y: cy + 78 }
        : { x: cx, y: cy + 82 };

  return (
    <g style={{ transition: "opacity 360ms ease" }}>
      {visibleCharacters.map((character, index) => (
        <CharacterSprite
          key={character.id}
          character={character}
          x={clusterAnchor.x + offsets[index].x}
          y={clusterAnchor.y + offsets[index].y}
          opacity={opacity}
          index={index}
        />
      ))}
    </g>
  );
}

function OrganicHeatGlow({
  cx,
  cy,
  color,
  radius,
  opacity,
  isFocused,
}: {
  cx: number;
  cy: number;
  color: string;
  radius: number;
  opacity: number;
  isFocused: boolean;
}) {
  const innerOpacity = isFocused ? Math.min(0.78, opacity + 0.14) : opacity;

  return (
    <g className="organic-heat-glow" pointerEvents="none" style={{ transition: "opacity 420ms ease" }}>
      <path
        d={`M ${cx - radius * 0.82} ${cy + radius * 0.18}
          C ${cx - radius * 1.05} ${cy - radius * 0.42}, ${cx - radius * 0.34} ${cy - radius * 0.98}, ${cx + radius * 0.28} ${cy - radius * 0.88}
          C ${cx + radius * 0.96} ${cy - radius * 0.76}, ${cx + radius * 1.06} ${cy - radius * 0.05}, ${cx + radius * 0.72} ${cy + radius * 0.52}
          C ${cx + radius * 0.3} ${cy + radius * 1.02}, ${cx - radius * 0.46} ${cy + radius * 0.86}, ${cx - radius * 0.82} ${cy + radius * 0.18} Z`}
        fill={color}
        opacity={innerOpacity}
        filter="url(#inkBleed)"
      />
      <path
        d={`M ${cx - radius * 0.54} ${cy - radius * 0.1}
          C ${cx - radius * 0.25} ${cy - radius * 0.62}, ${cx + radius * 0.45} ${cy - radius * 0.5}, ${cx + radius * 0.62} ${cy + radius * 0.04}
          C ${cx + radius * 0.76} ${cy + radius * 0.5}, ${cx + radius * 0.06} ${cy + radius * 0.64}, ${cx - radius * 0.44} ${cy + radius * 0.42}
          C ${cx - radius * 0.76} ${cy + radius * 0.2}, ${cx - radius * 0.7} ${cy + radius * 0.08}, ${cx - radius * 0.54} ${cy - radius * 0.1} Z`}
        fill="#F4E3BF"
        opacity={Math.min(0.11, innerOpacity * 0.22)}
        filter="url(#softGlow)"
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={radius * 0.72}
        ry={radius * 0.34}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeOpacity={Math.min(0.3, innerOpacity * 0.48)}
        strokeDasharray="5 11"
        transform={`rotate(-12 ${cx} ${cy})`}
      />
    </g>
  );
}

function LocationMotif({
  location,
  cx,
  cy,
  opacity,
}: {
  location: LocationViewModel;
  cx: number;
  cy: number;
  opacity: number;
}) {
  const color = location.color;
  const motifOpacity = Math.min(0.82, Math.max(0.42, opacity + 0.12));
  const x = cx - 64;
  const y = cy - 46;

  switch (location.atmosphere) {
    case "rain":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} fill="none">
          <path d={`M ${x} ${y + 76} C ${x + 8} ${y + 34}, ${x + 4} ${y + 8}, ${x + 16} ${y - 12}`} strokeWidth="2" />
          <path d={`M ${x + 18} ${y + 72} C ${x + 26} ${y + 28}, ${x + 22} ${y + 2}, ${x + 34} ${y - 18}`} strokeWidth="1.5" />
          <path d={`M ${x + 5} ${y + 22} Q ${x - 10} ${y + 12} ${x + 7} ${y + 8} M ${x + 23} ${y + 10} Q ${x + 42} ${y + 2} ${x + 30} ${y - 8}`} strokeWidth="1.4" />
        </g>
      );
    case "flower":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" fill={color}>
          {[0, 1, 2, 3, 4].map((item) => (
            <ellipse
              key={item}
              cx={cx - 54 + item * 12}
              cy={cy - 52 + (item % 2) * 9}
              rx="6"
              ry="3"
              transform={`rotate(${item * 34} ${cx - 54 + item * 12} ${cy - 52 + (item % 2) * 9})`}
            />
          ))}
        </g>
      );
    case "snow":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} strokeWidth="1.4">
          {[0, 1, 2].map((item) => {
            const sx = cx - 56 + item * 18;
            const sy = cy - 58 + (item % 2) * 12;
            return (
              <g key={item}>
                <path d={`M ${sx - 6} ${sy} L ${sx + 6} ${sy} M ${sx} ${sy - 6} L ${sx} ${sy + 6} M ${sx - 4} ${sy - 4} L ${sx + 4} ${sy + 4} M ${sx + 4} ${sy - 4} L ${sx - 4} ${sy + 4}`} />
              </g>
            );
          })}
        </g>
      );
    case "grain":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} fill="none" strokeWidth="1.8">
          {[-8, 0, 8].map((offset) => (
            <path key={offset} d={`M ${cx - 54 + offset} ${cy - 18} C ${cx - 62 + offset} ${cy - 36}, ${cx - 52 + offset} ${cy - 50}, ${cx - 58 + offset} ${cy - 66}`} />
          ))}
          <path d={`M ${cx - 68} ${cy - 48} Q ${cx - 55} ${cy - 54} ${cx - 45} ${cy - 42}`} />
        </g>
      );
    case "autumn":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" fill={color}>
          {[0, 1, 2, 3].map((item) => (
            <path
              key={item}
              d={`M ${cx - 62 + item * 17} ${cy - 56 + item * 4} C ${cx - 48 + item * 17} ${cy - 66}, ${cx - 42 + item * 17} ${cy - 42}, ${cx - 60 + item * 17} ${cy - 36} C ${cx - 70 + item * 17} ${cy - 44}, ${cx - 72 + item * 17} ${cy - 50}, ${cx - 62 + item * 17} ${cy - 56} Z`}
            />
          ))}
        </g>
      );
    case "poetry":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} fill="none">
          <path d={`M ${cx - 68} ${cy - 54} L ${cx - 28} ${cy - 62} L ${cx - 22} ${cy - 24} L ${cx - 62} ${cy - 16} Z`} fill="#0d0b0a" strokeWidth="1.5" />
          <path d={`M ${cx - 58} ${cy - 48} L ${cx - 36} ${cy - 52} M ${cx - 56} ${cy - 38} L ${cx - 34} ${cy - 42} M ${cx - 54} ${cy - 28} L ${cx - 32} ${cy - 32}`} strokeWidth="1.2" />
        </g>
      );
    case "power":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke="#D6B76D" fill="none">
          <path d={`M ${cx - 70} ${cy - 62} H ${cx - 28} V ${cy - 48} H ${cx - 56} V ${cy - 34} H ${cx - 18}`} strokeWidth="2" />
          <path d={`M ${cx - 68} ${cy - 22} H ${cx - 38} V ${cy - 8} H ${cx - 62}`} strokeWidth="1.4" />
        </g>
      );
    case "mist":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} fill="none">
          <circle cx={cx - 48} cy={cy - 44} r="16" strokeWidth="1.6" />
          <path d={`M ${cx - 74} ${cy - 24} C ${cx - 52} ${cy - 42}, ${cx - 22} ${cy - 10}, ${cx + 2} ${cy - 34}`} strokeWidth="1.4" />
        </g>
      );
    case "wither":
      return (
        <g className="location-motif" opacity={motifOpacity} pointerEvents="none" stroke={color} fill="none">
          <path d={`M ${cx - 70} ${cy - 22} C ${cx - 52} ${cy - 54}, ${cx - 14} ${cy - 54}, ${cx + 4} ${cy - 22}`} strokeWidth="1.8" />
          <path d={`M ${cx - 52} ${cy - 32} C ${cx - 42} ${cy - 20}, ${cx - 22} ${cy - 20}, ${cx - 12} ${cy - 32}`} strokeDasharray="4 6" />
        </g>
      );
    default:
      return null;
  }
}

function GardenRegion({
  location,
  cx,
  cy,
  heat,
}: {
  location: LocationViewModel;
  cx: number;
  cy: number;
  heat: number;
}) {
  const opacity = 0.16 + Math.min(0.22, heat / 420);

  switch (location.atmosphere) {
    case "rain":
      return (
        <g opacity={opacity}>
          <path
            d={`M ${cx - 84} ${cy + 54} C ${cx - 96} ${cy - 12}, ${cx - 48} ${cy - 78}, ${cx + 38} ${cy - 68} C ${cx + 94} ${cy - 58}, ${cx + 96} ${cy + 30}, ${cx + 42} ${cy + 68} C ${cx - 10} ${cy + 92}, ${cx - 62} ${cy + 82}, ${cx - 84} ${cy + 54} Z`}
            fill="#203a36"
            stroke="#6FA8A6"
          />
          {[-66, -44, -20, 6, 32, 58].map((offset) => (
            <path key={offset} d={`M ${cx + offset} ${cy - 74} C ${cx + offset - 8} ${cy - 16}, ${cx + offset - 3} ${cy + 34}, ${cx + offset - 14} ${cy + 82}`} stroke="#6FA8A6" fill="none" />
          ))}
        </g>
      );
    case "flower":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 92} ${cy - 52} L ${cx + 86} ${cy - 50} L ${cx + 92} ${cy + 72} L ${cx - 88} ${cy + 70} Z`} fill="#3a1719" stroke="#C76B7A" />
          {[-66, -34, 0, 36, 68].map((offset, index) => (
            <circle key={offset} cx={cx + offset} cy={cy + 74 + (index % 2) * 8} r="8" fill="#C76B7A" />
          ))}
        </g>
      );
    case "snow":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 84} ${cy - 54} L ${cx + 82} ${cy - 68} L ${cx + 94} ${cy + 52} L ${cx - 66} ${cy + 78} Z`} fill="#2d2b27" stroke="#D8D2C4" />
          {[[-56, -38], [-12, -58], [44, -42], [66, 28], [-42, 54]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={cx + x} cy={cy + y} r="5" fill="#D8D2C4" />
          ))}
        </g>
      );
    case "grain":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 104} ${cy - 36} L ${cx + 74} ${cy - 64} L ${cx + 108} ${cy + 42} L ${cx - 72} ${cy + 82} Z`} fill="#30301e" stroke="#A8A36D" />
          {[-72, -44, -16, 12, 40, 68].map((offset) => (
            <path key={offset} d={`M ${cx + offset} ${cy - 54} L ${cx + offset + 28} ${cy + 70}`} stroke="#A8A36D" />
          ))}
        </g>
      );
    case "autumn":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 88} ${cy + 70} C ${cx - 80} ${cy - 30}, ${cx - 12} ${cy - 88}, ${cx + 78} ${cy - 36} C ${cx + 106} ${cy + 8}, ${cx + 56} ${cy + 88}, ${cx - 88} ${cy + 70} Z`} fill="#3c2114" stroke="#D98A4E" />
          {[-54, -24, 12, 44, 72].map((offset, index) => (
            <ellipse key={offset} cx={cx + offset} cy={cy - 56 + index * 28} rx="12" ry="4" fill="#D98A4E" transform={`rotate(${24 + index * 18} ${cx + offset} ${cy - 56 + index * 28})`} />
          ))}
        </g>
      );
    case "poetry":
      return (
        <g opacity={opacity}>
          <ellipse cx={cx} cy={cy + 22} rx="108" ry="72" fill="#302510" stroke="#C8A45D" />
          <ellipse cx={cx} cy={cy + 26} rx="72" ry="38" fill="#10201d" stroke="#6FA8A6" />
        </g>
      );
    case "power":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 106} ${cy - 82} L ${cx + 114} ${cy - 78} L ${cx + 106} ${cy + 88} L ${cx - 118} ${cy + 78} Z`} fill="#351010" stroke="#8B1E1E" />
          <path d={`M ${cx - 96} ${cy - 58} L ${cx + 104} ${cy - 58} M ${cx - 98} ${cy + 54} L ${cx + 100} ${cy + 54}`} stroke="#C8A45D" />
        </g>
      );
    case "mist":
      return (
        <g opacity={opacity}>
          <ellipse cx={cx} cy={cy + 18} rx="116" ry="76" fill="#181224" stroke="#8D72B8" />
          <path d={`M ${cx - 96} ${cy + 10} C ${cx - 28} ${cy - 34}, ${cx + 42} ${cy + 70}, ${cx + 112} ${cy + 8}`} stroke="#8D72B8" fill="none" />
        </g>
      );
    case "wither":
      return (
        <g opacity={opacity}>
          <path d={`M ${cx - 108} ${cy + 48} C ${cx - 62} ${cy - 38}, ${cx + 38} ${cy - 52}, ${cx + 104} ${cy + 44} C ${cx + 38} ${cy + 86}, ${cx - 54} ${cy + 86}, ${cx - 108} ${cy + 48} Z`} fill="#332123" stroke="#C9A0A8" />
        </g>
      );
    default:
      return null;
  }
}

function SymbolicBuilding({
  location,
  cx,
  cy,
  heat,
  isSelected,
}: {
  location: LocationViewModel;
  cx: number;
  cy: number;
  heat: number;
  isSelected: boolean;
}) {
  const roof = location.color;
  const wall = isSelected ? "#2b1a14" : "#1b120f";
  const glow = Math.max(0.12, heat / 100);

  if (location.atmosphere === "rain") {
    return (
      <g>
        <path d={`M ${cx - 48} ${cy + 36} L ${cx + 50} ${cy + 34} L ${cx + 42} ${cy + 54} L ${cx - 54} ${cy + 56} Z`} fill="#14211f" stroke={roof} strokeOpacity="0.62" />
        <path d={`M ${cx - 50} ${cy + 8} Q ${cx} ${cy - 28} ${cx + 50} ${cy + 8} L ${cx + 32} ${cy + 20} Q ${cx} ${cy + 2} ${cx - 32} ${cy + 20} Z`} fill={roof} opacity={0.54 + glow * 0.28} />
        <rect x={cx - 30} y={cy + 18} width="60" height="36" fill={wall} stroke={roof} strokeOpacity="0.54" />
        {[-76, -58, 56, 76].map((offset) => (
          <path key={offset} d={`M ${cx + offset} ${cy - 58} C ${cx + offset - 9} ${cy - 8}, ${cx + offset + 3} ${cy + 28}, ${cx + offset - 8} ${cy + 72}`} stroke="#6FA8A6" strokeWidth="2" strokeOpacity="0.66" fill="none" />
        ))}
      </g>
    );
  }

  if (location.atmosphere === "flower") {
    return (
      <g>
        <path d={`M ${cx - 58} ${cy - 18} L ${cx + 58} ${cy - 18} L ${cx + 54} ${cy + 58} L ${cx - 58} ${cy + 58} Z`} fill="#24100f" stroke="#C76B7A" strokeWidth="2" />
        <path d={`M ${cx - 64} ${cy - 22} L ${cx} ${cy - 58} L ${cx + 64} ${cy - 22} Z`} fill="#C76B7A" opacity={0.62 + glow * 0.28} />
        <circle cx={cx} cy={cy + 20} r="18" fill="none" stroke="#D6B76D" strokeOpacity="0.5" />
        {[-52, -32, 34, 54].map((offset, index) => (
          <circle key={offset} cx={cx + offset} cy={cy + 12 + index * 10} r="6" fill="#C76B7A" opacity="0.8" />
        ))}
      </g>
    );
  }

  if (location.atmosphere === "snow") {
    return (
      <g>
        <path d={`M ${cx - 58} ${cy + 38} L ${cx + 54} ${cy + 26} L ${cx + 48} ${cy + 56} L ${cx - 54} ${cy + 66} Z`} fill="#191815" stroke="#D8D2C4" strokeOpacity="0.58" />
        <path d={`M ${cx - 44} ${cy} L ${cx + 46} ${cy - 12} L ${cx + 58} ${cy + 6} L ${cx - 34} ${cy + 18} Z`} fill="#D8D2C4" opacity={0.5 + glow * 0.24} />
        <rect x={cx - 32} y={cy + 12} width="62" height="40" fill="#171513" stroke="#D8D2C4" strokeOpacity="0.48" />
        {[[-62, -22], [-18, -42], [58, -18], [70, 36]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={cx + x} cy={cy + y} r="4" fill="#D8D2C4" opacity="0.78" />
        ))}
      </g>
    );
  }

  if (location.atmosphere === "mist") {
    return (
      <g>
        <ellipse cx={cx} cy={cy + 16} rx="54" ry="20" fill="#141017" stroke="#8D72B8" strokeOpacity="0.52" />
        <path
          d={`M ${cx - 28} ${cy + 10} C ${cx - 8} ${cy - 54}, ${cx + 34} ${cy - 54}, ${cx + 48} ${cy + 12}`}
          fill="none"
          stroke={roof}
          strokeWidth="4"
          opacity={0.68 + glow * 0.22}
        />
        <circle cx={cx + 8} cy={cy - 14} r="18" fill="none" stroke="#D8D2C4" strokeOpacity="0.55" />
        <path d={`M ${cx - 42} ${cy + 34} C ${cx - 4} ${cy + 18}, ${cx + 36} ${cy + 52}, ${cx + 66} ${cy + 26}`} fill="none" stroke="#D6B76D" strokeOpacity="0.34" />
      </g>
    );
  }

  if (location.atmosphere === "wither") {
    return (
      <g>
        <path
          d={`M ${cx - 54} ${cy + 26} C ${cx - 22} ${cy - 12}, ${cx + 28} ${cy - 12}, ${cx + 58} ${cy + 26} Z`}
          fill="#211511"
          stroke={roof}
          strokeOpacity="0.64"
        />
        <path d={`M ${cx - 34} ${cy + 18} C ${cx - 5} ${cy + 5}, ${cx + 26} ${cy + 18}, ${cx + 46} ${cy + 5}`} fill="none" stroke="#C9A0A8" strokeWidth="2" strokeDasharray="5 6" />
        {[0, 1, 2, 3, 4].map((item) => (
          <ellipse
            key={item}
            cx={cx - 36 + item * 18}
            cy={cy - 12 + (item % 2) * 16}
            rx="6"
            ry="3"
            fill="#C9A0A8"
            opacity="0.68"
            transform={`rotate(${item * 24} ${cx - 36 + item * 18} ${cy - 12 + (item % 2) * 16})`}
          />
        ))}
      </g>
    );
  }

  if (location.atmosphere === "grain") {
    return (
      <g>
        <rect x={cx - 46} y={cy - 16} width="92" height="58" fill="#17110d" stroke={roof} strokeOpacity="0.5" />
        {[-30, -14, 2, 18, 34].map((offset) => (
          <path key={offset} d={`M ${cx + offset} ${cy + 36} L ${cx + offset - 8} ${cy - 8} M ${cx + offset} ${cy + 36} L ${cx + offset + 8} ${cy - 8}`} stroke="#A8A36D" strokeOpacity="0.66" />
        ))}
      </g>
    );
  }

  if (location.atmosphere === "autumn") {
    return (
      <g>
        <path d={`M ${cx - 60} ${cy + 48} L ${cx + 56} ${cy + 42} L ${cx + 48} ${cy + 62} L ${cx - 64} ${cy + 68} Z`} fill="#22130d" stroke="#D98A4E" strokeOpacity="0.58" />
        <path d={`M ${cx - 46} ${cy - 6} L ${cx + 28} ${cy - 34} L ${cx + 62} ${cy - 10} L ${cx - 8} ${cy + 18} Z`} fill="#D98A4E" opacity={0.58 + glow * 0.26} />
        <rect x={cx - 32} y={cy + 8} width="66" height="44" fill="#17100d" stroke="#D98A4E" strokeOpacity="0.5" />
        <path d={`M ${cx + 42} ${cy - 48} C ${cx + 30} ${cy - 12}, ${cx + 64} ${cy + 18}, ${cx + 48} ${cy + 58}`} stroke="#D98A4E" strokeWidth="3" fill="none" />
      </g>
    );
  }

  if (location.atmosphere === "poetry") {
    return (
      <g>
        <ellipse cx={cx} cy={cy + 34} rx="64" ry="28" fill="#10201d" stroke="#6FA8A6" strokeOpacity="0.6" />
        <path d={`M ${cx - 46} ${cy + 18} L ${cx + 46} ${cy + 18} L ${cx + 34} ${cy + 44} L ${cx - 34} ${cy + 44} Z`} fill="#241b0d" stroke="#C8A45D" />
        <path d={`M ${cx - 54} ${cy + 8} Q ${cx} ${cy - 28} ${cx + 54} ${cy + 8}`} stroke="#D6B76D" strokeWidth="4" fill="none" opacity={0.5 + glow * 0.26} />
        <path d={`M ${cx - 30} ${cy + 56} L ${cx + 30} ${cy + 56}`} stroke="#D6B76D" strokeDasharray="6 6" />
      </g>
    );
  }

  if (location.atmosphere === "power") {
    return (
      <g>
        <path d={`M ${cx - 62} ${cy - 48} L ${cx + 62} ${cy - 48} L ${cx + 62} ${cy + 62} L ${cx - 62} ${cy + 62} Z`} fill="#230d0d" stroke="#8B1E1E" strokeWidth="4" />
        <path d={`M ${cx - 72} ${cy - 52} L ${cx} ${cy - 82} L ${cx + 72} ${cy - 52}`} fill="none" stroke="#C8A45D" strokeWidth="3" opacity={0.42 + glow * 0.24} />
        <path d={`M ${cx - 20} ${cy + 62} L ${cx - 20} ${cy + 8} Q ${cx} ${cy - 10} ${cx + 20} ${cy + 8} L ${cx + 20} ${cy + 62}`} fill="#0d0b0a" stroke="#C8A45D" strokeOpacity="0.5" />
        {[-46, 46].map((offset) => (
          <rect key={offset} x={cx + offset - 8} y={cy - 18} width="16" height="34" fill="#351010" stroke="#C8A45D" strokeOpacity="0.32" />
        ))}
      </g>
    );
  }

  return (
    <g>
      <path
        d={`M ${cx - 54} ${cy - 8} Q ${cx} ${cy - 48} ${cx + 54} ${cy - 8} L ${cx + 38} ${cy + 2} Q ${cx} ${cy - 22} ${cx - 38} ${cy + 2} Z`}
        fill={roof}
        opacity={0.56 + glow * 0.28}
        stroke="#F4E3BF"
        strokeOpacity={isSelected ? 0.75 : 0.22}
      />
      <rect x={cx - 38} y={cy} width="76" height="48" fill={wall} stroke={roof} strokeOpacity="0.62" />
      <rect x={cx - 10} y={cy + 16} width="20" height="32" fill="#0d0b0a" stroke="#C8A45D" strokeOpacity="0.34" />
      {location.atmosphere === "rain" && (
        <g stroke="#6FA8A6" strokeOpacity="0.48">
          {[-52, -36, 48, 64].map((offset) => (
            <path key={offset} d={`M ${cx + offset} ${cy - 44} L ${cx + offset - 6} ${cy + 42}`} />
          ))}
        </g>
      )}
      {location.atmosphere === "flower" && (
        <g fill="#C76B7A" opacity="0.7">
          {[-50, -34, 44, 60].map((offset, index) => (
            <circle key={offset} cx={cx + offset} cy={cy + 8 + index * 7} r="5" />
          ))}
        </g>
      )}
      {location.atmosphere === "snow" && (
        <g fill="#D8D2C4" opacity="0.72">
          {[-48, -28, 42, 62].map((offset, index) => (
            <circle key={offset} cx={cx + offset} cy={cy - 20 + index * 12} r="3" />
          ))}
        </g>
      )}
      {location.atmosphere === "autumn" && (
        <g fill="#D98A4E" opacity="0.72">
          {[-54, -34, 46, 62].map((offset, index) => (
            <ellipse key={offset} cx={cx + offset} cy={cy + 4 + index * 8} rx="7" ry="3" transform={`rotate(${index * 25} ${cx + offset} ${cy + 4 + index * 8})`} />
          ))}
        </g>
      )}
      {location.atmosphere === "power" && (
        <path d={`M ${cx - 62} ${cy + 54} L ${cx + 62} ${cy + 54} M ${cx - 62} ${cy + 8} L ${cx - 62} ${cy + 54} M ${cx + 62} ${cy + 8} L ${cx + 62} ${cy + 54}`} stroke="#8B1E1E" strokeWidth="5" strokeOpacity="0.7" />
      )}
      {location.atmosphere === "poetry" && (
        <g stroke="#D6B76D" strokeOpacity="0.58">
          <path d={`M ${cx - 58} ${cy + 56} C ${cx - 22} ${cy + 76}, ${cx + 22} ${cy + 76}, ${cx + 58} ${cy + 56}`} fill="none" />
          <path d={`M ${cx - 34} ${cy + 62} L ${cx + 34} ${cy + 62}`} />
        </g>
      )}
    </g>
  );
}

function GuofengMapOrnaments() {
  return (
    <g pointerEvents="none" opacity="0.38">
      <rect
        x="72"
        y="88"
        width="856"
        height="470"
        rx="18"
        fill="none"
        stroke="#C8A45D"
        strokeOpacity="0.1"
        strokeWidth="1.5"
        strokeDasharray="18 16"
      />
      <path
        d="M94 112 h54 v18 h-36 v36 h-18 Z M906 112 h-54 v18 h36 v36 h18 Z M94 534 h54 v-18 h-36 v-36 h-18 Z M906 534 h-54 v-18 h36 v-36 h18 Z"
        fill="#C8A45D"
        opacity="0.16"
      />
      <g stroke="#C8A45D" strokeOpacity="0.18" fill="none" strokeWidth="2">
        <path d="M404 412 C448 386 484 382 522 402 C560 422 610 424 662 390" />
        <path d="M416 430 C464 406 510 408 552 426 C596 444 638 430 682 406" strokeDasharray="6 10" />
        <path d="M268 478 C326 448 386 448 448 478" strokeDasharray="4 12" />
      </g>
      <g fill="#A8A36D" opacity="0.22">
        {[
          [206, 396, -18],
          [236, 392, 24],
          [768, 390, 12],
          [794, 408, -26],
          [548, 376, 20],
        ].map(([x, y, rotate]) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            rx="18"
            ry="7"
            transform={`rotate(${rotate} ${x} ${y})`}
          />
        ))}
      </g>
      <g className="guofeng-ripple" stroke="#6FA8A6" strokeOpacity="0.16" fill="none">
        <ellipse cx="470" cy="412" rx="54" ry="17" />
        <ellipse cx="612" cy="416" rx="72" ry="20" />
        <ellipse cx="248" cy="410" rx="42" ry="13" />
      </g>
      <g stroke="#D6B76D" strokeOpacity="0.18" fill="none">
        <path d="M142 224 C210 210 258 210 318 226" />
        <path d="M690 208 C762 192 824 196 884 220" />
        <path d="M118 536 C190 520 264 522 324 544" />
      </g>
    </g>
  );
}

function SeasonalAtmosphere({ chapter }: { chapter: number }) {
  const { season } = getChapterSeason(chapter);
  const items = Array.from({ length: season === "summer" ? 24 : 32 }, (_, index) => index);
  const seasonColor = {
    spring: "#E9A6B2",
    summer: "#8FC7A3",
    autumn: "#D6A04F",
    winter: "#DDE7EF",
  }[season];
  const seasonAccent = {
    spring: "#C9A0A8",
    summer: "#6FA8A6",
    autumn: "#D98A4E",
    winter: "#AFC7D8",
  }[season];

  return (
    <g className={`season-atmosphere season-${season}`} pointerEvents="none" opacity="0.84">
      <g opacity="0.42">
        <rect x="108" y="116" width="42" height="42" fill={seasonColor} fillOpacity="0.08" stroke={seasonColor} strokeOpacity="0.5" />
        <path d="M116 124 H142 V150 M150 116 V158 H108" stroke={seasonAccent} strokeOpacity="0.38" fill="none" />
      </g>
      {season === "spring" && (
        <g opacity="0.7" fill={seasonColor} stroke={seasonAccent} strokeOpacity="0.5">
          {[0, 1, 2, 3, 4].map((item) => (
            <ellipse
              key={item}
              cx="181"
              cy="136"
              rx="8"
              ry="3.5"
              transform={`rotate(${item * 72} 181 136) translate(12 0)`}
            />
          ))}
          <circle cx="181" cy="136" r="3" fill={seasonAccent} />
        </g>
      )}

      {season === "summer" && (
        <g opacity="0.68" fill="none" stroke={seasonColor} strokeWidth="2">
          <ellipse cx="181" cy="138" rx="18" ry="7" transform="rotate(-18 181 138)" fill={seasonAccent} fillOpacity="0.24" />
          <path d="M166 148 C176 140, 190 142, 198 150" />
          <circle cx="196" cy="126" r="3" fill={seasonColor} stroke="none" />
        </g>
      )}

      {season === "autumn" && (
        <g opacity="0.72" fill={seasonColor} stroke={seasonAccent} strokeOpacity="0.42">
          <path d="M174 122 C193 118, 202 144, 179 154 C163 144, 164 132, 174 122 Z" />
          <path d="M180 126 C180 138, 178 146, 172 156" fill="none" stroke={seasonAccent} />
        </g>
      )}

      {season === "winter" && (
        <g opacity="0.72" stroke={seasonColor} strokeWidth="2" strokeLinecap="round">
          <path d="M181 118 L181 154 M163 136 L199 136 M168 123 L194 149 M194 123 L168 149" />
          <circle cx="181" cy="136" r="3" fill={seasonAccent} stroke="none" />
        </g>
      )}

      {season === "spring" &&
        items.map((item) => {
          const x = 80 + ((item * 43) % 860);
          const y = 96 + ((item * 67) % 438);
          return (
            <path
              key={item}
              className="season-float"
              d={`M ${x} ${y} C ${x + 8} ${y - 7}, ${x + 14} ${y + 4}, ${x + 2} ${y + 12} C ${x - 7} ${y + 6}, ${x - 5} ${y + 1}, ${x} ${y} Z`}
              fill={item % 3 === 0 ? seasonAccent : seasonColor}
              opacity={0.26 + (item % 4) * 0.055}
              style={{ animationDelay: `${item * 120}ms` }}
            />
          );
        })}

      {season === "summer" &&
        items.map((item) => {
          const x = 108 + ((item * 59) % 800);
          const y = 160 + ((item * 41) % 330);
          return (
            <g key={item} className="season-pulse" style={{ animationDelay: `${item * 160}ms` }}>
              <circle cx={x} cy={y} r={item % 3 === 0 ? "3.2" : "2.1"} fill={item % 2 ? seasonColor : seasonAccent} opacity="0.34" />
              {item % 5 === 0 && <circle cx={x} cy={y} r="14" fill="none" stroke={seasonAccent} strokeOpacity="0.22" />}
              {item % 7 === 0 && <ellipse cx={x + 12} cy={y + 9} rx="13" ry="5" fill={seasonAccent} opacity="0.18" transform={`rotate(-18 ${x + 12} ${y + 9})`} />}
            </g>
          );
        })}

      {season === "autumn" &&
        items.map((item) => {
          const x = 96 + ((item * 47) % 830);
          const y = 104 + ((item * 53) % 420);
          return (
            <path
              key={item}
              className="season-float season-leaf"
              d={`M ${x} ${y} C ${x + 12} ${y - 9}, ${x + 18} ${y + 10}, ${x + 2} ${y + 17} C ${x - 8} ${y + 8}, ${x - 7} ${y + 1}, ${x} ${y} Z`}
              fill={item % 2 ? seasonColor : seasonAccent}
              opacity={0.22 + (item % 4) * 0.055}
              style={{ animationDelay: `${item * 130}ms` }}
            />
          );
        })}

      {season === "winter" &&
        items.map((item) => {
          const x = 88 + ((item * 61) % 840);
          const y = 88 + ((item * 47) % 448);
          return (
            <g
              key={item}
              className="season-float season-snow"
              opacity={0.24 + (item % 5) * 0.05}
              stroke={item % 2 ? seasonColor : seasonAccent}
              strokeWidth="1.45"
              strokeLinecap="round"
              style={{ animationDelay: `${item * 150}ms` }}
            >
              <path d={`M ${x - 4} ${y} L ${x + 4} ${y} M ${x} ${y - 4} L ${x} ${y + 4}`} />
              {item % 3 === 0 && <path d={`M ${x - 3} ${y - 3} L ${x + 3} ${y + 3} M ${x + 3} ${y - 3} L ${x - 3} ${y + 3}`} />}
              {item % 4 === 0 && <circle cx={x} cy={y} r="1.6" fill={seasonColor} stroke="none" />}
            </g>
          );
        })}
    </g>
  );
}

export function GardenMap({
  locations,
  selectedLocationId,
  currentChapter = 27,
  appearancesByLocation = {},
  highlightedLocationIds = [],
  onSelect,
  onHover,
}: {
  locations: LocationViewModel[];
  selectedLocationId: string | null;
  currentChapter?: number;
  appearancesByLocation?: Record<string, CharacterSummary[]>;
  highlightedLocationIds?: string[];
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const chapterLabel = Math.round(currentChapter);
  const tone = getRiseFallTone(currentChapter);

  return (
    <div className="relative h-[calc(100vh-160px)] min-h-[500px] w-screen overflow-hidden bg-[#0d0b0a] pt-16">
      <svg
        viewBox="0 0 1000 640"
        role="img"
        aria-label={`大观园第 ${chapterLabel} 回地点热力地图`}
        className="h-full w-full"
        style={{
          filter: `brightness(${tone.brightness}) saturate(${tone.saturation}) contrast(${tone.contrast})`,
          transition: "filter 520ms ease",
        }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#C8A45D" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0D0B0A" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cinemaBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <filter id="inkBleed" x="-80%" y="-80%" width="260%" height="260%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.034" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <pattern id="silkPattern" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M0 17 C8 12 16 22 34 17 M17 0 C12 8 22 16 17 34" stroke="#F4E3BF" strokeOpacity="0.045" fill="none" />
          </pattern>
        </defs>

        <rect width="1000" height="640" fill="#100b09" />
        <rect width="1000" height="640" fill="url(#silkPattern)" opacity="0.46" />
        <rect width="1000" height="640" fill="#0D0B0A" opacity={tone.dawnOpacity} />
        <rect width="1000" height="640" fill="#0D0B0A" opacity={tone.duskOpacity} />
        <ellipse cx="520" cy="260" rx="360" ry="210" fill="#D6B76D" opacity={tone.warmthOpacity} filter="url(#cinemaBlur)" />
        <ellipse cx="520" cy="330" rx="530" ry="310" fill="none" stroke="#0D0B0A" strokeWidth="90" strokeOpacity={tone.edgeOpacity} />
        <path
          d="M88 574 C246 506 362 556 520 492 C678 428 802 486 928 420 L928 640 L88 640 Z"
          fill="#0D0B0A"
          opacity={tone.inkOpacity}
        />
        <ellipse cx="500" cy="320" rx="430" ry="260" fill="url(#mapGlow)" />
        <path
          d="M116 420 C220 255 330 202 505 229 C650 251 752 180 865 260 C800 410 700 520 514 540 C320 560 188 508 116 420Z"
          fill="#18100d"
          stroke="#C8A45D"
          strokeOpacity="0.34"
          strokeWidth="2"
        />
        <path d="M168 420 C282 356 332 286 464 308 C598 330 646 426 820 386" fill="none" stroke="#537a78" strokeOpacity="0.35" strokeWidth="34" strokeLinecap="round" />
        <path d="M158 430 C296 356 328 292 460 314 C590 336 638 432 816 388" fill="none" stroke="#D6B76D" strokeOpacity="0.34" strokeWidth="2" strokeDasharray="8 10" />
        <path d="M230 205 L805 205 M190 515 L780 515 M135 420 L875 260" stroke="#c8a45d" strokeOpacity="0.08" />
        <SeasonalAtmosphere chapter={currentChapter} />
        <GuofengMapOrnaments />

        {locations.map((location) => {
          const cx = location.mapPosition.x * 10;
          const cy = location.mapPosition.y * 6.4;
          const heat = getLocationHeatAtChapter(location, currentChapter);
          const isSelected = selectedLocationId === location.id;
          const isHighlighted = highlightedLocationIds.includes(location.id);
          const hasChapterCharacters = Boolean(appearancesByLocation[location.id]?.length);
          const labelOpacity = isSelected || isHighlighted ? 1 : heat > 34 ? 0.82 : 0.58;
          const visualHeat = hasChapterCharacters ? Math.max(heat, 42) : heat;
          const glowOpacity = visualHeat < 12 ? 0.04 : Math.min(0.78, visualHeat / 130);
          const glowRadius = 38 + visualHeat * 0.98 + (isSelected ? 34 : 0);

          return (
            <g key={location.id}>
              <GardenRegion location={location} cx={cx} cy={cy} heat={heat} />
              <OrganicHeatGlow
                cx={cx}
                cy={cy}
                color={location.color}
                radius={glowRadius}
                opacity={isSelected || isHighlighted ? Math.min(0.78, glowOpacity + 0.16) : glowOpacity}
                isFocused={isSelected || isHighlighted}
              />
              <LocationMotif
                location={location}
                cx={cx}
                cy={cy}
                opacity={isSelected || isHighlighted || heat > 42 ? 0.72 : 0.46}
              />
              <g
                role="button"
                tabIndex={0}
                aria-label={`查看${location.displayName}：第 ${chapterLabel} 回热度 ${heat}`}
                onMouseEnter={() => onHover(location.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(location.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(location.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(location.id);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <SymbolicBuilding location={location} cx={cx} cy={cy} heat={heat} isSelected={isSelected} />
              </g>
              <g opacity={labelOpacity}>
                <line
                  x1={cx + 16}
                  y1={cy - 34}
                  x2={cx + 34}
                  y2={cy - 46}
                  stroke="#C8A45D"
                  strokeOpacity={isSelected || isHighlighted ? 0.5 : 0.2}
                />
                <rect
                  x={cx + 36}
                  y={cy - 63}
                  width={Math.min(118, Math.max(58, location.displayName.length * 15 + 18))}
                  height="23"
                  rx="3"
                  fill="#0d0b0a99"
                  stroke={isSelected || isHighlighted ? location.color : "#C8A45D"}
                  strokeOpacity={isSelected || isHighlighted ? 0.58 : 0.22}
                />
                <text
                  x={cx + 45}
                  y={cy - 47}
                  className="map-text-shadow serif-title"
                  fill="#F4E3BF"
                  fontSize={location.displayName.length > 5 ? "12" : "14"}
                >
                  {location.displayName}
                </text>
              </g>
            </g>
          );
        })}

        <CinematicChapterLight chapter={currentChapter} />

        <g className="map-character-layer" style={{ transition: "opacity 520ms ease" }}>
          {locations.map((location) => {
            const cx = location.mapPosition.x * 10;
            const cy = location.mapPosition.y * 6.4;
            const heat = getLocationHeatAtChapter(location, currentChapter);

            return (
              <CharacterCluster
                key={`characters-${location.id}-${chapterLabel}`}
                location={location}
                cx={cx}
                cy={cy}
                heat={heat}
                characters={appearancesByLocation[location.id] ?? []}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
