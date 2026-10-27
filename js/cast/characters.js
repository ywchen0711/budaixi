// Everyone who can appear in a story. To add a character: give it an id, its names, and how the puppet is made
// (js/models/puppet.js): skin, face {brow 'sword' | 'fine' | 'demon', iris, lip, paint 'demon', mark 'lotus' | 'drop' |
// 'flame', eyeshadow, fangs}, hair {color, len}, crown {type 'coronet' | 'horns' | 'hairpin' | 'hood', color, gem},
// robe {base, pattern 'clouds' | 'waves' | 'scales' | 'lotus' | 'plum', ink, trim, inner, sleeve, skirt}, cape, ribbons,
// crownRibbon, armor, weapons {R, L: 'jian' | 'saber' | 'dagger' | 'claw' | 'fan'}, scale.
// voice: per language [neural voice, pitch in Hz, speed in %], and how it sounds (fx: 'stage', the voice in the room)
export const CHARACTERS = {
  ling: {
    zh: '凌雲霄', en: 'Ling Yunxiao', title: { zh: '白衣劍子', en: 'the White-Robed Sword' }, kind: 'puppet', qi: '#8ad8ff',
    voice: { zh: ['zh-CN-YunxiNeural', -4, -6], en: ['en-US-AndrewNeural', -4, -6], fx: 'stage' },
    skin: '#f4e0d0', face: { brow: 'sword', iris: '#24304a', lip: '#a82a2a', mark: 'drop', markColor: '#2a7ad8', shadow: 'rgba(60,90,160,0.25)' },
    hair: { color: '#e8ecf4', len: 1.0 }, crown: { type: 'coronet', color: '#e0e4ec', gem: '#4ab0ff' }, crownRibbon: true,
    robe: { base: '#eef0f6', pattern: 'clouds', ink: 'rgba(120,150,200,0.45)', trim: '#3a5a9a', inner: '#c8d4ea', sleeve: 1.1, tassel: '#3a7ad8' },
    weapons: { R: 'jian' },
  },
  yan: {
    zh: '燕飛霜', en: 'Yan Feishuang', title: { zh: '紅綾', en: 'Red Silk' }, kind: 'puppet', qi: '#ff8ab0', scale: 0.94,
    voice: { zh: ['zh-TW-HsiaoChenNeural', 0, 0], en: ['en-US-AvaNeural', 0, 0], fx: 'stage' },
    skin: '#f6e2d6', face: { fem: true, brow: 'fine', iris: '#3a1a14', lip: '#c8202c', mark: 'flame', markColor: '#d81838', eyeshadow: 'rgba(220,60,90,0.5)', blush: 'rgba(240,110,130,0.45)' },
    hair: { color: '#141014', len: 1.1 }, crown: { type: 'hairpin', color: '#e8c050', gem: '#ff4a6a' },
    robe: { base: '#c8263a', pattern: 'plum', ink: 'rgba(255,220,220,0.5)', trim: '#e8c050', inner: '#f4d4da', sleeve: 1.05, skirt: 0.95 },
    ribbons: { color: '#ff9ab8' }, weapons: { R: 'dagger', L: 'dagger' },
  },
  ye: {
    zh: '夜無極', en: 'Ye Wuji', title: { zh: '血蓮魔尊', en: 'the Blood Lotus Lord' }, kind: 'puppet', qi: '#ff2a48', scale: 1.08,
    voice: { zh: ['zh-CN-YunyangNeural', -30, -14], en: ['en-GB-RyanNeural', -16, -12], fx: 'stage' },
    skin: '#e8d4cc', face: { brow: 'demon', iris: '#a81020', pupil: '#ff3030', lip: '#4a0a14', paint: 'demon', mark: 'lotus', markColor: '#ff2030', fangs: true, line: '#000000' },
    hair: { color: '#0a0608', len: 1.3 }, crown: { type: 'horns', color: '#8a1a24', gem: '#ff2030' }, armor: true,
    robe: { base: '#2a0c14', pattern: 'lotus', ink: 'rgba(200,30,50,0.55)', trim: '#c8a040', inner: '#5a1020', sleeve: 1.2, skirt: 1.1 },
    cape: { color: '#14060a', pattern: 'scales', ink: 'rgba(160,20,40,0.4)' }, weapons: { R: 'saber', L: 'claw' },
  },
  envoy: {
    zh: '血蓮使者', en: 'Blood Lotus envoy', kind: 'puppet', qi: '#c83040', scale: 0.97,
    voice: { zh: ['zh-CN-YunjianNeural', -6, 6], en: ['en-US-EricNeural', -6, 6], fx: 'stage' },
    skin: '#d8c8c0', face: { brow: 'sword', iris: '#200808', lip: '#601018' },
    hair: { color: '#0a0a0c', len: 0.6 }, crown: { type: 'hood' },
    robe: { base: '#1a1418', pattern: 'scales', ink: 'rgba(160,30,40,0.35)', trim: '#7a1018', inner: '#2a1a1e', sleeve: 0.9 },
    weapons: { R: 'saber' },
  },
  narrator: { zh: '口白', en: 'Narrator', kind: 'voice', voice: { zh: ['zh-CN-YunjianNeural', -16, -10], en: ['en-US-ChristopherNeural', -10, -10], fx: 'narrator' } },
};
export const nameOf = (id, lang) => CHARACTERS[id]?.[lang] || id;
