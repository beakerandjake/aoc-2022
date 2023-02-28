/**
 * Contains solutions for Day 9
 * Puzzle Description: https://adventofcode.com/2022/day/9
 */

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x} ${this.y}`;
  }
}

const add = (lhs, rhs) => new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);

const distanceSquared = (lhs, rhs) => (lhs.y - rhs.y) ** 2 + (lhs.x - rhs.x) ** 2;

const touching = (head, tail) => distanceSquared(head, tail) <= 2;

const directions = {
  U: new Vector2(0, 1),
  D: new Vector2(0, -1),
  L: new Vector2(-1, 0),
  R: new Vector2(1, 0),
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  const parseLine = (line) => {
    const [direction, steps] = line.split(' ');
    return { direction: directions[direction], steps: +steps };
  };

  const headMovementPlan = (start, direction, steps) => {
    const positions = [];
    let current = start;
    while (positions.length < steps) {
      current = add(current, direction);
      positions.push(current);
    }
    return positions;
  };

  const tailMovementPlan = (tail, head, headPlan) => {
    let previousHead = head;
    return headPlan.map((newHead) => {
      const newTail = touching(tail, newHead) ? tail : previousHead;
      previousHead = newHead;
      return newTail;
    });
  };

  return ({ lines }) => {
    let head = new Vector2(0, 0);
    let tail = new Vector2(0, 0);
    const visited = new Set([tail.toString()]);

    lines.forEach((line) => {
      const { direction, steps } = parseLine(line);
      const headPlan = headMovementPlan(head, direction, steps);
      const tailPlan = tailMovementPlan(tail, head, headPlan);
      tailPlan.forEach((x) => visited.add(x.toString()));
      head = headPlan[headPlan.length - 1];
      tail = tailPlan[tailPlan.length - 1];
    });

    return visited.size;
  };
})();

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
