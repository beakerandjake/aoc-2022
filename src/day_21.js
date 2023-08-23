/**
 * Contains solutions for Day 21
 * Puzzle Description: https://adventofcode.com/2022/day/21
 */
import { add, multiply, subtract, divide } from './util/math.js';
import { toNumber } from './util/string.js';

class Node {
  constructor(key, value, lhs, rhs) {
    this.key = key;
    this.value = value;
    this.lhs = lhs;
    this.rhs = rhs;
  }
}

const operatorLookup = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

const nodeName = (line, start) => line.slice(start, start + 4);

const leafNode = (line) => ({
  value: toNumber(line.slice(6)),
  lhs: undefined,
  rhs: undefined,
});

const innerNode = (line) => ({
  value: line[11],
  lhs: nodeName(line, 6),
  rhs: nodeName(line, 13),
});

const nodeLookup = (lines) =>
  lines.reduce((acc, line) => {
    acc[nodeName(line, 0)] = line.length === 17 ? innerNode(line) : leafNode(line);
    return acc;
  }, {});

const expressionTree = (key, lookup) =>
  lookup[key]
    ? new Node(
        key,
        lookup[key].value,
        expressionTree(lookup[key].lhs, lookup),
        expressionTree(lookup[key].rhs, lookup)
      )
    : undefined;

const evaluate = (node) =>
  !node.lhs && !node.rhs
    ? node.value
    : operatorLookup[node.value](evaluate(node.lhs), evaluate(node.rhs));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  evaluate(expressionTree('root', nodeLookup(lines)));

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const getAncestors = (tree, key) => {
    const ancestors = new Set();
    const search = (node) => {
      if (!node) {
        return false;
      }
      if (node.key === key || search(node.lhs) || search(node.rhs)) {
        ancestors.add(node.key);
        return true;
      }
      return false;
    };
    search(tree);
    return ancestors;
  };

  const solveLhsLookup = {
    '+': (rhs, equals) => subtract(equals, rhs),
    '-': (rhs, equals) => add(equals, rhs),
    '*': (rhs, equals) => divide(equals, rhs),
    '/': (rhs, equals) => multiply(equals, rhs),
  };

  const solveRhsLookup = {
    '+': (lhs, equals) => subtract(equals, lhs),
    '-': (lhs, equals) => subtract(lhs, equals),
    '*': (lhs, equals) => divide(equals, lhs),
    '/': (lhs, equals) => divide(lhs, equals),
  };

  const solve = (tree, value, ancestors) => {
    const humanBranch = ancestors.has(tree.lhs.key) ? tree.lhs : tree.rhs;
    const newValue =
      humanBranch === tree.lhs
        ? solveLhsLookup[tree.value](evaluate(tree.rhs), value)
        : solveRhsLookup[tree.value](evaluate(tree.lhs), value);
    return humanBranch.key === 'humn'
      ? newValue
      : solve(humanBranch, newValue, ancestors);
  };

  return ({ lines }) => {
    const tree = expressionTree('root', nodeLookup(lines));
    const ancestors = getAncestors(tree, 'humn');
    const humanBranch = ancestors.has(tree.lhs.key) ? tree.lhs : tree.rhs;
    const targetBranch = humanBranch === tree.lhs ? tree.rhs : tree.lhs;
    const target = evaluate(targetBranch);
    return solve(humanBranch, target, ancestors);
  };
})();
