/**
 * Contains solutions for Day 16
 * Puzzle Description: https://adventofcode.com/2022/day/16
 */
import { toNumber } from './util/string.js';
import { bitmask } from './util/bitwise.js';
import { range, toSet } from './util/array.js';
import { pick } from './util/object.js';

const defaultStartNode = 'AA';

/**
 * Parses the input and returns an object containing the graph and additional helper data.
 */
const parseGraph = (() => {
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
   * Return a new object which wraps the graph with additional data to make computations easier.
   */
  const augmentGraph = (graph) => {
    const keys = Object.keys(graph);
    return {
      graph,
      keys,
      travelCosts: getTravelCosts(graph, keys),
    };
  };

  /**
   * Compresses the augmented graph data to effectively ignore nodes with a zero flow rate.
   * Does not actually remove these nodes from the graph since computations are done through the helper data.
   */
  const compressGraph = ({ graph, keys, travelCosts }, startNodeKey) => {
    const positiveFlowKeys = keys.filter((key) => graph[key].flowRate > 0);
    const positiveFlowLookup = toSet(positiveFlowKeys);
    return {
      graph,
      keys: positiveFlowKeys,
      travelCosts: keys
        .filter((fromKey) => startNodeKey === fromKey || positiveFlowLookup.has(fromKey))
        .reduce((acc, fromKey) => {
          const value = pick(travelCosts[fromKey], positiveFlowKeys);
          // cache the keys because travel costs are iterated a lot.
          value.keys = Object.keys(value);
          acc[fromKey] = value;
          return acc;
        }, {}),
      bitmaskLookup: positiveFlowKeys.reduce((acc, key, index) => {
        acc[key] = 1 << index;
        return acc;
      }, {}),
    };
  };

  return (lines, startNodeKey) =>
    compressGraph(augmentGraph(parseLines(lines)), startNodeKey);
})();

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const maxPressure = (
  { graph, keys, travelCosts, bitmaskLookup },
  startNodeKey,
  totalTime,
  initialOpened = 0,
  best = 0
) => {
  // object which will memoize the result of previous recursions so we don't have to recalculate.
  const memo = {};

  /**
   * Return a hash code representing the state defined by the arguments.
   */
  const hashCode = (currentNodeKey, pressure, time, opened) =>
    `${currentNodeKey}_${pressure}_${time}_${opened}`;

  // recursively find the max value in a top down manner
  const topDown = (currentNodeKey, time, pressure, opened) => {
    // return value if already memoized.
    const stateHash = hashCode(currentNodeKey, pressure, time, opened);
    if (stateHash in memo) {
      return memo[stateHash];
    }

    // assume we could magically open every unopened value
    // if the total resulting pressure released can't even beat
    // the current best, then this branch is a dead end.
    const closed = ~opened;
    const optimisticBest = keys
      .filter((key) => closed & bitmaskLookup[key])
      .reduce((total, key) => total + graph[key].flowRate * (time - 1), pressure);
    if (optimisticBest < best) {
      memo[stateHash] = pressure;
      return { value: pressure, opened };
    }

    // recursively find the max value by visiting unopened nodes.
    const result = travelCosts[currentNodeKey].keys
      .filter((key) => !(opened & bitmaskLookup[key]))
      .reduce(
        (max, targetKey) => {
          const newTime = time - travelCosts[currentNodeKey][targetKey] - 1;
          if (newTime >= 0) {
            const newPressure = graph[targetKey].flowRate * newTime + pressure;
            const newOpened = opened | bitmaskLookup[targetKey];
            const newResult = topDown(targetKey, newTime, newPressure, newOpened);
            return newResult.value > max.value ? newResult : max;
          }
          return max;
        },
        { value: pressure, opened }
      );

    // memoize the pressure released by this state so we don't have to recalculate it.
    memo[stateHash] = result;

    return result;
  };

  return topDown(startNodeKey, totalTime, 0, initialOpened);
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) =>
  maxPressure(parseGraph(lines, defaultStartNode), defaultStartNode, 30).value;

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  /**
   * Returns an array of bit fields.
   * Assuming two individuals (a and b) are working together to visit a set of nodes.
   * The bit fields represent all possible combinations that the nodes can be visited a and b.
   * Assuming that a and b can split up and visit nodes separately.
   * In each bit field a one means the node is visited by a, and a zero means the node is visited by b.
   */
  const combinations = (nodeCount) => range(2 ** (nodeCount - 1));

  /**
   * Inverts the bitfield and discards irrelevant bits using the mask.
   */
  const invertBitField = (bitField, inversionMask) => inversionMask & ~bitField;

  return ({ lines }) => {
    const graph = parseGraph(lines, defaultStartNode);
    const solo = maxPressure(graph, defaultStartNode, 26);
    const elephantTarget = maxPressure(graph, defaultStartNode, 26, solo.opened);

    const inversionMask = bitmask(graph.keys.length);
    const betterElephantBranches = [];
    const soloCombinations = combinations(graph.keys.length);
    for (let index = 0; index < soloCombinations.length; index++) {
      const openedByMe = soloCombinations[index];
      const elephantResult = maxPressure(
        graph,
        defaultStartNode,
        26,
        openedByMe,
        elephantTarget.value
      );
      if (elephantResult.value >= elephantTarget.value) {
        betterElephantBranches.push({
          value: elephantResult.value,
          opened: invertBitField(openedByMe, inversionMask),
        });
      }
    }

    const values = [solo.value + elephantTarget.value];
    for (let index = 0; index < betterElephantBranches.length; index++) {
      const openedByElephant = betterElephantBranches[index].opened;
      const soloResult = maxPressure(graph, defaultStartNode, 26, openedByElephant);
      values.push(soloResult.value + betterElephantBranches[index].value);
    }

    return Math.max(...values);
  };
})();
