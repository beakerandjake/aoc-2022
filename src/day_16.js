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
const parseGraph = (lines, startNodeKey) => {
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
  const parseLines = () =>
    lines
      .map((line) => parseLine(line))
      .reduce((acc, { name, ...nodeData }) => ({ ...acc, [name]: nodeData }), {});

  /**
   * Returns an object which maps each node to the length of the shortest path from that node to all other nodes.
   */
  const nodeDistances = (graph, rootKey) => {
    // use BFS to find the shortest path to other nodes.
    const queue = [rootKey];
    const history = { [rootKey]: 0 };
    while (queue.length) {
      const current = queue.shift();
      graph[current].neighbors
        .filter((key) => !(key in history))
        .forEach((key) => {
          history[key] = history[current] + 1;
          queue.push(key);
        });
    }
    // remove the root key from the returned object.
    const { [rootKey]: _, ...toReturn } = history;
    return toReturn;
  };

  /**
   * Returns map of a nodes key to the the distances to each node.
   */
  const getTravelCosts = (graph, keys) =>
    keys.reduce((acc, key) => ({ ...acc, [key]: nodeDistances(graph, key) }), {});

  /**
   * Filters out any nodes whose flow rate is zero.
   */
  const filterUnproductiveNodes = (graph, nodes) =>
    nodes.filter((node) => graph[node].flowRate > 0);

  /**
   * Returns a new travel costs object with only the specified nodes.
   */
  const compressTravelCosts = (travelCosts, nodesToKeep) =>
    nodesToKeep
      // edge case, skip self which wont exist in travel costs.
      .filter((neighbor) => neighbor in travelCosts)
      .map((neighbor) => ({
        key: neighbor,
        distance: travelCosts[neighbor],
      }));

  /**
   * Returns a new graph with only the specified nodes.
   */
  const compressGraph = (graph, travelCosts, nodesToKeep) =>
    nodesToKeep.reduce((acc, node) => {
      acc[node] = {
        ...graph[node],
        neighbors: compressTravelCosts(travelCosts[node], nodesToKeep),
      };
      return acc;
    }, {});

  /**
   * Returns a new graph with additional helper data added to specified nodes.
   */
  const augmentGraph = (graph, nodes) =>
    nodes.reduce(
      (acc, node, index) => ({ ...acc, [node]: { ...graph[node], bitmask: 1 << index } }),
      {}
    );

  const graph = parseLines();
  const allNodes = Object.keys(graph);
  const travelCosts = getTravelCosts(graph, allNodes);
  const productiveNodes = filterUnproductiveNodes(graph, allNodes);
  const compressed = compressGraph(graph, travelCosts, productiveNodes);
  const augmented = augmentGraph(compressed, productiveNodes);

  // handle edge case where start node is not a productive node.
  if (!(startNodeKey in augmented)) {
    // creates a 'directed' which allows you to leave start node but not 'return'.
    // this is because all nodes don't have start node as a neighbor.
    augmented[startNodeKey] = {
      neighbors: compressTravelCosts(travelCosts[startNodeKey], productiveNodes),
    };
  }

  return {
    nodes: augmented,
    keys: productiveNodes,
  };
};

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const maxPressure = (
  graph,
  startNode,
  totalTime,
  initialOpened = 0,
  shortCircuitFn = () => false
) => {
  const { graph: nodes, travelCosts, bitmaskLookup } = graph;

  const topDown = (currentNodeKey, time, pressure, opened) => {
    // quit this branch early if possible.
    if (shortCircuitFn(graph, currentNodeKey, time, pressure, opened)) {
      return { value: pressure, opened };
    }
    let max = { value: pressure, opened };
    const nodeTravelCosts = travelCosts[currentNodeKey];
    // recursively search each opened node and find the one which gives the max value.
    for (let i = nodeTravelCosts.keys.length; i--; ) {
      const key = nodeTravelCosts.keys[i];
      // skip node if already opened.
      if (opened & bitmaskLookup[key]) {
        continue;
      }
      // skip node if not enough time left to reach and open it.
      const newTime = time - nodeTravelCosts[key] - 1;
      if (newTime > 0) {
        const newPressure = nodes[key].flowRate * newTime + pressure;
        const newOpened = opened | bitmaskLookup[key];
        const result = topDown(key, newTime, newPressure, newOpened);
        if (result.value > max.value) {
          max = result;
        }
      }
    }
    return max;
  };
  return topDown(startNode, totalTime, 0, initialOpened);
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const z = parseGraph(lines, defaultStartNode);
  console.log(z);
  return 1234;
};
// maxPressure(parseGraph(lines, defaultStartNode), defaultStartNode, 30).value;

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  /**
   * Short circuit function for finding max value.
   * Assumes we could magically open every remaining unopened value.
   * If the total pressure released can't even beat the current best
   * then the branch is a dead end, short circuit it.
   */
  const quitIfCantBeatBest =
    (best) =>
    ({ keys, bitmaskLookup, graph }, _, time, pressure, opened) => {
      const closed = ~opened;
      const optimisticBest = keys
        .filter((key) => closed & bitmaskLookup[key])
        .reduce((total, key) => total + graph[key].flowRate * (time - 1), pressure);
      return optimisticBest < best;
    };

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
    const elephant = maxPressure(graph, defaultStartNode, 26, solo.opened);
    const shortCircuit = quitIfCantBeatBest(elephant.value);

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
        shortCircuit
      );
      if (elephantResult.value >= elephant.value) {
        betterElephantBranches.push({
          value: elephantResult.value,
          opened: invertBitField(openedByMe, inversionMask),
        });
      }
    }

    const values = [solo.value + elephant.value];
    for (let index = 0; index < betterElephantBranches.length; index++) {
      const openedByElephant = betterElephantBranches[index].opened;
      const soloResult = maxPressure(graph, defaultStartNode, 26, openedByElephant);
      values.push(soloResult.value + betterElephantBranches[index].value);
    }

    return Math.max(...values);
  };
})();
