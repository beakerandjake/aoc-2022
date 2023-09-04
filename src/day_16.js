/**
 * Contains solutions for Day 16
 * Puzzle Description: https://adventofcode.com/2022/day/16
 */
import { toNumber } from './util/string.js';
import { bitmask } from './util/bitwise.js';
import { range } from './util/array.js';

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
      .filter((edge) => edge in travelCosts)
      .map((edge) => ({
        key: edge,
        cost: travelCosts[edge],
      }));

  /**
   * Returns a new graph with only the specified nodes.
   */
  const compressGraph = (graph, travelCosts, nodesToKeep) =>
    nodesToKeep.reduce((acc, node) => {
      acc[node] = {
        ...graph[node],
        edges: compressTravelCosts(travelCosts[node], nodesToKeep),
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
    // this is because all nodes don't have start node as an edge.
    augmented[startNodeKey] = {
      edges: compressTravelCosts(travelCosts[startNodeKey], productiveNodes),
    };
  }

  return {
    nodes: augmented,
    nodeCount: productiveNodes.length,
  };
};

/**
 * Returns the maximum pressure that can be released in the given time starting from the start node.
 */
const maxPressure = (
  graph,
  startNodeKey,
  totalTime,
  initialOpened = 0,
  shortCircuitFn = null
) => {
  const topDown = (node, time, pressure, opened) => {
    // quit this branch early if possible.
    if (shortCircuitFn && shortCircuitFn(graph, node, time, pressure, opened)) {
      return { value: pressure, opened };
    }
    let max = { value: pressure, opened };
    // recursively search each opened node and find the one which gives the max value.
    for (let i = node.edges.length; i--; ) {
      const edge = node.edges[i];
      const targetNode = graph.nodes[edge.key];
      // only consider node if not already opened.
      if (!(opened & targetNode.bitmask)) {
        const newTime = time - edge.cost - 1;
        // only consider node if enough time left to reach and open it.
        if (newTime > 0) {
          const newPressure = targetNode.flowRate * newTime + pressure;
          const newOpened = opened | targetNode.bitmask;
          const result = topDown(targetNode, newTime, newPressure, newOpened);
          if (result.value > max.value) {
            max = result;
          }
        }
      }
    }
    return max;
  };
  return topDown(graph.nodes[startNodeKey], totalTime, 0, initialOpened);
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  maxPressure(parseGraph(lines, defaultStartNode), defaultStartNode, 30).value;

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
    ({ nodes }, node, time, pressure, opened) => {
      const closed = ~opened;
      const optimisticBest = node.edges
        .filter(({ key }) => closed & nodes[key].bitmask)
        .reduce((total, { key }) => total + nodes[key].flowRate * (time - 1), pressure);
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

  /**
   * Simulate all possible combinations of the elephant opening valves
   * Return only those which result in a pressure greater than the target result.
   */
  const getBestElephantResults = (graph, bestPressure) => {
    const shortCircuit = quitIfCantBeatBest(bestPressure);
    const inversionMask = bitmask(graph.nodeCount);
    const toReturn = [];
    const openedByMe = combinations(graph.nodeCount);
    for (let index = 0; index < openedByMe.length; index++) {
      const opened = openedByMe[index];
      const result = maxPressure(graph, defaultStartNode, 26, opened, shortCircuit);
      if (result.value >= bestPressure) {
        toReturn.push({
          value: result.value,
          opened: invertBitField(opened, inversionMask) & result.opened,
        });
      }
    }
    return toReturn;
  };

  /**
   * Returns the max pressure which can be achieved working with the elephant.
   */
  const findBestCombination = (graph, elephantResults, bestPressure) => {
    const values = [bestPressure];
    for (let index = 0; index < elephantResults.length; index++) {
      const openedByElephant = elephantResults[index].opened;
      const soloResult = maxPressure(graph, defaultStartNode, 26, openedByElephant);
      values.push(soloResult.value + elephantResults[index].value);
    }
    return Math.max(...values);
  };

  return ({ lines }) => {
    const graph = parseGraph(lines, defaultStartNode);
    const solo = maxPressure(graph, defaultStartNode, 26);
    const elephant = maxPressure(graph, defaultStartNode, 26, solo.opened);
    const potentialResults = getBestElephantResults(graph, elephant.value);
    return findBestCombination(graph, potentialResults, solo.value + elephant.value);
  };
})();
