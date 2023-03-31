import {
  parse2dArray,
  elementAt2d,
  index2d,
  inRange,
  cardinalNeighbors2d,
  forEach2d,
  indexToCoordinate2d,
  minBy,
  alphabet,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

const isStartNode = (value) => value === 'S';

const isEndNode = (value) => value === 'E';

const elevationMap = alphabet().reduce((acc, character, index) => {
  acc[character] = index + 1;
  return acc;
}, {});

class Node {
  constructor(value, id) {
    this.value = value;
    this.id = id;
    this.neighbors = [];
  }

  toString() {
    return `<${this.id}> = ${this.value}`;
  }
}

const parseInput = (input) => {
  const { items: nodes, shape } = parse2dArray(
    input,
    (value, index) => new Node(value, index)
  );

  for (let index = 0; index < nodes.length; index++) {
    const { y, x } = indexToCoordinate2d(shape.width, index);
    nodes[index].neighbors = cardinalNeighbors2d(nodes, shape, y, x);
  }

  return nodes;
};

const printGraph = (graph) => {
  graph.forEach((x) => {
    console.log(`${x}, neighbors: [${x.neighbors.join(',')}]`);
  });
};

const findClosestUnvisitedNode = (nodes) => minBy(nodes, (x) => x.tentativeDistance);

const distance = (from, to) => {
  if (isStartNode(from) || isEndNode(to)) {
    return 1;
  }

  const fromElevation = elevationMap[from];
  const toElevation = elevationMap[to];

  if (toElevation < fromElevation) {
    return 1;
  }

  return toElevation - fromElevation;
};

const isUnvisited = (node, visitedSet) => visitedSet.includes(node);

const tracePath = (end, start, history) => {
  const toReturn = [];
  let current = end.id;

  while (current !== start.id) {
    toReturn.unshift(current);
    current = history[current];
  }

  return toReturn;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const nodes = parseInput(input);
  const distances = nodes.map((x) =>
    isStartNode(x.value) ? 0 : Number.MAX_SAFE_INTEGER
  );
  const previous = nodes.map(() => -1);
  const unvisited = [...nodes];
  let current;

  while (unvisited.length > 0) {
    current = findClosestUnvisitedNode(unvisited);

    if (isEndNode(current.value)) {
      break;
    }

    current.neighbors
      .filter((neighbor) => unvisited.some((x) => x.id === neighbor.id))
      // eslint-disable-next-line no-loop-func
      .forEach((neighbor) => {
        const distanceFromCurrent =
          distances[current.id] + distance(current.value, neighbor.value);
        if (distanceFromCurrent < distances[neighbor.id]) {
          distances[neighbor.id] = distanceFromCurrent;
          previous[neighbor.id] = current.id;
        }
      });

    unvisited.splice(unvisited.indexOf(current), 1);
  }

  const path = [];

  console.log(tracePath(current, ));

  console.log(previous);
  console.log(current);

  return 1234;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
