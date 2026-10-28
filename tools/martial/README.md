# Martial motion for the bodies

`models/martial.json` holds kicks (front, roundhouse, side, snap, knee, jumping), punches (lunge, boxing), blocks
(knife-hand, low), tai chi pushes, the rising and circling of qi, and a tai chi guard: real motion capture from the
CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu; "free for all uses"), in Bruce Hahne's BVH conversion
(github.com/meshula/cmu-mocap), retargeted onto the Universal Animation Library skeleton the bodies use.

`rt.mjs` retargets by matching the direction of each bone (the hips and chest as whole frames, each limb turned so
the limb below it bends the same way), scales by leg length and keeps the clips in place; `build.mjs` lists each
clip (the recording, the moment the blow lands, how long before and after), puts the feet back on the floor, and
writes the file, each clip carrying `hit`, the time its blow lands. Needs `npm i three@0.160.0` and the BVH files in
`../cmu/`. `view.html?bare=1&c=Kick_Front_R,Kick_Round_L` shows five moments of each.
