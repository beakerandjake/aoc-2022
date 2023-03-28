import { popHead, append, number, add, multiply, firstCapture } from './util.js';

/**
 * Contains solutions for Day 11
 * Puzzle Description: https://adventofcode.com/2022/day/11
 */

/**
 * Parses the input and returns an array of monkeys.
 */
const parseLines = (() => {
  /**
   * Returns an array of the monkeys starting items
   */
  const parseStartingItems = (line) => line.slice(18).split(', ').map(number);

  /**
   * Returns a function which the monkey will use to inspect the item.
   */
  const parseInspectBehavior = (line) => {
    const [, op, rhsRaw] = line.match(/Operation: new = old ([+*]) (\d+|old)/);
    const fn = op === '+' ? add : multiply;
    const rhs = rhsRaw === 'old' ? null : number(rhsRaw);
    return { fn, rhs };
  };

  /**
   * Returns the numerator the monkey will use when deciding who to throw the item to.
   */
  const parseThrowNumerator = (line) =>
    number(firstCapture(line, / {2}Test: divisible by (\d+)/));

  /**
   * Returns the index of the monkey to throw the item to.
   */
  const parseThrowTarget = (line) =>
    number(firstCapture(line, / {4}If (?:true|false): throw to monkey (\d+)/));

  /**
   * Creates a monkey from parsing the input lines.
   */
  const parseMonkey = (lines) => ({
    startingItems: parseStartingItems(lines[0]),
    inspectBehavior: parseInspectBehavior(lines[1]),
    throwBehavior: {
      numerator: parseThrowNumerator(lines[2]),
      trueMonkey: parseThrowTarget(lines[3]),
      falseMonkey: parseThrowTarget(lines[4]),
    },
  });

  /**
   * Parse the input and create the monkeys.
   */
  return (lines) => {
    const toReturn = [];
    const monkeyLineCount = 5;
    for (let index = 1; index < lines.length; index += monkeyLineCount + 2) {
      toReturn.push(parseMonkey(lines.slice(index, index + monkeyLineCount)));
    }
    return toReturn;
  };
})();

/**
 * Returns a default state object.
 */
const getDefaultState = (monkeys) => ({
  items: monkeys.map((x) => x.startingItems),
  inspectCounts: monkeys.map(() => 0),
});

/**
 * Returns your new worry level as a result of the monkey inspecting the item.
 */
const monkeyInspectItem = ({ fn, rhs }, item) => fn(item, rhs === null ? item : rhs);

/**
 * Returns the index of the monkey to throw the item to.
 */
const monkeyChooseThrowTarget = ({ numerator, trueMonkey, falseMonkey }, worryLevel) =>
  worryLevel % numerator === 0 ? trueMonkey : falseMonkey;

/**
 * Returns a new items array resulting from a monkey throwing one item to another.
 */
const throwItemToMonkey = (items, sourceIndex, destIndex, worryLevel) => {
  const newItems = [...items];
  // remove item from source monkey.
  newItems[sourceIndex] = popHead(newItems[sourceIndex]);
  // add item to dest monkey.
  newItems[destIndex] = append(newItems[destIndex], worryLevel);
  return newItems;
};

/**
 * Returns a new items array resulting from a single monkey inspecting and throwing a single item to another monkey.
 */
const monkeyInspectAndThrowItem = (monkeys, items, monkeyIndex, item, reliefFn) => {
  const { inspectBehavior, throwBehavior } = monkeys[monkeyIndex];
  const newWorryLevel = reliefFn(monkeyInspectItem(inspectBehavior, item));
  const targetMonkeyIndex = monkeyChooseThrowTarget(throwBehavior, newWorryLevel);
  return throwItemToMonkey(items, monkeyIndex, targetMonkeyIndex, newWorryLevel);
};

/**
 * Returns a new items array resulting from a single monkey inspecting and throwing all of its items to other monkeys.
 */
const monkeyTurn = (monkeys, items, monkeyIndex, reliefFn) =>
  items[monkeyIndex].reduce(
    (currentItems, item) =>
      monkeyInspectAndThrowItem(monkeys, currentItems, monkeyIndex, item, reliefFn),
    items
  );

/**
 * Returns a new inspect counts array resulting from a single monkey inspecting and throwing all of its items to other monkeys.
 */
const updateInspectCounts = (inspectCounts, previousItems, monkeyIndex) => {
  const toReturn = [...inspectCounts];
  // this monkey inspected exactly as many items as it held in its hand before throwing.
  toReturn[monkeyIndex] += previousItems[monkeyIndex].length;
  return toReturn;
};

/**
 * Returns the new state resulting from a single round, that is all monkeys inspecting and throwing all of their items to other monkeys.
 */
const round = (monkeys, state, reliefFn) =>
  monkeys.reduce(
    ({ items, inspectCounts }, _, index) => ({
      items: monkeyTurn(monkeys, items, index, reliefFn),
      inspectCounts: updateInspectCounts(inspectCounts, items, index),
    }),
    state
  );

/**
 * Returns the new state resulting from x number of rounds.
 */
const rounds = (times, monkeys, state, reliefFn) =>
  [...Array(times)].reduce((prevState) => round(monkeys, prevState, reliefFn), state);

/**
 * Returns the level of monkey business resulting from the two most active monkeys.
 */
const calculateMonkeyBusiness = (inspectCounts) => {
  const sorted = [...inspectCounts].sort((a, b) => b - a);
  return sorted[0] * sorted[1];
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  const applyRelief = (worryLevel) => Math.floor(worryLevel / 3);

  return ({ lines }) => {
    const monkeys = parseLines(lines);
    const state = getDefaultState(monkeys);
    const result = rounds(20, monkeys, state, applyRelief);
    return calculateMonkeyBusiness(result.inspectCounts);
  };
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = (() => {
  /**
   * Calculates a common multiple of the given range of numbers.
   */
  const lcm = (numbers) => numbers.reduce((acc, x) => acc * x, 1);

  /**
   * To keep the worry level from overflowing the bounds of integers, apply a relief fn
   * that gives the same test results as the 'relief-free' version but stays within range.
   */
  const getReliefFn = (monkeys) => {
    const reliefLcm = lcm(monkeys.map((x) => x.throwBehavior.numerator));
    return (worryLevel) => worryLevel % reliefLcm;
  };

  return ({ lines }) => {
    const monkeys = parseLines(lines);
    const state = getDefaultState(monkeys);
    const newState = rounds(10000, monkeys, state, getReliefFn(monkeys));
    return calculateMonkeyBusiness(newState.inspectCounts);
  };
})();
