// 《天機策》第一集　蓮出江湖 / Episode 1: The Lotus Comes Forth. About ten minutes.
// Three months after the duel under the moon. Ling Yunxiao brings Yan Feishuang and the Heavenly Sword Manual to the
// council of the Three Teachings at the Dragon Abyss Pavilion. Yin Jiuxiao would keep it "safe"; Wei Wuyou would win it
// with his blade; Luo Wuchen comes down on a wind of lotus petals and proposes it be sealed by all three. The toast
// is drunk — and Huiming falls dead, poisoned, the cup from Yan's own table. Everyone turns on her; Ling holds them off
// while she gets away; only Luo sees that the poison was never in the wine. That night, by the body, a silver mask.
import { episode } from './compose.js?v=15';
import { poemOf } from './world.js?v=15';

const E = episode({
  id: 's1', plaque: '蓮出江湖',
  title: { zh: ['掌中劍・天機策', '第一集　蓮出江湖', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 1: The Lotus Comes Forth', ''] },
  end: { zh: ['天機策　第一集　蓮出江湖', '欲知慧明死因　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 1', 'Who killed Huiming, the next episode will tell'] },
  cast: ['ling', 'yan', 'qian', 'yin', 'baihe', 'huiming', 'wei', 'luo', 'jingwang', 'guhong'],
});

// ---------------------------------------------------------------- the bamboo: three months on
E.open('bamboo', { sky: 'moon', mood: 'calm', place: { ling: [-6, 0.4, 90], yan: [-6.8, -0.5, 90] } });
E.narrate('三月之前，月下一劍，血蓮魔尊墜落雲海。', 'Three months ago, one sword under the moon sent the Blood Lotus Lord down into the sea of clouds.');
E.move('ling', -1.5, 0.4, { d: 4, wait: false }); E.move('yan', -2.3, -0.5, { d: 4, shot: false });
E.narrate('然而江湖的風雨，從來不會因為一個人的死而停歇。', 'But the storms of the martial world have never stopped for one man’s death.', { on: 'ling' });
E.say('yan', '凌大俠，這卷劍譜……真要交給三教嗎？', 'Master Ling, the manual... must we really give it to the Three Teachings?', { to: 'ling' });
E.say('ling', '它在妳身上一天，妳就一天不得安寧。', 'As long as you carry it, you will never have a day’s peace.', { to: 'yan' });
E.say('ling', '龍淵閣的三教大會，會給它一個去處。', 'The council at the Dragon Abyss Pavilion will find it a home.', { to: 'yan' });
E.say('yan', '我只怕，三教之中，也有想要它的人。', 'I only fear that even among the Three Teachings, someone wants it.', { to: 'ling', act: 'think' });
E.enter('qian', { how: 'leap', at: [1.2, 1.6], face: 'ling', poem: poemOf('qian'), gong: false, weapon: false });
E.say('ling', '錢不二。你在這裡做什麼？', 'Qian Bu’er. What are you doing here?', { to: 'qian' });
E.say('qian', '做什麼？當然是做生意啊！兩位要去龍淵閣，對不對？', 'Doing? Business, of course! You two are going to the Dragon Abyss Pavilion, aren’t you?', { to: 'ling', act: 'fan' });
E.say('qian', '我勸兩位別去……除非，給我十兩銀子，我告訴你們為什麼。', 'I advise you not to go... unless you give me ten taels of silver, and I tell you why.', { to: 'ling', act: 'point' });
E.act('ling', 'point', { d: 1.2 }).sfx('hit', { k: 0.15 });
E.say('qian', '嘿嘿，爽快！因為——去的人，不一定回得來！', 'Hee hee, generous! Because — those who go don’t always come back!', { to: 'ling', act: 'laugh' });
E.exit('qian', { how: 'leap', d: [3, 2] });
E.say('yan', '……他收了錢，就說這個？', '...He took the money to tell us that?', { to: 'ling', act: 'shock' });
E.say('ling', '錢不二的消息，從來不是白賣的。走吧。', 'Qian Bu’er never sells news for nothing. Come.', { to: 'yan' });

// ---------------------------------------------------------------- the Dragon Abyss Pavilion: the council
E.scene('hall', { sky: 'dusk', mood: 'tense', place: { baihe: [1.5, -3.4, 0], huiming: [1.5, 3.4, 180] } });
E.narrate('龍淵閣。儒門之首殷九霄，召集三教，共議天劍譜的去留。', 'The Dragon Abyss Pavilion. Yin Jiuxiao, first of the Confucians, has called the Three Teachings to decide the fate of the Heavenly Sword Manual.', { wide: true });
E.enter('yin', { how: 'walk', at: [7.0, 0], from: [3, 0], face: -90, poem: poemOf('yin') });
E.say('yin', '白鶴道長，慧明小師父，兩位遠道而來，九霄有禮了。', 'Master Baihe, young Master Huiming — you have come far. Jiuxiao greets you.', { to: 'baihe', act: 'bow' });
E.say('huiming', '家師無涯閉關未出，命小僧代為列席，請閣主見諒。', 'My master Wuya is still in seclusion, and sent me in his place. I beg the Pavilion Master’s pardon.', { to: 'yin', act: 'bow' });
E.say('baihe', '哈哈，殷兄的酒，貧道可是三年前就惦記上了！', 'Ha ha! I have been thinking about Brother Yin’s wine for three years!', { to: 'yin', act: 'laugh' });
E.say('yin', '道長放心，今夜的酒，管夠。', 'Rest easy, Master. Tonight there is wine enough for all.', { to: 'baihe', act: 'fan' });
E.move('ling', -2.5, 0.8, { d: 3.4, wait: false }); E.move('yan', -3.2, -0.4, { d: 3.4, shot: false }); E.face('ling', 'yin', E.t); E.face('yan', 'yin', E.t);
E.say('yin', '凌少俠、燕姑娘，一路辛苦。劍譜……可帶來了？', 'Young Master Ling, Miss Yan — a hard road. The manual... have you brought it?', { to: 'ling' });
E.say('yan', '帶來了。但我要先聽聽，三教打算怎麼處置它。', 'I have. But first I want to hear what the Three Teachings mean to do with it.', { to: 'yin', act: 'angry' });
E.say('yin', '劍譜事關天下，流落江湖，只會引來更多的血。', 'The manual concerns all under heaven. Loose in the world, it will only draw more blood.', { to: 'yan' });
E.say('yin', '九霄的意思，不如由龍淵閣代為保管，三教共守。', 'My thought is that the Pavilion keep it in trust, guarded by the three of us together.', { to: 'baihe', act: 'fan' });
E.say('baihe', '保管保管，保著保著，就保成自己的了。哈哈哈！', 'Keep it in trust — and keep it, and keep it, until it’s yours. Ha ha ha!', { to: 'yin', act: 'laugh' });
E.say('yin', '道長說笑了。', 'You jest, Master.', { to: 'baihe', close: true });
E.enter('wei', { how: 'leap', at: [-0.8, 2.0], face: 'yin', poem: poemOf('wei') });
E.say('wei', '三教議事？議來議去，不過是誰的拳頭硬，誰說了算！', 'A council of the Three Teachings? Talk all you like — the hardest fist decides!', { to: 'yin', act: 'angry' });
E.say('yin', '魏無憂。龍淵閣，似乎沒有發帖子給你。', 'Wei Wuyou. I do not recall the Pavilion sending you an invitation.', { to: 'wei', act: 'fan' });
E.say('wei', '我魏無憂去哪裡，從來不需要帖子。', 'Wherever Wei Wuyou goes, he has never needed one.', { to: 'yin' });
E.say('wei', '凌雲霄，聽說你一劍擊落了血蓮魔尊？我不信。', 'Ling Yunxiao. They say you struck the Blood Lotus Lord down with one sword. I don’t believe it.', { to: 'ling', act: 'point' });
E.say('ling', '你信不信，與我無關。', 'What you believe is no concern of mine.', { to: 'wei' });
E.say('wei', '那就讓我的刀，來問問你的劍！', 'Then let my blade ask your sword!', { to: 'ling', act: 'angry' });
E.duel('wei', 'ling', { d: 16, end: 'apart' });
E.enter('baihe', { how: 'leap', at: [-1.6, 1.2], from: [3.2, -4.6], face: 'wei', poem: poemOf('baihe') });
E.say('baihe', '好了好了！在龍淵閣動刀，你叫殷兄的面子往哪兒擺？', 'Enough, enough! Drawing blades in the Dragon Abyss Pavilion — where would that leave Brother Yin’s honour?', { to: 'wei', act: 'laugh' });
E.say('wei', '……哼。今天算你運氣好。', '...Hmph. You’re lucky today.', { to: 'ling' });
E.say('yin', '諸位都是為了天下，何必傷了和氣。', 'Every one of us is here for the sake of the world. Why spoil the peace between us?', { to: 'wei', act: 'fan' });
// the lotus
E.wait(1.2, { cam: 'wide' }).sfx('leaves', { at: [600, 6, 0], k: 1.4, col: '#ffb8d0' });
E.say('yin', '……這股蓮香？', '...That scent of lotus?', { to: 'baihe', act: 'shock' });
E.enter('luo', { how: 'lotus', at: [0.2, -0.4], face: 'yin', poem: poemOf('luo'), k: 1.2 });
E.say('baihe', '洛無塵！你這隻閒雲野鶴，居然也肯出山？', 'Luo Wuchen! You idle crane of the clouds — even you would come down from your mountain?', { to: 'luo', act: 'laugh' });
E.say('luo', '天下的熱鬧都在這裡，無塵豈能錯過。', 'All the excitement under heaven is here. How could Wuchen miss it?', { to: 'baihe', act: 'whisk' });
E.say('yin', '洛先生大駕光臨，龍淵閣蓬蓽生輝。不知先生對劍譜，有何高見？', 'Master Luo honours the Pavilion with his presence. What is your view of the manual, sir?', { to: 'luo', act: 'bow' });
E.say('luo', '高見不敢。劍譜，不該歸任何一人，也不該歸任何一門。', 'No great view. The manual should belong to no one man — and to no one school.', { to: 'yin', act: 'whisk' });
E.say('luo', '三教各出一道封印，共封於萬佛峰。誰也拿不走，誰也不必猜忌誰。', 'Let each of the Three Teachings set its own seal on it, and lay it on the Peak of Ten Thousand Buddhas. No one can take it; no one need suspect another.', { to: 'yin' });
E.say('huiming', '阿彌陀佛。洛先生此言，正合家師之意。', 'Amitabha. Master Luo’s words are exactly my master’s wish.', { to: 'luo', act: 'bow' });
E.say('baihe', '好！貧道也贊成。殷兄，你說呢？', 'Good! I agree too. Brother Yin, what do you say?', { to: 'yin' });
E.say('yin', '……洛先生思慮周全，九霄佩服。', '...Master Luo has thought of everything. I am impressed.', { to: 'luo', act: 'fan', close: true });
E.say('yin', '既然如此，便以酒為誓。來，諸位滿飲此杯！', 'Then let us swear it on wine. Come — everyone, drain your cups!', { to: 'baihe', act: 'point' });
E.move('yan', -2.0, -1.6, { d: 1.6, face: 'huiming', shot: false, wait: false });
E.narrate('一杯酒，從燕飛霜的席上傳到了慧明手中。', 'A cup of wine passed from Yan Feishuang’s table into Huiming’s hands.', { on: 'huiming' });
E.say('huiming', '小僧以茶代酒……不，今日破例，就飲這一杯。', 'I would take tea for wine... no. Today I will make an exception, and drink this one cup.', { to: 'yin', act: 'bow' });
E.act('huiming', 'think', { d: 1.6, cam: 'close' });
E.act('huiming', 'stagger', { d: 1.0, cam: 'mid' }).sfx('hit', { k: 0.4 });
E.say('huiming', '這……這酒……', 'This... this wine...', { to: 'yin', act: 'shock', close: true });
E.act('huiming', 'die', { d: 2.2, cam: 'wide' }); E.hit(E.t - 2.0, 1.6); E.music.push({ hit: 'gong', t: E.t - 2.0, g: 1.0 });
E.say('baihe', '慧明！', 'Huiming!', { to: 'huiming', act: 'shock' });
E.say('yin', '有毒！這杯酒……是從燕姑娘的席上傳過來的！', 'Poison! This cup... it came from Miss Yan’s table!', { to: 'yan', act: 'point' });
E.say('wei', '是妳？！', 'You?!', { to: 'yan', act: 'angry', close: true });
E.say('yan', '不是我！我根本不知道……', 'It wasn’t me! I didn’t even know —', { to: 'wei', act: 'shock' });
E.say('yin', '慧明小師父代表萬佛峰。他死在這裡，我們如何向無涯佛者交代？拿下她！', 'Young Master Huiming spoke for the Peak. He died here — how do we answer to the Buddha Wuya? Seize her!', { to: 'wei', act: 'point' });
E.move('ling', -2.6, -0.7, { d: 0.8, face: 'wei', glide: true });
E.say('ling', '燕姑娘，走！', 'Miss Yan — go!', { to: 'yan', close: true });
E.duel('ling', 'wei', { d: 12, end: 'apart' });
E.exit('yan', { how: 'leap', d: [-4, 0] });
E.say('luo', '且慢。', 'Wait.', { to: 'wei', act: 'whisk' });
E.say('wei', '洛無塵，你要攔我？', 'Luo Wuchen — you’d stand in my way?', { to: 'luo', act: 'angry' });
E.say('luo', '無塵不攔你。只是，人死了，總要先看看他是怎麼死的。', 'Wuchen does not stop you. Only — when a man dies, one should first see how he died.', { to: 'wei' });
E.move('luo', 1.2, 2.6, { d: 2.2, face: 'huiming' });
E.act('luo', 'think', { d: 2.0, cam: 'low' });
E.say('ling', '洛先生……', 'Master Luo...', { to: 'luo' });
E.say('luo', '凌少俠，去追燕姑娘吧。今夜，她比你更需要你的劍。', 'Young Master Ling, go after Miss Yan. Tonight she needs your sword more than you do.', { to: 'ling' });
E.exit('ling', { how: 'leap', d: [-4, 0] });
E.say('yin', '洛先生，你這是在包庇兇手？', 'Master Luo — are you shielding the murderer?', { to: 'luo', act: 'fan' });
E.say('luo', '殷閣主言重了。無塵只是在等——', 'You say too much, Pavilion Master. Wuchen is only waiting —', { to: 'yin', act: 'whisk' });
E.say('luo', '等真正的兇手，自己走出來。', 'waiting for the true murderer to show himself.', { to: 'yin', close: true });
E.say('yin', '……哈哈。那九霄，就陪先生慢慢地等。', '...Ha ha. Then I shall wait with you, sir, as long as it takes.', { to: 'luo', act: 'laugh', close: true });
E.wait(1.6, { cam: 'two', on: 'luo', to: 'yin' });
E.say('luo', '（毒，不在酒中。在杯上……不。杯上也沒有。）', '(The poison was not in the wine. On the cup, then... no. Not on the cup either.)', { close: true, act: 'think' });
E.say('luo', '（這個人，根本不是中毒死的。）', '(This man did not die of poison at all.)', { close: true });

// ---------------------------------------------------------------- the bamboo: the two of them, hunted
E.scene('bamboo', { sky: 'moon', mood: 'tense', place: { yan: [1.0, -0.6, -90] }, est: 3 });
E.enter('ling', { how: 'leap', at: [-1.2, 0.4], from: [-5, 1], face: 'yan', aura: 2, gong: false });
E.say('yan', '凌大俠……你也覺得是我下的毒嗎？', 'Master Ling... do you think I poisoned him too?', { to: 'ling', act: 'shock' });
E.say('ling', '妳若要殺人，不會用毒。更不會用自己席上的杯子。', 'If you wanted to kill a man, you would not use poison. Still less a cup from your own table.', { to: 'yan' });
E.say('yan', '那是誰？誰要害我？', 'Then who? Who would do this to me?', { to: 'ling', act: 'angry' });
E.say('ling', '不是要害妳。是要所有人，都去追妳——和妳身上的劍譜。', 'Not to do it to you. To make everyone chase you — and the manual you carry.', { to: 'yan', act: 'think' });
E.enter('qian', { how: 'leap', at: [0.2, 1.8], from: [3, 3], face: 'ling', gong: false, weapon: false, aura: 1 });
E.say('qian', '哎呀呀，兩位還在這裡聊天？大事不好了！', 'Oh dear, oh dear — you two are still standing here chatting? Disaster!', { to: 'ling', act: 'shock' });
E.say('qian', '龍淵閣已經發出江湖追殺令——燕姑娘的人頭，懸賞一萬兩！', 'The Dragon Abyss Pavilion has put out a warrant — ten thousand taels for Miss Yan’s head!', { to: 'yan', act: 'point' });
E.say('yan', '一萬兩？！', 'Ten thousand?!', { to: 'qian', act: 'shock', close: true });
E.say('qian', '是啊，我看了都心動……啊不是，我是說，我錢不二是講義氣的人！', 'Yes — I was tempted myself... I mean, no! I, Qian Bu’er, am a man of honour!', { to: 'yan', act: 'laugh' });
E.say('ling', '這個消息，你賣給了幾個人？', 'How many people have you sold this news to?', { to: 'qian' });
E.say('qian', '……三個。不，四個。兩位，趕快走吧！', '...Three. No, four. You two had better run!', { to: 'ling', act: 'bow' });
E.exit('qian', { how: 'leap', d: [4, 2] });
E.say('ling', '先離開竹林。天亮以前，我們要找一個沒有人想得到的地方。', 'Out of the bamboo first. Before dawn we must find somewhere no one would think of.', { to: 'yan' });
E.exit('ling', { how: 'leap', d: [-3, -1] }); E.exit('yan', { how: 'leap', d: [-3, 1] });

// ---------------------------------------------------------------- the pavilion, empty: its master alone
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90] }, est: 3 });
E.say('yin', '洛無塵……天下最聰明的人，偏偏總是最礙事的人。', 'Luo Wuchen... the cleverest man under heaven, and always the one most in the way.', { act: 'fan', cam: 'low' });
E.say('yin', '你要等兇手走出來？好啊。', 'You want to wait for the murderer to show himself? Very well.', { act: 'laugh' });
E.say('yin', '九霄就讓你看看，這個江湖，最後走出來的，會是誰。', 'I shall let you see who it is, in the end, that walks out of this world.', { close: true });

// ---------------------------------------------------------------- the lotus pond: the master and his silent sword
E.scene('lotus', { sky: 'moon', mood: 'calm', place: { luo: [0.5, -1.0, 180] } });
E.narrate('蓮心小築。洛無塵回到池上的時候，有一個人，已經在橋頭等了很久。', 'The Lotus Heart Retreat. When Luo Wuchen came back over the pond, someone had been waiting at the bridge a long time.', { wide: true });
E.enter('guhong', { how: 'walk', at: [0.4, 3.2], from: [0, 6], face: 'luo', poem: poemOf('guhong'), voice: 'narrator' });
E.say('luo', '孤鴻。你都看見了。', 'Gu Hong. You saw everything.', { to: 'guhong' });
E.act('guhong', 'nod', { d: 1.4, cam: 'close' });
E.say('luo', '慧明死了，可他不是中毒死的。有人要燕姑娘背這個罪名，要她帶著劍譜，一路逃，一路被人追。', 'Huiming is dead, but not of poison. Someone wants Miss Yan to carry the blame — to run with the manual, hunted every step of the way.', { to: 'guhong', act: 'whisk' });
E.say('luo', '逃得越遠，劍譜就越容易，落進那個人的手裡。', 'The further she runs, the easier the manual falls into that someone’s hands.', { to: 'guhong', act: 'think' });
E.say('luo', '去找她。別讓她死，也別讓任何人知道，是我讓你去的。', 'Find her. Do not let her die — and let no one know that I sent you.', { to: 'guhong' });
E.act('guhong', 'stance', { d: 1.2, cam: 'low' });
E.exit('guhong', { how: 'leap', d: [-3, 3] });
E.say('luo', '天機將動，人心先亂。這一局……才剛開始。', 'When heaven’s machinery stirs, men’s hearts are first to fall into disorder. This game... has only just begun.', { act: 'whisk', cam: 'low' });

// ---------------------------------------------------------------- that night: the body, and a silver mask
E.scene('hall', { sky: 'moon', mood: 'dark', place: { huiming: [1.5, 3.4, 180] }, est: 3 });
E.act('huiming', 'die', { d: 0.2, wait: false });
E.narrate('夜深。龍淵閣中，只剩一具冰冷的屍首。', 'Deep in the night. In the Pavilion, only a cold body remains.', { wide: true });
E.enter('jingwang', { how: 'appear', at: [0.4, 2.2], face: 'huiming', poem: poemOf('jingwang'), aura: 6 });
E.say('jingwang', '睡得好嗎，慧明小師父？', 'Sleeping well, young Master Huiming?', { to: 'huiming', act: 'laugh' });
E.say('jingwang', '你這張臉，本王……很喜歡。', 'That face of yours... I like it very much.', { to: 'huiming', close: true });
E.say('jingwang', '洛無塵啊洛無塵。你在等兇手？兇手，就在你們每一個人的身邊。', 'Luo Wuchen, Luo Wuchen. You are waiting for the murderer? The murderer is beside every one of you.', { act: 'laugh' });
E.exit('jingwang', { how: 'fade' });
E.scene('bamboo', { sky: 'moon', mood: 'sad', est: 3 });
E.narrate('一杯毒酒，兩卷天機；千面之下，誰是真我？', 'One cup of poison, two halves of the Stratagem; beneath a thousand faces, which is the true one?');
E.narrate('欲知慧明死因，且看下回分解。', 'How Huiming truly died, the next episode will tell.');
export default E.done();
