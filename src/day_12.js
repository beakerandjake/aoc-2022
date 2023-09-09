import {
  parse2dArray,
  cardinalNeighbors2d,
  lowercaseAlphabet,
  minHeap,
  mapPoints,
} from './util/index.js';

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
 * Search the graph for the target node.
 * @param {Array} graph
 */
const findTargetNode = (graph) =>
  graph.find((x) => x.character === specialCharacters.target);

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
  toReturn[specialCharacters.target] = toReturn.z;
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
  // parse into a flat 2d array and convert each character to a node.
  const flattened = parse2dArray(input, (character, index) =>
    createNode(index, character, characterHeightMap[character])
  );
  // update the edges of each node to have its N,S,E,W neighbors
  return mapPoints(flattened, (current, y, x) => ({
    ...current,
    edges: cardinalNeighbors2d(flattened, y, x).map((neighbor) =>
      createEdge(current.id, neighbor.id, edgeWeight(current.height, neighbor.height))
    ),
  })).items;
};

/**
 * Returns the shortest path from the start node to the target node.
 */
const dijkstras = (() => {
  /**
   * Returns a the number of steps taken by walking backwards through the history from the end node to the start node.
   */
  const countSteps = (history, endNode, startNode) => {
    let toReturn = 0;
    let currentIndex = endNode.id;

    while (history[currentIndex] !== -1 && currentIndex !== startNode.id) {
      toReturn++;
      currentIndex = history[currentIndex];
    }

    return toReturn;
  };

  // standard implementation of dijkstras algorithm.

  return (graph, startNode, targetNode) => {
    const distances = graph.map(() => Number.MAX_SAFE_INTEGER);
    const history = graph.map(() => -1);
    const unvisited = minHeap();

    distances[startNode.id] = 0;
    unvisited.push(startNode.id, 0);

    while (!unvisited.isEmpty()) {
      const { element: currentId, priority: currentDistance } = unvisited.pop();

      if (currentId === targetNode.id) {
        break;
      }

      const currentEdges = graph[currentId].edges;
      const { length } = currentEdges;

      for (let edgeIndex = 0; edgeIndex < length; edgeIndex++) {
        const edge = currentEdges[edgeIndex];
        const newDistance = currentDistance + edge.weight;

        if (newDistance < distances[edge.toId]) {
          history[edge.toId] = currentId;
          distances[edge.toId] = newDistance;

          if (unvisited.contains(edge.toId)) {
            unvisited.update(edge.toId, newDistance);
          } else {
            unvisited.push(edge.toId, newDistance);
          }
        }
      }
    }
    return countSteps(history, targetNode, startNode);
  };
})();

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  const findStartNode = (graph) =>
    graph.find((x) => x.character === specialCharacters.start);

  return ({ input }) => {
    const graph = parseInput(input);
    return dijkstras(graph, findStartNode(graph), findTargetNode(graph));
  };
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = (() => {
  const getPotentialStarts = (graph) =>
    graph.filter(
      (node) => node.character === 'a' || node.character === specialCharacters.start
    );

  return ({ input }) => {
    const graph = parseInput(input);
    const endNode = findTargetNode(graph);
    const potentialStarts = getPotentialStarts(graph);
    return potentialStarts
      .map((start) => dijkstras(graph, start, endNode))
      .filter((x) => x > 0)
      .sort((a, b) => a - b)[0];
  };
})();
