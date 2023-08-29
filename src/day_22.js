/**
 * Contains solutions for Day 22
 * Puzzle Description: https://adventofcode.com/2022/day/22
 */
import { convertTo2dArray, index2d, elementAt2d } from './util/array2d.js';
import { array2dToString } from './util/debug.js';
import { Vector2, left, right, down, up, add, equals, one } from './util/vector2.js';
import { toNumber } from './util/string.js';
import { repeat } from './util/functions.js';
import { mod, inRangeInclusive } from './util/math.js';

/**
 * The directions that you can face.
 * Order of items in array allows 90 degree rotation by incrementing or decrementing the index.
 */
const directions = [
  { value: right, display: '>' },
  { value: down, display: 'v' },
  { value: left, display: '<' },
  { value: up, display: '^' },
];

/**
 * Helper lookup which maps a direction name to its index in the direction array.
 */
const directionIndexes = {
  right: 0,
  down: 1,
  left: 2,
  up: 3,
};

/**
 * Print the map and move history to the console.
 */
const render = ({ data, shape }, history) => {
  const mapCopy = [...data];
  history.forEach(({ position, facing }) => {
    mapCopy[index2d(shape.width, position.y, position.x)] = directions[facing].display;
  });
  console.log(array2dToString(mapCopy, shape));
};

/**
 * Parse the puzzle input and return the world map and monkey path.
 */
const parseInput = (() => {
  /**
   * Finds the item in the array with the max length.
   */
  const findMaxWidth = (rows) => Math.max(...rows.map((row) => row.length));

  /**
   * Returns a new array that is padded to the target width with the pad item.
   * Arrays which are longer than or equal to the target width are not modified.
   */
  const pad = (array, width, padItem) =>
    array.length >= width
      ? array
      : [...array, ...Array(width - array.length).fill(padItem)];

  /**
   * Returns a 2d array representing the map.
   */
  const parseMap = (lines) => {
    const maxWidth = findMaxWidth(lines);
    const padded = lines.map((line) => pad([...line], maxWidth, ' '));
    return convertTo2dArray(padded);
  };

  /**
   * Parse the monkeys notes and returns the path to take.
   */
  const parseNotes = (line) =>
    line
      .match(/\d+|\w/g)
      .map((match) => (match === 'L' || match === 'R' ? match : toNumber(match)));

  return (lines) => {
    const { items, shape } = parseMap(lines.slice(0, -2));
    return {
      map: {
        data: items,
        shape,
      },
      path: parseNotes(lines[lines.length - 1]),
    };
  };
})();

/**
 * Returns the index of the starting tile.
 */
const findStartX = (map) =>
  // this works only because there is a guaranteed open tile in the first row.
  map.indexOf('.');

/**
 * Returns the new facing direction after rotating in the direction (clockwise or counterclockwise).
 */
const rotate = (facing, direction) =>
  mod(direction === 'R' ? facing + 1 : facing - 1, directions.length);

/**
 * Is the tile an impassible wall?
 */
const isWall = (tile) => tile === '#';

/**
 * Returns the tile at the given position.
 */
const getTile = (map, { x, y }) => elementAt2d(map.data, map.shape, y, x);

/**
 * Calculates the final password based on the position and facing.
 */
const finalPassword = ({ position, facing }) => {
  const { x, y } = add(position, one);
  return 1000 * y + 4 * x + facing;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Is the tile an empty void?
   */
  const isVoid = (tile) => tile === ' ';

  /**
   * Searches for the first non void tile and returns the position.
   * Search starts from (x,y) and increments each step by (xStep, yStep)
   */
  const findFirstTile = (startX, startY, xStep, yStep, map) => {
    const position = new Vector2(startX, startY);
    for (;;) {
      if (isVoid(getTile(map, position))) {
        position.x += xStep;
        position.y += yStep;
        continue;
      }
      return position;
    }
  };

  /**
   * Wraps the x value around the row based on the facing direction.
   * If facing right assumes wrapping around the right edge.
   * If facing left assumes wrapping around the left edge.
   * Returns first non void tile from the wrapped side.
   */
  const wrapX = (y, facing, map) =>
    facing === directionIndexes.right
      ? findFirstTile(0, y, 1, 0, map)
      : findFirstTile(map.shape.width - 1, y, -1, 0, map);

  /**
   * Wraps the y value around the column based on the facing direction.
   * If facing down assumes wrapping around the bottom edge.
   * If facing up assumes wrapping around the top edge.
   * Returns first non void tile from the wrapped side.
   */
  const wrapY = (x, facing, map) =>
    facing === directionIndexes.up
      ? findFirstTile(x, map.shape.height - 1, 0, -1, map)
      : findFirstTile(x, 0, 0, 1, map);

  /**
   * Wraps the position around the edge of the map based on the current facing direction.
   * Returns first non void tile from the wrapped side.
   */
  const wrapAround = ({ x, y }, facing, map) =>
    facing === directionIndexes.left || facing === directionIndexes.right
      ? wrapX(y, facing, map)
      : wrapY(x, facing, map);

  /**
   * Is the position outside of the map bounds?
   */
  const outOfBounds = ({ x, y }, { shape: { width, height } }) =>
    x < 0 || x >= width || y < 0 || y >= height;

  /**
   * Attempts to move one tile in the currently facing direction.
   * If the new position is obstructed by a wall the old position is returned.
   */
  const move = (position, facing, map) => {
    let newPosition = add(position, directions[facing].value);
    let destinationTile = getTile(map, newPosition);
    if (outOfBounds(newPosition, map) || isVoid(destinationTile)) {
      newPosition = wrapAround(newPosition, facing, map);
      destinationTile = getTile(map, newPosition);
    }
    return !isWall(destinationTile) ? newPosition : position;
  };

  /**
   * Attempts to move one tile in the currently facing direction up to x times.
   * If a new position is obstructed by a wall the old position is returned.
   */
  const moveNTimes = ({ position, facing }, times, map) => {
    let currentPosition = position;
    // eslint-disable-next-line consistent-return
    repeat(() => {
      const newPosition = move(currentPosition, facing, map);
      if (equals(newPosition, currentPosition)) {
        return false;
      }
      currentPosition = newPosition;
    }, times);
    return currentPosition;
  };

  /**
   * Follow the each instruction in the path and return the resulting position and facing
   */
  const followPath = (state, path, map) =>
    path.reduce((currentState, instruction) => {
      if (instruction === 'R' || instruction === 'L') {
        return { ...currentState, facing: rotate(currentState.facing, instruction) };
      }
      return {
        ...currentState,
        position: moveNTimes(currentState, instruction, map),
      };
    }, state);

  return ({ lines }) => {
    const { map, path } = parseInput(lines);
    const initialState = {
      position: new Vector2(findStartX(map.data), 0),
      facing: directionIndexes.right,
    };
    return finalPassword(followPath(initialState, path, map));
  };
})();

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelTwo = (() => {
  const cubeSize = 50;
  const relative = (value) => value % cubeSize;
  const faces = [
    // face 1 (index 0)
    {
      left: cubeSize,
      right: cubeSize * 2,
      top: 0,
      bottom: cubeSize,
      wrapping: [
        // right - connected to right of face 6
        ({ position: { y } }) => ({
          facing: directionIndexes.left,
          position: new Vector2(faces[5].right, faces[5].bottom - relative(y)),
        }),
        // down - connected to top of face 4
        ({ position: { x } }) => ({
          facing: directionIndexes.down,
          position: new Vector2(x, faces[3].top),
        }),
        // left - connected to top of face 3
        ({ position: { y } }) => ({
          facing: directionIndexes.down,
          position: new Vector2(relative(y) + faces[2].left, faces[2].top),
        }),
        // up - connected to top of face 2
        ({ position: { x } }) => ({
          facing: directionIndexes.down,
          position: new Vector2(relative(x) + faces[1].left, faces[1].top),
        }),
      ],
    },
    // face 2 (index 1)
    {
      left: 0,
      right: 3,
      top: 4,
      bottom: 7,
    },
    // face 3 (index 2)
    {
      left: 4,
      right: 7,
      top: 4,
      bottom: 7,
    },
    // face 4 (index 3)
    {
      left: 8,
      right: 11,
      top: 4,
      bottom: 7,
    },
    // face 5 (index 4)
    {
      left: 8,
      right: 11,
      top: 8,
      bottom: 11,
    },
    // face 6 (index 5)
    {
      left: 12,
      right: 15,
      top: 8,
      bottom: 11,
    },
  ];

  const getFace = ({ position: { x, y }, facing }) =>
    faces.find(
      ({ left: l, right: r, top: t, bottom: b }) =>
        (facing === directionIndexes.up && y === t && inRangeInclusive(x, l, r)) ||
        (facing === directionIndexes.right && x === r && inRangeInclusive(y, t, b)) ||
        (facing === directionIndexes.down && y === b && inRangeInclusive(x, l, r)) ||
        (facing === directionIndexes.left && x === l && inRangeInclusive(y, t, b))
    );

  /**
   * Attempts to move one tile in the currently facing direction.
   * If the new position is occupied by a wall the old position is returned.
   */
  const move = (state, map) => {
    const wrappingFace = getFace(state);
    const newState = wrappingFace
      ? wrappingFace.wrapping[state.facing](state)
      : { ...state, position: add(state.position, directions[state.facing].value) };
    const destinationTile = getTile(map, newState.position);
    return !isWall(destinationTile) ? newState : state;
  };

  /**
   * Attempts to move one tile in the currently facing direction up to x times.
   * If a new position is obstructed by a wall the old position is returned.
   */
  const moveNTimes = (state, times, map) => {
    const toReturn = [];
    let currentState = state;
    // eslint-disable-next-line consistent-return
    repeat(() => {
      const newState = move(currentState, map);
      if (currentState === newState) {
        return false;
      }
      currentState = newState;
      toReturn.push(currentState);
    }, times);
    return toReturn;
  };

  /**
   * Follow the each instruction in the path and returns the resulting position and facing
   */
  const followPath = (state, path, map) =>
    path.reduce((history, instruction) => {
      const currentState = history[history.length - 1] || state;
      switch (instruction) {
        case 'L':
        case 'R':
          history.push({
            ...currentState,
            facing: rotate(currentState.facing, instruction),
          });
          break;
        default:
          history.push(...moveNTimes(currentState, instruction, map));
          break;
      }
      return history;
    }, []);

  return ({ lines }) => {
    const { map, path } = parseInput(lines);
    const initialState = {
      position: new Vector2(faces[0].left, faces[0].top),
      facing: directionIndexes.right,
    };
    const history = [initialState, faces[0].wrapping[0](initialState)];
    render(map, history);
    return 1234;

    // const { map, path } = parseInput(lines);
    // const initialState = {
    //   position: new Vector2(findStartX(map.data), 0),
    //   facing: directionIndexes.right,
    // };
    // const history = followPath(initialState, path, map);
    // console.log();
    // render(map, history);
    // return 1234;
  };
})();
