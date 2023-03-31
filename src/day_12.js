import {
  index2d,
  parse2dArray,
  cardinalNeighbors2d,
  indexToCoordinate2d,
  lowercaseAlphabet,
} from './util.js';

/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2022/day/12
 */

/**
 * Map of special characters in the input file.
 */
const specialCharacters = {
  start: 'S',
  target: 'E',
};

/**
 * Maps a input character to that characters topographical height.
 */
const characterHeightMap = (() => {
  const toReturn = lowercaseAlphabet().reduce((acc, character, index) => {
    acc[character] = index + 1;
    return acc;
  }, {});
  // start and end characters are at lowest and highest altitudes, respectively.
  toReturn[specialCharacters.start] = toReturn.a;
  toReturn[specialCharacters.end] = toReturn.z;
  return toReturn;
})();

/**
 * Creates a new graph node.
 * @param {Number} id - The id of this node, which must correspond to the index in the parent graph.
 * @param {String} character - The input character of this node.
 * @param {Number} height - The height of this node.
 */
const createNode = (id, character, height) => ({
  id,
  character,
  height,
  edges: [],
});

/**
 * Calculates the weight of traversing from one height to the other.
 * @param {Number} fromHeight
 * @param {Number} toHeight
 */
const edgeWeight = (fromHeight, toHeight) => {
  // treat diffs that are negative, equal to zero or equal to one equally, with a weight of 1.
  // all other diffs (which must be greater than 1) are not traversable (we don't want to get our climbing equipment out)
  const diff = Math.max(1, toHeight - fromHeight);
  return diff === 1 ? diff : Number.MAX_SAFE_INTEGER;
};

/**
 * Create a new graph edge, linking one node to another node
 * @param {Number} fromId - The id of the source node.
 * @param {Number} toId - The id of the dest node.
 * @param {Number} weight - The height difference between the source and dest nodes.
 */
const createEdge = (fromId, toId, weight) => ({
  fromId,
  toId,
  weight,
});

/**
 * Parse the input file and return a graph representing a topographical map.
 * @param {String} input
 */
const parseInput = (input) => {
  const { items: graph, shape } = parse2dArray(input, (character, index) =>
    createNode(index, character, characterHeightMap[character])
  );

  for (let index = 0; index < graph.length; index++) {
    const current = graph[index];
    const { y, x } = indexToCoordinate2d(shape.width, index);
    current.edges = cardinalNeighbors2d(graph, shape, y, x).map((neighbor) =>
      createEdge(current.id, neighbor.id, edgeWeight(current.height, neighbor.height))
    );
  }

  return graph;
};


const findStartNode = (graph) =>
  graph.find((x) => x.character === specialCharacters.start);
const findEndNode = (graph) => graph.find((x) => x.character === specialCharacters.end);

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

  while (currentIndex !== -1 && currentIndex !== startNode.id) {
    const currentNode = graph[currentIndex];
    toReturn.unshift(currentNode);
    currentIndex = history[currentIndex];
  }

  return toReturn;
};

const dijkstras = (graph, startNode, targetNode) => {
  const distances = graph.map(() => Number.MAX_SAFE_INTEGER);
  const history = graph.map(() => -1);
  const unvisited = graph.map((x) => x.id);

  distances[startNode.id] = 0;

  while (unvisited.length > 0) {
    const closestUnvisitedIndex = findClosestUnvisitedNode(unvisited, distances);
    const current = graph[unvisited[closestUnvisitedIndex]];
    unvisited.splice(closestUnvisitedIndex, 1);

    if (current.id === targetNode.id) {
      break;
    }

    const edgesLength = current.edges.length;

    for (let edgeIndex = 0; edgeIndex < edgesLength; edgeIndex++) {
      const edge = current.edges[edgeIndex];
      if (!unvisited.includes(edge.toId)) {
        continue;
      }
      const newDistance = distances[edge.fromId] + edge.weight;
      if (newDistance < distances[edge.toId]) {
        distances[edge.toId] = newDistance;
        history[edge.toId] = current.id;
      }
    }
  }

  return tracePath(graph, history, targetNode, startNode);
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
  return path.length;
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
