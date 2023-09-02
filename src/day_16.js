/**
 * Contains solutions for Day 16
 * Puzzle Description: https://adventofcode.com/2022/day/16
 */
import { toNumber } from './util/string.js';

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
 * Removes entries for any nodes which do not not have a flow rate of at least 1.
 */
const pickPositiveFlow = (graph, distances) =>
  Object.keys(distances).reduce((acc, key) => {
    if (graph[key].flowRate > 0) {
      acc[key] = distances[key];
    }
    return acc;
  }, {});

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

  // return Object.keys(history).reduce((acc, key) => {
  //   acc[key] = pickPositiveFlow(graph, history[key]);
  //   return acc;
  // }, {});

  // return distances only to nodes with positive flow.
  return history;
};

/**
 * Returns map of a nodes key to the the distances to each node.
 */
const getTravelCosts = (graph, keys) =>
  keys.reduce((acc, key) => ({ ...acc, [key]: nodeDistances(graph, key) }), {});

/**
 * Return a new object which wraps the graph with additional data to make computations easier.
 */
const augmentGraph = (graph) => {
  const keys = Object.keys(graph);
  const travelCosts = getTravelCosts(graph, keys);
  return {
    graph,
    keys,
    travelCosts,
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
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const findMaximumPressure = ({ graph, keys, travelCosts }, startNodeKey, totalTime) => {
  // // return a hash code of the state.
  const hashCode = (currentNodeKey, pressure, time, opened) =>
    `${currentNodeKey}_${pressure}_${time}_${hashNodes(opened, keys)}`;

  // object which will map a state to its maximum value.
  const memo = {};

  // recursively find the max value in a top down manner
  const topDown = (currentNodeKey, time, pressure, opened) => {
    // return value if already memoized.
    const stateHash = hashCode(currentNodeKey, pressure, time, opened);
    if (memo[stateHash]) {
      return memo[stateHash];
    }

    // recursively find the max value by visiting unopened nodes.
    const maxPressure = Object.keys(travelCosts[currentNodeKey]).reduce(
      (max, targetKey) => {
        const { flowRate } = graph[targetKey];
        const newTime = time - travelCosts[currentNodeKey][targetKey] - 1;
        if (!opened.has(targetKey) && flowRate > 0 && newTime >= 0) {
          const newPressure = flowRate * newTime + pressure;
          const newVisited = new Set([...opened, targetKey]);
          const result = topDown(targetKey, newTime, newPressure, newVisited);
          return result > max ? result : max;
        }
        return max;
      },
      pressure
    );

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
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  const graph = parseLines(lines);
  return 1234;
};
