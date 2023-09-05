/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { arraysEqual, sum, updateAt, arrayToString } from './util/array.js';
import { writeToFile } from './util/io.js';
import { toNumber } from './util/string.js';

const blueprintToString = ({ id, costs }) =>
  `id: ${id}, costs: [${costs.map((cost) => arrayToString(cost)).join(', ')}]`;

/**
 * Parse a blueprint from each line of the input.
 */
const parseBlueprints = (lines) => {
  /**
   * Parse a blueprint from the input.
   */
  const parseLine = (line) => {
    const matches = line.match(/(\d+)/g).map(toNumber);
    return {
      id: matches[0],
      costs: [
        [matches[1], 0, 0, 0], // Ore
        [matches[2], 0, 0, 0], // Clay
        [matches[3], matches[4], 0, 0], // Obsidian
        [matches[5], 0, matches[6], 0], // Geode
      ],
    };
  };

  return lines.map(parseLine);
};

/**
 * Returns the element in the ore position.
 */
const ore = (items) => items[0];

/**
 * Returns the element in the clay position.
 */
const clay = (items) => items[1];

/**
 * Returns the element in the obsidian position.
 */
const obsidian = (items) => items[2];

/**
 * Returns the element in the geode position.
 */
const geode = (items) => items[3];

const resourcesToString = (arr) =>
  `o: ${ore(arr)}, c: ${clay(arr)}, ob: ${obsidian(arr)}, g: ${geode(arr)}`;

/**
 * Returns a new resource array containing the lhs resource array plus the rhs resource array.
 */
const add = (lhs, rhs) => lhs.map((x, index) => x + rhs[index]);

/**
 * Returns a new resource array containing the lhs resource array minus the rhs resource array.
 */
const subtract = (lhs, rhs) => lhs.map((x, index) => x - rhs[index]);

/**
 * Returns an array containing the resources gathered by the robots in a minute.
 */
const gather = (robots) => [...robots];

const buildRobot = (robots, index) =>
  robots.map((count, i) => (i === index ? count + 1 : count));

/**
 * Are there enough resources to build the robot?
 */
const canAffordRobot = (resources, buildCost) =>
  buildCost.every((cost, index) => cost <= resources[index]);

/**
 * Returns a new array representing the robots after adding a new robot.
 */
const buildNewRobot = (robots, typeIndex) =>
  updateAt(robots, typeIndex, robots[typeIndex] + 1);

/**
 * Compares the two resource arrays.
 * Returns > 0 if b is greater than a.
 * Returns < 0 if b is less than a.
 * Returns 0 if b is equal to a.
 */
const compareResources = (a, b) => {
  for (let i = 4; i--; ) {
    if (b[i] === a[i]) {
      continue;
    }
    return b[i] - a[i];
  }
  return 0;
};

const solve = (totalTime, startingRobots, startingResources, costs) => {
  const memo = {};

  const recurse = (time, robots, resources) => {
    // const hash = `${time}.${robots.join('.')}.${resources.join('.')}`;
    // const hash = `${time}.${robots.join('.')}`;
    // if (hash in memo) {
    //   return memo[hash];
    // }

    if (time <= 0) {
      // memo[hash] = resources;
      return resources;
    }
    const results = [recurse(time - 1, robots, add(robots, resources))];
    if (time > 1) {
      for (let i = 0; i < costs.length; i++) {
        const robotCost = costs[i];
        if (canAffordRobot(resources, robotCost)) {
          const newRobots = buildRobot(robots, i);
          const newResources = add(robots, subtract(resources, robotCost));
          results.push(recurse(time - 1, newRobots, newResources));
        }
      }
    }

    const result = results.sort(compareResources)[0];
    // memo[hash] = result;
    return result;
  };

  return recurse(totalTime, startingRobots, startingResources);
};

const scale = (array, value) => array.map((x) => x * value);

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const blueprints = parseBlueprints(lines);

  // const startingResources = [2, 0, 0, 0];
  // const startingRobots = [1, 0, 0, 0];
  // const cost = [2, 0, 0, 0];

  // const one = add(startingRobots, subtract(startingResources, cost));
  // console.log(one);

  const robots = [1, 0, 0, 0];
  const resources = [0, 0, 0, 0];
  const result = solve(24, robots, resources, blueprints[0].costs);
  console.log(JSON.stringify(result));
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
