# FoxGooseCorn
Classic river crossing problem solved using Dijkstra's algo in TypeScript

Solution for question at [Hashnode - Can you solve "Fox, Goose and Corn" problem through code?](https://hashnode.com/post/fun-challenge-can-you-solve-fox-goose-and-corn-problem-through-code-cjpsjz01l008mh6s15hjxl4cp).

Before running, please ensure you have TypeScript install globally.

Run: `npm run start` or `yarn start`.

Pseudo Code:
1. Create a forest of 2^4 nodes, each representing a state in the game.
2. Mark states which can't be reached (according to game rules) as invalid.
3. Add directed edges between the nodes where transition is possible with weight of 1 (it takes one step to make a transition).
4. Now run Dijkstra's algo to find the shortest distance and path.
