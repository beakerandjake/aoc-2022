import {
  parse2dArray,
  cardinalNeighbors2d,
  indexToCoordinate2d,
  lowercaseAlphabet,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

const edgeToString = ({ fromId, toId, weight }) =>
  `${fromId} to ${toId}, weight: ${weight}`;

const nodeToString = ({ id, character, height }) => `${id}=${character}(${height})`;

const printGraph = (graph) => {
  console.group('Graph');
  graph.forEach((node) => {
    console.log(`node: ${nodeToString(node)}`);
    console.group('neighbors:');
    node.edges.forEach((x) => {
      console.log(edgeToString(x));
    });
    console.groupEnd();
    console.log();
  });
  console.groupEnd();
};

const startCharacter = 'S';
const endCharacter = 'E';

const characterHeightMap = lowercaseAlphabet().reduce((acc, character, index) => {
  acc[character] = index + 1;
  return acc;
}, {});
characterHeightMap[startCharacter] = characterHeightMap.a;
characterHeightMap[endCharacter] = characterHeightMap.z;

const createNode = (id, character, height) => ({
  id,
  character,
  height,
  edges: [],
});

const edgeWeight = (from, to) => {
  ///(from >= to ? 1 : to - from); {

  const diff = to - from;

  if (diff <= 0) {
    return 1;
  }

  if (diff > 1) {
    return Number.MAX_SAFE_INTEGER;
  }

  return diff;
};

const createEdge = (from, to) => ({
  fromId: from.id,
  toId: to.id,
  weight: edgeWeight(from.height, to.height),
});

const parseInput = (input) => {
  const { items: nodes, shape } = parse2dArray(input, (character, index) =>
    createNode(index, character, characterHeightMap[character])
  );

  for (let index = 0; index < nodes.length; index++) {
    const current = nodes[index];
    const { y, x } = indexToCoordinate2d(shape.width, index);
    current.edges = cardinalNeighbors2d(nodes, shape, y, x).map((neighbor) =>
      createEdge(current, neighbor)
    );
  }

  return nodes;
};

const findStartNode = (graph) => graph.find((x) => x.character === startCharacter);
const findEndNode = (graph) => graph.find((x) => x.character === endCharacter);

const findClosestUnvisitedNode = (unvisited, distances) => {
  let smallestDistance = distances[unvisited[0]];
  let smallestIndex = 0;

  unvisited.forEach((nodeId, index) => {
    const current = distances[nodeId];
    if (current < smallestDistance) {
      smallestDistance = current;
      smallestIndex = index;
    }
  });

  return smallestIndex;
};

const tracePath = (graph, history, endNode, startNode) => {
  const toReturn = [];
  let currentIndex = endNode.id;

  while (currentIndex !== -1) {
    const currentNode = graph[currentIndex];
    toReturn.unshift(currentNode);
    currentIndex = history[currentIndex];
  }

  return toReturn;
};

const dijkstras = (graph, startNode, targetNode) => {
  const distances = graph.map(() => Number.MAX_SAFE_INTEGER);
  const previous = graph.map(() => -1);
  const unvisited = graph.map((x) => x.id);

  distances[startNode.id] = 0;

  while (unvisited.length > 0) {
    const closestUnvisitedIndex = findClosestUnvisitedNode(unvisited, distances);
    const current = graph[unvisited[closestUnvisitedIndex]];
    unvisited.splice(closestUnvisitedIndex, 1);

    if (current.id === targetNode.id) {
      break;
    }

    current.edges
      .filter((edge) => unvisited.some((x) => x === edge.toId))
      .forEach((edge) => {
        const newDistance = distances[edge.fromId] + edge.weight;
        if (newDistance < distances[edge.toId]) {
          distances[edge.toId] = newDistance;
          previous[edge.toId] = current.id;
        }
      });
  }

  return tracePath(graph, previous, targetNode, startNode);
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const graph = parseInput(input);
  const path = dijkstras(graph, findStartNode(graph), findEndNode(graph));
  return path.length - 1;
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
