/**
 * Contains solutions for Day 16
 * Puzzle Description: https://adventofcode.com/2022/day/16
 */
import { toNumber } from './util/string.js';
import { isBitSet, bitmask } from './util/bitwise.js';
import { range, toSet } from './util/array.js';
import { pick } from './util/object.js';

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
  const compress = ({ graph, keys, travelCosts }, startNodeKey) => {
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
    };
  };

  return (lines, startNodeKey) => compress(augmentGraph(parseLines(lines)), startNodeKey);
})();

/**
 * Returns a bit field which represents the set.
 * Iterates each item of the array, if the item is in the set then
 * the bit field will have a one at that position (lsb = index 0)
 */
const setToBitField = (set, array) =>
  array.reduce((acc, item, index) => {
    if (set.has(item)) {
      return acc | (1 << index);
    }
    return acc;
  }, 0);

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const findMaximumPressure = (
  { graph, keys, travelCosts },
  startNodeKey,
  totalTime,
  initialOpened = new Set()
) => {
  // object which will map a state to its maximum value.
  const memo = {};

  /**
   * Return a hash code representing the state defined by the arguments.
   */
  const hashCode = (currentNodeKey, pressure, time, nodeHash) =>
    `${currentNodeKey}_${pressure}_${time}_${nodeHash}`;

  // recursively find the max value in a top down manner
  const topDown = (currentNodeKey, time, pressure, opened) => {
    // return value if already memoized.
    const nodeHash = setToBitField(opened, keys);
    const stateHash = hashCode(currentNodeKey, pressure, time, nodeHash);
    if (stateHash in memo) {
      return memo[stateHash];
    }

    // recursively find the max value by visiting unopened nodes.
    const result = travelCosts[currentNodeKey].keys
      .filter((key) => !opened.has(key))
      .reduce(
        (max, targetKey) => {
          const newTime = time - travelCosts[currentNodeKey][targetKey] - 1;
          if (newTime >= 0) {
            const newPressure = graph[targetKey].flowRate * newTime + pressure;
            const newOpened = new Set([...opened, targetKey]);
            const newResult = topDown(targetKey, newTime, newPressure, newOpened);
            return newResult.value > max.value ? newResult : max;
          }
          return max;
        },
        { value: pressure, opened: nodeHash }
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
export const levelOne = ({ lines }) => {
  const graph = parseGraph(lines, 'AA');
  // console.log(graph.travelCosts);
  return findMaximumPressure(graph, 'AA', 30).value;
};

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
   * Creates a new set of keys using the bit field.
   * The set is populated with keys whose index matches each set bit (index 0 corresponds to the lsb).
   */
  const bitFieldToSet = (bitField, keys) =>
    toSet(keys.filter((_, index) => isBitSet(bitField, index)));

  /**
   * Inverts the bitfield and discards irrelevant bits using the mask.
   */
  const invertBitField = (bitField, inversionMask) => inversionMask & ~bitField;

  const filterPositiveFlowNodes = ({ graph, keys }) =>
    keys.filter((key) => graph[key].flowRate > 0);

  return ({ lines }) => {
    const graph = augmentGraph(parseLines(lines));
    const positiveFlowNodes = filterPositiveFlowNodes(graph);
    const visitCombinations = combinations(positiveFlowNodes.length);
    const myNodes = visitCombinations.map((bitField) =>
      bitFieldToSet(bitField, positiveFlowNodes)
    );
    const inversionMask = bitmask(positiveFlowNodes.length);
    const elephantNodes = visitCombinations.map((bitField) =>
      bitFieldToSet(invertBitField(bitField, inversionMask), positiveFlowNodes)
    );

    const results = [];
    for (let i = 0; i < myNodes.length; i++) {
      const mine = myNodes[i];
      const elephant = elephantNodes[i];
      const myPressure = findMaximumPressure(graph, 'AA', 26, elephant);
      const elephantPressure = findMaximumPressure(graph, 'AA', 26, mine);
      results[i] = myPressure + elephantPressure;
    }

    return Math.max(...results);
  };
})();
