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

Also: [styles.html](https://ywchen0711.github.io/budaixi/styles.html) compares the head styles side by side, and
[creator.html](https://ywchen0711.github.io/budaixi/creator.html) makes characters in the anime style: 50 faces (10
outlines × 5 kinds of eyes) on 20 builds (4 heights × 5 frames), in any of the cast's costumes (`js/models/looks.js`).

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
