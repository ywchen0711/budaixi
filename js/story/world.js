// 《掌中劍・天機策》: the world of the series. An original 武林 built from the classic figures of Taiwanese glove
// puppetry (the smiling strategist who is always three moves ahead, the stern old sage of the Buddhist peak, the
// swordsman who never speaks, the proud rival, the comic informant, the lord of a thousand faces, the gentleman who
// laughs at others' pain, the demon emperor below the world) — the names, the people and the story are its own.
// world.html shows it; the episodes take their poems and their facts from here.

export const WORLD = {
  title: { zh: '掌中劍・天機策', en: 'Swords in the Palm: The Celestial Stratagem' },
  logline: {
    zh: '血蓮魔尊墜崖之後三個月，中原武林為一卷《天劍譜》再起風雲。傳說它只是《天機策》的一半——得全策者，能算盡天下每一步棋。有人要用它救世，有人要用它稱王，更有人戴著別人的臉，在每一場宴席裡下毒。',
    en: 'Three months after the Blood Lotus Lord fell from the cliff, the martial world goes to war again over the Heavenly Sword Manual. It is said to be only half of the Celestial Stratagem: whoever holds the whole can foresee every move under heaven. Some want it to save the world, some to rule it — and someone wearing another man’s face is poisoning the cups at every feast.',
  },
  lore: [
    { zh: '天機策', en: 'The Celestial Stratagem', text: { zh: '上古奇書，記載武林氣運與人心的走向。分為兩卷：記劍招的《天劍譜》與記謀略的《地機卷》。兩卷合一，方見全策。二十年前《地機卷》失竊，下落不明。', en: 'An ancient book that records the tides of the martial world and of men’s hearts, in two halves: the Heavenly Sword Manual, of swordplay, and the Earthly Scroll, of strategy. Only together do they show the whole. Twenty years ago the Earthly Scroll was stolen, and no one knows where it went.' } },
    { zh: '三教', en: 'The Three Teachings', text: { zh: '儒門龍淵閣、道門太虛玄宗、佛門萬佛峰，鼎足中原，向來以「三教共議」裁決武林大事。', en: 'The Confucian Dragon Abyss Pavilion, the Taoist Void School and the Buddhist Peak of Ten Thousand Buddhas hold the heartland between them; great matters of the martial world are settled by the three together.' } },
    { zh: '幽冥魔域', en: 'The Netherworld', text: { zh: '武林之下的另一個世界，由幽冥帝君統治。血蓮教只是它伸到人間的一隻手。', en: 'Another world beneath this one, ruled by the Netherworld Emperor. The Blood Lotus cult was only the hand it put up into ours.' } },
  ],
  places: [
    { id: 'hall', zh: '龍淵閣', en: 'Dragon Abyss Pavilion', about: { zh: '儒門之首殷九霄的府邸，三教議事之地。', en: 'Seat of Yin Jiuxiao, first of the Confucians, where the Three Teachings meet.' } },
    { id: 'lotus', zh: '蓮心小築', en: 'Lotus Heart Retreat', about: { zh: '洛無塵隱居的水上小築，四面蓮池。', en: 'Luo Wuchen’s pavilion over the water, lotus ponds on every side.' } },
    { id: 'temple', zh: '萬佛峰', en: 'Peak of Ten Thousand Buddhas', about: { zh: '佛門聖地，渡世佛者無涯閉關之所。', en: 'The Buddhist holy mountain, where Wuya keeps his seclusion.' } },
    { id: 'bamboo', zh: '月下竹林', en: 'The Moonlit Bamboo', about: { zh: '第一回決戰之地，江湖人的必經之路。', en: 'Where the first duel was fought; every road of the martial world runs through it.' } },
    { id: 'cliff', zh: '太虛峰', en: 'Void Peak', about: { zh: '道門玄宗所在，雲海之上的孤峰。', en: 'Home of the Taoist Void School, a lone peak over the sea of clouds.' } },
    { id: 'abyss', zh: '幽冥魔域', en: 'The Netherworld', about: { zh: '火光從地縫裡透出來的黑色大地。', en: 'A black land, fire showing through its cracks.' } },
  ],
  factions: [
    { zh: '江湖散人', en: 'Free swords', who: ['luo', 'guhong', 'wei', 'qian', 'ling', 'yan', 'yue'] },
    { zh: '三教', en: 'The Three Teachings', who: ['yin', 'baihe', 'wuya', 'huiming'] },
    { zh: '亦正亦邪', en: 'Neither good nor evil', who: ['yinyang'] },
    { zh: '魔', en: 'The demons', who: ['youming', 'ye', 'jingwang'] },
  ],
  // who they are, their move, the poem they enter with
  people: {
    luo: { about: { zh: '白衣清蓮，永遠帶著半分笑意的智者。他從不先出手，因為他出手時，局已經下完了。', en: 'The lotus in white, a wise man who always wears half a smile. He never strikes first: by the time he moves, the game is already over.' }, move: { zh: '蓮華劍氣・三千界', en: 'Lotus Sword Light: Three Thousand Worlds' }, poem: [['一蓮開時天下靜，', 'When the lotus opens, all under heaven is still;'], ['半笑之間局已成。', 'between half a smile and the next, the game is won.']] },
    wuya: { about: { zh: '萬佛峰的渡世佛者，閉關二十年。慈悲，但出掌從不留情。', en: 'The Buddha of the Crossing, twenty years in seclusion on the peak. Merciful — but his palm never holds back.' }, move: { zh: '大日佛印', en: 'Seal of the Great Sun' }, poem: [['一掌渡劫三千世，', 'One palm carries three thousand worlds across their trials;'], ['半念禪心萬古春。', 'half a thought of Zen, and it is spring for ten thousand years.']] },
    guhong: { about: { zh: '不說話的劍客，洛無塵唯一的生死之交。他的劍比他的沉默更快。', en: 'The swordsman who never speaks, Luo Wuchen’s one friend unto death. His sword is quicker than his silence.' }, move: { zh: '孤鴻一線', en: 'A Single Line of the Lone Goose' }, poem: [['孤鴻掠影無人問，', 'The lone goose flies by, and no one asks its name;'], ['一劍封喉不留聲。', 'one stroke at the throat, and not a sound.']], voice: 'narrator' },
    wei: { about: { zh: '赤心狂客，一生只想勝過洛無塵。驕傲、衝動，但比誰都講義氣。', en: 'The red-hearted madman, who wants only to beat Luo Wuchen. Proud and rash — and more loyal than anyone.' }, move: { zh: '狂龍斷天', en: 'Mad Dragon Severs Heaven' }, poem: [['狂歌一曲天地窄，', 'One wild song, and heaven and earth grow narrow;'], ['一刀能裁萬古愁。', 'one blade can cut ten thousand years of grief.']] },
    qian: { about: { zh: '號稱「假仙仔」的情報販子，消息比誰都靈通，膽子比誰都小，兩邊收錢。', en: 'The “fake immortal”, an informant who knows everything first, is afraid of everything, and takes money from both sides.' }, move: { zh: '腳底抹油', en: 'Oiled Heels (running away)' }, poem: [['江湖消息我最通，', 'Nobody knows the news of the world like me;'], ['有錢就是好朋友！', 'pay me, and we’re the best of friends!']] },
    yin: { about: { zh: '儒門之首、龍淵閣主，溫文爾雅，一把摺扇從不離手。人人都說他是正道的支柱。', en: 'First of the Confucians, master of the Dragon Abyss Pavilion: refined, gentle, never without his fan. Everyone calls him the pillar of the righteous.' }, move: { zh: '九霄扇風', en: 'Wind of the Nine Heavens' }, poem: [['龍淵深處藏風雨，', 'In the deeps of the Dragon Abyss, storms lie hidden;'], ['一扇輕搖定九州。', 'one light wave of the fan, and the nine provinces are settled.']] },
    baihe: { about: { zh: '太虛玄宗的劍仙，嗜酒、愛笑，劍陣天下第一。', en: 'The sword immortal of the Void School: fond of wine, quick to laugh, and master of the finest sword formation in the world.' }, move: { zh: '太虛劍陣', en: 'Sword Formation of the Void' }, poem: [['醉臥白雲三千年，', 'Drunk among the white clouds for three thousand years;'], ['一劍西來不問天。', 'my sword comes from the west and asks heaven nothing.']] },
    jingwang: { about: { zh: '鏡湖之主，沒有人見過他真正的臉。他能變成任何人——包括你身邊的人。', en: 'Master of the Mirror Lake. No one has seen his real face. He can become anyone — even the one beside you.' }, move: { zh: '萬象鏡光', en: 'Mirror Light of Ten Thousand Forms' }, poem: [['千面之下無真我，', 'Beneath a thousand faces, there is no true self;'], ['一鏡照盡世人心。', 'one mirror shows every heart in the world.']] },
    huiming: { about: { zh: '無涯佛者的弟子，代師出席三教大會。年輕、溫和，人人喜歡他。', en: 'Wuya’s disciple, who comes to the council in his master’s place. Young, gentle, liked by all.' }, move: { zh: '—', en: '—' }, poem: null },
    yinyang: { about: { zh: '半黑半白的陰陽郎君，最大的樂趣是看別人互相猜忌。他不站在任何一邊——除了最好玩的那一邊。', en: 'The Yin-Yang Gentleman, half black and half white, whose greatest joy is watching others suspect each other. He takes no side — except the most amusing one.' }, move: { zh: '陰陽逆亂', en: 'Yin and Yang in Chaos' }, poem: [['白日看人笑，黑夜看人哭；', 'By day I watch men laugh, by night I watch them weep;'], ['天下最樂事，看你們互相毒。', 'the sweetest thing under heaven is to watch you poison each other.']] },
    youming: { about: { zh: '幽冥魔域之主，二十年來在武林之下等待。他要的不是天機策，是整個人間。', en: 'Lord of the Netherworld, who has waited twenty years beneath the martial world. It is not the Stratagem he wants. It is the whole world of men.' }, move: { zh: '幽冥滅世', en: 'The Netherworld Ends the World' }, poem: [['幽冥無日月，', 'In the Netherworld there is no sun, no moon;'], ['帝座鎮乾坤。', 'my throne holds down heaven and earth.']] },
    yue: { about: { zh: '冷月仙子，來自鏡湖的女子。她知道千面鏡王的秘密，因為她曾經是他最信任的人。', en: 'The Cold Moon Fairy, a woman from the Mirror Lake. She knows the Mirror King’s secret, because once she was the one he trusted most.' }, move: { zh: '寒月九折', en: 'Nine Folds of the Cold Moon' }, poem: [['冷月無聲照鏡湖，', 'The cold moon shines on the Mirror Lake without a sound;'], ['一身清寒不染塵。', 'all of me cold and clear, untouched by dust.']] },
    ling: { about: { zh: '白衣劍子，第一回中以「一劍・月華」擊落血蓮魔尊。沉穩正直。', en: 'The White-Robed Sword, who struck the Blood Lotus Lord from the cliff with One Sword: Moonlight in Part One. Steady and upright.' }, move: { zh: '霜天一劍', en: 'Frost Sky, One Sword' }, poem: [['一劍霜寒照九州，', 'One sword, frost-cold, over the nine provinces;'], ['白衣不染世間愁。', 'a white robe the sorrows of the world cannot stain.']] },
    yan: { about: { zh: '紅綾燕飛霜，《天劍譜》的守護者。外表倔強，心比誰都軟。', en: 'Red Silk, Yan Feishuang, keeper of the Heavenly Sword Manual. Stubborn outside, softer than anyone within.' }, move: { zh: '紅綾雙刃', en: 'Twin Blades of Red Silk' }, poem: null },
    ye: { about: { zh: '血蓮魔尊，墜崖不死，被幽冥帝君重塑為魔域先鋒。', en: 'The Blood Lotus Lord, who did not die when he fell, remade by the Netherworld Emperor as his vanguard.' }, move: { zh: '幽冥九掌', en: 'Nine Palms of the Netherworld' }, poem: [['血蓮再開萬骨枯，', 'The blood lotus opens again, and ten thousand bones run dry;'], ['九幽歸來我為屠。', 'back from the Nine Netherworlds, I am the slaughter.']] },
  },
  episodes: [
    { n: 1, zh: '蓮出江湖', en: 'The Lotus Comes Forth', about: { zh: '龍淵閣三教大會，眾人爭論《天劍譜》的去留。洛無塵乘蓮風而來。慧明飲下迎賓酒當場身亡，酒杯來自燕飛霜的席位——人人指向她，只有洛無塵看出：毒，不在酒中。', en: 'At the council in the Dragon Abyss Pavilion the Three Teachings argue over the Heavenly Sword Manual. Luo Wuchen arrives on a wind of lotus petals. Huiming drinks the welcome wine and falls dead; the cup came from Yan Feishuang’s table. Everyone points at her. Only Luo Wuchen sees that the poison was not in the wine.' } },
    { n: 2, zh: '啞劍孤鴻', en: 'The Mute Sword', about: { zh: '雨夜竹林。錢不二兩頭收錢，把燕飛霜的行蹤賣給血蓮，又跑去通風報信。孤鴻在雨中現身，一劍封喉。蓮心小築裡，洛無塵說出天機策的秘密。', en: 'A rainy night in the bamboo. Qian Bu’er sells Yan Feishuang’s whereabouts to the Blood Lotus and then runs to warn her — paid by both. Gu Hong appears in the rain. At the Lotus Heart Retreat, Luo Wuchen tells the secret of the Celestial Stratagem.' } },
    { n: 3, zh: '陰陽一笑', en: 'The Yin-Yang Laugh', about: { zh: '陰陽郎君擄走燕飛霜，要洛無塵與魏無憂決鬥給他看。兩人假戲真做，反將一軍。魔域深處，一個死去的人睜開了眼睛。', en: 'The Yin-Yang Gentleman carries off Yan Feishuang and demands that Luo Wuchen and Wei Wuyou duel for his amusement. They stage a fight and turn the tables on him. Deep in the Netherworld, a dead man opens his eyes.' } },
    { n: 4, zh: '魔影重臨', en: 'The Demon Returns', about: { zh: '夜無極血洗太虛峰。白鶴子劍陣迎敵，凌雲霄再戰魔尊，卻敗在新的幽冥掌下。殷九霄「來遲一步」——順手帶走了一樣東西。', en: 'Ye Wuji falls upon Void Peak. Baihe Zi meets him with his sword formation; Ling Yunxiao faces the Demon Lord again and is struck down by a new Netherworld palm. Yin Jiuxiao arrives “a moment too late” — and quietly takes something away.' } },
    { n: 5, zh: '佛者一掌', en: 'One Palm of the Buddha', about: { zh: '無涯佛者出關，大日佛印逼退夜無極。可當夜，有人看見佛者親手殺了太虛玄宗的長老。', en: 'Wuya ends his seclusion, and the Seal of the Great Sun drives Ye Wuji back. But that night, witnesses see the Buddha himself kill an elder of the Void School.' } },
    { n: 6, zh: '借刀殺人', en: 'A Borrowed Knife', about: { zh: '殷九霄召集三教審判無涯。暗地裡，他與千面鏡王結盟。洛無塵登門品茶，兩人笑裡藏刀。錢不二偷聽被抓，洛無塵以一計救人。', en: 'Yin Jiuxiao calls the Three Teachings to judge Wuya. In secret he has made a pact with the Mirror King. Luo Wuchen calls on him for tea, and the two trade smiles with knives behind them. Qian Bu’er is caught eavesdropping; Luo Wuchen saves him with a trick.' } },
    { n: 7, zh: '蓮君之死', en: 'Death of the Lotus Guest', about: { zh: '蓮心小築中伏。殷九霄、千面鏡王、夜無極三面夾擊，孤鴻死守斷橋。洛無塵中掌落水，一池白蓮盡染成紅。', en: 'An ambush at the Lotus Heart Retreat. Yin Jiuxiao, the Mirror King and Ye Wuji strike from three sides; Gu Hong holds the broken bridge. Luo Wuchen is struck by the palm and falls into the pond, and every white lotus turns red.' } },
    { n: 8, zh: '鏡中真相', en: 'Truth in the Mirror', about: { zh: '冷月仙子現身，說出鏡王的秘密：大會上死去的慧明，從來沒有死。眾人重上萬佛峰，面具落下。', en: 'The Cold Moon Fairy appears and tells the Mirror King’s secret: Huiming, who died at the council, never died at all. They climb the peak again, and the mask comes off.' } },
    { n: 9, zh: '天機逆轉', en: 'The Stratagem Turns', about: { zh: '殷九霄合起兩卷，翻開卻是一片空白——真譜早被調包。洛無塵從蓮池中歸來。一切都是他的局。然而幽冥帝君親臨人間。', en: 'Yin Jiuxiao puts the two halves together and opens them: blank pages. The true manual was switched long ago. Luo Wuchen returns from the lotus pond — it was all his plan. And then the Netherworld Emperor himself comes up into the world.' } },
    { n: 10, zh: '萬劍歸蓮', en: 'Ten Thousand Swords Return to the Lotus', about: { zh: '決戰幽冥魔域。三教與群俠聯手，陰陽郎君在最後一刻倒戈。月光、佛光、劍光與蓮光，一同封印帝君。天亮時，洛無塵燒了天機策。', en: 'The last battle, in the Netherworld. The Three Teachings and the free swords fight together, and the Yin-Yang Gentleman changes sides at the last moment. Moonlight, Buddha light, sword light and lotus light seal the Emperor away. At dawn, Luo Wuchen burns the Stratagem.' } },
  ],
};
// each master's great techniques: what is cried out, and how it looks (compose.js strike kinds: wave, array, palm,
// dash, rain — swords falling from the sky, ring — blades round the caster flying in, pillar — a column of light
// from heaven, dragon — a spiral of power)
export const MOVES = {
  luo: [['蓮華劍氣・三千界', 'Lotus Sword Light: Three Thousand Worlds', 'array'], ['清蓮渡劫', 'The Clear Lotus Crosses the Trial', 'dragon'], ['一蓮天下靜', 'One Lotus, and the World Is Still', 'pillar']],
  wuya: [['大日佛印', 'Seal of the Great Sun', 'palm'], ['金剛伏魔', 'Vajra Subdues the Demon', 'pillar'], ['萬佛朝宗', 'Ten Thousand Buddhas Gather', 'ring']],
  guhong: [['孤鴻一線', 'A Single Line of the Lone Goose', 'dash'], ['寒鴻落雪', 'Cold Geese Bring the Snow', 'rain']],
  wei: [['狂龍斷天', 'Mad Dragon Severs Heaven', 'wave'], ['赤焰焚城', 'Red Flame Burns the City', 'dragon'], ['狂刀亂舞', 'Wild Blades Dance', 'array']],
  yin: [['九霄扇風', 'Wind of the Nine Heavens', 'wave'], ['龍淵吞日', 'The Dragon Abyss Swallows the Sun', 'dragon'], ['扇裡乾坤', 'Heaven and Earth in a Fan', 'ring']],
  baihe: [['太虛劍陣', 'Sword Formation of the Void', 'array'], ['醉劍・西來', 'Drunken Sword from the West', 'rain'], ['太極歸元', 'The Great Ultimate Returns', 'ring']],
  jingwang: [['萬象鏡光', 'Mirror Light of Ten Thousand Forms', 'array'], ['千面鏡殺', 'Death in a Thousand Mirrors', 'ring'], ['鏡花水月', 'Flowers in a Mirror, the Moon in Water', 'dragon']],
  yinyang: [['陰陽逆亂', 'Yin and Yang in Chaos', 'array'], ['黑白無常', 'The Black and White Reapers', 'dragon'], ['天地反覆', 'Heaven and Earth Overturned', 'pillar']],
  youming: [['幽冥滅世', 'The Netherworld Ends the World', 'array'], ['九幽天降', 'The Nine Hells Fall from Heaven', 'rain'], ['帝魔吞天', 'The Demon Emperor Devours Heaven', 'pillar']],
  yue: [['寒月九折', 'Nine Folds of the Cold Moon', 'array'], ['冷月葬花', 'The Cold Moon Buries the Flowers', 'rain'], ['月落鏡湖', 'The Moon Sets in the Mirror Lake', 'ring']],
  ling: [['霜天一劍', 'Frost Sky, One Sword', 'wave'], ['雪落千山', 'Snow on a Thousand Mountains', 'rain'], ['一劍・月華', 'One Sword: Moonlight', 'wave']],
  yan: [['紅綾雙刃', 'Twin Blades of Red Silk', 'dash'], ['飛霜漫天', 'Flying Frost Fills the Sky', 'rain']],
  ye: [['幽冥九掌', 'Nine Palms of the Netherworld', 'palm'], ['血蓮萬骨', 'Blood Lotus of Ten Thousand Bones', 'dragon'], ['九幽血海', 'Sea of Blood of the Nine Hells', 'pillar']],
  envoy: [['血蓮刀', 'Blood Lotus Blade', 'wave']],
  elder: [['青松劍氣', 'Green Pine Sword Light', 'wave']],
};
export const poemOf = (id) => WORLD.people[id]?.poem;
