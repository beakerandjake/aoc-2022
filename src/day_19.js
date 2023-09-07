/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { arrayToString } from './util/array.js';
import { maxHeap } from './util/heap.js';
import { writeArrayToFile } from './util/io.js';
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

const canAfford = (resources, buildCost) =>
  resources.every((resource, type) => resource >= buildCost[type]);

const doNothing = ({ time, robots, resources }) => ({
  time: time - 1,
  robots,
  resources: add(resources, robots),
});

const buildRobot = (time, robots, resources, buildCost, type) => ({
  time: time - 1,
  robots: increment(robots, type),
  resources: add(robots, subtract(resources, buildCost)),
});

const robotIsMaxedOut = (robots, maxCosts, type) => {
  // never enough geode robots.
  if (type === 3) {
    return false;
  }
  return robots[type] >= maxCosts[type];
};

const buildRobots = ({ time, robots, resources }, { costs, maxCosts }) => {
  const toReturn = [];
  for (let type = 0; type < costs.length; type++) {
    const buildCost = costs[type];
    if (canAfford(resources, buildCost) && !robotIsMaxedOut(robots, maxCosts, type)) {
      toReturn.push(buildRobot(time, robots, resources, buildCost, type));
    }
  }
  return toReturn;
};

const pruneBasedOnFirstGeodeTime = () => {
  let earliest = null;
  return ({ time, resources }) => {
    const geodeCount = geodes(resources);

    if (earliest === null) {
      // this is the first geode we've seen, the current time is earliest.
      if (geodeCount === 1) {
        earliest = time;
      }
      return false;
    }

    // if past earliest time without geode then prune this branch.
    if (time <= earliest && geodeCount === 0) {
      return true;
    }

    // if before earliest time and have a geode, then update earliest time.
    if (time > earliest && geodeCount === 1) {
      earliest = time;
    }

    return false;
  };
};

const pruneBasedOnGeodeHistory = () => {
  const history = [];
  return ({ time, resources }) => {
    const count = geodes(resources);
    if (count === 0) {
      return false;
    }
    const currentRecord = history[time];

    if (!currentRecord) {
      history[time] = count;
      return false;
    }

    if (count < currentRecord) {
      return true;
    }

    if (count > currentRecord) {
      history[time] = count;
    }

    return false;
  };
};

const priority = ({ time, resources, robots }) => {
  const potential = add(resources, scale(robots, time));
  return potential.reduce((total, amount, index) => 1000 ** index * amount + total, 0);
};

const solve = (totalTime, startRobots, startResources, blueprint, pruners) => {
  const queue = [{ time: totalTime, resources: startResources, robots: startRobots }];
  let best;
  let iterations = 0;
  const results = [];
  while (queue.length) {
    // use a priority queue
    // for now pop instead of shift because shift is o(n) instead of o(1) for pop.
    const current = queue.pop();

    // hit the end of this branch
    if (current.time === 0) {
      // check if hit a new best result.
      if (!best || compare(best.resources, current.resources) > 0) {
        best = current;
      }
      results.push(current);
      continue;
    }

    // kill this branch if a pruner fn decides it's not worth continuing.
    if (pruners.some((fn) => fn(current))) {
      continue;
    }

    iterations++;
    queue.push(doNothing(current));
    // don't build robots on the last turn since it won't result in any new resources.
    if (current.time > 1) {
      const z = buildRobots(current, blueprint);
      iterations += z.length;
      queue.push(...z);
    }
  }

  console.log(iterations);

  return { best, results };
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = async ({ lines }) => {
  // console.log();
  const blueprints = parseBlueprints(lines);
  const pruners = [pruneBasedOnFirstGeodeTime(), pruneBasedOnGeodeHistory()];
  const { best, results } = solve(24, [1, 0, 0, 0], [0, 0, 0, 0], blueprints[0], pruners);
  console.log('result', best);

  // await writeArrayToFile(
  //   results.map((x) => JSON.stringify(x)),
  //   './results.json'
  // );
  // console.log(blueprints);

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
