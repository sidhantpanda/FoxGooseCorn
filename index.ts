import MinHeap from "./minHeap";

class State {
  public Farmer: number;
  public Fox: number;
  public Goose: number;
  public Corn: number;

  public isValidState: boolean;
  public distance: number;
  public currentState: string;
  public prevState: string;
  public transitionsAvailable: Transition[];

  constructor(Farmer: number, Fox: number, Goose: number, Corn: number) {
    this.Farmer = Farmer;
    this.Fox = Fox;
    this.Goose = Goose;
    this.Corn = Corn;

    this.currentState = getStateString(Farmer, Fox, Goose, Corn);
    // Check if state is possible
    this.isValidState = isStateValid(Farmer, Fox, Goose, Corn);
    this.distance = Number.MAX_VALUE;
    this.transitionsAvailable = [];
    this.prevState = null;
  }

  public static copy(state: State): State {
    const item = new State(state.Farmer, state.Fox, state.Goose, state.Corn);
    item.setDistance(state.distance);
    item.transitionsAvailable = state.transitionsAvailable;
    item.prevState = state.prevState;
    return item;
  }

  public setDistance(distance: number) {
    this.distance = distance;
  }
}

const StateComparator = (a: State, b: State) => {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return -1;
  }
  if (b == null) {
    return 1;
  }


  if (a.distance > b.distance) {
    return 1;
  }

  if (b.distance > a.distance) {
    return -1;
  }

  return 0;
}

const MinifyState = (item: State): State => {
  const result = State.copy(item);
  result.setDistance(Number.MIN_VALUE);
  return result;
}

const GetStateKey = (item: State) => {
  return item.currentState;
}

class Transition {
  public steps: number;
  public state: string
  constructor(steps: number, state: string) {
    this.steps = steps;
    this.state = state;
  }
}

interface Forest {
  [state: string]: State;
}

const getStateString = (Farmer: number, Fox: number, Goose: number, Corn: number): string => (String(Farmer) + String(Fox) + String(Goose) + String(Corn));

const isStateValid = (Farmer: number, Fox: number, Goose: number, Corn: number): boolean => {
  if (Farmer === 1) {
    // If Farmer is present and either if
    // (1) Goose and Corn both absent
    // (2) Fox and Goose both absent
    // is true, then game can is not in a valid state
    if (Fox === 0 && Goose === 0) {
      return false;
    }

    if (Goose === 0 && Corn === 0) {
      return false;
    }

    // otherwise state is possibe
    return true;
  } else {
    // If Farmer is not present and either if any of
    // (1) Fox and Goose are together
    // (2) Goose and Corn are together
    // is true, then game can is not in a valid state
    if (Fox === 1 && Goose === 1) {
      return false;
    }

    if (Goose === 1 && Corn === 1) {
      return false;
    }

    // otherwise state is possibe
    return true;
  }
}

const getValidTransitions = (state: string, forest: Forest) => {
  const Man = state[0];
  const Fox = state[1];
  const Goose = state[2];
  const Corn = state[3];

  const transitions: Transition[] = [];

  const addTransitionIfValid = (nextState: string) => {
    if (forest[nextState].isValidState) {
      transitions.push(new Transition(1, nextState));
    }
  }

  if (Man === '1') {
    // If Man is present

    // Can he go alone?
    let possibleState = '0' + Fox + Goose + Corn;
    addTransitionIfValid(possibleState);

    // Is Fox available and can he take it?
    if (Fox === '1') {
      possibleState = '0' + '0' + Goose + Corn;
      addTransitionIfValid(possibleState);
    }

    // Is Goose available and can he take it?
    if (Goose === '1') {
      possibleState = '0' + Fox + '0' + Corn;
      addTransitionIfValid(possibleState);
    }

    // Is Corn available and can he take it?
    if (Corn === '1') {
      possibleState = '0' + Fox + Goose + '0';
      addTransitionIfValid(possibleState);
    }
  } else {
    // If Man is absent

    // Can he come back alone?
    let possibleState = '1' + Fox + Goose + Corn;
    addTransitionIfValid(possibleState);

    // Is Fox absent and can he bring it back?
    if (Fox === '0') {
      possibleState = '1' + '1' + Goose + Corn;
      addTransitionIfValid(possibleState);
    }

    // Is Goose absent and can he bring it back?
    if (Goose === '0') {
      possibleState = '1' + Fox + '1' + Corn;
      addTransitionIfValid(possibleState);
    }

    // Is Corn absent and can he bring it back?
    if (Corn === '0') {
      possibleState = '1' + Fox + Goose + '1';
      addTransitionIfValid(possibleState);
    }
  }
  return transitions;
}

let forest: Forest = {};
// Lets fill our forest
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      for (let s = 0; s < 2; s++) {
        forest[getStateString(i, j, k, s)] = new State(i, j, k, s);;
      }
    }
  }
}

// Now get add the edges
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      for (let s = 0; s < 2; s++) {
        forest[getStateString(i, j, k, s)].transitionsAvailable = getValidTransitions(forest[getStateString(i, j, k, s)].currentState, forest);
      }
    }
  }
}

// Now we have our directed graph for the problem.
// We need to travel from state '1111' to '0000'
// We'll run Djikstra's Algo now assuming a solution is possible

// Initialize start position
forest['1111'].setDistance(0);
// forest['0100'].setDistance(20);
const heap = new MinHeap<State>(StateComparator, MinifyState, GetStateKey);
const unvisitedStates: string[] = [];
// Now get add the edges
for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 2; j++) {
    for (let k = 0; k < 2; k++) {
      for (let s = 0; s < 2; s++) {
        // console.log('Adding state: ', getStateString(i, j, k, s));
        const item = forest[getStateString(i, j, k, s)];
        unvisitedStates.push(getStateString(i, j, k, s));
        heap.insertItem(State.copy(item));
      }
    }
  }
}

while (unvisitedStates.length > 0) {
  const min: State = heap.getMin();
  unvisitedStates.splice(unvisitedStates.indexOf(min.currentState), 1);
  heap.deleteItem(min.currentState);

  for (let i = 0; i < min.transitionsAvailable.length; i++) {
    const transition = min.transitionsAvailable[i];
    let temp = min.distance + transition.steps;
    if (min.distance === Number.MAX_VALUE) {
    }
    if (forest[transition.state].distance > temp) {
      forest[transition.state].setDistance(temp);
      forest[transition.state].prevState = min.currentState;

      heap.decreaseItem(transition.state, forest[transition.state]);
    }
  }
}

let targetItem = forest['0000'];
let steps: string[] = [];
while (targetItem && targetItem.prevState != null) {
  steps.push(targetItem.currentState);
  targetItem = forest[targetItem.prevState];
}

for (let i = steps.length - 1; i >= 0; i--) {
  console.log('Step', steps.length - i, steps[i]);
}