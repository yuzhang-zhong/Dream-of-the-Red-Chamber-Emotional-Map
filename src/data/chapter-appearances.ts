import { getChapterTitle } from "./chapter-titles";
import type { CharacterSummary } from "@/contracts/atlas";

export interface ChapterAppearance extends CharacterSummary {
  locationId: string;
}

const castProfiles: Record<string, ChapterAppearance> = {
  "lin-daiyu": { id: "lin-daiyu", name: "林黛玉", englishName: "Lin Daiyu", color: "#6FA8A6", locationId: "xiaoxiang" },
  "jia-baoyu": { id: "jia-baoyu", name: "贾宝玉", englishName: "Jia Baoyu", color: "#C76B7A", locationId: "yihong" },
  "xue-baochai": { id: "xue-baochai", name: "薛宝钗", englishName: "Xue Baochai", color: "#D8D2C4", locationId: "hengwu" },
  "wang-xifeng": { id: "wang-xifeng", name: "王熙凤", englishName: "Wang Xifeng", color: "#B94B3F", locationId: "rongguo" },
  "jia-tanchun": { id: "jia-tanchun", name: "贾探春", englishName: "Jia Tanchun", color: "#D98A4E", locationId: "qiushuang" },
  "shi-xiangyun": { id: "shi-xiangyun", name: "史湘云", englishName: "Shi Xiangyun", color: "#D6B76D", locationId: "poetry-club" },
  "li-wan": { id: "li-wan", name: "李纨", englishName: "Li Wan", color: "#A8A36D", locationId: "daoxiang" },
  qingwen: { id: "qingwen", name: "晴雯", englishName: "Qingwen", color: "#E2808D", locationId: "yihong" },
  xiren: { id: "xiren", name: "袭人", englishName: "Xiren", color: "#C9A0A8", locationId: "yihong" },
  jiamu: { id: "jiamu", name: "贾母", englishName: "Grandmother Jia", color: "#C8A45D", locationId: "rongguo" },
  "wang-furen": { id: "wang-furen", name: "王夫人", englishName: "Lady Wang", color: "#8B1E1E", locationId: "rongguo" },
  zijuan: { id: "zijuan", name: "紫鹃", englishName: "Zijuan", color: "#79B7B4", locationId: "xiaoxiang" },
  jinghuan: { id: "jinghuan", name: "警幻仙姑", englishName: "Disenchantment Fairy", color: "#8D72B8", locationId: "taixu" },
  "jia-yuanchun": { id: "jia-yuanchun", name: "贾元春", englishName: "Jia Yuanchun", color: "#C8A45D", locationId: "rongguo" },
  "liu-laolao": { id: "liu-laolao", name: "刘姥姥", englishName: "Granny Liu", color: "#A8A36D", locationId: "daoxiang" },
  "qin-keqing": { id: "qin-keqing", name: "秦可卿", englishName: "Qin Keqing", color: "#8D72B8", locationId: "taixu" },
  "ping-er": { id: "ping-er", name: "平儿", englishName: "Ping'er", color: "#D6B76D", locationId: "rongguo" },
  yuanyang: { id: "yuanyang", name: "鸳鸯", englishName: "Yuanyang", color: "#C8A45D", locationId: "rongguo" },
  miaoyu: { id: "miaoyu", name: "妙玉", englishName: "Miaoyu", color: "#D8D2C4", locationId: "taixu" },
  xiangling: { id: "xiangling", name: "香菱", englishName: "Xiangling", color: "#D8D2C4", locationId: "hengwu" },
  "jia-zheng": { id: "jia-zheng", name: "贾政", englishName: "Jia Zheng", color: "#8B1E1E", locationId: "rongguo" },
  "jia-zhen": { id: "jia-zhen", name: "贾珍", englishName: "Jia Zhen", color: "#8B1E1E", locationId: "rongguo" },
  "jia-lian": { id: "jia-lian", name: "贾琏", englishName: "Jia Lian", color: "#B94B3F", locationId: "rongguo" },
  "jia-huan": { id: "jia-huan", name: "贾环", englishName: "Jia Huan", color: "#8B1E1E", locationId: "rongguo" },
  "jia-yingchun": { id: "jia-yingchun", name: "贾迎春", englishName: "Jia Yingchun", color: "#C9A0A8", locationId: "poetry-club" },
  "jia-xichun": { id: "jia-xichun", name: "贾惜春", englishName: "Jia Xichun", color: "#D8D2C4", locationId: "poetry-club" },
  "jia-qiaojie": { id: "jia-qiaojie", name: "巧姐", englishName: "Qiaojie", color: "#A8A36D", locationId: "rongguo" },
  "you-erjie": { id: "you-erjie", name: "尤二姐", englishName: "Second Sister You", color: "#C9A0A8", locationId: "rongguo" },
  "you-sanjie": { id: "you-sanjie", name: "尤三姐", englishName: "Third Sister You", color: "#C76B7A", locationId: "rongguo" },
  "zhen-shiyin": { id: "zhen-shiyin", name: "甄士隐", englishName: "Zhen Shiyin", color: "#8D72B8", locationId: "taixu" },
  "jia-yucun": { id: "jia-yucun", name: "贾雨村", englishName: "Jia Yucun", color: "#8B1E1E", locationId: "rongguo" },
  "feng-shi": { id: "feng-shi", name: "封氏", englishName: "Lady Feng", color: "#C9A0A8", locationId: "taixu" },
  yinglian: { id: "yinglian", name: "英莲", englishName: "Yinglian", color: "#D8D2C4", locationId: "taixu" },
  "xue-yima": { id: "xue-yima", name: "薛姨妈", englishName: "Aunt Xue", color: "#D8D2C4", locationId: "hengwu" },
  "leng-zixing": { id: "leng-zixing", name: "冷子兴", englishName: "Leng Zixing", color: "#C8A45D", locationId: "rongguo" },
  "lin-ruhai": { id: "lin-ruhai", name: "林如海", englishName: "Lin Ruhai", color: "#6FA8A6", locationId: "rongguo" },
  "jia-she": { id: "jia-she", name: "贾赦", englishName: "Jia She", color: "#8B1E1E", locationId: "rongguo" },
  "xing-furen": { id: "xing-furen", name: "邢夫人", englishName: "Lady Xing", color: "#8B1E1E", locationId: "rongguo" },
  "jia-rui": { id: "jia-rui", name: "贾瑞", englishName: "Jia Rui", color: "#8B1E1E", locationId: "rongguo" },
};

const aliasRules: Array<{ id: keyof typeof castProfiles; aliases: string[] }> = [
  { id: "lin-daiyu", aliases: ["林黛玉", "黛玉", "林潇湘", "潇湘", "颦", "绛珠", "飞燕", "埋香冢", "潇湘子"] },
  { id: "jia-baoyu", aliases: ["贾宝玉", "宝玉", "痴公子", "神瑛", "通灵", "情友"] },
  { id: "xue-baochai", aliases: ["薛宝钗", "宝钗", "薛蘅芜", "蘅芜", "金锁", "宝蟾"] },
  { id: "wang-xifeng", aliases: ["王熙凤", "凤姐", "王凤姐", "凤姐儿"] },
  { id: "jia-tanchun", aliases: ["探春", "敏探春", "秋爽斋"] },
  { id: "shi-xiangyun", aliases: ["湘云", "史湘云"] },
  { id: "li-wan", aliases: ["李纨", "金寡妇"] },
  { id: "qingwen", aliases: ["晴雯", "俏丫鬟", "芙蓉诔"] },
  { id: "xiren", aliases: ["袭人", "贤袭人", "花解语"] },
  { id: "jiamu", aliases: ["贾母", "史太君", "贾太君"] },
  { id: "wang-furen", aliases: ["王夫人", "姨妈"] },
  { id: "zijuan", aliases: ["紫鹃", "慧紫鹃"] },
  { id: "jinghuan", aliases: ["警幻", "太虚", "幻境"] },
  { id: "jia-yuanchun", aliases: ["元春", "贾元春", "元妃", "归省"] },
  { id: "liu-laolao", aliases: ["刘姥姥", "村老妪"] },
  { id: "qin-keqing", aliases: ["秦可卿", "秦鲸卿"] },
  { id: "ping-er", aliases: ["平儿", "俏平儿"] },
  { id: "yuanyang", aliases: ["鸳鸯", "金鸳鸯", "鸳鸯女"] },
  { id: "miaoyu", aliases: ["妙玉", "拢翠庵", "妙尼"] },
  { id: "xiangling", aliases: ["香菱", "呆香菱"] },
  { id: "jia-zheng", aliases: ["贾政", "存周"] },
  { id: "jia-zhen", aliases: ["贾珍"] },
  { id: "jia-lian", aliases: ["贾琏"] },
  { id: "jia-huan", aliases: ["贾环"] },
  { id: "jia-yingchun", aliases: ["迎春", "贾迎春"] },
  { id: "jia-xichun", aliases: ["惜春", "贾惜春"] },
  { id: "jia-qiaojie", aliases: ["巧姐"] },
  { id: "you-erjie", aliases: ["尤二姐", "尤二姨", "尤娘"] },
  { id: "you-sanjie", aliases: ["尤三姐"] },
  { id: "zhen-shiyin", aliases: ["甄士隐"] },
  { id: "jia-yucun", aliases: ["贾雨村", "雨村"] },
  { id: "feng-shi", aliases: ["封氏"] },
  { id: "yinglian", aliases: ["英莲"] },
  { id: "xue-yima", aliases: ["薛姨妈"] },
  { id: "leng-zixing", aliases: ["冷子兴"] },
  { id: "lin-ruhai", aliases: ["林如海"] },
  { id: "jia-she", aliases: ["贾赦"] },
  { id: "xing-furen", aliases: ["邢夫人"] },
  { id: "jia-rui", aliases: ["贾瑞", "贾天祥"] },
];

const manualChapterPlaces: Record<number, Array<{ id: string; locationId: string }>> = {
  1: [
    { id: "zhen-shiyin", locationId: "taixu" },
    { id: "feng-shi", locationId: "taixu" },
    { id: "yinglian", locationId: "taixu" },
  ],
  2: [
    { id: "xue-yima", locationId: "hengwu" },
    { id: "xue-baochai", locationId: "hengwu" },
    { id: "jia-yucun", locationId: "rongguo" },
    { id: "leng-zixing", locationId: "rongguo" },
    { id: "zhen-shiyin", locationId: "taixu" },
  ],
  3: [
    { id: "jia-yucun", locationId: "rongguo" },
    { id: "lin-ruhai", locationId: "rongguo" },
    { id: "lin-daiyu", locationId: "rongguo" },
    { id: "jiamu", locationId: "rongguo" },
    { id: "wang-furen", locationId: "rongguo" },
    { id: "jia-zheng", locationId: "rongguo" },
  ],
  11: [
    { id: "jiamu", locationId: "rongguo" },
    { id: "jia-she", locationId: "rongguo" },
    { id: "xing-furen", locationId: "rongguo" },
    { id: "jia-zheng", locationId: "rongguo" },
    { id: "wang-furen", locationId: "rongguo" },
    { id: "jia-lian", locationId: "rongguo" },
    { id: "wang-xifeng", locationId: "rongguo" },
    { id: "jia-rui", locationId: "rongguo" },
    { id: "liu-laolao", locationId: "rongguo" },
    { id: "ping-er", locationId: "rongguo" },
  ],
  18: [
    { id: "jia-yuanchun", locationId: "rongguo" },
    { id: "lin-daiyu", locationId: "poetry-club" },
    { id: "jia-baoyu", locationId: "poetry-club" },
  ],
  27: [
    { id: "lin-daiyu", locationId: "flower-tomb" },
    { id: "xue-baochai", locationId: "hengwu" },
    { id: "jia-baoyu", locationId: "yihong" },
  ],
  37: [
    { id: "jia-tanchun", locationId: "qiushuang" },
    { id: "xue-baochai", locationId: "poetry-club" },
    { id: "lin-daiyu", locationId: "poetry-club" },
    { id: "shi-xiangyun", locationId: "poetry-club" },
  ],
  38: [
    { id: "lin-daiyu", locationId: "poetry-club" },
    { id: "xue-baochai", locationId: "poetry-club" },
    { id: "shi-xiangyun", locationId: "poetry-club" },
  ],
  40: [
    { id: "jiamu", locationId: "poetry-club" },
    { id: "liu-laolao", locationId: "daoxiang" },
    { id: "wang-xifeng", locationId: "rongguo" },
  ],
  41: [
    { id: "jia-baoyu", locationId: "yihong" },
    { id: "liu-laolao", locationId: "yihong" },
    { id: "miaoyu", locationId: "taixu" },
  ],
  45: [
    { id: "lin-daiyu", locationId: "xiaoxiang" },
    { id: "xue-baochai", locationId: "xiaoxiang" },
    { id: "zijuan", locationId: "xiaoxiang" },
  ],
  52: [
    { id: "qingwen", locationId: "yihong" },
    { id: "jia-baoyu", locationId: "yihong" },
    { id: "ping-er", locationId: "rongguo" },
  ],
  56: [
    { id: "jia-tanchun", locationId: "qiushuang" },
    { id: "xue-baochai", locationId: "hengwu" },
    { id: "wang-xifeng", locationId: "rongguo" },
  ],
  57: [
    { id: "zijuan", locationId: "xiaoxiang" },
    { id: "jia-baoyu", locationId: "xiaoxiang" },
    { id: "lin-daiyu", locationId: "xiaoxiang" },
  ],
  63: [
    { id: "jia-baoyu", locationId: "yihong" },
    { id: "qingwen", locationId: "yihong" },
    { id: "xiren", locationId: "yihong" },
  ],
  70: [
    { id: "lin-daiyu", locationId: "poetry-club" },
    { id: "shi-xiangyun", locationId: "poetry-club" },
    { id: "jia-tanchun", locationId: "poetry-club" },
  ],
  74: [
    { id: "wang-furen", locationId: "rongguo" },
    { id: "wang-xifeng", locationId: "rongguo" },
    { id: "jia-tanchun", locationId: "qiushuang" },
    { id: "qingwen", locationId: "yihong" },
  ],
  97: [
    { id: "lin-daiyu", locationId: "xiaoxiang" },
    { id: "xue-baochai", locationId: "rongguo" },
    { id: "jia-baoyu", locationId: "yihong" },
  ],
  98: [
    { id: "lin-daiyu", locationId: "taixu" },
    { id: "jia-baoyu", locationId: "yihong" },
    { id: "xue-baochai", locationId: "hengwu" },
  ],
  105: [
    { id: "wang-xifeng", locationId: "rongguo" },
    { id: "jia-zheng", locationId: "rongguo" },
    { id: "jia-zhen", locationId: "rongguo" },
  ],
  110: [
    { id: "jiamu", locationId: "rongguo" },
    { id: "wang-xifeng", locationId: "rongguo" },
    { id: "yuanyang", locationId: "rongguo" },
  ],
  120: [
    { id: "zhen-shiyin", locationId: "taixu" },
    { id: "jia-yucun", locationId: "rongguo" },
    { id: "jia-baoyu", locationId: "taixu" },
    { id: "jinghuan", locationId: "taixu" },
  ],
};

function fallbackCast(chapter: number) {
  if (chapter <= 20) return ["jia-baoyu", "lin-daiyu", "jiamu"];
  if (chapter <= 50) return ["jia-baoyu", "lin-daiyu", "xue-baochai"];
  if (chapter <= 80) return ["wang-xifeng", "jia-tanchun", "jia-baoyu"];
  if (chapter <= 100) return ["lin-daiyu", "jia-baoyu", "xue-baochai"];
  return ["wang-xifeng", "jiamu", "jia-baoyu"];
}

export function getChapterAppearances(chapter: number): ChapterAppearance[] {
  const title = getChapterTitle(chapter);
  const appearances = new Map<string, ChapterAppearance>();

  for (const item of manualChapterPlaces[chapter] ?? []) {
    const profile = castProfiles[item.id];
    if (profile) {
      appearances.set(item.id, { ...profile, locationId: item.locationId });
    }
  }

  for (const rule of aliasRules) {
    if (rule.aliases.some((alias) => title.includes(alias))) {
      const profile = castProfiles[rule.id];
      if (profile && !appearances.has(rule.id)) {
        appearances.set(rule.id, profile);
      }
    }
  }

  if (appearances.size === 0) {
    fallbackCast(chapter).forEach((id) => {
      const profile = castProfiles[id];
      if (profile) {
        appearances.set(id, profile);
      }
    });
  }

  return [...appearances.values()].slice(0, 6);
}

export function groupAppearancesByLocation(appearances: ChapterAppearance[]) {
  return appearances.reduce<Record<string, ChapterAppearance[]>>((groups, appearance) => {
    groups[appearance.locationId] ??= [];
    groups[appearance.locationId].push(appearance);
    return groups;
  }, {});
}
