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

const startCharacter = 'S';
const endCharacter = 'E';

const characterHeightMap = (() => {
  const toReturn = lowercaseAlphabet().reduce((acc, character, index) => {
    acc[character] = index + 1;
    return acc;
  }, {});
  toReturn[startCharacter] = toReturn.a;
  toReturn[endCharacter] = toReturn.z;
  return toReturn;
})();

const createNode = (id, character, height) => ({
  id,
  character,
  height,
  edges: [],
});

const edgeWeight = (from, to) => {
  const diff = Math.max(1, to - from);
  return diff === 1 ? diff : Number.MAX_SAFE_INTEGER;
};

const createEdge = (fromId, toId, weight) => ({
  fromId,
  toId,
  weight,
});

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

    for (let index = 0; index < edgesLength; index++) {
      const edge = current.edges[index];
      if (!unvisited.includes(edge.toId)) {
        continue;
      }
      const newDistance = distances[edge.fromId] + edge.weight;
      if (newDistance < distances[edge.toId]) {
        distances[edge.toId] = newDistance;
        history[edge.toId] = current.id;
      }
    }

    // current.edges
    //   .filter((edge) => unvisited.some((x) => x === edge.toId))
    //   .forEach((edge) => {
    //     const newDistance = distances[edge.fromId] + edge.weight;
    //     if (newDistance < distances[edge.toId]) {
    //       distances[edge.toId] = newDistance;
    //       history[edge.toId] = current.id;
    //     }
    //   });
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
