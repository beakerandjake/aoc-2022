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

const getChoices = (graph, travelCosts, visitedNodes, minutes, pressure) =>
  Object.entries(travelCosts)
    // skip already opened nodes.
    .filter(([key]) => !visitedNodes.has(key))
    // skip nodes which have no flow rate. F
    .filter(([key]) => graph[key].flowRate > 0)
    // calculate the new state if move to and open node.
    .map(([key, travelCost]) => {
      // include one minute it takes to open the valve.
      const remainingTime = minutes - travelCost - 1;
      return {
        current: key,
        remainingTime,
        pressure: graph[key].flowRate * remainingTime + pressure,
        visited: new Set([...visitedNodes, key]),
      };
    })
    .filter(({ remainingTime }) => remainingTime > 0);

const maximumRelease = (graph, startNodeKey, minutes) => {
  const travelCosts = Object.keys(graph).reduce(
    (acc, key) => ({ ...acc, [key]: nodeDistances(graph, key) }),
    {}
  );
  const queue = [...getChoices(graph, travelCosts[startNodeKey], new Set(), minutes, 0)];
  let maximum = 0;

  while (queue.length) {
    const { current, visited, pressure, remainingTime } = queue.shift();
    if (pressure > maximum) {
      maximum = pressure;
    }
    queue.push(
      ...getChoices(graph, travelCosts[current], visited, remainingTime, pressure)
    );
  }
  return maximum;
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

  const topDown = (key, time, pressure, opened) => {
    // no time left means the pressure we have is the pressure we got.
    if (time <= 0) {
      return pressure;
    }

    // return value if already memoized.
    const stateHash = hashCode(time, opened);
    if (memo[stateHash]) {
      return memo[stateHash];
    }

    const results = [];
    // travel to each unopened neighbor and get the result if we opened that value.
    for (const [neighborKey, travelTime] of Object.entries(travelCosts[key])) {
      const { flowRate } = graph[neighborKey];
      const remainingTime = time - travelTime - 1;
      if (!opened.has(neighborKey) && flowRate > 0 && remainingTime > 0) {
        results.push(
          topDown(
            neighborKey,
            remainingTime,
            flowRate * remainingTime + pressure,
            new Set([...opened, neighborKey])
          )
        );
      }
    }

    const result = results.length ? Math.max(...results) : pressure;
    // memoize this result so we don't have to recalculate it again.
    memo[stateHash] = result;
    return result;
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
