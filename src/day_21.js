/**
 * Contains solutions for Day 21
 * Puzzle Description: https://adventofcode.com/2022/day/21
 */
import { add, multiply, subtract, divide } from './util/math.js';
import { toNumber } from './util/string.js';

/**
 * A binary tree node.
 */
class Node {
  constructor(key, value, lhs, rhs) {
    this.key = key;
    this.value = value;
    this.lhs = lhs;
    this.rhs = rhs;
  }
}

/**
 * Maps an operator key to the function which can perform the operation.
 */
const operatorLookup = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

/**
 * Parse the input line corresponding to a leaf node of a tree.
 */
const parseLeafNode = (line) => ({
  value: toNumber(line.slice(6)),
  lhs: undefined,
  rhs: undefined,
});

/**
 * Parse the input line corresponding to an inner node of a tree.
 */
const parseInnerNode = (line) => ({
  value: line[11],
  lhs: line.slice(6, 10),
  rhs: line.slice(13, 17),
});

/**
 * Parses the input and returns a lookup table mapping node key to node data.
 */
const nodeLookup = (lines) =>
  lines.reduce((acc, line) => {
    acc[line.slice(0, 4)] =
      line.length === 17 ? parseInnerNode(line) : parseLeafNode(line);
    return acc;
  }, {});

/**
 * Returns an expression tree built from the node lookup.
 * The root node of the tree will be the node in the lookup matching the key.
 */
const expressionTree = (key, lookup) => {
  const data = lookup[key];
  if (!data) {
    return undefined;
  }
  return new Node(
    key,
    data.value,
    expressionTree(data.lhs, lookup),
    expressionTree(data.rhs, lookup)
  );
};

/**
 * Evaluates the expression tree formed by the node.
 */
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
  /**
   * Returns all ancestor nodes of the node with the given key.
   */
  const getAncestors = (tree, key) => {
    const ancestors = new Set();
    const search = (node) => {
      if (node && (node.key === key || search(node.lhs) || search(node.rhs))) {
        ancestors.add(node.key);
        return true;
      }
      return false;
    };
    search(tree);
    return ancestors;
  };

  /**
   * Maps an operation key to the function which will solve for LHS of equation: lhs OP rhs = value
   */
  const solveForLhsLookup = {
    '+': (rhs, value) => subtract(value, rhs),
    '-': (rhs, value) => add(value, rhs),
    '*': (rhs, value) => divide(value, rhs),
    '/': (rhs, value) => multiply(value, rhs),
  };

  /**
   * Maps an operation key to the function which will solve for RHS of equation: lhs OP rhs = value
   */
  const solveForRhsLookup = {
    '+': (lhs, value) => subtract(value, lhs),
    '-': (lhs, value) => subtract(lhs, value),
    '*': (lhs, value) => divide(value, lhs),
    '/': (lhs, value) => divide(lhs, value),
  };

  /**
   * Examines the nodes children and determines which child is the ancestor of a target node.
   * Returns an array with ancestor branch at index zero, and non ancestor branch at index one.
   */
  const sortChildrenByIsAncestor = (node, ancestors) =>
    ancestors.has(node.lhs.key) ? [node.lhs, node.rhs] : [node.rhs, node.lhs];

  /**
   * Returns the value the node must have in order for the tree to evaluate to the target value.
   */
  const solve = (tree, nodeKey, nodeAncestors, targetValue) => {
    const [unknownBranch, knownBranch] = sortChildrenByIsAncestor(tree, nodeAncestors);
    const newValue =
      unknownBranch === tree.lhs
        ? solveForLhsLookup[tree.value](evaluate(knownBranch), targetValue)
        : solveForRhsLookup[tree.value](evaluate(knownBranch), targetValue);
    return unknownBranch.key === nodeKey
      ? newValue
      : solve(unknownBranch, nodeKey, nodeAncestors, newValue);
  };

  return ({ lines }) => {
    const tree = expressionTree('root', nodeLookup(lines));
    const ancestors = getAncestors(tree, 'humn');
    const [humanBranch, nonHumanBranch] = sortChildrenByIsAncestor(tree, ancestors);
    return solve(humanBranch, 'humn', ancestors, evaluate(nonHumanBranch));
  };
})();
