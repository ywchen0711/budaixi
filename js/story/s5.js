// 《天機策》第五集　佛者一掌 / Episode 5: One Palm of the Buddha. About ten minutes.
// They carry Ling Yunxiao up the Peak, and for the first time in twenty years the Buddha Wuya comes out. He draws the
// Netherworld's death out of Ling — and lets fall that Huiming went to the Mirror Lake before the council and was
// never seen to come back. At dusk Ye Wuji comes for the old monk and meets the Seal of the Great Sun. That night,
// Wuya — or someone wearing his face — kills the elder of the Void School in front of witnesses.
import { episode } from './compose.js?v=15';
import { poemOf } from './world.js?v=15';

const E = episode({
  id: 's5', plaque: '佛者一掌',
  title: { zh: ['掌中劍・天機策', '第五集　佛者一掌', ''], en: ['THE CELESTIAL STRATAGEM', 'Episode 5: One Palm of the Buddha', ''] },
  end: { zh: ['天機策　第五集　佛者一掌', '三教共審　且看下回分解'], en: ['THE CELESTIAL STRATAGEM — Episode 5', 'The Three Teachings sit in judgment next'] },
  cast: ['luo', 'yan', 'ling', 'baihe', 'elder', 'wuya', 'wei', 'ye', 'yin', ['fake', 'wuya'], 'qian'],
});

// ---------------------------------------------------------------- the Peak at dawn: the bell
E.open('temple', { sky: 'dawn', mood: 'sad', place: { luo: [-3.6, 0.6, 90], yan: [-4.4, -0.6, 90], baihe: [-4.6, 1.4, 90], ling: [-3.0, -0.4, 90], elder: [-5.4, 0.6, 90] } });
E.act('ling', 'kneel', { hold: 70, d: 0.2, wait: false });
E.narrate('萬佛峰。山門緊閉，二十年來，沒有人見過峰上的佛者。', 'The Peak of Ten Thousand Buddhas. Its gate has been shut for twenty years; in all that time no one has seen the Buddha on the peak.');
E.say('yan', '洛先生，佛者真的會見我們嗎？', 'Master Luo, will the Buddha really see us?', { to: 'luo', act: 'think' });
E.say('luo', '他不見我們。可他不會不見，一個快要死的人。', 'He will not see us. But he will not refuse a man who is dying.', { to: 'yan' });
E.say('luo', '無涯！二十年了。老朋友來看你，帶了一個，你一定會救的人！', 'Wuya! Twenty years. An old friend has come to see you — and brought someone you will surely save!', { act: 'whisk', cam: 'low' });
E.wait(1.2, { cam: 'wide' }).sfx('bell', { k: 1.0 });
E.wait(2.4, { cam: 'wide' }).sfx('bell', { k: 0.8 });
E.enter('wuya', { how: 'appear', at: [6.4, 0.0], face: 'luo', poem: poemOf('wuya'), col: '#ffd860', k: 1.8, aura: 8 });
E.say('wuya', '洛無塵。你這一聲，把老衲二十年的禪，都喊破了。', 'Luo Wuchen. With that one shout you have broken twenty years of my meditation.', { to: 'luo', act: 'none' });
E.say('luo', '你的禪，若是一聲就破，那也不必再坐了。', 'If your meditation breaks at a single shout, there is no need to sit any longer.', { to: 'wuya', act: 'whisk' });
E.say('wuya', '……還是老樣子。人呢？', '...You haven’t changed. Where is he?', { to: 'luo', act: 'laugh' });
E.move('wuya', -1.6, -0.2, { d: 3.0, face: 'ling' });
E.say('wuya', '幽冥死氣，已入心脈。再晚三個時辰，大羅金仙也救不回來。', 'The death of the Netherworld has reached his heart. Three hours later and not even an immortal could have saved him.', { to: 'luo', act: 'think' });
E.say('yan', '佛者，求您救他！', 'Great Buddha, I beg you — save him!', { to: 'wuya', act: 'bow' });
E.say('wuya', '阿彌陀佛。老衲出關，本來就是為了救人。', 'Amitabha. That is why I came out: to save a life.', { to: 'yan' });
E.act('wuya', 'qi', { d: 0.1, k: 1.4, col: '#ffd860', wait: false }); E.A('wuya', { do: 'qi', t: E.t, t1: E.t + 9, k: 1.3, col: '#ffd860' }, { do: 'arm', side: 'R', keys: [[E.t + 0.4, -1.4, -0.3, 0], [E.t + 8.6, -1.4, -0.3, 0]] }, { do: 'arm', side: 'L', keys: [[E.t + 0.4, -1.4, -0.3, 0], [E.t + 8.6, -1.4, -0.3, 0]] });
E.A('ling', { do: 'qi', t: E.t + 2, t1: E.t + 9, k: 0.9, col: '#c040ff', ramp: 1.4 });
E.cut({ orbit: { c: { mid: ['wuya', 'ling'], off: [0, 1.0, 0] }, r: 3.4, h: 0.6, a: [0.4, 1.9] }, fov: 40 });
E.narrate('佛光入體，死氣一寸一寸，從凌雲霄的心脈裡被逼了出來。', 'The Buddha’s light went into him, and inch by inch the death was driven out of Ling Yunxiao’s heart.', { shot: false });
E.sfx('qiburst', { at: [1197, 1.0, -0.4], k: 1.6, col: '#c040ff' }); E.hit(E.t, 1.4); E.wait(2.0, { cam: 'close', on: 'ling' });
E.tracks.ling.find((a) => a.do === 'kneel').t1 = E.t; E.act('ling', 'stance', { d: 1.4, cam: 'mid' }); // he stands up, healed
E.say('ling', '……多謝佛者救命之恩。', '...My thanks to the Buddha for my life.', { to: 'wuya', act: 'bow' });
E.say('wuya', '不必謝老衲。要謝，就謝這個姑娘。她一路上，沒有放開過你的手。', 'Do not thank me. If you must thank someone, thank this girl. She never let go of your hand the whole way.', { to: 'ling' });
E.say('yan', '我、我只是怕他摔下去！', 'I — I was only afraid he would fall!', { to: 'wuya', act: 'shock' });
E.say('baihe', '哈哈哈！老和尚，你閉關二十年，看人的眼光，倒是一點沒變。', 'Ha ha ha! Old monk — twenty years shut away, and your eye for people hasn’t changed a bit.', { to: 'wuya', act: 'laugh' });

// ---------------------------------------------------------------- the disciple who did not come home
E.say('luo', '無涯，有一件事，我必須告訴你。慧明……在龍淵閣的大會上，死了。', 'Wuya, there is something I must tell you. Huiming... died at the council in the Dragon Abyss Pavilion.', { to: 'wuya' });
E.say('wuya', '……慧明？', '...Huiming?', { to: 'luo', act: 'shock', close: true });
E.say('wuya', '不對。那孩子七天前就該回山了。他臨下山前說，要去鏡湖，替老衲取一部經。', 'That cannot be. The boy should have been back seven days ago. Before he left he said he was going to the Mirror Lake, to fetch a sutra for me.', { to: 'luo', act: 'think' });
E.say('luo', '鏡湖？', 'The Mirror Lake?', { to: 'wuya', close: true });
E.say('wuya', '老衲一直在等他回來。可他，再也沒有回來過。', 'I have been waiting for him to come back. He never did.', { to: 'luo', act: 'none' });
E.say('yan', '那在大會上的慧明……', 'Then the Huiming at the council...', { to: 'luo', act: 'shock' });
E.say('luo', '從來就沒有回到萬佛峰的人，怎麼會代表萬佛峰，去龍淵閣？', 'How could a man who never came back to the Peak go to the Pavilion in the Peak’s name?', { to: 'yan', act: 'whisk' });
E.say('baihe', '左手舉杯……佛門弟子，喝了三杯酒。老和尚，你那徒弟，可會喝酒？', 'He lifted his cup with his left hand... a Buddhist disciple, and three cups of wine. Old monk — did your disciple drink?', { to: 'wuya', act: 'think' });
E.say('wuya', '那孩子，連茶都不肯喝濃的。', 'The boy would not even drink strong tea.', { to: 'baihe', close: true });
E.say('luo', '……原來如此。', '...So that is how it is.', { act: 'whisk', close: true });
E.enter('wei', { how: 'leap', at: [-1.0, 3.2], from: [-5, 5], face: 'ling', aura: 1.5, gong: false });
E.say('wei', '凌雲霄！聽說你輸給了夜無極？', 'Ling Yunxiao! I hear you lost to Ye Wuji?', { to: 'ling', act: 'angry' });
E.say('ling', '下一次，不會。', 'Next time, I won’t.', { to: 'wei' });
E.say('wei', '好。下一次，你先贏他，再來跟我打。你可別在那之前，就被他打死了。', 'Good. Next time you beat him first — then you fight me. Just don’t get yourself killed before then.', { to: 'ling', act: 'point' });

// ---------------------------------------------------------------- noon: tea between old friends
E.scene('temple', { sky: 'day', mood: 'calm', place: { wuya: [16.0, 1.0, -90], luo: [14.6, 1.0, 90] }, est: 2.5 });
E.say('wuya', '二十年前，你說要遊遍天下，看盡人心。看完了嗎？', 'Twenty years ago you said you would travel the whole world and see every heart in it. Have you finished?', { to: 'luo' });
E.say('luo', '看完了天下，卻還沒看完人心。', 'I have seen the world. I have not finished with men’s hearts.', { to: 'wuya', act: 'whisk' });
E.say('wuya', '你這一生，算盡天下，卻總是算不到你自己。', 'All your life you have reckoned out the whole world, and never once reckoned out yourself.', { to: 'luo', act: 'think' });
E.say('luo', '所以，才需要你這個老朋友。', 'Which is why I need an old friend like you.', { to: 'wuya', act: 'laugh' });
E.say('wuya', '老衲有一句話，二十年前沒說，今天說給你聽：算計，救不了所有人。', 'There is something I did not say to you twenty years ago, and I will say it now: scheming cannot save everyone.', { to: 'luo', close: true });
E.say('luo', '……我知道。可不算計，一個人都救不了。', '...I know. But without scheming, I could save no one at all.', { to: 'wuya', close: true });
E.scene('temple', { sky: 'day', mood: 'calm', place: { ling: [-2.0, 6.0, 100], yan: [-0.6, 6.2, -80] }, est: 2 });
E.say('yan', '你醒了以後，第一句話，就是問劍譜。', 'When you woke up, the first thing you asked about was the manual.', { to: 'ling', act: 'angry' });
E.say('ling', '……不是。我第一句話，是問妳。', '...No. The first thing I asked about was you.', { to: 'yan' });
E.say('yan', '你喊的是「燕姑娘，劍譜」。', 'You said, “Miss Yan — the manual.”', { to: 'ling', act: 'laugh' });
E.say('ling', '燕姑娘在前面。', 'Miss Yan came first.', { to: 'yan', close: true });
E.say('yan', '……凌大俠，你越來越會說話了。', '...Master Ling, you are getting better and better at saying things.', { to: 'ling', act: 'laugh', close: true });

// ---------------------------------------------------------------- dusk: the demon at the gate
E.scene('temple', { sky: 'dusk', mood: 'tense', place: { wuya: [3.0, 0.0, -90], luo: [0.4, 2.2, -60], ling: [0.4, -1.6, -110], wei: [-0.6, 0.6, -90], yan: [-0.6, -2.6, -100], baihe: [-1.6, 2.6, -80] }, est: 2.5 });
E.narrate('黃昏。佛者出關的消息，比鐘聲傳得還快。', 'Dusk. The news that the Buddha had come out travelled faster than the bell.');
E.sfx('qiburst', { at: [1192, 6, 0], k: 1.4, col: '#c040ff' }); E.hit(E.t, 1.2);
E.enter('ye', { how: 'descend', at: [-4.0, 0.2], from: [-3, 0], face: 'wuya', col: '#c040ff', k: 1.6, aura: 3 });
E.say('ye', '老和尚，你出關得正好。本尊正想看看，二十年的禪，擋不擋得住幽冥的掌！', 'Old monk, you came out just in time. I wanted to see whether twenty years of Zen can stand against the palm of the Netherworld!', { to: 'wuya', act: 'laugh' });
E.say('wuya', '阿彌陀佛。施主一身死氣，回頭是岸。', 'Amitabha. You are wrapped in death, my friend. Turn back — the shore is behind you.', { to: 'ye' });
E.say('ye', '岸？本尊從幽冥爬回來，岸，就在本尊的腳下！', 'The shore? I crawled back out of the Netherworld — the shore is under my feet!', { to: 'wuya', act: 'angry' });
E.say('wei', '少廢話！先過我這一關！', 'Enough talk! Get past me first!', { to: 'ye', act: 'angry' });
E.move('wei', -2.6, 0.4, { d: 0.8, glide: true, face: 'ye', shot: false });
E.duel('wei', 'ye', { d: 12, end: 'win:b', hold: 12 });
E.move('ling', -2.4, -1.2, { d: 0.8, glide: true, face: 'ye', shot: false });
E.duel('ling', 'ye', { d: 12, end: 'apart', k: 1.2 });
E.say('wuya', '兩位少俠，退下吧。這一掌，老衲來接。', 'Young masters, stand back. This palm is mine to meet.', { to: 'ling', act: 'none' });
E.move('wuya', -0.4, 0.0, { d: 2.4, face: 'ye' });
E.strike('ye', 'wuya', { kind: 'palm', name: ['幽冥——九掌！', 'Netherworld — Nine Palms!'], result: 'blocked', col: '#c040ff', power: 1.5 });
E.say('ye', '什麼？！', 'What?!', { to: 'wuya', act: 'shock', close: true });
E.strike('wuya', 'ye', { kind: 'palm', name: ['大日——佛印！', 'Seal of the Great Sun!'], result: 'down', col: '#ffd860', power: 1.8, knock: 4, hold: 6 });
E.sfx('bell', { k: 1.0 });
E.say('ye', '……老和尚……你等著，本尊，還會回來的！', '...Old monk... you wait. I will be back!', { to: 'wuya', act: 'angry' });
E.exit('ye', { how: 'fade', col: '#c040ff' });
E.say('wuya', '阿彌陀佛。他的身子，已經不是人的身子了。', 'Amitabha. His body is no longer a man’s body.', { to: 'luo' });
E.say('luo', '幽冥帝君，把他做成了一把刀。一把，殺不死的刀。', 'The Netherworld Emperor has made him into a blade. A blade that cannot be killed.', { to: 'wuya', act: 'think' });
E.enter('yin', { how: 'glide', at: [-6.0, 2.0], from: [-12, 3], face: 'wuya', aura: 2, gong: false });
E.say('yin', '九霄來遲了！佛者，各位，可都安好？', 'I am late! Great Buddha, everyone — are you all unhurt?', { to: 'wuya', act: 'bow' });
E.say('baihe', '殷兄，你每次都來得，剛剛好晚一步。', 'Brother Yin, every time you come — just exactly one step late.', { to: 'yin', act: 'laugh' });
E.say('yin', '道長又說笑了。', 'Master, you jest again.', { to: 'baihe', act: 'fan', close: true });

// ---------------------------------------------------------------- nightfall: a few words in Wei's ear
E.scene('temple', { sky: 'moon', mood: 'tense', place: { yin: [-6.0, 4.0, 120], wei: [-4.4, 3.2, -60] }, est: 2 });
E.say('yin', '魏兄，你可曾想過，為什麼每一次出事，洛無塵都剛好在場？', 'Brother Wei, have you ever wondered why, every time something happens, Luo Wuchen happens to be there?', { to: 'wei', act: 'fan' });
E.say('wei', '他是個愛管閒事的人。', 'He likes to meddle.', { to: 'yin' });
E.say('yin', '大會上，他替燕飛霜說話；太虛峰上，他早就知道夜無極會去。今天，佛者又是他請出來的。', 'At the council he spoke for Yan Feishuang. At Void Peak he knew already that Ye Wuji would come. And today, it was he who brought the Buddha out.', { to: 'wei', act: 'think' });
E.say('wei', '你想說什麼？', 'What are you trying to say?', { to: 'yin', act: 'angry' });
E.say('yin', '九霄什麼都沒說。九霄只是覺得，一個什麼都算得到的人，最可怕的，不是他算到了什麼……', 'I say nothing. I only feel that, with a man who foresees everything, the frightening thing is not what he foresees...', { to: 'wei', act: 'fan' });
E.say('yin', '而是他算到了，卻不告訴你。', 'it is what he foresees and does not tell you.', { to: 'wei', close: true });
E.say('wei', '……哼。', '...Hmph.', { to: 'yin', close: true });

// ---------------------------------------------------------------- night: a palm in the dark
E.scene('temple', { sky: 'moon', mood: 'dark', place: { elder: [-3.6, -4.4, 0] }, est: 2.5 });
E.narrate('夜深。太虛長老青松子傷重未癒，獨自在山門外調息。', 'Late at night. Qingsong Zi, elder of the Void School, his wounds not yet healed, sat alone outside the gate to steady his breath.', { on: 'elder' });
E.enter('fake', { how: 'walk', at: [-3.6, -2.4], from: [4, 0], face: 'elder', aura: 0.5, gong: false, weapon: false });
E.say('elder', '佛者？這麼晚了……', 'Great Buddha? So late...', { to: 'fake', act: 'shock' });
E.say('fake', '老衲替道長，再看看傷。', 'Let me look at your wounds once more, Master.', { to: 'elder' });
E.say('elder', '有勞佛者……', 'You are very kind...', { to: 'fake', act: 'bow' });
E.strike('fake', 'elder', { kind: 'palm', name: ['大日佛印。', 'Seal of the Great Sun.'], result: 'kill', col: '#ffd860', power: 1.2, knock: 2.4 });
E.enter('wei', { how: 'leap', at: [-6.2, -2.0], from: [-9, 1], face: 'fake', aura: 1, gong: false });
E.say('wei', '無涯！你——', 'Wuya! You —', { to: 'fake', act: 'angry', close: true });
E.enter('yin', { how: 'glide', at: [-6.6, -4.6], from: [-12, -5], face: 'fake', aura: 1, gong: false });
E.say('yin', '佛者！你為什麼要殺青松道長！', 'Great Buddha! Why have you killed Master Qingsong!', { to: 'fake', act: 'point' });
E.act('fake', 'turn', { to: 'wei', d: 1.0, cam: 'close' });
E.exit('fake', { how: 'fade', col: '#ffd860' });
E.say('wei', '……我親眼看見的。是佛者的掌，是大日佛印！', '...I saw it with my own eyes. It was the Buddha’s palm — the Seal of the Great Sun!', { to: 'yin', act: 'shock' });
E.say('yin', '九霄也看見了。這……這叫九霄，如何向道門交代？', 'I saw it too. How... how am I to answer to the Taoists for this?', { to: 'wei', act: 'none' });

// ---------------------------------------------------------------- morning: the friend accused
E.scene('temple', { sky: 'dawn', mood: 'tense', place: { wuya: [6.0, 0.0, -90], luo: [4.0, 2.0, -110], yan: [3.6, -2.2, -60], ling: [2.8, -1.0, -80], baihe: [0.6, 2.6, -40], wei: [-0.8, 0.4, 90], yin: [-1.6, -1.6, 70] }, est: 2.5 });
E.say('wei', '無涯！昨夜，你殺了青松子！', 'Wuya! Last night you killed Qingsong Zi!', { to: 'wuya', act: 'point' });
E.say('wuya', '昨夜，老衲整夜，都在禪房，為凌少俠運功。', 'Last night I was in my cell all night, working the light into Young Master Ling.', { to: 'wei' });
E.say('ling', '是真的。佛者一夜沒有離開過我。', 'It is true. The Buddha never left me all night.', { to: 'wei' });
E.say('luo', '無塵也可以作證。', 'Wuchen will bear witness as well.', { to: 'wei', act: 'whisk' });
E.say('wei', '作證？你們都是一夥的！洛無塵，從大會開始，你就在包庇每一個人！', 'Witness? You are all in it together! Luo Wuchen, ever since the council you have been covering for every one of them!', { to: 'luo', act: 'angry' });
E.say('wei', '燕飛霜的毒，你說不是她。青松子的死，你又說不是他。那到底是誰？是鬼嗎？', 'The poison — not her, you say. Qingsong Zi’s death — not him, you say. Then who? A ghost?', { to: 'luo', act: 'angry', close: true });
E.say('luo', '不是鬼。是一個，可以變成任何人的人。', 'Not a ghost. A man who can become anyone.', { to: 'wei' });
E.say('yin', '洛先生，這種話，在三教之前，可要有憑有據。', 'Master Luo, words like those, before the Three Teachings, need proof.', { to: 'luo', act: 'fan' });
E.say('baihe', '……師兄死在佛門的掌下。這件事，貧道必須給道門一個交代。', '...My elder brother died under a Buddhist palm. I must give the Taoists an answer for it.', { to: 'wuya', act: 'none' });
E.say('yin', '佛者，請隨九霄回龍淵閣，接受三教共審。', 'Great Buddha, I must ask you to come with me to the Pavilion, to be judged by the Three Teachings.', { to: 'wuya', act: 'bow' });
E.say('yan', '不行！佛者剛剛才救了凌大俠——', 'No! The Buddha just saved Master Ling —', { to: 'yin', act: 'angry' });
E.say('wuya', '阿彌陀佛。燕姑娘，老衲去。', 'Amitabha. Miss Yan — I will go.', { to: 'yan' });
E.say('wuya', '佛門的封印，老衲帶著。是非曲直，總會有水落石出的一天。', 'I will bring the Buddhist seal with me. Right and wrong will come out in the end, as the water falls and the stones show.', { to: 'yin', close: true });
E.say('yin', '佛者胸襟，九霄佩服。', 'The Buddha’s great heart — I am in awe.', { to: 'wuya', act: 'bow', close: true });
E.enter('qian', { how: 'leap', at: [1.6, -3.2], from: [-2, -6], face: 'wei', gong: false, weapon: false, aura: 1 });
E.say('qian', '等一下！昨夜我也在！我、我看見了兩個佛者！', 'Wait! I was there last night too! I — I saw two Buddhas!', { to: 'wei', act: 'shock' });
E.say('wei', '兩個？', 'Two?', { to: 'qian', act: 'shock', close: true });
E.say('qian', '一個在禪房的窗子裡，一個在山門外面！一模一樣！', 'One in the window of the meditation cell, one outside the gate! Exactly the same!', { to: 'wei', act: 'point' });
E.say('yin', '錢不二，你的話，江湖上有誰會信？上個月，你還說你見過龍。', 'Qian Bu’er, who in the whole world believes a word you say? Last month you claimed you had seen a dragon.', { to: 'qian', act: 'laugh' });
E.say('qian', '那、那次是我收了錢……可這次是真的啊！', 'That — that time I was paid to say it... but this time it’s true!', { to: 'yin', act: 'shock' });
E.say('wei', '一個騙子的話，我不聽。', 'I do not listen to a liar.', { to: 'qian' });
E.say('luo', '（一個騙子說了一次真話，卻沒有人信……這才是最好的騙局。）', '(A liar tells the truth for once, and no one believes him... that is the best deception of all.)', { act: 'think', close: true });
E.say('luo', '（有人戴著佛者的臉……他已經不只是在殺人。他在殺的，是所有人之間的信任。）', '(Someone is wearing the Buddha’s face... and it is no longer only men he is killing. He is killing the trust between all of us.)', { act: 'think', cam: 'low' });
E.narrate('一掌渡劫，一掌殺人；同一張臉，兩顆心。', 'One palm to save, one palm to kill; the same face, two hearts.');
E.narrate('佛者下山，三教共審。龍淵閣上，誰才是審判的人？', 'The Buddha comes down the mountain to be judged. But in the Pavilion — who is the judge?');
export default E.done();
