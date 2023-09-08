/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { toNumber } from './util/string.js';

/**
 * Total number of resource types available.
 */
const resourceTypes = 4;

/**
 * Maps resource type to its index in a robots/resource array.
 */
const indexes = {
  ore: 0,
  clay: 1,
  obsidian: 2,
  geodes: 3,
};

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
 * Returns the number of obsidian.
 */
const clay = (array) => array[indexes.clay];

/**
 * Returns the number of obsidian.
 */
const obsidian = (array) => array[indexes.obsidian];

/**
 * Returns the number of geodes.
 */
const geodes = (array) => array[indexes.geodes];

/**
 * Returns the sum of the items in the resources / robots array.
 */
const sum = (array) =>
  array[indexes.ore] +
  array[indexes.clay] +
  array[indexes.obsidian] +
  array[indexes.geodes];

/**
 * Returns a new array by adding each element of lhs to each corresponding element of rhs.
 */
const add = (lhs, rhs) => lhs.map((x, index) => x + rhs[index]);

/**
 * Returns a new array by subtracting each element of rhs from each corresponding element of lhs.
 */
const subtract = (lhs, rhs) => lhs.map((x, index) => x - rhs[index]);

/**
 * Returns a new array with the item of the corresponding resource type incremented by one.
 */
const increment = (array, type) => array.map((x, i) => (i === type ? x + 1 : x));

/**
 * Compares two resource or robot arrays
 * Returns > 0 if b is greater than a.
 * Returns < 0 if a is greater than b.
 * Returns 0 if a is equal to b.
 */
const compare = (lhs, rhs) => {
  // compare from most valuable resource (geode) to least (ore)
  for (let type = resourceTypes; type--; ) {
    const lhsValue = lhs[type];
    const rhsValue = rhs[type];

    if (lhsValue === rhsValue) {
      continue;
    }
    return rhsValue - lhsValue;
  }
  return 0;
};

/**
 * Creates a single prune branch function out of multiple prune branch functions.
 */
const buildBranchPruner = (prunerFunctions) => (current, best) =>
  prunerFunctions.some((fn) => fn(current, best));

/**
 * Prunes any branches which have less resources in the given state than the memoized best.
 */
const pruneIfWorse = () => {
  const memo = new Map();
  return ({ time, robots, resources }) => {
    const hash = `${time}.${robots.join('.')}`;
    if (!memo.has(hash)) {
      memo.set(hash, resources);
      return false;
    }
    const memoized = memo.get(hash);
    // update best if current resources are better than memoized.
    if (compare(memoized, resources) > 1) {
      memo.set(hash, resources);
      return false;
    }
    // prune branch if every resource is worse than best.
    return resources.every((resource, type) => memoized[type] >= resource);
  };
};

/**
 * Prunes any branches which cannot possibly beat the geode count of the current best.
 */
const pruneIfCantProduceEnoughGeodes = (current, best) => {
  if (!best || !geodes(best.resources)) {
    return false;
  }
  // optimistically assume this branch could build a new geode robot
  // every minute for the remaining time.
  let geodeRobots = geodes(current.robots);
  let estimated = geodes(current.resources);
  for (let i = current.time; i--; ) {
    estimated += geodeRobots;
    geodeRobots++;
  }
  return estimated <= geodes(best.resources);
};

/**
 * Prune if any other branch has already produced this *exact* same state.
 */
const pruneIfEncountered = () => {
  const memo = new Set();
  return ({ time, robots, resources }) => {
    const hash = `${time}.${robots.join('.')}.${resources.join('.')}`;
    if (!memo.has(hash)) {
      memo.add(hash);
      return false;
    }
    return true;
  };
};

/**
 * Prune any branch which has decided not to build robots quick enough.
 */
const pruneIfIdledTooLong = (totalTime) => {
  const buildSomethingCutoff = Math.floor(totalTime * 0.8);
  const clayCutoff = Math.floor(totalTime * 0.7);
  const obsidianCutoff = Math.floor(totalTime * 0.3);
  return ({ time, robots }) => {
    // prune if not built any robot by the cutoff time.
    if (time <= buildSomethingCutoff && time > clayCutoff) {
      return sum(robots) === 1;
    }
    // prune if not built a clay robot by the cutoff time.
    if (time <= clayCutoff && time > obsidianCutoff) {
      return clay(robots) === 0;
    }
    // prune if not built an obsidian robot by the cutoff time.
    if (time <= obsidianCutoff) {
      return obsidian(robots) === 0;
    }
    return false;
  };
};

/**
 * Returns the new state which result from building nothing this turn.
 */
const doNothing = ({ time, robots, resources }) => ({
  time: time - 1,
  robots,
  resources: add(resources, robots),
});

/**
 * Returns true if have enough resources to cover the build cost.
 */
const canAfford = ({ resources }, buildCost) =>
  resources.every((resource, type) => resource >= buildCost[type]);

/**
 * Returns true if currently have enough robots of this type to cover maximum required per turn.
 */
const robotIsMaxedOut = ({ robots }, { maxCosts }, type) =>
  robots[type] >= maxCosts[type];

/**
 * Returns true if has more of this resource stockpiled than can spend in the remaining time.
 */
const resourceIsMaxedOut = ({ resources, time }, { maxCosts }, type) =>
  resources[type] >= maxCosts[type] * time;

/**
 * Returns the new state which results from building the specified robot this turn.
 */
const buildRobot = ({ time, robots, resources }, buildCost, type) => ({
  time: time - 1,
  robots: increment(robots, type),
  resources: add(robots, subtract(resources, buildCost)),
});

/**
 * Returns an array containing robots that can be built this turn and the resulting next state respectively.
 */
const buildRobots = (state, blueprint) => {
  // if can afford a geode robot then don't worry about other robots just build geode.
  if (canAfford(state, geodes(blueprint.costs))) {
    return [buildRobot(state, geodes(blueprint.costs), indexes.geodes)];
  }

  const toReturn = [];
  for (let type = indexes.geodes; type--; ) {
    const buildCost = blueprint.costs[type];
    if (
      canAfford(state, buildCost) &&
      !robotIsMaxedOut(state, blueprint, type) &&
      !resourceIsMaxedOut(state, blueprint, type)
    ) {
      toReturn.push(buildRobot(state, buildCost, type));
    }
  }
  return toReturn;
};

/**
 * Returns the maximum number of geodes that can be built with the blueprint in the time limit.
 */
const maxGeodes = (blueprint, pruneBranchFn, totalTime) => {
  const queue = [{ time: totalTime, resources: [0, 0, 0, 0], robots: [1, 0, 0, 0] }];
  let best;
  while (queue.length) {
    // for now pop instead of shift because shift is o(n) instead of o(1) for pop.
    const current = queue.pop();

    // hit the end of this branch
    if (current.time === 0) {
      // check if hit a new best result.
      if (!best || compare(best.resources, current.resources) > 0) {
        best = current;
      }
      continue;
    }

    // kill this branch if a pruner fn decides it's not worth continuing.
    if (pruneBranchFn(current, best)) {
      continue;
    }

    queue.push(doNothing(current));
    // don't build robots on the last turn since it won't result in any new resources.
    if (current.time > 1) {
      queue.push(...buildRobots(current, blueprint));
    }
  }

  return best ? geodes(best.resources) : 0;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const blueprints = parseBlueprints(lines);
  const totalTime = 24;
  return blueprints.reduce((total, blueprint) => {
    const pruneFn = buildBranchPruner([
      pruneIfIdledTooLong(totalTime),
      pruneIfCantProduceEnoughGeodes,
      pruneIfEncountered(),
      pruneIfWorse(),
    ]);
    return total + blueprint.id * maxGeodes(blueprint, pruneFn, totalTime);
  }, 0);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ lines }) => {
  const blueprints = parseBlueprints(lines.slice(0, 3));
  const totalTime = 32;
  return blueprints.reduce((total, blueprint) => {
    const pruneFn = buildBranchPruner([
      pruneIfIdledTooLong(totalTime),
      pruneIfCantProduceEnoughGeodes,
      pruneIfEncountered(),
      pruneIfWorse(),
    ]);
    return total * maxGeodes(blueprint, pruneFn, totalTime);
  }, 1);
};
