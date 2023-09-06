/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { arrayToString } from './util/array.js';
import { toNumber } from './util/string.js';

const blueprintToString = ({ id, costs }) =>
  `id: ${id}, costs: [${costs.map((cost) => arrayToString(cost)).join(', ')}]`;

/**
 * Parse the puzzle input and return an array of blueprints.
 */
const parseBlueprints = (lines) => {
  // parse data from a single line of input.
  const parseLine = (line) => {
    const matches = line.match(/(\d+)/g).map(toNumber);
    return {
      id: matches[0],
      costs: [
        [matches[1], 0, 0, 0], // ore
        [matches[2], 0, 0, 0], // clay
        [matches[3], matches[4], 0, 0], // obsidian
        [matches[5], 0, matches[6], 0], // geode
      ],
    };
  };

  // find the max cost of each resource type in the blueprint.
  const maxCosts = (costs) =>
    costs.map((_, index) => Math.max(...costs.map((cost) => cost[index])));

  // add additional information to the blueprint that will aid in solving the puzzle
  const augmentBlueprint = (blueprint) => ({
    ...blueprint,
    maxCosts: maxCosts(blueprint.costs),
  });

  return lines.map(parseLine).map(augmentBlueprint);
};

/**
 * Returns the number of geodes.
 */
const geodes = (items) => items[3];

/**
 * Returns a new array by adding each element of lhs to each corresponding element of rhs.
 */
const add = (lhs, rhs) => lhs.map((x, index) => x + rhs[index]);

/**
 * Returns a new array by subtracting each element of rhs from each corresponding element of lhs.
 */
const subtract = (lhs, rhs) => lhs.map((x, index) => x - rhs[index]);

/**
 * Returns a new array by multiplying each element of the array by the scalar value.
 */
const scale = (array, value) => array.map((x) => x * value);

const increment = (array, type) => array.map((x, i) => (i === type ? x + 1 : x));

const canAfford = (resources, buildCost) =>
  resources.every((resource, type) => resource >= buildCost[type]);

const doNothing = ({ time, robots, resources }) => ({
  time: time - 1,
  robots,
  resources: add(resources, robots),
});

const buildRobot = ({ time, robots, resources }, buildCost, type) => ({
  time: time - 1,
  robots: increment(robots, type),
  resources: add(robots, subtract(resources, buildCost)),
});

/**
 * Compares two resource or robot arrays
 * Returns > 0 if b is greater than a.
 * Returns < 0 if a is greater than b.
 * Returns 0 if a is equal to b.
 */
const compare = (lhs, rhs) => {
  // compare from most valuable resource (geode) to least (ore)
  for (let type = lhs.length; type--; ) {
    if (lhs[type] === rhs[type]) {
      continue;
    }
    return rhs[type] - lhs[type];
  }
  return 0;
};

const solve = (totalTime, startRobots, startResources, { costs }) => {
  const queue = [{ time: totalTime, resources: startResources, robots: startRobots }];
  let best;
  while (queue.length) {
    const current = queue.shift();

    // hit the end of this branch
    if (current.time === 0) {
      // check if hit a new best result.
      if (!best || compare(best.resources, current.resources) > 0) {
        best = current;
      }
      continue;
    }

    // always an option to do nothing.
    queue.push(doNothing(current));
    for (let type = 0; type < costs.length; type++) {
      const buildCost = costs[type];
      // can't build robot if can't afford it.
      if (canAfford(current.resources, buildCost)) {
        queue.push(buildRobot(current, buildCost, type));
      }
    }
  }

  return best;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  console.log();
  const blueprints = parseBlueprints(lines);
  const result = solve(24, [1, 0, 0, 0], [0, 0, 0, 0], blueprints[0]);
  console.log('result', result);
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
