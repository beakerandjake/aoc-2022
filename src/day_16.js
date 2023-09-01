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
 * Returns an object which maps each node to the length of the shortest path from that node to all other nodes.
 */
const nodeDistances = (graph, rootKey) => {
  // Use BFS to find the shortest path to other nodes.
  const queue = [rootKey];
  const history = {};
  while (queue.length) {
    const current = queue.shift();
    graph[current].neighbors
      .filter((x) => !(x in history))
      .forEach((x) => {
        history[x] = (history[current] || 0) + 1;
        queue.push(x);
      });
  }
  return history;
};

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const findMaximumPressure = (graph, startNodeKey, totalTime) => {
  // create a lookup which maps a node key to the distances to each node.
  const travelCosts = Object.keys(graph).reduce(
    (acc, key) => ({ ...acc, [key]: nodeDistances(graph, key) }),
    {}
  );

  // return a hash code of the state.
  const hashCode = (time, opened) => `${time}${[...opened].sort().join('')}`;

  // object which will map a state to its maximum value.
  const memo = {};

  // recursively find the max value in a top down manner
  const topDown = (costs, time, pressure, opened) => {
    // return value if already memoized.
    const stateHash = hashCode(time, opened);
    if (memo[stateHash]) {
      return memo[stateHash];
    }

    // recursively find the max value by visiting unopened nodes.
    const maxPressure = Object.keys(costs).reduce((max, targetKey) => {
      const { flowRate } = graph[targetKey];
      const newTime = time - costs[targetKey] - 1;
      if (!opened.has(targetKey) && flowRate > 0 && newTime > 0) {
        const newPressure = flowRate * newTime + pressure;
        const newVisited = new Set([...opened, targetKey]);
        const result = topDown(travelCosts[targetKey], newTime, newPressure, newVisited);
        return result > max ? result : max;
      }
      return max;
    }, pressure);

    // memoize the pressure released by this state so we don't have to recalculate it.
    memo[stateHash] = maxPressure;

    return maxPressure;
  };

  return topDown(travelCosts[startNodeKey], totalTime, 0, new Set());
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const graph = parseLines(lines);
  return findMaximumPressure(graph, 'AA', 30);
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
