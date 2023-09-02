/**
 * Contains solutions for Day 16
 * Puzzle Description: https://adventofcode.com/2022/day/16
 */
import { toNumber } from './util/string.js';
import { binaryToString } from './util/bitwise.js';
import { arrayToString, toSet } from './util/array.js';

/**
 * Return the node data represented by the line.
 */
const parseLine = (line) => {
  const [lhs, rhs] = line.split(';');
  return {
    name: lhs.slice(6, 8),
    flowRate: toNumber(lhs.slice(23)),
    neighbors: rhs.match(/[A-Z]{2}/g),
  };
};

/**
 * Returns a graph constructed from the input lines.
 */
const parseLines = (lines) =>
  lines
    .map((line) => parseLine(line))
    .reduce((acc, { name, ...nodeData }) => ({ ...acc, [name]: nodeData }), {});

/**
 * Returns an object which maps each node to the length of the shortest path from that node to all other nodes.
 */
const nodeDistances = (graph, rootKey) => {
  // use BFS to find the shortest path to other nodes.
  const queue = [rootKey];
  const history = {};
  while (queue.length) {
    const current = queue.shift();
    graph[current].neighbors
      .filter((key) => !(key in history))
      .forEach((key) => {
        history[key] = (history[current] || 0) + 1;
        queue.push(key);
      });
  }
  return history;
};

/**
 * Returns map of a nodes key to the the distances to each node.
 */
const getTravelCosts = (graph, keys) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: nodeDistances(graph, key) }), {});

/**
 * Removes entries for any nodes which do not not have a flow rate of at least 1.
 */
const pickNodesWithPositiveFlow = (graph, distances) =>
  Object.keys(distances).reduce((acc, key) => {
    if (graph[key].flowRate > 0) {
      acc[key] = distances[key];
    }
    return acc;
  }, {});

/**
 * Return a new object which wraps the graph with additional data to make computations easier.
 */
const augmentGraph = (graph) => {
  const keys = Object.keys(graph);
  const travelCosts = getTravelCosts(graph, keys);
  return {
    graph,
    keys,
    // for each travel cost, remove any node without positive flow.
    travelCosts: Object.keys(travelCosts).reduce((acc, key) => {
      const positiveFlow = pickNodesWithPositiveFlow(graph, travelCosts[key]);
      acc[key] = { ...positiveFlow, keys: Object.keys(positiveFlow) };
      return acc;
    }, {}),
  };
};

/**
 * Returns a hash code for the given set of opened nodes.
 */
const hashNodes = (opened, graphKeys) =>
  graphKeys.reduce((acc, key, index) => {
    if (opened.has(key)) {
      return acc | (1 << index);
    }
    return acc;
  }, 0);

/**
 * Return a hash code representing the state defined by the arguments.
 */
const hashCode = (currentNodeKey, pressure, time, opened, nodeKeys) =>
  `${currentNodeKey}_${pressure}_${time}_${hashNodes(opened, nodeKeys)}`;

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const findMaximumPressure = ({ graph, keys, travelCosts }, startNodeKey, totalTime) => {
  // object which will map a state to its maximum value.
  const memo = {};

  // recursively find the max value in a top down manner
  const topDown = (currentNodeKey, time, pressure, opened) => {
    // return value if already memoized.
    const stateHash = hashCode(currentNodeKey, pressure, time, opened, keys);
    if (stateHash in memo) {
      return memo[stateHash];
    }

    // recursively find the max value by visiting unopened nodes.
    const maxPressure = travelCosts[currentNodeKey].keys
      .filter((key) => !opened.has(key))
      .reduce((max, targetKey) => {
        const newTime = time - travelCosts[currentNodeKey][targetKey] - 1;
        if (newTime >= 0) {
          const newPressure = graph[targetKey].flowRate * newTime + pressure;
          const newOpened = new Set([...opened, targetKey]);
          const result = topDown(targetKey, newTime, newPressure, newOpened);
          return result > max ? result : max;
        }
        return max;
      }, pressure);

    // memoize the pressure released by this state so we don't have to recalculate it.
    memo[stateHash] = maxPressure;

    return maxPressure;
  };

  return topDown(startNodeKey, totalTime, 0, new Set());
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const graph = augmentGraph(parseLines(lines));
  return findMaximumPressure(graph, 'AA', 30);
};

/**
 * Returns an array of bit fields representing the possible ways the nodes can be visited by an individual.
 * A zero means the node is not visited, a one means the node is visited.
 */
const combinations = (nodeCount) => {
  const toReturn = [];
  const permutationCount = 2 ** (nodeCount - 1);
  for (let i = 0; i < permutationCount; i++) {
    toReturn.push(i);
  }
  return toReturn;
};

/**
 * Creates a new set out of each bit in the bitfield set to one.
 */
const bitFieldToSet = (bitField, keys) =>
  toSet(keys.filter((_, index) => bitField & (1 << index)));

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  console.log();
  const graph = augmentGraph(parseLines(lines));
  const nodes = ['AA', 'BB', 'CC', 'DD'];
  const result = combinations(nodes.length);
  for (let i = 0; i < result.length; i++) {
    const combination = result[i];
    const set = bitFieldToSet(combination, nodes);
    const inversion = ~combination;
    console.log(
      `combination: ${binaryToString(combination, nodes.length)}, set: ${arrayToString([
        ...set,
      ])} inversion: ${binaryToString(inversion, nodes.length)}`
    );
  }
  return 1234;
};
