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

const parseNodeName = (line, start) => line.slice(start, start + 4);

const parseLeafNode = (line) => ({
  value: toNumber(line.slice(6)),
});

const parseOperator = (operator) => {
  if (operator === '+') {
    return add;
  }
  if (operator === '-') {
    return subtract;
  }
  if (operator === '*') {
    return multiply;
  }
  if (operator === '/') {
    return divide;
  }
  throw new Error(`unknown operator: ${operator}`);
};

const parseInnerNode = (line) => ({
  value: parseOperator(line[11]),
  lhs: parseNodeName(line, 6),
  rhs: parseNodeName(line, 13),
});

const parseLines = (lines) =>
  lines.reduce((acc, line) => {
    acc[parseNodeName(line, 0)] =
      line.length === 17 ? parseInnerNode(line) : parseLeafNode(line);
    return acc;
  }, {});

const buildExpressionTree = (nodeKey, nodeLookup) => {
  const nodeData = nodeLookup[nodeKey];

  if (!nodeData) {
    return undefined;
  }

  return new Node(
    nodeKey,
    nodeData.value,
    buildExpressionTree(nodeData.lhs, nodeLookup),
    buildExpressionTree(nodeData.rhs, nodeLookup)
  );
};

const evaluate = (node) => {
  if (!node.lhs && !node.rhs) {
    return node.value;
  }

  return node.value(evaluate(node.lhs), evaluate(node.rhs));
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const nodeLookup = parseLines(lines);
  const expressionTree = buildExpressionTree('root', nodeLookup);
  return evaluate(expressionTree);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
