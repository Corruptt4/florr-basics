# Information!
- This project and its basics: mobs, petals, loadout, summons, armor, and sandstorm behaviour is made by TrickyArrasGames (Corruptt4 on Github)

### It has Loadout and drag-and-drop feature
### Inventory (ALMOST DONE, you can drag petals in the inventory and out the inventory)

# Important! (Must read to understand the code and files!)
- THIS IS MADE IN CanvasRenderingContext2D! Mobs, petals, visuals.

### Folders and files and what they keep
- main.js - everything that makes the game function and run.
- MODULES - all modules needed for the game to work

### MODULES and descendants
#### ENTITIES - Definition of all entities: Mob, Petal, Player
- Decorator.js has the decoration, and function to make the decoration on the map.

#### PHYSICS - Contains the QuadTree currently that makes collisions work!
- COLLISION SYSTEM USED IS BUCKETS (for example, an entity has boundaries bigger than the entity, any other entity entering it and overlapping with it is detected and then distance for collisions are calculated)
-- COLLISIONS WORK IN 15Hz!

#### STORAGE - Contains the mobs and petals.
- mobs.js - Contains all current mobs in the game. (Sandstorm, Beetle, Baby Ant, more may be added to the project) - If you want to make a new mob, keep in mind default placeholder is the Baby Ant!
- petal.js - Contains all petals currently. (Stick, Iris, Beetle Egg, Bacteria, Heavy, and Basic, more to be added soon.)

#### UI - Contains the UI elements
- inventory.js (W.I.P) - Not finished yet, only visuals finished. You have 10 of each existing petal currently, with all rarities. CLICK THE RARITY BOX TO CHANGE WHAT RARITY YOU SEE!
- petalBox.js - The petal itself, includes all its stats.

#### SCRIPTS - Contains certain scripts, currently functions.js, all functions needed for the game to work and use to ease work.

#### CAMERA.JS - The camera for the player.

# main.js has a loop that runs in 60hz to update all states, rendering works up to your device's FPS/refresh rare/Hz.