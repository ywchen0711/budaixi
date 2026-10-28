// 《天機策》第二集　啞劍孤鴻 / Episode 2: The Mute Sword. About ten minutes.
// Rain in the bamboo. Qian Bu'er sells Yan Feishuang's hiding place to the Blood Lotus and her warning to Ling —
// paid twice. The envoys close in; then, out of the rain, Gu Hong, who never speaks, and his single line of a sword.
// At the Lotus Heart Retreat Luo Wuchen tells them what the manual really is, and what he saw on Huiming's body. In the
// Pavilion, Yin Jiuxiao and the Mirror King make their bargain. In the bamboo, Gu Hong has a word with Qian.
import { episode } from './compose.js?v=15';
import { poemOf } from './world.js?v=15';

const E = episode({
  id: 's2', plaque: '啞劍孤鴻',
  title: { zh: ['掌中劍・天機策', '第二集　啞劍孤鴻', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 2: The Mute Sword', ''] },
  end: { zh: ['天機策　第二集　啞劍孤鴻', '陰陽郎君將至　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 2', 'The Yin-Yang Gentleman comes next'] },
  cast: ['ling', 'yan', 'qian', 'guhong', 'luo', 'yin', 'jingwang', 'wei', 'baihe', ['e1', 'envoy'], ['e2', 'envoy'], ['e3', 'envoy'], ['e4', 'envoy']],
});

// ---------------------------------------------------------------- the bamboo, in the rain
E.open('bamboo', { sky: 'storm', mood: 'tense', rain: true, place: { ling: [-1.2, 0.6, 120], yan: [-1.8, -0.4, 100] } });
E.narrate('雨夜。江湖追殺令一出，天下人都在找燕飛霜。', 'A night of rain. Since the warrant went out, the whole world is looking for Yan Feishuang.');
E.say('yan', '凌大俠，你不必陪我。我一個人，比較好躲。', 'Master Ling, you don’t have to stay with me. Alone, I can hide more easily.', { to: 'ling' });
E.say('ling', '一個人，也比較好殺。', 'Alone, you can be killed more easily too.', { to: 'yan' });
E.say('yan', '……你這個人，說話一點都不好聽。', '...You really don’t know how to say anything nicely.', { to: 'ling', act: 'angry' });
E.say('ling', '好聽的話，救不了人。', 'Nice words have never saved anyone.', { to: 'yan', close: true });
E.enter('qian', { how: 'leap', at: [1.4, 1.8], from: [4, 3], face: 'ling', gong: false, weapon: false, aura: 1 });
E.say('qian', '呼……總算找到兩位了！血蓮的人往這邊來了，四個，個個帶刀！', 'Phew — found you at last! The Blood Lotus are coming this way. Four of them, all with blades!', { to: 'ling', act: 'point' });
E.say('ling', '你怎麼知道？', 'How do you know?', { to: 'qian' });
E.say('qian', '這個嘛……江湖消息，我錢不二最通。十兩，這次算你們便宜。', 'Well now... nobody knows the news of the world like Qian Bu’er. Ten taels — a bargain, this time.', { to: 'ling', act: 'fan' });
E.act('ling', 'point', { d: 1.0 });
E.say('qian', '多謝惠顧！往西走，別回頭！', 'Thank you kindly! Go west, and don’t look back!', { to: 'yan', act: 'bow' });
E.exit('qian', { how: 'leap', d: [4, -2] });

// ---------------------------------------------------------------- a little further on: the same man, another customer
E.scene('bamboo', { sky: 'storm', mood: 'dark', rain: true, place: { qian: [12, 0.6, -90], e1: [10, -0.6, 80] }, est: 2.5 });
E.say('e1', '燕飛霜在哪裡？', 'Where is Yan Feishuang?', { to: 'qian', act: 'angry' });
E.say('qian', '竹林西邊，三棵斷竹那裡。剛剛才走過去。', 'West of here, by the three broken bamboos. She just went that way.', { to: 'e1', act: 'point' });
E.say('e1', '你要是敢騙我們……', 'If you are lying to us...', { to: 'qian', close: true });
E.say('qian', '我錢不二做生意，最講信用！一百兩，童叟無欺。', 'I, Qian Bu’er, am the most honest man in business! A hundred taels — fair to young and old.', { to: 'e1', act: 'bow' });
E.act('e1', 'point', { d: 1.0 }).sfx('hit', { k: 0.12 });
E.exit('e1', { how: 'leap', d: [-4, 0] });
E.say('qian', '嘿嘿。做生意嘛，兩邊收錢，才叫生意。', 'Hee hee. That’s business: you get paid by both sides, or it isn’t business at all.', { act: 'laugh', cam: 'low' });
E.say('qian', '……只是，往西走的人，跟往西追的人，碰在一起會怎樣？我可就不管了。', '...Of course, what happens when the ones going west meet the ones chasing west — that’s not my concern.', { close: true, act: 'think' });

// ---------------------------------------------------------------- the ambush
E.scene('bamboo', { sky: 'storm', mood: 'tense', rain: true, place: { ling: [-3, 0.4, 90], yan: [-3.6, -0.4, 90] }, est: 2 });
E.move('ling', -1.0, 0.4, { d: 2.2, wait: false }); E.move('yan', -1.6, -0.5, { d: 2.2, shot: false });
E.say('ling', '……停。', '...Stop.', { to: 'yan', close: true });
E.say('yan', '怎麼了？', 'What is it?', { to: 'ling' });
E.say('ling', '雨裡，有刀的味道。', 'There’s the smell of blades in the rain.', { to: 'yan', act: 'think' });
for (const [id, x, z] of [['e1', 2.4, 0.6], ['e2', -0.4, 2.6], ['e3', 0.2, -2.6], ['e4', -4.6, 0.2]]) { E.enter(id, { how: 'descend', at: [x, z], face: 'ling', gong: false, aura: 1, weapon: false }); E.t -= 1.9; }
E.t += 2;
E.say('e1', '燕飛霜！交出劍譜，留妳全屍！', 'Yan Feishuang! Hand over the manual and we’ll leave your body whole!', { to: 'yan', act: 'point' });
E.say('yan', '每次都是這句話，你們血蓮就不能換一句嗎？', 'Always the same line. Can’t the Blood Lotus think of anything new?', { to: 'e1', act: 'angry' });
E.skirmish('ling', ['e1', 'e2', 'e3', 'e4'], { d: 16 });
E.say('e1', '一起上！先殺那個女的！', 'All together! Kill the woman first!', { to: 'e2', act: 'point' });
E.skirmish('yan', ['e2', 'e3'], { d: 8 });
E.act('ling', 'stagger', { d: 1.0, cam: 'mid' });
E.say('ling', '燕姑娘，小心背後！', 'Miss Yan — behind you!', { to: 'yan', close: true });
// out of the rain
E.wait(1.0, { cam: 'wide' });
E.enter('guhong', { how: 'walk', at: [-0.6, -1.6], from: [-6, -3], face: 'e3', poem: poemOf('guhong'), voice: 'narrator', aura: 6 });
E.say('e3', '你是誰？報上名來！', 'Who are you? Give us your name!', { to: 'guhong', act: 'point' });
E.act('guhong', 'stance', { d: 1.4, cam: 'close' });
E.narrate('他不說話。他從來不說話。', 'He did not speak. He never speaks.', { on: 'guhong' });
E.strike('guhong', 'e3', { kind: 'dash', result: 'kill' });
E.narrate('孤鴻一線。', 'A Single Line of the Lone Goose.', { on: 'guhong' });
E.strike('guhong', 'e2', { kind: 'dash', result: 'kill', power: 0.8 });
E.duel('guhong', 'e4', { d: 6, end: 'win:a', hold: 30 });
E.act('e4', 'die', { d: 1.2 });
E.say('e1', '……你、你到底是什麼人？', '...What — what are you?', { to: 'guhong', act: 'shock' });
E.strike('guhong', 'e1', { kind: 'dash', result: 'kill', power: 1.2 });
E.wait(2.0, { cam: 'wide' });
E.say('ling', '多謝閣下出手。閣下是……？', 'My thanks for your help. And you are...?', { to: 'guhong', act: 'bow' });
E.act('guhong', 'point', { d: 1.6, cam: 'mid' }).sfx('hit', { k: 0.12 });
E.say('yan', '一枚玉牌……上面刻的是，蓮花？', 'A jade token... with a lotus carved on it?', { to: 'ling', act: 'think' });
E.say('ling', '蓮心小築。是洛無塵的人。', 'The Lotus Heart Retreat. He is Luo Wuchen’s man.', { to: 'yan' });
E.exit('guhong', { how: 'walk', d: [-6, -2], wait: false });
E.say('yan', '他要我們跟他走？', 'He wants us to follow him?', { to: 'ling' });
E.say('ling', '走吧。至少今夜，那裡比竹林安全。', 'Come. Tonight, at least, it is safer than the bamboo.', { to: 'yan' });

// ---------------------------------------------------------------- the Lotus Heart Retreat: what the manual is
E.scene('lotus', { sky: 'moon', mood: 'calm', place: { luo: [1.2, -1.6, 200], ling: [-0.6, 1.6, 20], yan: [0.6, 1.8, 0], guhong: [3.8, 3.4, 230] } });
E.say('luo', '兩位，雨夜辛苦了。孤鴻，多謝。', 'You two had a hard night in the rain. Gu Hong — thank you.', { to: 'ling', act: 'bow' });
E.say('yan', '洛先生，你為什麼要救我？大會上，人人都說我是兇手。', 'Master Luo, why save me? At the council, everyone said I was the murderer.', { to: 'luo' });
E.say('luo', '人人都說的，不一定是真的。燕姑娘，劍譜，可否借無塵一觀？', 'What everyone says is not always true. Miss Yan — might Wuchen see the manual?', { to: 'yan', act: 'whisk' });
E.act('yan', 'think', { d: 1.6, cam: 'close' });
E.act('yan', 'point', { d: 1.4 });
E.say('luo', '果然。這不是一本完整的書。', 'Just as I thought. This is not a whole book.', { to: 'ling', act: 'think' });
E.say('ling', '不完整？', 'Not whole?', { to: 'luo' });
E.say('luo', '世人只知道天劍譜，卻不知道，它只是天機策的一半。', 'The world knows of the Heavenly Sword Manual, but not that it is only half of the Celestial Stratagem.', { to: 'ling', act: 'whisk' });
E.say('luo', '另一半，叫地機卷。一卷記劍，一卷記謀。合在一起，能算盡天下每一步棋。', 'The other half is the Earthly Scroll. One records the sword, the other strategy. Together, they foresee every move under heaven.', { to: 'ling' });
E.say('yan', '那地機卷在哪裡？', 'And where is the Earthly Scroll?', { to: 'luo' });
E.say('luo', '二十年前，被一個人偷走了。一個……沒有人見過他真面目的人。', 'Twenty years ago it was stolen. By a man... whose true face no one has ever seen.', { to: 'yan', act: 'think' });
E.say('ling', '洛先生，慧明的死，你看出了什麼？', 'Master Luo, what did you see in Huiming’s death?', { to: 'luo' });
E.say('luo', '那具屍首，唇不黑，指不青，身上沒有一點中毒的痕跡。', 'That body — the lips were not black, the nails not blue. Not one sign of poison.', { to: 'ling' });
E.say('luo', '而且，冷得太快了。快得……不像一個剛死的人。', 'And it grew cold too fast. Too fast... for a man who had only just died.', { to: 'ling', close: true });
E.say('ling', '你是說——', 'You mean —', { to: 'luo', act: 'shock' });
E.say('luo', '死在龍淵閣的，也許根本不是慧明。', 'The one who died in the Pavilion may not have been Huiming at all.', { to: 'ling', act: 'whisk' });
E.say('yan', '那會是誰？誰能在三教眼前，扮成另一個人？', 'Then who? Who could pass for another man under the eyes of the Three Teachings?', { to: 'luo', act: 'shock' });
E.say('luo', '能讓三教都看不出破綻的人，天下，只有一個。', 'Only one man under heaven could fool all three of them.', { to: 'yan', close: true });
E.wait(1.4, { cam: 'wide' });

// ---------------------------------------------------------------- the bridge, later: the two of them
E.scene('lotus', { sky: 'moon', mood: 'sad', place: { yan: [0.6, 9.5, 180], ling: [-0.4, 8.0, 20] }, est: 2.5 });
E.say('ling', '睡不著？', 'Can’t sleep?', { to: 'yan' });
E.say('yan', '我在想，那個慧明……如果死的不是他，那真正的慧明，又在哪裡？', 'I keep thinking about Huiming... If it wasn’t him who died, then where is the real Huiming?', { to: 'ling', act: 'think' });
E.say('ling', '也許，早就不在這世上了。', 'Perhaps no longer in this world at all.', { to: 'yan' });
E.say('yan', '我師父臨死前，把劍譜交給我。她說，守住它，就是守住天下。', 'My master gave me the manual as she was dying. She said: keep it safe, and you keep the world safe.', { to: 'ling', act: 'none' });
E.say('yan', '可是我現在連自己都守不住。', 'But now I can’t even keep myself safe.', { to: 'ling', close: true });
E.say('ling', '妳守著劍譜，我守著妳。這樣，就夠了。', 'You keep the manual. I’ll keep you. That will be enough.', { to: 'yan', close: true });
E.say('yan', '……你這個人，總算說了一句好聽的話。', '...So you can say something nice after all.', { to: 'ling', act: 'laugh' });
E.narrate('池上的月光很靜。可是靜的地方，往往藏著最多的聲音。', 'The moonlight on the pond was still. But it is in the still places that the most sounds hide.', { wide: true });

// ---------------------------------------------------------------- the bamboo: the madman hunting
E.scene('bamboo', { sky: 'moon', mood: 'tense', place: { wei: [-2, 0.4, 90], qian: [2.6, 0.2, -90] }, est: 2.5 });
E.say('wei', '錢不二！燕飛霜往哪裡跑了？', 'Qian Bu’er! Which way did Yan Feishuang run?', { to: 'qian', act: 'angry' });
E.say('qian', '魏、魏大俠！這個消息，可是很貴的……', 'Master — Master Wei! That news is very expensive...', { to: 'wei', act: 'bow' });
E.say('wei', '多貴？', 'How expensive?', { to: 'qian', act: 'point' });
E.say('qian', '一百……十兩！十兩就好！她往蓮心小築去了！', 'A hundred... ten! Ten will do! She went to the Lotus Heart Retreat!', { to: 'wei', act: 'shock' });
E.say('wei', '洛無塵那裡？哼，我就知道。', 'To Luo Wuchen’s? Hmph. I knew it.', { to: 'qian', act: 'think' });
E.say('qian', '（三邊收錢……今天真是發財了。）', '(Paid by three sides... what a day for business.)', { close: true, act: 'laugh' });
E.exit('qian', { how: 'leap', d: [4, 2] });
E.move('wei', 1.0, 0.4, { d: 2.0 });
E.enter('guhong', { how: 'appear', at: [3.4, 0.0], face: 'wei', aura: 2, gong: false });
E.say('wei', '你就是那個不說話的劍客？讓開。', 'So you’re the swordsman who doesn’t talk? Out of my way.', { to: 'guhong', act: 'angry' });
E.act('guhong', 'stance', { d: 1.2, cam: 'close' });
E.say('wei', '不讓？好，正合我意！', 'You won’t? Good. That suits me fine!', { to: 'guhong' });
E.duel('wei', 'guhong', { d: 14, end: 'apart' });
E.say('wei', '……好劍。你比凌雲霄，還快。', '...A fine sword. You’re faster than Ling Yunxiao.', { to: 'guhong', act: 'none' });
E.act('guhong', 'bow', { d: 1.4 });
E.say('wei', '替我告訴洛無塵：燕飛霜的事，我不管了。可他欠我的那一戰，我一定要討回來。', 'Tell Luo Wuchen this: I’ll leave Yan Feishuang alone. But the fight he owes me — I will have it.', { to: 'guhong', act: 'point' });
E.exit('wei', { how: 'leap', d: [-4, 1] });

// ---------------------------------------------------------------- the Pavilion at dusk: the Taoist has doubts
E.scene('hall', { sky: 'dusk', mood: 'tense', place: { yin: [6.4, 0, -90], baihe: [2.2, 0.6, 90] }, est: 3 });
E.say('baihe', '殷兄，追殺令發得這麼快，你就這麼肯定，是燕丫頭下的毒？', 'Brother Yin, you sent out that warrant very quickly. Are you so sure the Yan girl poisoned him?', { to: 'yin', act: 'think' });
E.say('yin', '酒杯從她的席上傳出，人證物證俱在。道長以為呢？', 'The cup came from her table. There are witnesses, and there is the cup. What does the Master think?', { to: 'baihe', act: 'fan' });
E.say('baihe', '貧道以為，一個要下毒的人，不會笨到用自己的杯子。', 'I think that someone who meant to poison a man would not be fool enough to use her own cup.', { to: 'yin' });
E.say('yin', '也許，她正是要讓人這麼想。', 'Perhaps that is exactly what she wants us to think.', { to: 'baihe', close: true });
E.say('baihe', '哈哈……殷兄，你想得真遠。遠得，連貧道都跟不上了。', 'Ha ha... Brother Yin, you think a long way ahead. So far that even I can’t keep up.', { to: 'yin', act: 'laugh' });
E.say('yin', '天下大事，不能不想得遠一些。道長，再飲一杯？', 'Great matters demand that one think ahead. Another cup, Master?', { to: 'baihe', act: 'bow' });
E.say('baihe', '不了。殷兄這壺酒，最近……越來越難喝了。', 'No. Brother Yin’s wine has lately... grown harder and harder to swallow.', { to: 'yin', act: 'none' });
E.exit('baihe', { how: 'walk', d: [-7, 0] });
E.say('yin', '……老道士。', '...The old Taoist.', { close: true, act: 'fan' });

// ---------------------------------------------------------------- the Pavilion: a bargain in the dark
E.scene('hall', { sky: 'moon', mood: 'dark', place: { yin: [6.4, 0, -90] }, est: 3 });
E.say('yin', '你來了。', 'You have come.', { act: 'fan', cam: 'low' });
E.enter('jingwang', { how: 'appear', at: [3.6, -1.0], face: 'yin', aura: 3, gong: false, weapon: false });
E.say('jingwang', '殷閣主召喚，本王豈敢不來。', 'When the Pavilion Master calls, how could this king not come?', { to: 'yin', act: 'bow' });
E.say('yin', '你答應過九霄的地機卷，在哪裡？', 'The Earthly Scroll you promised me — where is it?', { to: 'jingwang' });
E.say('jingwang', '等天劍譜到了閣主手中，地機卷，自然雙手奉上。', 'When the Heavenly Sword Manual is in your hands, the Earthly Scroll will be given to you with both of mine.', { to: 'yin', act: 'laugh' });
E.say('yin', '燕飛霜逃了。洛無塵已經起了疑心。', 'Yan Feishuang has escaped. And Luo Wuchen has begun to suspect.', { to: 'jingwang', act: 'angry' });
E.say('jingwang', '洛無塵聰明，聰明人最喜歡什麼？最喜歡懷疑。', 'Luo Wuchen is clever. And what do clever men love most? Suspicion.', { to: 'yin', act: 'point' });
E.say('jingwang', '那就給他更多可以懷疑的東西。比如……萬佛峰的那位老和尚。', 'So give him more to suspect. For instance... that old monk on the Peak.', { to: 'yin', close: true });
E.say('yin', '你要嫁禍無涯佛者？', 'You would put it on the Buddha Wuya?', { to: 'jingwang', act: 'shock' });
E.say('jingwang', '本王的臉，可以是任何人的臉。', 'This king’s face can be anyone’s face.', { to: 'yin', act: 'laugh' });
E.say('yin', '……好。三教若是自己先亂了，天劍譜，就沒有人守得住。', '...Very well. If the Three Teachings fall on each other first, no one will be left to guard the manual.', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '還有一件事。萬佛峰上封劍譜的三道封印，閣主可準備好了？', 'One thing more. The three seals that will close the manual on the Peak — is the Pavilion Master ready for them?', { to: 'yin', act: 'think' });
E.say('yin', '儒門的封印，在九霄手裡。道門、佛門的，九霄自有辦法。', 'The Confucian seal is in my hand. The Taoist and the Buddhist — I have my ways.', { to: 'jingwang', act: 'fan' });
E.say('jingwang', '三道封印合一，天下就再也沒有人能阻止閣主了。', 'With all three seals together, no one under heaven could stop the Pavilion Master.', { to: 'yin', act: 'bow' });
E.exit('jingwang', { how: 'fade' });
E.say('yin', '（鏡王啊鏡王。等兩卷都到了九霄手裡……你，也就沒用了。）', '(Mirror King, Mirror King. Once both halves are in my hands... you will be of no further use.)', { close: true });

// ---------------------------------------------------------------- the bamboo: Qian counts his money
E.scene('bamboo', { sky: 'moon', mood: 'calm', place: { qian: [0.4, 0.2, 90] }, est: 2.5 });
E.say('qian', '十兩……一百兩……嘿嘿，今晚的生意，真是不錯！', 'Ten taels... a hundred... hee hee, a fine night’s business!', { act: 'laugh', cam: 'mid' });
E.enter('guhong', { how: 'appear', at: [-1.2, 0.2], face: 'qian', aura: 2, gong: false, weapon: false });
E.act('qian', 'turn', { to: 'guhong', d: 0.4 });
E.say('qian', '啊！啞……啞劍大俠！我、我什麼都沒說！', 'Ah! The — the Mute Sword! I didn’t say anything!', { to: 'guhong', act: 'shock' });
E.act('guhong', 'point', { d: 1.4, cam: 'close' });
E.say('qian', '好好好，我說！血蓮那邊……是我告訴他們的。可是我也告訴凌少俠了啊！', 'All right, all right, I’ll talk! The Blood Lotus... yes, I told them. But I told Master Ling too!', { to: 'guhong', act: 'bow' });
E.say('qian', '兩邊都知道，那就是……公平！對不對？', 'Both sides knew, so it was... fair! Wasn’t it?', { to: 'guhong', act: 'laugh' });
E.strike('guhong', 'qian', { kind: 'dash', result: 'blocked', k: 0.4, power: 0.3 });
E.say('qian', '……我的袖子！我只有這一件衣服啊！', '...My sleeve! This is the only robe I own!', { act: 'shock', cam: 'mid' });
E.exit('guhong', { how: 'leap', d: [-3, 2] });
E.say('qian', '呼……下次，兩邊收錢，要收三倍。', 'Phew... next time, I charge both sides triple.', { close: true });
E.narrate('一個不說話的劍客，一個說太多話的小人。', 'A swordsman who never speaks, and a little man who speaks far too much.');
E.narrate('可是誰也沒有想到，下一個找上門來的，是一個只愛看熱鬧的人。', 'But no one guessed that the next to come calling would be a man who loves nothing more than a show.');
export default E.done();
