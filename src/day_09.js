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

  const pad = (value) => ` ${value} `;

  const getBlankBoard = (rows, cols) =>
    array(rows).map(() => array(cols).map(() => pad('.')));

  const getLabels = ({ min, size }) => array(size).map((_, index) => `(${min + index})`);

  const addColumnLabels = (board, labels) => [...board, labels];

  const addRowLabels = (board, labels) =>
    board.map((row, index) => [labels[labels.length - 1 - index], ...row]);

  const addLabels = (board, xRange, yRange) => {
    let toReturn = [...board];
    toReturn = addColumnLabels(toReturn, getLabels(xRange));
    toReturn = addRowLabels(toReturn, getLabels(yRange));
    return toReturn;
  };

  const setPoint = (board, rowIndex, colIndex, value) => {
    const copy = [...board];
    copy[rowIndex][colIndex] = value;
    return copy;
  };

  const printBoard = (board) => {
    console.group('Board');
    board.map((row) => row.join(' ')).forEach((col) => console.log(col));
    console.groupEnd();
  };

  const getPointName = (index) => pad(index === 0 ? 'H' : `${index}`);

  return (points) => {
    const xRange = range(points.map(({ x }) => x));
    const yRange = range(points.map(({ y }) => y));
    let board = getBlankBoard(yRange.size, xRange.size);
    points.forEach(({ x, y }, index) => {
      const rowIndex = yRange.max - y;
      const colIndex = x - xRange.min;
      board = setPoint(board, rowIndex, colIndex, getPointName(index));
    });

    // board = addLabels(board, xRange, yRange);
    printBoard(board);
    console.log(board.reverse());
    // const yRange = range(points.map(({ y }) => y));
    // const xRange = range(points.map(({ x }) => x));
    // const ySteps = sizeOfRange(yRange);
    // const xSteps = sizeOfRange(xRange);

    // for (let yIndex = 0; yIndex < ySteps; yIndex++) {
    //   for (let xIndex = 0; xIndex < xSteps; xIndex++) {
    //     const x = xIndex + yRange.min;
    //     const y = yIndex + yRange.min;
    //     const point = points.find(p => p.x === x && )
    //     // map (xIndex, yIndex) => point in
    //   }
    // }
  };
})();

export const levelTwo = ({ lines }) => {
  console.log();
  const points = [
    new Vector2(5, 8),
    new Vector2(5, 7),
    new Vector2(5, 6),
    new Vector2(5, 5),
    new Vector2(5, 4),
    new Vector2(4, 4),
    new Vector2(3, 3),
    new Vector2(2, 2),
    new Vector2(1, 1),
    new Vector2(0, 0),
  ];

  print(points);
  return 1234;
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
