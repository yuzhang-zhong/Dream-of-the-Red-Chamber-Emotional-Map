"use client";

import { useMemo, useState } from "react";
import * as d3 from "d3";
import type { AtlasPayload, Relation } from "@/contracts/atlas";
import { buildAtlasIndex, relationTypeColors, relationTypeLabels } from "@/lib/atlas";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  color: string;
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  relation: Relation;
}

function createLayout(payload: AtlasPayload) {
  const nodes: GraphNode[] = payload.characters.map((character, index) => ({
    id: character.id,
    name: character.name,
    color: character.color,
    radius: 10 + character.narrativeWeight / 9,
    x: 500 + Math.cos((index / payload.characters.length) * Math.PI * 2) * 260,
    y: 320 + Math.sin((index / payload.characters.length) * Math.PI * 2) * 210,
  }));

  const links: GraphLink[] = payload.relations.map((relation) => ({
    id: relation.id,
    source: relation.source,
    target: relation.target,
    relation,
  }));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink<GraphNode, GraphLink>(links)
        .id((node) => node.id)
        .distance((link) => 210 - link.relation.strength),
    )
    .force("charge", d3.forceManyBody().strength(-260))
    .force("center", d3.forceCenter(500, 320))
    .force("collision", d3.forceCollide<GraphNode>().radius((node) => node.radius + 18))
    .stop();

  for (let i = 0; i < 220; i += 1) {
    simulation.tick();
  }

  return { nodes, links };
}

export function RelationGraph({
  payload,
  initialCharacterId = "lin-daiyu",
}: {
  payload: AtlasPayload;
  initialCharacterId?: string;
}) {
  const [selectedRelationId, setSelectedRelationId] = useState("daiyu-baoyu");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(initialCharacterId);
  const index = useMemo(() => buildAtlasIndex(payload), [payload]);
  const { nodes, links } = useMemo(() => createLayout(payload), [payload]);
  const selectedRelation = selectedRelationId ? index.relationsById[selectedRelationId] : null;

  const connectedIds = useMemo(() => {
    if (!selectedCharacterId) {
      return new Set<string>();
    }
    const ids = new Set([selectedCharacterId]);
    for (const relation of index.relationsByCharacterId[selectedCharacterId] ?? []) {
      ids.add(relation.source);
      ids.add(relation.target);
    }
    return ids;
  }, [index, selectedCharacterId]);

  return (
    <main className="min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.36em] text-[#c8a45d]">Appendix</p>
          <h1 className="serif-title mt-2 text-4xl text-[#f7ecd3]">人物关系附录</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b9aa93]">
            关系图保留为辅助阅读层；主体验已转向章节地点热力，帮助你看见每一回的空间重心如何变化。
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <section className="atlas-panel overflow-hidden rounded-lg">
            <svg viewBox="0 0 1000 640" className="h-[640px] w-full">
              <rect width="1000" height="640" fill="#0d0b0a" />
              {links.map((link) => {
                const source = link.source as GraphNode;
                const target = link.target as GraphNode;
                const isSelected = selectedRelationId === link.id;
                const isDimmed =
                  selectedCharacterId &&
                  !connectedIds.has(source.id) &&
                  !connectedIds.has(target.id);

                return (
                  <g key={link.id}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={relationTypeColors[link.relation.primaryType]}
                      strokeWidth={isSelected ? 5 : Math.max(1.5, link.relation.strength / 24)}
                      strokeOpacity={isDimmed ? 0.12 : isSelected ? 0.9 : 0.42}
                      strokeDasharray={
                        link.relation.types.includes("misunderstanding") ? "8 8" : undefined
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedRelationId(link.id)}
                    />
                  </g>
                );
              })}

              {nodes.map((node) => {
                const isSelected = selectedCharacterId === node.id;
                const isDimmed = selectedCharacterId && !connectedIds.has(node.id);
                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedCharacterId(node.id)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + (isSelected ? 6 : 0)}
                      fill={node.color}
                      opacity={isDimmed ? 0.18 : 0.34}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill="#17100d"
                      stroke={isSelected ? "#F4E3BF" : node.color}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={isDimmed ? 0.45 : 1}
                    />
                    <text
                      x={(node.x ?? 0) + node.radius + 9}
                      y={(node.y ?? 0) + 5}
                      fill="#F4E3BF"
                      fontSize="15"
                      className="map-text-shadow serif-title"
                      opacity={isDimmed ? 0.35 : 1}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </section>

          <aside className="atlas-panel rounded-lg p-6">
            {selectedRelation ? (
              <>
                <p className="text-xs uppercase tracking-[0.24em] text-[#c8a45d]">Relation</p>
                <h2 className="serif-title mt-3 text-3xl text-[#f7ecd3]">
                  {index.charactersById[selectedRelation.source]?.name} —{" "}
                  {index.charactersById[selectedRelation.target]?.name}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedRelation.types.map((type) => (
                    <span
                      key={type}
                      className="rounded px-2.5 py-1 text-xs"
                      style={{
                        color: "#17100d",
                        background: relationTypeColors[type],
                      }}
                    >
                      {relationTypeLabels[type]}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-[#dacbb3]">{selectedRelation.emotionFlow}</p>
                <blockquote className="serif-title mt-5 border-l border-[#c8a45d88] pl-4 text-lg leading-8 text-[#f0dec0]">
                  {selectedRelation.summary}
                </blockquote>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#c8a45d]">Keywords</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedRelation.keywords.map((keyword) => (
                      <span key={keyword} className="rounded border border-[#c8a45d26] px-2.5 py-1 text-xs text-[#d8c8ad]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[#b9aa93]">点击一条关系线查看情绪流动。</p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
