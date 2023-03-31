import {
  parse2dArray,
  elementAt2d,
  index2d,
  inRange,
  cardinalNeighbors2d,
  forEach2d,
  indexToCoordinate2d,
  minBy,
  lowercaseAlphabet,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

// graph has nodes, nodes have edges

const startCharacter = 'S';
const isStartNode = (value) => value === startCharacter;

const endCharacter = 'E';
const isEndNode = (value) => value === endCharacter;

const elevationMap = lowercaseAlphabet().reduce((acc, character, index) => {
  acc[character] = index + 1;
  return acc;
}, {});
elevationMap[startCharacter] = elevationMap.a;
elevationMap[endCharacter] = elevationMap.z;

const createNode = (id, value, character) => ({
  id,
  value,
  character,
  neighbors: [],
});

const edgeWeight = (from, to) => (from >= to ? 1 : to - from);

const createEdge = (from, to) => ({
  fromId: from.id,
  toId: to.id,
  weight: edgeWeight(from.value, to.value),
});

const parseInput = (input) => {
  const { items: nodes, shape } = parse2dArray(input, (character, index) =>
    createNode(index, elevationMap[character], character)
  );

  for (let index = 0; index < nodes.length; index++) {
    const current = nodes[index];
    const { y, x } = indexToCoordinate2d(shape.width, index);
    current.neighbors = cardinalNeighbors2d(nodes, shape, y, x).map((neighbor) =>
      createEdge(current, neighbor)
    );
  }

  return nodes;
};

const edgeToString = ({ fromId, toId, weight }) =>
  `${fromId} to ${toId}, weight: ${weight}`;

const nodeToString = ({ id, value, character }) => `${id} = ${value} (${character})`;

const printGraph = (graph) => {
  console.group('Graph');
  graph.forEach((node) => {
    console.log(`node: ${nodeToString(node)}`);
    console.group('neighbors:');
    node.neighbors.forEach((x) => {
      console.log(edgeToString(x));
    });
    console.groupEnd();
    console.log();
  });
  console.groupEnd();
};

const findClosestUnvisitedNode = (nodes) => minBy(nodes, (x) => x.tentativeDistance);

const distance = (from, to) => {
  if (isStartNode(from) || isEndNode(to)) {
    return 0;
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
  console.log();
  const nodes = parseInput(input);

  printGraph(nodes);
  // const distances = nodes.map((x) =>
  //   isStartNode(x.value) ? 0 : Number.MAX_SAFE_INTEGER
  // );
  // const previous = nodes.map(() => -1);
  // const unvisited = [...nodes];
  // let current;

  // while (unvisited.length > 0) {
  //   current = findClosestUnvisitedNode(unvisited);

  //   if (isEndNode(current.value)) {
  //     break;
  //   }

  //   current.neighbors
  //     .filter((neighbor) => unvisited.some((x) => x.id === neighbor.id))
  //     // eslint-disable-next-line no-loop-func
  //     .forEach((neighbor) => {
  //       const distanceFromCurrent =
  //         distances[current.id] + distance(current.value, neighbor.value);
  //       if (distanceFromCurrent < distances[neighbor.id]) {
  //         distances[neighbor.id] = distanceFromCurrent;
  //         previous[neighbor.id] = current.id;
  //       }
  //     });

  //   unvisited.splice(unvisited.indexOf(current), 1);
  // }

  // const path = [];

  // console.log(tracePath(current, ));

  // console.log(previous);
  // console.log(current);

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
