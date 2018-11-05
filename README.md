# NG-A-Star
Angular 6 A* pathfinding implementation based on: http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html

# How to build/run
1. `npm install`
2. `ng serve -o`

# How to use
Click on a cell to change its state. Click and drag to draw/clear blocked cells

1. Define start
2. Define target
3. Optional: add blocked cells
4. Press 'Find Path' to find the shortest path

## Cell states
1. Empty - white
2. Blocked - gray
3. Start - green
4. End - red
5. Possible path - blue

## Optional
* Press 'Clear Path' to clear path
* Press 'Reset Grid' to clear the whole grid
* Toggle 'Allow diagonal movement' to enable/disable diagonal movement