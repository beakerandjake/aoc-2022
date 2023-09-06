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

/**
 * Returns a new resource array containing the lhs resource array plus the rhs resource array.
 */
const add = (lhs, rhs) => lhs.map((x, index) => x + rhs[index]);

/**
 * Returns a new resource array containing the lhs resource array minus the rhs resource array.
 */
const subtract = (lhs, rhs) => lhs.map((x, index) => x - rhs[index]);

const scale = (array, value) => array.map((x) => x * value);

/**
 * Returns an array containing the resources gathered by the robots in a minute.
 */
const gather = (robots) => [...robots];

const addNewRobot = (robots, index) =>
  robots.map((count, i) => (i === index ? count + 1 : count));

/**
 * Are there enough resources to build the robot?
 */
const canAffordRobot = (resources, buildCost) =>
  buildCost.every((cost, index) => cost <= resources[index]);

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

const minsUntilCanAfford = ({ time, robots, resources }, costs) => {
  // not worth building if no time for new robot to collect any resources.
  if (time <= 1) {
    return -1;
  }
  let toReturn = 0;
  for (let i = costs.length; i--; ) {
    // can never afford if don't have the robot to make this resource
    if (costs[i] > 0 && robots[i] === 0) {
      return -1;
    }
    if (costs[i] > resources[i]) {
      const mins = Math.ceil((costs[i] - resources[i]) / robots[i]);
      if (mins > toReturn) {
        toReturn = mins;
      }
    }
  }
  return toReturn;
};

const doNothing = ({ time, robots, resources }) => ({
  time: time - 1,
  robots,
  resources: add(robots, resources),
});

const buildRobot = ({ time, robots, resources }, cost, robotIndex) => ({
  time: time - 1,
  resources: add(robots, subtract(resources, cost)),
  robots: addNewRobot(robots, robotIndex),
});

const estimate = ({ time, robots, resources }) => add(scale(robots, time), resources);

const skipRobotBuild = (robots, robotCost, robotIndex) =>
  robotIndex !== 3 && robotCost.every((cost, index) => robots[index] >= cost);

const solve = (totalTime, startRobots, startResources, costs) => {
  const queue = [
    {
      time: totalTime,
      robots: startRobots,
      resources: startResources,
    },
  ];
  let iter = 0;
  let earliestGeode = Number.MIN_SAFE_INTEGER;
  let earliestEstimate = [0, 0, 0, 0];
  let killed = 0;
  let skipped = 0;
  // console.log('floor', floor);
  const results = [
    { time: 0, resources: scale(startRobots, totalTime), robots: startRobots },
  ];
  while (queue.length) {
    // if (iter++ > 200_000_000) {
    //   console.log('kill', queue.length, results.length, killed, earliestGeode, skipped);
    //   console.log(
    //     'maxim',
    //     results
    //       .map((x) => {
    //         if (!x || !x.resources) {
    //           console.log('wtf');
    //           return 0;
    //         }
    //         return geode(x.resources);
    //       })
    //       .sort((a, b) => b - a)[0]
    //   );
    //   break;
    // }

    // todo, sort queue or use heap
    const current = queue.pop();

    // if hit first geode with less time than best, kill the branch.
    if (geode(current.resources) === 1) {
      if (current.time < earliestGeode) {
        killed++;
        continue;
      }
      // getting first geode with more time remaining is always better.
      earliestGeode = current.time;
      earliestEstimate = estimate(current);
      // console.log('better', earliestGeode, 'estimate', earliestEstimate);
    }

    // kill if current geode count doesn't even beat the earliest geode count.
    if (
      geode(estimate(current)) > 1 &&
      geode(estimate(current)) < geode(earliestEstimate)
    ) {
      killed++;
      continue;
    }

    if (current.time <= 0) {
      if (geode(current.resources) > 0) {
        results.push(current);
      }
      continue;
    }

    if (current.time === 1) {
      if (geode(current.resources) > 0) {
        results.push(current);
      }
      continue;
    }

    // always add do nothing.
    queue.push(doNothing(current));

    // build each affordable robot.
    for (let i = 0; i < costs.length; i++) {
      const robotCost = costs[i];

      if (skipRobotBuild(current.robots, robotCost, i)) {
        skipped++;
        continue;
      }

      const minsUntilBuild = minsUntilCanAfford(current, robotCost);
      if (minsUntilBuild >= 0) {
        const newTime = current.time - minsUntilBuild - 1;
        if (newTime > 0) {
          const newResources = subtract(
            add(current.resources, scale(current.robots, minsUntilBuild + 1)),
            robotCost
          );
          const newRobots = addNewRobot(current.robots, i);
          queue.push({
            time: newTime,
            robots: newRobots,
            resources: newResources,
          });
        }
      }
    }
  }

  console.log('hit the end', skipped, killed, results.length);
  return results.sort((a, b) => compareResources(a.resources, b.resources))[0];
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  console.log();
  const blueprints = parseBlueprints(lines);

  // const robots = [1, 0, 0, 0];
  // const resources = [0, 0, 0, 0];
  // const cost = [19, 0, 0, 0];
  // const time = 24;
  // const mins = minsUntilCanAfford({ time, robots, resources }, cost);
  // console.log(`mins until can afford: ${mins}`);
  // if (mins !== -1) {
  //   const newTime = time - mins - 1;
  //   const newResources = subtract(add(resources, scale(robots, mins + 1)), cost);
  //   const newRobots = addNewRobot(robots, 0);
  //   console.log(`new time: ${time - newTime + 1}`);
  //   console.log(`new resources: ${newResources}`);
  //   console.log(`new robots: ${newRobots}`);
  // }

  const robots = [1, 0, 0, 0];
  const resources = [1, 0, 0, 0];
  const result = solve(24, robots, resources, blueprints[0].costs);
  console.log('result', result);

  // const estimateTest = [
  //   { time: 4, robots: [1, 2, 1, 1], resources: [12, 20, 2, 1] },
  //   { time: 6, robots: [1, 4, 2, 1], resources: [2, 17, 3, 0] },
  // ];

  // console.log('estimates', estimateTest.map(estimate));

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
