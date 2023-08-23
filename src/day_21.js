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

const operatorKeys = {
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
  value: operatorKeys[line[11]],
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
    : node.value(evaluate(node.lhs), evaluate(node.rhs));

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) =>
  evaluate(expressionTree('root', nodeLookup(lines)));

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = (() => {
  const find = (key, tree) => {
    if (!tree) {
      return undefined;
    }
    if (tree.key === key) {
      return tree;
    }
    return find(key, tree.lhs) || find(key, tree.rhs);
  };

  const inverseOperator = (operator) => {
    if (operator === add) {
      return subtract;
    }
    if (operator === subtract) {
      return add;
    }
    if (operator === multiply) {
      return divide;
    }
    if (operator === divide) {
      return multiply;
    }
    throw new Error(`unknown operator: ${operator}`);
  };

  const solve = (tree, value) => {
    const op = inverseOperator(tree.value);
    const humanBranch = find('humn', tree.lhs) ? tree.lhs : tree.rhs;
    const nonHumanBranch = humanBranch === tree.lhs ? tree.rhs : tree.lhs;
    const newValue = op(value, evaluate(nonHumanBranch));
    return humanBranch.key === 'humn' ? newValue : solve(humanBranch, newValue);
  };

  return ({ lines }) => {
    const tree = expressionTree('root', nodeLookup(lines));
    const humanBranch = find('humn', tree.lhs) ? tree.lhs : tree.rhs;
    const targetBranch = humanBranch === tree.lhs ? tree.rhs : tree.lhs;
    const target = evaluate(targetBranch);
    const human = evaluate(humanBranch);
    console.log();
    console.log('target:', target);
    console.log('human:', human);
    return solve(humanBranch, target);
  };
})();
