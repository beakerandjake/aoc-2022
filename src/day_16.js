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
   * Filters out any nodes whose flow rate is zero.
   */
  const filterUnproductiveNodes = (graph, nodes) =>
    nodes.filter((node) => graph[node].flowRate > 0);

  /**
   * Remove costs for any nodes which are not included in the nodes list.
   */
  const compressTravelCosts = (costs, nodes) => {
    const compress = (object) => {
      const picked = pick(object, nodes);
      return { ...picked, keys: Object.keys(picked) };
    };

    return nodes.reduce(
      (acc, key) => ({
        ...acc,
        [key]: compress(costs[key], nodes),
      }),
      // ensure start node is always present.
      { [startNodeKey]: compress(costs[startNodeKey], nodes) }
    );
  };

  /**
   * Maps a node key to a mask which can be to represent that node in a bitmask.
   */
  const createBitmaskLookup = (nodes) =>
    nodes.reduce((acc, key, index) => ({ ...acc, [key]: 1 << index }), {});

  const graph = parseLines();
  const allNodes = Object.keys(graph);
  const travelCosts = getTravelCosts(graph, allNodes);
  const productiveNodes = filterUnproductiveNodes(graph, allNodes);

  return {
    graph,
    keys: productiveNodes,
    travelCosts: compressTravelCosts(travelCosts, productiveNodes),
    bitmaskLookup: createBitmaskLookup(productiveNodes),
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
