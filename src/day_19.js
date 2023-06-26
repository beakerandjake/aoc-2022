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

const buildDecisionTree = (timeRemaining, resources, robots, buildCosts) => {
  const newNode = { timeRemaining, resources, robots, children: [] };

  if (timeRemaining === 0) {
    return newNode;
  }

  const newTime = timeRemaining - 1;
  const newResources = add(resources, gather(robots));
  const buildNothingOption = buildDecisionTree(newTime, newResources, robots, buildCosts);
  const buildRobotOptions = getAffordableBuildOptions(resources, buildCosts).map((x) =>
    buildDecisionTree(
      newTime,
      subtract(newResources, x.buildCost),
      add(robots, x.robots),
      buildCosts
    )
  );
  newNode.children = [buildNothingOption, ...buildRobotOptions];

  return newNode;
};

const getLeafNodes = (tree) => {
  if (tree.children.length === 0) {
    return [tree];
  }

  return tree.children.flatMap(getLeafNodes);
};

const sortLeafNodes = (leafs) =>
  leafs.sort((a, b) => {
    const aGeode = geode(a.resources);
    const aGeodeRobot = geode(a.robots);
    const bGeode = geode(b.resources);
    const bGeodeRobot = geode(b.robots);

    if (aGeode > bGeode) {
      return -1;
    }
    if (aGeode < bGeode) {
      return 1;
    }

    if (aGeodeRobot > bGeodeRobot) {
      return -1;
    }

    if (aGeodeRobot < bGeodeRobot) {
      return 1;
    }

    for (let index = 2; index >= 0; index--) {
      const aResource = a.resources[index];
      const aRobot = a.robots[index];
      const bResource = b.resources[index];
      const bRobot = b.robots[index];

      if (aRobot > bRobot) {
        return -1;
      }

      if (aRobot < bRobot) {
        return 1;
      }

      if (aResource > bResource) {
        return -1;
      }

      if (aResource < bResource) {
        return 1;
      }
    }

    return 0;
  });

const maxGeodes = (collectionTime, buildCosts, chunkSize = 3) => {
  let minutesRemaining = collectionTime;
  let resources = [0, 0, 0, 0];
  let robots = [1, 0, 0, 0];

  while (minutesRemaining > 0) {
    console.log(`simulate: ${minutesRemaining}`);
    const decisionTree = buildDecisionTree(chunkSize, resources, robots, buildCosts);
    const bestDecision = sortLeafNodes(getLeafNodes(decisionTree))[0];
    resources = bestDecision.resources;
    robots = bestDecision.robots;
    minutesRemaining -= chunkSize;
  }

  return { resources, robots };
};

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
  // const result = maxGeodes(24, blueprint.robots);
  // console.log(`resources: ${resourcesToString(result.resources)}`);
  // console.log(`robots   : ${resourcesToString(result.robots)}`);

  // const minutesLookahead = 3;
  // let time = 0;
  // let resources = [0, 0, 0, 0];
  // let robots = [1, 0, 0, 0];
  // while (time < 24) {
  //   const tree = buildDecisionTree(minutesLookahead, resources, robots, blueprint.robots);
  //   const best = sortLeafNodes(getLeafNodes(tree))[0];
  //   resources = best.resources;
  //   robots = best.robots;
  //   time += minutesLookahead;
  // }

  // console.log(`resources: ${resourcesToString(resources)}`);
  // console.log(`robots   : ${resourcesToString(robots)}`);

  const tree = buildDecisionTree(6, [1,7,1,0], [1,4,1,0], blueprint.robots);
  const best = sortLeafNodes(getLeafNodes(tree))[0];
  // await writeToFile(JSON.stringify(tree), './tree.json');
  await writeToFile(JSON.stringify(best), './leaves.json');

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
