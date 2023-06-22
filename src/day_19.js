/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { toNumber } from './util/string.js';

/**
 * Regex to capture all numbers in a string.
 */
const digitRegex = /(\d+)/g;

/**
 * Parse a blueprint from the input.
 */
const parseLine = (line) => {
  const matches = line.match(digitRegex).map(toNumber);
  return {
    id: matches[0],
    robots: [
      [matches[1], 0, 0], // Ore
      [matches[2], 0, 0], // Clay
      [matches[3], matches[4], 0], // Obsidian
      [matches[5], 0, matches[6]], // Geode
    ],
  };
};

/**
 * Parse a blueprint from each line of the input.
 */
const parseLines = (lines) => lines.map(parseLine);

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

const getTotalResources = (minutes, resources, robots) =>
  resources.map((x, idx) => x + robots[idx] * minutes);

/**
 * Are there enough resources to build the robot?
 */
const canBuildRobot = (resources, robotBlueprint) =>
  robotBlueprint.every((cost, index) => cost <= resources[index]);

/**
 * Return the remaining resources after building the robot.
 */
const buildRobot = (resources, blueprint) => {
  const toReturn = [...resources];
  blueprint.forEach((cost, resourceIndex) => {
    toReturn[resourceIndex] -= cost;
  });
  return toReturn;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  console.log();
  const blueprint = parseLine(lines[0]);
  const minutes = 24;
  const resources = [4, 14, 16, 0];
  const robots = [1, 0, 0, 0];

  // at a given step, have x choices of what to do next, do nothing always an option.
  // one option for each robot you can build at that point in time.

  blueprint.robots.forEach((spec, idx) => {
    console.log(`can build blueprint[${idx}] = ${canBuildRobot(resources, spec)}`);
  });

  console.log('starting resources', resourcesToString(resources));
  console.log('blueprint:        ', resourcesToString(blueprint.robots));
  const resourcesAfterBuildRobot = buildRobot(resources, geode(blueprint.robots));
  console.log('resources after   ', resourcesToString(resourcesAfterBuildRobot));

  // const finalResources = getTotalResources(minutes, resources, robots);
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
