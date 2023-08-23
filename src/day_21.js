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

  // map of functions to solve for LHS of equation: lhs OP rhs = value
  const solveLhsLookup = {
    '+': (rhs, value) => subtract(value, rhs),
    '-': (rhs, value) => add(value, rhs),
    '*': (rhs, value) => divide(value, rhs),
    '/': (rhs, value) => multiply(value, rhs),
  };

  // map of functions to solve for RHS of equation: lhs OP rhs = value
  const solveRhsLookup = {
    '+': (lhs, value) => subtract(value, lhs),
    '-': (lhs, value) => subtract(lhs, value),
    '*': (lhs, value) => divide(value, lhs),
    '/': (lhs, value) => divide(lhs, value),
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
    return solve(humanBranch, evaluate(targetBranch), ancestors);
  };
})();
