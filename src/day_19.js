/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { updateAt } from './util/array.js';
import { writeToFile } from './util/io.js';
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
      [matches[1], 0, 0, 0], // Ore
      [matches[2], 0, 0, 0], // Clay
      [matches[3], matches[4], 0, 0], // Obsidian
      [matches[5], 0, matches[6], 0], // Geode
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

/**
 * Are there enough resources to build the robot?
 */
const canAffordRobot = (resources, buildCost) =>
  buildCost.every((resource, index) => resource <= resources[index]);

/**
 * Returns a new array representing the robots after adding a new robot.
 */
const buildNewRobot = (robots, typeIndex) =>
  updateAt(robots, typeIndex, robots[typeIndex] + 1);

/**
 * Returns a new array containing the changes which would occur if each affordable robot was built.
 */
const getAffordableBuildOptions = (resources, buildCosts) =>
  buildCosts.reduce((acc, buildCost, resourceIndex) => {
    if (canAffordRobot(resources, buildCost)) {
      acc.push({
        buildCost,
        robots: buildNewRobot([0, 0, 0, 0], resourceIndex),
      });
    }
    return acc;
  }, []);

/**
 * Returns an array containing the next state for each potential build choice which could be taken this minute.
 */
const getBuildOptions = (resources, robots, buildCosts) => {
  const gatheredThisTurn = add(resources, gather(robots));
  const buildOptions = getAffordableBuildOptions(resources, buildCosts);
  return [
    { resources: gatheredThisTurn, robots },
    ...buildOptions.map((x) => ({
      resources: subtract(gatheredThisTurn, x.buildCost),
      robots: add(robots, x.robots),
    })),
  ];
};

const createNode = (minute, resources, robots) => ({
  minute,
  resources,
  robots,
  children: [],
});

const test = (minute, endMinute, resources, robots, costs) => {
  if (minute === endMinute) {
    return createNode(minute, resources, robots);
  }
  const node = createNode(minute, resources, robots);
  node.children = [
    // build nothing
    test(minute + 1, endMinute, add(resources, robots), robots, costs),
    // build robots
    ...getAffordableBuildOptions(resources, costs).map((x) =>
      test(
        minute + 1,
        endMinute,
        add(subtract(resources, x.buildCost), robots),
        add(robots, x.robots),
        costs
      )
    ),
  ];
  return node;
};

const getLeafNodes = (tree) => {
  if (tree.children.length === 0) {
    return [tree];
  }

  return tree.children.flatMap(getLeafNodes);
};

const sortLeafNodes = (leafs) =>
  leafs.sort((a, b) => {
    if (geode(a.resources) > geode(b.resources)) {
      return -1;
    }
    if (geode(a.resources) < geode(b.resources)) {
      return 1;
    }

    // compare robots first
    for (let index = 3; index >= 0; index--) {
      if (a.robots[index] > b.robots[index]) {
        return -1;
      }
      if (a.robots[index] < b.robots[index]) {
        return 1;
      }
    }

    // compare resources next
    for (let index = 2; index >= 0; index--) {
      if (a.resources[index] > b.resources[index]) {
        return -1;
      }
      if (a.resources[index] < b.resources[index]) {
        return 1;
      }
    }

    return 0;
  });

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = async ({ input, lines }) => {
  console.log();
  const blueprint = parseLine(lines[0]);

  const tree = test(1, 13, [0, 0, 0, 0], [1, 0, 0, 0], blueprint.robots);
  await writeToFile(JSON.stringify(tree), './tree.json');
  const leaves = sortLeafNodes(getLeafNodes(tree));
  await writeToFile(JSON.stringify(leaves), './leaves.json');
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
