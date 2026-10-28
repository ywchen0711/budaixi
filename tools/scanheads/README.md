# Real heads for 天機策

Each character in `cast.json` gets one head, `models/heads/<id>.glb`: a Rocketbox avatar's head (`base`), optionally
blended with a second one (`mix`, weight `w`: shape matched point by point through the shared unwrap, skin by the
pixel), its painted hair recoloured to `hair` (or shaven, `bald`), a cap of hair fitted to the skull, 24 blend shapes
kept (visemes, blinks, smiles, frowns, brows), textures at 1024.

Source: https://github.com/microsoft/Microsoft-Rocketbox (MIT). Put next to this folder, served over http:

    fbx/<Avatar>.fbx        Assets/Avatars/.../Export/<Avatar>_facial.fbx
    tex/<Avatar>.tga        .../Textures/*_head_color.tga
    nor/<Avatar>.tga        .../Textures/*_head_normal.tga
    conv/                   cut.html, view.html, bake.mjs, cast.json, three.module.js (r160) and jsm/ (r160
                            examples: FBXLoader, TGALoader, GLTFExporter, GLTFLoader, utils, curves, libs/fflate)

Then `node bake.mjs [ids…]` (puppeteer-core and Chrome) writes `heads/<id>.glb`; copy them to `models/heads/`.
`view.html?d=heads&n=<id>&m=aa=1` shows one from the front, the side and behind, with blend shapes set.
