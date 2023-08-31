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
 * Performs a BFS from root node to all other nodes in the graph.
 * Returns an object which maps each node to the size of the shortest path for that node.
 */
const bfs = (graph, rootKey) => {
  const queue = [rootKey];
  const history = { [rootKey]: 0 };
  while (queue.length) {
    const current = queue.shift();
    graph[current].neighbors
      .filter((x) => !(x in history))
      .forEach((x) => {
        history[x] = history[current] + 1;
        queue.push(x);
      });
  }
  return history;
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
  const paths = Object.keys(graph).reduce(
    (acc, key) => ({ ...acc, [key]: bfs(graph, key) }),
    {}
  );
  console.log(paths);
  return 1234;
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
