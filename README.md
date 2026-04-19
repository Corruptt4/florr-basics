# Information!
- This project and its basics by TrickyArrasGames (Corruptt4 on Github)
- FREE TO USE, BUT NO GUARANTEES WHEN FORKING THIS PROJECT AND USING IT FOR YOUR OWN GAME!
- Open-source of course. What'd you expect?
- THIS IS FLORR.IO WAVES! NOT FLORR.IO MAZE MAP!

### Specific features
- Sandstorm explodes into 2-6 sandstorms (rarity-2)
- Bubble petal summons a Bubble mob (like in flowr.fun, but once it explodes, it also deals pop damage, 5x its body damage)

### It has Loadout and drag-and-drop feature
### The inventory is done anyway

# Important! (Must read to understand the code and files!)
- THIS IS MADE IN CanvasRenderingContext2D! Mobs, petals, visuals.

### Folders and files and what they keep
- main.js - everything that makes the game function and run.
- MODULES - all modules needed for the game to work

### MODULES and descendants
#### ENTITIES - Definition of all entities: Mob, Petal, Player
- Decorator.js has the decoration, and function to make the decoration on the map.
- mob.js is mob definition, petal.js is petal definition, player.js is player definition, drop.js is drop definition

#### PHYSICS - Contains the QuadTree currently that makes collisions work! SPATIAL HASHING BEING ADDED!
- COLLISION SYSTEM USED IS BUCKETS (for example, an entity has boundaries bigger than the entity, any other entity entering it and overlapping with it is detected and then distance for collisions are calculated)
- COLLISIONS WORK IN 15Hz!
- KEEP IN MIND, THIS NOW USES SPATIAL HASHING! NO QUAD TREE NOW!

#### GAME - Contains game handler stuff
- waveHandler.js - Used one currently. Just florr.io waves

#### STORAGE - Contains the mobs and petals.
- mobs.js - Contains all current mobs in the game. If you want to make a new mob, keep in mind default placeholder is the Baby Ant!
- petal.js - Contains all petals currently.

#### UI - Contains the UI elements
- inventory.js - You can see all petals and drag them inside
- petalBox.js - The petal itself, includes all its stats.
- mobBox.js - The mob itself, you can see it and its stats. Shown below the wave bar.

#### SCRIPTS - Contains certain scripts, currently functions.js, all functions needed for the game to work and use to ease work.

#### CAMERA.JS - The camera for the player.

# main.js has a loop that runs in 60hz to update all states, rendering works up to your device's FPS/refresh rate/Hz.