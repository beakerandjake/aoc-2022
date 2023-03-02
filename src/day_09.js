/**
 * Contains solutions for Day 9
 * Puzzle Description: https://adventofcode.com/2022/day/9
 */

/**
 * Representation of 2d vectors and points.
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

const zero = new Vector2(0, 0);

const print = (() => {
  const range = (values) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max, size: Math.abs(max - min) + 1 };
  };

  const array = (size) => [...Array(size)];

  const getBlankBoard = (rows, cols) => array(rows).map(() => array(cols).map(() => '.'));

  const getPointName = (index) => (index === 0 ? 'H' : `${index}`);

  const setPoints = (board, xRange, yRange, points) => {
    const toReturn = [...board];
    points.forEach(({ x, y }, index) => {
      const rowIndex = yRange.max - y;
      const colIndex = x - xRange.min;
      toReturn[rowIndex][colIndex] = getPointName(index);
    });
    return toReturn;
  };

  const rowToString = (row) => row.join('');

  const printBoard = (board) => {
    console.group('Board State');
    const toPrint = board.map(rowToString);
    toPrint.forEach((row) => console.log(row));
    console.groupEnd();
  };

  return (points) => {
    const xRange = range(points.map(({ x }) => x));
    const yRange = range(points.map(({ y }) => y));
    let board = getBlankBoard(yRange.size, xRange.size);
    board = setPoints(board, xRange, yRange, points);
    printBoard(board);
  };
})();

const clone = (vector) => new Vector2(vector.x, vector.y);

/**
 * Parses a line of the input and returns the direction and number of steps
 * @param {String} line
 */
const parseLine = (() => {
  const directions = {
    U: new Vector2(0, 1),
    D: new Vector2(0, -1),
    L: new Vector2(-1, 0),
    R: new Vector2(1, 0),
  };

  return (line) => {
    const [direction, steps] = line.split(' ');
    return { direction: directions[direction], steps: +steps };
  };
})();

/**
 * Combine the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
const add = (lhs, rhs) => new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);

/**
 * Returns the *squared* distance between the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
const distanceSquared = (lhs, rhs) => (lhs.y - rhs.y) ** 2 + (lhs.x - rhs.x) ** 2;

/**
 * Are the two vectors touching (within one unit of each other)?
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
const touching = (lhs, rhs) => distanceSquared(lhs, rhs) <= 2;

/**
 * Determines each point the head must move to in order to reach the ending position.
 * @param {Vector2} start
 * @param {Vector2} direction
 * @param {Number} steps
 */
const headMovementPlan = (start, direction, steps) => {
  const positions = [];
  let current = start;
  while (positions.length < steps) {
    current = add(current, direction);
    positions.push(current);
  }
  return positions;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Determines each point the tail must move to in order to follow the head.
   * @param {Vector2} tail
   * @param {Vector2} head
   * @param {Vector2[]} headPlan
   */
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
 */
export const levelTwo = (() => {
  /**
   * Moves the source scalar one unit towards the destination.
   * @param {Number} from
   * @param {Number} to
   */
  const moveTowards = (from, to) => {
    if (to > from) {
      return from + 1;
    }
    if (to < from) {
      return from - 1;
    }

    return to;
  };

  /**
   * Determines each point the tail must move to in order to follow the head.
   * @param {Vector2} tail
   * @param {Vector2} head
   * @param {Vector2[]} headPlan
   */
  const tailMovementPlan = (tail, headPlan) => {
    let currentTail = tail;
    return headPlan.map((head) => {
      currentTail = touching(currentTail, head)
        ? currentTail
        : new Vector2(
            moveTowards(currentTail.x, head.x),
            moveTowards(currentTail.y, head.y)
          );
      return currentTail;
    });
  };

  return ({ lines = '' }) => {
    const rope = [zero, zero, zero, zero, zero, zero, zero, zero, zero, zero];
    const visited = new Set([zero.toString()]);
    let headPlan;
    let tail;
    let tailPlan;

    lines.forEach((line) => {
      const { direction, steps } = parseLine(line);
      headPlan = headMovementPlan(rope[0], direction, steps);
      rope[0] = headPlan[headPlan.length - 1];

      // move each knot in the rope towards its predecessor
      for (let index = 1; index < rope.length; index++) {
        tail = rope[index];
        tailPlan = tailMovementPlan(tail, headPlan);
        rope[index] = tailPlan[tailPlan.length - 1];
        headPlan = tailPlan;
      }

      // store each unique position the tail visited.
      tailPlan.forEach((x) => visited.add(x.toString()));
    });

    return visited.size;
  };
})();
