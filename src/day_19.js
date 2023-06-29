/**
 * Contains solutions for Day 19
 * Puzzle Description: https://adventofcode.com/2022/day/19
 */
import { arraysEqual, sum, updateAt } from './util/array.js';
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

/**
 * Returns the minimum amount of resources necessary to build each robot.
 */
const minCost = (costs) =>
  costs.reduce((acc, x, index) => {
    acc.push(index <= 1 ? x : add(acc[index - 1], x));
    return acc;
  }, []);

const getDesiredRobot = (robots) => {
  for (let index = 0; index < robots.length; index++) {
    if (robots[index] === 0) {
      return index;
    }
  }

  return robots.length - 1;
};

const getBuildChoices = (resources, robots, costs) => [
  { resources: add(resources, robots), robots },
  ...getAffordableBuildOptions(resources, costs).map((choice) => ({
    resources: add(subtract(resources, choice.buildCost), robots),
    robots: add(robots, choice.robots),
  })),
];

const minuteByMinute = (() => {
  const indexOfSmallest = (array) => {
    if (array.length === 0) {
      return -1;
    }
    let smallestIndex = 0;
    let smallest = array[smallestIndex];

    for (let index = 1; index < array.length; index++) {
      if (array[index] < smallest) {
        smallestIndex = index;
        smallest = array[index];
      }
    }

    return smallestIndex;
  };

  const turnsToBuildRobot = ({ resources, robots }, desiredRobotCost) =>
    Math.max(
      ...resources.map((resource, index) => {
        const cost = desiredRobotCost[index];
        if (resource > cost || cost === 0) {
          return 1;
        }
        return Math.ceil((cost - resource) / robots[index]) + 1;
      })
    );

  const bestBuildChoice = (
    currentState,
    buildChoices,
    desiredRobotType,
    desiredRobotCost,
    minutesRemaining
  ) => {
    if (buildChoices.length === 1) {
      return buildChoices[0];
    }

    // see if any choices build the desired robot.

    const choiceThatBuildsRobot = buildChoices.findIndex(
      (choice) => choice.robots[desiredRobotType] > currentState.robots[desiredRobotType]
    );

    if (choiceThatBuildsRobot !== -1) {
      return buildChoices[choiceThatBuildsRobot];
    }

    let bestChoiceIndex = 0;
    let bestTurnsToBuildRobot = turnsToBuildRobot(
      buildChoices[bestChoiceIndex],
      desiredRobotCost
    );
    let bestRobotCount = sum(buildChoices[bestChoiceIndex].robots);

    for (let index = 1; index < buildChoices.length; index++) {
      const turns = turnsToBuildRobot(buildChoices[index], desiredRobotCost);
      const numRobots = sum(buildChoices[index].robots);
      if (
        turns < bestTurnsToBuildRobot ||
        (turns === bestTurnsToBuildRobot && numRobots > bestRobotCount)
      ) {
        bestChoiceIndex = index;
        bestTurnsToBuildRobot = turns;
        bestRobotCount = numRobots;
      }
    }

    return buildChoices[bestChoiceIndex];
  };

  const sortChoices = (choices) =>
    [...choices].sort((a, b) => {
      if (geode(a.resources) > geode(b.resources)) {
        return -1;
      }
      if (geode(a.resources) < geode(b.resources)) {
        return 1;
      }

      if (geode(a.robots) > geode(b.robots)) {
        return -1;
      }
      if (geode(a.robots) < geode(b.robots)) {
        return 1;
      }

      for (let index = 0; index < 4; index++) {
        if (a.robots[index] > b.robots[index]) {
          return -1;
        }
        if (a.robots[index] < b.robots[index]) {
          return 1;
        }
      }

      return 0;
    });

  const turnsNeeded = (resourceCount, robotCount, targetResources, minutesRemaining) => {
    if (resourceCount >= targetResources) {
      return 1;
    }
    const needed = targetResources - resourceCount;
    if (needed < robotCount) {
      return 1;
    }

    return Math.ceil(needed / robotCount);
  };

  return (minutes, costs) => {
    const minCosts = minCost(costs);
    let currentMinute = 0;
    let resources = [0, 0, 0, 0];
    let robots = [1, 0, 0, 0];

    while (currentMinute !== minutes) {
      console.group(`minute ${currentMinute + 1}:`);
      console.log(`start resources: ${resourcesToString(resources)}`);
      console.log(`start robots   : ${resourcesToString(robots)}`);

      const desiredRobot = getDesiredRobot(robots);
      console.log(`most desired robot: ${desiredRobot}`);
      console.log(`most desired robot total cost: ${minCosts[desiredRobot]}`);
      console.log(`most desired robot actual cost: ${costs[desiredRobot]}`);

      const buildOptions = getBuildChoices(resources, robots, costs);

      console.group('build options:');
      console.log(buildOptions);
      console.groupEnd();

      const choice = bestBuildChoice(
        { resources, robots },
        buildOptions,
        desiredRobot,
        minCosts[desiredRobot],
        24 - currentMinute
      );

      console.log(`new robots    : ${resourcesToString(choice.robots)}`);
      console.log(`new resources : ${resourcesToString(choice.resources)}`);

      resources = choice.resources;
      robots = choice.robots;

      console.groupEnd();
      currentMinute += 1;
    }
  };
})();

const treeBased = (() => {
  // const getLeaves = (depth, resources, robots, costs, leaves = []) => {
  //   if (depth === 0) {
  //     return [...leaves, { resources, robots }];
  //   }

  //   const buildNothing = getLeaves(
  //     depth - 1,
  //     add(resources, robots),
  //     robots,
  //     costs,
  //     leaves
  //   );

  //   const buildRobots = getAffordableBuildOptions(resources, costs).flatMap((x) =>
  //     getLeaves(
  //       depth - 1,
  //       add(subtract(resources, x.buildCost), robots),
  //       add(robots, x.robots),
  //       costs,
  //       leaves
  //     )
  //   );

  //   return [...leaves, ...buildNothing, ...buildRobots];
  // };

  const smartSortLeaves = (leaves) =>
    [...leaves].sort((a, b) => {
      // more geodes always wins.

      if (geode(a.resources) > geode(b.resources)) {
        return -1;
      }
      if (geode(a.resources) < geode(b.resources)) {
        return 1;
      }

      // more geode robots better.

      if (geode(a.robots) > geode(b.robots)) {
        return -1;
      }
      if (geode(a.robots) < geode(b.robots)) {
        return 1;
      }

      // compare non geode robots.

      for (let index = 2; index >= 0; index--) {
        if (a.robots[index] > b.robots[index]) {
          return -1;
        }
        if (a.robots[index] < b.robots[index]) {
          return 1;
        }
      }

      // compare non geode resources

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

  const sortLeavesByResources = (leaves) =>
    [...leaves].sort((a, b) => {
      for (let i = 3; i >= 0; i--) {
        if (a.resources[i] > b.resources[i]) {
          return -1;
        }
        if (a.resources[i] < b.resources[i]) {
          return 1;
        }
      }
      return 0;
    });

  const sortLeavesByRobots = (leaves, minutes) =>
    [...leaves].sort((a, b) => {
      for (let i = 3; i >= 0; i--) {
        if (a.robots[i] > b.robots[i]) {
          return -1;
        }
        if (a.robots[i] < b.robots[i]) {
          return 1;
        }
      }
      return 0;
    });

  const sortByRobotAndResources = (leaves) =>
    [...leaves].sort((a, b) => {
      for (let i = 3; i >= 0; i--) {
        if (a.robots[i] > b.robots[i]) {
          return -1;
        }
        if (a.robots[i] < b.robots[i]) {
          return 1;
        }
        if (a.resources[i] > b.resources[i]) {
          return -1;
        }
        if (a.resources[i] < b.resources[i]) {
          return 1;
        }
      }
      return 0;
    });

  const sortByFuture = (leaves, minutes) =>
    [...leaves].sort((a, b) => {
      const aFuture = add(
        a.resources,
        a.robots.map((x) => x * minutes)
      );
      const bFuture = add(
        b.resources,
        b.robots.map((x) => x * minutes)
      );
      if (aFuture > bFuture) {
        return -1;
      }
      if (aFuture < bFuture) {
        return 1;
      }
      return 0;
    });

  const sortLeaves = smartSortLeaves;

  const configureSimulator = (costs) => {
    const simulate = (minutes, resources, robots) => {
      const node = {
        resources,
        robots,
        children: [],
      };

      if (minutes === 0) {
        return node;
      }

      node.children = [
        // build nothing
        simulate(minutes - 1, add(resources, robots), robots),
        // build robots
        ...getAffordableBuildOptions(resources, costs).map((option) =>
          simulate(
            minutes - 1,
            add(subtract(resources, option.buildCost), robots),
            add(robots, option.robots)
          )
        ),
      ];

      return node;
    };

    return simulate;
  };

  const compareResources = (lhs, rhs) => {
    for (let index = 3; index >= 0; index--) {
      if (lhs[index] > rhs[index]) {
        return -1;
      }
      if (lhs[index] < rhs[index]) {
        return 1;
      }
    }
    return 0;
  };

  const filterMostPromisingChoices = (choices) => {
    let mostRobots = [1, 0, 0, 0];
    for (let index = 0; index < choices.length; index++) {
      if (compareResources(choices[index].robots, mostRobots) < 0) {
        mostRobots = choices[index].robots;
      }
    }

    return choices.filter((choice) => arraysEqual(choice.robots, mostRobots));
  };

  const getPossibleOutcomes = (tree) => {
    if (tree.children.length === 0) {
      return [tree];
    }
    return tree.children.flatMap(getPossibleOutcomes);
  };

  const solve = async (costs) => {
    const simulator = configureSimulator(costs);
    const resources = [0, 0, 0, 0];
    const robots = [1, 0, 0, 0];

    const startChoices = getPossibleOutcomes(simulator(6, resources, robots));
    // await writeToFile(JSON.stringify(startChoices), './scratch/choices.json');

    const mostPromising = filterMostPromisingChoices(startChoices);
    // await writeToFile(JSON.stringify(mostPromising), './scratch/promising.json');

    // 6-12
    const a = mostPromising.flatMap((choice) =>
      filterMostPromisingChoices(
        getPossibleOutcomes(simulator(6, choice.resources, choice.robots))
      )
    );
    // await writeToFile(JSON.stringify(a), './scratch/a.json');

    // 12-18
    const b = a.flatMap((choice) =>
      filterMostPromisingChoices(
        getPossibleOutcomes(simulator(6, choice.resources, choice.robots))
      )
    );
    // await writeToFile(JSON.stringify(b), './scratch/b.json');

    // 18-24
    const c = b.flatMap((choice) =>
      filterMostPromisingChoices(
        getPossibleOutcomes(simulator(6, choice.resources, choice.robots))
      )
    );
    // await writeToFile(JSON.stringify(c), './scratch/c.json');

    return geode(sortLeavesByResources(c)[0].resources);

    // // 18 - 24
    // const d = c.flatMap((choice) =>
    //   filterMostPromisingChoices(
    //     getPossibleOutcomes(simulator(6, choice.resources, choice.robots))
    //   )
    // );
    // await writeToFile(JSON.stringify(d), './scratch/d.json');

    // const a = sortLeaves(getPossibleOutcomes(simulator(6, resources, robots)))[0];
    // console.log('1-6', a);
    // const b = sortLeaves(getPossibleOutcomes(simulator(6, a.resources, a.robots)))[0];
    // console.log('6-12', b);
    // const c = sortLeaves(getPossibleOutcomes(simulator(6, b.resources, b.robots)))[0];
    // console.log('12-18', c);
    // const d = sortLeaves(getPossibleOutcomes(simulator(6, c.resources, c.robots)))[0];
    // console.log('18-24', d);

    // const tree2 = simulator(6, [2, 4, 0, 0], [1, 2, 0, 0]);
    // await writeToFile(JSON.stringify(tree2), './scratch/tree2.json');
    // const leaves2 = sortLeaves(getPossibleOutcomes(tree2));
    // await writeToFile(JSON.stringify(leaves2), './scratch/leaves2.json');

    // const a = getLeaves(4, [0, 0, 0, 0], [1, 0, 0, 0], costs);
    // await writeToFile(JSON.stringify(a), `./leaves_1-4.json`);

    // const b = getLeaves(1, [1, 0, 0, 0], [2, 0, 0, 0], costs);
    // await writeToFile(JSON.stringify(b), `./leaves_4-5.json`);
  };

  // const decisionTree = (minutes, resources, robots, costs) => {
  //   if (minutes === 0) {
  //     return createNode(minutes, resources, robots);
  //   }
  //   const node = createNode(minutes, resources, robots);
  //   node.children = [
  //     // build nothing
  //     decisionTree(minutes - 1, add(resources, robots), robots, costs),
  //     // build robots
  //     ...getAffordableBuildOptions(resources, costs).map((x) =>
  //       decisionTree(
  //         minutes - 1,
  //         add(subtract(resources, x.buildCost), robots),
  //         add(robots, x.robots),
  //         costs
  //       )
  //     ),
  //   ];
  //   return node;
  // };

  // const getLeafNodes = (tree) => {
  //   if (tree.children.length === 0) {
  //     return [tree];
  //   }

  //   return tree.children.flatMap(getLeafNodes);
  // };

  // const sortLeafNodes = (leafs) => {
  //   const toReturn = [...leafs];
  //   toReturn.sort((a, b) => {
  //     if (geode(a.resources) > geode(b.resources)) {
  //       return -1;
  //     }
  //     if (geode(a.resources) < geode(b.resources)) {
  //       return 1;
  //     }

  //     // if (geode(a.robots) > geode(b.robots)) {
  //     //   return -1;
  //     // }
  //     // if (geode(a.robots) < geode(b.robots)) {
  //     //   return 1;
  //     // }`

  //     // compare robots first
  //     for (let index = 3; index >= 0; index--) {
  //       if (a.robots[index] > b.robots[index]) {
  //         return -1;
  //       }
  //       if (a.robots[index] < b.robots[index]) {
  //         return 1;
  //       }
  //     }

  //     // compare resources next
  //     for (let index = 2; index >= 0; index--) {
  //       if (a.resources[index] > b.resources[index]) {
  //         return -1;
  //       }
  //       if (a.resources[index] < b.resources[index]) {
  //         return 1;
  //       }
  //     }

  //     return 0;
  //   });
  //   return toReturn;
  // };

  // const bestPaths = (leafs) => {
  //   const sorted = sortLeafNodes(leafs);
  // };

  return async (minutes, costs) => solve(costs);
})();

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = async ({ input, lines }) => {
  const blueprint = parseLine(lines[0]);
  const result = await treeBased(24, blueprint.robots);
  return result;
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
