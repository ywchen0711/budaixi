"""The spoken lines of an episode, in both languages, from neural voices (Microsoft Edge's read-aloud voices, through
the edge-tts package): each character has its voice, pitch and speed (js/cast/characters.js); a shouted line (one
that ends in ! or ！) comes a little faster, higher and louder. A line too long for its subtitle is sped up to fit
(without changing its pitch). Recordings are cached in tools/voice_cache/.

    node tools/cues.mjs ep2 > tools/cues.json
    python tools/voices.py                      # -> tools/voices_ep2.json, read by tools/mix.py
Needs edge-tts and ffmpeg.
"""
import asyncio, hashlib, json, os, subprocess, sys
import edge_tts

HERE = os.path.dirname(os.path.abspath(__file__))
CUE = json.load(open(os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else 'cues_ep1.json'), encoding='utf-8'))
CACHE = os.path.join(HERE, 'voice_cache'); os.makedirs(CACHE, exist_ok=True)

def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout
    return float(out.strip() or 0)

async def say(text, voice, pitch, rate, path, volume=0):
    if os.path.exists(path) and os.path.getsize(path) > 0: return
    c = edge_tts.Communicate(text, voice, rate=f'{rate:+d}%', pitch=f'{pitch:+d}Hz', volume=f'{volume:+d}%')
    await c.save(path)

async def main():
    out = {}
    for lang, lines in CUE['lines'].items():
        res = []
        for t0, t1, who, text, *rest in lines:
            v = CUE['voices'].get(who)
            if not v or not text.strip(' .…'): continue
            voice, pitch, rate = v[lang]
            emo = rest[0] if rest else None
            loud = text.rstrip().endswith(('!', '！')) or emo in ('angry', 'shout')
            if text.strip().startswith(('（', '(')): emo = 'inner'
            # how a feeling changes a voice (edge-tts takes pitch, speed and loudness): raised and quick when angry,
            # high when shocked, slow and low when sad or thinking, quiet and close for a thought
            dp, dr, dv = {'angry': (10, 10, 15), 'shout': (12, 12, 20), 'shock': (14, 6, 8), 'laugh': (8, 4, 5), 'sad': (-8, -14, -10), 'think': (-5, -10, -5),
                          'inner': (-4, -6, -20), 'bow': (2, -4, -5), 'cold': (-6, -6, 0), 'tease': (6, 2, 0), 'calm': (0, -4, 0)}.get(emo, (0, 0, 0))
            if loud and emo not in ('angry', 'shout'): dp += 8; dr += 8; dv += 10
            # and no two lines quite the same: a small lift or drop for each, by its words
            h = int(hashlib.sha1(text.encode()).hexdigest()[:4], 16); dp += h % 7 - 3; dr += (h >> 3) % 5 - 2
            pitch += dp; rate += dr; vol = dv
            spoken = text.replace('……', '…').replace('...', '…')
            key = hashlib.sha1(f'{voice}|{pitch}|{rate}|{vol}|{spoken}'.encode()).hexdigest()[:16]
            raw = os.path.join(CACHE, f'{key}.mp3')
            for attempt in range(8):
                try: await asyncio.wait_for(say(spoken, voice, pitch, rate, raw, vol), 30); break
                except Exception as e:
                    if os.path.exists(raw): os.remove(raw)
                    await asyncio.sleep(2 + attempt)
            if not os.path.exists(raw): print('  no recording for', lang, who, text); continue
            d, room = duration(raw), (t1 - t0) - 0.1
            fit = raw
            if d > room + 0.05:  # too long for the subtitle: speed it up (up to 1.45x), keeping the pitch
                k = min(1.45, d / room); fit = os.path.join(CACHE, f'{key}_x{k:.2f}.wav')
                if not os.path.exists(fit): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-filter:a', f'atempo={k:.3f}', fit], check=True)
                if d / k > room + 0.15: print(f'  {lang} {t0:6.1f} {who:7s} runs {d / k - room:.2f}s past its subtitle: {text}')
                d = d / k
            res.append({ 't': t0 + 0.04, 'who': who, 'file': fit, 'dur': round(d, 3), 'fx': v.get('fx', 'cockpit'), 'loud': loud, 'emo': emo })
        out[lang] = res
        print(lang, len(res), 'lines')
    json.dump(out, open(os.path.join(HERE, f"voices_{CUE['ep']}.json"), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

asyncio.run(main())
