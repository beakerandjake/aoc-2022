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
    return `<${this.x},${this.y}>`;
  }
}

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

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
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

export const levelTwo = ({ lines }) => {
  console.log();
  // const points = [
  //   new Vector2(5, 8),
  //   new Vector2(5, 7),
  //   new Vector2(5, 6),
  //   new Vector2(5, 5),
  //   new Vector2(5, 4),
  //   new Vector2(4, 4),
  //   new Vector2(3, 3),
  //   new Vector2(2, 2),
  //   new Vector2(1, 1),
  //   new Vector2(0, 0),
  // ];
  let head = new Vector2(0, 0);
  const points = [
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
  ];
  const visited = new Set([points[points.length - 1]]);

  lines.forEach((line) => {
    const { direction, steps } = parseLine(line);
    const headPlan = headMovementPlan(head, direction, steps);
    const p0 = tailMovementPlan(points[0], head, headPlan);
    const p1 = tailMovementPlan(points[1], points[0], p0);
    const p2 = tailMovementPlan(points[2], points[1], p1);
    const p3 = tailMovementPlan(points[3], points[2], p2);
    const p4 = tailMovementPlan(points[4], points[3], p3);
    const p5 = tailMovementPlan(points[5], points[4], p4);
    const p6 = tailMovementPlan(points[6], points[5], p5);
    const p7 = tailMovementPlan(points[7], points[6], p6);
    const p8 = tailMovementPlan(points[8], points[7], p7);

    head = headPlan[headPlan.length - 1];
    points[0] = p0[p0.length - 1];
    points[1] = p1[p1.length - 1];
    points[2] = p2[p2.length - 1];
    points[3] = p3[p3.length - 1];
    points[4] = p4[p4.length - 1];
    points[5] = p5[p5.length - 1];
    points[6] = p6[p6.length - 1];
    points[7] = p7[p7.length - 1];
    points[8] = p8[p8.length - 1];
    p8.forEach((x) => visited.add(x.toString()));

    print([head, ...points]);
  });

  return visited.size;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwoZ = ({ input, lines }) => {
  console.log();
  // your code here
  let head = new Vector2(0, 0);
  let tail = new Vector2(0, 0);
  const middle = [
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
    new Vector2(0, 0),
  ];
  const visited = new Set([tail.toString()]);

  const summary = (start, end, headPlan, tailPlan) => {
    const hPlanFormatted = headPlan.join(',');
    const tPlanFormatted = tailPlan.join(',');
    return `${start} - headPlan: [${hPlanFormatted}], tailPlan: [${tPlanFormatted}] -> ${end}`;
  };

  lines.forEach((line) => {
    console.group(`line: ${line}`);
    const { direction, steps } = parseLine(line);
    const headPlan = headMovementPlan(head, direction, steps);

    console.log(`head: ${summary(head, headPlan[headPlan.length - 1], headPlan, [])}`);

    let tempHead = head;
    let tempHeadPlan = headPlan;
    let tempTail;
    let tempTailPlan;

    console.group('middle');
    for (let index = 0; index < middle.length; index++) {
      tempTail = middle[index];
      tempTailPlan = tailMovementPlan(tempTail, tempHead, tempHeadPlan);
      console.log(
        `${index}: ${summary(
          tempTail,
          tempTailPlan[tempTailPlan.length - 1],
          tempHeadPlan,
          tempTailPlan
        )}`
      );

      middle[index] = tempTailPlan[tempTailPlan.length - 1];
      tempHead = tempTail;
      tempHeadPlan = tempTailPlan;
    }
    console.groupEnd();

    const tailPlan = tailMovementPlan(tail, tempHead, tempHeadPlan);
    console.log(
      `tail: ${summary(tail, tailPlan[tailPlan.length - 1], tempHeadPlan, tailPlan)}`
    );
    tailPlan.forEach((x) => visited.add(x.toString()));
    tail = tailPlan[tailPlan.length - 1];
    head = headPlan[headPlan.length - 1];

    console.groupEnd();
  });

  // console.log([...visited]);

  return visited.size;
};
