"""The soundtrack of an episode: real recordings and real instruments, mixed to the episode's own cues.

    node tools/cues.mjs ep1 > tools/cues_ep1.json             # every cue, leap, swing and blow, from the story
    python tools/voices.py cues_ep1.json                      # the spoken lines, both languages (tools/voices_ep1.json)
    python -P tools/mix.py RAW KN VSCO VCSL [cues_ep1.json]   # -> audio/ep1.zh.mp3 and audio/ep1.en.mp3

Nothing here belongs to one story: each kind of cue has its sound (SOUNDS below); the music is played from the
episode's cue sheet (story.music): the gongs and drums of the puppet theatre (luogu), a zither (zheng),
an ocarina, a recorder and a bowed psaltery over low strings.

RAW   Kenney's Impact Sounds and Sci-fi Sounds, unzipped flat, with the swish-*.wav of "Battle Sound Effects" (CC0)
KN    Kaiju Night's designed effects (github.com/ywchen0711/kaiju-night, sfx/; CC0, built from CC0 recordings)
VSCO  Versilian Studios Chamber Orchestra 2 Community Edition (CC0, github.com/sgossner/VSCO-2-CE)
VCSL  Versilian Community Sample Library (CC0, github.com/sgossner/VCSL): Dan Tranh, ocarina, soprano recorder,
      bowed psaltery, gong, clash cymbals, woodblock, frame drum, bass drum, mark trees
Needs numpy, scipy, soundfile and ffmpeg.
"""
import glob, json, os, re, subprocess, sys
from math import gcd
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt, fftconvolve
from scipy.ndimage import minimum_filter1d, uniform_filter1d

SR = 48000
RAW, KN, VSCO, VCSL = sys.argv[1:5]
HERE = os.path.dirname(os.path.abspath(__file__))
CUE = json.load(open(os.path.join(HERE, sys.argv[5] if len(sys.argv) > 5 else 'cues_ep1.json'), encoding='utf-8'))
LEN, EP = CUE['LEN'], CUE['ep']
FILM = CUE.get('filmLen', LEN)
rng = np.random.default_rng(7)
N = int((FILM + 1.5) * SR)
# slow motion: everything is cued in story time; it is placed in film time, and sounds inside a slowed stretch are
# played slower and lower, as a slowed recording would be
WARP = CUE.get('warp', [])
def to_film(tw):
    f = w = 0.0
    for a, b, r, *_ in WARP:
        if tw <= a: return f + (tw - w)
        f += a - w; w = a
        if tw <= b: return f + (tw - a) / r
        f += (b - a) / r; w = b
    return f + (tw - w)
def rate_at(tw):  # slow motion only: a hit-stop ('stop') freezes the picture, not the sound
    for a, b, r, *flag in WARP:
        if a <= tw < b and not flag: return r
    return 1.0

# ---------------------------------------------------------------- loading and shaping
_cache = {}
def load(path):
    """a recording as 48 kHz stereo, every one at the same peak so the gains below mean something"""
    if path in _cache: return _cache[path]
    x, sr = sf.read(path, dtype='float32', always_2d=True)
    if x.shape[1] == 1: x = np.repeat(x, 2, axis=1)
    x = x[:, :2]
    if sr != SR: g = gcd(SR, sr); x = resample_poly(x, SR // g, sr // g, axis=0).astype(np.float32)
    x = x / max(1e-6, float(np.abs(x).max())) * 0.9
    _cache[path] = x; return x
def pitch(x, semis):
    """varispeed: pitch and length change together, like a tape slowed down"""
    if abs(semis) < 0.01: return x
    return resample_poly(x, 1000, int(round(1000 * 2 ** (semis / 12))), axis=0).astype(np.float32)
def filt(x, kind, f, order=2): return sosfilt(butter(order, f, btype=kind, fs=SR, output='sos'), x, axis=0).astype(np.float32)
def fade(x, a=0.002, b=0.05):
    x = x.copy(); n = len(x); na, nb = min(n, int(a * SR)), min(n, int(b * SR))
    if na: x[:na] *= np.linspace(0, 1, na)[:, None]
    if nb: x[-nb:] *= np.linspace(1, 0, nb)[:, None]
    return x
def cut(x, t0, t1): return x[int(t0 * SR):int(t1 * SR)]
def loop(x, secs): return np.tile(x, (int(secs / (len(x) / SR)) + 2, 1))[:int(secs * SR)]
def db(v): return 10 ** (v / 20)
def pan(x, p): a = (p + 1) * np.pi / 4; return x * np.array([np.cos(a), np.sin(a)], dtype=np.float32) * 1.414

BUS = {k: np.zeros((N, 2), np.float32) for k in ('sfx', 'verb', 'music', 'amb')}
def put(bus, x, t, g=1.0, p=0.0, verb=0.25):
    r = rate_at(t)
    if r < 1 and len(x): x = pitch(x, 12 * np.log2(r) * 0.5)
    i = int(to_film(t) * SR)
    if i >= N or len(x) == 0: return
    if i < 0: x = x[-i:]; i = 0
    x = pan(x, p) * g; n = min(len(x), N - i)
    BUS[bus][i:i + n] += x[:n]
    if verb and bus != 'verb': BUS['verb'][i:i + n] += x[:n] * verb
def pick(pattern):
    fs = sorted(glob.glob(pattern)); assert fs, pattern
    return fs[int(rng.integers(len(fs)))]
def K(name): return load(pick(os.path.join(RAW, name + '*')))
def KNs(name): return load(pick(os.path.join(KN, name + '*.mp3')))

def VC(path): return load(pick(os.path.join(VCSL, path)))
def noise(secs, lo, hi): return filt(rng.normal(0, 1, (int(secs * SR), 2)).astype(np.float32), 'bandpass', [lo, hi]) * 0.3
def decay(secs, rate): return np.exp(-np.arange(int(secs * SR)) / SR * rate)[:, None]

# ---------------------------------------------------------------- the sounds, by kind of cue
# the swords ring brighter than a mech's: steel on steel, a bell in it, no electric crackle
def clash(t, k=1.0, bind=0):
    put('sfx', pitch(KNs('metal_m'), 5 + rng.uniform(-1, 1)), t, 0.55 * k, rng.uniform(-0.2, 0.2), verb=0.55)
    put('sfx', pitch(K('impactBell_heavy'), 2 + rng.uniform(-1, 1)), t, 0.22 * k, 0, verb=0.7)
    put('sfx', pitch(K('impactMetal_light'), 3), t, 0.3 * k)
    for j in range(int(bind / 0.12)): put('sfx', pitch(K('impactPlate_light'), rng.uniform(2, 6)), t + 0.12 + j * 0.12, 0.06, verb=0.3)  # blades grinding
def hit(t, k=1.0):  # a blade or a fist through silk: a dull thump and the cloth snapping
    put('sfx', pitch(KNs('flesh_m'), rng.uniform(-1, 1)), t, 0.45 * k, -0.1, verb=0.35)
    put('sfx', pitch(K('impactPunch_heavy'), -3), t, 0.45 * k, -0.1)
    put('sfx', pitch(K('swish-'), 4), t - 0.03, 0.12 * k)
def whoosh(t, k=1.0, p=0.0):
    put('sfx', pitch(K('swish-'), rng.uniform(-1, 2)), t, 0.22 * k, p if p else rng.uniform(-0.3, 0.3), verb=0.25)
def leap(t, k=1.0):  # silk sleeves and robes thrown into the air
    put('sfx', filt(pitch(K('swish-'), -7), 'lowpass', 2500), t, 0.25 * k, rng.uniform(-0.3, 0.3), verb=0.3)
    put('sfx', filt(noise(0.5, 300, 2400), 'lowpass', 2000) * np.linspace(1, 0, int(0.5 * SR))[:, None], t, 0.25 * k)
def land(t, k=1.0):  # a puppet's feet on the stage boards
    put('sfx', pitch(K('footstep_wood'), -3), t, 0.4 * k, rng.uniform(-0.2, 0.2), verb=0.3)
    put('sfx', filt(pitch(K('impactWood_heavy'), -6), 'lowpass', 1500), t, 0.25 * k, verb=0.3)
def qiup(t0, t1, k=1.0):  # the inner power rising: a low swell, air spinning, and a shimmer at its height
    d = max(0.6, t1 - t0); n = int(d * SR); ramp = np.linspace(0, 1, n)[:, None] ** 1.5
    put('sfx', filt(pitch(loop(K('forceField'), d + 0.5), -9), 'lowpass', 1600)[:n] * ramp, t0, 0.14 * k, 0, verb=0.4)
    put('sfx', noise(d, 400, 3000)[:n] * ramp * (0.6 + 0.4 * np.sin(np.arange(n) / SR * 14))[:, None], t0, 0.12 * k, 0, verb=0.5)
    put('sfx', VC('Idiophones/Struck Idiophones/Mark Trees/Legacy/windchimes_slowAsc1*'), t0 + d * 0.4, 0.06 * k, 0.3, verb=0.6)
def qiburst(t, k=1.0):  # power let go all at once: a deep thud and a rush of wind
    put('sfx', filt(pitch(K('lowFrequency_explosion'), -3), 'lowpass', 400), t, 0.7 * k, 0, verb=0.6)
    put('sfx', pitch(K('swish-'), -5), t, 0.35 * k, 0, verb=0.5)
    put('sfx', noise(1.4, 200, 4000) * decay(1.4, 3), t, 0.35 * k, 0, verb=0.6)
def wave(t0, t1, k=1.0):  # a crescent of sword-energy: it screams through the air and bursts where it lands
    d = max(0.15, t1 - t0)
    put('sfx', pitch(K('swish-'), 3), t0 - 0.05, 0.35 * k, -0.3, verb=0.4)
    sweep = noise(d + 0.1, 1200, 7000); sweep *= np.linspace(0.3, 1, len(sweep))[:, None]
    put('sfx', sweep, t0, 0.3 * k, 0, verb=0.4)
    put('sfx', pitch(K('laserLarge'), -12), t0, 0.12 * k, 0, verb=0.5)
    qiburst(t1, 0.7 * k); put('sfx', pitch(K('impactMining'), -4), t1, 0.3 * k, 0.2, verb=0.5)
def palm(t0, t1, k=1.0):  # a palm strike thrown from a distance: the air pushed, then the blow
    put('sfx', filt(pitch(K('swish-'), -9), 'lowpass', 1800), t0, 0.4 * k, 0, verb=0.4)
    put('sfx', filt(noise(max(0.1, t1 - t0) + 0.1, 100, 1200), 'lowpass', 900), t0, 0.3 * k, 0)
    put('sfx', filt(pitch(K('impactPunch_heavy'), -8), 'lowpass', 900), t1, 0.7 * k, 0, verb=0.4)
    put('sfx', filt(pitch(K('lowFrequency_explosion'), -1), 'lowpass', 300), t1, 0.5 * k, 0, verb=0.5)
def leaves(t, k=1.0):  # bamboo leaves shaken down: a long rustle
    x = noise(3.5, 1800, 8000); n = len(x); x *= (np.minimum(1, np.arange(n) / (0.2 * SR)) * np.exp(-np.arange(n) / SR * 0.9))[:, None]
    put('amb', x, t, 0.4 * k, rng.uniform(-0.4, 0.4), verb=0.3)
def bamboo(t, k=1.0):  # a stalk cut through: the crack, the creak and the fall
    put('sfx', pitch(K('impactWood_heavy'), 2), t, 0.55 * k, rng.uniform(-0.3, 0.3), verb=0.5)
    put('sfx', pitch(K('impactPlank_medium'), rng.uniform(-3, 0)), t + 0.05, 0.3 * k, verb=0.4)
    put('sfx', noise(1.6, 1500, 7000) * decay(1.6, 2), t + 0.2, 0.18 * k, verb=0.3)
    put('sfx', pitch(K('impactWood_medium'), -5), t + 1.3 + rng.uniform(0, 0.3), 0.25 * k, rng.uniform(-0.5, 0.5), verb=0.5)
def dart(t0, t1):  # a thrown dagger whistling to its mark
    put('sfx', pitch(K('swish-'), 6 + rng.uniform(0, 2)), t0, 0.16, rng.uniform(-0.4, 0.4), verb=0.3)
    put('sfx', pitch(K('impactMetal_light'), 4), t1, 0.18, rng.uniform(-0.4, 0.4), verb=0.4)
def loose(t, k=1.0):  # a blade or an arm thrown loose, falling, landing
    put('sfx', pitch(KNs('flesh_h'), -2), t, 0.45 * k, 0.2, verb=0.4)
    put('sfx', pitch(K('swish-'), -4), t + 0.05, 0.25 * k, 0.3, verb=0.3)
    put('sfx', pitch(K('impactWood_medium'), -4), t + 1.1, 0.25 * k, 0.4, verb=0.4)
def shake(t, k=1.0): put('sfx', filt(pitch(K('lowFrequency_explosion'), -5), 'lowpass', 250), t, 1.6 * k, 0, verb=0.4)
def sparks(c):  # steel scraping steel, held
    for t in np.arange(c['t'], min(c.get('t1', c['t'] + 0.3), LEN), 0.16): put('sfx', pitch(K('impactPlate_light'), rng.uniform(3, 7)), t, 0.05, rng.uniform(-0.3, 0.3), verb=0.4)

SOUNDS = {
    'clash': lambda c: clash(c['t'], c.get('k', 1.0), c.get('bind', 0)),
    'hit': lambda c: hit(c['t'], c.get('k', 1.0)),
    'whoosh': lambda c: whoosh(c['t'], c.get('k', 1.0)),
    'leap': lambda c: leap(c['t'], c.get('k', 1.0)),
    'land': lambda c: land(c['t'], c.get('k', 1.0)),
    'qiup': lambda c: qiup(c['t'], c.get('t1', c['t'] + 2), c.get('k', 1.0)),
    'qiburst': lambda c: qiburst(c['t'], c.get('k', 1.0)),
    'wave': lambda c: wave(c['t'], c.get('t1', c['t'] + 0.5), c.get('k', 1.0)),
    'palm': lambda c: palm(c['t'], c.get('t1', c['t'] + 0.3), c.get('k', 1.0)),
    'leaves': lambda c: leaves(c['t'], c.get('k', 1.0)),
    'bamboo': lambda c: bamboo(c['t'], c.get('k', 1.0)),
    'missile': lambda c: dart(c['t'], c['t1']),
    'loose': lambda c: loose(c['t'], c.get('k', 1.0)),
    'shake': lambda c: shake(c['t'], c.get('k', 0.2)),
    'sparks': sparks,
    'bell': lambda c: (put('sfx', pitch(VC('Idiophones/Struck Idiophones/Gong 1/gong_fff*'), -7), c['t'], 0.55 * c.get('k', 1.0), 0, verb=1.0), put('sfx', pitch(VC('Idiophones/Struck Idiophones/Hand Bells, Nepalese/HB_*'), -12), c['t'] + 0.05, 0.25 * c.get('k', 1.0), 0, verb=1.0)),
}
for c in CUE['cues']:
    f = SOUNDS.get(c['kind'])
    if f: f(c)

# the places: each scene's own air (a story's scenes, [t0, t1, place]; the prologue has its two places by time)
SCN = CUE.get('scenes') or [[8.5, 181.5, 'bamboo'], [181.5, LEN, 'cliff']]
tt = np.arange(N) / SR
def window(t0, t1, fade_s=1.2):  # 1 inside the scene (in film time), easing in and out
    a, b = to_film(t0), to_film(t1)
    return np.clip((tt - a) / fade_s, 0, 1) * np.clip((b - tt) / fade_s, 0, 1)
gust = 0.6 + 0.4 * np.sin(tt * 0.31) * np.sin(tt * 0.13 + 1)
noiseH = filt(rng.normal(0, 1, (N, 2)).astype(np.float32), 'bandpass', [1500, 7000])
noiseL = filt(filt(rng.normal(0, 1, (N, 2)).astype(np.float32), 'lowpass', 500), 'highpass', 70)
def crickets(t0, t1, k=1.0):
    for ci, (f0, pp) in enumerate([(4300, -0.7), (4700, 0.5), (3900, 0.1), (5100, -0.3)]):
        t = t0 + 0.5 + ci * 0.37; n = int(0.016 * SR); x = (np.sin(2 * np.pi * f0 * np.arange(n) / SR) * np.hanning(n)).astype(np.float32)
        ch = np.zeros((int(0.12 * SR), 2), np.float32)
        for j in range(3): ch[int(j * 0.035 * SR):int(j * 0.035 * SR) + n] += x[:, None]
        while t < t1 - 1:
            put('amb', ch, t, 0.01 * k * (1.0 if ci % 2 else 0.6), pp, verb=0.4); t += rng.uniform(0.5, 1.1) * (1 + 3 * (rng.random() < 0.1))
def frogs(t0, t1):
    t = t0 + 1
    while t < t1 - 1:
        n = int(rng.uniform(0.08, 0.16) * SR); f = rng.uniform(180, 320); ph = np.arange(n) / SR
        x = (np.sign(np.sin(2 * np.pi * f * ph)) * np.exp(-ph * 9) * (1 + 0.5 * np.sin(2 * np.pi * 30 * ph))).astype(np.float32)
        put('amb', filt(np.repeat(x[:, None], 2, 1), 'lowpass', 1200), t, 0.012, rng.uniform(-0.8, 0.8), verb=0.5); t += rng.uniform(0.4, 2.5)
for t0, t1, place in SCN:
    t1 = t1 if t1 is not None else LEN; w = window(t0, t1)
    if place == 'bamboo':
        BUS['amb'] += noiseH * (w * gust * 0.012)[:, None] + noiseL * (w * (0.5 + 0.5 * gust) * 0.012)[:, None]; crickets(t0, t1)
    elif place == 'cliff': BUS['amb'] += noiseL * (w * (0.5 + 0.5 * gust) * 0.042)[:, None]
    elif place == 'hall': BUS['amb'] += filt(noiseL, 'lowpass', 220) * (w * 0.02)[:, None] + noiseH * (w * gust * 0.003)[:, None]; crickets(t0, t1, 0.4)
    elif place == 'lotus':
        lap = filt(noiseL, 'bandpass', [150, 700]) * (0.5 + 0.5 * np.sin(tt * 1.7) * np.sin(tt * 0.9 + 2))[:, None]
        BUS['amb'] += lap * (w * 0.03)[:, None] + noiseH * (w * gust * 0.004)[:, None]; frogs(t0, t1); crickets(t0, t1, 0.6)
    elif place == 'temple':
        BUS['amb'] += noiseL * (w * (0.5 + 0.5 * gust) * 0.022)[:, None]
        for tb in np.arange(t0 + 6, t1 - 3, 23): put('amb', pitch(VC('Idiophones/Struck Idiophones/Hand Bells, Nepalese/HB_*'), -14), tb, 0.08, 0.5, verb=0.9)
    elif place == 'abyss':
        BUS['amb'] += filt(noiseL, 'lowpass', 120) * (w * 0.09)[:, None] + filt(noiseL, 'bandpass', [200, 500]) * (w * (0.4 + 0.6 * gust) * 0.02)[:, None]
for r in (CUE.get('rain') or []):  # rain: a hiss and the patter of drops
    w = window(r['t'][0], r['t'][1], 1.5)
    BUS['amb'] += filt(rng.normal(0, 1, (N, 2)).astype(np.float32), 'bandpass', [900, 9000]) * (w * 0.03)[:, None]
    for t in np.arange(r['t'][0], r['t'][1], 0.012):
        if rng.random() < 0.5: put('amb', filt(rng.normal(0, 1, (int(0.004 * SR), 2)).astype(np.float32), 'highpass', 2500) * 0.3, t, rng.uniform(0.005, 0.03), rng.uniform(-1, 1), verb=0.2)

# ---------------------------------------------------------------- the music
NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
def midi(n): m = re.match(r'([A-G][#b]?)(-?\d)', n); return 12 * (int(m.group(2)) + 1) + NOTE[m.group(1)]
class Inst:
    """a folder of samples, each named with its note (VSCO and VCSL both name middle C as C3: every folder sits an
    octave up, checked by measuring the pitch)"""
    def __init__(self, root, folder, gain=1.0):
        self.files = []
        for p in glob.glob(os.path.join(root, folder, '*.wav')):
            m = re.search(r'(?:^|_)([A-G][#b]?-?\d)[_.]', os.path.basename(p))
            if m: self.files.append((midi(m.group(1)), p))
        assert self.files, folder
        self.off = 12; self.gain = gain
    def note(self, n, dur=None, rr=0):
        n = midi(n) if isinstance(n, str) else n
        best = min(self.files, key=lambda f: (abs(f[0] + self.off - n), f[1]))
        cands = [f for f in self.files if f[0] == best[0]]; m0, p = cands[rr % len(cands)]
        x = pitch(load(p), n - (m0 + self.off))
        if dur: x = fade(x[:int(dur * SR)], 0.004, min(0.4, dur * 0.4))
        return x * self.gain
O = lambda f, g=1.0: Inst(VSCO, f, g)
L = lambda f, g=1.0: Inst(VCSL, f, g)
INST = {
    'CB': O('Strings/Solo Contrabass/SusVib', 1.2), 'VC': O('Strings/Cello Section/susvib'), 'VCt': O('Strings/Cello Section/trem'), 'VA': O('Strings/Viola Section/susvib'),
    'VN': O('Strings/Violin Section/susVib', 0.8), 'VNt': O('Strings/Violin Section/Trem', 0.8), 'HN': O('Brass/F Horn/sus'), 'TB': O('Brass/Tenor Trombone/sus'), 'TU': O('Brass/Tuba/sus'),
    'OC': L('Aerophones/Edge-blown Aerophones/Ocarina, Typical/Sustains/SusVib'), 'RC': L('Aerophones/Edge-blown Aerophones/Baroque Soprano Recorder/Sustain', 0.8),
    'PS': L('Chordophones/Zithers/Psaltery, Bowed and Plucked/LongBow'), 'ZH': L('Chordophones/Zithers/Dan Tranh/Normal'),
}
def play(inst, n, t, dur=None, g=1.0, p=0.0, verb=0.35, rr=0): put('music', INST[inst].note(n, dur, rr), t, g, p, verb)
def perc(root, folder): return sorted(glob.glob(os.path.join(root, folder, '*.wav')))
ID, MB = 'Idiophones/Struck Idiophones/', 'Membranophones/Struck Membranophones/'
PERC = {
    'timp': [p for p in perc(VSCO, 'Percussion/Timpani') if 'v3' in p] or perc(VSCO, 'Percussion/Timpani'), 'roll': perc(VSCO, 'Percussion/Timpani/Rolls'),
    'gong': [p for p in perc(VCSL, ID + 'Gong 1') if re.search(r'gong_(f|fff|2_f)\.', p)],      # the big gong
    'bo': [p for p in perc(VCSL, ID + 'Clash Cymbals 1') if re.search(r'_(ff|mf)\d', p)],        # the cymbals
    'bos': [p for p in perc(VCSL, ID + 'Clash Cymbals 1') if 'short' in p],                      # the cymbals, damped
    'ban': [p for p in perc(VCSL, ID + 'Woodblock') if 'click_f' in p],                          # the clapper
    'gu': [p for p in perc(VCSL, MB + 'Frame Drum') if 'HDrumS_HitMuted' in p] or perc(VCSL, MB + 'Frame Drum'),  # the high drum that leads
    'susp': [p for p in perc(VCSL, ID + 'Suspended Cymbal 1') if 'cresc_2s' in p or 'cresc_4s' in p],
    'tang': [p for p in perc(VCSL, MB + 'Bass Drum 2') if re.search(r'hit_(f|ff|mf1)\.', p)],   # the big drum
    'xiao': perc(VCSL, ID + 'Finger Cymbals'),                                                   # the small gong
}
for k, v in PERC.items(): assert v, k
def drum(kind, t, g=1.0, p=0.0, verb=0.4, semis=0, n=None):
    fs = PERC[kind]; x = load(fs[int(rng.integers(len(fs)))] if n is None else fs[n % len(fs)])
    if kind == 'bos': x = fade(x[:int(0.5 * SR)], 0.001, 0.25)
    put('music', pitch(x, semis), t, g, p, verb)
def qiang(t, g=1.0):  # gong and cymbals together, the theatre's full stop
    drum('gong', t, 0.55 * g, 0, 0.6, -1); drum('bo', t, 0.35 * g, 0.2, 0.5); drum('tang', t, 0.5 * g, 0, 0.4); drum('gu', t - 0.12, 0.25 * g, -0.2, 0.2, 4)
def luogu(kind, t0, t1, g=1.0):
    if kind == 'kaitai':  # the opening: the high drum rolls faster and faster, the clapper in it, and the gong
        t, gap = t0, 0.34
        while t < t1 - 0.3:
            drum('gu', t, 0.35 * g * (0.6 + 0.4 * (t - t0) / (t1 - t0)), -0.2, 0.25, 4); t += gap; gap = max(0.06, gap * 0.93)
        for tb in np.arange(t0, t1 - 0.5, 1.2): drum('ban', tb, 0.35 * g, 0.2, 0.3)
        return
    beat = {'fight': 0.36, 'chase': 0.3}.get(kind, 0.36)
    for j, t in enumerate(np.arange(t0, t1 - 0.05, beat)):
        e = j % 8
        drum('gu', t, (0.3 if e % 2 == 0 else 0.18) * g, -0.25, 0.2, 4, n=j)
        if kind == 'chase': drum('gu', t + beat / 2, 0.14 * g, -0.25, 0.2, 5, n=j + 1)
        if e in (0, 4): drum('tang', t, 0.35 * g, 0, 0.35)
        if e in (2, 6): drum('bos', t, 0.22 * g, 0.25, 0.35)
        if j % 16 == 0: drum('gong', t, 0.25 * g, 0, 0.5, -1)
        if e % 2 == 1 and kind == 'fight': drum('xiao', t, 0.05 * g, 0.4, 0.3, -12)
        if e == 0: drum('ban', t, 0.22 * g, 0.2, 0.25)
PENTA = {'Dm': ['D', 'F', 'G', 'A', 'C'], 'G': ['G', 'A', 'B', 'D', 'E'], 'Am': ['A', 'C', 'D', 'E', 'G'], 'C': ['C', 'D', 'E', 'G', 'A']}
def zheng(ch, t0, t1, g=1.0):
    """the zither's rolling pentatonic figures, a bar at a time: up and back down, each note left ringing"""
    sc = PENTA[ch]; notes = [n + str(o) for o in (3, 4) for n in sc] + [sc[0] + '5']
    figs = [[0, 2, 4, 5, 7, 5, 4, 2], [0, 3, 5, 7, 8, 10, 7, 5], [1, 4, 6, 8, 6, 4, 3, 1], [0, 2, 3, 5, 6, 8, 9, 10]]
    t, b = t0, 0
    while t < t1 - 0.4:
        for j, i in enumerate(figs[b % len(figs)]):
            tn = t + j * 0.36 + rng.uniform(-0.015, 0.015)
            if tn >= t1 - 0.2: break
            play('ZH', notes[min(i, len(notes) - 1)], tn, 2.4, g * (0.5 if j else 0.65), rng.uniform(-0.3, 0.3), 0.45, rr=j)
        t += 8 * 0.36; b += 1
CHORD = {'Dm': ('D', 'F', 'A'), 'D': ('D', 'F#', 'A'), 'Bb': ('Bb', 'D', 'F'), 'Gm': ('G', 'Bb', 'D'), 'A': ('A', 'C#', 'E'), 'F': ('F', 'A', 'C'), 'C': ('C', 'E', 'G'), 'Eb': ('Eb', 'G', 'Bb'), 'G': ('G', 'B', 'D'), 'Am': ('A', 'C', 'E')}
HIT = {'susp': (0.3, 0.6, 0), 'timp': (0.8, 0.45, -2), 'roll': (0.4, 0.45, -2), 'gong': (0.6, 0.8, -1), 'bo': (0.35, 0.6, 0), 'tang': (0.6, 0.4, 0)}
for ev in CUE['music']:
    g = ev.get('g', 1.0)
    if 'pad' in ev: play(ev['pad'], ev['n'], ev['t'], ev['d'], g, rng.uniform(-0.3, 0.3), 0.5)
    elif 'line' in ev:
        for n, t, d in ev['notes']: play(ev['line'], n, t, d, g, 0.1, 0.55)
    elif 'hit' in ev: gg, vb, sm = HIT[ev['hit']]; drum(ev['hit'], ev['t'], g * gg, 0, vb, sm)
    elif 'luogu' in ev:
        if ev['luogu'] == 'hit': qiang(ev['t'], g)
        else: luogu(ev['luogu'], ev['t'], ev['t1'], g)
    elif 'zheng' in ev:
        if ev['zheng'] == 'gliss': put('music', VC('Chordophones/Zithers/Dan Tranh/Gliss/Gliss_Dwn_Med_ff*'), ev['t'], 0.5 * g, 0, 0.5)
        else: zheng(ev['zheng'], ev['t'], ev['t1'], g)
    elif 'tutti' in ev:  # the strings (and the brass, unless soft) on one chord
        a, b, c = CHORD[ev['tutti']]; d = ev['d']; soft = ev.get('soft')
        parts = [('CB', a + '1', 0.7), ('VC', a + '2', 0.5), ('VA', c + '2', 0.4), ('VN', b + '4', 0.35), ('VN', a + '5', 0.3)]
        if not soft: parts += [('TU', a + '1', 0.6), ('TB', a + '2', 0.5), ('HN', a + '3', 0.45), ('HN', c + '3', 0.4)]
        for inst, n, gg in parts: play(inst, n, ev['t'], d, gg * g, rng.uniform(-0.4, 0.4), 0.6)
        if not soft: qiang(ev['t'], g)

# ---------------------------------------------------------------- the mix
def reverb(x, secs=2.2, pre=0.02):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, (n, 2)).astype(np.float32) * np.exp(-t * 6.9 / secs)[:, None]
    ir = filt(ir, 'lowpass', 5000); ir[:int(pre * SR)] = 0; ir /= np.sqrt((ir ** 2).sum(axis=0))
    return np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1).astype(np.float32)
music, sfx = BUS['music'], BUS['sfx']
if os.environ.get('STEMS'):
    for k, v in BUS.items(): sf.write(os.path.join(HERE, f'stem_{k}.wav'), v / max(1e-6, np.abs(v).max()) * 0.9, SR); print('stem', k, 'peak', float(np.abs(v).max()))
# the music steps back under the loudest moments
env = uniform_filter1d(np.abs(sfx).max(axis=1), int(0.05 * SR))
duck = uniform_filter1d(1 / (1 + np.clip(env - 0.25, 0, None) * 1.2), int(0.2 * SR))
VERB = reverb(BUS['verb'])

# ---------------------------------------------------------------- the voices, one mix per language
def voice_fx(x, fx):
    x = filt(x, 'highpass', 100)
    if fx == 'narrator':  # the storyteller beside the stage: close and warm, a little presence
        x = filt(x, 'lowpass', 9000); x = x + filt(x, 'bandpass', [180, 400]) * 0.25 + filt(x, 'bandpass', [2500, 4500]) * 0.2; x = np.tanh(x * 1.2) / 1.2
    else:  # the puppets' voices, out on the stage
        x = filt(x, 'lowpass', 8500); x = x + filt(x, 'bandpass', [2000, 4000]) * 0.2
    return x
def room(x, secs=0.35):
    n = int(secs * SR); t = np.arange(n) / SR; ir = rng.normal(0, 1, (n, 2)).astype(np.float32) * np.exp(-t * 18)[:, None]; ir[0] = 1.5; ir /= np.sqrt((ir ** 2).sum(axis=0))
    return np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in range(2)], axis=1).astype(np.float32)
VOICES = os.path.join(HERE, f'voices_{EP}.json')
LANGS = json.load(open(VOICES, encoding='utf-8')) if os.path.exists(VOICES) else {'zh': [], 'en': []}
out = os.path.join(HERE, '..', 'audio'); os.makedirs(out, exist_ok=True)
# how long each line really takes to say, so the player keeps its subtitle up until it has been said
json.dump({lang: [[round(L['t'] - 0.04, 3), round(L['dur'], 3)] for L in lines] for lang, lines in LANGS.items()}, open(os.path.join(out, f'{EP}.lines.json'), 'w'))
# the mouths: each line's loudness, 30 times a second, 0..100, from when it starts in film time
def envelope(path):
    x = load(path).mean(axis=1); hop = SR // 30; n = len(x) // hop
    e = np.sqrt(np.array([np.mean(x[i * hop:(i + 1) * hop] ** 2) for i in range(n)]) + 1e-9)
    e = e / max(1e-6, np.percentile(e, 95)); e = np.clip((e - 0.12) / 0.75, 0, 1) ** 0.8
    return [int(v * 100) for v in e]
json.dump({lang: [[round(to_film(L['t']), 3), L['who'], envelope(L['file'])] for L in lines] for lang, lines in LANGS.items()}, open(os.path.join(out, f'{EP}.mouth.json'), 'w'), separators=(',', ':'))
for lang, lines in LANGS.items():
    dlg = np.zeros((N, 2), np.float32)
    for L in lines:
        x = load(L['file']); x = x / max(1e-6, float(np.sqrt((x ** 2).mean()))) * 0.11 * (1.25 if L['loud'] else 1.0)
        x = voice_fx(x, L['fx'])
        dry = 0.5 if L['fx'] == 'narrator' else 0.2  # the storyteller close, the puppets out on the stage
        if L.get('emo') == 'inner': x = filt(x, 'lowpass', 6000) * 0.8; x = x + reverb(x, 1.2, 0.03) * 0.35; dry = 0.8
        if L.get('emo') in ('angry', 'shout'): x = np.tanh(x * 2.2) / 2.2 * 1.25  # a raised voice: driven, a little louder
        x = room(x) * (1 - dry) + x * dry; start = to_film(L['t'])
        i = max(0, int(start * SR)); n = min(len(x), N - i)
        dlg[i:i + n] += pan(x[:n], 0.0)
    # everything else steps back while someone is speaking
    venv = uniform_filter1d(np.abs(dlg).max(axis=1), int(0.08 * SR)); speak = np.clip(venv / 0.05, 0, 1)
    speak = uniform_filter1d(speak, int(0.3 * SR))  # ease in and out of the ducking
    mduck = 1 - 0.65 * speak; sduck = 1 - 0.35 * speak
    mix = sfx * sduck[:, None] + music * db(-5) * (duck * mduck)[:, None] + BUS['amb'] * db(9) * sduck[:, None] + VERB * db(-6) + dlg
    mix = filt(mix, 'highpass', 28)
    tt = np.arange(N) / SR; mix *= np.clip(tt / 0.6, 0, 1)[:, None] * np.clip((FILM + 0.6 - tt) / 1.2, 0, 1)[:, None]
    # level: the loudest few moments (the top 0.05 % of samples) at -1 dB; a look-ahead limiter catches what is above
    peak = np.abs(mix).max(axis=1); mix *= db(-1) / max(1e-6, float(np.percentile(peak, 99.95))); peak = np.abs(mix).max(axis=1)
    look = int(0.004 * SR)
    g = minimum_filter1d(np.minimum(1, db(-1) / np.maximum(peak, 1e-6)), size=2 * look + 1)
    g = uniform_filter1d(minimum_filter1d(g, size=int(0.02 * SR)), size=int(0.02 * SR))
    mix = np.clip(mix * g[:, None], -db(-0.5), db(-0.5))[:int((FILM + 0.6) * SR)]
    wav = os.path.join(HERE, f'{EP}.{lang}.wav'); sf.write(wav, mix, SR, subtype='PCM_24')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-q:a', '1' if FILM < 90 else '3' if FILM < 400 else '6', os.path.join(out, f'{EP}.{lang}.mp3')], check=True)
    print(EP, lang, len(lines), 'lines', 'film', round(FILM, 1), 'peak', round(float(np.abs(mix).max()), 3), 'rms dB', round(float(20 * np.log10(np.sqrt((mix ** 2).mean()))), 1))
