# 掌中劍・月下決 · Swords in the Palm: Duel Under the Moon

A five-minute 3D short in the style of Taiwanese glove puppetry (布袋戲), on the film engine of
[Iron Front: Night of the Ravens](https://github.com/ywchen0711/ironfilm).

**第一回　月下決 / Part One: Duel Under the Moon (5 min).** The curtain of a puppet stage parts on a bamboo forest at
night. 燕飛霜 Yan Feishuang, "Red Silk", flees with the Heavenly Sword Manual and fights off four envoys of the Blood
Lotus. Their master, 夜無極 Ye Wuji, the Blood Lotus Lord, comes down out of the sky and beats her down; as his claw
goes up, a crescent of sword energy flies out of the dark and 凌雲霄 Ling Yunxiao, the White-Robed Sword, glides down
between them. They fight through the bamboo and up into it, then on a mountain top over a sea of clouds under a huge
moon: Ten Thousand Demons against One Sword of Moonlight. At dawn the narrator closes the tale.

In the manner of 布袋戲: the narrator's opening poem; each master's entrance poem (出場詩) with his name in great
calligraphy; techniques called out by name as they are thrown; the gongs and drums (鑼鼓) on every strike and pose
(亮相); puppets that glide, bob and leap as the puppeteers' hands carry them, silk sleeves, hair and ribbons
swinging after them.

Play: https://ywchen0711.github.io/budaixi/ (space to play or pause, ← → to skip, Chinese or English subtitles and
voices; `?t=60` starts at second 60, `?lang=en` in English).

## 天機策 · The Celestial Stratagem (a series, 10 episodes × 10 minutes)

After the prologue, the series: an original martial world built from the classic figures of Taiwanese glove puppetry —
the smiling strategist who is always three moves ahead (洛無塵), the stern Buddha of the peak (無涯), the swordsman who
never speaks (孤鴻), the proud rival (魏無憂), the comic informant paid by every side (錢不二), the refined lord of the
Confucians with a fan and a secret (殷九霄), the drunken Taoist sword immortal (白鶴子), the lord of a thousand faces
(千面鏡王), the gentleman in black and white who laughs at others' pain (陰陽郎君), the Cold Moon Fairy (月清寒), and the
Netherworld Emperor below the world (幽冥帝君) — with Ling Yunxiao, Yan Feishuang and Ye Wuji back from the prologue.
Poisoned cups and borrowed faces, framed murders, a staged death in a lotus pond turning red, blank pages, grand
entrances with their poems and names in calligraphy. All of it in the anime style, every character with a face from
the 50 and a build from the 20.

- [world.html](https://ywchen0711.github.io/budaixi/world.html): the world — the Stratagem, the Three Teachings, the places, everyone, the ten episodes
- Episodes: `?ep=s1` … `?ep=s10` (the start screen lists them)
- [creator.html](https://ywchen0711.github.io/budaixi/creator.html): 50 faces (10 outlines × 5 eyes) on 20 builds (4 heights × 5 frames), any costume
- [styles.html](https://ywchen0711.github.io/budaixi/styles.html): the head styles side by side

The episodes are written as beats and compiled into film by `js/story/compose.js`:

```js
const E = episode({ id: 's1', title, end, cast: ['luo', 'yin', ...] });
E.open('hall', { sky: 'dusk', mood: 'tense', place: { yin: [7, 0, -90] } });  // a place, everyone on their marks
E.say('yin', '……', '...', { to: 'wei', act: 'fan' });                       // a line to someone: over the shoulder, a gesture
E.enter('luo', { how: 'lotus', at: [0, 0], poem });                           // arrival, the pose, the poem, the name card, the theme
E.duel('ling', 'wei', { d: 18, end: 'apart' });                               // exchanges: clashes, leaps, crescents, palms, passes
E.strike('luo', 'yin', { kind: 'array', name: ['蓮華劍氣', 'Lotus Sword Light'], result: 'down' });
E.reveal('huiming', 'jingwang');                                              // the mask comes off
export default E.done();
```

It keeps the camera on one side of the line between speakers, cuts to the listener in a long speech, frames each
puppet by its size, lays a bed of music under each scene by its mood (the zither, trembling strings, the dark, the
sad psaltery, the grand), the gongs and drums under every fight, each master's theme under his poem, slow motion
through every named technique. The places: the bamboo, the mountain top, the Dragon Abyss Pavilion, the Lotus Heart
Retreat, the Peak of Ten Thousand Buddhas, the Netherworld (`js/sets.js`, `js/sets2.js`), with rain.

To remake an episode's sound: `node tools/cues.mjs s1 > tools/cues_s1.json`, `python tools/voices.py cues_s1.json`,
`python -P tools/mix.py RAW KN VSCO VCSL cues_s1.json`.

## How it is built

| | |
|---|---|
| `js/story/ep1.js` | **the episode**: its beats, the set and skies, the puppets' tracks of moves, camera shots, words, name cards, the music cue sheet |
| `js/cast/characters.js` | **the cast**: names and titles, faces (eyes, brows, painted masks), hair, crowns, robes and their embroidery, weapons, voices |
| `js/models/puppet.js` | the glove puppet: painted face, silk robe with pattern and trim, wide sleeves that hang on their own joint, skirt, hair, ribbons, cape, swords, sabres, daggers, claws |
| `js/core/actors3d.js` | poses the puppets: springs on every joint, follow-through in sleeves, hair, skirts and tassels, the puppeteer's bob, spins and flips, parries that reach for the blade |
| `js/core/actions.js` | the move library: walk, glide, jump, drop, blow, react, qi (inner power), wave (a crescent of sword energy), palm, spin, flip, plunge, sever, fall… |
| `js/core/director.js` | cues to effects: auras, sword trails, energy crescents, palm blasts, bursts of power, falling leaves, cut bamboo |
| `js/sets.js` | the puppet stage with its curtains and couplets, the bamboo forest with stone lanterns and mist, the mountain top over a sea of clouds; moonlit, big-moon and dawn skies |
| `js/core/runtime.js`, `camera.js`, `time.js` | the shared film engine: where everyone is at any moment, shot types, slow motion and hit-stops |
| `tools/cues.mjs`, `tools/voices.py`, `tools/mix.py` | the soundtrack: the cues exported from the story; every line spoken by its character's neural voice in both languages; mixed from real recordings (steel, silk, wood, wind, crickets) and real instruments: gongs, cymbals, clapper and drums for the 鑼鼓, a zither, an ocarina, a recorder and a bowed psaltery over low strings |

To remake the soundtrack:

    node tools/cues.mjs ep1 > tools/cues_ep1.json
    python tools/voices.py cues_ep1.json
    python -P tools/mix.py RAW KN VSCO VCSL cues_ep1.json

All recordings are CC0: Kenney's impact and sci-fi sounds, Kaiju Night's designed effects, the Versilian Studios
Chamber Orchestra 2 and the Versilian Community Sample Library. Voices: Microsoft Edge neural voices (edge-tts).
