import { popHead, append } from './util.js';

/**
 * Contains solutions for Day 11
 * Puzzle Description: https://adventofcode.com/2022/day/11
 */

/**
 * Parses the input and returns an array of monkeys.
 */
const parseLines = (() => {
  const parseStartingItems = (line) =>
    line
      .slice(18)
      .split(', ')
      .map((x) => +x);

  const parseInspectBehavior = (() => {
    const regex = /Operation: new = old ([+*]) (\d+|old)/;
    const add = (lhs, rhs) => lhs + rhs;
    const multiply = (lhs, rhs) => lhs * rhs;
    return (line) => {
      const [, op, rhsRaw] = line.match(regex);
      const fn = op === '+' ? add : multiply;
      const rhs = rhsRaw === 'old' ? null : +rhsRaw;
      return { fn, rhs };
    };
  })();

  const parseNumberFromFirstMatch = (line, regex) => +line.match(regex)[1];

  const parseThrowTestNumerator = (line) =>
    parseNumberFromFirstMatch(line, / {2}Test: divisible by (\d+)/);

  const parseThrowDestination = (line) =>
    parseNumberFromFirstMatch(line, / {4}If (?:true|false): throw to monkey (\d+)/);

  const parseMonkey = (lines) => ({
    startingItems: parseStartingItems(lines[0]),
    inspectBehavior: parseInspectBehavior(lines[1]),
    throwBehavior: {
      numerator: parseThrowTestNumerator(lines[2]),
      trueMonkey: parseThrowDestination(lines[3]),
      falseMonkey: parseThrowDestination(lines[4]),
    },
  });

  return (lines) => {
    const toReturn = [];
    const monkeyLineCount = 5;
    for (let index = 1; index < lines.length; index += monkeyLineCount + 2) {
      toReturn.push(parseMonkey(lines.slice(index, index + monkeyLineCount)));
    }
    return toReturn;
  };
})();

const monkeyInspectItem = ({ fn, rhs }, item) => fn(item, rhs === null ? item : rhs);

const monkeyChooseThrowTarget = (throwBehavior, worryLevel) =>
  worryLevel % throwBehavior.numerator === 0
    ? throwBehavior.trueMonkey
    : throwBehavior.falseMonkey;

const throwItemToMonkey = (items, sourceIndex, destIndex, worryLevel) => {
  const newItems = [...items];
  newItems[sourceIndex] = popHead(newItems[sourceIndex]);
  newItems[destIndex] = append(newItems[destIndex], worryLevel);
  return newItems;
};

const monkeyInspectAndThrowItem = (monkeys, items, monkeyIndex, item, reliefFn) => {
  const { inspectBehavior, throwBehavior } = monkeys[monkeyIndex];
  const newWorryLevel = reliefFn(monkeyInspectItem(inspectBehavior, item));
  const targetMonkeyIndex = monkeyChooseThrowTarget(throwBehavior, newWorryLevel);
  return throwItemToMonkey(items, monkeyIndex, targetMonkeyIndex, newWorryLevel);
};

const monkeyTurn = (monkeys, items, monkeyIndex, reliefFn) =>
  items[monkeyIndex].reduce(
    (currentItems, item) =>
      monkeyInspectAndThrowItem(monkeys, currentItems, monkeyIndex, item, reliefFn),
    items
  );

const countItemsInspected = (oldItems, newItems, monkeyIndex) =>
  oldItems[monkeyIndex].length - newItems[monkeyIndex].length;

const updateInspectCounts = (inspectCounts, previousItems, currentItems, monkeyIndex) => {
  const toReturn = [...inspectCounts];
  toReturn[monkeyIndex] += countItemsInspected(previousItems, currentItems, monkeyIndex);
  return toReturn;
};

const round = (monkeys, items, inspectCounts, reliefFn) =>
  monkeys.reduce(
    (prevState, _, index) => {
      const newItems = monkeyTurn(monkeys, prevState.items, index, reliefFn);
      const newInspectCounts = updateInspectCounts(
        prevState.inspectCounts,
        prevState.items,
        newItems,
        index
      );
      return { items: newItems, inspectCounts: newInspectCounts };
    },
    { items, inspectCounts }
  );

const rounds = (times, monkeys, items, inspectCounts, reliefFn) =>
  [...Array(times)].reduce(
    (prevState) => round(monkeys, prevState.items, prevState.inspectCounts, reliefFn),
    {
      items,
      inspectCounts,
    }
  );

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
    const items = monkeys.map((x) => x.startingItems);
    const inspectCounts = monkeys.map(() => 0);
    const result = rounds(20, monkeys, items, inspectCounts, applyRelief);
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
  const lcm = (numbers) => numbers.reduce((acc, x) => acc * x, 1);

  const getReliefFn = (monkeys) => {
    const reliefLcm = lcm(monkeys.map((x) => x.throwBehavior.numerator));
    return (worryLevel) => worryLevel % reliefLcm;
  };

  return ({ lines }) => {
    const monkeys = parseLines(lines);
    const items = monkeys.map((x) => x.startingItems);
    const inspectCounts = monkeys.map(() => 0);
    const result = rounds(10000, monkeys, items, inspectCounts, getReliefFn(monkeys));
    return calculateMonkeyBusiness(result.inspectCounts);
  };
})();
